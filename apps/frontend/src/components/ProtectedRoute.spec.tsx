import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuthStore } from '../store/useAuthStore';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Zustand useAuthStore hook
vi.mock('../store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to /login when user is not authenticated', () => {
    // Mock unauthorized state
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/secured-path']}>
        <Routes>
          <Route
            path="/secured-path"
            element={
              <ProtectedRoute>
                <div data-testid="child-element">Secured Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('child-element')).not.toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should redirect to / when user authenticated but has unauthorized role', () => {
    // Mock user with role customer
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'John Doe', role: 'customer' },
    });

    render(
      <MemoryRouter initialEntries={['/admin-path']}>
        <Routes>
          <Route
            path="/admin-path"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div data-testid="admin-content">Admin Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('should render children when user authenticated and has authorized role', () => {
    // Mock authorized admin user
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Admin User', role: 'admin' },
    });

    render(
      <MemoryRouter initialEntries={['/admin-path']}>
        <Routes>
          <Route
            path="/admin-path"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div data-testid="admin-content">Admin Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});
