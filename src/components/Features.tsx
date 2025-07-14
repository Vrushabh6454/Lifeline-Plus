import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Brain, Smartphone, Database, Clock, MapPin } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Predictive Health Alerts",
      description: "AI-powered disease prediction using advanced machine learning models to identify health risks before symptoms appear.",
      icon: Brain,
      details: ["Early disease detection", "Personalized risk assessment", "Treatment recommendations"]
    },
    {
      title: "Secure Medical Records",
      description: "HIPAA-compliant patient record management with end-to-end encryption and role-based access control.",
      icon: Database,
      details: ["Encrypted data storage", "Access control", "Audit trails"]
    },
    {
      title: "Emergency SOS System",
      description: "Instant emergency alerts with location tracking and automated SMS notifications to emergency contacts and services.",
      icon: Smartphone,
      details: ["GPS location sharing", "Automated SMS alerts", "Emergency contact notification"]
    },
    {
      title: "Real-time Monitoring",
      description: "Continuous health monitoring with vital sign tracking and anomaly detection for proactive care.",
      icon: Clock,
      details: ["Vital sign tracking", "Anomaly detection", "Real-time alerts"]
    },
    {
      title: "Location Services",
      description: "Advanced location tracking for emergency services with precise coordinates and landmark identification.",
      icon: MapPin,
      details: ["GPS coordinates", "Landmark detection", "Emergency routing"]
    },
    {
      title: "Data Security",
      description: "Military-grade encryption and security protocols to ensure patient data privacy and compliance.",
      icon: Shield,
      details: ["256-bit encryption", "HIPAA compliance", "Secure authentication"]
    }
  ];

  return (
    <section className="py-16 bg-medical-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Platform Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive healthcare management powered by artificial intelligence and modern technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border border-border hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;