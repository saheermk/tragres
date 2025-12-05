/**
 * API Client for Django Backend
 * 
 * Configure API_BASE_URL to point to your Django server:
 * - Development: http://localhost:8000/api
 * - Production: https://your-app.fly.dev/api
 */

import { Student, AttendanceRecord, Assignment } from '@/types/student';

// ============================================
// CONFIGURATION - UPDATE THIS URL
// ============================================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ============================================
// API HELPER FUNCTIONS
// ============================================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ============================================
// STUDENT API FUNCTIONS
// ============================================

/**
 * Get all students from the API
 */
export async function fetchStudents(): Promise<Student[]> {
  return apiRequest<Student[]>('/students/');
}

/**
 * Get a single student by ID
 */
export async function fetchStudentById(id: string): Promise<Student> {
  return apiRequest<Student>(`/students/${id}/`);
}

/**
 * Create a new student
 */
export async function createStudent(
  student: Omit<Student, 'id' | 'createdAt' | 'attendance' | 'assignments'>
): Promise<Student> {
  return apiRequest<Student>('/students/', {
    method: 'POST',
    body: JSON.stringify(student),
  });
}

/**
 * Update an existing student
 */
export async function updateStudentApi(
  id: string,
  updates: Partial<Student>
): Promise<Student> {
  return apiRequest<Student>(`/students/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a student
 */
export async function deleteStudentApi(id: string): Promise<void> {
  await apiRequest<void>(`/students/${id}/`, {
    method: 'DELETE',
  });
}

// ============================================
// ATTENDANCE API FUNCTIONS
// ============================================

/**
 * Add or update attendance for a student
 */
export async function addAttendanceApi(
  studentId: string,
  record: Omit<AttendanceRecord, 'id'>
): Promise<AttendanceRecord> {
  return apiRequest<AttendanceRecord>(`/students/${studentId}/attendance/`, {
    method: 'POST',
    body: JSON.stringify(record),
  });
}

// ============================================
// ASSIGNMENT API FUNCTIONS
// ============================================

/**
 * Add an assignment for a student
 */
export async function addAssignmentApi(
  studentId: string,
  assignment: Omit<Assignment, 'id'>
): Promise<Assignment> {
  return apiRequest<Assignment>(`/students/${studentId}/assignments/`, {
    method: 'POST',
    body: JSON.stringify(assignment),
  });
}

/**
 * Toggle assignment completion status
 */
export async function toggleAssignmentApi(
  studentId: string,
  assignmentId: string
): Promise<Assignment> {
  return apiRequest<Assignment>(
    `/students/${studentId}/assignments/${assignmentId}/toggle/`,
    { method: 'PUT' }
  );
}

/**
 * Delete an assignment
 */
export async function deleteAssignmentApi(
  studentId: string,
  assignmentId: string
): Promise<void> {
  await apiRequest<void>(
    `/students/${studentId}/assignments/${assignmentId}/`,
    { method: 'DELETE' }
  );
}

// ============================================
// API CONNECTION CHECK
// ============================================

/**
 * Check if the API is reachable
 */
export async function checkApiConnection(): Promise<boolean> {
  try {
    await fetch(`${API_BASE_URL}/students/`, { method: 'HEAD' });
    return true;
  } catch {
    return false;
  }
}
