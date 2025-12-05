import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStudents } from "@/lib/storage";
import { Student } from "@/types/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, ClipboardCheck, BookOpen, TrendingUp, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true); // <-- Add loading state

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const list = await getStudents();
      setStudents(list);
      setLoading(false); // <-- Finished loading
    };
    load();
  }, []);

 useEffect(() => {
  const load = async () => {
    const list = await getStudents();
    setStudents(list);
  };
  load();
}, []);

  const totalStudents = students.length;
  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = students.filter((s) =>
    s.attendance.some((a) => a.date === today && a.present)
  ).length;
  const totalAssignments = students.reduce((acc, s) => acc + s.assignments.length, 0);
  const completedAssignments = students.reduce(
    (acc, s) => acc + s.assignments.filter((a) => a.completed).length,
    0
  );

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Present Today",
      value: todayAttendance,
      icon: ClipboardCheck,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      title: "Total Assignments",
      value: totalAssignments,
      icon: BookOpen,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      title: "Completed Tasks",
      value: completedAssignments,
      icon: CheckCircle,
      color: "text-chart-5",
      bg: "bg-chart-5/10",
    },
  ];

  const recentStudents = students.slice(-5).reverse();



  if (loading) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3 animate-spin" />
        <p className="text-muted-foreground">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to Tragres Student ERP</p>
        </div>
        <div className="flex gap-2">
          <Link to="/add-student">
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Student
            </Button>
          </Link>
          <Link to="/attendance">
            <Button variant="outline" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Mark Attendance
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-border bg-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 sm:p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Students */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Recent Students</CardTitle>
          <Link to="/students">
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <TrendingUp className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No students yet</p>
              <Link to="/add-student">
                <Button className="mt-4">Add Your First Student</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentStudents.map((student) => (
                <Link
                  key={student.id}
                  to={`/student/${student.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{student.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{student.course}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {student.attendance.filter((a) => a.present).length}/{student.attendance.length} present
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
