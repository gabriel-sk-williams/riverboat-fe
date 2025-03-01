// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClusterProvider } from './components/cluster/cluster-data-access';
import { SolanaProvider } from './components/solana/solana-provider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import './styles/layout.css'


function Index() {
  return (
    <ClusterProvider>
      <SolanaProvider>
        <Router>
          <div className="container">
            <Navbar />
            <main className="">
              <Routes>
                <Route path="/" element={<Home />} />
                {/*<Route path="/:id" element={<BlogPost />} />*/}
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SolanaProvider>
    </ClusterProvider>
  )
}

export default Index
