import React, {useEffect} from "react";
import {useState} from "react";
import {Button} from '@headlessui/react'

import axios from "axios";
import moment from "moment";
import $ from "jquery";
import 'jquery-mask-plugin';

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
  const [cnpj, setCnpj] = useState("");
  const [erro, setErro] = useState("");
  const [dados, setDados] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  $(() => {
    $('#cnpj').mask('00.000.000/0000-00');
  })

  const handleCNPJ = (value: string) => {
    setCnpj(value);
    if (!verifyCNPJ(value)) setErro("O CNPJ não está certo. Verifique...");
    else setErro("");
  }

  const buscarCnpj = async (e) => {
    e.preventDefault();

    setErro("");
    setDados(null);

    const cnpjLimpo = cnpj.replace(/[^\d]+/g, "");

    if (!verifyCNPJ(cnpjLimpo)) {
      setErro("CNPJ inválido.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await axios.get(`https://api.invertexto.com/v1/cnpj/${cnpjLimpo}?token=${API_KEY}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })

      const resultado = resposta.data;
      // console.log(resultado);

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
    <div className="bg-white min-h-[70vh] shadow-lg rounded-lg p-6 w-full max-w-lg">
      <h1 className="text-[1.75rem] text-slate-700 font-semibold mb-8 text-center">Consulta de CNPJ</h1>
      <form method={"POST"} action={"#"} className="flex gap-2 mb-2">
        <input
          type="text"
          autoFocus={true}
          id={"cnpj"}
          value={cnpj}
          onChange={(e) => handleCNPJ(e.target.value)}
          placeholder="Digite o CNPJ"
          className="block w-full rounded-lg border focus-headless bg-white/5 px-3 py-1.5 text-slate-800 focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
        />
        <Button onClick={buscarCnpj} type={"submit"} className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5  text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700">
          Consultar
        </Button>
      </form>

      {erro && <p className="text-red-600 mb-4">{erro}</p>}
      {carregando && <p className="text-gray-600 mt-1">Consultando...</p>}

      {dados && (
        <div className="mt-4 space-y-2 [&_strong]:block"><br/>
          {[
            {label: "Razão Social", value: dados.razao_social || "-"},
            {label: "Nome Fantasia", value: dados.nome_fantasia || "Não informado"},
            {label: "É MEI?", value: dados.mei?.optante_mei ? dados.mei.optante_mei === "S" ? "Sim" : "Não" : "Não informado"},
            {label: "Porte", value: dados.porte || "-"},
            {label: "Situação", value: dados.situacao?.nome || "-"},
            {label: "Optante pelo simples?", value: dados.simples?.optante_simples ? dados.simples.optante_simples === "S" ? "Sim" : "Não" + (dados.simples?.data_exclusao ? ". Empresa excluída do Simples em " + moment(`${dados.simples.data_exclusao}T00:00:00`).format("DD/MM/YYYY") : "") : "Não informado"},
            {label: "Data de Abertura", value: dados.data_inicio ? moment(dados.data_inicio + "T00:00:00-03:00").format("DD/MM/YYYY") : "-"},
            {label: "Natureza Jurídica", value: dados.natureza_juridica || "-"},
            {label: "Atividade Principal", value: dados.atividade_principal?.descricao || "-"},
            {label: "Estado", value: dados.endereco?.uf || "-"},
            {label: "Cidade", value: dados.endereco?.municipio || "-"},
            {label: "Sócios", value: dados.socios?.length > 0 ? dados.socios.map(s => Object.values(s).join(" - ")).join(", ") : "Não informado"},
            {label: "Capital social", value: dados.capital_social ? new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 3}).format(dados.capital_social) : "-"}
          ].map(({label, value}) => (
            <p key={label}>
              <strong>{label}:</strong> {value}
            </p>
          ))}

          {
            !dados && (
              <div className="mt-4 space-y-2 p-3 bg-red-200 border border-red-300 text-red-900 rounded text-center text-balance">
                Nenhum dado correspondente ao CNPJ {cnpj} foi encontrado.
              </div>
            )
          }

          <br/>
          <div>
            <details className={"mt-2"}>
              <summary><span className={"font-semibold text-blue-700"}>Ver todos os dados retornados pela API</span></summary>
              <pre className={"text-wrap"}>
                {JSON.stringify(dados, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
