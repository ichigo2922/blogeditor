import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

interface Blog {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  isDraft: boolean;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      toast.error('Failed to fetch blogs');
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setBlogs(blogs.filter(blog => blog._id !== id));
        toast.success('Blog deleted successfully');
      } else {
        throw new Error('Failed to delete blog');
      }
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <div key={blog._id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-gray-500 text-sm">
                {new Date(blog.createdAt).toLocaleDateString()}
                {blog.isDraft && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Draft
                  </span>
                )}
              </p>
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/edit/${blog._id}`}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Edit"
              >
                <Edit size={20} />
              </Link>
              <button
                onClick={() => deleteBlog(blog._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 200) + '...' }} />
          <Link
            to={`/blog/${blog._id}`}
            className="inline-flex items-center mt-4 text-primary-600 hover:text-primary-700"
          >
            <Eye size={16} className="mr-1" /> Read more
          </Link>
        </div>
      ))}
    </div>
  );
}