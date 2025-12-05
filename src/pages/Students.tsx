import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStudents } from "@/lib/storage";
import { Student } from "@/types/student";
import { StudentCard } from "@/components/StudentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Users } from "lucide-react";

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // <-- loading state

  

  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const list = await getStudents();
      setStudents(list);
      setLoading(false); // <-- finished loading
    };
    load();
  }, []);


  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm)
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">{students.length} total students</p>
        </div>
        <Link to="/add-student">
          <Button className="gap-2 w-full sm:w-auto">
            <UserPlus className="h-4 w-4" />
            Add Student
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, course, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? "No students found" : "No students yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Try a different search term"
              : "Add your first student to get started"}
          </p>
          {!searchTerm && (
            <Link to="/add-student">
              <Button>Add Your First Student</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;
