class Road{
    constructor(x, width, laneCt = 3){
        this.x = x
        this.width = width
        this.laneCt = laneCt

        this.left = this.x - this.width/2
        this.right = this.x + this.width/2
        

        const infinity = 10000000
        this.top = infinity
        this.bottom = -infinity

        const topLeft = {
            x: this.left,
            y: this.top
        }

        const topRight = {
            x: this.right,
            y: this.top
        }
        const bottomLeft = {
            x: this.left,
            y: this.bottom
        }
        const bottomRight= {
            x: this.right,
            y:this.bottom
        }

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]

    }





    getLaneCenter(laneIndex){
        return this.left + (this.width/this.laneCt) * (Math.min(laneIndex, this.laneCt - 1) + 0.5)
    }

    draw(ctx){
        ctx.strokeStyle = "white"
        ctx.lineWidth = 5

        const laneWidth = this.width/this.laneCt

        for(let i = 0; i <= this.laneCt; i++){
            const x = inBtw(
                this.left, 
                this.right, 
                (i/this.laneCt)
            )

            if(i > 0 && i < this.laneCt){
                ctx.setLineDash([20,20])
            } else {
               ctx.setLineDash([])
            }

            ctx.beginPath()
            ctx.lineTo(x, this.top)
            ctx.lineTo(x, this.bottom)
            ctx.stroke()

        }

        


    }
}