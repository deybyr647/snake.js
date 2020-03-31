/*Variables which help to ready-up the canvas for the game*/
let canvas = document.getElementById('gameCanvas');

//These variables help to get the game canvas' height and width from the CSS file
let element = document.querySelector('.gameCanvas');
let style = getComputedStyle(element);
let w = style.width;
let h = style.height;

/*Sets the canvas width and height in the JavaScript by parsing w and h as integers, which removes the 'px' at the
end of each and converts the number in the string into an integer to be used by the code below */
canvas.width = parseInt(w, 10);
canvas.height = parseInt(h, 10);

let ctx = canvas.getContext('2d');

//Helps in creation of a grid over the canvas to ease postioning of snake elements
let gridSize = 20;
let gridWidth = Math.floor(canvas.width / gridSize);
let gridHeight = Math.floor(canvas.height / gridSize);

/*Initial Game State Variables & Functions*/
let randXcoord = () => {
  //Returns a random Y coordinate value based on the width of the canvas grid
  let randX = Math.floor(Math.random() * gridWidth); //Returns a random number between 1 and 10
  return randX;
}

let randYcoord = () => {
  //Returns a random Y coordinate value based on the height of the canvas grid
  let randY = Math.floor(Math.random() * gridHeight); //Returns a random number between 1 and 10
  return randY;
}

let snake = [
  { x: 3, y: 1 },
  { x: 3, y: 2 },
  { x: 3, y: 3 },
];

let direction = 'right';
let apple = { x: randXcoord(), y: randYcoord() };

//Functions for resetting the game state, upon a snake death for example
let resetSnake = () => {
  snake = [
    { x: 3, y: 1 },
    { x: 3, y: 2 },
    { x: 3, y: 3 },
  ];

  direction = 'right';
}

let randApple = () => {
  apple = {
    x: randXcoord(),
    y: randYcoord(),
  }
}

/*Functions for drawing to the game canvas. Most take (x, y) parameters, which are the x and y values inside
corresponding objects*/

let clearCanvas = () => {
  //Clears the current canvas by redrawing one on top of the existing one
  ctx.fillStyle = '#12355B';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let drawSnakeBody = (x, y) => {
  //Draws/Creates squares that become part of the snake's body
  ctx.fillStyle = 'green';
  ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

let drawSnakeHead = (x, y) => {
  //Draws/Creates the head of the snake
  ctx.fillStyle = 'darkgreen';
  ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

let drawApple = (x, y) => {
  //Creates the apple on the canvas using Math.PI 
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc((x + 0.5) * gridSize, (y + 0.5) * gridSize, gridSize / 2, 0, 2 * Math.PI);
  ctx.fill();
}

let drawSnake = () => {
  //Draws the snake to the canvas using the snake array and the values of each object within that array.
  for (let i = 0; i < snake.length - 1; i++) {
    let point = snake[i];
    drawSnakeBody(point.x, point.y);
  }

  let head = snake[snake.length - 1];
  drawSnakeHead(head.x, head.y);
}

//Event handler for user input. Input changes movement direction of snakes. Uses both arrow keys and WASD
window.addEventListener('keydown', event => {
  //console.log(event.code);

  if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
    direction = 'left';
  }

  else if (event.code === 'KeyD' || event.code === 'ArrowRight') {
    direction = 'right';
  }

  else if(event.code === 'KeyW' || event.code === 'ArrowUp') {
    direction = 'up';
  }

  else if(event.code === 'KeyS' || event.code === 'ArrowDown') {
    direction = 'down';
  }
})

let main = () => {
  /*This is the game's main function. Here it takes care of snake movement by constantly changing values
  in the objects within the snake array. So the program is essentially always drawing the same snake.
  Just in different locations/coordinates*/

  let head = snake[snake.length - 1];

  /*Changes direction of snake based on input from the event handler and the direction variable.
  Movement is possible by the increase/decrease by 1 of the values within the objects within the snake array*/
  if (direction === 'left') {
    let newHead = {x: head.x - 1, y: head.y};
    snake.push(newHead);
  }

  if (direction === 'right') {
    let newHead = {x: head.x + 1, y: head.y};
    snake.push(newHead);
  }

  if (direction === 'up') {
    let newHead = {x: head.x, y: head.y - 1};
    snake.push(newHead);
  }

  if (direction === 'down') {
    let newHead = {x: head.x, y: head.y + 1};
    snake.push(newHead);
  }

  //Checks if snake eats the apple. Using the above logic, it also changes snake size if the apple is eaten
  head = snake[snake.length - 1];
  if (head.x === apple.x && head.y === apple.y) {
    randApple();
  } else {
    snake.shift();
  }

  //Checks if the snake goes out of bounds. If yes, results in a loss & reset of the snake
  if (head.x >= gridWidth || head.y >= gridHeight || head.y < 0 || head.x < 0) {
    resetSnake();
  }

  //Checks if the snake is hitting itself. If yes, results in a loss & reset of the snake
  for(let i = 0; i < snake.length - 1; i++) {
    let point = snake[i];

    if (head.x === point.x && head.y === point.y) {
      resetSnake();
    }
  }

  //Clears Canvas, then redraws everything by running all the code
  clearCanvas();
  drawSnake();
  drawApple(apple.x, apple.y);

  //Sets up the game to run constantly, until a loss. Changing the ms value also changes snakes speed.
  setTimeout(() => main(), 75);
}

//Test
//main();
