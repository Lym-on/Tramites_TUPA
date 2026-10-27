// ============================================
// PLADDES UNSAAC - Mock Data
// ============================================

const MOCK_TRAMITES = [
  {
    id: 1,
    code: 'PA51007C22',
    title: 'Reserva de Matrícula',
    category: 'academico',
    cost: 15.00,
    costLabel: 'S/ 15.00',
    plazo: 5,
    office: 'Unidad de Trámite Documentario',
    officeKey: 'tramite',
    approves: 'Decanato de Facultad',
    requirements: [
      'Solicitud dirigida al Decano de la Facultad',
      'Recibo de pago por concepto de Reserva de Matrícula (S/ 15.00)',
      'Constancia de matrícula del último semestre cursado',
      'Documento de identidad (DNI o Carné Universitario) vigente',
    ],
    description: 'Permite al estudiante reservar su matrícula para el siguiente semestre académico, manteniendo su condición de estudiante regular sin cursar asignaturas.'
  },
  {
    id: 2,
    code: 'PA51003F07',
    title: 'Calificación de Expediente para Optar el Grado Académico de Bachiller',
    category: 'academico',
    cost: 415.00,
    costLabel: 'S/ 415.00',
    plazo: 20,
    office: 'Trámite Documentario / Secretaría',
    officeKey: 'tramite',
    approves: 'Decanato',
    requirements: [
      'Solicitud dirigida al Decano',
      'Recibo de pago por derecho de Grado de Bachiller (S/ 415.00)',
      'Certificado de estudios original completo',
      'Constancia de no adeudar bienes a la Universidad',
      'Constancia de no tener deudas en biblioteca',
      'Copia legalizada del DNI',
      '04 fotografías tamaño pasaporte a color con fondo blanco',
      'Acta de sustentación del trabajo de investigación o tesis (si aplica)',
    ],
    description: 'Procedimiento para la revisión y calificación del expediente del egresado que solicita obtener el Grado Académico de Bachiller.'
  },
  {
    id: 3,
    code: 'PA5100E965',
    title: 'Acceso a la Información Pública',
    category: 'informacion',
    cost: 0,
    costLabel: 'Gratuito (digital) / Copia S/ 0.10',
    plazo: 10,
    office: 'Dirección de Red de Comunicaciones',
    officeKey: 'comunicaciones',
    approves: 'Dirección de Red de Comunicaciones',
    requirements: [
      'Solicitud de acceso a la información (formulario disponible en la plataforma)',
      'Documento de identidad del solicitante',
      'Descripción precisa de la información solicitada',
      'Recibo de pago por reproducción de copias (si corresponde)',
    ],
    description: 'Derecho de toda persona a solicitar y recibir información de cualquier entidad pública, según la Ley N° 27806 de Transparencia y Acceso a la Información Pública.'
  }
];

