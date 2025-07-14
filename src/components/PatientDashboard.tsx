import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Brain, Users, User } from "lucide-react";

interface PatientDashboardProps {
  user: any;
  onLogout: () => void;
}

const PatientDashboard = ({ user, onLogout }: PatientDashboardProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
    fetchDoctors();
    fetchAppointments();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    
    setProfile(data);
  };

  const fetchDoctors = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_type", "doctor")
      .eq("is_available", true);
    
    setDoctors(data || []);
  };

  const fetchAppointments = async () => {
    if (!profile) return;
    
    const { data } = await supabase
      .from("appointments")
      .select(`
        *,
        doctor:doctor_id (first_name, last_name, specialization)
      `)
      .eq("patient_id", profile.id)
      .order("appointment_date", { ascending: true });
    
    setAppointments(data || []);
  };

  const bookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !selectedDoctor || !appointmentDate) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .insert({
          patient_id: profile.id,
          doctor_id: selectedDoctor,
          appointment_date: appointmentDate,
          notes: appointmentNotes,
        });

      if (error) throw error;

      toast({
        title: "Appointment booked!",
        description: "Your appointment has been scheduled successfully.",
      });

      setSelectedDoctor("");
      setAppointmentDate("");
      setAppointmentNotes("");
      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {profile.first_name}!</h1>
        <Button onClick={onLogout} variant="outline">
          <User className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Predictive Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Predictive Analysis
            </CardTitle>
            <CardDescription>AI-powered health insights</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Get personalized health predictions based on your medical history.
            </p>
            <Button className="w-full">Run Analysis</Button>
          </CardContent>
        </Card>

        {/* Find Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Available Doctors
            </CardTitle>
            <CardDescription>Find healthcare providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {doctors.slice(0, 3).map((doctor) => (
                <div key={doctor.id} className="p-2 bg-medical-light rounded">
                  <p className="font-medium">{doctor.first_name} {doctor.last_name}</p>
                  <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Book Appointment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Book Appointment
            </CardTitle>
            <CardDescription>Schedule a visit</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={bookAppointment} className="space-y-4">
              <div>
                <Label>Select Doctor</Label>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  placeholder="Any specific concerns..."
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Booking..." : "Book Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* My Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>My Appointments</CardTitle>
          <CardDescription>Your scheduled and past appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-muted-foreground">No appointments scheduled.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctor.specialization}
                      </p>
                      <p className="text-sm">
                        {new Date(appointment.appointment_date).toLocaleString()}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Notes: {appointment.notes}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;