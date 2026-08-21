// ═══ MENÚ MOBILE ═══
const burger = document.getElementById('burger');
const mnav = document.getElementById('mnav');
const moverlay = document.getElementById('moverlay');

function toggleMenu() {
  burger.classList.toggle('open');
  mnav.classList.toggle('open');
  moverlay.classList.toggle('open');
}

burger.addEventListener('click', toggleMenu);
moverlay.addEventListener('click', toggleMenu);
document.querySelectorAll('#mnav a').forEach(a => a.addEventListener('click', () => {
  if (mnav.classList.contains('open')) toggleMenu();
}));

// ═══ WHATSAPP FLOAT + VOLVER ARRIBA + HEADER ═══
const wapFloat = document.querySelector('.wap-float');
const topFloat = document.getElementById('topFloat');
const siteHeader = document.getElementById('siteHeader');
const topbar = document.getElementById('topbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    wapFloat.classList.add('show');
    topFloat.classList.add('show');
  } else {
    wapFloat.classList.remove('show');
    topFloat.classList.remove('show');
  }

  if (window.scrollY > 60) {
    siteHeader.classList.add('scrolled');
    topbar.classList.add('hide');
  } else {
    siteHeader.classList.remove('scrolled');
    topbar.classList.remove('hide');
  }
});

topFloat.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ═══ PROFESIONALES POR ESPECIALIDAD — filtra el select según lo elegido arriba ═══
const PROFESIONALES_POR_ESPECIALIDAD = {
  'Endocrinología y Diabetes': ['Dr. Sergio L. García', 'Dra. Viviana Parra', 'Dr. José Echagüe', 'Dr. Enrique Zilli', 'Dr. Sebastián Pila'],
  'Nutrición y Medicina Funcional': ['Dra. M. Martha Filippi', 'Lic. Jimena Benavides'],
  'Endocrinología Infantil': ['Prof. Dr. Rodolfo Rey'],
  'Kinesiología': ['Lic. Florencia Bassi', 'Lic. Florencia Alia'],
  'Psicología': ['Lic. Josefina Casabella'],
  'Medicina Estética': ['Dra. Cynthia Confalonieri'],
  'Bioquímica': ['Laboratorios Alkemy'],
};

const turnoEspecialidadSelect = document.getElementById('turnoEspecialidad');
const turnoProfesionalSelect = document.getElementById('turnoProfesional');

function actualizarProfesionales() {
  const especialidad = turnoEspecialidadSelect.value;
  const profesionales = PROFESIONALES_POR_ESPECIALIDAD[especialidad];
  turnoProfesionalSelect.innerHTML = '';

  if (profesionales) {
    turnoProfesionalSelect.disabled = false;
    const sinPreferencia = new Option('Sin preferencia', '');
    turnoProfesionalSelect.add(sinPreferencia);
    profesionales.forEach(nombre => turnoProfesionalSelect.add(new Option(nombre, nombre)));
  } else {
    turnoProfesionalSelect.disabled = true;
    turnoProfesionalSelect.add(new Option('Elegí primero una especialidad', ''));
  }
}

if (turnoEspecialidadSelect) {
  turnoEspecialidadSelect.addEventListener('change', actualizarProfesionales);
}

// ═══ NÚMERO DE WHATSAPP POR ESPECIALIDAD — Psicología y Bioquímica tienen línea propia ═══
const WHATSAPP_POR_ESPECIALIDAD = {
  'Psicología': '5493425031430',
  'Bioquímica': '5493425160972',
};
const WHATSAPP_TURNOS_DEFAULT = '5493424670858';

// ═══ PEDIR TURNO — arma el mensaje de WhatsApp con especialidad + profesional + obra social ═══
function pedirTurno() {
  const esp = document.getElementById('turnoEspecialidad').value;
  const prof = document.getElementById('turnoProfesional').value;
  const os = document.getElementById('turnoObraSocial').value;
  const esEspecialidadExterna = Boolean(WHATSAPP_POR_ESPECIALIDAD[esp]);
  const numero = WHATSAPP_POR_ESPECIALIDAD[esp] || WHATSAPP_TURNOS_DEFAULT;
  let msg = esEspecialidadExterna
    ? 'Hola, vengo de la web del Instituto de Investigaciones Biomédicas. Necesito un turno'
    : 'Hola, quiero pedir un turno';
  if (esp) msg += ` en ${esp}`;
  msg += '.';
  if (prof) msg += ` Si es posible, con ${prof}.`;
  if (os) msg += ` Mi obra social es ${os}.`;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ═══ CONTADOR ANIMADO — franja de identidad ═══
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2200;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 5);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}
const idStrip = document.querySelector('.id-strip');
if (idStrip) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.count').forEach(animateCount);
        countObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  countObserver.observe(idStrip);
}

// ═══ REVEAL ON SCROLL ═══
document.querySelectorAll('.specialties-grid, .why-grid, .faq-list, .id-strip-inner, .values-grid, .team-grid').forEach(container => {
  Array.from(container.children).forEach((el, i) => {
    if (el.classList.contains('reveal')) el.style.transitionDelay = (i * 70) + 'ms';
  });
});

// ═══ FAQ ACCORDION ═══
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-a');
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item.open').forEach(open => {
    if (open !== item) {
      open.classList.remove('open');
      open.querySelector('.faq-a').style.maxHeight = null;
    }
  });

  if (isOpen) {
    item.classList.remove('open');
    answer.style.maxHeight = null;
  } else {
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ═══ BUSCADOR DE EQUIPO — filtra por nombre o especialidad ═══
const teamSearch = document.getElementById('teamSearch');
if (teamSearch) {
  const ACCENTS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n' };
  const normalize = (str) => str.toLowerCase().split('').map(ch => ACCENTS[ch] || ch).join('');
  const teamCards = document.querySelectorAll('.team-card');
  const teamGroups = document.querySelectorAll('.team-group');

  teamSearch.addEventListener('input', () => {
    const query = normalize(teamSearch.value.trim());

    teamCards.forEach(card => {
      const groupName = card.closest('.team-group')?.querySelector('.team-group-head h3')?.textContent || '';
      const name = card.querySelector('h4')?.textContent || '';
      const tag = card.querySelector('.team-tag')?.textContent || '';
      const role = card.querySelector('p')?.textContent || '';
      const haystack = normalize(`${groupName} ${name} ${tag} ${role}`);
      card.style.display = (!query || haystack.includes(query)) ? '' : 'none';
    });

    teamGroups.forEach(group => {
      const anyVisible = Array.from(group.querySelectorAll('.team-card')).some(c => c.style.display !== 'none');
      group.style.display = anyVisible ? '' : 'none';
    });
  });
}
