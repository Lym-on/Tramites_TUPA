-- Creación de la tabla oficinas
CREATE TABLE IF NOT EXISTS oficinas (
    id_oficina INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_oficina TEXT NOT NULL,
    siglas TEXT NOT NULL
);

-- Creación de la tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    rol TEXT NOT NULL,
    id_oficina INTEGER,
    FOREIGN KEY (id_oficina) REFERENCES oficinas(id_oficina)
);

-- Insertar datos de prueba para la demostración
INSERT INTO oficinas (nombre_oficina, siglas) VALUES 
('Unidad de Trámite Documentario', 'UTD'),
('Decanato de Facultad', 'DEC'),
('Dirección de Red de Comunicaciones', 'DRC');