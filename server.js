const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexión a la Base de Datos MySQL en Railway
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || 'crossover.proxy.rlwy.net',
  port: process.env.MYSQLPORT || 33768,
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'hBtXXlbCiogrvTnKDTqyAtOwIvEoHfhI',
  database: process.env.MYSQLDATABASE || 'railway'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos de Railway:', err.message);
    return;
  }
  console.log('✅ ¡Conexión exitosa a la base de datos MySQL en Railway!');
});

// 2. Endpoint GET: Obtener todos los lugares
app.get('/api/lugares', (req, res) => {
  const sql = 'SELECT * FROM lugares ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const lugaresFormateados = results.map(lugar => ({
      id: lugar.id,
      nombre: lugar.nombre,
      categoria: lugar.categoria,
      especialidad: lugar.especialidad,
      colonia: lugar.colonia,
      latitud: parseFloat(lugar.latitud),
      longitud: parseFloat(lugar.longitud),
      coordenadas: [parseFloat(lugar.latitud), parseFloat(lugar.longitud)],
      mapsUrl: lugar.google_maps_url
    }));
    
    res.json(lugaresFormateados);
  });
});

// 3. Endpoint POST: Guardar un nuevo lugar
app.post('/api/lugares', (req, res) => {
  const { nombre, categoria, especialidad, colonia, latitud, longitud, google_maps_url } = req.body;
  const sql = 'INSERT INTO lugares (nombre, categoria, especialidad, colonia, latitud, longitud, google_maps_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
  db.query(sql, [nombre, categoria, especialidad, colonia, latitud, longitud, google_maps_url], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Lugar guardado exitosamente en Railway', id: result.insertId });
  });
});

// 4. Endpoint DELETE: Eliminar un lugar por ID
app.delete('/api/lugares/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM lugares WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Lugar no encontrado en la base de datos' });
    res.json({ message: 'Lugar eliminado correctamente' });
  });
});

// 5. Endpoint POST: Registro de usuario
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const sql = 'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'El correo electrónico ya se encuentra registrado' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Usuario registrado con éxito', id: result.insertId });
  });
});

// 6. Endpoint POST: Iniciar sesión y validar credenciales
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Por favor ingresa tu correo y contraseña' });
  }

  const sql = 'SELECT id, username, email FROM usuarios WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos. Regístrate si aún no tienes cuenta.' });
    }

    res.json({
      message: 'Inicio de sesión exitoso',
      usuario: results[0]
    });
  });
});

// Iniciar Servidor API
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend corriendo en http://localhost:${PORT}`);
});