import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Blog {
  _id?: string;
  title: string;
  content: string;
  isDraft: boolean;
}

export default function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog>({
    title: '',
    content: '',
    isDraft: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${id}`);
      const data = await response.json();
      setBlog(data);
    } catch (error) {
      toast.error('Failed to fetch blog');
      navigate('/');
    }
  };

  const saveBlog = async (publish: boolean = false) => {
    setSaving(true);
    try {
      const method = blog._id ? 'PUT' : 'POST';
      const url = blog._id ? `/api/blogs/${blog._id}` : '/api/blogs';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...blog,
          isDraft: !publish
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save blog');
      }

      toast.success(publish ? 'Blog published successfully' : 'Draft saved successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handleAutoSave = async () => {
    if (!blog.title || !blog.content) return;
    await saveBlog();
  };

  useEffect(() => {
    const timeoutId = setTimeout(handleAutoSave, 5000);
    return () => clearTimeout(timeoutId);
  }, [blog.title, blog.content]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <input
        type="text"
        placeholder="Blog Title"
        value={blog.title}
        onChange={(e) => setBlog({ ...blog, title: e.target.value })}
        className="w-full px-4 py-2 text-2xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        value={blog.content}
        onEditorChange={(content) => setBlog({ ...blog, content })}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        }}
      />

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => saveBlog(false)}
          disabled={saving}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Save Draft
        </button>
        <button
          onClick={() => saveBlog(true)}
          disabled={saving}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Publish
        </button>
      </div>
    </div>
  );
}