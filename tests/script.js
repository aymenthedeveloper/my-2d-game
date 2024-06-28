var character = document.querySelector(".character");
var map = document.querySelector(".map");
var info = document.querySelector(".info");

let x = 88;
let y = 45;
let held_directions = [];
let speed = 1;
let xOffset = 125;
let yOffset = 105;

const keys = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
}
function placeCharacter() {
  let pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
  const held_direction = held_directions[0];
  if (held_direction){
    if (held_direction == 'up') {y -= speed}
    if (held_direction == 'down') {y += speed}
    if (held_direction == 'left') {x -= speed}
    if (held_direction == 'right') {x += speed}
    character.setAttribute('facing', held_direction)
  }
  x < -8? x = -8: x > 185? x = 185: x;
  y < 25? y = 25: y > 112? y = 112: x;
  info.textContent = held_direction? 'true': 'false';
  character.setAttribute('walking', held_direction? 'true': 'false');
  map.style.transform = `translate3d( ${-x*pixelSize + xOffset}px, ${-y*pixelSize + yOffset}px, 0 )`;  
  character.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;  
}

const step = () => {
  placeCharacter();
  window.requestAnimationFrame(() => {
     step();
  })
}
step(); //kick off the first step!
document.addEventListener("keydown", (e) => {
  var dir = keys[e.which];
  if (dir && held_directions.indexOf(dir) === -1) {
     held_directions.unshift(dir)
  }
})

document.addEventListener("keyup", (e) => {
  var dir = keys[e.which];
  var index = held_directions.indexOf(dir);
  if (index > -1) {
     held_directions.splice(index, 1)
  }
});