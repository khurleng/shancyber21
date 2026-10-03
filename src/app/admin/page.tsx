'use client';

import { useCallback, useEffect, useState } from 'react';
import { Container } from '@/components/Container';
import { SectionTitle } from '@/components/SectionTitle';
import { ImageUrlPreview } from '@/components/ImageUrlPreview';



type PostItem = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string[];
  image: string;
};

type ProductItem = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  image: string;
  link: string;
};

type PostFormState = {
  title: string;
  excerpt: string;
  content: string;
  image: string;
};

type ProductFormState = {
  title: string;
  description: string;
  buttonText: string;
  image: string;
  link: string;
};

const initialPostForm: PostFormState = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
};

const initialProductForm: ProductFormState = {
  title: '',
  description: '',
  buttonText: 'View',
  image: '',
  link: '',
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [postForm, setPostForm] = useState(initialPostForm);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });



  const adminFetch = useCallback(async (input: string, init?: RequestInit) => {
    try {
      const response = await fetch(input, init);
      if (response.status === 401 || response.status === 403) {
        setIsLoggedIn(false);
        setLoginError('Please sign in with an administrator account.');
      }
      return response;
    } catch {
      return new Response(JSON.stringify({ message: 'Connection failed. Please try again.' }), {
        status: 503, headers: { 'Content-Type': 'application/json' },
      });
    }
  }, []);

  const loadContent = useCallback(async () => {
    const [postResponse, productResponse] = await Promise.all([
      adminFetch('/api/posts'),
      adminFetch('/api/products'),
    ]);

    if (postResponse.ok) {
      const postData = await postResponse.json();
      setPosts(postData);
    }

    if (productResponse.ok) {
      const productData = await productResponse.json();
      setProducts(productData);
    }
  }, [adminFetch]);

  useEffect(() => {
    fetch('/api/admin/session', { cache: 'no-store' })
      .then(response => setIsLoggedIn(response.ok))
      .catch(() => setIsLoggedIn(false));
    loadContent();
  }, [loadContent]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await adminFetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });

    if (response.ok) {
      setPassword('');
      setIsLoggedIn(true);
      setLoginError('');
      setFeedback('Welcome back. You can manage content now.');
      await loadContent();
    } else {
      const data = await response.json().catch(() => ({}));
      setLoginError(data.message || 'Invalid email or password.');
    }
  };

  const handleLogout = async () => {
    const response = await adminFetch('/api/admin/logout', { method: 'POST' });
    setIsLoggedIn(false);
    setPassword('');
    setPostForm(initialPostForm);
    setProductForm(initialProductForm);
    setPasswordForm({ currentPassword: '', newPassword: '' });
    setFeedback(response.ok ? 'You have been logged out.' : 'Signed out of this screen. If your connection is offline, retry logout when it returns.');
  };

  const handleCreatePost = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback('');

    const response = await adminFetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...postForm,
        content: postForm.content
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
      }),
    });

    if (response.ok) {
      setFeedback('Blog post created successfully.');
      setPostForm(initialPostForm);
      await loadContent();
    } else {
      const data = await response.json().catch(() => ({}));
      setFeedback(data.message || 'Failed to create blog post.');
    }

    setIsSubmitting(false);
  };

  const handleUpdatePost = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingPostId) {
      return;
    }

    setIsSubmitting(true);
    const response = await adminFetch(`/api/posts/${encodeURIComponent(editingPostId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...postForm,
        content: postForm.content
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
      }),
    });

    if (response.ok) {
      setFeedback('Blog post updated successfully.');
      setEditingPostId(null);
      setPostForm(initialPostForm);
      await loadContent();
    } else {
      const data = await response.json().catch(() => ({}));
      setFeedback(data.message || 'Failed to update blog post.');
    }

    setIsSubmitting(false);
  };

  const handleDeletePost = async (id: string) => {
    const response = await adminFetch(`/api/posts/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setFeedback('Blog post deleted.');
      await loadContent();
    }
  };

  const handleCreateProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback('');

    const response = await adminFetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productForm),
    });

    if (response.ok) {
      setFeedback('Product added successfully.');
      setProductForm(initialProductForm);
      await loadContent();
    } else {
      const data = await response.json().catch(() => ({}));
      setFeedback(data.message || 'Failed to add product.');
    }

    setIsSubmitting(false);
  };

  const handleUpdateProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingProductId) {
      return;
    }

    setIsSubmitting(true);
    const response = await adminFetch(`/api/products/${encodeURIComponent(editingProductId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productForm),
    });

    if (response.ok) {
      setFeedback('Product updated successfully.');
      setEditingProductId(null);
      setProductForm(initialProductForm);
      await loadContent();
    } else {
      const data = await response.json().catch(() => ({}));
      setFeedback(data.message || 'Failed to update product.');
    }

    setIsSubmitting(false);
  };

  const handleDeleteProduct = async (id: string) => {
    const response = await adminFetch(`/api/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setFeedback('Product deleted.');
      await loadContent();
    }
  };

  const startEditingPost = (post: PostItem) => {
    setEditingPostId(post.id);
    setPostForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content.join('\n'),
      image: post.image,
    });
    setFeedback('Editing existing blog post.');
  };

  const startEditingProduct = (product: ProductItem) => {
    setEditingProductId(product.id);
    setProductForm({
      title: product.title,
      description: product.description,
      buttonText: product.buttonText,
      image: product.image,
      link: product.link,
    });
    setFeedback('Editing existing product.');
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await adminFetch('/api/admin/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordForm),
    });

    if (response.ok) {
      setFeedback('Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } else {
      const data = await response.json().catch(() => ({}));
      setFeedback(data.message || 'Failed to update password.');
    }
  };

  return (
    <Container>
      <SectionTitle preTitle="Admin Panel" title="Manage content">
        Manage posts, products, and your admin password from one place.
      </SectionTitle>

      {feedback ? (
        <div className="mb-6 rounded-md border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">
          {feedback}
        </div>
      ) : null}

      {!isLoggedIn ? (
        <form onSubmit={handleLogin} className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Admin Login</h2>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Sign in with your Supabase administrator email. Sessions expire after one hour; sign in again to continue editing.
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
              <input
                type="email"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900"
                placeholder=""
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900"
                placeholder=""
              />
            </div>
            {loginError ? <p className="text-sm text-red-500">{loginError}</p> : null}
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Sign In
          </button>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">You are signed in as admin.</p>
            <button
              onClick={handleLogout}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <form onSubmit={editingPostId ? handleUpdatePost : handleCreatePost} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{editingPostId ? 'Edit Blog Post' : 'Add Blog Post'}</h2>
                  {editingPostId ? (
                    <button type="button" onClick={() => { setEditingPostId(null); setPostForm(initialPostForm); }} className="text-sm text-indigo-600">Cancel</button>
                  ) : null}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
                    <input required value={postForm.title} onChange={(event) => setPostForm({ ...postForm, title: event.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Image URL</label>
                    <input value={postForm.image} onChange={(event) => setPostForm({ ...postForm, image: event.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900" />
                    <ImageUrlPreview src={postForm.image} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Excerpt</label>
                    <textarea required value={postForm.excerpt} onChange={(event) => setPostForm({ ...postForm, excerpt: event.target.value })} className="min-h-24 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Content (use # for heading, **bold** for bold text)</label>
                    <textarea required value={postForm.content} onChange={(event) => setPostForm({ ...postForm, content: event.target.value })} className="min-h-36 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? 'Saving...' : editingPostId ? 'Update Post' : 'Create Post'}
                </button>
              </form>

              <form onSubmit={editingProductId ? handleUpdateProduct : handleCreateProduct} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{editingProductId ? 'Edit Product' : 'Add Product'}</h2>
                  {editingProductId ? (
                    <button type="button" onClick={() => { setEditingProductId(null); setProductForm(initialProductForm); }} className="text-sm text-indigo-600">Cancel</button>
                  ) : null}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
                    <input required value={productForm.title} onChange={(event) => setProductForm({ ...productForm, title: event.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Button Text</label>
                    <input value={productForm.buttonText} onChange={(event) => setProductForm({ ...productForm, buttonText: event.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                    <textarea required value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} className="min-h-24 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Image URL</label>
                    <input value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900" />
                    <ImageUrlPreview src={productForm.image} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Link</label>
                    <input value={productForm.link} onChange={(event) => setProductForm({ ...productForm, link: event.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? 'Saving...' : editingProductId ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Posts</h3>
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div key={post.id} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{post.title}</p>
                          <p className="text-sm text-gray-500">{post.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => startEditingPost(post)} className="text-sm text-indigo-600">Edit</button>
                          <button onClick={() => handleDeletePost(post.id)} className="text-sm text-red-500">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Products</h3>
                <div className="space-y-3">
                  {products.map((product) => (
                    <div key={product.id} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{product.title}</p>
                          <p className="text-sm text-gray-500">{product.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => startEditingProduct(product)} className="text-sm text-indigo-600">Edit</button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-sm text-red-500">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Change Admin Password</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Current Password</label>
                    <input type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">New Password</label>
                    <input type="password" minLength={12} required autoComplete="new-password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900" />
                  </div>
                </div>
                <button type="submit" className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Update Password</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
