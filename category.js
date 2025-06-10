class Category {
    constructor(name, questions){
        this.name = name
        this.questions = questions
        this.introEnd = false
    }

    displayHeader(x, y, w, h){
        fill(0, 0, 200)
        rect(x, y, w, h)
        fill(255)
        if (!this.introEnd) {
            text('JAGDEEP', x+ w/2, y + h/2 -35)
            //text('RELATIONS', x+ w/2, y + h/2)
            text('JEOPARDY!', x+ w/2, y + h/2 +35)
        }
        if (this.introEnd) {
            let words = this.name.split(' ')
            if (words.length === 2){
                text(words[0], x + w/2, y + h/2 -25)
                text(words[1], x + w/2, y + h/2 +25)
            }else {
                text(this.name, x + w/2, y + h/2)
            }
        }
    }
} 