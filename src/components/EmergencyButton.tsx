import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EmergencyButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    emergencyType: "",
    description: "",
    address: "",
  });
  const { toast } = useToast();

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
      );
    });
  };

  const handleEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current location
      let location = { lat: 0, lng: 0 };
      try {
        location = await getCurrentLocation();
      } catch (error) {
        console.warn("Could not get location:", error);
      }

      // Create emergency alert
      const { data, error } = await supabase
        .from("emergency_alerts")
        .insert({
          patient_name: formData.name,
          patient_phone: formData.phone,
          emergency_type: formData.emergencyType,
          description: formData.description,
          latitude: location.lat,
          longitude: location.lng,
          address: formData.address,
        })
        .select()
        .single();

      if (error) throw error;

      // Send SMS via Twilio edge function
      try {
        await supabase.functions.invoke('send-emergency-sms', {
          body: {
            alertId: data.id,
            phone: formData.phone,
            emergencyType: formData.emergencyType,
            location: formData.address || `${location.lat}, ${location.lng}`,
          },
        });
      } catch (smsError) {
        console.warn("SMS sending failed:", smsError);
      }

      toast({
        title: "Emergency Alert Sent!",
        description: "Nearby doctors have been notified. Help is on the way.",
      });

      setIsOpen(false);
      setFormData({
        name: "",
        phone: "",
        emergencyType: "",
        description: "",
        address: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send emergency alert",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg animate-pulse"
          >
            <AlertTriangle className="h-8 w-8" />
          </Button>
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Emergency Alert
          </DialogTitle>
          <DialogDescription>
            Fill in your details to alert nearby doctors immediately.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleEmergency} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyType">Emergency Type</Label>
            <Select value={formData.emergencyType} onValueChange={(value) => setFormData({ ...formData, emergencyType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select emergency type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardiac">Cardiac Emergency</SelectItem>
                <SelectItem value="breathing">Breathing Problems</SelectItem>
                <SelectItem value="injury">Injury/Accident</SelectItem>
                <SelectItem value="stroke">Stroke</SelectItem>
                <SelectItem value="allergic">Allergic Reaction</SelectItem>
                <SelectItem value="other">Other Medical Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Your current location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the emergency"
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Alert"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyButton;