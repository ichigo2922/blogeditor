import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          placeholder="Blog Title"
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          className="w-full px-4 py-2 text-2xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-lg"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <Editor
          apiKey="p5zrnu328u1b17v5luxmp39ococvf0sd91f9yg6xmzav0jbk"
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
            skin: 'oxide',
            content_css: 'default',
          }}
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end space-x-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => saveBlog(false)}
          disabled={saving}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-1"
        >
          Save Draft
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => saveBlog(true)}
          disabled={saving}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:-translate-y-1"
        >
          Publish
        </motion.button>
      </motion.div>
    </motion.div>
  );
}