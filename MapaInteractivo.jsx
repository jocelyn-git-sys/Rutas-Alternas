import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ícono de marcador personalizado con los colores del proyecto (Warm Coral #FF8080)
const iconoCoral = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const MapaInteractivo = ({ lugaresFiltrados, onSeleccionarLugar }) => {
  // Centro inicial de la vista en Playa del Carmen
  const centroPlaya = [20.6296, -87.0739];

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
      <MapContainer 
        center={centroPlaya} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {lugaresFiltrados.map((lugar) => (
          <Marker
            key={lugar.id || lugar._id}
            // Mapeo GeoJSON: [Longitud, Latitud] -> Leaflet exige: [Latitud, Longitud]
            position={[lugar.ubicacion.coordinates[1], lugar.ubicacion.coordinates[0]]}
            icon={iconoCoral}
            eventHandlers={{
              click: () => onSeleccionarLugar && onSeleccionarLugar(lugar),
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong style={{ color: '#2E4F4F', fontSize: '14px' }}>{lugar.nombre}</strong><br />
                <span style={{ fontSize: '12px', color: '#666' }}>{lugar.colonia}</span><br />
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#33CCCC' }}>
                  {lugar.especialidad}
                </span><br />
                {lugar.contacto?.googleMapsUrl && (
                  <a 
                    href={lugar.contacto.googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'inline-block', 
                      marginTop: '6px', 
                      padding: '4px 8px', 
                      backgroundColor: '#FF8080', 
                      color: '#FFF', 
                      borderRadius: '4px', 
                      textDecoration: 'none',
                      fontSize: '11px'
                    }}
                  >
                    Cómo Llegar (Maps)
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};