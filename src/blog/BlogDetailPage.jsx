import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './BlogDetailPage.css';

const BlogDetailPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [parsedContent, setParsedContent] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BLOG_API_BASE_URL}/blogs/${id}`);
                const blogData = response.data;
                
                // Parse the content if it's a string
                if (typeof blogData.content === 'string') {
                    try {
                        blogData.content = JSON.parse(blogData.content);
                    } catch (parseError) {
                        console.error('Error parsing blog content:', parseError);
                        throw new Error('Invalid blog content format');
                    }
                }
                
                setBlog(blogData);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.detail || err.message || 'Failed to fetch blog post.');
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    if (loading) return <div className="data-loader">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!blog) return <div className="error">Blog post not found.</div>;

    const renderTextWithMarks = (textNode, key) => {
        let textElement = textNode.text;
        
        if (textNode.marks) {
            textNode.marks.forEach(mark => {
                switch (mark.type) {
                    case 'bold':
                        textElement = <strong key={key}>{textElement}</strong>;
                        break;
                    case 'italic':
                        textElement = <em key={key}>{textElement}</em>;
                        break;
                    // Add more mark types as needed
                    default:
                        break;
                }
            });
        }
        
        return textElement;
    };

    const renderContent = (node, key) => {
        if (!node) return null;

        switch (node.type) {
            case 'paragraph':
                return (
                    <p key={key}>
                        {node.content?.map((child, i) => renderContent(child, `${key}-${i}`))}
                    </p>
                );

            case 'text':
                return renderTextWithMarks(node, key);

            case 'heading':
                const level = node.attrs?.level || 1;
                const HeadingTag = `h${level}`;
                return (
                    <HeadingTag key={key}>
                        {node.content?.map((child, i) => renderContent(child, `${key}-${i}`))}
                    </HeadingTag>
                );

            case 'codeBlock':
                return (
                    <SyntaxHighlighter
                        key={key}
                        style={dracula}
                        language={node.attrs?.language || 'text'}
                        PreTag="div"
                    >
                        {(node.content?.[0]?.text || '')}
                    </SyntaxHighlighter>
                );

            case 'bulletList':
                return (
                    <ul key={key}>
                        {node.content?.map((listItem, i) => renderContent(listItem, `${key}-${i}`))}
                    </ul>
                );

            case 'orderedList':
                return (
                    <ol key={key} start={node.attrs?.start || 1}>
                        {node.content?.map((listItem, i) => renderContent(listItem, `${key}-${i}`))}
                    </ol>
                );

            case 'listItem':
                return (
                    <li key={key}>
                        {node.content?.map((child, i) => renderContent(child, `${key}-${i}`))}
                    </li>
                );

            default:
                console.warn(`Unhandled node type: ${node.type}`);
                return null;
        }
    };

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
                {blog.content?.content && Array.isArray(blog.content.content)
                    ? blog.content.content.map((node, index) => renderContent(node, `node-${index}`))
                    : <p>Invalid blog content format.</p>}
            </section>
            <footer>
                <Link to="/blogs" className="back-link">Back to Blogs</Link>
            </footer>
        </article>
    );
};

export default BlogDetailPage;