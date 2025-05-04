
 // script for menu


	  const menuIcon = document.getElementById("menuIcon");
    const menu = document.getElementById("menuPanel");
    const overlay = document.getElementById("overlay");
    const content = document.getElementById("content");

    menuIcon.addEventListener("click", () => {
      const isOpen = menu.classList.contains("open");
      if (isOpen) {
        closeMenu();
      } else {
        menu.classList.add("open");
        overlay.classList.add("show");
        content.classList.add("blurred");
        menuIcon.classList.add("open");
      }
    });

    function closeMenu() {
      menu.classList.remove("open");
      overlay.classList.remove("show");
      content.classList.remove("blurred");
      menuIcon.classList.remove("open");
    }



// script for bg


const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let lines = [];
    const numLines = 100;
    const minHeight = 10;
    const maxHeight = 40;
    const minSpeed = 0.3;
    const maxSpeed = 0.7;
    const minSpacing = 60;function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initLines();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initLines() {
  lines = [];
  for (let i = 0; i < numLines; i++) {
    let x, y, valid;
    let attempts = 0;

    do {
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
      valid = lines.every(line => Math.hypot(line.x - x, line.y - y) > minSpacing);
      attempts++;
    } while (!valid && attempts < 10);

    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
    lines.push({ x, y, height, speed });
  }
}

function update() {
  for (const line of lines) {
    line.x += line.speed;
    line.y -= line.speed;

    if (line.x > canvas.width + line.height) {
      line.x -= canvas.width + line.height;
    }
    if (line.y < -line.height) {
      line.y += canvas.height + line.height;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'white';

  for (const line of lines) {
    ctx.save();
    ctx.translate(line.x, line.y);
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, line.height);
    ctx.stroke();
    ctx.restore();
  }
}

function animate() {
  update();
  draw();
  requestAnimationFrame(animate);
}
animate();

// script for panels 


    const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    } else {
      entry.target.classList.remove('show');
    }
  });
}, {
  threshold: 0.3
});

document.querySelectorAll('.panel').forEach(panel => {
  observer.observe(panel);
});


// auto-reload



  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'style.css?v=' + new Date().getTime();
  document.head.appendChild(css);



// full screen toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('fullscreenToggle');
  const icon = document.getElementById('fsIcon');

  function updateIcon() {
    if (document.fullscreenElement) {
      icon.classList.add('exit-mode');
    } else {
      icon.classList.remove('exit-mode');
    }
  }

  toggle.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Fullscreen failed:", err);
      });
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', updateIcon);
});