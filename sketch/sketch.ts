type EntityCategories = { [key: string]: Array<IEntity> }

const groups = [ 'red', 'green', 'blue', 'yellow', 'purple' ]
// const groups = [ 'red', 'green', 'blue' ]
// const groups = [ 'red', 'blue' ]

const objectScale = 0.5

let nextColor: p5.Color

const engine = Matter.Engine.create()
const world = engine.world

const entities: EntityCategories = {}

let font: p5.Font
let ballcount = 50

const showFramerate = function () {
    const fps = frameRate();
    fill(255)
    stroke(0)
    text('FPS: ' + fps.toFixed(2), 10, 20)
}

const drawUserInterface = function () {
    push()
    textFont(font)
    textSize(width * 0.03)
    textAlign(RIGHT, CENTER)
    noStroke()
    fill(nextColor)

    text(ballcount + ' remaining balls', width - 40, 40)
    pop()

}
let nextGroup = 0


const preload = () => {
    font = loadFont('assets/nunito.ttf')
}

const rotateGroup = () => {
    const group = groups[nextGroup]
    nextGroup = (nextGroup + 1) % groups.length
    nextColor = Colors()[groups[nextGroup]]
    return group
}

const setup = () => {
    const canvas = createCanvas(windowWidth, windowHeight)
    translate(width / 2, height / 2)
    angleMode(DEGREES)

    const mouse = Matter.Mouse.create(canvas.elt)
    const options = { mouse: mouse }
    mouse.pixelRatio = pixelDensity()
    const mouseConstraint = Matter.MouseConstraint.create(engine, options)
    Matter.World.add(world, mouseConstraint)

    nextColor = Colors()[groups[nextGroup]]
    
    entities['solidBalls'] = new Array<Ball>()
    entities['hallowBalls'] = new Array<Ball>()

    entities['ground'] = new Array<Box>()

    entities['ground'].push(new Box(width / 2, height - 10, width, 20, true))

    entities['ground'].push(new Box(0, height - 30, 20, 60, true))
    entities['ground'].push(new Box(width, height - 30, 20, 60, true))

}


function mouseReleased() {
    if (keyIsDown(CONTROL)) {
        entities['ground'].push(new Box(mouseX, mouseY, 20, 20, true))
        return
    }
}

function keyPressed() {

    // if (ballcount < 1) return

    if (keyCode == 81 || keyCode == 69) {

        const group = rotateGroup()
        const collisionGroup = new CollisionGroup([group], keyCode == 81)
        entities['hallowBalls'].push(new Ball(mouseX, mouseY, 100 * objectScale, collisionGroup))

        ballcount -= 1
    }
    if (keyCode == 65 || keyCode == 68) {

        const group = rotateGroup()
        const collisionGroup = new CollisionGroup([group], keyCode == 65)
        entities['hallowBalls'].push(new Square(mouseX, mouseY, 200 * objectScale, collisionGroup))

        ballcount -= 1
    }
}

const draw = () => {

    Matter.Engine.update(engine)

    background(17, 17, 17)
    // translate(width / 2, height / 2)


    // TODO: Make masses of balls different
    // TODO: make challenging game mechanic
    // TODO: make balls grow when spawned
    // TODO: add dashed ball
    // for (const ball of solidBalls) {
    //     ball.show()
    // }
    // for (const ball of hallowBalls) {
    //     ball.show()
    // }

    // for (const groundBound of groundBoundries) {
    //     groundBound.show()
    // }
    
    // ground.show()
    
    for (const entityGroup in entities) {
        for (const entity of entities[entityGroup]) {
            entity.show().render()
        }
    }

    drawUserInterface()

    showFramerate()
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}
