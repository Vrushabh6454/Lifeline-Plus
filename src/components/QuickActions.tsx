import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Brain, Users, Calendar, Shield } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Predictive Analysis",
      description: "AI-powered health insights",
      icon: Brain,
      color: "bg-medical-light",
      requiresAuth: true,
      link: "https://healthcareai-nk48.onrender.com" // Only this one gets the link
    },
    {
      title: "Vital Signs",
      description: "Monitor your health metrics",
      icon: Activity,
      color: "bg-medical-light",
      requiresAuth: true
    },
    {
      title: "Find Doctors",
      description: "Connect with healthcare providers",
      icon: Users,
      color: "bg-medical-light",
      requiresAuth: false
    },
    {
      title: "Appointments",
      description: "Schedule medical visits",
      icon: Calendar,
      color: "bg-medical-light",
      requiresAuth: true
    },
    {
      title: "Insurance",
      description: "Manage your coverage",
      icon: Shield,
      color: "bg-medical-light",
      requiresAuth: true
    }
  ];

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
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {action.link ? (
                    <a
                      href={action.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        Access Now
                      </Button>
                    </a>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      disabled={action.requiresAuth}
                    >
                      {action.requiresAuth ? "Sign In Required" : "Access Now"}
                    </Button>
                  )}
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
