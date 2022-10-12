/*var dx = m.x-c.x;
var dy = m.y-c.y;

var scale = radius/Math.sqrt(dx*dx+dy*dy);

slider.x = dx*scale + c.x;
slider.y = dy*scale + c.y; */

let playing = false;

let cursor = document.getElementsByClassName('cursor')[0];

window.addEventListener('mousemove', eve => {
      let y = eve.x;
      let x = eve.y;
      cursor.style.top = x + "px";
      cursor.style.left = y + "px";
});

window.addEventListener('mousedown', e => cursor.src = './resources/crosshair-click.png');
window.addEventListener('mouseup', e => cursor.src = './resources/crosshair.png');