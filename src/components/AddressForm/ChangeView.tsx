import { Marker as LeafletMarker } from "leaflet";
import { locationForm } from "../../utils/types";
import { Marker, Popup, useMap } from "react-leaflet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ChangeView: React.FC<{
  location: locationForm;
  setLocation: React.Dispatch<React.SetStateAction<locationForm | null>>;
}> = ({ location, setLocation }) => {
  const map = useMap();
  const markerRef = useRef<LeafletMarker<any>>(null);
  const [markerLocation, setMarkerLocation] = useState<locationForm | null>(
    null
  );

  // dragging and stop
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          map.setView([lat, lng]);
          setMarkerLocation({
            latitude: lat,
            longitude: lng,
          });

          setLocation({
            latitude: lat,
            longitude: lng,
          });
        }
      },
    }),
    []
  );

  const onMove = useCallback(() => {
    const locationCenter = map.getCenter();
    if (locationCenter !== undefined) {
      const { lat, lng } = locationCenter;
      setMarkerLocation({
        latitude: lat,
        longitude: lng,
      });
    }
  }, [map]);

  useEffect(() => {
    setMarkerLocation(location);
  }, []);

  useEffect(() => {
    map.on("move", onMove);
    return () => {
      map.off("move", onMove);
    };
  }, [map, onMove]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const locationCenter = map.getCenter();
      if (locationCenter !== undefined) {
        const { lat, lng } = locationCenter;
        setLocation({
          latitude: lat,
          longitude: lng,
        });
      }
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [markerLocation]);

  if (markerLocation === null) return null;

  return (
    <Marker
      ref={markerRef}
      position={[markerLocation.latitude, markerLocation.longitude]}
      eventHandlers={eventHandlers}
      draggable={true}
    >
      <Popup>This is your address.</Popup>
    </Marker>
  );
};

export default ChangeView;
