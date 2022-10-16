let playing = false;

let cursor = document.getElementsByClassName('cursor');
let strtBtn = document.getElementsByClassName('strt-btn')[0];
let page = document.getElementsByClassName('page');
let cvs = document.getElementsByTagName('canvas')[0];
let barier = document.querySelector("div.barier");
let barierθ = document.querySelector("div.barier>div.target");
let line = document.getElementsByClassName('line')[0]
let ctx = cvs.getContext('2d');
let widthW = window.innerWidth;
let heightW = window.innerHeight;
let angleDeg, angleRad;

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

let fireSpeed = [2, 5, 6, 3, 7];
let fire = [];

document.getElementsByClassName("game")[0].addEventListener('click', () => {
      if (playing) {
            line.classList.add('fire-anime');
            setTimeout(() => line.classList.remove('fire-anime'), 200);
            fire.push(new Fire(angleDeg, angleRad, window.innerWidth / 2, window.innerHeight / 2));
      }
});

class Fire {
      constructor(angleDeg, angleRad, x, y) {
            this.angleDeg = 90 - angleDeg;
            this.angleRad = angleRad;
            this.cosθ = Math.cos(angleRad);
            this.sinθ = Math.sin(angleRad);
            this.speed = fireSpeed[Math.floor(Math.random() * fireSpeed.length)];
            this.y = y;
            this.x = x;
            this.create();
      }

      create() {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angleDeg * Math.PI / 180);
            ctx.arc(0, 0, 5, 0, Math.PI * 2, true);
            ctx.fillStyle = '#f44336';
            ctx.fill();
            ctx.fillStyle = '#ffc107';
            ctx.fillRect(-5, 2, 10, 15);
            ctx.fillStyle = '#ffeb3b';
            ctx.fillRect(-5, 16, 10, 7);
            ctx.closePath();
            console.log(this.angleDeg, this.sinθ, this.cosθ);
            ctx.rotate(Math.PI * 2 - this.angleDeg * Math.PI / 180);
            ctx.translate(-this.x, -this.y);
            // this.bullet.style.top = this.top + "px";
            // this.bullet.style.left = this.left + "px";
            // this.bullet.style.transform = `translate(50%, 50%) rotate(${180 - this.angle}deg)`;
      }

      move() {
            let y, x;
            y = this.speed * this.sinθ;
            x = this.speed * this.cosθ;
            console.log(this.sinθ, this.cosθ, this.angle);
            const k = x / y;
            setInterval(() => {
                  y += y;
                  x = k * y;
                  this.bullet.style.top = this.top + x + "px";
                  this.bullet.style.left = this.left + y + "px";
                  // console.log(x, y)
            }, 100);
      }
}

function animation() {
      ctx.clearRect(0, 0, widthW, heightW);
      requestAnimationFrame(animation);
}

// bullet
/*ctx.arc(300, 300, 5, 0, Math.PI * 2, true);
ctx.fillStyle = '#f44336';
ctx.fill();
ctx.fillStyle = '#ffc107';
ctx.fillRect(295, 302, 10, 15);
ctx.fillStyle = '#ffeb3b';
ctx.fillRect(295, 315, 10, 7);*/