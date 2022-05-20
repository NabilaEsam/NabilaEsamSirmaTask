import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter basename="/">
    <Routes>
      <Route exact path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
