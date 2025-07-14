import { useEffect, useRef } from 'react';

interface EmergencyMapProps {
  doctorLocation: { lat: number; lng: number };
  emergencyLocation: { lat: number; lng: number };
}

const EmergencyMap = ({ doctorLocation, emergencyLocation }: EmergencyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    const mapboxToken = 'pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY2x2ajBqcWtnMDgzczJrbzNlZ2tnamJiayJ9.1KSB7FyAl2eGKp-0d5jP3w'; // Temporary token
    
    if (!mapContainer.current || map.current) return;

    // For now, show a placeholder map since we need Mapbox token
    if (mapContainer.current) {
      mapContainer.current.innerHTML = `
        <div class="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <div class="text-lg font-semibold mb-2">Emergency Location Map</div>
            <div class="text-sm text-gray-600 mb-4">
              Emergency: ${emergencyLocation.lat.toFixed(6)}, ${emergencyLocation.lng.toFixed(6)}
            </div>
            <div class="text-sm text-gray-600">
              Doctor: ${doctorLocation.lat.toFixed(6)}, ${doctorLocation.lng.toFixed(6)}
            </div>
            <div class="mt-4 p-4 bg-blue-50 rounded border">
              <div class="text-sm font-medium text-blue-800">Map Integration Ready</div>
              <div class="text-xs text-blue-600 mt-1">
                Add your Mapbox token to display the interactive map with shortest path
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // If mapbox token is available, we could load the actual map here
    // import('mapbox-gl').then((mapboxgl) => {
    //   mapboxgl.accessToken = mapboxToken;
    //   map.current = new mapboxgl.Map({
    //     container: mapContainer.current,
    //     style: 'mapbox://styles/mapbox/streets-v11',
    //     center: [emergencyLocation.lng, emergencyLocation.lat],
    //     zoom: 12
    //   });
    //   
    //   // Add markers and route
    // });

  }, [doctorLocation, emergencyLocation]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-96 rounded-lg shadow-lg"
    />
  );
};

export default EmergencyMap;