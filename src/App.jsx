import {BrowserRouter, Routes, Route} from 'react-router-dom';
import CnpjSearch from "./components/cnpjSearch/CnpjSearch.js";

const Main = () => {
  return (
    <>
      <CnpjSearch/>
    </>
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