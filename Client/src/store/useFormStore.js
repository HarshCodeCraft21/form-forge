import { create } from 'zustand';
import * as authApi from '../api/auth.api';
import * as formsApi from '../api/forms.api';
import * as responsesApi from '../api/responses.api';
import * as dashboardApi from '../api/dashboard.api';

const slugify = (text) => {
  return (text || 'form')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

export const useFormStore = create((set, get) => ({
  // Active User session state
  user: null,
  loadingAuth: true,
  
  // Forms list
  forms: [],

  // Responses list
  responses: [],

  // Export history records
  exportHistory: [],

  // Dashboard analytics stats
  dashboardStats: null,

  // Active theme (light/dark)
  theme: 'dark',

  // Authentication actions
  initializeAuth: async () => {
    try {
      const userData = await authApi.getProfile();
      set({ user: userData, loadingAuth: false });
    } catch (err) {
      localStorage.removeItem('token');
      set({ user: null, loadingAuth: false });
    }
  },

  login: async (email, password) => {
    try {
      const userData = await authApi.login(email, password);
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }
      set({ user: userData });
      return true;
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },

  register: async (name, email, password) => {
    try {
      const userData = await authApi.register(name, email, password);
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }
      set({ user: userData });
      return true;
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  },

  updateProfile: async (formData) => {
    try {
      const userData = await authApi.updateProfile(formData);
      set({ user: userData });
      return userData;
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Failed to update profile');
    }
  },

  // Form actions
  fetchForms: async () => {
    try {
      const data = await formsApi.getForms();
      const mapped = data.map(f => ({
        ...f,
        id: f.id || f._id,
        responsesCount: f.responseCount || 0
      }));
      set({ forms: mapped });
    } catch (err) {
      console.error('Error fetching forms:', err);
    }
  },

  fetchResponses: async () => {
    try {
      const data = await responsesApi.getResponses();
      const mapped = data.map(r => ({
        ...r,
        id: r.id || r._id,
      }));
      set({ responses: mapped });
    } catch (err) {
      console.error('Error fetching responses:', err);
    }
  },

  fetchDashboardStats: async () => {
    try {
      const stats = await dashboardApi.getDashboardStats();
      set({ dashboardStats: stats });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  },

  addForm: async (form) => {
    try {
      const data = await formsApi.createForm(form);
      const newForm = {
        ...data,
        id: data.id || data._id,
        responsesCount: data.responseCount || 0
      };
      set((state) => ({
        forms: [newForm, ...state.forms]
      }));
      return newForm;
    } catch (err) {
      console.error('Error adding form:', err);
      throw err;
    }
  },

  updateForm: async (formId, updatedForm) => {
    try {
      const data = await formsApi.updateForm(formId, updatedForm);
      const updated = {
        ...data,
        id: data.id || data._id,
        responsesCount: data.responseCount || 0
      };
      set((state) => ({
        forms: state.forms.map((f) => f.id === formId ? updated : f)
      }));
      return updated;
    } catch (err) {
      console.error('Error updating form:', err);
      throw err;
    }
  },

  deleteForm: async (formId) => {
    try {
      await formsApi.deleteForm(formId);
      set((state) => ({
        forms: state.forms.filter((f) => f.id !== formId),
        responses: state.responses.filter((r) => r.formId !== formId)
      }));
    } catch (err) {
      console.error('Error deleting form:', err);
      throw err;
    }
  },

  publishForm: async (formId, config = {}) => {
    try {
      const res = await formsApi.publishForm(formId, config);
      set((state) => ({
        forms: state.forms.map((f) => 
          f.id === formId 
            ? { 
                ...f, 
                status: 'published', 
                isPublished: true,
                publishedAt: new Date().toISOString(),
                slug: res.data?.slug || res.slug 
              }
            : f
        )
      }));
    } catch (err) {
      console.error('Error publishing form:', err);
      throw err;
    }
  },

  unpublishForm: async (formId) => {
    try {
      await formsApi.unpublishForm(formId);
      set((state) => ({
        forms: state.forms.map((f) => 
          f.id === formId 
            ? { ...f, status: 'draft', isPublished: false }
            : f
        )
      }));
    } catch (err) {
      console.error('Error unpublishing form:', err);
      throw err;
    }
  },

  regenerateFormSlug: async (formId) => {
    try {
      const form = get().forms.find(f => f.id === formId);
      if (!form) return;
      const titleSlug = slugify(form.title || 'untitled-form');
      const shortId = Math.random().toString(36).substring(2, 6);
      const newSlug = `${titleSlug}-${shortId}`;
      
      const res = await formsApi.updateForm(formId, { slug: newSlug });
      set((state) => ({
        forms: state.forms.map((f) => 
          f.id === formId ? { ...f, slug: res.slug || newSlug } : f
        )
      }));
    } catch (err) {
      console.error('Error regenerating form slug:', err);
      throw err;
    }
  },

  submitResponse: async (formId, answers) => {
    console.warn('submitResponse is handled directly in PublicForm.jsx');
  },

  deleteResponse: async (responseId) => {
    try {
      const response = get().responses.find(r => r.id === responseId);
      if (!response) return;

      await responsesApi.deleteResponse(responseId);
      
      set((state) => {
        const updatedForms = state.forms.map((f) => 
          f.id === response.formId ? { ...f, responsesCount: Math.max(0, (f.responsesCount || 1) - 1) } : f
        );
        return {
          responses: state.responses.filter((r) => r.id !== responseId),
          forms: updatedForms
        };
      });
    } catch (err) {
      console.error('Error deleting response:', err);
      throw err;
    }
  },

  // Export history actions
  addExportRecord: (format, formTitle, records) => {
    const newRecord = {
      id: `exp-${Date.now()}`,
      format,
      formTitle,
      records,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Completed'
    };
    set((state) => ({
      exportHistory: [newRecord, ...state.exportHistory]
    }));
  },

  // Theme actions
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      // Sync attribute on HTML node
      document.documentElement.setAttribute('data-theme', nextTheme);
      return { theme: nextTheme };
    });
  }
}));
