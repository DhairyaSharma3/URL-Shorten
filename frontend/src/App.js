import './App.css';
import Navbar from './Navbar/Navbar';
import Login from './Login/Login';
import ShortenUrl from './ShortenUrl/ShortenUrl';
import UrlTable from './UrlTable/UrlTable';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/shorten-url" element={<ShortenUrl />} />
          <Route path="/table-url" element={<UrlTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
