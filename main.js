const carCanvas = document.querySelector("#carCanvas")
const carCtx  = carCanvas.getContext('2d')

const networkCanvas = document.querySelector("#networkCanvas")
const networkCtx  = networkCanvas.getContext('2d')

carCanvas.height = window.innerHeight
carCanvas.width = 200
networkCanvas.height = window.innerHeight
networkCanvas.width = 800

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9, 3)
const car = new Car(road.getLaneCenter(1), 100, 30, 50, true)
const traffic = [
    new Car(road.getLaneCenter(1), 10, 30, 50, false, 2)
]


function move(){
    carCanvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight

    carCtx.save()
    carCtx.translate(0, -car.y + carCanvas.height * 0.7)
    road.draw(carCtx)

    
    

    for(let i =0; i < traffic.length; i++){
        traffic[i].update(carCtx, road.borders, [])
    }

    car.update(carCtx, road.borders, traffic)
    Visualizer.drawNetwork(networkCtx, car.brain)
    carCtx.restore()
    requestAnimationFrame(move)
}



move()


