import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TelaLogin } from './telas/TelaLogin/TelaLogin';
import { TelaCheckout } from './telas/TelaCheckout/TelaCheckout';
import { TelaCriarConta } from './telas/TelaCriarConta/TelaCriarConta';
import { TelaConfiguracao } from './telas/TelaConfiguracao/TelaConfiguracao';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/checkout" element={<TelaCheckout />} />
        <Route path="/register" element={<TelaCriarConta />} />
        <Route path="/settings" element={<TelaConfiguracao />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
