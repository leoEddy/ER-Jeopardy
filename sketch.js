let game
let gameState = 'intro'
let players = []
let startButton
let categorieData
let scoreBoardHeight = 50
let fade = 0
let employeeX;   // x position for 'EMPLOYEE RELATIONS'
let jeopardyX;    // x position for 'JEOPARDY'
let targetX;     // target x position (center of canvas)
let speed = 10;  // speed of movement


function preload(){
  // categorieData = loadJSON('gameData.json')
  categorieData = loadJSON('gameData.json')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER)
  textSize(40)
  employeeX = -400;
  jeopardyX = width + 400;
  targetX = width / 2;



  startButton = createButton('Start Game')
  startButton.position(width/2-200/2, height/2 + 100)
  startButton.size(200, 80)
  startButton.style('font-size', '30px')
  startButton.style('border-radius', '15px')
  startButton.mousePressed((evt) => {
    evt.stopPropagation()
    startGame()
  } )

  function startGame(){
    startButton.remove()
    gameState = 'board'
    game = new JeopardyGame(categories)
  }

  // Convert JSON data into Category and Question objects
  let categories = []
  categorieData.categories.forEach(catData => {
    let questions = catData.questions.map(qData =>
      new Question(qData.value, qData.question, qData.answer)
    )
    categories.push(new Category(catData.name, questions))
  })
}

function draw() {
  if (gameState === 'intro'){
    background(0, 0, 200);
  
    // Increase fade for a smooth appearance
    if (fade < 255){
      fade += 2;
    }
    fill(255, fade);
    textSize(70);
    
    // Move 'EMPLOYEE RELATIONS' from the left towards the center
    if (millis() > 10000) {
      if(employeeX < targetX){
        employeeX += speed;
        if(employeeX > targetX) {
          employeeX = targetX;
        }
      }
    }
    
    // Move 'JEOPARDY' from the right towards the center after a 60-second delay
    if (millis() > 10000) {
      if(jeopardyX > targetX){
        jeopardyX -= speed;
        if(jeopardyX < targetX) {
          jeopardyX = targetX;
        }
      }
    }
    
    // Draw the texts at their respective positions
    //text('EMPLOYEE RELATIONS', employeeX, height/2 - 50);
    text('EMPLOYEE RELATIONS', employeeX, height/2 - 50)
    text('JEOPARDY', jeopardyX, height/2 + 50);

  }else if (game.state === 'board'){
    game.drawAll()
  
    

  }else {
    // you neeed this here otherwise the game freezes aftie you click on start game. 
    game.drawAll()
    //drawScoreboard()
    

  }
}




function mousePressed(){
  game.handleMousePressed()
}

function keyPressed(){
  print(game.state)
  if(game.state === 'expandedCategory' || game.state === 'expandedQuestion') {
    //reveal the answer with the space bar
    if (key === ' ' && game.state === 'expandedQuestion'){
      game.showAnswer = true
    }

    // Pressing RETURN returns to board
    if (keyCode === ENTER){
      if (game.showAnswer && game.state === 'expandedQuestion'){
        let {col, row} = game.selectedCell
        game.categories[col].questions[row].answered = true
      }

      if (game.state === 'expandedCategory'){
        let col = game.selectedCategory
        game.categories[col].introEnd = true
      }
      game.selectedCell = null
      game.selectedCategory = null
      game.state = 'board'
    }
    
  }
}

// function windowResized(){
//   resizedCanvas(windowWidth, windowHeight)
// }
