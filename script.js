let playing = false;

let cursor = document.getElementsByClassName('cursor')[0];
let barier = document.querySelector("div.barier");
let barierθ = document.querySelector("div.barier>div");

window.addEventListener('mousemove', eve => {
      let mouseX = eve.clientX;
      let mouseY = eve.clientY;
      cursor.style.top = mouseY + "px";
      cursor.style.left = mouseX + "px";
      if (playing) {
            let rect = barier.getBoundingClientRect();
            let barierX = rect.left + rect.width / 2;
            let barierY = rect.top + rect.height / 2;

            let θdeg = angle(mouseX, mouseY, barierX, barierY) - 90;
            barierθ.style.transform = `rotate(${θdeg}deg)`;
      }
});

function angle(cx, cy, ex, ey) {
      let dx = ex - cx;
      let dy = ey - cy;
      let θ = Math.atan2(dy, dx) * 180 / Math.PI;
      return θ;
}

window.addEventListener('mousedown', e => cursor.src = './resources/crosshair-click.png');
window.addEventListener('mouseup', e => cursor.src = './resources/crosshair.png');

let strtBtn = document.getElementsByClassName('strt-btn')[0];
let page = document.getElementsByClassName('page');

strtBtn.addEventListener('click', () => {
      page[0].style.display = "none";
      page[1].style.display = "block";
      page[1].style.zIndex = "10";
      cursor.style.display = "none";
      playing = true;
})