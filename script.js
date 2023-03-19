const cursor = document.getElementsByClassName('cursor');
const strtBtn = document.getElementsByClassName('strt-btn')[0];
const page = document.getElementsByClassName('page');
const cvs = document.getElementsByTagName('canvas')[0];
const barier = document.querySelector("div.barier");
const barierθ = document.querySelector("div.barier>div.target");
const line = document.getElementsByClassName('line')[0];
const scoreEle = document.querySelector('.score>span');
const ctx = cvs.getContext('2d');

// local storage
const lastEle = document.querySelector('.last-score>span');
const highEle = document.querySelector('.highest-score>span');

if (window.localStorage.lastScore == null) window.localStorage.setItem('lastScore', 00);
if (window.localStorage.highScore == null) window.localStorage.setItem('highScore', 00);

lastEle.innerText = window.localStorage.lastScore;
highEle.innerText = window.localStorage.highScore;

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
let playerHealth = 100, score = 0;

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
            cursor[0].style.display != "block" ? cursor[0].style.display = "block" : null;
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
                  fire.push(new Fire((Math.PI * 1.99) - enemies[i].angle, enemies[i].x, enemies[i].y, 'enemy'));
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

let fire = [];

class Fire {
      constructor(angleRad, x, y, source) {
            this.angleRad = angleRad;
            this.angleRadR = (Math.PI / 2) - angleRad;
            this.cosθ = Math.cos(angleRad);
            this.sinθ = Math.sin(angleRad);
            this.speed = Math.round(Math.random() * 4) + 3;
            this.x = x;
            this.y = y;
            this.source = source;
            if (source == 'enemy') this.firePow = Math.round(Math.random() * 10) + 5;
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

            if (this.health != this.healthRemaning) {
                  let percentage = this.healthRemaning / this.health * 60;
                  ctx.fillStyle = '#607D8B';
                  ctx.fillRect(-30, -37, 60, 5);
                  ctx.fillStyle = `hsl(${percentage} 80% 50%)`;
                  ctx.fillRect(-30, -37, percentage, 5);
            }

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

      updateHealth(index) {
            this.healthRemaning--;
            if (this.healthRemaning <= 0) {
                  enemies.splice(index, 1);
                  score += 10;
                  scoreEle.innerText = score;
            }
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
                  enemies.push(new Enemy(Ex, Ey, Math.random(), Math.round(Math.random() * 5) + 5));
            }
      }
}, spawnTimeΔ);

const playerTank = document.getElementsByClassName('tank-body')[0];
const healthLeftEle = document.getElementsByClassName('health-left')[0];
// console.log(playerTank);

// fire movement and collision detection
function fireCollision() {
      for (let i = 0; i < fire.length; i++) {
            if (fire[i].x > 0 && fire[i].x < dimensions.width && fire[i].y > 0 && fire[i].y < dimensions.height) {
                  fire[i].move();
                  if (fire[i].source == 'player') {
                        for (let j = 0; j < enemies.length; j++) {
                              if (fire[i].x > enemies[j].x - 35 && fire[i].x < enemies[j].x + 35) {
                                    if (fire[i].y > enemies[j].y - 28 && fire[i].y < enemies[j].y + 28) {
                                          enemies[j].updateHealth(j);
                                          score += 5;
                                          scoreEle.innerText = score;
                                          fire.splice(i, 1);
                                          return "colliding";
                                    }
                              }
                        }
                  } else if (fire[i].source == 'enemy') {
                        // console.log("enemy fire");
                        let rect = playerTank.getBoundingClientRect();
                        let rectDetail = {
                              x: rect.left,
                              y: rect.top,
                              width: rect.width,
                              height: rect.height
                        };
                        if (fire[i].x > rectDetail.x && fire[i].x < rectDetail.x + rectDetail.width) {
                              if (fire[i].y > rectDetail.y && fire[i].y < rectDetail.y + rectDetail.height) {
                                    playerHealth -= fire[i].firePow;
                                    if (playerHealth <= 0) {
                                          playerHealth = 0
                                          playing = false;
                                          window.localStorage.lastScore = score;
                                          if (score > window.localStorage.highScore) window.localStorage.highScore = score;
                                          document.body;
                                    }
                                    document.documentElement.style.setProperty('--hue', playerHealth);
                                    healthLeftEle.style.width = playerHealth + "%";
                                    fire.splice(i, 1);
                              }
                        }
                  }
            } else {
                  fire.splice(i, 1);
                  return "out of screen";
            }
      }
      return "no change";
}