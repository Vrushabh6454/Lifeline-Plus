import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, Lock, Mail } from "lucide-react";

const DoctorLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo login - replace with actual authentication
    if (credentials.email && credentials.password) {
      setIsLoggedIn(true);
    }
  };

  if (isLoggedIn) {
    return <DoctorDashboard />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Doctor Portal</CardTitle>
          <CardDescription>Access patient alerts and emergency management</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  className="pl-10"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Login to Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Doctor Dashboard Component
const DoctorDashboard = () => {
  const [alerts] = useState([
    {
      id: 1,
      patient: "John Doe",
      type: "Cardiac Emergency",
      location: "Downtown Hospital Area",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      timestamp: "2 min ago",
      priority: "high"
    },
    {
      id: 2,
      patient: "Jane Smith",
      type: "Respiratory Distress",
      location: "Medical District",
      coordinates: { lat: 40.7580, lng: -73.9855 },
      timestamp: "5 min ago",
      priority: "medium"
    }
  ]);

  const sendAlert = async (alertInfo: any) => {
    try {
      const response = await fetch("http://localhost:5000/api/alert/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "+91xxxxxxxxxx", // ✅ Replace with real/verified number
          message: `🚨 Emergency Alert: ${alertInfo.patient} is facing ${alertInfo.type} at ${alertInfo.location}. Immediate response required.`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("✅ Alert sent to emergency team.");
      } else {
        alert("❌ Failed to send alert: " + (data.error || "Unknown error."));
      }
    } catch (error) {
      console.error(error);
      alert("🚫 Server or network error.");
    }
  };

  const handleAcceptAlert = (alertId: number) => {
    const alertInfo = alerts.find(alert => alert.id === alertId);
    if (alertInfo) {
      sendAlert(alertInfo);
      // Navigate to map view or further actions
      console.log(`Accepted alert for ${alertInfo.patient}`);
    }
  };
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Emergency Response Dashboard</h1>
          <p className="text-muted-foreground">Monitor patient alerts and coordinate emergency response</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alert Panel */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Active Patient Alerts</h2>
            {alerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${alert.priority === 'high' ? 'border-l-emergency' : 'border-l-primary'
                }`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{alert.patient}</CardTitle>
                      <CardDescription className="font-medium text-foreground">
                        {alert.type}
                      </CardDescription>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${alert.priority === 'high'
                        ? 'bg-emergency/10 text-emergency'
                        : 'bg-primary/10 text-primary'
                      }`}>
                      {alert.priority.toUpperCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      📍 {alert.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      🕐 {alert.timestamp}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      handleAcceptAlert(alert.id);
                      sendAlert(alert); // 👈 Add this line to trigger backend
                    }}
                    className="w-full"
                    variant={alert.priority === 'high' ? 'destructive' : 'default'}
                  >
                    Accept & Navigate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map Panel */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">City Emergency Map</h2>
            <Card className="h-96">
              <CardContent className="p-6 h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Interactive City Map</h3>
                    <p className="text-muted-foreground text-sm">
                      Real-time patient locations with shortest path routing
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {/* TODO: Integrate with Mapbox/Google Maps API for live map */}
                      Map integration ready for implementation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-emergency">{alerts.length}</div>
                  <div className="text-sm text-muted-foreground">Active Alerts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">12</div>
                  <div className="text-sm text-muted-foreground">Resolved Today</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;