const MOCK_EXPEDIENTES = [
  {
    id: 'EXP-2026-000123',
    tramiteId: 1,
    tramiteTitle: 'Reserva de Matrícula',
    asunto: 'Reserva de Matrícula 2026-II',
    usuario: 'ALBERT ERIK MOROCCO AMANCA',
    codigo: '231989',
    dni: '76543210',
    facultad: 'Ingeniería Eléctrica, Electrónica, Informática y Mecánica',
    carrera: 'Ingeniería Informática y de Sistemas',
    email: 'albert.morocco@unsaac.edu.pe',
    telefono: '984 567 890',
    fechaEnvio: '15/10/2026',
    fechaRecepcion: '15/10/2026 09:32',
    estado: 'observed',
    estadoLabel: 'Observado',
    oficinaActual: 'Unidad de Trámite Documentario',
    observacion: 'Falta adjuntar el recibo de pago del Banco de la Nación legible. El documento proporcionado no es legible y no se puede verificar el monto pagado.',
    requerimientos: 'Adjuntar nuevamente el voucher de pago en formato PDF con buena resolución.',
    archivos: [
      { name: 'solicitud_reserva_matricula.pdf', size: '245 KB' },
      { name: 'voucher_pago_borroso.pdf', size: '1.2 MB' },
    ],
    timeline: [
      { date: '15/10/2026 09:32', title: 'Solicitud Registrada', desc: 'Trámite registrado por el sistema', from: 'Sistema', to: 'Mesa de Partes', status: 'completed' },
      { date: '15/10/2026 10:15', title: 'Recibido en Mesa de Partes', desc: 'Expediente recibido y verificado parcialmente', from: 'Mesa de Partes', to: '-', status: 'completed', responsable: 'Juan Pérez García' },
      { date: '15/10/2026 14:45', title: 'Expediente Observado', desc: 'Falta adjuntar el recibo de pago del Banco de la Nación legible.', from: 'Mesa de Partes', to: '-', status: 'observed', responsable: 'Juan Pérez García' },
    ]
  },
  {
    id: 'EXP-2026-000119',
    tramiteId: 2,
    tramiteTitle: 'Calificación de Expediente para Optar el Grado Académico de Bachiller',
    asunto: 'Solicitud de Grado de Bachiller - Ing. Informática',
    usuario: 'ALBERT ERIK MOROCCO AMANCA',
    codigo: '231989',
    dni: '76543210',
    facultad: 'Ingeniería Eléctrica, Electrónica, Informática y Mecánica',
    carrera: 'Ingeniería Informática y de Sistemas',
    email: 'albert.morocco@unsaac.edu.pe',
    telefono: '984 567 890',
    fechaEnvio: '02/10/2026',
    fechaRecepcion: '02/10/2026 11:20',
    estado: 'derived',
    estadoLabel: 'Derivado',
    oficinaActual: 'Decanato de Facultad',
    observacion: null,
    archivos: [
      { name: 'solicitud_bachiller.pdf', size: '180 KB' },
      { name: 'certificado_estudios.pdf', size: '3.4 MB' },
      { name: 'constancia_no_adeudo.pdf', size: '120 KB' },
      { name: 'voucher_pago_bachiller.pdf', size: '890 KB' },
    ],
    timeline: [
      { date: '02/10/2026 11:20', title: 'Solicitud Registrada', desc: 'Trámite registrado por el sistema', from: 'Sistema', to: 'Mesa de Partes', status: 'completed' },
      { date: '02/10/2026 14:00', title: 'Recibido en Mesa de Partes', desc: 'Expediente recibido y verificado', from: 'Mesa de Partes', to: '-', status: 'completed', responsable: 'Juan Pérez García' },
      { date: '03/10/2026 09:30', title: 'Derivado a Secretaría Académica', desc: 'Expediente derivado para revisión de documentos académicos', from: 'Mesa de Partes', to: 'Secretaría Académica', status: 'completed', responsable: 'Juan Pérez García' },
      { date: '06/10/2026 16:00', title: 'Derivado a Decanato', desc: 'Documentación conforme. Derivado para aprobación del Decano.', from: 'Secretaría Académica', to: 'Decanato de Facultad', status: 'current', responsable: 'María López Quispe' },
    ]
  },
  {
    id: 'EXP-2026-000098',
    tramiteId: 1,
    tramiteTitle: 'Reserva de Matrícula',
    asunto: 'Reserva de Matrícula 2026-I',
    usuario: 'ALBERT ERIK MOROCCO AMANCA',
    codigo: '231989',
    dni: '76543210',
    facultad: 'Ingeniería Eléctrica, Electrónica, Informática y Mecánica',
    carrera: 'Ingeniería Informática y de Sistemas',
    email: 'albert.morocco@unsaac.edu.pe',
    telefono: '984 567 890',
    fechaEnvio: '10/03/2026',
    fechaRecepcion: '10/03/2026 08:45',
    estado: 'finished',
    estadoLabel: 'Finalizado',
    oficinaActual: 'Decanato de Facultad',
    observacion: null,
    archivos: [
      { name: 'solicitud_reserva.pdf', size: '220 KB' },
      { name: 'voucher_pago.pdf', size: '750 KB' },
      { name: 'resolucion_decanal_042-2026.pdf', size: '1.1 MB' },
    ],
    timeline: [
      { date: '10/03/2026 08:45', title: 'Solicitud Registrada', desc: 'Trámite registrado por el sistema', from: 'Sistema', to: 'Mesa de Partes', status: 'completed' },
      { date: '10/03/2026 10:30', title: 'Recibido en Mesa de Partes', desc: 'Expediente recibido', from: 'Mesa de Partes', to: '-', status: 'completed', responsable: 'Juan Pérez García' },
      { date: '10/03/2026 15:00', title: 'Derivado a Decanato', desc: 'Documentación conforme', from: 'Mesa de Partes', to: 'Decanato', status: 'completed', responsable: 'Juan Pérez García' },
      { date: '12/03/2026 11:00', title: 'Trámite Finalizado', desc: 'Resolución Decanal N° 042-2026-FIE-UNSAAC emitida. Reserva de matrícula aprobada.', from: 'Decanato', to: '-', status: 'completed', responsable: 'Dr. Carlos Huamán Ttica' },
    ]
  },
  {
    id: 'EXP-2026-000135',
    tramiteId: 3,
    tramiteTitle: 'Acceso a la Información Pública',
    asunto: 'Solicitud de Información - Presupuesto 2025',
    usuario: 'ROSA MARIA GUTIERREZ QUISPE',
    codigo: 'EXT-00042',
    dni: '45678123',
    facultad: '-',
    carrera: '-',
    email: 'rosa.gutierrez@gmail.com',
    telefono: '974 123 456',
    fechaEnvio: '20/10/2026',
    fechaRecepcion: '20/10/2026 14:10',
    estado: 'review',
    estadoLabel: 'En revisión',
    oficinaActual: 'Dirección de Red de Comunicaciones',
    observacion: null,
    archivos: [
      { name: 'solicitud_informacion_publica.pdf', size: '156 KB' },
    ],
    timeline: [
      { date: '20/10/2026 14:10', title: 'Solicitud Registrada', desc: 'Trámite registrado por el sistema', from: 'Sistema', to: 'Mesa de Partes', status: 'completed' },
      { date: '20/10/2026 15:30', title: 'Recibido en Mesa de Partes', desc: 'Expediente recibido y derivado', from: 'Mesa de Partes', to: 'Dir. Red de Comunicaciones', status: 'completed', responsable: 'Juan Pérez García' },
      { date: '21/10/2026 09:00', title: 'En Revisión', desc: 'Solicitud en proceso de revisión y recopilación de información.', from: 'Dir. Red de Comunicaciones', to: '-', status: 'current', responsable: 'Ing. Pedro Vargas C.' },
    ]
  },
  {
    id: 'EXP-2026-000140',
    tramiteId: 1,
    tramiteTitle: 'Reserva de Matrícula',
    asunto: 'Reserva de Matrícula - Semestre 2026-II',
    usuario: 'CARLOS QUISPE HUAMAN',
    codigo: '220145',
    dni: '71234567',
    facultad: 'Ciencias Sociales',
    carrera: 'Antropología',
    email: 'carlos.quispe@unsaac.edu.pe',
    telefono: '951 234 567',
    fechaEnvio: '22/10/2026',
    fechaRecepcion: '22/10/2026 10:05',
    estado: 'submitted',
    estadoLabel: 'Presentado',
    oficinaActual: 'Mesa de Partes',
    observacion: null,
    archivos: [
      { name: 'solicitud_reserva_cq.pdf', size: '210 KB' },
      { name: 'voucher_pago_cq.pdf', size: '650 KB' },
    ],
    timeline: [
      { date: '22/10/2026 10:05', title: 'Solicitud Registrada', desc: 'Trámite registrado por el sistema', from: 'Sistema', to: 'Mesa de Partes', status: 'current' },
    ]
  }
];

