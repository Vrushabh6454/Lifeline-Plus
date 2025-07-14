import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, FileText, Brain, Users, Calendar, Shield } from "lucide-react";

interface QuickActionsProps {
  onLoginClick: (type: "patient" | "doctor") => void;
}

const QuickActions = ({ onLoginClick }: QuickActionsProps) => {
  const actions = [
    {
      title: "Patient Login",
      description: "Access your health dashboard",
      icon: Users,
      color: "bg-medical-light",
      type: "patient"
    },
    {
      title: "Doctor Login",
      description: "Healthcare provider portal",
      icon: FileText,
      color: "bg-medical-light",
      type: "doctor"
    },
    {
      title: "Emergency Alert",
      description: "24/7 emergency assistance",
      icon: Activity,
      color: "bg-red-100",
      type: "emergency"
    },
    {
      title: "Find Doctors",
      description: "Locate nearby healthcare providers",
      icon: Users,
      color: "bg-medical-light",
      type: "directory"
    },
    {
      title: "Health Insurance",
      description: "Insurance and coverage info",
      icon: Shield,
      color: "bg-medical-light",
      type: "insurance"
    },
    {
      title: "Telemedicine",
      description: "Virtual consultations",
      icon: Brain,
      color: "bg-medical-light",
      type: "telemedicine"
    }
  ];

  const handleActionClick = (action: any) => {
    if (action.type === "patient") {
      onLoginClick("patient");
    } else if (action.type === "doctor") {
      onLoginClick("doctor");
    } else if (action.type === "emergency") {
      // Emergency button is always visible - this is just informational
      alert("Use the red emergency button in the bottom right corner for immediate help!");
    } else {
      alert(`${action.title} feature coming soon!`);
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Healthcare Services</h2>
          <p className="text-muted-foreground">Access your health information and services</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-200 border border-border hover:border-primary/20 cursor-pointer"
                onClick={() => handleActionClick(action)}
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    {action.type === "patient" || action.type === "doctor" ? "Login" : "Access"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;