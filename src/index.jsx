import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import './styles/layout.css'


function Index() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <main className="">
          <Routes>
            <Route path="/" element={<Home />} />
            {/*<Route path="/:id" element={<Duel />} />*/}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default Index
