
import PortfolioApp from "./portfolio/PortfolioApp";
import WeddingApp from './Wedding/WeddingApp';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllImages from "./Wedding/components/AllImages";
import BlogPage from "./blog/BlogPage";
import AdminAddBlog from "./blog/AdminAddBlog";
import AdminDeleteBlog from "./blog/AdminDeleteBlog";
import Login from "./blog/Login";
import BlogDetailPage from "./blog/BlogDetailPage";


function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioApp />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogs/:id" element={<BlogDetailPage />} />
        <Route path="/add-blog" element={<AdminAddBlog />} />
        <Route path="/delete-blog" element={<AdminDeleteBlog />} />
        <Route path="/wedding" element={<WeddingApp />} />
        <Route path="/all-images" element={<AllImages />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
