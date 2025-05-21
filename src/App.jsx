import {BrowserRouter, Routes, Route} from 'react-router-dom';

const Main = () => {
  return <></>;
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