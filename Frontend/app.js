// ============================================
// PLADDES UNSAAC - Application Logic
// ============================================

// -- State --
let currentRole = 'estudiante';
let currentPage = 'dashboard';
let wizardStep = 1;
let selectedTramite = null;
let sidebarOpen = false;

// -- Module Navigation --
function showModule(moduleId) {
  document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
  document.getElementById(moduleId).classList.add('active');
  closeAllPanels();
  if (moduleId === 'module-public') {
    showPublicView('public-catalog');
  }
  if (moduleId === 'module-intranet') {
    navigateTo('dashboard');
  }
}

// -- Public Views --
function showPublicView(viewId) {
  document.querySelectorAll('.public-view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
}

function showPublicTracking() {
  showPublicView('public-tracking');
}

// -- Catalog --
function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  grid.innerHTML = MOCK_TRAMITES.map(t => `
    <div class="tramite-card animate-in" data-id="${t.id}" data-category="${t.category}" data-office="${t.officeKey}" data-cost="${t.cost}">
      <span class="card-code">${t.code}</span>
      <h3>${t.title}</h3>
      <div class="card-info">
        <div class="info-row">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          <span>Costo: <strong>${t.costLabel}</strong></span>
        </div>
        <div class="info-row">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Plazo: <strong>${t.plazo} días hábiles</strong></span>
        </div>
        <div class="info-row">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>${t.office}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn btn-primary btn-sm" onclick="showDetail(${t.id})">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Ver detalle
        </button>
        <button class="btn btn-accent btn-sm" onclick="startWizard(${t.id})">Iniciar Trámite</button>
      </div>
    </div>
  `).join('');
}

function filterCatalog() {
  const search = document.getElementById('catalog-search').value.toLowerCase();
  const category = document.getElementById('filter-category').value;
  const office = document.getElementById('filter-office').value;
  const cost = document.getElementById('filter-cost').value;

  document.querySelectorAll('.tramite-card').forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const cat = card.dataset.category;
    const off = card.dataset.office;
    const c = parseFloat(card.dataset.cost);

    let show = true;
    if (search && !title.includes(search)) show = false;
    if (category && cat !== category) show = false;
    if (office && off !== office) show = false;
    if (cost === 'free' && c > 0) show = false;
    if (cost === 'paid' && c === 0) show = false;

    card.style.display = show ? '' : 'none';
  });
}

// -- Detail --
function showDetail(tramiteId) {
  selectedTramite = MOCK_TRAMITES.find(t => t.id === tramiteId);
  if (!selectedTramite) return;

  const container = document.getElementById('detail-content');
  container.innerHTML = `
    <div class="detail-header">
      <span class="detail-code">${selectedTramite.code}</span>
      <h2>${selectedTramite.title}</h2>
      <p style="color: var(--text-secondary); font-size: 15px; max-width: 700px;">${selectedTramite.description}</p>
    </div>
    <div class="detail-grid">
      <div class="detail-requirements">
        <h3>
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Requisitos TUPA
        </h3>
        <ul class="requirements-list">
          ${selectedTramite.requirements.map(r => `
            <li onclick="this.classList.toggle('checked')">
              <span class="check-icon"></span>
              <span>${r}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="detail-sidebar">
        <div class="detail-info-card">
          <h4>Costo</h4>
          <div class="info-value gold">${selectedTramite.costLabel}</div>
          <p>Según TUPA vigente</p>
        </div>
        <div class="detail-info-card">
          <h4>Plazo de Atención</h4>
          <div class="info-value">${selectedTramite.plazo}</div>
          <p>Días hábiles</p>
        </div>
        <div class="detail-info-card">
          <h4>Oficina Receptora</h4>
          <p style="font-size: 14px; font-weight: 500; color: var(--text-primary); margin-top: 0;">${selectedTramite.office}</p>
        </div>
        <div class="detail-info-card">
          <h4>Autoridad que Aprueba</h4>
          <p style="font-size: 14px; font-weight: 500; color: var(--text-primary); margin-top: 0;">${selectedTramite.approves}</p>
        </div>
      </div>
    </div>
    <button class="btn btn-primary btn-float" onclick="startWizard(${selectedTramite.id})">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
      Iniciar Solicitud
    </button>
  `;
  showPublicView('public-detail');
}

// -- Wizard --
function startWizard(tramiteId, fromIntranet = false) {
  selectedTramite = MOCK_TRAMITES.find(t => t.id === tramiteId);
  if (!selectedTramite) return;
  wizardStep = 1;

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const solNum = 'SOL-' + now.getFullYear() + '-' + String(Math.floor(Math.random() * 999999)).padStart(6, '0');

  const autoFill = fromIntranet ? MOCK_USER : null;

  const container = document.getElementById('wizard-content');
  container.innerHTML = `
    <div class="wizard-container">
      <div class="wizard-header">
        <div class="wizard-header-info">
          <h2>${selectedTramite.title}</h2>
          <p>Código TUPA: ${selectedTramite.code}</p>
        </div>
        <div class="wizard-meta">
          <div class="meta-date">Fecha: ${dateStr}</div>
          <div class="meta-id">${solNum}</div>
        </div>
      </div>

      <div class="stepper">
        <div class="step active" data-step="1">
          <div class="step-circle">1</div>
          <div class="step-label">Datos del Interesado</div>
        </div>
        <div class="step" data-step="2">
          <div class="step-circle">2</div>
          <div class="step-label">Datos de Petición</div>
        </div>
        <div class="step" data-step="3">
          <div class="step-circle">3</div>
          <div class="step-label">Documentos</div>
        </div>
        <div class="step" data-step="4">
          <div class="step-circle">4</div>
          <div class="step-label">Confirmación</div>
        </div>
      </div>

      <div class="wizard-body">
        <!-- Step 1 -->
        <div class="wizard-step-content active" id="wstep-1">
          <h3 style="margin-bottom: 20px; font-size: 18px;">Datos del Interesado</h3>
          <div class="form-group">
            <label>Tipo de Solicitante</label>
            <select class="form-control" id="wiz-tipo">
              <option value="Estudiante" ${autoFill?.tipo === 'Estudiante' ? 'selected' : ''}>Estudiante</option>
              <option value="Docente">Docente</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Público General">Público General</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Código / DNI</label>
              <input type="text" class="form-control" id="wiz-codigo" placeholder="Ej: 231989" value="${autoFill ? autoFill.codigo : ''}">
            </div>
            <div class="form-group">
              <label>DNI</label>
              <input type="text" class="form-control" id="wiz-dni" placeholder="Ej: 76543210" value="${autoFill ? autoFill.dni : ''}">
            </div>
          </div>
          <div class="form-group">
            <label>Nombres y Apellidos Completos</label>
            <input type="text" class="form-control" id="wiz-nombre" placeholder="Nombres completos" value="${autoFill ? autoFill.nombre : ''}">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Facultad</label>
              <select class="form-control" id="wiz-facultad">
                <option value="">Seleccione...</option>
                <option value="Ingeniería Eléctrica, Electrónica, Informática y Mecánica" ${autoFill?.facultad.includes('Ingeniería') ? 'selected' : ''}>Fac. Ingeniería Eléctrica, Electrónica, Informática y Mecánica</option>
                <option value="Ciencias Sociales">Fac. Ciencias Sociales</option>
                <option value="Derecho y Ciencias Políticas">Fac. Derecho y Ciencias Políticas</option>
                <option value="Medicina Humana">Fac. Medicina Humana</option>
                <option value="Ciencias Administrativas">Fac. Ciencias Administrativas, Contables, Económicas y Turismo</option>
              </select>
            </div>
            <div class="form-group">
              <label>Escuela Profesional</label>
              <input type="text" class="form-control" id="wiz-carrera" placeholder="Carrera profesional" value="${autoFill ? autoFill.carrera : ''}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Teléfono</label>
              <input type="tel" class="form-control" id="wiz-telefono" placeholder="Ej: 984 567 890" value="${autoFill ? autoFill.telefono : ''}">
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input type="email" class="form-control" id="wiz-email" placeholder="correo@unsaac.edu.pe" value="${autoFill ? autoFill.email : ''}">
            </div>
          </div>
          <div class="form-group">
            <label>Dirección</label>
            <input type="text" class="form-control" id="wiz-direccion" placeholder="Dirección completa" value="${autoFill ? autoFill.direccion : ''}">
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="wiz-notif" checked>
            <label for="wiz-notif">Acepto recibir notificaciones electrónicas sobre el estado de mi trámite en el correo electrónico proporcionado. <strong>(Obligatorio)</strong></label>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="wizard-step-content" id="wstep-2">
          <h3 style="margin-bottom: 20px; font-size: 18px;">Datos de la Petición</h3>
          <div class="form-group">
            <label>Asunto del Trámite</label>
            <input type="text" class="form-control" id="wiz-asunto" placeholder="Ej: Solicitud de Reserva de Matrícula 2026-II">
          </div>
          <div class="form-group">
            <label>Fundamentación / Explicación</label>
            <textarea class="form-control" id="wiz-fundamento" rows="6" placeholder="Explique detalladamente el motivo de su solicitud..."></textarea>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="wizard-step-content" id="wstep-3">
          <h3 style="margin-bottom: 20px; font-size: 18px;">Documentos y Adjuntos</h3>
          <div class="dropzone" onclick="document.getElementById('file-input').click()" ondragover="event.preventDefault(); this.classList.add('active')" ondragleave="this.classList.remove('active')" ondrop="event.preventDefault(); this.classList.remove('active'); handleFileDrop(event)">
            <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <p><strong>Arrastra tus archivos aquí</strong> o haz clic para seleccionar</p>
            <p class="formats">Formatos: PDF, ZIP, DOCX, XLSX — Máx. 50 MB</p>
            <input type="file" id="file-input" style="display:none" multiple accept=".pdf,.zip,.docx,.xlsx">
          </div>
          <div id="file-list" style="margin-top: 16px;"></div>
          <div class="form-group" style="margin-top: 24px;">
            <label>Número / Clave de Voucher de Pago <strong style="color: #EF4444;">*</strong></label>
            <input type="text" class="form-control" id="wiz-voucher" placeholder="Ej: OP-2026-12345678">
          </div>
        </div>

        <!-- Step 4 -->
        <div class="wizard-step-content" id="wstep-4">
          <h3 style="margin-bottom: 20px; font-size: 18px;">Confirmación y Envío</h3>
          <p style="color: var(--text-secondary); margin-bottom: 24px;">Revise los datos ingresados antes de enviar su solicitud.</p>
          <div id="wizard-preview"></div>
        </div>
      </div>

      <div class="wizard-footer">
        <button class="btn btn-ghost" id="wizard-prev" onclick="wizardPrev()" style="display:none;">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Anterior
        </button>
        <div style="flex:1;"></div>
        <button class="btn btn-primary" id="wizard-next" onclick="wizardNext()">
          Siguiente
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
  `;

  if (fromIntranet) {
    // Show wizard inside intranet
    renderIntranetPage('registrar', container.innerHTML);
  } else {
    showPublicView('public-wizard');
  }
}

function wizardNext() {
  if (wizardStep === 4) {
    submitWizard();
    return;
  }
  if (wizardStep === 3) {
    buildPreview();
  }
  wizardStep++;
  updateWizardUI();
}

function wizardPrev() {
  if (wizardStep <= 1) return;
  wizardStep--;
  updateWizardUI();
}

function updateWizardUI() {
  document.querySelectorAll('.wizard-step-content').forEach(s => s.classList.remove('active'));
  const stepEl = document.getElementById(`wstep-${wizardStep}`);
  if (stepEl) stepEl.classList.add('active');

  document.querySelectorAll('.step').forEach(s => {
    const n = parseInt(s.dataset.step);
    s.classList.remove('active', 'completed');
    if (n === wizardStep) s.classList.add('active');
    if (n < wizardStep) s.classList.add('completed');
  });

  const prevBtn = document.getElementById('wizard-prev');
  const nextBtn = document.getElementById('wizard-next');
  if (prevBtn) prevBtn.style.display = wizardStep > 1 ? '' : 'none';
  if (nextBtn) {
    if (wizardStep === 4) {
      nextBtn.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Enviar Trámite
      `;
      nextBtn.className = 'btn btn-success';
    } else {
      nextBtn.innerHTML = `
        Siguiente
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      `;
      nextBtn.className = 'btn btn-primary';
    }
  }
}

