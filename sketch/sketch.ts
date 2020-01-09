
const colors: any = {}

const engine = Matter.Engine.create()
const world = engine.world

const solidBalls = Array<Ball>()
const hallowBalls = Array<Ball>()

let ground: Box
let groundBoundries: Box[] = []

let renderCategories: Map

const setupColors = () => {
    colors.background = color(2, 43, 58)
    colors.tickmarks = color(232, 233, 243)

    colors.second = color(210, 160, 42)
    colors.minute = color(31, 140, 147)
    colors.hour = color(202, 219, 192)
}
const showFramerate = function () {
    const fps = frameRate();
    fill(255);
    stroke(0);
    text("FPS: " + fps.toFixed(2), 10, 20);
}
let nextGroup = 0

const setup = () => {
    const canvas = createCanvas(windowWidth, windowHeight)
    translate(width / 2, height / 2)
    angleMode(DEGREES)

    const mouse = Matter.Mouse.create(canvas.elt)
    const options = { mouse: mouse }
    mouse.pixelRatio = pixelDensity()
    const mouseConstraint = Matter.MouseConstraint.create(engine, options)
    Matter.World.add(world, mouseConstraint)

    
    ground = new Box(width / 2, height - 10, width, 20, true)

    groundBoundries.push(new Box(0, height - 30, 20, 60, true))
    groundBoundries.push(new Box(width, height - 30, 20, 60, true))

}


function mouseReleased() {

    const mouseLocation: any = { }
    mouseLocation.x = mouseX / width
    mouseLocation.y = mouseY / height

    const groups = [ 'red', 'green', 'blue', 'yellow', 'purple' ]
    // const groups = [ 'red', 'blue' ]

    const group = groups[nextGroup]


    if (keyIsDown(CONTROL)) {
        groundBoundries.push(new Box(mouseX, mouseY, 20, 20, true))
        return
    } else if (keyIsDown(OPTION)) {
        const collisionGroup = new CollisionGroup([group], false)
        hallowBalls.push(new Ball(mouseX, mouseY, 100, collisionGroup))

    } else {
        const collisionGroup = new CollisionGroup([group], true)
        solidBalls.push(new Ball(mouseX, mouseY, 100, collisionGroup))

    }


    nextGroup = (nextGroup + 1) % groups.length
}

const draw = () => {

    Matter.Engine.update(engine)

    background(17, 17, 17)
    // translate(width / 2, height / 2)


    // TODO: draw hallow balls after solid balls
    // TODO: Despawn balls that are off the screen
    // TODO: add next color identifier in UI
    // TODO: Make masses of balls different
    // TODO: make challenging game mechanic
    // TODO: make balls gro when spawned
    // TODO: add dashed ball
    for (const ball of solidBalls) {
        ball.show()
    }
    for (const ball of hallowBalls) {
        ball.show()
    }

    for (const groundBound of groundBoundries) {
        groundBound.show()
    }
    
    ground.show()
    
    showFramerate()
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}
