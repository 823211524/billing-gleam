interface LocationData {
  latitude: number;
  longitude: number;
}

export const validateMeterLocation = (
  meterLocation: LocationData,
  readingLocation: LocationData,
  maxDistanceKm: number = 0.1
): boolean => {
  const R = 6371; // Earth's radius in kilometers
  const lat1 = meterLocation.latitude * Math.PI / 180;
  const lat2 = readingLocation.latitude * Math.PI / 180;
  const dLat = (readingLocation.latitude - meterLocation.latitude) * Math.PI / 180;
  const dLon = (readingLocation.longitude - meterLocation.longitude) * Math.PI / 180;

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return distance <= maxDistanceKm;
};