function buildPreview() {
  const preview = document.getElementById('wizard-preview');
  if (!preview) return;

  const getValue = (id) => {
    const el = document.getElementById(id);
    if (!el) return '-';
    if (el.tagName === 'SELECT') return el.options[el.selectedIndex]?.text || '-';
    return el.value || '-';
  };

  preview.innerHTML = `
    <div class="preview-section">
      <h4>
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Datos del Interesado
      </h4>
      <div class="preview-grid">
        <div class="preview-item"><div class="label">Tipo</div><div class="value">${getValue('wiz-tipo')}</div></div>
        <div class="preview-item"><div class="label">Código</div><div class="value">${getValue('wiz-codigo')}</div></div>
        <div class="preview-item"><div class="label">DNI</div><div class="value">${getValue('wiz-dni')}</div></div>
        <div class="preview-item"><div class="label">Nombre</div><div class="value">${getValue('wiz-nombre')}</div></div>
        <div class="preview-item"><div class="label">Facultad</div><div class="value">${getValue('wiz-facultad')}</div></div>
        <div class="preview-item"><div class="label">Carrera</div><div class="value">${getValue('wiz-carrera')}</div></div>
        <div class="preview-item"><div class="label">Teléfono</div><div class="value">${getValue('wiz-telefono')}</div></div>
        <div class="preview-item"><div class="label">Email</div><div class="value">${getValue('wiz-email')}</div></div>
      </div>
    </div>
    <div class="preview-section">
      <h4>
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Datos de la Petición
      </h4>
      <div class="preview-grid">
        <div class="preview-item"><div class="label">Asunto</div><div class="value">${getValue('wiz-asunto')}</div></div>
        <div class="preview-item"><div class="label">Voucher</div><div class="value">${getValue('wiz-voucher')}</div></div>
      </div>
      <div class="preview-item" style="margin-top: 8px;"><div class="label">Fundamentación</div><div class="value" style="white-space: pre-wrap;">${getValue('wiz-fundamento')}</div></div>
    </div>
    <div class="preview-section">
      <h4>
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Trámite Seleccionado
      </h4>
      <div class="preview-grid">
        <div class="preview-item"><div class="label">Trámite</div><div class="value">${selectedTramite?.title || '-'}</div></div>
        <div class="preview-item"><div class="label">Código TUPA</div><div class="value">${selectedTramite?.code || '-'}</div></div>
        <div class="preview-item"><div class="label">Costo</div><div class="value">${selectedTramite?.costLabel || '-'}</div></div>
        <div class="preview-item"><div class="label">Plazo</div><div class="value">${selectedTramite?.plazo || '-'} días hábiles</div></div>
      </div>
    </div>
  `;
}