const MOCK_USERS_BY_ROLE = {
  estudiante: {
    nombre: 'ALBERT ERIK MOROCCO AMANCA',
    nombreCorto: 'Albert E. Morocco',
    iniciales: 'AE',
    usuario: '231989',
    pass: 'demo123',
    codigo: '231989',
    dni: '76543210',
    email: 'albert.morocco@unsaac.edu.pe',
    telefono: '984 567 890',
    facultad: 'Ingeniería Eléctrica, Electrónica, Informática y Mecánica',
    carrera: 'Ingeniería Informática y de Sistemas',
    tipo: 'Estudiante',
    rolLabel: 'Estudiante - 231989',
    oficina: 'Facultad de Ingeniería',
    direccion: 'Av. de la Cultura s/n, Cusco'
  },
  mesa: {
    nombre: 'JUAN PÉREZ GARCÍA',
    nombreCorto: 'Juan Pérez García',
    iniciales: 'JP',
    usuario: 'j.perez',
    pass: 'mesa123',
    codigo: 'MESA-042',
    dni: '10203040',
    email: 'j.perez@unsaac.edu.pe',
    telefono: '984 112 233',
    facultad: 'Administración Central',
    carrera: 'Personal Administrativo',
    tipo: 'Administrativo',
    rolLabel: 'Mesa de Partes - UTD',
    oficina: 'Unidad de Trámite Documentario (UTD)',
    direccion: 'Pabellón Paraninfo Universitario, Cusco'
  },
  oficina: {
    nombre: 'DR. CARLOS HUAMÁN TTICA',
    nombreCorto: 'Dr. Carlos Huamán',
    iniciales: 'CH',
    usuario: 'c.huaman',
    pass: 'oficina123',
    codigo: 'DOC-1089',
    dni: '20304050',
    email: 'c.huaman@unsaac.edu.pe',
    telefono: '984 998 877',
    facultad: 'Ingeniería Eléctrica, Electrónica, Informática y Mecánica',
    carrera: 'Decanato de Facultad',
    tipo: 'Docente / Autoridad',
    rolLabel: 'Decano - Fac. Ingeniería',
    oficina: 'Decanato - Fac. Ingeniería (DEC-FIE)',
    direccion: 'Ciudad Universitaria de Perayoc, Cusco'
  },
  admin: {
    nombre: 'ADMINISTRADOR DEL SISTEMA',
    nombreCorto: 'Admin PLADDES',
    iniciales: 'AD',
    usuario: 'admin',
    pass: 'admin123',
    codigo: 'TI-001',
    dni: '00000001',
    email: 'admin@unsaac.edu.pe',
    telefono: '984 000 001',
    facultad: 'Dirección de Tecnologías de Información (DTI)',
    carrera: 'Administración de Redes y Sistemas',
    tipo: 'Administrador TI',
    rolLabel: 'Administrador General - TI',
    oficina: 'Oficina de Tecnologías de Información',
    direccion: 'Rectorado UNSAAC, Cusco'
  }
};

