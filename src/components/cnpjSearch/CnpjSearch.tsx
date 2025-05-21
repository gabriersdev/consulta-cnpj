import React from "react";
import { useState } from "react";
import axios from "axios";
import moment from "moment";

const API_KEY = import.meta.env.VITE_IV_API_KEY;

function verifyCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho += 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1));
}

export default function CnpjSearch() {
  const [cnpj, setCnpj] = useState("70.972.302/0001-07");
  const [erro, setErro] = useState("");
  const [dados, setDados] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  const buscarCnpj = async (e) => {
    e.preventDefault();

    setErro("");
    setDados(null);

    const cnpjLimpo = cnpj.replace(/[^\d]+/g, "");

    if (!verifyCNPJ(cnpjLimpo)) {
      setErro("CNPJ inválido.");
      return;
    }

    console.log(cnpjLimpo);
    setCarregando(true);

    try {
      console.log("axios!");
      const resposta = await axios.get(`https://api.invertexto.com/v1/cnpj/${cnpjLimpo}?token=${API_KEY}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })

      const resultado = resposta.data;
      console.log(resultado);

      if (resultado.error) {
        setErro(resultado.message || "Erro ao buscar dados.");
      } else {
        setDados(resultado);
      }
    } catch (e) {
      setErro("Erro ao conectar com a API.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="min-h-screen py-10 bg-gray-100 flex items-center justify-center p-4 ">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Consulta de CNPJ</h1>

        <form method={"POST"} action={"#"} className="flex gap-2 mb-4">
          <input
            type="text"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            placeholder="Digite o CNPJ"
            className="flex-1 px-4 py-2 focus-headless border rounded focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={buscarCnpj}
            type={"submit"}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Consultar
          </button>
        </form>

        {erro && <p className="text-red-600 mb-4">{erro}</p>}
        {carregando && <p className="text-gray-600">Consultando...</p>}

        {dados && (
          <div className="mt-4 space-y-2 [&_strong]:block">
            <p><strong>Razão Social:</strong> {dados.razao_social || "-"}</p>
            <p><strong>Nome Fantasia:</strong> {dados.nome_fantasia || "Não informado"}</p>
            <p><strong>É MEI?</strong> {dados.mei?.optante_mei.replace(/N/, "Não").replace(/S/, "Sim") || "Não informado"}</p>
            <p><strong>Situação:</strong> {dados.situacao?.nome || "-"}</p>
            <p><strong>Data de Abertura:</strong> {moment(dados.data_inicio + "T00:00:00-03:00").format("DD/MM/YYYY")}</p>
            <p><strong>Natureza Jurídica:</strong> {dados.natureza_juridica || "-"}</p>
            <p><strong>Atividade Principal:</strong> {dados.atividade_principal?.descricao || "-"}</p>
            <p><strong>Estado:</strong> {dados.endereco?.uf || "-"}</p>
            <p><strong>Cidade:</strong> {dados.endereco?.municipio || "-"}</p>
            <p><strong>Sócios:</strong> {dados.socios.length > 0 ? dados.socios.map(s => s).join(", ") : "Não informado"}</p>
          </div>
        )}
      </div>
    </main>
  );
}
