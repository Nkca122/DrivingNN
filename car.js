class Car{
    constructor(x, y, width, length, controlType, maxSpeed = 3){
        this.x = x
        this. y = y
        this.width = width
        this.length = length
        this.speed = 0
        this.controlType = controlType
        this.controls = new Controls(controlType)

        if(controlType){
            this.sensor = new Sensor(this)
            this.brain = new NeuralNetwork([
                this.sensor.rayCt, 6, 4
            ])
        } else {
            this.sensor = null
        }
        
        this.maxspeed = maxSpeed
        this.friction = 0.05
        this.acceleration = 0.1
        this.carAngle = 0
        this.polygon = []
        this.damaged = false

    }

    #assessDamage(roadBorders, traffic){
        for(let i = 0; i < roadBorders.length; i++){
            if(polyIntersect(this.polygon, roadBorders[i])){
                this.damaged = true
                return 
            }
        }

        for(let i = 0; i < traffic.length; i++){
            if(polyIntersect(this.polygon, traffic[i].polygon)){
                this.damaged = true
                traffic[i].damaged = true
                return 
            }
        }
    }
    
    
    #createPolygon(){
        const points = []
        const hypot = Math.hypot(this.width, this.length)/2
        const alpha = Math.atan2(this.width,this.length)
        points.push({
            x: this.x - hypot * Math.sin(this.carAngle - alpha),
            y: this.y - hypot *  Math.cos(this.carAngle - alpha)
        })
        points.push({
            x: this.x - hypot * Math.sin(this.carAngle + alpha),
            y: this.y - hypot * Math.cos(this.carAngle + alpha)
        })

        points.push({
            x: this.x - hypot * Math.sin(Math.PI + this.carAngle - alpha),
            y: this.y - hypot * Math.cos(Math.PI + this.carAngle - alpha)
        })
        points.push({
            x: this.x - hypot * Math.sin(Math.PI + this.carAngle + alpha),
            y: this.y - hypot * Math.cos(Math.PI + this.carAngle + alpha)
        })

        return points

    }

    draw(ctx){

        if(!this.damaged){
            ctx.fillStyle = "black"
        } else {
            ctx.fillStyle = "red"
        }
        
        ctx.beginPath()
        ctx.strokeStyle = "black"
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        for(let i = 1; i < this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
        }
        ctx.fill()
        
    }

    #move(){
        //Up and down controls
        if(this.controls.forward){
            this.speed += this.acceleration
        } else if(this.controls.backward){
            this.speed -= this.acceleration
        }

        //Left and right controls
        if(this.speed != 0){
            const flip = this.speed>0?1:-1
            if(this.controls.left){
                this.carAngle += 0.03 * flip
            } else if(this.controls.right){
                this.carAngle -= 0.03 * flip
            }

        }
        

        //Physics

        if(this.speed > this.maxspeed){
            this.speed = this.maxspeed
        }

        if(this.speed < -this.maxspeed/2){
            this.speed = -this.maxspeed/2
        }


        if(this.speed > 0){
            this.speed -= this.friction
        }

        if(this.speed < 0){
            this.speed += this.friction
        }

        if(Math.abs(this.speed) < this.friction){
            this.speed = 0
        }

        this.y -= Math.cos(this.carAngle)*this.speed
        this.x -= Math.sin(this.carAngle)*this.speed

    }

    update(ctx, roadBorders, traffic){
        this.polygon = this.#createPolygon()
        this.draw(ctx)
        if(!this.damaged){
            this.#move()
            this.#assessDamage(roadBorders, traffic)
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic)
            const offsets = this.sensor.readings.map(
                el=>el==null?0:1-el.offset
            )
            
            const outputs = NeuralNetwork.feedForward(offsets, this.brain)
            console.log(outputs)

            if(this.controlType){
                this.controls.forward = outputs[0]
                this.controls.left = outputs[1]
                this.controls.right = outputs[2]
                this.controls.backward = outputs[3]
            }
        }
        
    }


}