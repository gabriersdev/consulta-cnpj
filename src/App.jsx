import {BrowserRouter, Routes, Route} from 'react-router-dom';
import CnpjSearch from "./components/cnpjSearch/CnpjSearch.js";

const Main = () => {
  return (
    <main className="min-h-screen py-10 bg-gray-100 flex items-center justify-center p-4">
      <CnpjSearch/>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes index element={<Main/>}>
        <Route path="/consulta-cnpj/" element={<Main/>}/>
      </Routes>
    </BrowserRouter>
  )
}