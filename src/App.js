import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

// importamos componentes
import CompShowDuenos from './components/ShowDuenos';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<CompShowDuenos />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
