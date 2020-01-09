class Ball {

    public body: Matter.Body

    private radius: number

    private color: p5.Color

    public fill = false

    constructor(x: number, y: number, radius: number, collisionGroup: CollisionGroup = new CollisionGroup([])) {
        const options = {
            restitution: 0.5,
            collisionFilter: collisionGroup.collisionFilter()
        }

        const ballColors = Colors()
        this.color = ballColors[collisionGroup.interactionCategoryNames[0]]

        // if (collisionGroup.interactionCategories.length < 2) {
        //     options.collisionFilter.category = collisionGroup.interactionCategories[0]
        // } else {
        //     options.collisionFilter.mask = collisionGroup.encodeGroup()
        //     this.fill = true
        // }

        if (collisionGroup.interactionCategories.length >= 2) {
            this.fill = true
        }

        this.body = Matter.Bodies.circle(x, y, radius, options)
        Matter.World.add(world, this.body)
        this.radius = radius

    }

    public show() {
        const position = this.body.position
        const angle = this.body.angle
        push()
        translate(position.x, position.y)
        rotate(angle)

        if (this.fill) {
            fill(this.color)
        } else {
            noFill()
        }
        strokeWeight(2)
        stroke(this.color)

        ellipseMode(CENTER)
        // imageMode(CENTER)
        ellipse(0, 0, this.radius * 2, this.radius * 2)
        pop()

    }
}