let currentUser = MOCK_USERS_BY_ROLE.estudiante;
const MOCK_USER = MOCK_USERS_BY_ROLE.estudiante; // Compatibilidad hacia atrás

const MOCK_NOTIFICACIONES = [
  {
    id: 1,
    tipo: 'warning',
    titulo: 'Expediente Observado',
    mensaje: 'Su expediente EXP-2026-000123 ha sido observado. Motivo: Falta adjuntar el recibo de pago del Banco de la Nación legible.',
    fecha: '26/10/2026 14:30',
    tiempoRelativo: 'Hace 2 horas',
    leido: false,
    expId: 'EXP-2026-000123'
  },
  {
    id: 2,
    tipo: 'info',
    titulo: 'Trámite Derivado',
    mensaje: 'Su expediente EXP-2026-000119 ha sido derivado a Decanato de Facultad para aprobación.',
    fecha: '26/10/2026 09:15',
    tiempoRelativo: 'Hace 5 horas',
    leido: false,
    expId: 'EXP-2026-000119'
  },
  {
    id: 3,
    tipo: 'success',
    titulo: 'Trámite Finalizado',
    mensaje: 'Su expediente EXP-2026-000098 ha sido finalizado exitosamente. Resolución Decanal N° 042-2026 emitida.',
    fecha: '25/10/2026 16:00',
    tiempoRelativo: 'Ayer',
    leido: false,
    expId: 'EXP-2026-000098'
  },
  {
    id: 4,
    tipo: 'info',
    titulo: 'Correo Electrónico Enviado',
    mensaje: 'Se ha enviado una notificación por correo electrónico a albert.morocco@unsaac.edu.pe sobre el estado de su expediente EXP-2026-000123.',
    fecha: '26/10/2026 14:31',
    tiempoRelativo: 'Hace 2 horas',
    leido: true,
    expId: 'EXP-2026-000123'
  }
];

