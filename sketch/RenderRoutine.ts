interface IPosition {
    x: number,
    y: number
}

class RenderRoutine {

    public color: p5.Color

    public position: IPosition = { x: 0, y: 0 } as IPosition
    public dimensions: IPosition
    public orientation: number = 0

    public fill: boolean = false
    public stroke: number = 0

    public scale: number = 1

    public renderMethod: any = ellipse

    constructor(color: p5.Color, dimensions: IPosition) {
        this.color = color
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

        if (this.stroke > 0) {
            strokeWeight(this.stroke)
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
