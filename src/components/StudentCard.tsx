import { Link } from "react-router-dom";
import { Student } from "@/types/student";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, BookOpen, CheckCircle, XCircle } from "lucide-react";

interface StudentCardProps {
  student: Student;
}

export const StudentCard = ({ student }: StudentCardProps) => {
  const presentCount = student.attendance.filter((a) => a.present).length;
  const totalAttendance = student.attendance.length;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;
  const completedAssignments = student.assignments.filter((a) => a.completed).length;

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link to={`/student/${student.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 border-2 border-border">
              <AvatarImage src={student.profilePhoto} alt={student.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{student.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <BookOpen className="h-3 w-3" />
                <span className="truncate">{student.course}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {student.phone && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{student.phone}</span>
                  </div>
                )}
                {student.email && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span className="truncate max-w-[120px]">{student.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
            <Badge variant={attendanceRate >= 75 ? "default" : "destructive"} className="text-xs">
              {attendanceRate}% Attendance
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-primary" />
              <span>{completedAssignments}/{student.assignments.length} Tasks</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
