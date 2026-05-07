"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { MapPin, X, ShieldCheck } from "lucide-react";
import "leaflet/dist/leaflet.css";
import SafeImage from "../common/SafeImage";

// Fix Leaflet's broken default icon paths in Next.js
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// Default center: New Delhi
const DEFAULT_CENTER = [28.6139, 77.2090];
const DEFAULT_ZOOM = 11;

// Custom price pill marker
const createPriceIcon = (price, isActive = false) => {
  const bgColor = isActive ? "#0041C2" : "#FFFFFF";
  const textColor = isActive ? "#FFFFFF" : "#0F172A";
  const borderColor = isActive ? "#0041C2" : "#E2E8F0";

  return L.divIcon({
    className: "bg-transparent border-0",
    html: `
      <div style="
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translate(-50%, -10px);
        background-color: ${bgColor};
        color: ${textColor};
        border: 2px solid ${borderColor};
        padding: 6px 14px;
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 900;
        white-space: nowrap;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: ${isActive ? 999 : 1};
        letter-spacing: -0.02em;
      ">
        ₹${price >= 10000000 ? (price / 10000000).toFixed(2) + 'Cr' : (price / 100000).toFixed(1) + 'L'}
        <div style="
          position: absolute;
          left: 50%;
          bottom: -7px;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 7px solid ${bgColor};
        "></div>
      </div>
    `,
    iconAnchor: [0, 0],
  });
};

export default function PropertyMap({ hits }) {
  const [activeId, setActiveId] = useState(null);

  const propertiesWithCoords = hits.filter(
    (h) => h._geoloc?.lat && h._geoloc?.lng
  );

  const center =
    propertiesWithCoords.length > 0
      ? [propertiesWithCoords[0]._geoloc.lat, propertiesWithCoords[0]._geoloc.lng]
      : DEFAULT_CENTER;

  const activeHit = activeId ? propertiesWithCoords.find(h => h.objectID === activeId) : null;

  return (
    <div className="w-full h-full relative rounded-[32px] overflow-hidden border border-gray-100 z-10 bg-gray-50 shadow-inner">
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          padding: 0;
          overflow: hidden;
          border-radius: 24px;
          border: none;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          background: white;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          width: 260px !important;
        }
        .leaflet-container {
          background: #f8fafc;
        }
      `}</style>
      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />

        {propertiesWithCoords.map((hit) => (
          <Marker
            key={hit.objectID}
            position={[hit._geoloc.lat, hit._geoloc.lng]}
            icon={createPriceIcon(hit.price, activeId === hit.objectID)}
            eventHandlers={{
              click: () => setActiveId(hit.objectID)
            }}
          />
        ))}

        {activeHit && (
          <Popup
            position={[activeHit._geoloc.lat, activeHit._geoloc.lng]}
            offset={[0, -42]}
            closeButton={false}
            className="custom-popup"
          >
            <div className="w-full overflow-hidden">
              <div className="relative h-40">
                <SafeImage
                  src={activeHit.coverPhoto}
                  alt={activeHit.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => setActiveId(null)}
                  className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-[#0041C2] uppercase tracking-widest mb-1.5">
                  <ShieldCheck size={12} /> {activeHit.type}
                </div>
                <h4 className="font-black text-gray-900 text-sm leading-tight mb-2 truncate">
                  {activeHit.title}
                </h4>
                <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1 mb-4 truncate uppercase tracking-tighter">
                  <MapPin size={10} className="text-[#0041C2]" /> {activeHit.area}, {activeHit.city}
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-black text-lg text-gray-900 tracking-tighter">
                    ₹{activeHit.price?.toLocaleString('en-IN')}
                  </p>
                  <a
                    href={`/property/${activeHit.objectID}`}
                    className="text-[10px] font-black text-[#0041C2] uppercase tracking-widest hover:underline"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </MapContainer>

      {propertiesWithCoords.length === 0 && hits.length > 0 && (
        <div className="absolute inset-0 z-[1000] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
          <MapPin size={48} className="text-gray-300 mb-4" />
          <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-2">No locations available</h4>
          <p className="text-xs text-gray-500 font-medium max-w-[200px]">These properties were listed without precise map coordinates.</p>
        </div>
      )}
    </div>
  );
}