function submitWizard() {
  const expCode = 'EXP-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 999999)).padStart(6, '0');
  const verCode = 'VER-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  showModal(`
    <div class="confirmation-screen">
      <div class="confirmation-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>
      <h2>¡Trámite Enviado Exitosamente!</h2>
      <p style="color: var(--text-secondary);">Su solicitud ha sido registrada en el sistema.</p>
      <div class="exp-code">${expCode}</div>
      <p class="verification-code">Código de verificación: <strong>${verCode}</strong></p>
      <div class="confirmation-actions">
        <button class="btn btn-outline" onclick="copyToClipboard('${expCode}')">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copiar Expediente
        </button>
        <button class="btn btn-primary" onclick="closeModal(); showToast('PDF de constancia descargado', 'success');">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Descargar Constancia PDF
        </button>
      </div>
    </div>
  `);
}

function handleFileDrop(event) {
  const files = event.dataTransfer?.files;
  if (files) updateFileList(files);
}

function updateFileList(files) {
  const list = document.getElementById('file-list');
  if (!list) return;
  let html = '';
  for (const f of files) {
    html += `
      <div class="attachment-item">
        <div class="file-icon">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div class="file-info">
          <div class="file-name">${f.name}</div>
          <div class="file-size">${(f.size / 1024).toFixed(1)} KB</div>
        </div>
      </div>
    `;
  }
  list.innerHTML = html;
}

// -- Tracking Search --
function searchExpedient() {
  const query = document.getElementById('tracking-input').value.trim();
  const result = document.getElementById('tracking-result');

  const exp = MOCK_EXPEDIENTES.find(e => e.id === query || e.dni === query || e.codigo === query);

  if (!exp) {
    result.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <h3>No se encontraron resultados</h3>
        <p>Verifica el número de expediente o DNI ingresado.</p>
      </div>
    `;
    return;
  }

  result.innerHTML = `
    <div class="tracking-result-card">
      <div class="tracking-result-header">
        <div>
          <h3 style="font-size: 18px; font-weight: 700;">${exp.id}</h3>
          <p style="font-size: 13px; color: var(--text-muted);">${exp.asunto}</p>
        </div>
        <span class="badge badge-dot badge-${exp.estado}">${exp.estadoLabel}</span>
      </div>
      <div class="tracking-result-body">
        <div class="preview-grid" style="margin-bottom: 24px;">
          <div class="preview-item"><div class="label">Solicitante</div><div class="value">${exp.usuario}</div></div>
          <div class="preview-item"><div class="label">Fecha de Envío</div><div class="value">${exp.fechaEnvio}</div></div>
          <div class="preview-item"><div class="label">Oficina Actual</div><div class="value">${exp.oficinaActual}</div></div>
          <div class="preview-item"><div class="label">Trámite</div><div class="value">${exp.tramiteTitle}</div></div>
        </div>
        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 16px;">Historial de Movimientos</h4>
        <div class="timeline">
          ${exp.timeline.map(t => `
            <div class="timeline-item ${t.status}">
              <div class="timeline-dot"></div>
              <div class="timeline-date">${t.date}</div>
              <div class="timeline-title">${t.title}</div>
              <div class="timeline-desc">${t.desc}</div>
              ${t.responsable ? `<div class="timeline-meta">Responsable: ${t.responsable}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// -- Login & Role Switcher Helpers --
function onLoginRoleChange(role) {
  const profile = MOCK_USERS_BY_ROLE[role] || MOCK_USERS_BY_ROLE.estudiante;
  const userInput = document.getElementById('login-user');
  const passInput = document.getElementById('login-pass');
  if (userInput) userInput.value = profile.usuario;
  if (passInput) passInput.value = profile.pass;

  // Update active chip
  document.querySelectorAll('.role-chip').forEach(c => c.classList.remove('active'));
  const activeChip = document.getElementById(`chip-${role}`);
  if (activeChip) activeChip.classList.add('active');
}

function quickSelectRole(role) {
  const roleSelect = document.getElementById('login-role');
  if (roleSelect) roleSelect.value = role;
  onLoginRoleChange(role);
}

// -- Login --
function handleLogin(event) {
  if (event) event.preventDefault();
  const roleSelect = document.getElementById('login-role');
  const role = roleSelect ? roleSelect.value : 'estudiante';
  currentRole = role;
  applyRole(role);
  showModule('module-intranet');
  const profile = MOCK_USERS_BY_ROLE[role] || MOCK_USERS_BY_ROLE.estudiante;
  showToast(`¡Bienvenido! Sesión iniciada como ${profile.nombreCorto} (${profile.rolLabel})`, 'success');
}

function togglePassword() {
  const input = document.getElementById('login-pass');
  if (input) input.type = input.type === 'password' ? 'text' : 'password';
}

// -- Role Management --
function applyRole(role) {
  currentRole = role;
  currentUser = MOCK_USERS_BY_ROLE[role] || MOCK_USERS_BY_ROLE.estudiante;

  // Update Body classes for role-based CSS rules
  document.body.className = '';
  if (role === 'mesa' || role === 'oficina') {
    document.body.classList.add('role-mesa', 'role-oficina');
  } else if (role === 'admin') {
    document.body.classList.add('role-admin', 'role-mesa', 'role-oficina');
  }

  // Update header role dropdown
  const roleSelect = document.getElementById('header-role-switch');
  if (roleSelect) roleSelect.value = role;

  // Update User Profile in Intranet Header
  const userAvatar = document.querySelector('.user-avatar');
  if (userAvatar) userAvatar.textContent = currentUser.iniciales;

  const userNameEl = document.getElementById('user-display-name');
  if (userNameEl) userNameEl.textContent = currentUser.nombreCorto;

  const userRoleEl = document.getElementById('user-display-role');
  if (userRoleEl) userRoleEl.textContent = currentUser.rolLabel;

  navigateTo('dashboard');
}

function switchRole(role) {
  applyRole(role);
  const profile = MOCK_USERS_BY_ROLE[role] || MOCK_USERS_BY_ROLE.estudiante;
  showToast(`Rol cambiado a: ${profile.rolLabel}`, 'info');
}

// -- Sidebar --
function toggleSidebar() {
  sidebarOpen = !sidebarOpen;
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open', sidebarOpen);

  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.onclick = () => toggleSidebar();
    document.getElementById('module-intranet').appendChild(overlay);
  }
  overlay.classList.toggle('active', sidebarOpen);
}

// -- Intranet Navigation --
function navigateTo(page) {
  currentPage = page;

  // Update active sidebar link
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`.sidebar-link[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add('active');

  closeAllPanels();

  const main = document.getElementById('intranet-main');
  main.innerHTML = '';

  switch (page) {
    case 'dashboard': renderDashboard(main); break;
    case 'registrar': renderRegistrar(main); break;
    case 'seguimiento': renderSeguimiento(main); break;
    case 'mis-tramites': renderMisTramites(main); break;
    case 'notificaciones': renderNotificaciones(main); break;
    case 'ticket': renderTicket(main); break;
    case 'ayuda': renderAyuda(main); break;
    case 'reportes': renderReportes(main); break;
    case 'bandeja-entrada': renderBandejaEntrada(main); break;
    case 'derivar': renderDerivar(main); break;
    case 'historial-gestion': renderHistorialGestion(main); break;
    case 'admin-usuarios': renderAdminUsuarios(main); break;
    case 'admin-oficinas': renderAdminOficinas(main); break;
    case 'admin-tupa': renderAdminTupa(main); break;
    case 'admin-config': renderAdminConfig(main); break;
    case 'admin-reportes': renderAdminReportes(main); break;
    case 'admin-audit': renderAdminAudit(main); break;
    default: renderDashboard(main);
  }

  // Close mobile sidebar
  if (sidebarOpen) toggleSidebar();
}

function renderIntranetPage(page, html) {
  const main = document.getElementById('intranet-main');
  main.innerHTML = html;
}

// -- Dashboard --
function renderDashboard(container) {
  // 1. ADMIN DASHBOARD
  if (currentRole === 'admin') {
    container.innerHTML = `
      <div class="welcome-banner" style="background: linear-gradient(135deg, #4A0E17 0%, #8B1E2D 100%);">
        <div>
          <h2>¡Panel de Administración - ${currentUser.nombreCorto}!</h2>
          <p>Supervisión centralizada del sistema PLADDES UNSAAC, usuarios, oficinas y auditoría.</p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-accent btn-sm" onclick="navigateTo('admin-usuarios')">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            Gestionar Usuarios
          </button>
          <button class="btn btn-outline btn-sm" style="color:white;border-color:rgba(255,255,255,0.4);" onclick="navigateTo('admin-tupa')">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
            Catálogo TUPA
          </button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-total animate-in">
          <div class="kpi-header">
            <span class="kpi-label">Usuarios del Sistema</span>
            <div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
          </div>
          <div class="kpi-value">${MOCK_USUARIOS_ADMIN.length}</div>
          <div class="kpi-change positive">6 activos hoy</div>
        </div>
        <div class="kpi-card kpi-review animate-in">
          <div class="kpi-header">
            <span class="kpi-label">Oficinas Conectadas</span>
            <div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg></div>
          </div>
          <div class="kpi-value">${MOCK_OFICINAS.filter(o => o.activa).length}</div>
          <div class="kpi-change positive">100% operativas</div>
        </div>
        <div class="kpi-card kpi-finished animate-in">
          <div class="kpi-header">
            <span class="kpi-label">Trámites TUPA</span>
            <div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg></div>
          </div>
          <div class="kpi-value">${MOCK_TRAMITES.length}</div>
          <div class="kpi-change positive">Vigentes 2026</div>
        </div>
        <div class="kpi-card kpi-observed animate-in">
          <div class="kpi-header">
            <span class="kpi-label">Eventos Auditoría</span>
            <div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
          </div>
          <div class="kpi-value">${MOCK_AUDIT_LOG.length}</div>
          <div class="kpi-change positive">Registros trazables</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Últimos Eventos de Auditoría del Sistema</h3>
          <button class="btn btn-ghost btn-sm" onclick="navigateTo('admin-audit')">Ver bitácora completa</button>
        </div>
        <div class="card-body" style="padding:0;">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Fecha / Hora</th><th>Acción Registrada</th><th>Usuario Responsable</th><th>Tipo</th></tr></thead>
              <tbody>
                ${MOCK_AUDIT_LOG.slice(0, 5).map(l => `
                  <tr>
                    <td><code style="font-size:12px;">${l.fecha}</code></td>
                    <td><strong>${l.accion}</strong></td>
                    <td>${l.usuario}</td>
                    <td><span class="badge badge-dot badge-${l.tipo === 'warning' ? 'observed' : l.tipo === 'success' ? 'finished' : 'submitted'}">${l.tipo}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // 2. MESA DE PARTES / RESPONSABLE DE OFICINA DASHBOARD
  if (currentRole === 'mesa' || currentRole === 'oficina') {
    const pending = MOCK_EXPEDIENTES.filter(e => e.estado !== 'finished');
    const observed = MOCK_EXPEDIENTES.filter(e => e.estado === 'observed').length;
    const derived = MOCK_EXPEDIENTES.filter(e => e.estado === 'derived').length;
    const finished = MOCK_EXPEDIENTES.filter(e => e.estado === 'finished').length;

    container.innerHTML = `
      <div class="welcome-banner">
        <div>
          <h2>¡Bienvenido, ${currentUser.nombreCorto}!</h2>
          <p>Bandeja operativa: <strong>${currentUser.oficina}</strong> - Calificación y derivación de expedientes.</p>
        </div>
        <button class="btn btn-accent" onclick="navigateTo('bandeja-entrada')">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
          Ir a Bandeja de Entrada
        </button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-total animate-in">
          <div class="kpi-header"><span class="kpi-label">Expedientes en Bandeja</span><div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg></div></div>
          <div class="kpi-value">${pending.length}</div>
          <div class="kpi-change positive">Pendientes de gestión</div>
        </div>
        <div class="kpi-card kpi-observed animate-in">
          <div class="kpi-header"><span class="kpi-label">Observados</span><div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div></div>
          <div class="kpi-value">${observed}</div>
          <div class="kpi-change negative">Por subsanar</div>
        </div>
        <div class="kpi-card kpi-review animate-in">
          <div class="kpi-header"><span class="kpi-label">Derivados</span><div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div></div>
          <div class="kpi-value">${derived}</div>
          <div class="kpi-change positive">En tránsito</div>
        </div>
        <div class="kpi-card kpi-finished animate-in">
          <div class="kpi-header"><span class="kpi-label">Finalizados</span><div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div></div>
          <div class="kpi-value">${finished}</div>
          <div class="kpi-change positive">Concluidos</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Expedientes Pendientes de Calificación y Gestión</h3>
          <button class="btn btn-ghost btn-sm" onclick="navigateTo('bandeja-entrada')">Ver todos en bandeja</button>
        </div>
        <div class="card-body" style="padding:0;">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>N° Expediente</th><th>Solicitante</th><th>Asunto</th><th>Fecha</th><th>Estado</th><th>Acciones Inmediatas</th></tr></thead>
              <tbody>
                ${pending.map(e => `
                  <tr>
                    <td><strong style="color:var(--primary)">${e.id}</strong></td>
                    <td>${e.usuario}</td>
                    <td>${e.asunto}</td>
                    <td>${e.fechaEnvio}</td>
                    <td><span class="badge badge-dot badge-${e.estado}">${e.estadoLabel}</span></td>
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-ghost btn-xs" onclick="showExpDetail('${e.id}')">Ver</button>
                        <button class="btn btn-primary btn-xs" onclick="showDerivarModal('${e.id}')">Derivar</button>
                        <button class="btn btn-warning btn-xs" onclick="showObservarModal('${e.id}')">Observar</button>
                        <button class="btn btn-success btn-xs" onclick="showFinalizarModal('${e.id}')">Finalizar</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // 3. ESTUDIANTE DASHBOARD
  const myExps = MOCK_EXPEDIENTES.filter(e => e.codigo === '231989');
  const active = myExps.filter(e => e.estado !== 'finished').length;
  const review = myExps.filter(e => e.estado === 'review').length;
  const observed = myExps.filter(e => e.estado === 'observed').length;
  const finished = myExps.filter(e => e.estado === 'finished').length;

  container.innerHTML = `
    <div class="welcome-banner">
      <h2>¡Bienvenido, ${currentUser.nombreCorto}!</h2>
      <p>Aquí encontrarás el resumen de tus trámites y actividades recientes en PLADDES.</p>
      <button class="btn btn-accent" onclick="navigateTo('registrar')">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nuevo Trámite
      </button>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card kpi-total animate-in">
        <div class="kpi-header">
          <span class="kpi-label">Total Trámites Activos</span>
          <div class="kpi-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
        </div>
        <div class="kpi-value">${active}</div>
        <div class="kpi-change positive">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          En seguimiento
        </div>
      </div>
      <div class="kpi-card kpi-review animate-in">
        <div class="kpi-header">
          <span class="kpi-label">En Revisión</span>
          <div class="kpi-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
        <div class="kpi-value">${review}</div>
        <div class="kpi-change positive">Procesando</div>
      </div>
      <div class="kpi-card kpi-observed animate-in">
        ${observed > 0 ? '<span class="urgent-badge">¡ATENCIÓN!</span>' : ''}
        <div class="kpi-header">
          <span class="kpi-label">Observados</span>
          <div class="kpi-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
        </div>
        <div class="kpi-value">${observed}</div>
        <div class="kpi-change negative">Requiere acción</div>
      </div>
      <div class="kpi-card kpi-finished animate-in">
        <div class="kpi-header">
          <span class="kpi-label">Finalizados</span>
          <div class="kpi-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>
        <div class="kpi-value">${finished}</div>
        <div class="kpi-change positive">Completados</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>Trámites Recientes</h3>
        <button class="btn btn-ghost btn-sm" onclick="navigateTo('mis-tramites')">Ver todos</button>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>N° Expediente</th>
                <th>Asunto</th>
                <th>Fecha</th>
                <th>Oficina Actual</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${myExps.map(e => `
                <tr>
                  <td><strong style="color: var(--primary);">${e.id}</strong></td>
                  <td>${e.asunto}</td>
                  <td>${e.fechaEnvio}</td>
                  <td>${e.oficinaActual}</td>
                  <td><span class="badge badge-dot badge-${e.estado}">${e.estadoLabel}</span></td>
                  <td>
                    <div class="table-actions">
                      <button class="btn btn-ghost btn-xs" onclick="showExpDetail('${e.id}')">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        Ver
                      </button>
                      ${e.estado === 'observed' ? `<button class="btn btn-warning btn-xs" onclick="showSubsanarModal('${e.id}')">Subsanar</button>` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// -- Registrar Trámite --
function renderRegistrar(container) {
  container.innerHTML = `
    <h1 class="page-title">Registrar Trámite</h1>
    <p class="page-subtitle">Seleccione el trámite que desea iniciar. Sus datos serán autocompletados.</p>
    <div class="catalog-grid">
      ${MOCK_TRAMITES.map(t => `
        <div class="tramite-card animate-in">
          <span class="card-code">${t.code}</span>
          <h3>${t.title}</h3>
          <div class="card-info">
            <div class="info-row">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              <span>Costo: <strong>${t.costLabel}</strong></span>
            </div>
            <div class="info-row">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Plazo: <strong>${t.plazo} días hábiles</strong></span>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="startIntranetWizard(${t.id})">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Iniciar Solicitud
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function startIntranetWizard(tramiteId) {
  selectedTramite = MOCK_TRAMITES.find(t => t.id === tramiteId);
  if (!selectedTramite) return;
  wizardStep = 1;

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const solNum = 'SOL-' + now.getFullYear() + '-' + String(Math.floor(Math.random() * 999999)).padStart(6, '0');
  const autoFill = currentUser || MOCK_USER;

  const main = document.getElementById('intranet-main');
  main.innerHTML = `
    <button class="btn-back" onclick="navigateTo('registrar')">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      Volver al catálogo
    </button>
    <div class="wizard-container">
      <div class="wizard-header">
        <div class="wizard-header-info">
          <h2>${selectedTramite.title}</h2>
          <p>Código TUPA: ${selectedTramite.code}</p>
        </div>
        <div class="wizard-meta">
          <div class="meta-date">Fecha: ${dateStr}</div>
          <div class="meta-id">${solNum}</div>
        </div>
      </div>
      <div class="stepper">
        <div class="step active" data-step="1"><div class="step-circle">1</div><div class="step-label">Datos del Interesado</div></div>
        <div class="step" data-step="2"><div class="step-circle">2</div><div class="step-label">Datos de Petición</div></div>
        <div class="step" data-step="3"><div class="step-circle">3</div><div class="step-label">Documentos</div></div>
        <div class="step" data-step="4"><div class="step-circle">4</div><div class="step-label">Confirmación</div></div>
      </div>
      <div class="wizard-body">
        <div class="wizard-step-content active" id="wstep-1">
          <h3 style="margin-bottom:20px;font-size:18px;">Datos del Interesado</h3>
          <div class="alert-banner info">
            <div class="alert-icon" style="background:rgba(37,99,235,0.1);color:#2563EB;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>
            <div class="alert-content">
              <h4>Datos autocompletados</h4>
              <p>Sus datos han sido cargados automáticamente desde su perfil de usuario.</p>
            </div>
          </div>
          <div class="form-group"><label>Tipo de Solicitante</label><select class="form-control" id="wiz-tipo"><option selected>Estudiante</option></select></div>
          <div class="form-row">
            <div class="form-group"><label>Código</label><input type="text" class="form-control" id="wiz-codigo" value="${autoFill.codigo}"></div>
            <div class="form-group"><label>DNI</label><input type="text" class="form-control" id="wiz-dni" value="${autoFill.dni}"></div>
          </div>
          <div class="form-group"><label>Nombres y Apellidos</label><input type="text" class="form-control" id="wiz-nombre" value="${autoFill.nombre}"></div>
          <div class="form-row">
            <div class="form-group"><label>Facultad</label><input type="text" class="form-control" id="wiz-facultad" value="${autoFill.facultad}"></div>
            <div class="form-group"><label>Escuela Profesional</label><input type="text" class="form-control" id="wiz-carrera" value="${autoFill.carrera}"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Teléfono</label><input type="tel" class="form-control" id="wiz-telefono" value="${autoFill.telefono}"></div>
            <div class="form-group"><label>Correo Electrónico</label><input type="email" class="form-control" id="wiz-email" value="${autoFill.email}"></div>
          </div>
          <div class="form-group"><label>Dirección</label><input type="text" class="form-control" id="wiz-direccion" value="${autoFill.direccion}"></div>
          <div class="checkbox-group"><input type="checkbox" id="wiz-notif" checked><label for="wiz-notif">Acepto recibir notificaciones electrónicas. <strong>(Obligatorio)</strong></label></div>
        </div>
        <div class="wizard-step-content" id="wstep-2">
          <h3 style="margin-bottom:20px;font-size:18px;">Datos de la Petición</h3>
          <div class="form-group"><label>Asunto</label><input type="text" class="form-control" id="wiz-asunto" placeholder="Ej: Solicitud de Reserva de Matrícula 2026-II"></div>
          <div class="form-group"><label>Fundamentación</label><textarea class="form-control" id="wiz-fundamento" rows="6" placeholder="Explique el motivo de su solicitud..."></textarea></div>
        </div>
        <div class="wizard-step-content" id="wstep-3">
          <h3 style="margin-bottom:20px;font-size:18px;">Documentos y Adjuntos</h3>
          <div class="dropzone" onclick="document.getElementById('file-input-2').click()">
            <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <p><strong>Arrastra tus archivos aquí</strong> o haz clic para seleccionar</p>
            <p class="formats">Formatos: PDF, ZIP, DOCX, XLSX — Máx. 50 MB</p>
            <input type="file" id="file-input-2" style="display:none" multiple>
          </div>
          <div id="file-list" style="margin-top:16px;"></div>
          <div class="form-group" style="margin-top:24px;"><label>Número de Voucher de Pago <strong style="color:#EF4444;">*</strong></label><input type="text" class="form-control" id="wiz-voucher" placeholder="Ej: OP-2026-12345678"></div>
        </div>
        <div class="wizard-step-content" id="wstep-4">
          <h3 style="margin-bottom:20px;font-size:18px;">Confirmación y Envío</h3>
          <p style="color:var(--text-secondary);margin-bottom:24px;">Revise los datos antes de enviar.</p>
          <div id="wizard-preview"></div>
        </div>
      </div>
      <div class="wizard-footer">
        <button class="btn btn-ghost" id="wizard-prev" onclick="wizardPrev()" style="display:none;">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> Anterior
        </button>
        <div style="flex:1;"></div>
        <button class="btn btn-primary" id="wizard-next" onclick="wizardNext()">
          Siguiente <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
  `;
}

// -- Seguimiento --
function renderSeguimiento(container) {
  container.innerHTML = `
    <h1 class="page-title">Hacer Seguimiento</h1>
    <p class="page-subtitle">Busca un expediente por su código para ver la línea de tiempo completa.</p>
    <div class="card">
      <div class="card-body">
        <div class="tracking-search-box" style="max-width:600px;">
          <input type="text" id="seg-input" placeholder="Ingrese N° de Expediente (Ej: EXP-2026-000123)" class="form-control">
          <button class="btn btn-primary" onclick="searchSeguimiento()">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Buscar
          </button>
        </div>
        <div id="seg-result" style="margin-top:24px;"></div>
      </div>
    </div>
  `;
}

function searchSeguimiento() {
  const query = document.getElementById('seg-input').value.trim();
  const result = document.getElementById('seg-result');
  const exp = MOCK_EXPEDIENTES.find(e => e.id === query);
  if (!exp) {
    result.innerHTML = '<div class="empty-state"><h3>No se encontró el expediente</h3><p>Verifica el código ingresado.</p></div>';
    return;
  }
  showExpDetail(exp.id);
}

// -- Mis Trámites --
function renderMisTramites(container) {
  const myExps = MOCK_EXPEDIENTES.filter(e => e.codigo === '231989');
  container.innerHTML = `
    <h1 class="page-title">Mis Trámites</h1>
    <p class="page-subtitle">Gestiona y haz seguimiento de todos tus trámites.</p>
    <div class="card">
      <div class="card-header">
        <div class="table-filters">
          <input type="text" class="filter-input" placeholder="Buscar por expediente o asunto..." id="mt-search" oninput="filterMisTramites()">
          <select id="mt-status-filter" onchange="filterMisTramites()">
            <option value="">Todos los estados</option>
            <option value="submitted">Presentado</option>
            <option value="review">En revisión</option>
            <option value="observed">Observado</option>
            <option value="derived">Derivado</option>
            <option value="finished">Finalizado</option>
          </select>
        </div>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrapper">
          <table class="data-table" id="mis-tramites-table">
            <thead>
              <tr>
                <th>N° Expediente</th>
                <th>Asunto</th>
                <th>Fecha de Envío</th>
                <th>Última Oficina</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${myExps.map(e => `
                <tr data-status="${e.estado}">
                  <td><strong style="color:var(--primary)">${e.id}</strong></td>
                  <td>${e.asunto}</td>
                  <td>${e.fechaEnvio}</td>
                  <td>${e.oficinaActual}</td>
                  <td><span class="badge badge-dot badge-${e.estado}">${e.estadoLabel}</span></td>
                  <td>
                    <div class="table-actions">
                      <button class="btn btn-ghost btn-xs" onclick="showExpDetail('${e.id}')">Ver detalle</button>
                      ${e.estado === 'observed' ? '<button class="btn btn-warning btn-xs" onclick="showSubsanarModal(\'' + e.id + '\')">Subsanar</button>' : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function filterMisTramites() {
  const search = document.getElementById('mt-search').value.toLowerCase();
  const statusFilter = document.getElementById('mt-status-filter').value;
  const rows = document.querySelectorAll('#mis-tramites-table tbody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const status = row.dataset.status;
    let show = true;
    if (search && !text.includes(search)) show = false;
    if (statusFilter && status !== statusFilter) show = false;
    row.style.display = show ? '' : 'none';
  });
}

// -- Expedition Detail --
function showExpDetail(expId) {
  const exp = MOCK_EXPEDIENTES.find(e => e.id === expId);
  if (!exp) return;

  const main = document.getElementById('intranet-main');
  main.innerHTML = `
    <button class="btn-back" onclick="navigateTo('mis-tramites')">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      Volver a Mis Trámites
    </button>

    <div class="exp-detail-header">
      <h2>${exp.id}</h2>
      <span class="badge badge-dot badge-${exp.estado}">${exp.estadoLabel}</span>
      <span class="exp-date">Recibido: ${exp.fechaRecepcion}</span>
    </div>

    ${exp.estado === 'observed' ? `
    <div class="alert-banner warning">
      <div class="alert-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div class="alert-content">
        <h4>Expediente Observado</h4>
        <p><strong>Motivo:</strong> ${exp.observacion}</p>
        <p><strong>Requerimiento:</strong> ${exp.requerimientos || 'Adjuntar documentos corregidos.'}</p>
        <button class="btn btn-warning btn-sm" onclick="showSubsanarModal('${exp.id}')">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Subsanar Observación
        </button>
      </div>
    </div>
    ` : ''}

    <div class="detail-grid">
      <div>
        <div class="card" style="margin-bottom:24px;">
          <div class="card-header"><h3>Línea de Tiempo</h3></div>
          <div class="card-body">
            <div class="timeline">
              ${exp.timeline.map(t => `
                <div class="timeline-item ${t.status}">
                  <div class="timeline-dot"></div>
                  <div class="timeline-date">${t.date}</div>
                  <div class="timeline-title">${t.title}</div>
                  <div class="timeline-desc">${t.desc}</div>
                  ${t.from && t.to ? `<div class="timeline-meta">${t.from} → ${t.to}</div>` : ''}
                  ${t.responsable ? `<div class="timeline-meta">Responsable: ${t.responsable}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="card" style="margin-bottom:24px;">
          <div class="card-header"><h3>Información del Expediente</h3></div>
          <div class="card-body">
            <div class="preview-item"><div class="label">Solicitante</div><div class="value">${exp.usuario}</div></div>
            <div class="preview-item"><div class="label">Asunto</div><div class="value">${exp.asunto}</div></div>
            <div class="preview-item"><div class="label">Trámite</div><div class="value">${exp.tramiteTitle}</div></div>
            <div class="preview-item"><div class="label">Fecha de Envío</div><div class="value">${exp.fechaEnvio}</div></div>
            <div class="preview-item"><div class="label">Oficina Actual</div><div class="value">${exp.oficinaActual}</div></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Archivos Adjuntos</h3></div>
          <div class="card-body">
            <div class="attachment-list">
              ${exp.archivos.map(a => `
                <div class="attachment-item">
                  <div class="file-icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                  <div class="file-info"><div class="file-name">${a.name}</div><div class="file-size">${a.size}</div></div>
                  <button class="btn btn-ghost btn-xs">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// -- Subsanar Modal --
function showSubsanarModal(expId) {
  showModal(`
    <div class="modal-header">
      <h3>Subsanar Observación</h3>
      <button class="modal-close" onclick="closeModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <p style="color:var(--text-secondary);margin-bottom:16px;">Expediente: <strong style="color:var(--primary);">${expId}</strong></p>
      <div class="form-group">
        <label>Comentario de Subsanación</label>
        <textarea id="subsanar-comentario" class="form-control" rows="3" placeholder="Describa las correcciones realizadas...">Se adjunta nuevo comprobante de pago legible emitido por el Banco de la Nación con código de operación verificado.</textarea>
      </div>
      <div class="form-group">
        <label>Adjuntar Documentos Corregidos (PDF, ZIP - Máx 50MB)</label>
        <div class="dropzone" style="padding:20px; text-align:center; border:2px dashed var(--accent); background:rgba(201,162,39,0.04); border-radius:10px;">
          <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px; color:var(--accent);"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p style="font-size:13px; font-weight:600; color:var(--text-primary); margin-top:8px;">voucher_banco_nacion_subsanado.pdf</p>
          <span style="font-size:12px; color:var(--text-muted);">1.1 MB • Listo para enviar</span>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="submitSubsanacion('${expId}')">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Enviar Subsanación
      </button>
    </div>
  `);
}

function submitSubsanacion(expId) {
  const exp = MOCK_EXPEDIENTES.find(e => e.id === expId);
  if (exp) {
    exp.estado = 'corrected';
    exp.estadoLabel = 'Subsanado';
    exp.observacion = null;
    if (!exp.archivos.some(a => a.name === 'voucher_banco_nacion_subsanado.pdf')) {
      exp.archivos.push({ name: 'voucher_banco_nacion_subsanado.pdf', size: '1.1 MB' });
    }
    exp.timeline.push({
      date: 'Hoy (Ahora)',
      title: 'Observación Subsanada',
      desc: 'El administrado subsanó los requisitos requeridos adjuntando nuevo voucher legible.',
      from: exp.usuario,
      to: exp.oficinaActual,
      status: 'completed',
      responsable: exp.usuario
    });
  }
  closeModal();
  showToast('¡Subsanación registrada con éxito! El estado cambió a Subsanado.', 'success');
  if (currentPage === 'mis-tramites') {
    navigateTo('mis-tramites');
  } else {
    showExpDetail(expId);
  }
}

// -- Notificaciones --
function renderNotificaciones(container) {
  container.innerHTML = `
    <h1 class="page-title">Mis Notificaciones</h1>
    <p class="page-subtitle">Historial de alertas y comunicaciones del sistema.</p>
    <div class="card">
      <div class="card-body" style="padding:0;">
        ${MOCK_NOTIFICACIONES.map(n => `
          <div class="notif-item ${!n.leido ? 'unread' : ''}" style="cursor:pointer;" onclick="showEmailPreview('${n.expId}')">
            <div class="notif-icon ${n.tipo}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                ${n.tipo === 'warning' ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' : ''}
                ${n.tipo === 'info' ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>' : ''}
                ${n.tipo === 'success' ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' : ''}
              </svg>
            </div>
            <div class="notif-content" style="flex:1;">
              <p><strong>${n.titulo}</strong></p>
              <p>${n.mensaje}</p>
              <span class="notif-time">${n.tiempoRelativo} • ${n.fecha}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div id="email-preview-container" style="margin-top:24px;">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:12px;">Vista Previa de Correo Electrónico</h3>
      <div class="email-preview">
        <div class="email-header-bar">
          <h4>PLADDES - UNSAAC</h4>
          <p>Sistema de Trámite Documentario</p>
        </div>
        <div class="email-body">
          <p>Estimado(a) <strong>ALBERT ERIK MOROCCO AMANCA</strong>,</p>
          <br>
          <p>Le informamos que su expediente <strong>EXP-2026-000123</strong> ha sido <strong style="color:var(--status-observed);">OBSERVADO</strong>.</p>
          <br>
          <p><strong>Motivo:</strong> Falta adjuntar el recibo de pago del Banco de la Nación legible.</p>
          <br>
          <p>Por favor, ingrese al sistema PLADDES para subsanar esta observación a la brevedad.</p>
          <br>
          <p>Atentamente,<br><strong>Unidad de Trámite Documentario</strong><br>UNSAAC</p>
        </div>
        <div class="email-footer-bar">
          Este es un correo electrónico automático generado por PLADDES - UNSAAC. No responda a este mensaje.
        </div>
      </div>
    </div>
  `;
}

function showEmailPreview(expId) {
  showToast('Vista previa del correo cargada', 'info');
}

// -- Ticket --
function renderTicket(container) {
  container.innerHTML = `
    <h1 class="page-title">Generar Ticket de Soporte</h1>
    <p class="page-subtitle">Reporte fallas o problemas técnicos en la plataforma.</p>
    <div class="card" style="max-width:680px;">
      <div class="card-body">
        <div class="form-group"><label>Asunto del Ticket</label><input type="text" class="form-control" placeholder="Ej: Error al adjuntar archivo PDF"></div>
        <div class="form-group"><label>Categoría</label>
          <select class="form-control">
            <option>Error en la plataforma</option>
            <option>Problema de acceso</option>
            <option>Consulta general</option>
            <option>Otro</option>
          </select>
        </div>
        <div class="form-group"><label>Descripción detallada</label><textarea class="form-control" rows="5" placeholder="Describa el problema con el mayor detalle posible..."></textarea></div>
        <div class="form-group"><label>Capturas de pantalla (opcional)</label>
          <div class="dropzone" style="padding:20px;">
            <p>Arrastra imágenes aquí o haz clic</p>
          </div>
        </div>
        <button class="btn btn-primary" onclick="showToast('Ticket enviado correctamente. N° TK-2026-0045', 'success');">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Enviar Ticket
        </button>
      </div>
    </div>
  `;
}

// -- Ayuda --
function renderAyuda(container) {
  container.innerHTML = `
    <h1 class="page-title">Centro de Ayuda</h1>
    <p class="page-subtitle">Encuentra respuestas a las preguntas más frecuentes.</p>
    <div style="max-width:720px;">
      <div style="margin-bottom:24px;">
        <input type="text" class="form-control" placeholder="Buscar en preguntas frecuentes..." oninput="filterFAQ(this.value)">
      </div>
      <div id="faq-container">
        ${FAQ_DATA.map((faq, i) => `
          <div class="accordion" id="faq-${i}" onclick="toggleAccordion(this)">
            <button class="accordion-header">
              <span>${faq.q}</span>
              <svg class="icon chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="accordion-body"><p>${faq.a}</p></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleAccordion(el) {
  el.classList.toggle('open');
}

function filterFAQ(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.accordion').forEach(acc => {
    const text = acc.textContent.toLowerCase();
    acc.style.display = text.includes(q) ? '' : 'none';
  });
}

// -- Reportes --
function renderReportes(container) {
  container.innerHTML = `
    <h1 class="page-title">Mi Resumen de Trámites</h1>
    <p class="page-subtitle">Panel analítico y métricas de tus trámites.</p>
    <div class="chart-container">
      <div class="card">
        <div class="card-header"><h3>Distribución por Estado</h3></div>
        <div class="card-body">
          <div class="bar-chart">
            <div class="bar-group">
              <div class="bar" style="height:30%;background:var(--status-review);"><span class="bar-value">1</span></div>
              <span class="bar-label">En proceso</span>
            </div>
            <div class="bar-group">
              <div class="bar" style="height:45%;background:var(--status-observed);"><span class="bar-value">1</span></div>
              <span class="bar-label">Observados</span>
            </div>
            <div class="bar-group">
              <div class="bar" style="height:15%;background:#EF4444;"><span class="bar-value">0</span></div>
              <span class="bar-label">Vencidos</span>
            </div>
            <div class="bar-group">
              <div class="bar" style="height:60%;background:var(--status-finished);"><span class="bar-value">1</span></div>
              <span class="bar-label">Finalizados</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Trámites por Oficina</h3></div>
        <div class="card-body">
          <div class="donut-chart-wrapper">
            <div class="donut-chart" style="background: conic-gradient(var(--primary) 0deg 120deg, var(--status-derived) 120deg 240deg, var(--status-review) 240deg 300deg, var(--status-submitted) 300deg 360deg);">
              <div class="donut-center">
                <span class="total">3</span>
                <span class="total-label">Total</span>
              </div>
            </div>
            <div class="donut-legend">
              <div class="legend-item"><div class="legend-dot" style="background:var(--primary)"></div>Trámite Documentario (1)</div>
              <div class="legend-item"><div class="legend-dot" style="background:var(--status-derived)"></div>Decanato (1)</div>
              <div class="legend-item"><div class="legend-dot" style="background:var(--status-review)"></div>Dir. Comunicaciones (1)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Detalle con Fecha Límite TUPA</h3></div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Expediente</th><th>Trámite</th><th>Fecha Envío</th><th>Plazo TUPA</th><th>Días Restantes</th><th>Estado</th></tr></thead>
            <tbody>
              <tr>
                <td><strong style="color:var(--primary)">EXP-2026-000123</strong></td>
                <td>Reserva de Matrícula</td>
                <td>15/10/2026</td>
                <td>5 días hábiles</td>
                <td><span style="color:#EF4444;font-weight:600;">Vencido (3 días)</span></td>
                <td><span class="badge badge-dot badge-observed">Observado</span></td>
              </tr>
              <tr>
                <td><strong style="color:var(--primary)">EXP-2026-000119</strong></td>
                <td>Grado de Bachiller</td>
                <td>02/10/2026</td>
                <td>20 días hábiles</td>
                <td><span style="color:var(--status-review);font-weight:600;">2 días</span></td>
                <td><span class="badge badge-dot badge-derived">Derivado</span></td>
              </tr>
              <tr>
                <td><strong style="color:var(--primary)">EXP-2026-000098</strong></td>
                <td>Reserva de Matrícula</td>
                <td>10/03/2026</td>
                <td>5 días hábiles</td>
                <td><span style="color:var(--status-finished);font-weight:600;">Completado</span></td>
                <td><span class="badge badge-dot badge-finished">Finalizado</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// -- Bandeja de Entrada (Mesa de Partes / Oficina) --
function renderBandejaEntrada(container) {
  container.innerHTML = `
    <h1 class="page-title">Bandeja de Entrada</h1>
    <p class="page-subtitle">Expedientes recibidos pendientes de gestión.</p>
    <div class="card">
      <div class="card-header">
        <div class="table-filters">
          <input type="text" class="filter-input" placeholder="Buscar expediente...">
          <select><option value="">Todos los estados</option><option>Presentado</option><option>En revisión</option></select>
        </div>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>N° Expediente</th><th>Solicitante</th><th>Asunto</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              ${MOCK_EXPEDIENTES.filter(e => e.estado !== 'finished').map(e => `
                <tr>
                  <td><strong style="color:var(--primary)">${e.id}</strong></td>
                  <td>${e.usuario}</td>
                  <td>${e.asunto}</td>
                  <td>${e.fechaEnvio}</td>
                  <td><span class="badge badge-dot badge-${e.estado}">${e.estadoLabel}</span></td>
                  <td>
                    <div class="table-actions">
                      <button class="btn btn-ghost btn-xs" onclick="showExpDetail('${e.id}')">Ver</button>
                      <button class="btn btn-primary btn-xs" onclick="showDerivarModal('${e.id}')">Derivar</button>
                      <button class="btn btn-warning btn-xs" onclick="showObservarModal('${e.id}')">Observar</button>
                      <button class="btn btn-success btn-xs" onclick="showFinalizarModal('${e.id}')">Finalizar</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// -- Derivar --
function renderDerivar(container) {
  container.innerHTML = `
    <h1 class="page-title">Derivar Expediente</h1>
    <p class="page-subtitle">Seleccione un expediente de la bandeja para derivar.</p>
    <div class="card" style="max-width:680px;">
      <div class="card-body">
        <div class="form-group"><label>N° de Expediente</label>
          <select class="form-control">
            ${MOCK_EXPEDIENTES.filter(e => e.estado !== 'finished').map(e => `<option value="${e.id}">${e.id} - ${e.asunto}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Oficina Destino</label>
          <select class="form-control">
            ${MOCK_OFICINAS.filter(o => o.activa).map(o => `<option>${o.nombre}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Proveído / Comentario</label><textarea class="form-control" rows="4" placeholder="Ingrese el proveído para la derivación..."></textarea></div>
        <button class="btn btn-primary" onclick="showToast('Expediente derivado correctamente', 'success')">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          Derivar Expediente
        </button>
      </div>
    </div>
  `;
}

function showDerivarModal(expId) {
  showModal(`
    <div class="modal-header"><h3>Derivar Expediente</h3><button class="modal-close" onclick="closeModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="modal-body">
      <p style="margin-bottom:16px;">Expediente: <strong style="color:var(--primary);">${expId}</strong></p>
      <div class="form-group"><label>Oficina Destino</label><select id="modal-derivar-oficina" class="form-control">${MOCK_OFICINAS.filter(o => o.activa).map(o => `<option value="${o.nombre}">${o.nombre}</option>`).join('')}</select></div>
      <div class="form-group"><label>Proveído</label><textarea id="modal-derivar-proveido" class="form-control" rows="3" placeholder="Ingrese el proveído para la derivación...">Remitido para revisión de requisitos y emisión de informe técnico.</textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="submitDerivar('${expId}')">Derivar Expediente</button></div>
  `);
}

function submitDerivar(expId) {
  const oficinaDestino = document.getElementById('modal-derivar-oficina')?.value || 'Decanato - Fac. Ingeniería';
  const proveido = document.getElementById('modal-derivar-proveido')?.value || 'Derivado para atención según TUPA.';
  const exp = MOCK_EXPEDIENTES.find(e => e.id === expId);
  if (exp) {
    const oficinaPrevia = exp.oficinaActual;
    exp.oficinaActual = oficinaDestino;
    exp.estado = 'derived';
    exp.estadoLabel = 'Derivado';
    exp.timeline.push({
      date: 'Hoy (Ahora)',
      title: `Derivado a ${oficinaDestino}`,
      desc: proveido,
      from: oficinaPrevia,
      to: oficinaDestino,
      status: 'completed',
      responsable: 'Mesa de Partes'
    });
  }
  closeModal();
  showToast(`Expediente ${expId} derivado exitosamente a ${oficinaDestino}`, 'success');
  if (currentPage === 'bandeja-entrada') renderBandejaEntrada(document.getElementById('intranet-main'));
}

function showObservarModal(expId) {
  showModal(`
    <div class="modal-header"><h3>Observar Expediente</h3><button class="modal-close" onclick="closeModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="modal-body">
      <p style="margin-bottom:16px;">Expediente: <strong style="color:var(--primary);">${expId}</strong></p>
      <div class="form-group"><label>Motivo de Observación</label><textarea id="modal-observar-motivo" class="form-control" rows="4" placeholder="Describa el motivo de la observación...">Falta adjuntar constancia de matrícula del semestre anterior y comprobante de pago legible.</textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Cancelar</button><button class="btn btn-warning" onclick="submitObservar('${expId}')">Confirmar Observación</button></div>
  `);
}

function submitObservar(expId) {
  const motivo = document.getElementById('modal-observar-motivo')?.value || 'Documentación incompleta o no legible.';
  const exp = MOCK_EXPEDIENTES.find(e => e.id === expId);
  if (exp) {
    exp.estado = 'observed';
    exp.estadoLabel = 'Observado';
    exp.observacion = motivo;
    exp.requerimientos = 'Subsanar los documentos observados para continuar con el procedimiento.';
    exp.timeline.push({
      date: 'Hoy (Ahora)',
      title: 'Expediente Observado',
      desc: motivo,
      from: exp.oficinaActual,
      to: '-',
      status: 'observed',
      responsable: 'Mesa de Partes / Especialista'
    });
  }
  closeModal();
  showToast(`Expediente ${expId} ha sido marcado como Observado`, 'info');
  if (currentPage === 'bandeja-entrada') renderBandejaEntrada(document.getElementById('intranet-main'));
}

function showFinalizarModal(expId) {
  showModal(`
    <div class="modal-header"><h3>Finalizar Trámite</h3><button class="modal-close" onclick="closeModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="modal-body">
      <p style="margin-bottom:16px;">Expediente: <strong style="color:var(--primary);">${expId}</strong></p>
      <div class="form-group"><label>Adjuntar Resolución / Documento Final</label>
        <div class="dropzone" style="padding:20px; text-align:center; border:2px dashed var(--accent); background:rgba(201,162,39,0.04); border-radius:10px;">
          <p style="font-size:13px; font-weight:600; color:var(--text-primary);">Resolucion_Decanal_048_2026.pdf</p>
          <span style="font-size:12px; color:var(--text-muted);">850 KB • Documento formal adjunto</span>
        </div>
      </div>
      <div class="form-group"><label>Comentario o Conclusión Final</label><textarea id="modal-finalizar-comentario" class="form-control" rows="3" placeholder="Observaciones finales...">Trámite aprobado satisfactoriamente mediante Resolución Decanal N° 048-2026-UNSAAC.</textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Cancelar</button><button class="btn btn-success" onclick="submitFinalizar('${expId}')">Finalizar Trámite</button></div>
  `);
}

function submitFinalizar(expId) {
  const comentario = document.getElementById('modal-finalizar-comentario')?.value || 'Trámite finalizado y aprobado.';
  const exp = MOCK_EXPEDIENTES.find(e => e.id === expId);
  if (exp) {
    exp.estado = 'finished';
    exp.estadoLabel = 'Finalizado';
    exp.timeline.push({
      date: 'Hoy (Ahora)',
      title: 'Trámite Concluido y Aprobado',
      desc: comentario,
      from: exp.oficinaActual,
      to: 'Administrado',
      status: 'completed',
      responsable: 'Decanato / Dirección'
    });
  }
  closeModal();
  showToast(`¡Expediente ${expId} finalizado exitosamente!`, 'success');
  if (currentPage === 'bandeja-entrada') renderBandejaEntrada(document.getElementById('intranet-main'));
}

// -- Historial de Gestión --
function renderHistorialGestion(container) {
  container.innerHTML = `
    <h1 class="page-title">Historial de Gestión</h1>
    <p class="page-subtitle">Registro de todas las acciones realizadas sobre expedientes.</p>
    <div class="card">
      <div class="card-body" style="padding:0;">
        <table class="data-table">
          <thead><tr><th>Fecha</th><th>Expediente</th><th>Acción</th><th>De</th><th>A</th><th>Responsable</th></tr></thead>
          <tbody>
            ${MOCK_EXPEDIENTES.flatMap(e => e.timeline.map(t => ({...t, expId: e.id}))).sort((a,b) => b.date.localeCompare(a.date)).slice(0,10).map(t => `
              <tr>
                <td>${t.date}</td>
                <td><strong style="color:var(--primary)">${t.expId}</strong></td>
                <td>${t.title}</td>
                <td>${t.from || '-'}</td>
                <td>${t.to || '-'}</td>
                <td>${t.responsable || 'Sistema'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================
// ADMIN PAGES
// ============================================

// -- Admin: Gestión de Usuarios --
function renderAdminUsuarios(container) {
  container.innerHTML = `
    <h1 class="page-title">Gestión de Usuarios</h1>
    <p class="page-subtitle">Administra las cuentas de usuarios internos del sistema.</p>
    <div class="admin-stats-grid">
      <div class="admin-stat-card"><div class="stat-value">${MOCK_USUARIOS_ADMIN.length}</div><div class="stat-label">Total Usuarios</div></div>
      <div class="admin-stat-card"><div class="stat-value">${MOCK_USUARIOS_ADMIN.filter(u => u.estado === 'Activo').length}</div><div class="stat-label">Activos</div></div>
      <div class="admin-stat-card"><div class="stat-value">${MOCK_USUARIOS_ADMIN.filter(u => u.estado === 'Inactivo').length}</div><div class="stat-label">Inactivos</div></div>
      <div class="admin-stat-card"><div class="stat-value">${MOCK_USUARIOS_ADMIN.filter(u => u.rol === 'Administrador').length}</div><div class="stat-label">Administradores</div></div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="admin-table-controls">
          <div class="search-box">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Buscar usuario...">
          </div>
          <button class="btn btn-primary btn-sm" onclick="showToast('Formulario de nuevo usuario', 'info')">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo Usuario
          </button>
        </div>
      </div>
      <div class="card-body" style="padding:0;">
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Oficina</th><th>Estado</th><th>Último Acceso</th><th>Acciones</th></tr></thead>
            <tbody>
              ${MOCK_USUARIOS_ADMIN.map(u => `
                <tr>
                  <td><strong>${u.nombre}</strong></td>
                  <td>${u.email}</td>
                  <td><span class="badge badge-${u.rol === 'Administrador' ? 'derived' : u.rol === 'Mesa de Partes' ? 'submitted' : 'review'}">${u.rol}</span></td>
                  <td>${u.oficina}</td>
                  <td><span class="badge badge-dot badge-${u.estado === 'Activo' ? 'finished' : 'draft'}">${u.estado}</span></td>
                  <td>${u.ultimoAcceso}</td>
                  <td>
                    <div class="table-actions">
                      <button class="btn btn-ghost btn-xs" onclick="showToast('Editar usuario: ${u.nombre}', 'info')">Editar</button>
                      <button class="btn btn-danger btn-xs" onclick="showToast('Usuario ${u.estado === 'Activo' ? 'desactivado' : 'activado'}', 'info')">${u.estado === 'Activo' ? 'Desactivar' : 'Activar'}</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// -- Admin: Gestión de Oficinas --
function renderAdminOficinas(container) {
  container.innerHTML = `
    <h1 class="page-title">Gestión de Oficinas</h1>
    <p class="page-subtitle">Administra la estructura orgánica y dependencias del sistema.</p>
    <div class="admin-stats-grid">
      <div class="admin-stat-card"><div class="stat-value">${MOCK_OFICINAS.length}</div><div class="stat-label">Total Oficinas</div></div>
      <div class="admin-stat-card"><div class="stat-value">${MOCK_OFICINAS.filter(o => o.activa).length}</div><div class="stat-label">Activas</div></div>
      <div class="admin-stat-card"><div class="stat-value">${MOCK_OFICINAS.reduce((s, o) => s + o.expedientes, 0)}</div><div class="stat-label">Exp. en Gestión</div></div>
      <div class="admin-stat-card"><div class="stat-value">${MOCK_OFICINAS.filter(o => !o.activa).length}</div><div class="stat-label">Inactivas</div></div>
    </div>
    <div class="card">
      <div class="card-header">
        <h3>Directorio de Oficinas</h3>
        <button class="btn btn-primary btn-sm" onclick="showToast('Formulario de nueva oficina', 'info')">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva Oficina
        </button>
      </div>
      <div class="card-body" style="padding:0;">
        <table class="data-table">
          <thead><tr><th>Código</th><th>Nombre</th><th>Responsable</th><th>Expedientes</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            ${MOCK_OFICINAS.map(o => `
              <tr>
                <td><strong style="color:var(--primary)">${o.codigo}</strong></td>
                <td>${o.nombre}</td>
                <td>${o.responsable}</td>
                <td>${o.expedientes}</td>
                <td><span class="badge badge-dot badge-${o.activa ? 'finished' : 'draft'}">${o.activa ? 'Activa' : 'Inactiva'}</span></td>
                <td>
                  <div class="table-actions">
                    <button class="btn btn-ghost btn-xs" onclick="showToast('Editar oficina: ${o.codigo}', 'info')">Editar</button>
                    <button class="btn btn-ghost btn-xs" onclick="showToast('Rutas de derivación', 'info')">Rutas</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -- Admin: Gestión TUPA --
function renderAdminTupa(container) {
  container.innerHTML = `
    <h1 class="page-title">Gestión TUPA</h1>
    <p class="page-subtitle">Administra los procedimientos, requisitos y costos del TUPA institucional.</p>
    <div class="card">
      <div class="card-header">
        <h3>Procedimientos TUPA</h3>
        <button class="btn btn-primary btn-sm" onclick="showToast('Formulario de nuevo procedimiento TUPA', 'info')">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Procedimiento
        </button>
      </div>
      <div class="card-body" style="padding:0;">
        <table class="data-table">
          <thead><tr><th>Código</th><th>Procedimiento</th><th>Categoría</th><th>Costo</th><th>Plazo</th><th>Acciones</th></tr></thead>
          <tbody>
            ${MOCK_TRAMITES.map(t => `
              <tr>
                <td><strong style="color:var(--primary)">${t.code}</strong></td>
                <td>${t.title}</td>
                <td><span class="badge badge-${t.category === 'academico' ? 'submitted' : 'corrected'}">${t.category.charAt(0).toUpperCase() + t.category.slice(1)}</span></td>
                <td>${t.costLabel}</td>
                <td>${t.plazo} días</td>
                <td>
                  <div class="table-actions">
                    <button class="btn btn-ghost btn-xs" onclick="showToast('Editar: ${t.code}', 'info')">Editar</button>
                    <button class="btn btn-ghost btn-xs" onclick="showToast('Requisitos de ${t.code}', 'info')">Requisitos</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -- Admin: Configuración --
function renderAdminConfig(container) {
  container.innerHTML = `
    <h1 class="page-title">Configuración del Sistema</h1>
    <p class="page-subtitle">Ajustes generales de la plataforma PLADDES.</p>

    <div class="config-section">
      <h3>Parámetros Generales</h3>
      <p class="desc">Configuración de archivos, formatos y notificaciones.</p>
      <div class="config-row">
        <div class="config-label">Tamaño máximo de archivo<span>Límite en MB para archivos adjuntos</span></div>
        <input type="number" class="form-control" style="width:100px;" value="50">
      </div>
      <div class="config-row">
        <div class="config-label">Formatos permitidos<span>Extensiones de archivo aceptadas</span></div>
        <input type="text" class="form-control" style="width:250px;" value=".pdf, .zip, .docx, .xlsx">
      </div>
      <div class="config-row">
        <div class="config-label">Notificaciones por email<span>Enviar correos automáticos al cambiar estado</span></div>
        <div class="toggle-switch active" onclick="this.classList.toggle('active')"></div>
      </div>
      <div class="config-row">
        <div class="config-label">Notificaciones push<span>Alertas en tiempo real dentro del sistema</span></div>
        <div class="toggle-switch active" onclick="this.classList.toggle('active')"></div>
      </div>
    </div>

    <div class="config-section">
      <h3>Plataforma de Pagos</h3>
      <p class="desc">Configuración de la integración con el sistema de recaudación.</p>
      <div class="config-row">
        <div class="config-label">URL de Recaudación<span>Enlace al sistema de pagos UNSAAC</span></div>
        <input type="url" class="form-control" style="width:350px;" value="https://servicios.unsaac.edu.pe/recaudacion/">
      </div>
      <div class="config-row">
        <div class="config-label">Verificación automática de pagos<span>Validar vouchers automáticamente (si disponible)</span></div>
        <div class="toggle-switch" onclick="this.classList.toggle('active')"></div>
      </div>
    </div>

    <div class="config-section">
      <h3>Sistema</h3>
      <p class="desc">Información de la versión y mantenimiento.</p>
      <div class="config-row">
        <div class="config-label">Versión del Sistema</div>
        <span style="font-weight:600;color:var(--primary);">PLADDES v2.5</span>
      </div>
      <div class="config-row">
        <div class="config-label">Modo de Mantenimiento<span>Desactiva el acceso público temporalmente</span></div>
        <div class="toggle-switch" onclick="this.classList.toggle('active')"></div>
      </div>
    </div>

    <button class="btn btn-primary" onclick="showToast('Configuración guardada', 'success')">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
      Guardar Configuración
    </button>
  `;
}

// -- Admin: Reportes Generales --
function renderAdminReportes(container) {
  container.innerHTML = `
    <h1 class="page-title">Reportes Generales</h1>
    <p class="page-subtitle">Estadísticas globales de la plataforma y rendimiento por oficina.</p>
    <div class="admin-stats-grid">
      <div class="admin-stat-card"><div class="stat-value">${MOCK_EXPEDIENTES.length}</div><div class="stat-label">Total Expedientes</div></div>
      <div class="admin-stat-card"><div class="stat-value">${MOCK_EXPEDIENTES.filter(e => e.estado !== 'finished').length}</div><div class="stat-label">En Proceso</div></div>
      <div class="admin-stat-card"><div class="stat-value">${MOCK_EXPEDIENTES.filter(e => e.estado === 'finished').length}</div><div class="stat-label">Finalizados</div></div>
      <div class="admin-stat-card"><div class="stat-value">${MOCK_OFICINAS.filter(o => o.activa).length}</div><div class="stat-label">Oficinas Activas</div></div>
    </div>
    <div class="chart-container">
      <div class="card">
        <div class="card-header"><h3>Expedientes por Estado (Global)</h3></div>
        <div class="card-body">
          <div class="bar-chart">
            <div class="bar-group"><div class="bar" style="height:20%;background:var(--status-submitted);"><span class="bar-value">1</span></div><span class="bar-label">Presentado</span></div>
            <div class="bar-group"><div class="bar" style="height:25%;background:var(--status-review);"><span class="bar-value">1</span></div><span class="bar-label">En revisión</span></div>
            <div class="bar-group"><div class="bar" style="height:20%;background:var(--status-observed);"><span class="bar-value">1</span></div><span class="bar-label">Observado</span></div>
            <div class="bar-group"><div class="bar" style="height:25%;background:var(--status-derived);"><span class="bar-value">1</span></div><span class="bar-label">Derivado</span></div>
            <div class="bar-group"><div class="bar" style="height:20%;background:var(--status-finished);"><span class="bar-value">1</span></div><span class="bar-label">Finalizado</span></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Rendimiento por Oficina</h3></div>
        <div class="card-body">
          <div class="bar-chart">
            ${MOCK_OFICINAS.filter(o => o.activa && o.expedientes > 0).slice(0, 5).map(o => `
              <div class="bar-group">
                <div class="bar" style="height:${Math.min(o.expedientes * 6, 90)}%;background:var(--primary);"><span class="bar-value">${o.expedientes}</span></div>
                <span class="bar-label">${o.codigo}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Tiempo Promedio de Atención por Oficina</h3></div>
      <div class="card-body" style="padding:0;">
        <table class="data-table">
          <thead><tr><th>Oficina</th><th>Expedientes Atendidos</th><th>Tiempo Promedio</th><th>Cumplimiento TUPA</th></tr></thead>
          <tbody>
            <tr><td>Unidad de Trámite Documentario</td><td>12</td><td>2.5 días</td><td><span class="badge badge-finished">98%</span></td></tr>
            <tr><td>Decanato - FIE</td><td>8</td><td>4.2 días</td><td><span class="badge badge-review">85%</span></td></tr>
            <tr><td>Secretaría Académica - FIE</td><td>5</td><td>3.1 días</td><td><span class="badge badge-finished">92%</span></td></tr>
            <tr><td>Dir. Red de Comunicaciones</td><td>3</td><td>6.8 días</td><td><span class="badge badge-observed">72%</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -- Admin: Auditoría --
function renderAdminAudit(container) {
  container.innerHTML = `
    <h1 class="page-title">Auditoría y Logs</h1>
    <p class="page-subtitle">Registro de todas las acciones realizadas en el sistema.</p>
    <div class="card">
      <div class="card-header">
        <div class="table-filters">
          <input type="text" class="filter-input" placeholder="Buscar en logs...">
          <select><option>Todas las acciones</option><option>Expedientes</option><option>Usuarios</option><option>Sistema</option></select>
          <input type="date" class="filter-input" style="min-width:150px;">
        </div>
      </div>
      <div class="card-body">
        <div class="audit-log">
          ${MOCK_AUDIT_LOG.map(log => `
            <div class="audit-entry">
              <span class="audit-time">${log.fecha}</span>
              <span class="audit-action">${log.accion}</span>
              <span class="audit-user">${log.usuario}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ============================================
// MODAL & TOAST UTILITIES
// ============================================

function showModal(content) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal-content');
  modal.innerHTML = content;
  overlay.classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-message">${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Copiado al portapapeles', 'success'));
}

function openPaymentModal() {
  showModal(`
    <div class="modal-header"><h3>Realizar Pago por Trámite</h3><button class="modal-close" onclick="closeModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="modal-body">
      <p style="margin-bottom:16px;color:var(--text-secondary);">Será redirigido a la plataforma de recaudación de la UNSAAC.</p>
      <div class="detail-info-card" style="border:1px solid var(--border);margin-bottom:16px;">
        <h4>Plataforma de Recaudación</h4>
        <p style="font-size:14px;font-weight:500;color:var(--primary);margin-top:4px;">servicios.unsaac.edu.pe/recaudacion</p>
      </div>
      <p style="font-size:13px;color:var(--text-muted);">También puede realizar su pago en cualquier agencia del Banco de la Nación.</p>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Cerrar</button><button class="btn btn-primary" onclick="closeModal(); showToast('Redirigiendo a plataforma de pagos...', 'info')">Ir a Pagar</button></div>
  `);
}

function closeAllPanels() {
  document.getElementById('notif-panel')?.classList.remove('active');
  document.getElementById('user-menu')?.classList.remove('active');
}

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  document.getElementById('user-menu')?.classList.remove('active');
  panel.classList.toggle('active');
}

function toggleUserMenu() {
  const menu = document.getElementById('user-menu');
  document.getElementById('notif-panel')?.classList.remove('active');
  menu.classList.toggle('active');
}

function markAllRead() {
  document.querySelectorAll('.notif-item.unread').forEach(n => n.classList.remove('unread'));
  const badge = document.getElementById('notif-badge');
  if (badge) badge.style.display = 'none';
  showToast('Todas las notificaciones marcadas como leídas', 'success');
}

function toggleMobileMenu() {
  const nav = document.querySelector('.header-nav');
  if (nav) {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    nav.style.position = 'absolute';
    nav.style.top = '64px';
    nav.style.right = '0';
    nav.style.background = 'white';
    nav.style.flexDirection = 'column';
    nav.style.padding = '16px';
    nav.style.borderRadius = '12px';
    nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    nav.style.zIndex = '300';
  }
}

// Close panels on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.notification-btn') && !e.target.closest('.notif-panel')) {
    document.getElementById('notif-panel')?.classList.remove('active');
  }
  if (!e.target.closest('.user-profile') && !e.target.closest('.user-menu')) {
    document.getElementById('user-menu')?.classList.remove('active');
  }
});

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
});
