class Ball implements IEntity {

    public body: Matter.Body

    private radius: number

    private color: p5.Color

    public fill = false

    routine: RenderRoutine

    constructor(x: number, y: number, radius: number, collisionGroup: CollisionGroup = new CollisionGroup([])) {
        const options = {
            restitution: 0.5,
            collisionFilter: collisionGroup.collisionFilter()
        }

        const body = Matter.Bodies.circle(x, y, radius, options)
        Matter.World.add(world, body)
        
        const ballColors = Colors()
        const color = ballColors[collisionGroup.interactionCategoryNames[0]]

        const dimensions = { x: radius, y: radius } as IPosition
        const routine = new RenderRoutine(color, dimensions)
        routine.scale = 2.0
        routine.stroke = 8
        if (collisionGroup.interactionCategories.length >= 2) {
            routine.fill = true
            routine.stroke = 0
        }

        this.color = color
        this.radius = radius
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