class JeopardyGame {
    constructor(categories){
        this.categories = categories
        this.state = 'board' // 'board', 'animatingCategory', animatingQuestion, 'expandedCategory', or 'expandedQuestion'
        this.selectedCell = null
        this.selectedCategory = null
        this.showAnswer = false // Control if the anwswer is shown. 
        this.animationProgress = 0
        this.ts = 40
        this.cols = this.categories.length
        //this.scoreBoardHeight = 50
        this.cellHeight = (height) / (1 + this.categories[0].questions.length)
        //this.cellHeight = (height - this.scoreBoardHeight) / (1 + this.categories[0].questions.length)

        this.cellWidth = width / this.cols
        
    }
    drawBoard() {
        background(0, 0, 100)
        textSize(this.ts)

        // Draw category header
        for (let i = 0; i < this.cols; i++){
                this.categories[i].displayHeader(i * this.cellWidth, 0, this.cellWidth, this.cellHeight)
        }

        // Draw questions cells
        for (let i = 0; i < this.cols; i++){
            let cat = this.categories[i]
            for (let j = 0; j < cat.questions.length; j++){
                let x = i * this.cellWidth
                let y = (j + 1) * this.cellHeight // + 1 for header row
                cat.questions[j].display(x, y, this.cellWidth, this.cellHeight)
            }
        }
    }
   
    drawAll(){
        if (this.state === 'board'){
            this.drawBoard()
        } else if (this.state === 'animatingCategory'){
            this.drawCategoryAnimation()
        } else if (this.state === 'animatingQuestion') {
            this.drawQuestionAnimation()
        }else if (this.state === 'expandedCategory'){
            // Show expaned category after animation
            background(0, 0, 200)
            fill(255)
            textAlign(CENTER, CENTER)
            textSize(100)
            let col = this.selectedCategory
            let words = this.categories[col].name.split(' ')
            if (words.length === 2){
                text(words[0], width/2, height/2 - 50)
                text(words[1], width/2, height/2 + 50)
            }else{
                text(words, width/2, height/2)
            }
            textSize(16)
            text('Press RETURN to return to board', width/2, height - 30)
        }else if (this.state === 'expandedQuestion'){
            // Expanded Question view
            background(0, 0, 200)
            fill(255)
            textAlign(CENTER, CENTER)
            textWrap(WORD)
            textSize(60)
            let {col, row} = this.selectedCell
            let qObj = this.categories[col].questions[row]
            // text(qObj.question, 0, 0, width, height)
            let margin = 30 // Optional margin from the rectangle's edges
            // Use the rectangle's current position and dimensions to define the text bounding box:
            text(qObj.question, 
                 0 + margin, 
                 0 - 100, 
                 width - 2 * margin, 
                 height - 2 * margin)

            if (this.showAnswer){
                text(qObj.answer, 0, height/2, width, height - 300)
            }else{
                textSize(16)
                //text('Press SPACE to reveal answer', width/2, height - 5)
            }
            textSize(16)
           
        }
    }

    handleMousePressed(){
        if (this.state === 'board'){
            
            if (mouseY < this.cellHeight){
                // Click is in the header area
                let col = floor(mouseX/this.cellWidth)
                this.selectedCategory = col
                this.state = 'animatingCategory'
                this.animationProgress = 0
            } else if (mouseY > this.cellHeight){
                // Click is in the question cells area
                let col = floor(mouseX/this.cellWidth)
                let row = floor(mouseY/this.cellHeight - 1) // Subtract header row
                let qObj = this.categories[col].questions[row]

                if(!qObj.answered){
                    this.selectedCell = {col, row}
                    this.state = 'animatingQuestion'
                    this.animationProgress = 0
                    this.showAnswer = false
                }
            }   
        }
    }

    drawCategoryAnimation(){
        // Original header dimensions for the selected category
        let col = this.selectedCategory
        let startX = col * this.cellWidth
        let startY = 0
        let startW = this.cellWidth
        let startH = this.cellHeight

        // Full screen target
        let endX = 0
        let endY = 0
        let endW = width
        let endH = height

        // Interpolate using animationProgress  (0, 1)
        let currentX = lerp(startX, endX, this.animationProgress)
        let currentY = lerp(startY, endY, this.animationProgress)
        let currentW = lerp(startW, endW, this.animationProgress)
        let currentH = lerp(startH, endH, this.animationProgress)

        // Draw the expanding rectangle 
        fill(0, 0, 200)
        rect(currentX, currentY, currentW, currentH)

        // Draw category name
        fill(255)
        textAlign(CENTER, CENTER)
        textWrap(WORD)
        let currentTextSize = lerp(this.ts, 100, this.animationProgress)
        textSize(currentTextSize)
        let words = this.categories[col].name.split(' ')
        if (words.length === 2){
            text(words[0], currentX + currentW/2, currentY + currentH/2 - 50)
            text(words[1], currentX + currentW/2, currentY + currentH/2 + 50)
        } else{
            text(words, currentX + currentW/2, currentY + currentH/2)
        }
        
        // Update animation progress
        this.animationProgress += 0.05
        if (this.animationProgress >= 1){
            // Animation complete
            this.state = 'expandedCategory'
        }
    }

    drawQuestionAnimation(){
        console.log("animatingQuestion progress:", this.animationProgress);
        // Retrive the selected cell indices
        let {col, row} = this.selectedCell

        // Determine the starting rectangle for the question cell
        let startX = col * this.cellWidth
        let startY = (row + 1) * this.cellHeight // +1 accounts for the header row
        let startW = this.cellWidth
        let startH = this.cellHeight

        let startTextSize = 10
        let endTextSize = 60

        // Target rectangel is full screen
        let endX = 0
        let endY = 0
        let endW = width
        let endH = height

        // Interpolate between the strating rectangle to the full screen rectangle
        let currentX = lerp(startX, endX, this.animationProgress)
        let currentY = lerp(startY, endY, this.animationProgress)
        let currentW = lerp(startW, endW, this.animationProgress)
        let currentH = lerp(startH, endH, this.animationProgress)
        let currentTextY = lerp(startY + 100, endY, this.animationProgress)
        let currentTextSize = lerp(startTextSize, endTextSize, this.animationProgress)

        // Draw the expanding rectangle
        fill(0, 0, 200)
        rect(currentX, currentY, currentW, currentH)



        // Animate the question text 
        
        textSize(currentTextSize)
        fill(255)
        textAlign(CENTER, CENTER)
        textWrap(WORD)
        // Draw the question text in the middle of the current rectangle
        // Put a bounding box on it so it is not a single line
        let margin = 30 // Optional margin from the rectangle's edges
        // Use the rectangle's current position and dimensions to define the text bounding box:
        text(this.categories[col].questions[row].question, 
             currentX + margin, 
             currentTextY -100,
             currentW - 2 * margin, 
             currentH - 2 * margin)
      
        //text(this.categories[col].questions[row].question, currentW, currentH)

        // Update the animation process
        this.animationProgress += 0.05
        if (this.animationProgress >= 1){

            // Animation complete switch to expanded question state
            this.state = 'expandedQuestion'
        }
    }


}