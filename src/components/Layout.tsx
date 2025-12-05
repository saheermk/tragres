import { Link, useLocation } from "react-router-dom";
import { Users, ClipboardCheck, UserPlus, LayoutDashboard, Menu, X, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/students", label: "Students", icon: Users },
  { path: "/add-student", label: "Add Student", icon: UserPlus },
  { path: "/attendance", label: "Attendance", icon: ClipboardCheck },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              T
            </div>
            <span className="text-xl font-bold text-foreground">Tragres</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "gap-2",
                      isActive && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border bg-card p-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Developed by <span className="font-medium text-foreground">Saheer</span>
          </p>
          <a
            href="mailto:mailsaheermk@gmail.com"
            className="inline-flex items-center gap-1 text-primary hover:underline mt-1"
          >
            <Mail className="h-3 w-3" />
            mailsaheermk@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
};
