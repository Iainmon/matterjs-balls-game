interface IPosition {
    x: number,
    y: number
}

class RenderRoutine {

    public color: p5.Color

    public position: IPosition
    public dimensions: IPosition
    public orientation: number = 0

    public fill: boolean = false
    public stroke: number | null = null
    public strokeThickness: number = 6

    public scale: number = 1

    public renderMethod: any = ellipse

    constructor(color: p5.Color, position: IPosition, dimensions: IPosition) {
        this.color = color
        this.position = position
        this.dimensions = dimensions
    }

    render() {
        push()
        translate(this.position.x, this.position.y)
        rotate(this.orientation)

        if (this.fill) {
            fill(this.color)
        } else {
            noFill()
        }

        if (stroke) {
            strokeWeight(this.strokeThickness)
            stroke(this.color)
        } else {
            noStroke()
        }

        rectMode(CENTER)
        ellipseMode(CENTER)

        this.renderMethod(0, 0, this.dimensions.x * this.scale, this.dimensions.y * this.scale)
        pop()
    }
}
