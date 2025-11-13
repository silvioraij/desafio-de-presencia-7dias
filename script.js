(() => {
  const app = document.getElementById('app');
  const days = [
    {title:'Día 1 – Respira', text:'Pausa 3 min. inhala/exhala. ¿Cuán presente estás hoy?', duration:180, reflection:'Respira y observa tu energía.', phrase:'Respira y siente tu vida.'},
    {title:'Día 2 – Cuerpo', text:'Lleva tu atención al cuerpo. Nota tus sensaciones', duration:120, reflection:'Observá tu cuerpo y suelta tensión.', phrase:'Afloja.'},
    {title:'Día 3 – Oídos', text:'Practica escuchar los sonidos a tu alrededor. Identifica 3 sonidos.', duration:60, reflection:'Reflexiona sobre los sonidos escuchados.', phrase:'Escucha.'},
    {title:'Día 4 – Vista suave', text:'Nota tus emociones. Permitete sentir lo que sientes.', duration:120, reflection:'Observa tu visión suave.', phrase:'Mira con calma.'},
    {title:'Día 5 – Agradecer', text:'Escribe algo que agradeces hoy.', duration:60, reflection:'Agradece lo que tienes.', phrase:'Gracias.'},
    {title:'Día 6 – Soltar', text:'Notá un pensamiento inútil y suéltalo al exhalar.', duration:120, reflection:'Deja ir a los pensamientos inútiles.', phrase:'Suelta.'},
    {title:'Día 7 – Presencia en acción', text:'Haz una tarea cotidiana con atención plena.', duration:120, reflection:'Practica presencia en acción.', phrase:'Presencia.'},
  ];
  let progress = JSON.parse(localStorage.getItem('desafio-progress') || '[]');

  function saveProgress() {
    localStorage.setItem('desafio-progress', JSON.stringify(progress));
  }

  function renderHome() {
    let html = '<div class="screen home active">' +
      '<h1>Desafío de Presencia – 7 días</h1>' +
      '<p>Un Juego Mindfulness para cultivar tu presencia.</p>' +
      '<div class="logo"><img src="public/logo-escuela-sati.png" alt="Escuela Sati"/></div>' +
      '<button id="start">Comenzar</button>' +
      '</div>';
    app.innerHTML = html;
    document.getElementById('start').onclick = function() {
      let idx = progress.findIndex(p => p !== true);
      if (idx === -1) idx = 0;
      showDay(idx);
    };
  }

  function showDay(i) {
    if (progress[i] === undefined) progress[i] = false;
    saveProgress();
    const day = days[i];
    let progressHtml = '';
    for (let idx = 0; idx < days.length; idx++) {
      let cls = '';
      if (progress[idx] === true) cls = 'completed';
      else if (idx === i) cls = 'current';
      progressHtml += '<div class="progress-circle ' + cls + '"></div>';
    }
    let minutes = Math.floor(day.duration / 60);
    let seconds = day.duration % 60;
    let html = '<div class="screen active">' +
      '<h2>' + day.title + '</h2>' +
      '<p>' + day.text + '</p>' +
      '<div class="timer"><span id="time">' + minutes + ':' + String(seconds).padStart(2, '0') + '</span></div>' +
      '<div class="breath-circle"></div>' +
      '<button id="complete" disabled>Marcar completado</button>' +
      '<div class="progress">' + progressHtml + '</div>' +
      '</div>';
    app.innerHTML = html;
    let remaining = day.duration;
    const timerEl = document.getElementById('time');
    const completeBtn = document.getElementById('complete');
    const interval = setInterval(function() {
      remaining--;
      if (remaining <= 0) {
        clearInterval(interval);
        timerEl.textContent = '0:00';
        completeBtn.disabled = false;
      } else {
        let m = Math.floor(remaining / 60);
        let s = remaining % 60;
        timerEl.textContent = m + ':' + String(s).padStart(2, '0');
      }
    }, 1000);
    completeBtn.onclick = function() {
      progress[i] = true;
      saveProgress();
      showReflection(i);
    };
  }

  function showReflection(i) {
    const day = days[i];
    let html = '<div class="screen active">' +
      '<h2>Reflexión día ' + (i + 1) + '</h2>' +
      '<p>' + day.reflection + '</p>' +
      '<blockquote>' + day.phrase + '</blockquote>' +
      '<button id="next">' + (i < days.length - 1 ? 'Siguiente día' : 'Finalizar') + '</button>' +
      '</div>';
    app.innerHTML = html;
    document.getElementById('next').onclick = function() {
      if (i < days.length - 1) {
        showDay(i + 1);
      } else {
        showFinal();
      }
    };
  }

  function showFinal() {
    let html = '<div class="screen active">' +
      '<h2>¡Felicidades!</h2>' +
      '<p>Completaste el desafío de presencia.</p>' +
      '<button id="reset">Reiniciar desafío</button>' +
      '</div>';
    app.innerHTML = html;
    document.getElementById('reset').onclick = function() {
      progress = [];
      saveProgress();
      renderHome();
    };
  }

  // initial
  if (progress && progress.length === days.length && progress.every(p => p === true)) {
    showFinal();
  } else if (progress && progress.some(p => p !== true)) {
    let idx = progress.findIndex(p => p !== true);
    if (idx === -1) idx = 0;
    showDay(idx);
  } else {
    renderHome();
  }
})();
