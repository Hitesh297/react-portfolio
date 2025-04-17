import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDeleteBlog.css";

const AdminDeleteBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [token, setToken] = useState(null);

 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthorized(true);
      setToken(token);
    }
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`https://hteshpatel-dev-blog-api-4baa7ed6c2cf.herokuapp.com/api/blogs`);
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch blogs.");
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`https://hteshpatel-dev-blog-api-4baa7ed6c2cf.herokuapp.com/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogs(blogs.filter((blog) => blog.id !== id));
        setSuccess("Blog deleted successfully!");
      } catch (err) {
        setError("Failed to delete blog.");
      }
    }
  };

  if (loading) {
    return <div className=".data-loader">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!isAuthorized) {
    return <div className="error">Unauthorized access.</div>;
  }

  return (
    <section className="admin-section">
      <h2 className="section-headings">Delete Blogs</h2>
      <div className="blog-list">
        {blogs.length === 0 ? (
          <p>No blogs available.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-content">
                {blog.content.substring(0, 100)}...
              </p>
              <p className="blog-meta">
                By {blog.author} |{" "}
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <button
                className="delete-button"
                onClick={() => handleDelete(blog.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
        {success && <div className="success">{success}</div>}
      </div>
    </section>
  );
};

export default AdminDeleteBlog;
