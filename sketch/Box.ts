
class Box implements IEntity {

    public body: Matter.Body

    routine: RenderRoutine

    constructor(x: number, y: number, width: number, height: number, isStatic = false) {
        const options = {
            isStatic: isStatic
        }
        const body = Matter.Bodies.rectangle(x, y, width, height, options)
        Matter.World.add(world, body)

        const dimensions = { x: width, y:height} as IPosition
        const routine = new RenderRoutine(Colors()['default'], dimensions)
        routine.fill = true
        routine.stroke = 0
        routine.renderMethod = rect

        this.body = body
        this.routine = routine
    }

    public show(): RenderRoutine {
        const position = this.body.position
        this.routine.position.x = position.x
        this.routine.position.y = position.y

        const angle = this.body.angle
        this.routine.orientation = angle

        return this.routine
    }
}