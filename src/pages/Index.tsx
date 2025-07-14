import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Features from "@/components/Features";
import QuickActions from "@/components/QuickActions";
import EmergencyButton from "@/components/EmergencyButton";
import Auth from "@/components/Auth";
import PatientDashboard from "@/components/PatientDashboard";
import DoctorDashboard from "@/components/DoctorDashboard";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<string>("");
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState<"patient" | "doctor">("patient");

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile to determine type
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserType("");
          setShowAuth(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("user_id", userId)
      .single();
    
    if (data) {
      setUserType(data.user_type);
    }
  };

  const handleAuthSuccess = (user: User, type: string) => {
    setUser(user);
    setUserType(type);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserType("");
    setShowAuth(false);
  };

  const openAuth = (type: "patient" | "doctor") => {
    setAuthType(type);
    setShowAuth(true);
  };

  // Check URL hash for navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#patient-login") {
      openAuth("patient");
    } else if (hash === "#doctor-login") {
      openAuth("doctor");
    }
  }, []);

  // If user is authenticated, show their dashboard
  if (user && userType) {
    if (userType === "patient") {
      return <PatientDashboard user={user} onLogout={handleLogout} />;
    } else if (userType === "doctor") {
      return <DoctorDashboard user={user} onLogout={handleLogout} />;
    }
  }

  // Show auth modal if requested
  if (showAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Auth 
          onAuthSuccess={handleAuthSuccess} 
          defaultTab={authType}
        />
      </div>
    );
  }

  // Show main landing page
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Features />
        <QuickActions onLoginClick={openAuth} />
      </main>
      <EmergencyButton />
    </div>
  );
};

export default Index;