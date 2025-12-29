
import PortfolioApp from "./portfolio/PortfolioApp";
import WeddingApp from './Wedding/WeddingApp';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllImages from "./Wedding/components/AllImages";
import BlogPage from "./blog/BlogPage";
import AdminAddBlog from "./blog/AdminAddBlog";
import AdminDeleteBlog from "./blog/AdminDeleteBlog";
import Login from "./blog/Login";
import BlogDetailPage from "./blog/BlogDetailPage";
import { LayoutWithNavbar } from "./portfolio/Header";
import AdminDashboard from "./admin/pages/AdminDashboard";
import SkillsListPage from "./admin/skills/pages/SkillsListPage";
import SkillUpsertPage from "./admin/skills/pages/SkillUpsertPage";
import AdminShell from "./admin/pages/AdminShell";

function App() {


  return (
    <Router>
      <Routes>
        {/* Routes with Navbar */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/" element={<PortfolioApp />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          <Route path="/add-blog" element={<AdminAddBlog />} />
          <Route path="/delete-blog" element={<AdminDeleteBlog />} />
          <Route path="/all-images" element={<AllImages />} />
          <Route path="/login" element={<Login />} />

          {/* ADMIN group */}
          <Route path="admin" element={<AdminShell />}>
            <Route index element={<AdminDashboard />} />      {/* /admin */}
            <Route path="skills" element={<SkillsListPage />} />  {/* /admin/skills */}
            <Route path="skills/new" element={<SkillUpsertPage />} />
            <Route path="skills/:id/edit" element={<SkillUpsertPage />} />
          </Route>
        </Route>
        {/* Route without Navbar */}
        <Route path="/wedding" element={<WeddingApp />} />
      </Routes>
    </Router>

  )
}

export default App
