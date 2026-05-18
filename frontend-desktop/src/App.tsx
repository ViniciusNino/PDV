import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TelaLogin } from './telas/TelaLogin/TelaLogin';
import { TelaCheckout } from './telas/TelaCheckout/TelaCheckout';
import { TelaCriarConta } from './telas/TelaCriarConta/TelaCriarConta';
import { TelaAcesseConta } from './telas/TelaAcesseConta/TelaAcesseConta';
import { TelaConfiguracao } from './telas/TelaConfiguracao/TelaConfiguracao';
import { SetupLayout } from './telas/SetupLayout/SetupLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/checkout" element={<TelaCheckout />} />
        
        {/* Telas que abrem em modo janela própria com layout de Setup de fundo */}
        <Route element={<SetupLayout />}>
          <Route path="/setup" element={<TelaConfiguracao />} />
          <Route path="/settings" element={<TelaConfiguracao />} />
          <Route path="/account/register" element={<TelaCriarConta />} />
        </Route>
        
        <Route path="/account/login" element={<TelaAcesseConta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
