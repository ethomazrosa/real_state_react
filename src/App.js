import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Home from './components/Home';
import Login from './components/Login';
import Listings from './components/Listings';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='login/' element={<Login />} />
        <Route path='listings/' element={<Listings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
