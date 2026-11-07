(function () {
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const overlay = document.getElementById('gameOverlay');
  const overlayIcon = document.getElementById('overlayIcon');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayMessage = document.getElementById('overlayMessage');
  const startButton = document.getElementById('startButton');
  const pauseButton = document.getElementById('pauseButton');
  const leftButton = document.getElementById('leftButton');
  const rightButton = document.getElementById('rightButton');
  const scoreValue = document.getElementById('scoreValue');
  const bestValue = document.getElementById('bestValue');
  const storageNotice = document.getElementById('storageNotice');
  const lanes = [0.2, 0.5, 0.8];
  const stars = Array.from({ length: 70 }, function () {
    return {
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.55 + 0.2
    };
  });

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let state = 'ready';
  let playerLane = 1;
  let meteors = [];
  let score = 0;
  let best = 0;
  let elapsed = 0;
  let spawnTimer = 0;
  let lastFrame = 0;
  let animationId = 0;
  let storageAvailable = true;

  try {
    const savedBest = Number(window.localStorage.getItem('soul-star-dodge-best'));
    if (Number.isFinite(savedBest) && savedBest > 0) best = Math.floor(savedBest);
  } catch (error) {
    storageAvailable = false;
    storageNotice.textContent = 'Your browser is blocking saved scores, so your best score will only last this visit.';
    storageNotice.hidden = false;
  }
  bestValue.textContent = String(best);

  function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw();
  }

  function draw() {
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);

    const background = context.createLinearGradient(0, 0, 0, height);
    background.addColorStop(0, '#101629');
    background.addColorStop(1, '#080b12');
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    stars.forEach(function (star) {
      context.globalAlpha = star.alpha;
      context.fillStyle = '#d9e3ff';
      context.beginPath();
      context.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;

    lanes.forEach(function (lane) {
      context.setLineDash([5, 12]);
      context.strokeStyle = 'rgba(177, 195, 234, 0.12)';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(lane * width, 16);
      context.lineTo(lane * width, height - 18);
      context.stroke();
    });
    context.setLineDash([]);

    meteors.forEach(drawMeteor);
    drawShip(lanes[playerLane] * width, height - 52);
  }

  function drawMeteor(meteor) {
    const x = lanes[meteor.lane] * width;
    const glow = context.createRadialGradient(x, meteor.y, 2, x, meteor.y, meteor.radius * 1.8);
    glow.addColorStop(0, 'rgba(255, 187, 127, 0.9)');
    glow.addColorStop(0.38, 'rgba(255, 114, 105, 0.9)');
    glow.addColorStop(1, 'rgba(255, 94, 103, 0)');
    context.fillStyle = glow;
    context.beginPath();
    context.arc(x, meteor.y, meteor.radius * 1.8, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = '#ff927d';
    context.beginPath();
    context.arc(x, meteor.y, meteor.radius, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = 'rgba(104, 35, 44, 0.45)';
    context.beginPath();
    context.arc(x - meteor.radius * 0.24, meteor.y - meteor.radius * 0.15, meteor.radius * 0.27, 0, Math.PI * 2);
    context.fill();
  }

  function drawShip(x, y) {
    context.save();
    context.translate(x, y);
    context.shadowColor = '#7ce6ff';
    context.shadowBlur = 20;
    context.fillStyle = '#e5faff';
    context.beginPath();
    context.moveTo(0, -21);
    context.lineTo(16, 15);
    context.lineTo(0, 9);
    context.lineTo(-16, 15);
    context.closePath();
    context.fill();
    context.shadowBlur = 0;
    context.fillStyle = '#56caed';
    context.beginPath();
    context.moveTo(-5, 14);
    context.lineTo(0, 25 + Math.sin(elapsed * 18) * 3);
    context.lineTo(5, 14);
    context.closePath();
    context.fill();
    context.restore();
  }

  function move(direction) {
    if (state !== 'playing') return;
    playerLane = Math.max(0, Math.min(lanes.length - 1, playerLane + direction));
    draw();
  }

  function startGame() {
    score = 0;
    elapsed = 0;
    spawnTimer = 0.35;
    playerLane = 1;
    meteors = [];
    scoreValue.textContent = '0';
    state = 'playing';
    overlay.hidden = true;
    pauseButton.disabled = false;
    pauseButton.textContent = 'Pause';
    pauseButton.setAttribute('aria-pressed', 'false');
    lastFrame = performance.now();
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(frame);
  }

  function togglePause() {
    if (state === 'playing') {
      state = 'paused';
      showOverlay('Ⅱ', 'Take a breather', 'Your run is paused. Pick up where you left off.', 'Resume game');
      pauseButton.textContent = 'Resume';
      pauseButton.setAttribute('aria-pressed', 'true');
      cancelAnimationFrame(animationId);
      return;
    }

    if (state === 'paused') {
      state = 'playing';
      overlay.hidden = true;
      pauseButton.textContent = 'Pause';
      pauseButton.setAttribute('aria-pressed', 'false');
      lastFrame = performance.now();
      animationId = requestAnimationFrame(frame);
    }
  }

  function showOverlay(icon, title, message, buttonLabel) {
    overlayIcon.textContent = icon;
    overlayTitle.textContent = title;
    overlayMessage.textContent = message;
    startButton.innerHTML = buttonLabel + ' <span aria-hidden="true">→</span>';
    overlay.hidden = false;
  }

  function finishGame() {
    if (state !== 'playing') return;
    state = 'over';
    pauseButton.disabled = true;
    if (score > best) {
      best = score;
      bestValue.textContent = String(best);
      if (storageAvailable) {
        try {
          window.localStorage.setItem('soul-star-dodge-best', String(best));
        } catch (error) {
          storageAvailable = false;
          storageNotice.textContent = 'This browser could not save your best score. You can still play again.';
          storageNotice.hidden = false;
        }
      }
    }
    showOverlay('✦', 'Nice run!', 'You scored ' + score + '. Ready to beat your best?', 'Play again');
  }

  function frame(timestamp) {
    if (state !== 'playing') return;
    const delta = Math.min((timestamp - lastFrame) / 1000, 0.05);
    lastFrame = timestamp;
    elapsed += delta;
    score = Math.floor(elapsed * 10);
    scoreValue.textContent = String(score);

    const difficulty = 1 + Math.min(elapsed / 45, 1.4);
    spawnTimer -= delta;
    if (spawnTimer <= 0) {
      meteors.push({
        lane: Math.floor(Math.random() * lanes.length),
        y: -24,
        radius: 11 + Math.random() * 5,
        speed: (175 + Math.random() * 75) * difficulty
      });
      spawnTimer = Math.max(0.34, 0.88 - elapsed * 0.008) + Math.random() * 0.25;
    }

    const shipY = height - 52;
    const shipRadius = 16;
    meteors = meteors.filter(function (meteor) {
      meteor.y += meteor.speed * delta;
      const hit = meteor.lane === playerLane && Math.abs(meteor.y - shipY) < meteor.radius + shipRadius * 0.65;
      if (hit) finishGame();
      return meteor.y < height + meteor.radius;
    });

    draw();
    if (state === 'playing') animationId = requestAnimationFrame(frame);
  }

  startButton.addEventListener('click', function () {
    if (state === 'paused') {
      togglePause();
    } else {
      startGame();
    }
  });
  pauseButton.addEventListener('click', togglePause);
  leftButton.addEventListener('click', function () { move(-1); });
  rightButton.addEventListener('click', function () { move(1); });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
      event.preventDefault();
      move(1);
    } else if (event.key.toLowerCase() === 'p' && (state === 'playing' || state === 'paused')) {
      togglePause();
    } else if (event.key === ' ' && (state === 'ready' || state === 'over')) {
      event.preventDefault();
      startGame();
    }
  });

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(function (error) {
      console.error('Offline game caching could not be enabled.', error);
    });
  }
})();
