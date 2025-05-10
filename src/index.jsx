import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import WagerLayout from './pages/WagerLayout';
import './styles/layout.css'


function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="container">
      {!isHomePage && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wager/:id" element={<WagerLayout />} />
        </Routes>
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
}

function Index() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default Index
