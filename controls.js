class Controls{
    constructor(controlType){
        this.forward = false
        this.right = false
        this.backward = false
        this.controlType = controlType
        this.left = false
        if(controlType){
            this.#keyBoardListeners()
        } else {
            this.forward = true
        }
    }

    #keyBoardListeners(){
        document.addEventListener("keydown", (event)=>{
            switch(event.key){
                case 'w':
                    this.forward = true
                    break
                case 's':
                    this.backward = true
                    break
                case 'a':
                    this.left = true
                    break
                case 'd':
                    this.right = true
                    break
            }
        })

        document.addEventListener("keyup", (event)=>{
            switch(event.key){
                case 'w':
                    this.forward = false
                    break
                case 's':
                    this.backward = false
                    break
                case 'a':
                    this.left = false
                    break
                case 'd':
                    this.right = false
                    break
            }
        })
    }
}