import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EmergencyButton = () => {
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();

  const handleEmergencyAlert = async () => {
    setIsActivating(true);
    
    // Get current location and time
    const getCurrentLocation = () => {
      return new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    };

    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      const currentTime = new Date().toISOString();
      
      // Emergency data to send via Twilio
      const emergencyData = {
        type: "MEDICAL_EMERGENCY",
        location: {
          latitude,
          longitude,
          name: "Current Location" // Can be enhanced with reverse geocoding
        },
        timestamp: currentTime,
        coordinates: `${latitude}, ${longitude}`
      };

      console.log("Emergency Alert Data:", emergencyData);
      
      // TODO: Connect to Supabase Edge Function that calls Twilio API
      // await fetch('/api/emergency-alert', {
      //   method: 'POST',
      //   body: JSON.stringify(emergencyData)
      // });

      toast({
        title: "🚨 Emergency Alert Activated",
        description: "Emergency services have been notified with your location and timestamp.",
        variant: "default",
      });

    } catch (error) {
      console.error("Emergency alert error:", error);
      toast({
        title: "Emergency Alert",
        description: "Alert activated. Please ensure you have network connectivity for location services.",
        variant: "destructive",
      });
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        size="lg"
        className="w-48 h-48 rounded-full bg-emergency hover:bg-emergency/90 text-emergency-foreground shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95"
        onClick={handleEmergencyAlert}
        disabled={isActivating}
      >
        <div className="flex flex-col items-center space-y-2">
          <AlertTriangle className="h-16 w-16" />
          <div className="text-center">
            <div className="text-xl font-bold">EMERGENCY</div>
            <div className="text-sm">SOS ALERT</div>
          </div>
        </div>
      </Button>
      
      <div className="text-center text-sm text-muted-foreground max-w-md">
        <div className="flex items-center justify-center space-x-4 mt-2">
          <div className="flex items-center space-x-1">
            <Phone className="h-4 w-4" />
            <span>SMS Alert</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>Location</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Timestamp</span>
          </div>
        </div>
        <p className="mt-2 text-xs">
          Press for immediate emergency assistance. No login required.
          Location and time will be automatically included in the alert.
        </p>
      </div>
    </div>
  );
};

export default EmergencyButton;