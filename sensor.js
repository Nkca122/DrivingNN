class Sensor{
    constructor(Player, traffic){
        this.Player = Player
        this.traffic = traffic
        this.rayCt = 5
        this.rayLength = 150
        this.raySpread = Math.PI/2
        this.readings = []
        this.rays = []
    }

    #getReadings(ray, roadBorders){
        let touches = []
        for(let i = 0; i < roadBorders.length; i++){
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            )

            if(touch){
                touches.push(touch)
            }
        }

        for(let i = 0; i < traffic.length; i++){
            const poly = traffic[i].polygon
            for(let j = 0; j < poly.length; j++){
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1)%poly.length]
                )

                if(value){
                    touches.push(value)
                }
            }

            
        }



        if(touches.length == 0){
            return null
        } else {
            const offsets = touches.map(el => el.offset)
            const minOffset = Math.min(...offsets)
            return touches.find(el => el.offset == minOffset)
        }
    }

    update(roadBorders){
        this.#castRays()
        this.readings = []
        for(let i = 0; i < this.rays.length; i++){
            this.readings.push(
                this.#getReadings(this.rays[i], roadBorders)
            )
        }


    }


    #castRays(){
        this.rays=[]
        for(let i = 0; i < this.rayCt; i++){
            const rayAngle = inBtw(
                -this.raySpread/2, 
                this.raySpread/2, 
                this.rayCt == 1 ? 0.5 : i/(this.rayCt-1)) + this.Player.carAngle
        
        const start = {
            x : this.Player.x,
            y : this.Player.y
        }
        const end = {
            x : this.Player.x - Math.sin(rayAngle) * this.rayLength,
            y : this.Player.y - Math.cos(rayAngle) * this.rayLength
        }

        this.rays.push([start, end])
        }
        this.draw()
    }

    draw(){
        carCtx.lineWidth = 1
        
        for(let i = 0; i < this.rayCt; i++){
            let end = this.rays[i][1]
            if(this.readings[i]){
                end = this.readings[i]
            }
            carCtx.beginPath()
            carCtx.strokeStyle = "yellow"
            carCtx.lineWidth = 1
            carCtx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            )
            carCtx.lineTo(
                end.x,
                end.y
            )

            carCtx.stroke()


            carCtx.beginPath()
            carCtx.strokeStyle = "red"
            carCtx.lineWidth = 5
            carCtx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            )
            carCtx.lineTo(
                end.x,
                end.y
            )
            

            carCtx.stroke()
        }
    }
}