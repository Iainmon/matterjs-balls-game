var Example = Example || {};
Example.collisionFiltering = function () {
    var Engine = Matter.Engine, Render = Matter.Render, Runner = Matter.Runner, Composite = Matter.Composite, Composites = Matter.Composites, Common = Matter.Common, MouseConstraint = Matter.MouseConstraint, Mouse = Matter.Mouse, World = Matter.World, Bodies = Matter.Bodies;
    var engine = Engine.create(), world = engine.world;
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false,
            background: '#111'
        }
    });
    Render.run(render);
    var runner = Runner.create();
    Runner.run(runner, engine);
    var defaultCategory = 0x0001, redCategory = 0x0002, greenCategory = 0x0004, blueCategory = 0x0008;
    var redColor = '#C44D58', blueColor = '#4ECDC4', greenColor = '#C7F464';
    World.add(world, Bodies.rectangle(400, 600, 900, 50, {
        isStatic: true,
        render: {
            fillStyle: 'transparent',
            lineWidth: 1
        }
    }));
    World.add(world, Composites.stack(275, 100, 5, 9, 10, 10, function (x, y, column, row) {
        var category = redCategory, color = redColor;
        if (row > 5) {
            category = blueCategory;
            color = blueColor;
        }
        else if (row > 2) {
            category = greenCategory;
            color = greenColor;
        }
        return Bodies.circle(x, y, 20, {
            collisionFilter: {
                category: category
            },
            render: {
                strokeStyle: color,
                fillStyle: 'transparent',
                lineWidth: 1
            }
        });
    }));
    World.add(world, Bodies.circle(310, 40, 30, {
        collisionFilter: {
            mask: defaultCategory | greenCategory
        },
        render: {
            fillStyle: greenColor
        }
    }));
    World.add(world, Bodies.circle(400, 40, 30, {
        collisionFilter: {
            mask: defaultCategory | redCategory
        },
        render: {
            fillStyle: redColor
        }
    }));
    World.add(world, Bodies.circle(480, 40, 30, {
        collisionFilter: {
            mask: defaultCategory | blueCategory
        },
        render: {
            fillStyle: blueColor
        }
    }));
    var mouse = Mouse.create(render.canvas), mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });
    World.add(world, mouseConstraint);
    render.mouse = mouse;
    mouseConstraint.collisionFilter.mask = defaultCategory | blueCategory | greenCategory;
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};
if (typeof module !== 'undefined') {
    module.exports = Example[Object.keys(Example)[0]];
}
var Ball = (function () {
    function Ball(x, y, radius, collisionGroup) {
        if (collisionGroup === void 0) { collisionGroup = new CollisionGroup([]); }
        this.fill = false;
        var options = {
            restitution: 0.5,
            collisionFilter: collisionGroup.collisionFilter()
        };
        var ballColors = Colors();
        this.color = ballColors[collisionGroup.interactionCategoryNames[0]];
        if (collisionGroup.interactionCategories.length >= 2) {
            this.fill = true;
        }
        this.body = Matter.Bodies.circle(x, y, radius, options);
        Matter.World.add(world, this.body);
        this.radius = radius;
    }
    Ball.prototype.show = function () {
        var position = this.body.position;
        var angle = this.body.angle;
        push();
        translate(position.x, position.y);
        rotate(angle);
        if (this.fill) {
            fill(this.color);
        }
        else {
            noFill();
        }
        strokeWeight(2);
        stroke(this.color);
        ellipseMode(CENTER);
        ellipse(0, 0, this.radius * 2, this.radius * 2);
        pop();
    };
    return Ball;
}());
var Box = (function () {
    function Box(x, y, width, height, isStatic) {
        if (isStatic === void 0) { isStatic = false; }
        var options = {
            isStatic: isStatic
        };
        this.body = Matter.Bodies.rectangle(x, y, width, height, options);
        Matter.World.add(world, this.body);
        this.width = width;
        this.height = height;
    }
    Box.prototype.show = function () {
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        fill(255);
        rectMode(CENTER);
        imageMode(CENTER);
        rect(0, 0, this.width, this.height);
        pop();
    };
    return Box;
}());
var CollisionGroup = (function () {
    function CollisionGroup(interactionCategories, interactsWithDefault) {
        if (interactsWithDefault === void 0) { interactsWithDefault = true; }
        this.interactionCategories = [];
        this.interactionCategoryNames = [];
        CollisionGroup.categories['default'] = 0x0001;
        if (interactsWithDefault) {
            interactionCategories.push('default');
        }
        var interactions = interactionCategories.filter(function (element, index, self) {
            return index === self.indexOf(element);
        });
        for (var _i = 0, interactions_1 = interactions; _i < interactions_1.length; _i++) {
            var interaction = interactions_1[_i];
            var unkownCategory = true;
            for (var category in CollisionGroup.categories) {
                if (interaction == category) {
                    this.interactionCategories.push(CollisionGroup.categories[category]);
                    unkownCategory = false;
                }
            }
            this.interactionCategoryNames.push(interaction);
            if (!unkownCategory) {
                continue;
            }
            var nextCategoryBitField = CollisionGroup.lastCategoryBitField * 2;
            var nextCategoryName = interaction;
            CollisionGroup.categories[nextCategoryName] = nextCategoryBitField;
            CollisionGroup.lastCategoryBitField = nextCategoryBitField;
            this.interactionCategories.push(CollisionGroup.categories[interaction]);
        }
    }
    CollisionGroup.prototype.encodeGroup = function () {
        var encodedGroup = 0;
        for (var _i = 0, _a = this.interactionCategories; _i < _a.length; _i++) {
            var category = _a[_i];
            encodedGroup |= category;
        }
        return encodedGroup;
    };
    CollisionGroup.prototype.collisionFilter = function () {
        var collisionFilter = {};
        if (this.interactionCategories.length < 2) {
            collisionFilter.category = this.interactionCategories[this.interactionCategories.length - 1];
        }
        else {
            collisionFilter.mask = this.encodeGroup();
        }
        return collisionFilter;
    };
    CollisionGroup.categories = {};
    CollisionGroup.lastCategoryBitField = 0x0001;
    return CollisionGroup;
}());
var ColloredObject = (function () {
    function ColloredObject() {
    }
    return ColloredObject;
}());
var Colors = function () {
    var colors = {};
    colors.red = color('#C44D58');
    colors.yellow = color('#FCDE58');
    colors.green = color('#C7F464');
    colors.blue = color('#4ECDC4');
    colors.purple = color('#6369D1');
    colors.default = color('#ffffff');
    return colors;
};
var RenderRoutine = (function () {
    function RenderRoutine(color, position, dimensions) {
        this.orientation = 0;
        this.fill = false;
        this.stroke = null;
        this.strokeThickness = 6;
        this.scale = 1;
        this.renderMethod = ellipse;
        this.color = color;
        this.position = position;
        this.dimensions = dimensions;
    }
    RenderRoutine.prototype.render = function () {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.orientation);
        if (this.fill) {
            fill(this.color);
        }
        else {
            noFill();
        }
        if (stroke) {
            strokeWeight(this.strokeThickness);
            stroke(this.color);
        }
        else {
            noStroke();
        }
        rectMode(CENTER);
        ellipseMode(CENTER);
        this.renderMethod(0, 0, this.dimensions.x * this.scale, this.dimensions.y * this.scale);
        pop();
    };
    return RenderRoutine;
}());
var colors = {};
var engine = Matter.Engine.create();
var world = engine.world;
var solidBalls = Array();
var hallowBalls = Array();
var ground;
var groundBoundries = [];
var renderCategories;
var setupColors = function () {
    colors.background = color(2, 43, 58);
    colors.tickmarks = color(232, 233, 243);
    colors.second = color(210, 160, 42);
    colors.minute = color(31, 140, 147);
    colors.hour = color(202, 219, 192);
};
var showFramerate = function () {
    var fps = frameRate();
    fill(255);
    stroke(0);
    text("FPS: " + fps.toFixed(2), 10, 20);
};
var nextGroup = 0;
var setup = function () {
    var canvas = createCanvas(windowWidth, windowHeight);
    translate(width / 2, height / 2);
    angleMode(DEGREES);
    var mouse = Matter.Mouse.create(canvas.elt);
    var options = { mouse: mouse };
    mouse.pixelRatio = pixelDensity();
    var mouseConstraint = Matter.MouseConstraint.create(engine, options);
    Matter.World.add(world, mouseConstraint);
    ground = new Box(width / 2, height - 10, width, 20, true);
    groundBoundries.push(new Box(0, height - 30, 20, 60, true));
    groundBoundries.push(new Box(width, height - 30, 20, 60, true));
};
function mouseReleased() {
    var mouseLocation = {};
    mouseLocation.x = mouseX / width;
    mouseLocation.y = mouseY / height;
    var groups = ['red', 'green', 'blue', 'yellow', 'purple'];
    var group = groups[nextGroup];
    if (keyIsDown(CONTROL)) {
        groundBoundries.push(new Box(mouseX, mouseY, 20, 20, true));
        return;
    }
    else if (keyIsDown(OPTION)) {
        var collisionGroup = new CollisionGroup([group], false);
        hallowBalls.push(new Ball(mouseX, mouseY, 100, collisionGroup));
    }
    else {
        var collisionGroup = new CollisionGroup([group], true);
        solidBalls.push(new Ball(mouseX, mouseY, 100, collisionGroup));
    }
    nextGroup = (nextGroup + 1) % groups.length;
}
var draw = function () {
    Matter.Engine.update(engine);
    background(17, 17, 17);
    for (var _i = 0, solidBalls_1 = solidBalls; _i < solidBalls_1.length; _i++) {
        var ball = solidBalls_1[_i];
        ball.show();
    }
    for (var _a = 0, hallowBalls_1 = hallowBalls; _a < hallowBalls_1.length; _a++) {
        var ball = hallowBalls_1[_a];
        ball.show();
    }
    for (var _b = 0, groundBoundries_1 = groundBoundries; _b < groundBoundries_1.length; _b++) {
        var groundBound = groundBoundries_1[_b];
        groundBound.show();
    }
    ground.show();
    showFramerate();
};
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
//# sourceMappingURL=build.js.map