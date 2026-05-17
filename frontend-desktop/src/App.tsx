import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TelaLogin } from './telas/TelaLogin/TelaLogin';
import { TelaCheckout } from './telas/TelaCheckout/TelaCheckout';
import { TelaCriarConta } from './telas/TelaCriarConta/TelaCriarConta';
import { TelaAcesseConta } from './telas/TelaAcesseConta/TelaAcesseConta';
import { TelaConfiguracao } from './telas/TelaConfiguracao/TelaConfiguracao';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/checkout" element={<TelaCheckout />} />
        
        {/* Telas que abrem em modo janela própria */}
        <Route path="/setup" element={<TelaConfiguracao />} />
        <Route path="/settings" element={<TelaConfiguracao />} />
        <Route path="/account/login" element={<TelaAcesseConta />} />
        <Route path="/account/register" element={<TelaCriarConta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
