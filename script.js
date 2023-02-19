let playing = false;

const cursor = document.getElementsByClassName('cursor');
const strtBtn = document.getElementsByClassName('strt-btn')[0];
const page = document.getElementsByClassName('page');
const cvs = document.getElementsByTagName('canvas')[0];
const barier = document.querySelector("div.barier");
const barierθ = document.querySelector("div.barier>div.target");
const line = document.getElementsByClassName('line')[0];
const ctx = cvs.getContext('2d');

let widthW = window.innerWidth;
let heightW = window.innerHeight;
let angleDeg, angleRad, time = 5000, qty = 1;

let mousePos = {
      x: 0,
      y: 0
};

cvs.height = heightW;
cvs.width = widthW;

window.addEventListener('resize', () => {
      widthW = window.innerWidth;
      heightW = window.innerHeight;
      cvs.height = heightW;
      cvs.width = widthW;
})

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
      console.log(angleDeg, sinθ, cosθ);
      return angleθ;
}

window.addEventListener('mousedown', e => {
      cursor[0].src = './resources/crosshair-click.png';
      cursor[1].src = './resources/crosshair-click.png';
      if (playing) {
            line.classList.add('fire-anime');
            setTimeout(() => line.classList.remove('fire-anime'), 200);
            fire.push(new Fire(angleDeg, angleRad, widthW / 2, heightW / 2));
      }
});
window.addEventListener('mouseup', e => {
      cursor[0].src = './resources/crosshair.png';
      cursor[1].src = './resources/crosshair.png';
});

strtBtn.addEventListener('click', () => {
      page[0].style.display = "none";
      page[1].style.display = "block";
      page[1].style.zIndex = "10";
      cursor[0].style.display = "none";
      playing = true;
      // document.documentElement.requestFullscreen();
      document.body.requestPointerLock();
});

let fireSpeed = [5, 6, 3, 7];
let fire = [];

class Fire {
      constructor(angleDeg, angleRad, x, y) {
            this.angleDeg = angleDeg;
            this.angleDegM = 90 - angleDeg
            this.angleRad = angleRad;
            this.cosθ = Math.cos(angleRad);
            this.sinθ = Math.sin(angleRad);
            this.speed = fireSpeed[Math.floor(Math.random() * fireSpeed.length)];
            this.y = 0;
            this.x = 0;
            this.sx = x;
            this.sy = y;
            this.k = this.cosθ / this.sinθ;
            this.left = window.innerWidth + this.x;
            this.top = window.innerHeight + this.y;
            this.create();
      }

      create() {
            ctx.translate(this.sx, this.sy);
            ctx.rotate(this.angleDegM * Math.PI / 180);
            ctx.fillStyle = '#f44336';
            ctx.fillRect(this.x - 5, this.y - 4, 10, 7);
            ctx.fillStyle = '#ffc107';
            ctx.fillRect(this.x - 5, this.y + 2, 10, 15);
            ctx.fillStyle = '#ffeb3b';
            ctx.fillRect(this.x - 5, this.y + 16, 10, 7);
            ctx.closePath();
            console.log(this.angleDegM, this.sinθ, this.cosθ);
            ctx.rotate(Math.PI * 2 - this.angleDegM * Math.PI / 180);
            ctx.translate(-this.sx, -this.sy);
            this.left = widthW / 2 + this.x;
            this.top = heightW / 2 + this.y;
      }

      move() {

            ctx.translate(this.sx, this.sy);
            ctx.rotate(this.angleDegM * Math.PI / 180);

            this.x -= this.speed;
            this.y = this.x / this.k;

            console.log("Working");
            ctx.fillStyle = '#f44336';
            ctx.fillRect(-5, this.x - 4, 10, 7);
            ctx.fillStyle = '#ffc107';
            ctx.fillRect(-5, this.x + 2, 10, 15);
            ctx.fillStyle = '#ffeb3b';
            ctx.fillRect(-5, this.x + 16, 10, 7);
            ctx.closePath();

            ctx.rotate(Math.PI * 2 - this.angleDegM * Math.PI / 180);
            ctx.translate(-this.sx, -this.sy);
            this.left = widthW / 2 - this.x;
            this.top = heightW / 2 + this.y;
            console.log(this.left, this.top);
            console.log(this.x, this.y);
      }
}

let enemies = [];

class Enemy {
      constructor(x, y, rSpeed, health) {
            this.x = x;
            this.y = y;
            this.rSpeed = rSpeed;
            this.health = health;
            this.angle = 0;
            this.enemy;
            this.spawn()
      }

      spawn() {
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
      ctx.clearRect(0, 0, widthW, heightW);
      for (let i = 0; i < fire.length; i++) {
            if (fire[i].left <= widthW * 1.25) {
                  fire[i].move();
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
                  let Ex = Math.random() * widthW;
                  let Ey = Math.random() * heightW;
                  Ex < widthW / 2 ? Ex + 50 : Ex - 50;
                  Ey < heightW / 2 ? Ey + 50 : Ey - 50;
                  enemies.push(new Enemy(Ex, Ey, fireSpeed[Math.floor(Math.random() * fireSpeed.length)]));
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