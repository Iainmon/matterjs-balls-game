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
        var body = Matter.Bodies.circle(x, y, radius, options);
        Matter.World.add(world, body);
        var ballColors = Colors();
        var color = ballColors[collisionGroup.interactionCategoryNames[0]];
        var dimensions = { x: radius, y: radius };
        var routine = new RenderRoutine(color, dimensions);
        routine.scale = 2.0;
        routine.stroke = 4;
        if (collisionGroup.interactionCategories.length >= 2) {
            routine.fill = true;
            routine.stroke = 0;
        }
        this.color = color;
        this.radius = radius;
        this.body = body;
        this.routine = routine;
    }
    Ball.prototype.show = function () {
        var position = this.body.position;
        this.routine.position.x = position.x;
        this.routine.position.y = position.y;
        var angle = this.body.angle * (180 / PI);
        this.routine.orientation = angle;
        return this.routine;
    };
    return Ball;
}());
var Box = (function () {
    function Box(x, y, width, height, isStatic) {
        if (isStatic === void 0) { isStatic = false; }
        var options = {
            isStatic: isStatic
        };
        var body = Matter.Bodies.rectangle(x, y, width, height, options);
        Matter.World.add(world, body);
        var dimensions = { x: width, y: height };
        var routine = new RenderRoutine(Colors()['default'], dimensions);
        routine.fill = true;
        routine.stroke = 0;
        routine.renderMethod = rect;
        this.body = body;
        this.routine = routine;
    }
    Box.prototype.show = function () {
        var position = this.body.position;
        this.routine.position.x = position.x;
        this.routine.position.y = position.y;
        var angle = this.body.angle;
        this.routine.orientation = angle;
        return this.routine;
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
    function RenderRoutine(color, dimensions) {
        this.position = { x: 0, y: 0 };
        this.orientation = 0;
        this.fill = false;
        this.stroke = 0;
        this.scale = 1;
        this.renderMethod = ellipse;
        this.color = color;
        this.dimensions = dimensions;
    }
    RenderRoutine.prototype.render = function () {
        push();
        translate(this.position.x, this.position.y);
        angleMode(DEGREES);
        rotate(this.orientation);
        if (this.fill) {
            fill(this.color);
        }
        else {
            noFill();
        }
        if (this.stroke > 0) {
            strokeWeight(this.stroke);
            stroke(this.color);
        }
        else {
            noStroke();
        }
        ellipseMode(CENTER);
        rectMode(CENTER);
        this.renderMethod(0, 0, this.dimensions.x * this.scale, this.dimensions.y * this.scale);
        pop();
    };
    return RenderRoutine;
}());
var Square = (function () {
    function Square(x, y, radius, collisionGroup) {
        if (collisionGroup === void 0) { collisionGroup = new CollisionGroup([]); }
        this.fill = false;
        var options = {
            restitution: 0.5,
            collisionFilter: collisionGroup.collisionFilter()
        };
        var body = Matter.Bodies.rectangle(x, y, radius, radius, options);
        Matter.World.add(world, body);
        var ballColors = Colors();
        var color = ballColors[collisionGroup.interactionCategoryNames[0]];
        var dimensions = { x: radius, y: radius };
        var routine = new RenderRoutine(color, dimensions);
        routine.scale = 1.0;
        routine.stroke = 4;
        routine.renderMethod = rect;
        if (collisionGroup.interactionCategories.length >= 2) {
            routine.fill = true;
            routine.stroke = 0;
        }
        this.color = color;
        this.radius = radius;
        this.body = body;
        this.routine = routine;
    }
    Square.prototype.show = function () {
        var position = this.body.position;
        this.routine.position.x = position.x;
        this.routine.position.y = position.y;
        var angle = this.body.angle * (180 / PI);
        this.routine.orientation = angle;
        return this.routine;
    };
    return Square;
}());
var groups = ['red', 'green', 'blue', 'yellow', 'purple'];
var objectScale = 0.5;
var nextColor;
var engine = Matter.Engine.create();
var world = engine.world;
var entities = {};
var font;
var ballcount = 50;
var showFramerate = function () {
    var fps = frameRate();
    fill(255);
    stroke(0);
    text('FPS: ' + fps.toFixed(2), 10, 20);
};
var drawUserInterface = function () {
    push();
    textFont(font);
    textSize(width * 0.03);
    textAlign(RIGHT, CENTER);
    noStroke();
    fill(nextColor);
    text(ballcount + ' remaining balls', width - 40, 40);
    pop();
};
var nextGroup = 0;
var preload = function () {
    font = loadFont('assets/nunito.ttf');
};
var rotateGroup = function () {
    var group = groups[nextGroup];
    nextGroup = (nextGroup + 1) % groups.length;
    nextColor = Colors()[groups[nextGroup]];
    return group;
};
var setup = function () {
    var canvas = createCanvas(windowWidth, windowHeight);
    translate(width / 2, height / 2);
    angleMode(DEGREES);
    var mouse = Matter.Mouse.create(canvas.elt);
    var options = { mouse: mouse };
    mouse.pixelRatio = pixelDensity();
    var mouseConstraint = Matter.MouseConstraint.create(engine, options);
    Matter.World.add(world, mouseConstraint);
    nextColor = Colors()[groups[nextGroup]];
    entities['solidBalls'] = new Array();
    entities['hallowBalls'] = new Array();
    entities['ground'] = new Array();
    entities['ground'].push(new Box(width / 2, height - 10, width, 20, true));
    entities['ground'].push(new Box(0, height - 30, 20, 60, true));
    entities['ground'].push(new Box(width, height - 30, 20, 60, true));
};
function mouseReleased() {
    if (keyIsDown(CONTROL)) {
        entities['ground'].push(new Box(mouseX, mouseY, 20, 20, true));
        return;
    }
}
function keyPressed() {
    if (keyCode == 81 || keyCode == 69) {
        var group = rotateGroup();
        var collisionGroup = new CollisionGroup([group], keyCode == 81);
        entities['hallowBalls'].push(new Ball(mouseX, mouseY, 100 * objectScale, collisionGroup));
        ballcount -= 1;
    }
    if (keyCode == 65 || keyCode == 68) {
        var group = rotateGroup();
        var collisionGroup = new CollisionGroup([group], keyCode == 65);
        entities['hallowBalls'].push(new Square(mouseX, mouseY, 200 * objectScale, collisionGroup));
        ballcount -= 1;
    }
}
var draw = function () {
    Matter.Engine.update(engine);
    background(17, 17, 17);
    for (var entityGroup in entities) {
        for (var _i = 0, _a = entities[entityGroup]; _i < _a.length; _i++) {
            var entity = _a[_i];
            entity.show().render();
        }
    }
    drawUserInterface();
    showFramerate();
};
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
//# sourceMappingURL=build.js.map