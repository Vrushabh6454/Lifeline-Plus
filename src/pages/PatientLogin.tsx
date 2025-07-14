import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Lock } from "lucide-react";
import QuickActions from "@/components/QuickActions";

const PatientLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 🔐 Dummy auth — replace with backend later
    if (
      credentials.email === "patient@example.com" &&
      credentials.password === "123456"
    ) {
      setIsLoggedIn(true);
    } else {
      setError("Invalid credentials. Try 'patient@example.com' / '123456'");
    }
  };

  if (isLoggedIn) {
    return <PatientDashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Patient Login</CardTitle>
          <CardDescription>Access your health dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Input
                type="email"
                placeholder="patient@example.com"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1 relative">
              <Input
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// ✅ Patient Dashboard Component
const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("predictions");

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your health insights, records, and appointments
          </p>
        </div>

        <QuickActions />
      </div>
    </div>
  );
};

export default PatientLogin;
