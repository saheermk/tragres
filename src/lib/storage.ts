/**
 * API-based Data Layer for Tragres ERP
 * 
 * This replaces localStorage with API calls.
 * Ensure `api.ts` is correctly configured and your backend is running.
 */

import { Student, AttendanceRecord, Assignment } from "@/types/student";
import {
  fetchStudents,
  fetchStudentById,
  createStudent,
  updateStudentApi,
  deleteStudentApi,
  addAttendanceApi,
  addAssignmentApi,
  toggleAssignmentApi,
  deleteAssignmentApi
} from "./api";

// ==============================
// STUDENT FUNCTIONS
// ==============================

export const getStudents = async (): Promise<Student[]> => {
  return fetchStudents();
};

export const getStudentById = async (id: string): Promise<Student | undefined> => {
  try {
    return await fetchStudentById(id);
  } catch {
    return undefined;
  }
};

export const addStudent = async (
  student: Omit<Student, "id" | "createdAt" | "assignments" | "attendance">
): Promise<Student> => {
  return createStudent(student);
};

export const updateStudent = async (
  id: string,
  updates: Partial<Student>
): Promise<Student> => {
  return updateStudentApi(id, updates);
};

export const deleteStudent = async (id: string): Promise<void> => {
  return deleteStudentApi(id);
};

// ==============================
// ATTENDANCE FUNCTIONS
// ==============================

export const addAttendance = async (
  studentId: string,
  date: string,
  present: boolean,
  topicCovered?: string
): Promise<AttendanceRecord> => {
  return addAttendanceApi(studentId, { date, present, topic: topicCovered || "" });
};

// ==============================
// ASSIGNMENT FUNCTIONS
// ==============================

export const addAssignment = async (
  studentId: string,
  title: string,
  assignedDate: string
): Promise<Assignment> => {
  return addAssignmentApi(studentId, { title, assigned_date: assignedDate, completed: false });
};

export const toggleAssignment = async (
  studentId: string,
  assignmentId: string
): Promise<Assignment> => {
  return toggleAssignmentApi(studentId, assignmentId);
};

export const deleteAssignment = async (
  studentId: string,
  assignmentId: string
): Promise<void> => {
  return deleteAssignmentApi(studentId, assignmentId);
};
