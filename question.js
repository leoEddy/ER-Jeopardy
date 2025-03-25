class Question {
    constructor(value, question, answer) {
        this.value = value
        this.question = question
        this.answer = answer
        this.answered = false
    }
    display (x, y, w, h) {
        // Change cell's colour if it's been answered
        // Set a thicker border
        strokeWeight(5)
        stroke(0)
        if (this.answered) {
            fill(0, 0, 200)
            rect(x, y, w, h)
        }else{
            fill(0, 0, 200)
            rect(x, y, w, h)
            fill(255, 165, 0)
            text('$'+this.value, x + w/2, y + h/2)
        }
    }
}