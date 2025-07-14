import Header from "@/components/Header";
import EmergencyButton from "@/components/EmergencyButton";
import QuickActions from "@/components/QuickActions";
import Features from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Emergency Button */}
      <section className="py-20 bg-gradient-to-br from-medical-light/20 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Lifeline Plus
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              AI-powered healthcare management platform for enhanced patient care, 
              predictive health monitoring, and emergency response coordination.
            </p>
            
            {/* Emergency SOS Button - Center of Homepage */}
            <div className="py-12">
              <EmergencyButton />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <p className="text-muted-foreground">Emergency Response</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">AI</div>
                <p className="text-muted-foreground">Predictive Analytics</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">Secure</div>
                <p className="text-muted-foreground">Patient Records</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      

      {/* Features */}
      <Features />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Lifeline Plus. Advanced Healthcare Management Platform.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            For emergencies, call 911 immediately. This platform supplements but does not replace emergency services.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
