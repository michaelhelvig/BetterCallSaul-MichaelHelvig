/* =============================================================
   BETTER CALL SAUL — sitio de fans
   base.js — comportamiento compartido por todas las páginas
   ============================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1) Menú móvil (hamburguesa)
  --------------------------------------------------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLista = document.querySelector('.nav-lista');

  if (navToggle && navLista) {
    navToggle.addEventListener('click', () => {
      const abierto = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!abierto));
      navLista.classList.toggle('abierta');
      if (abierto) cerrarSubmenus();
    });
  }

  /* ---------------------------------------------------------
     1b) Navbar transparente sobre el hero (solo en la home):
         al bajar un poco se le agrega .scrolleado y recupera su fondo
  --------------------------------------------------------- */
  const encabezadoHero = document.querySelector('.encabezado--hero');
  if (encabezadoHero) {
    const actualizarEncabezado = () => {
      encabezadoHero.classList.toggle('scrolleado', window.scrollY > 40);
    };
    actualizarEncabezado();
    window.addEventListener('scroll', actualizarEncabezado, { passive: true });
  }

  /* ---------------------------------------------------------
     2) Submenú desplegable "Temporadas": solo se abre/cierra con
        la flecha (botón .submenu-toggle). El texto "Temporadas"
        es un link normal a temporadas.html.
  --------------------------------------------------------- */
  const cerrarSubmenus = () => {
    document.querySelectorAll('.tiene-submenu.abierto').forEach((el) => {
      el.classList.remove('abierto');
      const b = el.querySelector('.submenu-toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  };

  document.querySelectorAll('.submenu-toggle').forEach((boton) => {
    boton.addEventListener('click', () => {
      const padre = boton.closest('.tiene-submenu');
      const abrir = !padre.classList.contains('abierto');
      cerrarSubmenus();
      padre.classList.toggle('abierto', abrir);
      boton.setAttribute('aria-expanded', String(abrir));
    });
  });

  // Click/tap fuera del menú o tecla Escape: se cierra el submenú
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tiene-submenu')) cerrarSubmenus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const abierto = document.querySelector('.tiene-submenu.abierto .submenu-toggle');
      cerrarSubmenus();
      if (abierto) abierto.focus();
    }
  });

  // Cierra el menú/submenú al elegir un enlace final
  document.querySelectorAll('.submenu a, .nav-lista > li:not(.tiene-submenu) > .nav-link').forEach((a) => {
    a.addEventListener('click', () => {
      navLista && navLista.classList.remove('abierta');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------
     3) Resaltar el enlace de navegación activo según la página
  --------------------------------------------------------- */
  const pagina = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-lista a[href]').forEach((a) => {
    const destino = a.getAttribute('href').split('#')[0];
    if (destino === pagina || (destino === '' && pagina === 'index.html')) {
      const li = a.closest('li');
      if (li) li.classList.add('activa');
      if (li && li.parentElement.closest('.tiene-submenu')) {
        li.parentElement.closest('.tiene-submenu').classList.add('activa');
      }
    }
  });

  /* ---------------------------------------------------------
     4) Animación de revelado al hacer scroll (IntersectionObserver)
  --------------------------------------------------------- */
  const elementosRevelar = document.querySelectorAll('.revelar');
  if (elementosRevelar.length && 'IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
      /* threshold 0 + margen inferior: se revela apenas el borde superior del bloque entra
         en pantalla. Con un umbral porcentual (ej. 0.15) los bloques muy altos, como la grilla
         de la galería en móvil, nunca alcanzaban ese porcentaje visible y quedaban invisibles. */
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    elementosRevelar.forEach((el) => observador.observe(el));
  } else {
    elementosRevelar.forEach((el) => el.classList.add('visible'));
  }

  /* ---------------------------------------------------------
     5) Máquina de escribir para el titular del hero (solo home)
  --------------------------------------------------------- */
  const maquina = document.querySelector('[data-typewriter]');
  if (maquina) {
    const frases = JSON.parse(maquina.getAttribute('data-typewriter'));
    let indiceFrase = 0, indiceLetra = 0, borrando = false;
    const pausaFinal = 1400, pausaEntre = 400;

    function tick() {
      const frase = frases[indiceFrase];
      if (!borrando) {
        indiceLetra++;
        maquina.textContent = frase.slice(0, indiceLetra);
        if (indiceLetra === frase.length) {
          borrando = true;
          return setTimeout(tick, pausaFinal);
        }
      } else {
        indiceLetra--;
        maquina.textContent = frase.slice(0, indiceLetra);
        if (indiceLetra === 0) {
          borrando = false;
          indiceFrase = (indiceFrase + 1) % frases.length;
          return setTimeout(tick, pausaEntre);
        }
      }
      setTimeout(tick, borrando ? 45 : 85);
    }
    tick();
  }

  /* ---------------------------------------------------------
     6) GALERÍA: filtros + lightbox funcional
  --------------------------------------------------------- */
  const grid = document.querySelector('.grid-galeria');
  if (grid) {
    const items = Array.from(grid.querySelectorAll('.item-galeria'));
    const botonesFiltro = document.querySelectorAll('.filtro-btn');

    botonesFiltro.forEach((boton) => {
      boton.addEventListener('click', () => {
        botonesFiltro.forEach((b) => { b.classList.remove('activo'); b.setAttribute('aria-pressed', 'false'); });
        boton.classList.add('activo');
        boton.setAttribute('aria-pressed', 'true');
        const categoria = boton.dataset.filtro;
        items.forEach((item) => {
          const coincide = categoria === 'todas' || item.dataset.categoria === categoria;
          item.classList.toggle('oculto', !coincide);
        });
      });
    });

    // Lightbox
    const lightbox = document.querySelector('.lightbox');
    const lbImg = lightbox.querySelector('img');
    const lbPie = lightbox.querySelector('.lightbox-pie');
    let indiceActual = 0;

    function visibles() { return items.filter((i) => !i.classList.contains('oculto')); }

    function abrir(index) {
      const lista = visibles();
      indiceActual = index;
      const item = lista[indiceActual];
      if (!item) return;
      const img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbPie.textContent = item.dataset.titulo || img.alt;
      lightbox.classList.add('activo');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function cerrar() {
      lightbox.classList.remove('activo');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function mover(delta) {
      const lista = visibles();
      indiceActual = (indiceActual + delta + lista.length) % lista.length;
      abrir(indiceActual);
    }

    items.forEach((item, i) => {
      item.addEventListener('click', () => abrir(visibles().indexOf(item)));
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(visibles().indexOf(item)); }
      });
    });

    lightbox.querySelector('.lightbox-cerrar').addEventListener('click', cerrar);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => mover(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => mover(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) cerrar(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('activo')) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'ArrowLeft') mover(-1);
    });
  }

  /* ---------------------------------------------------------
     7) FORMULARIO DE CONTACTO: validación + envío simulado
  --------------------------------------------------------- */
  const formulario = document.querySelector('.formulario');
  if (formulario) {
    const campos = {
      nombre: { el: formulario.querySelector('#nombre'), validar: (v) => v.trim().length >= 2, msg: 'Escribí al menos 2 caracteres.' },
      email: { el: formulario.querySelector('#email'), validar: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Ingresá un email válido.' },
      asunto: { el: formulario.querySelector('#asunto'), validar: (v) => v !== '', msg: 'Elegí un motivo de consulta.' },
      mensaje: { el: formulario.querySelector('#mensaje'), validar: (v) => v.trim().length >= 10, msg: 'Contanos un poco más (mínimo 10 caracteres).' },
    };

    function validarCampo(clave) {
      const campo = campos[clave];
      if (!campo || !campo.el) return true;
      const valor = campo.el.value;
      const esValido = campo.validar(valor);
      const errorEl = formulario.querySelector(`.error[data-para="${clave}"]`);
      campo.el.classList.toggle('invalido', !esValido);
      campo.el.classList.toggle('valido', esValido);
      if (errorEl) errorEl.textContent = esValido ? '' : campo.msg;
      return esValido;
    }

    Object.keys(campos).forEach((clave) => {
      const el = campos[clave].el;
      if (!el) return;
      el.addEventListener('blur', () => validarCampo(clave));
      el.addEventListener('input', () => { if (el.classList.contains('invalido')) validarCampo(clave); });
    });

    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const todoValido = Object.keys(campos).map(validarCampo).every(Boolean);
      const aviso = document.querySelector('.aviso-envio');
      if (!todoValido) {
        if (aviso) {
          aviso.textContent = 'Revisá los campos marcados antes de enviar el expediente.';
          aviso.style.background = 'var(--rojo-sello)';
          aviso.classList.add('mostrar');
        }
        return;
      }
      const boton = formulario.querySelector('button[type="submit"]');
      const textoOriginal = boton.textContent;
      boton.disabled = true;
      boton.textContent = 'Enviando expediente…';
      setTimeout(() => {
        boton.disabled = false;
        boton.textContent = textoOriginal;
        formulario.reset();
        Object.values(campos).forEach((c) => c.el && c.el.classList.remove('valido'));
        if (aviso) {
          aviso.style.background = 'var(--petroleo)';
          aviso.textContent = '¡Listo! Tu consulta quedó registrada. "It\'s all good, man" — te contestamos a la brevedad. (Formulario de demostración: no se envía a un servidor real.)';
          aviso.classList.add('mostrar');
        }
      }, 900);
    });
  }

  /* ---------------------------------------------------------
     8) EASTER EGGS — página easter-eggs.html
  --------------------------------------------------------- */

  // 8a. Quiz de trivia
  const quizEl = document.querySelector('[data-quiz]');
  if (quizEl) {
    const preguntas = [
      {
        texto: '¿A qué rubro se dedicaba Jimmy McGill antes de convertirse en abogado a tiempo completo?',
        opciones: ['Contador público', 'Operador de estafas y "corredor" en locales comerciales', 'Mecánico de autos usados', 'Agente inmobiliario'],
        correcta: 1,
      },
      {
        texto: '¿Cómo se llama el consultorio legal que Jimmy monta en la trastienda de un local de manicura?',
        opciones: ['Ficus & Asociados', 'Wexler-McGill', 'Law Office of James M. McGill', 'Su escritorio no tenía nombre oficial'],
        correcta: 2,
      },
      {
        texto: '¿Qué profesión ejercía Mike Ehrmantraut antes de trabajar como "hombre de seguridad" para la organización?',
        opciones: ['Policía de Filadelfia', 'Bombero', 'Agente aduanero', 'Chofer de larga distancia'],
        correcta: 0,
      },
      {
        texto: '¿Cuál es el nombre de la cadena de comida rápida usada como fachada dentro del universo de la serie?',
        opciones: ['Pollos del Norte', 'Los Pollos Hermanos', 'El Gallo Feliz', 'Pollo Real'],
        correcta: 1,
      },
      {
        texto: 'La firma de abogados donde trabaja Kim Wexler durante gran parte de la historia es...',
        opciones: ['Davis & Main / HHM', 'Wexler & Goodman', 'Schweikart y asociados', 'Ninguna, ejercía sola desde el inicio'],
        correcta: 0,
      },
      {
        texto: '¿Qué objeto usa Jimmy como "prueba" teatral en más de una ocasión frente a un jurado o cliente potencial?',
        opciones: ['Un maletín gastado', 'Su teléfono celular plegable', 'Una grabadora de voz', 'Un mazo de tribunal'],
        correcta: 2,
      },
    ];

    let indice = 0, aciertos = 0;
    const cajaPregunta = quizEl.querySelector('.quiz-pregunta');
    const cajaOpciones = quizEl.querySelector('.quiz-opciones');
    const resultado = quizEl.querySelector('.quiz-resultado');
    const progreso = quizEl.querySelector('.quiz-progreso');

    function pintarPregunta() {
      resultado.textContent = '';
      if (indice >= preguntas.length) {
        progreso.textContent = 'EXPEDIENTE CERRADO';
        cajaPregunta.textContent = `Terminaste el interrogatorio con ${aciertos} de ${preguntas.length} respuestas correctas.`;
        cajaOpciones.innerHTML = '';
        const btnReiniciar = document.createElement('button');
        btnReiniciar.className = 'boton';
        btnReiniciar.textContent = 'Repetir el interrogatorio';
        btnReiniciar.addEventListener('click', () => { indice = 0; aciertos = 0; pintarPregunta(); });
        cajaOpciones.appendChild(btnReiniciar);
        return;
      }
      const p = preguntas[indice];
      progreso.textContent = `PREGUNTA ${indice + 1} / ${preguntas.length}`;
      cajaPregunta.textContent = p.texto;
      cajaOpciones.innerHTML = '';
      p.opciones.forEach((texto, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opcion';
        btn.type = 'button';
        btn.textContent = texto;
        btn.addEventListener('click', () => responder(i, btn));
        cajaOpciones.appendChild(btn);
      });
    }

    function responder(i, btnElegido) {
      const p = preguntas[indice];
      const botones = cajaOpciones.querySelectorAll('.quiz-opcion');
      botones.forEach((b) => (b.disabled = true));
      if (i === p.correcta) {
        aciertos++;
        btnElegido.classList.add('correcta');
        resultado.textContent = '✔ Correcto — el jurado asiente.';
      } else {
        btnElegido.classList.add('incorrecta');
        botones[p.correcta].classList.add('correcta');
        resultado.textContent = '✘ No exactamente — objeción registrada.';
      }
      setTimeout(() => { indice++; pintarPregunta(); }, 1100);
    }

    pintarPregunta();
  }

  // 8b. Generador de alias legal estilo "Saul Goodman"
  const generador = document.querySelector('[data-generador-alias]');
  if (generador) {
    const nombres = ['Saul', 'Lalo', 'Wexler', 'Ignacio', 'Gene', 'Marco', 'Howard', 'Kettleman', 'Varga', 'Fring', 'Ximenez', 'Bettencourt'];
    const apellidosLegales = ['Goodman', '& Asociados', 'Legal Group', 'y Wexler Abogados', 'Defensa Total', 'Justicia Express', '& Hamlin', 'Servicios Jurídicos'];
    const boton = generador.querySelector('button');
    const caja = generador.querySelector('.alias-caja');
    boton.addEventListener('click', () => {
      const n = nombres[Math.floor(Math.random() * nombres.length)];
      const a = apellidosLegales[Math.floor(Math.random() * apellidosLegales.length)];
      caja.textContent = `${n} ${a}`;
      caja.classList.remove('sacudida');
      void caja.offsetWidth;
      caja.classList.add('sacudida');
    });
  }

  // 8c. Timbre secreto (clicks ocultos)
  const timbre = document.querySelector('[data-timbre]');
  if (timbre) {
    const boton = timbre.querySelector('.timbre-boton');
    const contador = timbre.querySelector('.timbre-contador');
    const mensaje = timbre.querySelector('.timbre-mensaje');
    let clics = 0;
    const mensajes = [
      '',
      '',
      '',
      'Alguien está tocando timbre de más...',
      'La cámara de seguridad del estacionamiento te está mirando.',
      'Sigues ahí. Persistente, como un buen abogado.',
      '¡Ding! Encontraste el huevo de pascua secreto. "S\'all good, man."',
    ];
    boton.addEventListener('click', () => {
      clics++;
      contador.textContent = `Timbrazos registrados: ${clics}`;
      const idx = Math.min(clics, mensajes.length - 1);
      mensaje.textContent = mensajes[idx];
      boton.classList.remove('sacudida');
      void boton.offsetWidth;
      boton.classList.add('sacudida');
    });
  }

  /* ---------------------------------------------------------
     9) Año automático en el pie de página
  --------------------------------------------------------- */
  document.querySelectorAll('[data-anio]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

})();