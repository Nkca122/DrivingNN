const carCanvas = document.querySelector("#carCanvas")
const carCtx  = carCanvas.getContext('2d')

const networkCanvas = document.querySelector("#networkCanvas")
const networkCtx  = networkCanvas.getContext('2d')

carCanvas.height = window.innerHeight
carCanvas.width = 200
networkCanvas.height = window.innerHeight
networkCanvas.width = 800

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9, 3)

const N = 100
let cars = []
function generateCar(N){
    let cars = []
    let bestBrain = localStorage.getItem("bestBrain")
    for(let i = 0; i < N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, true, 100))
        if(bestBrain){
            cars[i].brain = JSON.parse(bestBrain)
        }  
    }

    for(let i = 1; i < N; i++){
        if(bestBrain){
            NeuralNetwork.mutate(cars[i].brain, 1)
        }
    }

    return cars
}

function aliveCars(cars){
    for(let i = 0; i < cars.length; i++){
        if(!cars[i].damaged){
            return true
        }
    }
    return false
}

function save(bestCar){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}

function remove(){
    localStorage.removeItem("bestBrain")
}

cars = generateCar(N)
let bestCar = cars[0]
let traffic = [
    new Car(road.getLaneCenter(0), -100, 30, 50, false, 2),
    new Car(road.getLaneCenter(1), -200, 30, 50, false, 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, false, 2),
    new Car(road.getLaneCenter(0), -400, 30, 50, false, 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, false, 2)
]


function move(){
    carCanvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight

    carCtx.save()
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)
    road.draw(carCtx)

    
    

    for(let i =0; i < traffic.length; i++){
        traffic[i].update(carCtx, road.borders, [])
    }

    for(let i = 0; i < cars.length; i++){
        cars[i].update(carCtx, road.borders, traffic)
        if(cars[i].y < bestCar.y && cars[i].speed >= 900){
            bestCar = cars[i]
            remove()
            save(bestCar)
        }
    }

    if(!aliveCars(cars)){
        cars = refresh(cars, traffic).cars
        traffic = refresh(cars, traffic).traffic
        bestCar = cars[0]
    }


    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    carCtx.restore()
    requestAnimationFrame(move)
}

function refresh(cars, traffic){
    cars = generateCar(N)
    traffic = [
            new Car(road.getLaneCenter(0), -100, 30, 50, false, 2),
            new Car(road.getLaneCenter(1), -200, 30, 50, false, 2),
            new Car(road.getLaneCenter(2), -300, 30, 50, false, 2),
            new Car(road.getLaneCenter(0), -400, 30, 50, false, 2),
            new Car(road.getLaneCenter(1), -500, 30, 50, false, 2)
    ]

    return {
        cars: cars,
        traffic: traffic
    }
}

setInterval(()=>{
    cars = refresh(cars, traffic).cars
    traffic = refresh(cars, traffic).traffic
    bestCar = cars[0]
}, 4000)

move()


