import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import BlogList from './components/BlogList';
import BlogEditor from './components/BlogEditor';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">Blog Editor</Link>
            <Link 
              to="/new" 
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              New Blog
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/new" element={<BlogEditor />} />
          <Route path="/edit/:id" element={<BlogEditor />} />
        </Routes>
      </main>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App