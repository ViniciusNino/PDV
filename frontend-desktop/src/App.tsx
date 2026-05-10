import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TelaLogin } from './telas/TelaLogin/TelaLogin';
import { TelaCheckout } from './telas/TelaCheckout/TelaCheckout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/checkout" element={<TelaCheckout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
