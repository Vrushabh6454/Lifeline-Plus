import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, AlertTriangle, MapPin, User, Clock } from "lucide-react";
import EmergencyMap from "./EmergencyMap";

interface DoctorDashboardProps {
  user: any;
  onLogout: () => void;
}

const DoctorDashboard = ({ user, onLogout }: DoctorDashboardProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
    fetchEmergencyAlerts();

    // Subscribe to real-time emergency alerts
    const alertsSubscription = supabase
      .channel('emergency-alerts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'emergency_alerts'
      }, (payload) => {
        setEmergencyAlerts(prev => [payload.new as any, ...prev]);
        toast({
          title: "New Emergency Alert!",
          description: `Emergency reported: ${payload.new.emergency_type}`,
          variant: "destructive",
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(alertsSubscription);
    };
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    
    setProfile(data);
  };

  const fetchAppointments = async () => {
    if (!profile) return;
    
    const { data } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:patient_id (first_name, last_name, phone)
      `)
      .eq("doctor_id", profile.id)
      .order("appointment_date", { ascending: true });
    
    setAppointments(data || []);
  };

  const fetchEmergencyAlerts = async () => {
    const { data } = await supabase
      .from("emergency_alerts")
      .select("*")
      .in("status", ["active", "assigned"])
      .order("created_at", { ascending: false });
    
    setEmergencyAlerts(data || []);
  };

  const confirmAppointment = async (appointmentId: string) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: "confirmed" })
      .eq("id", appointmentId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Appointment confirmed!",
        description: "The patient has been notified.",
      });
      fetchAppointments();
    }
  };

  const respondToAlert = async (alertId: string, action: "assign" | "resolve") => {
    if (!profile) return;

    const updateData = action === "assign" 
      ? { status: "assigned", assigned_doctor_id: profile.id }
      : { status: "resolved", resolved_at: new Date().toISOString() };

    const { error } = await supabase
      .from("emergency_alerts")
      .update(updateData)
      .eq("id", alertId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: action === "assign" ? "Alert assigned!" : "Alert resolved!",
        description: action === "assign" ? "You are now responding to this emergency." : "Emergency has been marked as resolved.",
      });
      fetchEmergencyAlerts();
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dr. {profile.first_name} {profile.last_name}</h1>
          <p className="text-muted-foreground">{profile.specialization}</p>
        </div>
        <Button onClick={onLogout} variant="outline">
          <User className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Emergency Alerts
            </CardTitle>
            <CardDescription>Respond to patient emergencies</CardDescription>
          </CardHeader>
          <CardContent>
            {emergencyAlerts.length === 0 ? (
              <p className="text-muted-foreground">No active emergency alerts.</p>
            ) : (
              <div className="space-y-4">
                {emergencyAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border rounded-lg bg-red-50 border-red-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-red-800">{alert.emergency_type}</p>
                        <p className="text-sm text-red-600">
                          Patient: {alert.patient_name || "Anonymous"}
                        </p>
                        <p className="text-sm text-red-600">
                          Phone: {alert.patient_phone}
                        </p>
                        {alert.description && (
                          <p className="text-sm text-red-600 mt-1">
                            {alert.description}
                          </p>
                        )}
                      </div>
                      <Badge variant={alert.status === "active" ? "destructive" : "secondary"}>
                        {alert.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-red-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {alert.address || `${alert.latitude}, ${alert.longitude}`}
                    </div>

                    <div className="flex items-center text-sm text-red-600 mb-3">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(alert.created_at).toLocaleString()}
                    </div>

                    <div className="flex space-x-2">
                      {alert.status === "active" && (
                        <Button
                          size="sm"
                          onClick={() => respondToAlert(alert.id, "assign")}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Respond to Emergency
                        </Button>
                      )}
                      {alert.status === "assigned" && alert.assigned_doctor_id === profile.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => respondToAlert(alert.id, "resolve")}
                        >
                          Mark Resolved
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        View on Map
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appointment Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Appointment Requests
            </CardTitle>
            <CardDescription>Confirm or manage appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.filter(apt => apt.status === "pending").length === 0 ? (
              <p className="text-muted-foreground">No pending appointments.</p>
            ) : (
              <div className="space-y-4">
                {appointments
                  .filter(apt => apt.status === "pending")
                  .map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">
                            {appointment.patient.first_name} {appointment.patient.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.patient.phone}
                          </p>
                          <p className="text-sm">
                            {new Date(appointment.appointment_date).toLocaleString()}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Notes: {appointment.notes}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => confirmAppointment(appointment.id)}
                      >
                        Confirm Appointment
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmed Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Confirmed Appointments</CardTitle>
            <CardDescription>Your upcoming schedule</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.filter(apt => apt.status === "confirmed").length === 0 ? (
              <p className="text-muted-foreground">No confirmed appointments.</p>
            ) : (
              <div className="space-y-4">
                {appointments
                  .filter(apt => apt.status === "confirmed")
                  .slice(0, 5)
                  .map((appointment) => (
                    <div key={appointment.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="font-medium text-green-800">
                        {appointment.patient.first_name} {appointment.patient.last_name}
                      </p>
                      <p className="text-sm text-green-600">
                        {new Date(appointment.appointment_date).toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Emergency Map Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Emergency Location</h3>
              <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                Close
              </Button>
            </div>
            <EmergencyMap
              doctorLocation={{ lat: profile.latitude || 0, lng: profile.longitude || 0 }}
              emergencyLocation={{ lat: selectedAlert.latitude, lng: selectedAlert.longitude }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;