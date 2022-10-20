let playing = false;

let cursor = document.getElementsByClassName('cursor');
let strtBtn = document.getElementsByClassName('strt-btn')[0];
let page = document.getElementsByClassName('page');
let cvs = document.getElementsByTagName('canvas')[0];
let barier = document.querySelector("div.barier");
let barierθ = document.querySelector("div.barier>div.target");
let line = document.getElementsByClassName('line')[0];
let enemyGround = document.getElementsByClassName('enemies')[0];
let ctx = cvs.getContext('2d');
let widthW = window.innerWidth;
let heightW = window.innerHeight;
let angleDeg, angleRad, t = 5000, qty = 1, indexE = 0;

let target = new Image();
target.src = './resources/crosshair.png';
let targetClick = new Image();
targetClick.src = './resources/crosshair-click.png';

cvs.height = heightW;
cvs.width = widthW;

window.addEventListener('resize', () => {
      widthW = window.innerWidth;
      heightW = window.innerHeight;
      cvs.height = heightW;
      cvs.width = widthW;
})

window.addEventListener('mousemove', eve => {
      let mouseX = eve.clientX;
      let mouseY = eve.clientY;
      cursor[0].style.top = mouseY + "px";
      cursor[0].style.left = mouseX + "px";
      if (playing) {
            let rect = barier.getBoundingClientRect();
            let barierX = rect.left + rect.width / 2;
            let barierY = rect.top + rect.height / 2;

            let θdeg = angle(mouseX, mouseY, barierX, barierY);
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

window.addEventListener('mousedown', e => { cursor[0].src = './resources/crosshair-click.png'; cursor[1].src = './resources/crosshair-click.png'; });
window.addEventListener('mouseup', e => { cursor[0].src = './resources/crosshair.png'; cursor[1].src = './resources/crosshair.png'; });

strtBtn.addEventListener('click', () => {
      page[0].style.display = "none";
      page[1].style.display = "block";
      page[1].style.zIndex = "10";
      cursor[0].style.display = "none";
      playing = true;
      // document.documentElement.requestFullscreen();
});

let fireSpeed = [5, 6, 3, 7];
let fire = [];

document.getElementsByClassName("game")[0].addEventListener('click', () => {
      if (playing) {
            line.classList.add('fire-anime');
            setTimeout(() => line.classList.remove('fire-anime'), 200);
            fire.push(new Fire(angleDeg, angleRad, widthW / 2, heightW / 2));
      }
});

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
            // ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, true);
            // ctx.fillStyle = '#f44336';
            // ctx.fill();
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
            enemyGround.innerHTML += `
            <div class="tank enemy" id="${indexE}">
                  <div class="circle enemy">    
                        <div class="line enemy"></div>
                  </div>
                  <div class="tank-body enemy"></div>
            </div>`;
            this.enemy = document.getElementById(`${indexE}`);
            indexE++;
            this.enemy.style.top = this.y + "px";
            this.enemy.style.left = this.x + "px"
      }

      rotate() {
            let r = this.enemy.childNodes[1];
            console.log(r);
            r.style.transform = `translate(-50%, -50%) scale(0.85) rotate(${++this.angle}deg)`;
      }
}

// function animation() {
//       ctx.clearRect(0, 0, widthW, heightW);
//       for (let i = 0; i < fire.length; i++) {
//             if (fire[i].left <= widthW * 1.25) {
//                   fire[i].move();
//             } else {
//                   fire.splice(i, 1);
//             }
//       }
//       for (let i = 0; i < enemies.length; i++) {
//             enemies[i].rotate();
//       }
//       requestAnimationFrame(animation);
// }

// animation();



// setInterval(() => {
//       if (playing) {
//             for (let i = 0; i < qty; i++) {
//                   let Ex = Math.random() * widthW;
//                   let Ey = Math.random() * heightW;
//                   Ex < widthW / 2 ? Ex + 50 : Ex - 50;
//                   Ey < heightW / 2 ? Ey + 50 : Ey - 50;
//                   enemies.push(new Enemy(Ex, Ey, fireSpeed[Math.floor(Math.random() * fireSpeed.length)]));
//             }
//       }
// }, t);

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

// grad = ctx.createRadialGradient(300, 300, 0, 300, 300, 21.25)
// grad.addColorStop(0, "#ff3801")
// grad.addColorStop(1, "#2d0702");
// ctx.fillStyle = grad;
// ctx.lineWidth = 2.5;
// ctx.strokeStyle = "#303030";
// ctx.arc(300, 300, 21.25, 0, Math.PI * 2);
// ctx.stroke();
// ctx.fill();