const MOCK_OFICINAS = [
  { id: 1, nombre: 'Unidad de Trámite Documentario', codigo: 'UTD', responsable: 'Juan Pérez García', activa: true, expedientes: 12 },
  { id: 2, nombre: 'Decanato - Fac. Ingeniería', codigo: 'DEC-FIE', responsable: 'Dr. Carlos Huamán Ttica', activa: true, expedientes: 8 },
  { id: 3, nombre: 'Secretaría Académica - FIE', codigo: 'SA-FIE', responsable: 'María López Quispe', activa: true, expedientes: 5 },
  { id: 4, nombre: 'Dirección de Red de Comunicaciones', codigo: 'DRC', responsable: 'Ing. Pedro Vargas C.', activa: true, expedientes: 3 },
  { id: 5, nombre: 'Rectorado', codigo: 'RECT', responsable: 'Dr. Ricardo Félix M.', activa: true, expedientes: 2 },
  { id: 6, nombre: 'Oficina de Grados y Títulos', codigo: 'OGT', responsable: 'Lic. Ana Torres P.', activa: true, expedientes: 15 },
  { id: 7, nombre: 'Decanato - Fac. Ciencias Sociales', codigo: 'DEC-FCS', responsable: 'Dr. Luis Condori Q.', activa: true, expedientes: 4 },
  { id: 8, nombre: 'Biblioteca Central', codigo: 'BIBLIO', responsable: 'Mg. Elena Ríos V.', activa: false, expedientes: 0 },
];

const MOCK_USUARIOS_ADMIN = [
  { id: 1, nombre: 'Juan Pérez García', email: 'j.perez@unsaac.edu.pe', rol: 'Mesa de Partes', oficina: 'UTD', estado: 'Activo', ultimoAcceso: '26/10/2026' },
  { id: 2, nombre: 'María López Quispe', email: 'm.lopez@unsaac.edu.pe', rol: 'Responsable de Oficina', oficina: 'SA-FIE', estado: 'Activo', ultimoAcceso: '25/10/2026' },
  { id: 3, nombre: 'Dr. Carlos Huamán Ttica', email: 'c.huaman@unsaac.edu.pe', rol: 'Responsable de Oficina', oficina: 'DEC-FIE', estado: 'Activo', ultimoAcceso: '26/10/2026' },
  { id: 4, nombre: 'Ing. Pedro Vargas C.', email: 'p.vargas@unsaac.edu.pe', rol: 'Responsable de Oficina', oficina: 'DRC', estado: 'Activo', ultimoAcceso: '24/10/2026' },
  { id: 5, nombre: 'Admin Sistema', email: 'admin@unsaac.edu.pe', rol: 'Administrador', oficina: 'TI', estado: 'Activo', ultimoAcceso: '26/10/2026' },
  { id: 6, nombre: 'Lic. Ana Torres P.', email: 'a.torres@unsaac.edu.pe', rol: 'Responsable de Oficina', oficina: 'OGT', estado: 'Activo', ultimoAcceso: '23/10/2026' },
  { id: 7, nombre: 'Carlos Mendoza R.', email: 'c.mendoza@unsaac.edu.pe', rol: 'Mesa de Partes', oficina: 'UTD', estado: 'Inactivo', ultimoAcceso: '10/09/2026' },
];

