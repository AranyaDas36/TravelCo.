"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { format } from "date-fns"

const BlogPage = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isAdmin, setIsAdmin] = useState(false);


  // Watch for token changes to update `isLoggedIn` state
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decoding JWT token
        console.log("Decoded Token:", decoded); // Add this to debug
        setIsAdmin(decoded.role === 'admin');
      }
    };
    window.addEventListener("storage", checkLoginStatus);
    checkLoginStatus(); // Ensure the check runs on component mount
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);
  
  

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("http://localhost:5001/api/blogs")
      setBlogs(response.data.blogs)
      setError("")
    } catch (error) {
      console.error("Error fetching blogs:", error)
      setError("Failed to fetch blogs. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBlog = async (e) => {
    e.preventDefault()

    // if (!isLoggedIn) {
    //   alert("Please log in to create a blog.")
    //   return;
    // }

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://localhost:5001/api/blogs",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setBlogs([response.data, ...blogs])
      setTitle("")
      setContent("")
      setSuccessMessage("Blog post created successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Error creating blog:", error)
      setError("Failed to create blog. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (error) {
      return "Unknown date"
    }
  }

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setBlogs(blogs.filter((blog) => blog._id !== id));
      setSuccessMessage("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError("Failed to delete blog. Please try again.");
    }
  };
  

  return (
    <div className="bg-gradient-to-b from-white-100 to-slate-200 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Blog Posts</span>
          <p className="text-gray-600 mt-2 text-sm">Share your thoughts and read what others have to say</p>

        </h1>

        {/* Blog creation form for logged-in users */}
        
          <div className="mb-10 bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create a New Post</h2>

            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateBlog}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your blog title"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here..."
                  className="w-full p-3 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                }`}
              >
                {isSubmitting ? "Publishing..." : "Publish Blog Post"}
              </button>
            </form>
          </div>
        

        {/* Blog posts list */}
        <div className="space-y-8 py-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Posts</h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-600">No blog posts available yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-1">
              {blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{blog.title}</h3>

                    <div className="flex items-center mb-4 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{blog.user?.name || "Anonymous"}</span>
                      <span className="mx-2">•</span>
                      <span>{blog.createdAt ? formatDate(blog.createdAt) : "Recently"}</span>
                    </div>

                    <div className="prose max-w-none">
                      <p className="text-gray-600 whitespace-pre-line">{blog.content}</p>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}

                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogPage

