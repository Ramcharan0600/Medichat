import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";

// Real LPU GPS Coordinates
const nodeCoords = {
  "Chemist": [31.2562, 75.7052],
  "UniMall": [31.2529, 75.7033],
  "BH1": [31.2547, 75.6983],
  "BH2": [31.2545, 75.6970],
  "BH3": [31.2543, 75.6958],
  "BH4": [31.2541, 75.6946],
  "BH5": [31.2539, 75.6934],
  "Block34": [31.2540, 75.7030],
  "GH1": [31.2515, 75.7035],
  "GH2": [31.2510, 75.7025],
  "GH3": [31.2505, 75.7015],
};

// Component to handle smooth map panning
function ChangeView({ center, zoom = 17 }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { animate: true, duration: 1.5 });
    }
  }, [center, map, zoom]);
  return null;
}

export default function MapVisualizer({ path = [], currentStep = 0 }) {
  const currentPos = path[currentStep] ? nodeCoords[path[currentStep]] : [31.2559, 75.7032];
  const polylinePositions = path.map(node => nodeCoords[node]).filter(Boolean);

  // Divide path into "traveled" and "upcoming"
  const traveledPositions = polylinePositions.slice(0, currentStep + 1);
  const upcomingPositions = polylinePositions.slice(currentStep);

  // Custom Icons
  const hubIcon = L.divIcon({
    html: `<div style="background: rgba(26, 42, 86, 0.2); width: 6px; height: 6px; border-radius: 50%; border: 1px solid #fff;"></div>`,
    className: 'custom-hub-icon',
    iconSize: [8, 8]
  });

  const startIcon = L.divIcon({
    html: `<div style="background: #ffffff; border: 2px solid var(--lpu-navy); width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2); font-size: 18px;">🏥</div>`,
    className: 'pharmacy-start-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  const deliveryIcon = L.divIcon({
    html: `<div style="font-size: 32px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); cursor: pointer;">🛵</div>`,
    className: 'custom-delivery-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  const destIcon = L.divIcon({
    html: `
      <div class="pulse-container">
        <div class="pulse-circle"></div>
        <div style="font-size: 28px; position: relative; z-index: 2;">📍</div>
      </div>
      <style>
        .pulse-container { position: relative; display: flex; align-items: center; justify-content: center; }
        .pulse-circle {
          position: absolute; width: 40px; height: 40px; background: rgba(235, 94, 40, 0.5);
          border-radius: 50%; animation: pulse 2s infinite; z-index: 1;
        }
        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
    `,
    className: 'dest-pulse-icon',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
  });

  return (
    <div className="map-view-container" style={{ 
      height: "450px", 
      width: "100%", 
      borderRadius: "24px", 
      overflow: "hidden", 
      border: "4px solid #fff",
      boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
      position: "relative",
      background: "#f1f5f9"
    }}>
      <MapContainer 
        center={[31.2559, 75.7032]} 
        zoom={17} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <ChangeView center={currentPos} zoom={currentStep === 0 ? 16 : 18} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Surroundings: All Campus Nodes */}
        {Object.entries(nodeCoords).map(([name, coords]) => (
          <Marker key={`hub-${name}`} position={coords} icon={hubIcon}>
            <Tooltip permanent direction="bottom" offset={[0, 5]} opacity={0.6} className="hub-tooltip">
              <span style={{fontSize: "9px", color: "#64748b"}}>{name}</span>
            </Tooltip>
            <Popup>{name} - LPU Central Hub</Popup>
          </Marker>
        ))}

        {/* Traveled Path (Lighter) */}
        {traveledPositions.length > 0 && (
          <Polyline 
            positions={traveledPositions} 
            color="#94a3b8" 
            weight={4} 
            opacity={0.5}
            dashArray="10, 10"
          />
        )}

        {/* Upcoming Path (Bold Navigation Style) */}
        {upcomingPositions.length > 0 && (
          <>
            <Polyline 
              positions={upcomingPositions} 
              color="#ffffff" 
              weight={10} 
              opacity={0.9}
            />
            <Polyline 
              positions={upcomingPositions} 
              color="var(--lpu-navy)" 
              weight={6} 
              opacity={1}
              lineJoin="round"
            />
          </>
        )}

        {/* Start Point Marker 🏥 */}
        {polylinePositions.length > 0 && (
          <Marker position={polylinePositions[0]} icon={startIcon}>
             <Tooltip permanent direction="top" offset={[0, -10]}>Pick-up: Pharmacy</Tooltip>
             <Popup><b>Pharmacy</b><br/>Order picked up here.</Popup>
          </Marker>
        )}

        {/* Destination Target 📍 */}
        {polylinePositions.length > 1 && (
            <Marker position={polylinePositions[polylinePositions.length - 1]} icon={destIcon}>
                <Tooltip permanent direction="top" offset={[0, -15]}>Drop-off: {path[path.length - 1]}</Tooltip>
                <Popup><b>Mission Goal</b><br/>Deliver to {path[path.length - 1]}</Popup>
            </Marker>
        )}

        {/* Live Delivery Agent 🛵 */}
        {currentPos && (
          <Marker position={currentPos} icon={deliveryIcon}>
            <Popup>
              <div style={{textAlign: "center"}}>
                  <strong style={{color: "var(--lpu-navy)"}}>LPU Express Agent</strong><br />
                  <span>En route to {path[currentStep + 1] || "Destination"}</span>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Zomato-style Overlay Info */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        right: "20px",
        background: "rgba(255,255,255,0.95)",
        padding: "12px 20px",
        borderRadius: "15px",
        zIndex: 1000,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #eee"
      }}>
        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
           <span style={{fontSize: "24px"}}>🛵</span>
           <div>
              <div style={{fontSize: "13px", fontWeight: 700, color: "var(--lpu-navy)"}}>
                Agent is at {path[currentStep] || "Hub"}
              </div>
              <div style={{fontSize: "11px", color: "#666"}}>Navigating Dijkstra Path</div>
           </div>
        </div>
        <div style={{fontSize: "12px", fontWeight: 700, color: "var(--lpu-orange)"}}>
           {polylinePositions.length - currentStep - 1} hubs left
        </div>
      </div>
    </div>
  );
}
