// src/utils/helpers.js

export const getRegionForCoordinates = (points) => {
    if (points.length === 0) return null;
  
    let minLat, maxLat, minLng, maxLng;
    
    // Initialize min and max with the first point
    minLat = maxLat = points[0].latitude;
    minLng = maxLng = points[0].longitude;
  
    // Iterate over points to find min and max
    points.forEach(point => {
      minLat = Math.min(minLat, point.latitude);
      maxLat = Math.max(maxLat, point.latitude);
      minLng = Math.min(minLng, point.longitude);
      maxLng = Math.max(maxLng, point.longitude);
    });
  
    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
  
    const latitudeDelta = (maxLat - minLat) * 1.5 || 0.05; // Add some padding
    const longitudeDelta = (maxLng - minLng) * 1.5 || 0.05; // Add some padding
  
    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta,
      longitudeDelta,
    };
  };
  