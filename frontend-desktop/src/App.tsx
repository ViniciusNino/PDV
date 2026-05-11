import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TelaLogin } from './telas/TelaLogin/TelaLogin';
import { TelaCheckout } from './telas/TelaCheckout/TelaCheckout';
import { TelaCriarConta } from './telas/TelaCriarConta/TelaCriarConta';
import { TelaConfiguracao } from './telas/TelaConfiguracao/TelaConfiguracao';
import { SetupLayout } from './telas/SetupLayout/SetupLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/checkout" element={<TelaCheckout />} />
        
        {/* Telas que usam o background de carregamento */}
        <Route element={<SetupLayout />}>
          <Route path="/setup" element={<TelaConfiguracao />} />
          <Route path="/settings" element={<TelaConfiguracao />} />
          <Route path="/register" element={<TelaCriarConta />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
