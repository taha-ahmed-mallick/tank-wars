const cursor = document.getElementsByClassName('cursor');
const strtBtn = document.getElementsByClassName('strt-btn')[0];
const page = document.getElementsByClassName('page');
const cvs = document.getElementsByTagName('canvas')[0];
const barier = document.querySelector("div.barier");
const barierθ = document.querySelector("div.barier>div.target");
const line = document.getElementsByClassName('line')[0];
const ctx = cvs.getContext('2d');

class Dimensions {
      constructor() {
            this.height = window.innerHeight;
            this.width = window.innerWidth;
            this.function();
      }
      function() {
            this.height = window.innerHeight;
            this.width = window.innerWidth;
            cvs.height = this.height;
            cvs.width = this.width;
      }
}
let dimensions = new Dimensions;
window.addEventListener('resize', () => dimensions.function());

let angleDeg, angleRad, time = 5000, qty = 1, playing = false;

let mousePos = {
      x: 0,
      y: 0
};
window.addEventListener('mousemove', eve => {
      if (!playing) {
            mousePos.x = eve.clientX;
            mousePos.y = eve.clientY;
            cursor[0].style.top = mousePos.y + "px";
            cursor[0].style.left = mousePos.x + "px";
      } else if (playing) {
            mousePos.x += eve.movementX;
            mousePos.y += eve.movementY;
            let rect = barier.getBoundingClientRect();
            let barierX = rect.left + rect.width / 2;
            let barierY = rect.top + rect.height / 2;

            let θdeg = angle(mousePos.x, mousePos.y, barierX, barierY);
            barierθ.style.transform = `rotate(${360 - θdeg}deg)`;
      }
});

function angle(cx, cy, ex, ey) {
      let dx = ex - cx;
      let dy = ey - cy;
      let angleθ = 180 - (Math.atan2(dy, dx) * 180 / Math.PI);
      angleRad = angleθ * Math.PI / 180;
      sinθ = Math.sin(angleRad);
      cosθ = Math.cos(angleRad);
      angleDeg = angleθ;
      return angleθ;
}

window.addEventListener('mousedown', () => {
      cursor[0].src = './resources/crosshair-click.png';
      cursor[1].src = './resources/crosshair-click.png';
      if (playing) {
            line.classList.add('fire-anime');
            setTimeout(() => line.classList.remove('fire-anime'), 200);
            fire.push(new Fire(angleDeg, angleRad, dimensions.width / 2, dimensions.height / 2));
      }
});
window.addEventListener('mouseup', () => {
      cursor[0].src = './resources/crosshair.png';
      cursor[1].src = './resources/crosshair.png';
});

strtBtn.addEventListener('click', () => {
      page[0].style.display = "none";
      page[1].style.display = "block";
      page[1].style.zIndex = "10";
      cursor[0].style.display = "none";
      playing = true;
      document.body.requestPointerLock();
});

document.addEventListener('mouseleave', () => !playing ? cursor[0].style.display = "none" : null);
document.addEventListener('mouseenter', () => !playing ? cursor[0].style.display = "block" : null);

let fireSpeed = [5, 6, 3, 7];
let fire = [];

class Fire {
      constructor(angleDeg, angleRad, x, y) {
            this.angleDeg = angleDeg;
            this.angleDegM = 90 - angleDeg;
            this.angleRad = angleRad;
            this.cosθ = Math.cos(angleRad);
            this.sinθ = Math.sin(angleRad);
            this.speed = fireSpeed[Math.floor(Math.random() * fireSpeed.length)];
            this.x = x;
            this.y = y;
            this.k = this.cosθ / this.sinθ;
            this.create();
      }

      create() {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angleDegM * Math.PI / 180);
            ctx.fillStyle = '#f44336';
            ctx.fillRect(- 5, - 4, 10, 7);
            ctx.fillStyle = '#ffc107';
            ctx.fillRect(- 5, + 2, 10, 15);
            ctx.fillStyle = '#ffeb3b';
            ctx.fillRect(- 5, + 16, 10, 7);
            ctx.closePath();
            ctx.rotate(Math.PI * 2 - this.angleDegM * Math.PI / 180);
            ctx.translate(-this.x, -this.y);
      }

      move() {
            this.x += this.speed * this.cosθ;
            this.y -= this.speed * this.sinθ;
            this.create();
      }
}

