import React from "react";
import PortfolioApp from "./portfolio/PortfolioApp";
import WeddingApp from './Wedding/WeddingApp';
import BlogApp from "./blog/BlogApp";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioApp />} />
        <Route path="/blog" element={<BlogApp />} />
        <Route path="/wedding" element={<WeddingApp />} />
      </Routes>
    </Router>
   
  );
}

export default App;
