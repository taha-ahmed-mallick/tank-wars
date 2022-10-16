let playing = false;

let cursor = document.getElementsByClassName('cursor');
let barier = document.querySelector("div.barier");
let barierθ = document.querySelector("div.barier>div.target");
let angleMouse, sinθ, cosθ, index = 0;

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
      let angleθ = 360 - (Math.atan2(dy, dx) * 180 / Math.PI + 180);
      sinθ = Math.sin(angleθ * Math.PI / 180);
      cosθ = Math.cos(angleθ * Math.PI / 180);
      angleMouse = angleθ;
      // console.log(angleθ, sinθ, cosθ);
      return angleθ;
}

window.addEventListener('mousedown', e => {
      cursor[0].src = './resources/crosshair-click.png';
      cursor[1].src = './resources/crosshair-click.png';
});
window.addEventListener('mouseup', e => {
      cursor[0].src = './resources/crosshair.png';
      cursor[1].src = './resources/crosshair.png';
});

let strtBtn = document.getElementsByClassName('strt-btn')[0];
let page = document.getElementsByClassName('page');

strtBtn.addEventListener('click', () => {
      page[0].style.display = "none";
      page[1].style.display = "block";
      page[1].style.zIndex = "10";
      cursor[0].style.display = "none";
      playing = true;
      document.documentElement.requestFullscreen();
});

let fireAnime = [];
let fireSpeed = [2, 5, 6, 3, 7];
let fire = [];

document.getElementsByClassName("game")[0].addEventListener('click', () => {
      if (playing) {
            fireAnime.push('fire-anime');
            for (let i = 0; i < fireAnime.length; i++) {
                  setTimeout(() => {
                        document.getElementsByClassName('line')[0].classList.add('fire-anime');
                        setTimeout(() => {
                              document.getElementsByClassName('line')[0].classList.remove('fire-anime')
                              fireAnime.shift();
                        }, 200);
                  }, 200 * i);
            }
            fire.push(new Fire(angleMouse, window.innerWidth / 2, window.innerHeight / 2));
      }
});

let game = document.getElementsByClassName("game-board")[0];

class Fire {
      constructor(angle, left, top) {
            this.angle = angle + 90;
            this.cosθ = Math.cos(this.angle * Math.PI / 180);
            this.sinθ = Math.sin(this.angle * Math.PI / 180);
            this.speed = fireSpeed[Math.floor(Math.random() * fireSpeed.length)];
            this.top = top;
            this.left = left;
            this.index = index;
            this.create();
            this.bullet;
            this.move();
      }

      create() {
            game.innerHTML += `<span class="bullet" id="${this.index}"></span>`;
            this.bullet = document.getElementById(`${this.index}`);
            this.bullet.style.top = this.top + "px";
            this.bullet.style.left = this.left + "px";
            this.bullet.style.transform = `translate(50%, 50%) rotate(${180 - this.angle}deg)`;
            index++;
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