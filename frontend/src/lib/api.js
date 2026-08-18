import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch page content (home, about)
 */
export async function fetchPageContent(page) {
  try {
    const response = await api.get(`/content/${page}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${page} content:`, error);
    return { data: null };
  }
}

/**
 * Update page content (admin)
 */
export async function updatePageContent(page, content) {
  try {
    const response = await api.put(`/content/${page}`, content);
    return response.data;
  } catch (error) {
    console.error(`Error updating ${page}:`, error);
    return { success: false };
  }
}

/**
 * Fetch a collection (services, testimonials, blog-posts, faqs, gallery, facilities, streams)
 */
export async function fetchCollection(name) {
  try {
    const response = await api.get(`/collections/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${name}:`, error);
    return { data: [] };
  }
}

/**
 * Add item to a collection (admin)
 */
export async function addCollectionItem(name, item) {
  try {
    const response = await api.post(`/collections/${name}`, item);
    return response.data;
  } catch (error) {
    console.error(`Error adding to ${name}:`, error);
    return { success: false };
  }
}

/**
 * Update item in a collection (admin)
 */
export async function updateCollectionItem(name, id, item) {
  try {
    const response = await api.put(`/collections/${name}/${id}`, item);
    return response.data;
  } catch (error) {
    console.error(`Error updating ${name}/${id}:`, error);
    return { success: false };
  }
}

/**
 * Delete item from a collection (admin)
 */
export async function deleteCollectionItem(name, id) {
  try {
    const response = await api.delete(`/collections/${name}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ${name}/${id}:`, error);
    return { success: false };
  }
}

/**
 * Upload a file
 */
export async function uploadFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false };
  }
}

/**
 * Submit contact form
 */
export async function submitContactForm(formData) {
  try {
    const response = await api.post('/contact', formData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Admin login
 */
export async function adminLogin(password) {
  try {
    const response = await api.post('/auth/login', { password });
    return response.data;
  } catch {
    return { success: false, message: 'Invalid password' };
  }
}

/**
 * Get full URL for an uploaded image
 */
export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}

/**
 * Check MediaMTX CCTV Server Status
 */
export async function checkMediaMtxStatus() {
  try {
    const response = await api.get('/mediamtx/status');
    return response.data;
  } catch (error) {
    return { online: false, error: error.message };
  }
}

export default api;
