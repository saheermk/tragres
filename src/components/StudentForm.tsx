import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { addStudent, updateStudent } from "@/lib/storage";
import { Camera } from "lucide-react";

interface StudentFormProps {
  student?: Student;
  onSuccess?: () => void;
}

export const StudentForm = ({ student, onSuccess }: StudentFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: student?.name || "",
    phone: student?.phone || "",
    email: student?.email || "",
    course: student?.course || "",
    profilePhoto: student?.profilePhoto || "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return;
    }
    if (!formData.phone.trim()) {
      toast({ title: "Error", description: "Phone number is required", variant: "destructive" });
      return;
    }
    if (!formData.course.trim()) {
      toast({ title: "Error", description: "Course is required", variant: "destructive" });
      return;
    }

    if (student) {
      updateStudent(student.id, formData);
      toast({ title: "Success", description: "Student updated successfully" });
    } else {
      addStudent(formData);
      toast({ title: "Success", description: "Student added successfully" });
    }

    onSuccess?.();
    navigate("/students");
  };

  const initials = formData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <Card className="max-w-lg mx-auto border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">
          {student ? "Edit Student" : "Add New Student"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarImage src={formData.profilePhoto} alt={formData.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-muted-foreground">Click camera to upload photo</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-foreground">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter student name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-foreground">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="course" className="text-foreground">Course / Subject *</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => setFormData((prev) => ({ ...prev, course: e.target.value }))}
                placeholder="What are they studying?"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {student ? "Update Student" : "Add Student"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
