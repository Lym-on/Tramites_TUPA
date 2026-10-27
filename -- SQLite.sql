-- Habilitar el soporte para llaves foráneas en SQLite
PRAGMA foreign_keys = ON;

-- 1. TABLA DE OFICINAS
CREATE TABLE IF NOT EXISTS oficinas (
    id_oficina INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_oficina TEXT NOT NULL,
    siglas TEXT NOT NULL
);

-- 2. TABLA DE USUARIOS Y ROLES
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    rol TEXT NOT NULL, -- Visitante, Solicitante, Mesa de Partes, Responsable Oficina, Admin
    id_oficina INTEGER,
    FOREIGN KEY (id_oficina) REFERENCES oficinas(id_oficina)
);

-- 3. CATÁLOGO DE TRÁMITES (TUPA 2025)
CREATE TABLE IF NOT EXISTS tramites_tupa (
    id_tramite INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_tupa TEXT NOT NULL UNIQUE,
    denominacion TEXT NOT NULL,
    costo REAL NOT NULL,
    plazo_dias_habiles INTEGER NOT NULL,
    id_oficina_aprobacion INTEGER,
    FOREIGN KEY (id_oficina_aprobacion) REFERENCES oficinas(id_oficina)
);

-- 4. REQUISITOS POR TRÁMITE
CREATE TABLE IF NOT EXISTS requisitos_tramite (
    id_requisito INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tramite INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    es_obligatorio INTEGER DEFAULT 1, -- 1 = Verdadero, 0 = Falso
    FOREIGN KEY (id_tramite) REFERENCES tramites_tupa(id_tramite)
);

-- 5. TABLA DE EXPEDIENTES (SOLICITUDES)
CREATE TABLE IF NOT EXISTS expedientes (
    id_expediente INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_expediente TEXT NOT NULL UNIQUE, -- ej. EXP-2026-0001
    id_solicitante INTEGER NOT NULL,
    id_tramite INTEGER NOT NULL,
    id_oficina_actual INTEGER NOT NULL,
    estado_actual TEXT NOT NULL DEFAULT 'PRESENTADO', -- BORRADOR, PRESENTADO, EN_REVISION, OBSERVADO, SUBSANADO, DERIVADO, FINALIZADO
    fecha_presentacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATETIME,
    FOREIGN KEY (id_solicitante) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_tramite) REFERENCES tramites_tupa(id_tramite),
    FOREIGN KEY (id_oficina_actual) REFERENCES oficinas(id_oficina)
);

-- 6. ARCHIVOS ADJUNTOS
CREATE TABLE IF NOT EXISTS adjuntos_expediente (
    id_adjunto INTEGER PRIMARY KEY AUTOINCREMENT,
    id_expediente INTEGER NOT NULL,
    id_requisito INTEGER,
    nombre_archivo TEXT NOT NULL,
    ruta_almacenamiento TEXT NOT NULL,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_expediente) REFERENCES expedientes(id_expediente),
    FOREIGN KEY (id_requisito) REFERENCES requisitos_tramite(id_requisito)
);

-- 7. HISTORIAL Y TRAZABILIDAD (LÍNEA DE TIEMPO)
CREATE TABLE IF NOT EXISTS historial_expediente (
    id_historial INTEGER PRIMARY KEY AUTOINCREMENT,
    id_expediente INTEGER NOT NULL,
    estado_anterior TEXT,
    estado_nuevo TEXT NOT NULL,
    id_oficina_origen INTEGER,
    id_oficina_destino INTEGER,
    id_usuario_accion INTEGER NOT NULL,
    comentario TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_expediente) REFERENCES expedientes(id_expediente),
    FOREIGN KEY (id_oficina_origen) REFERENCES oficinas(id_oficina),
    FOREIGN KEY (id_oficina_destino) REFERENCES oficinas(id_oficina),
    FOREIGN KEY (id_usuario_accion) REFERENCES usuarios(id_usuario)
);

-- ==========================================
-- INSERCIÓN DE DATOS INICIALES (MOCK DATA)
-- ==========================================

-- Insertar Oficinas principales
INSERT INTO oficinas (nombre_oficina, siglas) VALUES 
('Unidad de Trámite Documentario', 'UTD'),
('Decanato de la Facultad', 'DEC'),
('Dirección de Red de Comunicaciones', 'DRC'),
('Secretaría de Sede', 'SEC');

-- Insertar Trámites representativos del TUPA
INSERT INTO tramites_tupa (codigo_tupa, denominacion, costo, plazo_dias_habiles, id_oficina_aprobacion) VALUES 
('PA51007C22', 'Reserva de Matrícula', 15.00, 5, 2),
('PA51003F07', 'Calificación de Expediente para Optar el Grado Académico de Bachiller', 415.00, 20, 2),
('PA5100E965', 'Acceso a la Información Pública', 0.00, 10, 3);

-- Insertar Requisitos por Trámite
INSERT INTO requisitos_tramite (id_tramite, descripcion) VALUES 
(1, 'Solicitud dirigida al Rector con sustento correspondiente'),
(1, 'Ficha de seguimiento académico'),
(1, 'Comprobante de pago de S/ 15.00'),
(2, 'Solicitud en formato oficial'),
(2, 'Certificado de estudios concluidos'),
(2, 'Fotografía tamaño carné y comprobante de S/ 415.00'),
(3, 'Formulario de solicitud con descripción precisa de la información requerida');

-- Insertar Usuarios de Prueba
INSERT INTO usuarios (nombre, correo, rol, id_oficina) VALUES 
('Juan Pérez (Estudiante)', 'juan.perez@unsaac.edu.pe', 'Solicitante', NULL),
('María López (Mesa de Partes)', 'mlopez@unsaac.edu.pe', 'Mesa de Partes', 1),
('Carlos Quispe (Decanato)', 'cquispe@unsaac.edu.pe', 'Responsable Oficina', 2),
('Admin Sistema', 'admin@unsaac.edu.pe', 'Admin', NULL);

-- Insertar Expediente de Ejemplo
INSERT INTO expedientes (codigo_expediente, id_solicitante, id_tramite, id_oficina_actual, estado_actual) VALUES 
('EXP-2026-0001', 1, 1, 1, 'PRESENTADO');

-- Insertar primer evento en el Historial
INSERT INTO historial_expediente (id_expediente, estado_anterior, estado_nuevo, id_oficina_origen, id_oficina_destino, id_usuario_accion, comentario) VALUES 
(1, NULL, 'PRESENTADO', 1, 1, 1, 'Solicitud registrada por el estudiante desde la plataforma web');