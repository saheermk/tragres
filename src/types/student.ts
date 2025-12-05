export interface Assignment {
  id: string;
  title: string;
  assignedDate: string;
  completed: boolean;
  completedDate?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  present: boolean;
  topicCovered?: string;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course: string;
  profilePhoto?: string;
  assignments: Assignment[];
  attendance: AttendanceRecord[];
  createdAt: string;
}
