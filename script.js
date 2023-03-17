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

let angleRad, spawnTimeΔ = 5000, qty = 1, playing = false, lastSpawnedTime;
let playerHealth = 100;

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
      return angleθ;
}

window.addEventListener('mousedown', () => {
      cursor[0].src = './resources/crosshair-click.png';
      cursor[1].src = './resources/crosshair-click.png';
      if (playing) {
            line.classList.add('fire-anime');
            setTimeout(() => line.classList.remove('fire-anime'), 200);
            fire.push(new Fire(angleRad, dimensions.width / 2, dimensions.height / 2, "player"));
            for (let i = 0; i < enemies.length; i++) {
                  fire.push(new Fire(enemies[i].angle, enemies[i].x, enemies[i].y, 'enemy'));
            }
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
      constructor(angleRad, x, y, source) {
            this.angleRad = angleRad;
            this.angleRadR = (Math.PI / 2) - angleRad;
            this.cosθ = Math.cos(angleRad);
            this.sinθ = Math.sin(angleRad);
            this.speed = fireSpeed[Math.floor(Math.random() * fireSpeed.length)];
            this.x = x;
            this.y = y;
            this.source = source;
            this.create();
      }

      create() {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angleRadR);
            ctx.fillStyle = '#f44336';
            ctx.fillRect(- 5, - 4, 10, 7);
            ctx.fillStyle = '#ffc107';
            ctx.fillRect(- 5, + 2, 10, 15);
            ctx.fillStyle = '#ffeb3b';
            ctx.fillRect(- 5, + 16, 10, 7);
            ctx.closePath();
            ctx.rotate(Math.PI * 2 - this.angleRadR);
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
            this.healthRemaning = health;
            this.angle = Math.random() * 2 * Math.PI;
            this.enemy;
            this.draw();
      }

      draw() {
            // box
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            ctx.fillStyle = "#800d00";
            ctx.fillRect(-35, -28, 70, 56);
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = "#303030";
            ctx.strokeRect(-35, -28, 70, 56);
            ctx.closePath();

            // linear gradient
            ctx.rotate(this.angle);
            ctx.beginPath();
            let linearGrad = ctx.createLinearGradient(0, -6, 0, 40);
            linearGrad.addColorStop(0, "#920101");
            linearGrad.addColorStop(0.85, "#ff3801");
            ctx.fillStyle = linearGrad;

            // line
            ctx.fillRect(16, -6, 40, 12);
            ctx.strokeRect(16, -6, 40, 12);
            ctx.closePath();

            // radial gradient
            let radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 21.25);
            radGrad.addColorStop(0, "#ff3801")
            radGrad.addColorStop(1, "#2d0702");

            // circle
            ctx.beginPath();
            ctx.fillStyle = radGrad;
            ctx.arc(0, 0, 21.25, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
            ctx.rotate(-this.angle);
            ctx.translate(-this.x, -this.y);
      }

      rotate() {
            this.angle += this.rSpeed * Math.PI / 180;
      }

      updateHealth() {
            this.healthRemaning--;
            console.log(`total health: ${this.health}, remaining health: ${this.healthRemaning}`);
      }
}

function animation() {
      if (playing) {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);
            fireCollision();
            // enemies update
            for (let i = 0; i < enemies.length; i++) {
                  enemies[i].rotate();
                  enemies[i].draw();
            }
      }
      window.requestAnimationFrame(animation);
}

window.requestAnimationFrame(animation);

// enemies spawner
setInterval(() => {
      if (playing) {
            for (let i = 0; i < qty; i++) {
                  let Ex = Math.random() * dimensions.width;
                  let Ey = Math.random() * dimensions.height;
                  Ex < dimensions.width / 2 ? Ex + 50 : Ex - 50;
                  Ey < dimensions.height / 2 ? Ey + 50 : Ey - 50;
                  enemies.push(new Enemy(Ex, Ey, Math.random() * 5, Math.floor(Math.random() * 5) + 5));
            }
      }
}, spawnTimeΔ);

// fire movement and collision detection
function fireCollision() {
      for (let i = 0; i < fire.length; i++) {
            if (fire[i].x > 0 && fire[i].x < dimensions.width && fire[i].y > 0 && fire[i].y < dimensions.height) {
                  fire[i].move();
                  if (fire[i].source == 'player') {
                        for (let j = 0; j < enemies.length; j++) {
                              if (fire[i].x > enemies[j].x - 35 && fire[i].x < enemies[j].x + 35) {
                                    if (fire[i].y > enemies[j].y - 28 && fire[i].y < enemies[j].y + 28) {
                                          fire.splice(i, 1);
                                          enemies[j].updateHealth();
                                          return "colliding";
                                    }
                              }
                        }
                  } else if (fire[i].source == 'enemy') {
                        console.log("enemy fire");
                        playerHealth--;
                        document.documentElement.style.setProperty('--hue', playerHealth);
                  }
            } else {
                  fire.splice(i, 1);
                  return "out of screen";
            }
      }
      return "no change";
}

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