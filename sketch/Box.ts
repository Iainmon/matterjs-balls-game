
class Box {

    public body: Matter.Body

    private width: number
    private height: number

    constructor(x: number, y: number, width: number, height: number, isStatic = false) {
        const options = {
            isStatic: isStatic
            //restitution: 0.5,
        }
        this.body = Matter.Bodies.rectangle(x, y, width, height, options)
        Matter.World.add(world, this.body)
        
        this.width = width
        this.height = height

    }

    public show() {
        const pos = this.body.position
        const angle = this.body.angle
        push()
        translate(pos.x, pos.y)
        rotate(angle)
        fill(255)
        rectMode(CENTER)
        imageMode(CENTER)
        rect(0, 0, this.width, this.height)
        pop()

    }
}