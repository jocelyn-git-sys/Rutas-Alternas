import React, { useState } from 'react';
import MapaInteractivo from './components/MapaInteractivo';
import 'leaflet/dist/leaflet.css';

// ... en tu JSX principal:
<main>
  <MapaInteractivo lugaresFiltrados={lugaresFiltrados} />
</main>

// Datos de prueba con formato GeoJSON (Longitud, Latitud)
const lugaresIniciales = [
  {
    id: "loc_001",
    nombre: "Cenote Comunitario Colosio",
    categoria: "recreativo",
    especialidad: "Ecoturismo / Recreativo",
    colonia: "Luis Donaldo Colosio",
    contacto: { googleMapsUrl: "https://maps.google.com/?q=20.6450,-87.0650" },
    ubicacion: { type: "Point", coordinates: [-87.0650, 20.6450] }
  },
  {
    id: "loc_002",
    nombre: "Oishii Ramen Colosio",
    categoria: "japonesa",
    especialidad: "Comida Japonesa",
    colonia: "Luis Donaldo Colosio",
    contacto: { googleMapsUrl: "https://maps.google.com/?q=20.6412,-87.0682" },
    ubicacion: { type: "Point", coordinates: [-87.0682, 20.6412] }
  },
  {
    id: "loc_003",
    nombre: "Fonda La Vecindad",
    categoria: "mexicana",
    especialidad: "Fondas / Comida Mexicana",
    colonia: "Ejido",
    contacto: { googleMapsUrl: "https://maps.google.com/?q=20.6280,-87.0850" },
    ubicacion: { type: "Point", coordinates: [-87.0850, 20.6280] }
  }
];

function App() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');

  // Filtrado de lugares según la categoría elegida
  const lugaresFiltrados = categoriaSeleccionada === 'todos'
    ? lugaresIniciales
    : lugaresIniciales.filter(lugar => lugar.categoria === categoriaSeleccionada);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{ backgroundColor: '#33CCCC', padding: '15px', textAlign: 'center', color: '#FFF' }}>
        <h1>Rutas Alternas Playa</h1>
        <p>Directorio y Mapa Interactivo de Lugares Recreativos y Gastronomía Local</p>
      </header>

      {/* Barra de Filtros */}
      <section style={{ backgroundColor: '#F1D78D', padding: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <label><strong>Filtrar por Especialidad:</strong></label>
        <select 
          value={categoriaSeleccionada} 
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px' }}
        >
          <option value="todos">Todas las opciones</option>
          <option value="recreativo">Espacios Recreativos y Cenotes Urbanos</option>
          <option value="japonesa">Comida Japonesa de Colonia</option>
          <option value="mexicana">Fondas y Gastronomía Tradicional</option>
        </select>
      </section>

      {/* Renderizado del Mapa Interactivo Real */}
      <main style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <MapaInteractivo lugaresFiltrados={lugaresFiltrados} />
      </main>
    </div>
  );
}

export default App;