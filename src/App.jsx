
import PortfolioApp from "./portfolio/PortfolioApp";
import WeddingApp from './Wedding/WeddingApp';
import BlogApp from "./blog/BlogApp";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllImages from "./Wedding/components/AllImages";

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioApp />} />
        <Route path="/blog" element={<BlogApp />} />
        <Route path="/wedding" element={<WeddingApp />} />
        <Route path="/all-images" element={<AllImages />} />
      </Routes>
    </Router>
  )
}

export default App
