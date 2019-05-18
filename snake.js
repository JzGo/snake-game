
var draw = function(snakeToDraw, appleToDraw) {
    // setup the drawable snake object
    var drawableSnake = { color: 'orange', pixels: snakeToDraw }
    var drawableApple = { color: 'red', pixels: [appleToDraw] }
    // add drawable snake to the list of objects to draw
    var drawableObjects = [drawableSnake, drawableApple]
    // call chunk library to draw the objects
    CHUNK.draw(drawableObjects)
}

var moveSegment = function(segment) {
    switch(segment.direction) {
    case "down": 
        return { top: segment.top + 1, left: segment.left }
    case "up":
        return { top: segment.top - 1, left: segment.left }
    case "left":
        return { top: segment.top, left: segment.left - 1 }
    case "right":
        return { top: segment.top, left: segment.left + 1 }
    default:
        return segment;
    }
}

var segmentFurtherForwardThan = function(index, snake) {
    if (snake[index - 1] === undefined) {
        return snake[index]
    } else {
        return snake[index - 1]
    }
}

// set up new snake method
var moveSnake = function(snake) {
    var newSnake = snake.map(function(oldSegment, segmentIndex){
        var newSegment = moveSegment(oldSegment)
        newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction
        return newSegment
    })
    return newSnake
}

// creates a change direction function to use when user presses arrow key
var changeDirection = function(direction) {
    snake[0].direction = direction 
}

var growSnake = function(snake) {
    var indexOfLastSegment = snake.length - 1;
    var lastSegment = snake[indexOfLastSegment];
    snake.push({ top: lastSegment.top, left: lastSegment.left})
    return snake
}

var ate = function(snake, otherThing) {
    var head = snake[0]
    return CHUNK.detectCollisionBetween([head], otherThing)
}


// setup game progression
var advanceGame = function() {
    // move snake
    var newSnake = moveSnake(snake);
    if (ate(newSnake, snake)) {
        CHUNK.endGame()
        CHUNK.flashMessage('YOU ATE YOURSELF!')
    }

    if (ate(newSnake, [apple])){
        snake = growSnake(newSnake)
        apple = CHUNK.randomLocation()
    }
    if (CHUNK.detectCollisionBetween(snake, CHUNK.gameBoundaries())) {
        CHUNK.endGame();
        CHUNK.flashMessage("Slam! You hit a wall!")
    }
    // draw snake
    snake = newSnake
    draw(snake, apple)
}

// setup snake segment
var snake = [{ top: 1, left: 0, direction: "down"}, { top: 0, left: 0, direction: "down"}]
var apple = { top: 8, left: 10 }

// run advanceGame 1 time per second
CHUNK.executeNTimesPerSecond(advanceGame, 3)
CHUNK.onArrowKey(changeDirection)
