import React, { useState } from 'react';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './AdminAddBlog.css';
import { useNavigate } from 'react-router-dom';

// Function to convert TipTap JSON to markdown
const toMarkdown = (json) => {
    let markdown = '';
    json.content.forEach(node => {
        if (node.type === 'paragraph') {
            if (node.content) {
                node.content.forEach(text => {
                    markdown += text.text || '';
                });
                markdown += '\n\n';
            } else {
                markdown += '\n';
            }
        } else if (node.type === 'heading') {
            const level = node.attrs.level;
            const prefix = '#'.repeat(level) + ' ';
            if (node.content) {
                node.content.forEach(text => {
                    markdown += prefix + (text.text || '') + '\n\n';
                });
            }
        } else if (node.type === 'codeBlock') {
            const language = node.attrs.language || 'text';
            markdown += '```' + language + '\n';
            if (node.content) {
                node.content.forEach(text => {
                    markdown += (text.text || '') + '\n';
                });
            }
            markdown += '```\n\n';
        } else if (node.type === 'bulletList') {
            if (node.content) {
                node.content.forEach(listItem => {
                    if (listItem.content) {
                        listItem.content.forEach(item => {
                            if (item.content) {
                                item.content.forEach(text => {
                                    markdown += '- ' + (text.text || '') + '\n';
                                });
                            }
                        });
                    }
                });
                markdown += '\n';
            }
        } else if (node.type === 'orderedList') {
            if (node.content) {
                node.content.forEach((listItem, index) => {
                    if (listItem.content) {
                        listItem.content.forEach(item => {
                            if (item.content) {
                                item.content.forEach(text => {
                                    markdown += `${index + 1}. ` + (text.text || '') + '\n';
                                });
                            }
                        });
                    }
                });
                markdown += '\n';
            }
        }
    });
    return markdown.trim();
};

const AdminAddBlog = () => {
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
    const navigate = useNavigate();

    const editor = useEditor({
        extensions: [
            StarterKit,
            CodeBlock.configure({
                HTMLAttributes: {
                    class: 'code-block'
                }
            })
        ],
        content: '',
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            const markdown = toMarkdown(json);
            setFormData(prev => ({ ...prev, content: markdown }));
        }
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError('You must be logged in to add a blog.');
            return;
        }

        setFormLoading(true);
        try {
            const response = await axios.post(
                `https://hteshpatel-dev-blog-api-4baa7ed6c2cf.herokuapp.com/api/blogs`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setSuccess('Blog added successfully!');
            setFormData({ title: '', content: '', author: '', imageUrl: '' });
            editor?.commands.clearContent();
            setError(null);
            navigate(`/blogs/${response.data.id}`, { replace: false });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to add blog.');
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
            <h2 className="section-headings">Add New Blog</h2>
            <form onSubmit={handleSubmit} className="add-blog-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter blog title"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter author name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL (optional)</label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <div className="tiptap-editor">
                        <div className="tiptap-toolbar">
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                                className={editor?.isActive('heading', { level: 1 }) ? 'active' : ''}
                            >
                                H1
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={editor?.isActive('heading', { level: 2 }) ? 'active' : ''}
                            >
                                H2
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                className={editor?.isActive('bold') ? 'active' : ''}
                            >
                                Bold
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                className={editor?.isActive('italic') ? 'active' : ''}
                            >
                                Italic
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                                className={editor?.isActive('codeBlock') ? 'active' : ''}
                            >
                                Code Block
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                className={editor?.isActive('bulletList') ? 'active' : ''}
                            >
                                Bullet List
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                className={editor?.isActive('orderedList') ? 'active' : ''}
                            >
                                Ordered List
                            </button>
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
                        {formData.content}
                    </ReactMarkdown>
                </div>
                <button type="submit" className="submit-button" disabled={formLoading}>
                    {formLoading ? 'Submitting...' : 'Add Blog'}
                </button>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
            </form>
        </section>
    );
};

export default AdminAddBlog;