let enemies = [];

class Enemy {
      constructor(x, y, rSpeed, health) {
            this.x = x;
            this.y = y;
            this.rSpeed = rSpeed;
            this.health = health;
            this.healthLeft = health;
            this.angle = Math.random() * 2 * Math.PI;
            this.enemy;
            this.spawn();
      }

      spawn() {
            // box
            ctx.beginPath();
            ctx.fillStyle = "#800d00";
            ctx.fillRect(this.x - 70 / 2, this.y - 56 / 2, 70, 56);
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = "#303030";
            ctx.strokeRect(this.x - 70 / 2, this.y - 56 / 2, 70, 56);
            ctx.closePath();

            // linear gradient
            ctx.beginPath();
            let linearGrad = ctx.createLinearGradient(this.x, this.y - 6, 0, this.y + 40);
            linearGrad.addColorStop(0, "#920101");
            linearGrad.addColorStop(0.85, "#ff3801");
            ctx.fillStyle = linearGrad;

            // line
            ctx.fillRect(this.x + 16, this.y - 6, 40, 12);
            ctx.strokeRect(this.x + 16, this.y - 6, 40, 12);
            ctx.closePath();

            // radial gradient
            let radGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 21.25);
            radGrad.addColorStop(0, "#ff3801")
            radGrad.addColorStop(1, "#2d0702");

            // circle
            ctx.beginPath();
            ctx.fillStyle = radGrad;
            ctx.arc(this.x, this.y, 21.25, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
      }
}

function animation() {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      for (let i = 0; i < fire.length; i++) {
            if (fire[i].x > 0 && fire[i].x < dimensions.width && fire[i].y > 0 && fire[i].y < dimensions.height) {
                  fire[i].move();
                  for (let j = 0; j < enemies.length; j++) {
                        if (fire[i].x > enemies[j].x - 35 && fire[i].x < enemies[j].x + 35) {
                              if (fire[i].y > enemies[j].y - 28 && fire[i].y < enemies[j].y + 28) {
                                    console.log("colliding");
                              }
                        }
                  }
            } else {
                  fire.splice(i, 1);
            }
      }
      for (let i = 0; i < enemies.length; i++) {
            enemies[i].spawn();
      }
      requestAnimationFrame(animation);
}

animation();

// Enemies spawner
setInterval(() => {
      if (playing) {
            for (let i = 0; i < qty; i++) {
                  let Ex = Math.random() * dimensions.width;
                  let Ey = Math.random() * dimensions.height;
                  Ex < dimensions.width / 2 ? Ex + 50 : Ex - 50;
                  Ey < dimensions.height / 2 ? Ey + 50 : Ey - 50;
                  enemies.push(new Enemy(Ex, Ey, fireSpeed[Math.floor(Math.random() * fireSpeed.length)], 100));
            }
      }
}, time);

// bullet
// ctx.arc(300, 300, 5, 0, Math.PI * 2, true);
// ctx.fillStyle = '#f44336';
// ctx.fill();
// ctx.fillStyle = '#f44336';
// ctx.fillRect(99, 300, 12, 7);
// ctx.fillStyle = '#ffc107';
// ctx.fillRect(100, 307, 10, 15);
// ctx.fillStyle = '#ffeb3b';
// ctx.fillRect(100, 322, 10, 7);

// radial gradient
// grad = ctx.createRadialGradient(300, 300, 0, 300, 300, 21.25)
// grad.addColorStop(0, "#ff3801")
// grad.addColorStop(1, "#2d0702");

// circle
// ctx.fillStyle = grad;
// ctx.lineWidth = 2.5;
// ctx.strokeStyle = "#303030";
// ctx.arc(300, 300, 21.25, 0, Math.PI * 2);
// ctx.stroke();
// ctx.fill();

// linear gradient
// grad = ctx.createLinearGradient(0, 0, 40, 0)
// grad.addColorStop(0, "#920101")
// grad.addColorStop(1, "#ff3801")
// ctx.fillStyle = grad
// ctx.fillRect(0, 0, 40, 12)