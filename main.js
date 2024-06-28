const map = document.querySelector('.map');
const upBtn = document.querySelector('.btns .btn.up');
const leftBtn = document.querySelector('.btns .btn.left');
const rightBtn = document.querySelector('.btns .btn.right');
const downBtn = document.querySelector('.btns .btn.down');
let pixel = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
let width = parseInt(getComputedStyle(map).getPropertyValue('width'));
let height = parseInt(getComputedStyle(map).getPropertyValue('height'));
let cell = pixel * 16;
map.width = width;
map.height = height;
const ctx = map.getContext('2d');
const hero = {
  x: 0, 
  y: 0, 
  width: 1, 
  height: 1, 
  color: '#DB7E02',
  facing: '',
  held_directions: {list: [], len: 0},
  preiousePosition: []
}
const walls = [
  {x: 3, y:2, width: 1, height: 5},
  {x: 9, y:2, width: 1, height: 5},
  {x: 5, y:4, width: 3, height: 1},
]

wallBlocks = walls.reduce((obj, wall) => {
  for (let row = wall.y, maxRow = wall.y + wall.height; row < maxRow; row++){
    for (let col = wall.x, maxCol = wall.x + wall.width; col < maxCol; col++) {
      obj[row]? obj[row].push([col, row]): obj[row] = [[col, row]];
    }
  }
  return obj
}, {})

const keys = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
}

function drawMap(){
  ctx.fillStyle = 'black';
  walls.forEach(wall => {
    ctx.fillRect(wall.x * cell, wall.y * cell, wall.width * cell, wall.height * cell);
  });
}
function drawHero(){
  ctx.fillStyle = hero.color;
  ctx.fillRect(hero.x * cell, hero.y * cell, hero.width * cell, hero.height * cell);
}
function checkMapLimits(){
  if (hero.x > 12) hero.x = 12;
  else if (hero.x < 0) hero.x = 0;
  if (hero.y > 8) hero.y = 8;
  else if (hero.y < 0) hero.y = 0;
}
function moveTo(direction, reverse=false){
  if (direction == 'up') reverse? hero.y++: hero.y--;
  else if (direction == 'down') reverse? hero.y--: hero.y++;
  else if (direction == 'left') reverse? hero.x++: hero.x--;
  else if (direction == 'right') reverse? hero.x--: hero.x++;
}
function checkWalls(){
  let wallsRow = wallBlocks[hero.y];
  if (!wallsRow) return;
  let touching = wallsRow.some(block => block[0] === hero.x && block[1] === hero.y);
  if (!touching) return;
  moveTo(hero.facing, true);
}
function moveHero(dir){
  const lastMove = hero.held_directions.list.length - 1;
  const direction = dir || hero.held_directions.list[lastMove];
  if (!direction) return;
  hero.facing = direction;
  
  moveTo(hero.facing)
  checkMapLimits()
  checkWalls()
}
function removeHero(){
  hero.preiousePosition = [hero.x, hero.y]
  const {preiousePosition,width,height} = hero;
  ctx.clearRect(preiousePosition[0] * cell, preiousePosition[1] * cell, width * cell, height * cell)
}
function clearMap(){
  ctx.fillStyle = 'white';
  ctx.fillRect(0 * cell, 0 * cell, 13 * cell, 9 * cell);
}
function nextFrame(){
  setTimeout(() => {
    clearMap()
    moveHero()
    drawMap()
    drawHero()
    nextFrame()
  }, 70)
};
function startGame(){
  drawMap()
  nextFrame();
}
startGame()

function addDirection(e) {
  const direction = keys[e.keyCode];
  if (direction && !hero.held_directions.list.includes(direction)){
    hero.held_directions.list.push(direction);
  }
}
function removeDirection(e) {
  const direction = keys[e.keyCode];
  var index = hero.held_directions.list.indexOf(direction);
  if (index > -1) {
    hero.held_directions.list.splice(index, 1)
  }
}

document.addEventListener('keydown', addDirection)
document.addEventListener('keyup', removeDirection)



upBtn.addEventListener('click', ()=> {
  moveHero('up')
})
leftBtn.addEventListener('click', ()=> {
  moveHero('left')
})
rightBtn.addEventListener('click', ()=> {
  moveHero('right')
})
downBtn.addEventListener('click', ()=> {
  moveHero('down')
})