const MOCK_AUDIT_LOG = [
  { fecha: '26/10/2026 14:45', accion: 'Expediente EXP-2026-000123 observado', usuario: 'Juan Pérez García', tipo: 'warning' },
  { fecha: '26/10/2026 14:31', accion: 'Notificación por email enviada a albert.morocco@unsaac.edu.pe', usuario: 'Sistema', tipo: 'info' },
  { fecha: '26/10/2026 10:05', accion: 'Nuevo expediente EXP-2026-000140 registrado', usuario: 'Carlos Quispe Huaman', tipo: 'info' },
  { fecha: '25/10/2026 16:00', accion: 'Expediente EXP-2026-000098 finalizado', usuario: 'Dr. Carlos Huamán Ttica', tipo: 'success' },
  { fecha: '24/10/2026 09:30', accion: 'Usuario c.mendoza@unsaac.edu.pe desactivado', usuario: 'Admin Sistema', tipo: 'warning' },
  { fecha: '23/10/2026 11:15', accion: 'Nuevo trámite TUPA "Certificado de Estudios" creado', usuario: 'Admin Sistema', tipo: 'info' },
  { fecha: '22/10/2026 15:40', accion: 'Configuración de tamaño máximo de archivo actualizada a 50 MB', usuario: 'Admin Sistema', tipo: 'info' },
  { fecha: '21/10/2026 09:00', accion: 'Sesión iniciada desde IP 190.237.XX.XX', usuario: 'Admin Sistema', tipo: 'info' },
];

const FAQ_DATA = [
  { q: '¿Cómo puedo realizar un trámite?', a: 'Para realizar un trámite, ingrese a la sección "Trámite Virtual" desde el portal público o desde su Intranet. Seleccione el trámite que desea realizar del catálogo TUPA, complete el formulario en 4 pasos y envíe su solicitud. Recibirá un número de expediente para hacer seguimiento.' },
  { q: '¿Cómo hago seguimiento a mi trámite?', a: 'Puede hacer seguimiento de dos formas: 1) Desde el portal público usando la opción "Verificar / Seguir Trámite" con su número de expediente. 2) Desde su Intranet en la sección "Hacer Seguimiento" o en "Mis Trámites".' },
  { q: '¿Qué hago si mi trámite fue observado?', a: 'Si su trámite fue observado, recibirá una notificación por email y en el sistema. Ingrese al detalle del expediente, revise el motivo de observación y use el botón "Subsanar Observación" para adjuntar los documentos corregidos.' },
  { q: '¿Cuáles son los formatos de archivo permitidos?', a: 'Los formatos permitidos son PDF, ZIP, DOCX y XLSX. El tamaño máximo por archivo es de 50 MB.' },
  { q: '¿Cómo puedo realizar el pago de mi trámite?', a: 'Los pagos se realizan a través del Banco de la Nación o la plataforma de recaudación de la UNSAAC (servicios.unsaac.edu.pe/recaudacion). Una vez realizado el pago, adjunte el voucher durante el proceso de registro del trámite.' },
  { q: '¿Cuánto tiempo tarda en resolverse mi trámite?', a: 'El tiempo de resolución depende del tipo de trámite según el TUPA. Puede consultar los plazos en el catálogo de trámites. Los plazos se cuentan en días hábiles a partir de la recepción del expediente completo.' },
];
