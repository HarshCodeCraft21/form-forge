import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Landing from '../pages/Landing';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Admin Pages
import DashboardOverview from '../pages/dashboard/DashboardOverview';
import FormList from '../pages/forms/FormList';
import FormTemplates from '../pages/forms/FormTemplates';
import FormBuilder from '../pages/forms/FormBuilder';
import FormAI from '../pages/forms/FormAI';
import FormPreview from '../pages/forms/FormPreview';
import PublicForm from '../pages/forms/PublicForm';
import ShareForm from '../pages/forms/ShareForm';
import ResponseList from '../pages/responses/ResponseList';
import ResponseDetail from '../pages/responses/ResponseDetail';
import ExportModule from '../pages/responses/ExportModule';
import GeneralExport from '../pages/responses/GeneralExport';
import Settings from '../pages/settings/Settings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Public Form Submit Route (accessible without login) */}
      <Route path="/forms/:id/submit" element={<PublicForm />} />
      <Route path="/f/:slug" element={<PublicForm />} />

      {/* Protected Admin Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardOverview />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/forms" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FormList />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/forms/templates" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FormTemplates />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/forms/new" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FormBuilder />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/forms/:id/edit" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FormBuilder />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/forms/:id/preview" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FormPreview />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/forms/:id/share" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ShareForm />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/forms/ai" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FormAI />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/forms/:id/ai" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FormAI />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/responses" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ResponseList />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/responses/:id" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ResponseList />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/responses/:id/export" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ExportModule />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/exports" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GeneralExport />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/responses/submission/:responseId" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ResponseDetail />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
