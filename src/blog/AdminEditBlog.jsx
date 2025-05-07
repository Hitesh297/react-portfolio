import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './AdminAddBlog.css'; // Reuse same styles

const toMarkdown = (json) => {
    let markdown = '';
    json.content?.forEach(node => {
        if (node.type === 'paragraph') {
            node.content?.forEach(text => { markdown += text.text || ''; });
            markdown += '\n\n';
        } else if (node.type === 'heading') {
            const prefix = '#'.repeat(node.attrs.level) + ' ';
            node.content?.forEach(text => { markdown += prefix + (text.text || '') + '\n\n'; });
        } else if (node.type === 'codeBlock') {
            markdown += '```' + (node.attrs.language || 'text') + '\n';
            node.content?.forEach(text => { markdown += (text.text || '') + '\n'; });
            markdown += '```\n\n';
        } else if (node.type === 'bulletList') {
            node.content?.forEach(listItem => {
                listItem.content?.forEach(item => {
                    item.content?.forEach(text => { markdown += '- ' + (text.text || '') + '\n'; });
                });
            });
            markdown += '\n';
        } else if (node.type === 'orderedList') {
            node.content?.forEach((listItem, index) => {
                listItem.content?.forEach(item => {
                    item.content?.forEach(text => { markdown += `${index + 1}. ` + (text.text || '') + '\n'; });
                });
            });
            markdown += '\n';
        }
    });
    return markdown.trim();
};

const AdminEditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: '',
        imageUrl: ''
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit, CodeBlock.configure({ HTMLAttributes: { class: 'code-block' } })],
        content: '',
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            const markdown = toMarkdown(json);
            setFormData(prev => ({ ...prev, content: markdown }));
        }
    });

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BLOG_API_BASE_URL}/blogs/${id}`);
                const { title, author, content, imageUrl } = res.data;
                setFormData({ title, author, content, imageUrl });
                editor?.commands.setContent(content); // Assuming content is stored as markdown
            } catch (err) {
                setError('Failed to fetch blog data.');
            }
        };
        if (editor) fetchBlog();
    }, [editor, id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await axios.put(
                `${import.meta.env.VITE_BLOG_API_BASE_URL}/blogs/${id}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setSuccess('Blog updated successfully!');
            setError(null);
            navigate(`/blogs/${id}`);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update blog.');
            setSuccess(null);
        } finally {
            setFormLoading(false);
        }
    };

    if (!token) {
        return <div className="error">Unauthorized access. Please log in.</div>;
    }

    return (
        <section className="admin-add-blog-section">
            <h2 className="section-headings">Edit Blog</h2>
            <form onSubmit={handleSubmit} className="add-blog-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL (optional)</label>
                    <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <div className="tiptap-editor">
                        <div className="tiptap-toolbar">
                            {/* same toolbar buttons */}
                            <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={editor?.isActive('heading', { level: 1 }) ? 'active' : ''}>H1</button>
                            <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'active' : ''}>H2</button>
                            <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'active' : ''}>Bold</button>
                            <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'active' : ''}>Italic</button>
                            <button type="button" onClick={() => editor?.chain().focus().toggleCodeBlock().run()} className={editor?.isActive('codeBlock') ? 'active' : ''}>Code Block</button>
                            <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'active' : ''}>Bullet List</button>
                            <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'active' : ''}>Ordered List</button>
                        </div>
                        <EditorContent editor={editor} />
                    </div>
                </div>
                <div className="markdown-preview">
                    <h3>Preview</h3>
                    <ReactMarkdown
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter style={dracula} language={match[1]} PreTag="div" {...props}>
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>{children}</code>
                                );
                            }
                        }}
                    >
                        {formData.content}
                    </ReactMarkdown>
                </div>
                <button type="submit" className="styled-button" disabled={formLoading}>
                    {formLoading ? 'Updating...' : 'Update Blog'}
                </button>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
            </form>
        </section>
    );
};

export default AdminEditBlog;
