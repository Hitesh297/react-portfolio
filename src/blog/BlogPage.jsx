import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BlogPage.css';

// Function to convert markdown to plain text snippet
const getSnippet = (markdown) => {
    if (!markdown) return '';
    // Remove code blocks (```lang\ncode\n```), keep code content
    let text = markdown.replace(/```[a-z]*\n([\s\S]*?)\n```/g, '$1');
    // Remove headings (#, ##, etc.)
    text = text.replace(/#{1,6}\s*(.*?)\n/g, '$1 ');
    // Remove lists (-, 1., etc.)
    text = text.replace(/[-*]\s*(.*?)\n/g, '$1 ');
    text = text.replace(/\d+\.\s*(.*?)\n/g, '$1 ');
    // Remove extra newlines, trim
    text = text.replace(/\n+/g, ' ').trim();
    // Truncate to 150 chars, avoid cutting words
    if (text.length > 150) {
        text = text.slice(0, 150);
        const lastSpace = text.lastIndexOf(' ');
        if (lastSpace > 100) text = text.slice(0, lastSpace);
        text += '...';
    }
    return text;
};

const BlogPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BLOG_API_BASE_URL}/blogs`);
                setBlogs(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.detail || 'Failed to fetch blogs.');
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) {
        return <div className="data-loader">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <>
        <section className="blog-section">
            <h2 className="section-headings">Blogs</h2>
            <div className="blog-list">
                {blogs.length === 0 ? (
                    <p>No blogs available.</p>
                ) : (
                    blogs.map(blog => (
                        <Link to={`/blogs/${blog.id}`} key={blog.id} className="blog-card">
                            <div className="blog-image-container">
                                <img
                                    src={blog.imageUrl || 'https://learn.microsoft.com/training/achievements/get-started-c-sharp-part-1-social.png'}
                                    alt={blog.title}
                                    className="blog-image"
                                />
                            </div>
                            <div className="blog-details">
                                <h3 className="blog-title">{blog.title}</h3>
                                <p className="blog-snippet">
                                    {getSnippet(blog.content)}
                                </p>
                                <p className="blog-meta">
                                    By {blog.author} | {new Date(blog.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </section>
        </>
    );
};

export default BlogPage;