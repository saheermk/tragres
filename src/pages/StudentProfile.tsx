import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getStudentById, updateStudent, deleteStudent, addAssignment, toggleAssignment, deleteAssignment } from "@/lib/storage";
import { Student } from "@/types/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Phone,
  Mail,
  BookOpen,
  Calendar,
  Edit,
  Trash2,
  ArrowLeft,
  Plus,
  CheckCircle,
  XCircle,
  Camera,
  Save,
  X,
} from "lucide-react";

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    profilePhoto: "",
  });
  const [newAssignment, setNewAssignment] = useState("");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!id) return;

  (async () => {
    const found = await getStudentById(id);
    if (found) {
      setStudent(found);
      setEditData({
        name: found.name,
        phone: found.phone,
        email: found.email || "",
        course: found.course,
        profilePhoto: found.profilePhoto || "",
      });
    }
    setLoading(false);
  })();
}, [id]);

  if (loading) {
      return (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      );
  }

if (!student) {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-medium text-foreground">Student not found</h2>
      <Link to="/students">
        <Button className="mt-4">Back to Students</Button>
      </Link>
    </div>
  );
}


 
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData((prev) => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = async () => {
  if (!editData.name.trim() || !editData.phone.trim() || !editData.course.trim()) {
    toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
    return;
  }

  const updated = await updateStudent(student.id, editData);

  if (updated) {
    setStudent(updated);
    setIsEditing(false);
    toast({ title: "Success", description: "Profile updated successfully" });
  }
};


  const handleDelete = async () => {
  await deleteStudent(student.id);
  toast({ title: "Success", description: "Student deleted successfully" });
  navigate("/students");
};

  const handleAddAssignment = async () => {
  if (!newAssignment.trim()) return;

  await addAssignment(student.id, newAssignment, new Date().toISOString().split("T")[0]);
  
  const refreshed = await getStudentById(student.id);
  setStudent(refreshed || null);

  setNewAssignment("");
  toast({ title: "Success", description: "Assignment added" });
};

  const handleToggleAssignment = async (assignmentId: string) => {
  await toggleAssignment(student.id, assignmentId);
  const refreshed = await getStudentById(student.id);
  setStudent(refreshed || null);
};


  const handleDeleteAssignment = async (assignmentId: string) => {
  await deleteAssignment(student.id, assignmentId);
  const refreshed = await getStudentById(student.id);
  setStudent(refreshed || null);
  toast({ title: "Success", description: "Assignment removed" });
};



// Safe to access student now
const presentCount = student.attendance.filter((a) => a.present).length;
const totalAttendance = student.attendance.length;
const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

const initials = student.name
  .split(" ")
  .map((n) => n[0])
  .join("")
  .toUpperCase()
  .slice(0, 2);


  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Student Profile</h1>
      </div>

      {/* Profile Card */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          {isEditing ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-border">
                    <AvatarImage src={editData.profilePhoto} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {editData.name.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={editData.phone}
                    onChange={(e) => setEditData((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={editData.email}
                    onChange={(e) => setEditData((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Course *</Label>
                  <Input
                    value={editData.course}
                    onChange={(e) => setEditData((p) => ({ ...p, course: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} className="gap-2">
                  <Save className="h-4 w-4" /> Save
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="gap-2">
                  <X className="h-4 w-4" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6">
              <Avatar className="h-24 w-24 border-2 border-border mx-auto sm:mx-0">
                <AvatarImage src={student.profilePhoto} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {student.course}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {student.phone}
                  </div>
                  {student.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {student.email}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                  <Badge variant={attendanceRate >= 75 ? "default" : "destructive"}>
                    {attendanceRate}% Attendance ({presentCount}/{totalAttendance})
                  </Badge>
                  <Badge variant="outline">
                    {student.assignments.filter((a) => a.completed).length}/{student.assignments.length} Tasks Done
                  </Badge>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-1">
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-1">
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Student?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete {student.name} and all their records.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignments */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New assignment title..."
              value={newAssignment}
              onChange={(e) => setNewAssignment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddAssignment()}
            />
            <Button onClick={handleAddAssignment} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {student.assignments.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No assignments yet</p>
          ) : (
            <div className="space-y-2">
              {student.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background"
                >
                  <Checkbox
                    checked={assignment.completed}
                    onCheckedChange={() => handleToggleAssignment(assignment.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${assignment.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {assignment.title}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Assigned: {assignment.assignedDate}
                      {assignment.completed && assignment.completedDate && (
                        <span className="ml-2">| Completed: {assignment.completedDate.split("T")[0]}</span>
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAssignment(assignment.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {student.attendance.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No attendance records yet</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {[...student.attendance].reverse().map((record) => (
                <div
                  key={record.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background"
                >
                  {record.present ? (
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{record.date}</p>
                    {record.topicCovered && (
                      <p className="text-sm text-muted-foreground truncate">Topic: {record.topicCovered}</p>
                    )}
                  </div>
                  <Badge variant={record.present ? "default" : "destructive"}>
                    {record.present ? "Present" : "Absent"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
