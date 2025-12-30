// --- 1. CONFIGURATION ---
var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
var currentMode = "easy"; // Default mode

// --- 2. START THE GAME ---
// This function runs when you click a mode button (Easy, Medium, Hard)
function startGame(mode) {
    if (!started) {
        currentMode = mode;
        level = 0;
        gamePattern = [];
        started = true;
        
        // Update the status text
        $("#status").text("Mode: " + mode.toUpperCase());

        // Wait a tiny bit, then start the first sequence
        setTimeout(function() {
            nextSequence();
        }, 500);
    }
}

// --- 3. COMPUTER'S TURN (The Sequence) ---
function nextSequence() {
    // Reset the player's inputs for this level
    userClickedPattern = [];
    level++;
    $("#status").text("Level " + level);

    // Pick a random color
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);

    // Flash the button so the user sees it
    $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);

    // HANDLE MODES (The Twist)
    if (currentMode === "medium") {
        rotateBoard();
    } else if (currentMode === "hard") {
        shuffleBoard();
    }
}

// --- 4. PLAYER'S TURN (Clicking) ---
$(".panel").click(function() {
    if (!started) return; // Do nothing if game hasn't started

    var userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);

    playSound(userChosenColor);
    animatePress(userChosenColor);

    // Check the answer immediately after clicking
    checkAnswer(userClickedPattern.length - 1);
});

// --- 5. CHECK THE ANSWER ---
function checkAnswer(currentLevel) {
    // 1. Check if the most recent click was correct
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        
        // 2. If correct, check if they finished the whole sequence
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }

    } else {
        // 3. WRONG ANSWER
        playSound("wrong");
        $("body").addClass("game-over");
        $("#status").text("Game Over! Refresh to Restart.");
        
        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 200);

        startOver();
    }
}

// --- 6. HELPER FUNCTIONS (Sound & Animation) ---

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("active");
    setTimeout(function() {
        $("#" + currentColor).removeClass("active");
    }, 100);
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}

// --- 7. MODE LOGIC (The Twists) ---

function rotateBoard() {
    // Rotates the board 90 degrees every level
    var rotation = level * 90; 
    $(".game-board").css("transform", "rotate(" + rotation + "deg)");
    $(".game-board").css("transition", "transform 2s ease");
}

function shuffleBoard() {
    // Assigns a random order (1-4) to each button using Flexbox
    $(".panel").each(function() {
        var randomPos = Math.floor(Math.random() * 4) + 1; // 1 to 4
        $(this).css("order", randomPos);
    });
}

// Automatically update the footer year
$("#current-year").text( new Date().getFullYear() );