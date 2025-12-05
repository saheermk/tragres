import { useEffect, useState } from "react";
import { getStudents, addAttendance } from "@/lib/storage";
import { Student } from "@/types/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Calendar, CheckCircle, XCircle, Users, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceState {
  [studentId: string]: {
    present: boolean | null;
    topicCovered: string;
  };
}

const Attendance = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [globalTopic, setGlobalTopic] = useState("");

  const [loading, setLoading] = useState(true); // <-- loading state

  useEffect(() => {
  const load = async () => {

      setLoading(true); // start loading
    const loaded = await getStudents();
    setStudents(loaded);

    // Initialize attendance state
    const initial: AttendanceState = {};
    loaded.forEach((student) => {
      const existing = student.attendance.find((a) => a.date === selectedDate);
      initial[student.id] = {
        present: existing?.present ?? null,
        topicCovered: existing?.topicCovered || "",
      };
    });
    setAttendance(initial);
    setLoading(false); // finished loading
  };

  load();
}, [selectedDate]);


  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handlePresenceToggle = (studentId: string, present: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        present: prev[studentId]?.present === present ? null : present,
      },
    }));
  };

  const handleTopicChange = (studentId: string, topic: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        topicCovered: topic,
      },
    }));
  };

  const applyGlobalTopic = () => {
    if (!globalTopic.trim()) return;
    setAttendance((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        updated[id] = { ...updated[id], topicCovered: globalTopic };
      });
      return updated;
    });
    toast({ title: "Applied", description: "Topic applied to all students" });
  };

  const handleSaveAttendance = async () => {
  let savedCount = 0;

  for (const [studentId, data] of Object.entries(attendance)) {
    if (data.present !== null) {
      await addAttendance(studentId, selectedDate, data.present, data.topicCovered);
      savedCount++;
    }
  }

  if (savedCount === 0) {
    toast({
      title: "No changes",
      description: "Mark at least one student's attendance",
      variant: "destructive",
    });
    return;
  }

  toast({
    title: "Saved",
    description: `Attendance saved for ${savedCount} student(s)`,
  });

  // Refresh students
  const refreshed = await getStudents();
  setStudents(refreshed);
};


  const markedCount = Object.values(attendance).filter((a) => a.present !== null).length;
  const presentCount = Object.values(attendance).filter((a) => a.present === true).length;
 
 
  if (loading) {
      return (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      );
    }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Mark Attendance</h1>
        <p className="text-muted-foreground mt-1">Record daily attendance for each student</p>
      </div>

      {/* Date & Stats */}
      <Card className="border-border bg-card">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date" className="text-foreground">Select Date</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{markedCount}</p>
                <p className="text-xs text-muted-foreground">Marked</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{markedCount - presentCount}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSaveAttendance} className="gap-2 w-full sm:w-auto">
                <Save className="h-4 w-4" />
                Save Attendance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Topic */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <Label className="text-foreground">Today's Topic (Apply to All)</Label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder="What was covered today?"
              value={globalTopic}
              onChange={(e) => setGlobalTopic(e.target.value)}
            />
            <Button variant="outline" onClick={applyGlobalTopic}>
              Apply All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      {students.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No students to mark attendance for</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {students.map((student) => {
            const state = attendance[student.id] || { present: null, topicCovered: "" };
            const initials = student.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <Card key={student.id} className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Student Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-12 w-12 border border-border shrink-0">
                        <AvatarImage src={student.profilePhoto} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{student.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{student.course}</p>
                      </div>
                    </div>

                    {/* Attendance Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant={state.present === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePresenceToggle(student.id, true)}
                        className={cn(
                          "gap-1",
                          state.present === true && "bg-primary text-primary-foreground"
                        )}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Present
                      </Button>
                      <Button
                        variant={state.present === false ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handlePresenceToggle(student.id, false)}
                        className="gap-1"
                      >
                        <XCircle className="h-4 w-4" />
                        Absent
                      </Button>
                    </div>
                  </div>

                  {/* Topic Input */}
                  {state.present !== null && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <Input
                        placeholder="Topic covered for this student (optional)"
                        value={state.topicCovered}
                        onChange={(e) => handleTopicChange(student.id, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Attendance;
