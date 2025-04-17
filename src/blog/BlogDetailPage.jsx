import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './BlogDetailPage.css';

const BlogDetailPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`https://hteshpatel-dev-blog-api-4baa7ed6c2cf.herokuapp.com/api/blogs/${id}`);
                setBlog(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.detail || 'Failed to fetch blog post.');
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    if (loading) {
        return <div className=".data-loader">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!blog) {
        return <div className="error">Blog post not found.</div>;
    }

    return (
        <article className="blog-detail-article">
            <header>
                <h1 className="blog-detail-title">{blog.title}</h1>
                <div className="blog-detail-image-container">
                    <img
                        src={blog.imageUrl || 'https://learn.microsoft.com/training/achievements/get-started-c-sharp-part-1-social.png'}
                        alt={blog.title}
                        className="blog-image"
                    />
                </div>
                <p className="blog-meta">
                    By {blog.author} | {new Date(blog.createdAt).toLocaleDateString()}
                </p>
            </header>
            <section className="blog-content">
                <ReactMarkdown
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={dracula}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        }
                    }}
                >
                    {blog.content}
                </ReactMarkdown>
            </section>
            <footer>
                <Link to="/blogs" className="back-link">Back to Blogs</Link>
            </footer>
        </article>
    );
};

export default BlogDetailPage;