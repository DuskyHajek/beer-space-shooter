// Game variables
let player;
let enemies = [];
let bullets = [];
let powerUps = [];
let score = 0;
let gameOver = false;
let combo = 0;
let comboTimer = 0;
let comboMultiplier = 1;
let particles = [];
let highScore = 0;
let currentBeerQuote = "";
let gameTime = 0;
let difficultyLevel = 1;
let enemySpawnInterval;
let difficultyTimer;

// Leaderboard variables
let playerNickname = "";
let isEnteringNickname = false;
let leaderboardData = [];
let showingLeaderboard = false;
let nicknameInput;

// Store canvas position for later use
let canvasX, canvasY;

function setup() {
    let canvas = createCanvas(600, 400);
    canvas.parent('canvas-container');
  
    // Initialize game objects
    player = new Player();
    
    // Select a random beer quote
    selectRandomBeerQuote();
    
    // Reset game difficulty
    resetDifficulty();
    
    // Create nickname input
    nicknameInput = createInput('');
    nicknameInput.addClass('nickname-input');
    nicknameInput.parent('canvas-container');
    nicknameInput.position(-1000, -1000); // Hide it initially
    nicknameInput.attribute('maxlength', 15); // Limit nickname length
    nicknameInput.input(updateNickname);
    
    // Style the input to be hidden initially
    nicknameInput.style('position', 'absolute');
    nicknameInput.style('display', 'none'); // Hide initially
    
    // Store canvas position for later use
    canvasX = canvas.position().x;
    canvasY = canvas.position().y;
}

function updateNickname() {
    playerNickname = nicknameInput.value();
}

function resetDifficulty() {
    // Clear any existing intervals
    if (enemySpawnInterval) clearInterval(enemySpawnInterval);
    if (difficultyTimer) clearInterval(difficultyTimer);
    
    // Reset difficulty variables
    gameTime = 0;
    difficultyLevel = 1;
    
    // Make sure the input field is hidden
    if (nicknameInput) {
        nicknameInput.style('display', 'none');
    }
    
    // Start with base spawn rate
    enemySpawnInterval = setInterval(spawnEnemy, 1500);
    
    // Increase difficulty every 10 seconds
    difficultyTimer = setInterval(increaseDifficulty, 10000);
    
    // Spawn power-ups periodically
    setInterval(spawnPowerUp, 10000);
}

function increaseDifficulty() {
    if (gameOver) return;
    
    // Increase game time and difficulty level
    gameTime += 10;
    difficultyLevel = 1 + Math.floor(gameTime / 10);
    
    // Clear previous enemy spawn interval
    clearInterval(enemySpawnInterval);
    
    // Calculate new spawn rate based on difficulty
    // As difficulty increases, spawn rate gets faster (lower interval)
    let newSpawnRate = Math.max(1500 - (difficultyLevel * 100), 500); // Minimum 500ms
    
    // Set new spawn interval
    enemySpawnInterval = setInterval(spawnEnemy, newSpawnRate);
    
    // Create a visual effect to indicate difficulty increase
    createDifficultyIncreaseEffect();
}

function createDifficultyIncreaseEffect() {
    // Create a flash effect
    let flash = {
        alpha: 150,
        update: function() {
            this.alpha -= 5;
        },
        display: function() {
            fill(255, 0, 0, this.alpha);
            rect(0, 0, width, height);
        }
    };
    particles.push(flash);
    
    // Show difficulty level text
    let levelText = {
        x: width / 2,
        y: height / 2,
        alpha: 255,
        scale: 2,
        update: function() {
            this.alpha -= 3;
            this.scale *= 0.98;
        },
        display: function() {
            push();
            textAlign(CENTER);
            textSize(30 * this.scale);
            fill(255, 255, 0, this.alpha);
            text("LEVEL " + difficultyLevel, this.x, this.y);
            pop();
        }
    };
    particles.push(levelText);
}

function draw() {
    // Draw the pub background instead of plain black
    drawBackground();
  
    if (!gameOver) {
        // Update and display player
        player.update();
        player.display();
      
        // Update and display bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].update();
            bullets[i].display();
          
            // Remove bullets that go off screen
            if (bullets[i].y < 0 || bullets[i].y > height || 
                bullets[i].x < 0 || bullets[i].x > width) {
                bullets.splice(i, 1);
            }
        }
      
        // Update and display enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].update();
            enemies[i].display();
          
            // Check for collision with player
            if (enemies[i].collidesWith(player)) {
                gameOver = true;
                // Create explosion particles for player
                createExplosion(player.x + player.width/2, player.y + player.height/2, 30, [255, 200, 0]);
            }
          
            // Check for collision with bullets
            for (let j = bullets.length - 1; j >= 0; j--) {
                if (enemies[i] && bullets[j] && bullets[j].collidesWith(enemies[i])) {
                    // Reduce enemy health
                    enemies[i].health--;
                    
                    // Remove enemy if health is 0
                    if (enemies[i].health <= 0) {
                        // Increase combo
                        combo++;
                        comboTimer = 120; // 2 seconds at 60fps
                        
                        // Calculate combo multiplier
                        comboMultiplier = min(1 + (combo * 0.1), 3); // Max 3x multiplier
                        
                        // Add score with combo multiplier
                        let pointsEarned = floor(enemies[i].points * comboMultiplier);
                        score += pointsEarned;
                        
                        // Create score popup
                        createScorePopup(enemies[i].x + enemies[i].width/2, enemies[i].y, pointsEarned);
                        
                        // Create explosion particles
                        createExplosion(enemies[i].x + enemies[i].width/2, enemies[i].y + enemies[i].height/2, 15, [255, 223, 0]);
                        
                        enemies.splice(i, 1);
                    }
                    
                    // Always remove the bullet
                    bullets.splice(j, 1);
                    break;
                }
            }
          
            // Remove enemies that go off screen
            if (enemies[i] && enemies[i].y > height) {
                enemies.splice(i, 1);
                // Reset combo when enemy escapes
                combo = 0;
                comboMultiplier = 1;
            }
        }
        
        // Update and display power-ups
        for (let i = powerUps.length - 1; i >= 0; i--) {
            powerUps[i].update();
            powerUps[i].display();
            
            // Check for collision with player
            if (powerUps[i].collidesWith(player)) {
                // Apply power-up effect
                powerUps[i].applyEffect();
                
                // Create particles for power-up collection
                createExplosion(powerUps[i].x + powerUps[i].size/2, powerUps[i].y + powerUps[i].size/2, 10, [255, 255, 255]);
                
                // Remove power-up
                powerUps.splice(i, 1);
            }
            
            // Remove power-ups that go off screen
            if (powerUps[i] && powerUps[i].y > height) {
                powerUps.splice(i, 1);
            }
        }
        
        // Update and display particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].display();
            
            // Remove particles that are done
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }
        
        // Update combo timer
        if (comboTimer > 0) {
            comboTimer--;
        } else {
            combo = 0;
            comboMultiplier = 1;
        }
      
        // Display score
        fill(255);
        textSize(20);
        text("Score: " + score, 20, 30);
        
        // Display level
        fill(255, 200, 0);
        text("Level: " + difficultyLevel, width - 120, 30);
        
        // Display combo
        if (combo > 1) {
            fill(255, 255, 0);
            textSize(16);
            text("Combo: x" + combo + " (" + comboMultiplier.toFixed(1) + "x)", 20, 55);
            
            // Combo timer bar
            noFill();
            stroke(255, 255, 0);
            rect(20, 60, 100, 5);
            fill(255, 255, 0);
            noStroke();
            rect(20, 60, (comboTimer / 120) * 100, 5);
        }
    } else {
        // Game over screen
        fill(255);
        textSize(40);
        textAlign(CENTER);
        text("GAME OVER", width/2, height/2 - 80);
        
        // Update high score
        if (score > highScore) {
            highScore = score;
        }
        
        textSize(20);
        text("Score: " + score, width/2, height/2 - 40);
        text("High Score: " + highScore, width/2, height/2 - 10);
        
        // Beer quote
        textSize(16);
        text(currentBeerQuote, width/2, height/2 + 20);
        
        if (!isEnteringNickname && !showingLeaderboard) {
            // Prompt for nickname - positioned right under the beer quote
            textSize(18);
            text("Enter your nickname:", width/2, height/2 + 50);
            
            // Show the input field with fixed positioning
            let canvasRect = document.getElementById('canvas-container').getBoundingClientRect();
            nicknameInput.style('position', 'absolute');
            nicknameInput.style('left', (canvasRect.left + width/2 - 100) + 'px');
            nicknameInput.style('top', (canvasRect.top + height/2 + 60) + 'px');
            nicknameInput.style('width', '200px');
            nicknameInput.style('transform', 'none'); // Remove transform
            nicknameInput.style('display', 'block'); // Ensure it's visible
            isEnteringNickname = true;
            
            // Add submit button - adjusted position
            fill(255, 204, 0);
            rect(width/2 - 50, height/2 + 90, 100, 30, 5);
            fill(0);
            textSize(16);
            text("SUBMIT", width/2, height/2 + 110);
        } else if (showingLeaderboard) {
            // Make sure the input field is hidden when showing leaderboard
            nicknameInput.style('display', 'none');
            
            // Display leaderboard
            displayLeaderboard();
        }
    }
}

function mousePressed() {
    // Check if submit button is clicked - adjusted position check
    if (gameOver && isEnteringNickname && 
        mouseX > width/2 - 50 && mouseX < width/2 + 50 && 
        mouseY > height/2 + 90 && mouseY < height/2 + 120) {
        
        // Submit score to leaderboard
        submitScore();
    }
}

async function submitScore() {
    // Validate nickname
    if (playerNickname.trim() === "") {
        playerNickname = "Anonymous";
    }
    
    // Hide input
    nicknameInput.style('display', 'none');
    isEnteringNickname = false;
    
    try {
        // Save score (will use local storage if Supabase is not available)
        await saveScore(playerNickname, score);
        
        // Get updated leaderboard
        leaderboardData = await getTopScores();
        
        // Show leaderboard
        showingLeaderboard = true;
    } catch (error) {
        console.error("Error submitting score:", error);
        showingLeaderboard = true;
    }
}

function displayLeaderboard() {
    // Draw fancy leaderboard background with gradient effect
    push();
    // Dark gradient background
    for (let i = 0; i < 200; i++) {
        let alpha = map(i, 0, 200, 220, 100);
        fill(20, 10, 40, alpha);
        rect(width/2 - 170, height/2 - 50 + i, 340, 1);
    }
    
    // Decorative border
    strokeWeight(3);
    stroke(255, 204, 0);
    noFill();
    rect(width/2 - 170, height/2 - 50, 340, 200, 15);
    
    // Inner border with glow effect
    strokeWeight(1);
    stroke(255, 204, 0, 150 + sin(frameCount * 0.1) * 50);
    rect(width/2 - 160, height/2 - 40, 320, 180, 10);
    
    // Beer mug decoration on top corners
    drawBeerMug(width/2 - 150, height/2 - 30, 20);
    drawBeerMug(width/2 + 130, height/2 - 30, 20);
    pop();
    
    // Leaderboard title with shadow effect
    push();
    textAlign(CENTER);
    textSize(28);
    fill(0);
    text("TOP SCORES", width/2 + 2, height/2 - 12);
    fill(255, 215, 0); // Gold color
    text("TOP SCORES", width/2, height/2 - 15);
    pop();
    
    // Draw line under title with gradient
    push();
    for (let i = 0; i < 200; i++) {
        let x = map(i, 0, 200, width/2 - 120, width/2 + 120);
        let alpha = map(abs(x - width/2), 0, 120, 255, 100);
        stroke(255, 204, 0, alpha);
        point(x, height/2);
    }
    pop();
    
    // Display scores with improved styling
    textSize(18);
    textAlign(LEFT);
    
    if (leaderboardData.length > 0) {
        for (let i = 0; i < leaderboardData.length; i++) {
            const entry = leaderboardData[i];
            const y = height/2 + 30 + (i * 30);
            
            // Row background for alternating rows
            if (i % 2 === 0) {
                fill(50, 30, 10, 100);
                rect(width/2 - 150, y - 20, 300, 30, 5);
            }
            
            // Medal for top 3
            if (i < 3) {
                drawMedal(width/2 - 140, y - 5, i);
            } else {
                // Rank for others
                fill(200, 200, 200);
                text((i + 1) + ".", width/2 - 140, y);
            }
            
            // Highlight player's score with glow effect
            if (entry.nickname === playerNickname && entry.score === score) {
                // Glowing background
                push();
                fill(255, 255, 0, 50 + sin(frameCount * 0.1) * 30);
                rect(width/2 - 150, y - 20, 300, 30, 5);
                
                // Nickname with glow
                fill(255, 255, 0);
                text(entry.nickname, width/2 - 100, y);
                
                // Score with glow
                textAlign(RIGHT);
                text(entry.score, width/2 + 130, y);
                pop();
            } else {
                // Regular entry
                fill(255);
                text(entry.nickname, width/2 - 100, y);
                
                // Score
                textAlign(RIGHT);
                fill(255, 204, 0);
                text(entry.score, width/2 + 130, y);
            }
            textAlign(LEFT);
        }
    } else {
        // No scores yet
        push();
        textAlign(CENTER);
        fill(200, 200, 200);
        text("No scores yet", width/2, height/2 + 60);
        
        // Add a small beer mug icon
        drawBeerMug(width/2, height/2 + 90, 30);
        pop();
    }
    
    // Play again prompt with animation
    push();
    textSize(20);
    textAlign(CENTER);
    fill(255, 255, 255, 150 + sin(frameCount * 0.1) * 100);
    text("Press R to play again", width/2, height - 30);
    pop();
}

// Function to draw a medal
function drawMedal(x, y, rank) {
    push();
    strokeWeight(1);
    
    // Medal colors based on rank
    let medalColors = [
        [255, 215, 0],  // Gold
        [192, 192, 192], // Silver
        [205, 127, 50]   // Bronze
    ];
    
    // Draw medal circle
    stroke(0);
    fill(medalColors[rank][0], medalColors[rank][1], medalColors[rank][2]);
    ellipse(x, y, 20, 20);
    
    // Draw ribbon
    noStroke();
    fill(medalColors[rank][0], medalColors[rank][1], medalColors[rank][2], 150);
    triangle(x, y, x - 10, y + 15, x + 10, y + 15);
    
    // Draw number or star in medal
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(rank + 1, x, y);
    
    pop();
}

// Function to draw a small beer mug
function drawBeerMug(x, y, size) {
    push();
    // Mug
    stroke(0);
    strokeWeight(1);
    fill(255, 255, 255, 150);
    rect(x, y, size, size * 1.2, 2);
    
    // Handle
    rect(x + size, y + size * 0.3, size * 0.3, size * 0.6);
    
    // Beer
    noStroke();
    fill(255, 204, 0, 200);
    rect(x + 2, y + size * 0.2, size - 4, size);
    
    // Foam
    fill(255);
    for (let i = 0; i < 3; i++) {
        ellipse(x + size * 0.25 + (i * size * 0.25), y + size * 0.2, size * 0.3, size * 0.2);
    }
    pop();
}

function keyPressed() {
    if (key === ' ') {
        // Shoot when spacebar is pressed
        if (!gameOver) {
            bullets.push(new Bullet(player.x, player.y));
            
            // Rapid fire power-up: shoot multiple bullets
            if (player.hasPowerUp("rapidFire")) {
                setTimeout(() => {
                    if (!gameOver) bullets.push(new Bullet(player.x - 5, player.y));
                }, 100);
                setTimeout(() => {
                    if (!gameOver) bullets.push(new Bullet(player.x + 5, player.y));
                }, 200);
            }
            
            // Triple shot power-up: shoot 3 bullets at once
            if (player.hasPowerUp("tripleShot")) {
                bullets.push(new Bullet(player.x - 15, player.y));
                bullets.push(new Bullet(player.x + 15, player.y));
            }
            
            // Spread shot power-up: shoot in multiple directions
            if (player.hasPowerUp("spreadShot")) {
                // Left diagonal bullet
                let leftBullet = new Bullet(player.x - 10, player.y);
                leftBullet.vx = -1.5;
                bullets.push(leftBullet);
                
                // Right diagonal bullet
                let rightBullet = new Bullet(player.x + 10, player.y);
                rightBullet.vx = 1.5;
                bullets.push(rightBullet);
                
                // Add a backward bullet for fun
                if (random() < 0.3) { // 30% chance
                    let backBullet = new Bullet(player.x, player.y + 20);
                    backBullet.vy = 5; // Move downward
                    bullets.push(backBullet);
                }
            }
        }
    }
  
    if (key === 'r' || key === 'R') {
        // Restart game
        if (gameOver && showingLeaderboard) {
            // Hide the nickname input field
            nicknameInput.style('display', 'none');
            
            player = new Player();
            enemies = [];
            bullets = [];
            powerUps = [];
            particles = [];
            score = 0;
            combo = 0;
            comboMultiplier = 1;
            gameOver = false;
            isEnteringNickname = false;
            showingLeaderboard = false;
            playerNickname = "";
            selectRandomBeerQuote();
            resetDifficulty();
        }
    }
    
    // Handle Enter key for nickname submission
    if ((key === 'Enter' || key === 'Return') && isEnteringNickname) {
        submitScore();
    }
}

function spawnEnemy() {
    if (!gameOver) {
        // Randomly choose enemy type
        let enemyType = floor(random(4));
        let enemy;
        
        switch(enemyType) {
            case 0:
                enemy = new SmallPint();
                break;
            case 1:
                enemy = new BigPint();
                break;
            case 2:
                enemy = new BeerCan();
                break;
            case 3:
                enemy = new BeerBottle();
                break;
        }
        
        // Apply difficulty modifier to enemy speed
        let speedMultiplier = 1 + (difficultyLevel - 1) * 0.1; // 10% increase per level
        enemy.speed *= speedMultiplier;
        
        // Add to enemies array
        enemies.push(enemy);
        
        // Spawn additional enemies at higher difficulty levels
        if (difficultyLevel >= 3 && random() < 0.3) {
            let extraEnemy = new SmallPint();
            extraEnemy.speed *= speedMultiplier;
            enemies.push(extraEnemy);
        }
        
        if (difficultyLevel >= 5 && random() < 0.2) {
            let extraEnemy = new BeerCan();
            extraEnemy.speed *= speedMultiplier;
            enemies.push(extraEnemy);
        }
        
        if (difficultyLevel >= 7 && random() < 0.1) {
            let extraEnemy = new BeerBottle();
            extraEnemy.speed *= speedMultiplier;
            enemies.push(extraEnemy);
        }
    }
}

function spawnPowerUp() {
    if (!gameOver && random() < 0.7) { // 70% chance to spawn a power-up
        let type = random(["speedBoost", "rapidFire", "tripleShot", "spreadShot"]);
        powerUps.push(new PowerUp(random(width - 30), -30, type));
    }
}

// Create explosion particles
function createExplosion(x, y, numParticles, color) {
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// Create score popup
function createScorePopup(x, y, points) {
    particles.push(new ScorePopup(x, y, points));
}

// Player class
class Player {
    constructor() {
        this.x = width / 2;
        this.y = height - 50;
        this.width = 40;
        this.height = 60;
        this.baseSpeed = 5;
        this.speed = this.baseSpeed;
        this.powerUps = {};
    }
  
    update() {
        // Move left and right with arrow keys
        if (keyIsDown(LEFT_ARROW) && this.x > 0) {
            this.x -= this.speed;
        }
        if (keyIsDown(RIGHT_ARROW) && this.x < width - this.width) {
            this.x += this.speed;
        }
        
        // Update power-up timers
        for (let type in this.powerUps) {
            if (this.powerUps[type] > 0) {
                this.powerUps[type]--;
            }
        }
        
        // Reset speed if speed boost is over
        if (!this.hasPowerUp("speedBoost")) {
            this.speed = this.baseSpeed;
        }
    }
  
    display() {
        // Draw beer-loving dude
        
        // Body
        fill(70, 130, 180); // Blue shirt
        rect(this.x, this.y + 20, this.width, this.height - 20);
        
        // Head
        fill(255, 222, 173); // Face color
        ellipse(this.x + this.width/2, this.y + 10, 30, 30);
        
        // Eyes
        fill(0);
        ellipse(this.x + this.width/2 - 7, this.y + 7, 4, 4);
        ellipse(this.x + this.width/2 + 7, this.y + 7, 4, 4);
        
        // Smile
        noFill();
        stroke(0);
        arc(this.x + this.width/2, this.y + 15, 15, 10, 0, PI);
        noStroke();
        
        // Arms
        fill(255, 222, 173); // Skin color
        rect(this.x - 10, this.y + 25, 10, 5); // Left arm
        rect(this.x + this.width, this.y + 25, 10, 5); // Right arm
        
        // Legs
        fill(0, 0, 139); // Dark blue pants
        rect(this.x + 5, this.y + this.height, 10, 10); // Left leg
        rect(this.x + this.width - 15, this.y + this.height, 10, 10); // Right leg
        
        // Power-up indicators
        let yOffset = 0;
        for (let type in this.powerUps) {
            if (this.powerUps[type] > 0) {
                fill(255);
                textSize(10);
                text(this.getPowerUpName(type) + ": " + ceil(this.powerUps[type] / 60) + "s", this.x, this.y - 10 - yOffset);
                yOffset += 12;
            }
        }
    }
    
    // Add power-up
    addPowerUp(type, duration) {
        this.powerUps[type] = duration;
        
        // Apply immediate effects
        if (type === "speedBoost") {
            this.speed = this.baseSpeed * 1.5;
        }
    }
    
    // Check if player has active power-up
    hasPowerUp(type) {
        return this.powerUps[type] && this.powerUps[type] > 0;
    }
    
    // Get power-up display name
    getPowerUpName(type) {
        switch(type) {
            case "speedBoost": return "Speed";
            case "rapidFire": return "Rapid Fire";
            case "tripleShot": return "Triple Shot";
            case "spreadShot": return "Spread Shot";
            default: return type;
        }
    }
}

// Small Pint class
class SmallPint {
    constructor() {
        this.x = random(width - 20);
        this.y = -30;
        this.width = 20;
        this.height = 30;
        this.speed = random(2, 4);
        this.health = 1;
        this.points = 5;
        this.wobble = random(0, TWO_PI); // For animation
        this.bubbles = []; // Bubbles in the beer
        
        // Create bubbles
        for (let i = 0; i < 3; i++) {
            this.bubbles.push({
                x: random(3, this.width - 3),
                y: random(10, this.height - 5),
                size: random(2, 4),
                speed: random(0.1, 0.3)
            });
        }
    }
  
    update() {
        this.y += this.speed;
        this.wobble += 0.1;
        
        // Update bubbles
        for (let bubble of this.bubbles) {
            bubble.y -= bubble.speed;
            if (bubble.y < 8) {
                bubble.y = this.height - 5;
                bubble.x = random(3, this.width - 3);
            }
        }
    }
  
    display() {
        push();
        // Apply slight wobble effect
        translate(this.x + this.width/2, this.y + this.height/2);
        rotate(sin(this.wobble) * 0.05);
        translate(-this.width/2, -this.height/2);
        
        // Glass with gradient
        noStroke();
        for (let i = 0; i < this.width; i++) {
            let alpha = map(i, 0, this.width, 220, 150);
            fill(255, 255, 255, alpha);
            rect(i, 0, 1, this.height, 0, 0, 2, 2);
        }
        
        // Beer with gradient
        for (let i = 0; i < this.width; i++) {
            let beerColor = map(i, 0, this.width, 255, 220);
            fill(beerColor, 223, 0, 220);
            rect(i, 5, 1, this.height - 5);
        }
        
        // Foam with detail
        fill(255);
        rect(0, 0, this.width, 5);
        
        // Foam bubbles
        fill(255, 255, 255, 200);
        ellipse(this.width/4, 2.5, 4, 3);
        ellipse(this.width/2, 2, 5, 3);
        ellipse(3*this.width/4, 3, 4, 3);
        
        // Draw bubbles
        fill(255, 255, 255, 150);
        for (let bubble of this.bubbles) {
            ellipse(bubble.x, bubble.y, bubble.size);
        }
        
        // Glass highlight
        stroke(255, 255, 255, 100);
        strokeWeight(1);
        line(2, 5, 2, this.height - 5);
        
        pop();
    }
  
    collidesWith(other) {
        // Simple collision detection
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}

// Big Pint class
class BigPint {
    constructor() {
        this.x = random(width - 40);
        this.y = -50;
        this.width = 40;
        this.height = 50;
        this.speed = random(1, 3);
        this.health = 2;
        this.points = 10;
        this.wobble = random(0, TWO_PI);
        this.bubbles = [];
        this.foamDrops = [];
        
        // Create bubbles
        for (let i = 0; i < 6; i++) {
            this.bubbles.push({
                x: random(5, this.width - 5),
                y: random(15, this.height - 5),
                size: random(2, 5),
                speed: random(0.1, 0.4)
            });
        }
        
        // Create foam drops
        for (let i = 0; i < 3; i++) {
            this.foamDrops.push({
                x: random(2, this.width - 2),
                y: random(8, 12),
                size: random(3, 5)
            });
        }
    }
  
    update() {
        this.y += this.speed;
        this.wobble += 0.08;
        
        // Update bubbles
        for (let bubble of this.bubbles) {
            bubble.y -= bubble.speed;
            if (bubble.y < 12) {
                bubble.y = this.height - 5;
                bubble.x = random(5, this.width - 5);
            }
        }
    }
  
    display() {
        push();
        // Apply slight wobble effect
        translate(this.x + this.width/2, this.y + this.height/2);
        rotate(sin(this.wobble) * 0.03);
        translate(-this.width/2, -this.height/2);
        
        // Glass with gradient and rounded bottom
        noStroke();
        for (let i = 0; i < this.width; i++) {
            let alpha = map(i, 0, this.width, 220, 150);
            fill(255, 255, 255, alpha);
            rect(i, 0, 1, this.height, 0, 0, 2, 2);
        }
        
        // Beer with gradient
        for (let i = 0; i < this.width; i++) {
            let beerColor = map(i, 0, this.width, 255, 220);
            fill(beerColor, 223, 0, 220);
            rect(i, 8, 1, this.height - 8);
        }
        
        // Foam with detail
        fill(255);
        rect(0, 0, this.width, 8);
        
        // Foam bubbles
        fill(255, 255, 255, 200);
        for (let drop of this.foamDrops) {
            ellipse(drop.x, drop.y, drop.size);
        }
        
        // Draw bubbles
        fill(255, 255, 255, 150);
        for (let bubble of this.bubbles) {
            ellipse(bubble.x, bubble.y, bubble.size);
        }
        
        // Handle with detail
        fill(255, 255, 255, 180);
        rect(this.width, 15, 5, 20, 0, 2, 2, 0);
        
        // Handle highlight
        stroke(255, 255, 255, 100);
        strokeWeight(1);
        line(this.width + 1, 15, this.width + 1, 35);
        
        // Glass highlight
        stroke(255, 255, 255, 100);
        line(3, 8, 3, this.height - 5);
        
        pop();
    }
  
    collidesWith(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}

// Beer Can class
class BeerCan {
    constructor() {
        this.x = random(width - 25);
        this.y = -40;
        this.width = 25;
        this.height = 40;
        this.speed = random(3, 5);
        this.health = 1;
        this.points = 15;
        this.rotation = random(-0.1, 0.1);
        this.rotationSpeed = random(-0.02, 0.02);
        this.labelColor = [
            [255, 0, 0],    // Red
            [0, 0, 255],    // Blue
            [0, 150, 0],    // Green
            [255, 165, 0]   // Orange
        ][floor(random(4))];
    }
  
    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }
  
    display() {
        push();
        // Apply rotation for tumbling effect
        translate(this.x + this.width/2, this.y + this.height/2);
        rotate(this.rotation);
        translate(-this.width/2, -this.height/2);
        
        // Can body with gradient
        noStroke();
        for (let i = 0; i < this.width; i++) {
            let alpha = map(i, 0, this.width, 220, 180);
            let brightness = map(i, 0, this.width, 210, 170);
            fill(brightness, brightness, brightness, alpha);
            rect(i, 0, 1, this.height, 3);
        }
        
        // Top of can
        fill(150, 150, 150);
        ellipse(this.width/2, 0, this.width, 5);
        fill(130, 130, 130);
        ellipse(this.width/2, 0, this.width - 5, 3);
        
        // Pull tab
        fill(170, 170, 170);
        ellipse(this.width/2 + 5, 0, 4, 2);
        
        // Label with brand color
        fill(this.labelColor[0], this.labelColor[1], this.labelColor[2]);
        rect(0, 10, this.width, this.height - 20, 2);
        
        // Label highlight
        fill(255, 255, 255, 50);
        rect(2, 12, this.width - 4, 2);
        
        // Brand text
        fill(255);
        textSize(6);
        textAlign(CENTER);
        text("BEER", this.width/2, this.height/2);
        
        // Reflection highlight
        stroke(255, 255, 255, 80);
        strokeWeight(1);
        line(3, 5, 3, this.height - 5);
        
        pop();
        textAlign(LEFT);
    }
  
    collidesWith(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}

// Beer Bottle class
class BeerBottle {
    constructor() {
        this.x = random(width - 30);
        this.y = -65;
        this.width = 30;
        this.height = 50;
        this.speed = random(2, 4);
        this.health = 3;
        this.points = 20;
        this.rotation = random(-0.05, 0.05);
        this.rotationSpeed = random(-0.01, 0.01);
        this.labelColor = [
            [255, 255, 0],  // Yellow
            [0, 100, 0],    // Dark Green
            [139, 69, 19],  // Brown
            [255, 140, 0]   // Dark Orange
        ][floor(random(4))];
        this.glassColor = [
            [139, 69, 19, 200],  // Brown
            [0, 100, 0, 200],    // Green
            [20, 20, 50, 200]    // Dark Blue
        ][floor(random(3))];
    }
  
    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }
  
    display() {
        push();
        // Apply slight rotation
        translate(this.x + this.width/2, this.y + this.height/2);
        rotate(this.rotation);
        translate(-this.width/2, -this.height/2);
        
        // Bottle body with gradient
        noStroke();
        for (let i = 0; i < this.width; i++) {
            let alpha = map(i, 0, this.width, this.glassColor[3], this.glassColor[3] - 40);
            fill(this.glassColor[0], this.glassColor[1], this.glassColor[2], alpha);
            // Main body
            rect(i, 15, 1, this.height, 0, 0, 3, 3);
        }
        
        // Bottle neck
        for (let i = 0; i < 10; i++) {
            let alpha = map(i, 0, 10, this.glassColor[3], this.glassColor[3] - 40);
            fill(this.glassColor[0], this.glassColor[1], this.glassColor[2], alpha);
            rect(this.width/2 - 5 + i, 0, 1, 15);
        }
        
        // Bottle cap
        fill(255, 0, 0);
        rect(this.width/2 - 7, -5, 14, 5, 1);
        fill(200, 0, 0);
        rect(this.width/2 - 6, -4, 12, 3, 1);
        
        // Label with brand color
        fill(this.labelColor[0], this.labelColor[1], this.labelColor[2]);
        rect(2, 25, this.width - 4, 20, 2);
        
        // Label details
        stroke(0, 0, 0, 100);
        strokeWeight(0.5);
        line(4, 30, this.width - 4, 30);
        line(4, 40, this.width - 4, 40);
        noStroke();
        
        // Brand text
        fill(0);
        textSize(5);
        textAlign(CENTER);
        text("PREMIUM", this.width/2, 35);
        text("BEER", this.width/2, 42);
        
        // Reflection highlight
        stroke(255, 255, 255, 60);
        strokeWeight(1);
        line(5, 15, 5, this.height - 5);
        
        pop();
        textAlign(LEFT);
    }
  
    collidesWith(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}

// Bullet class (dollar bills)
class Bullet {
    constructor(x, y) {
        this.x = x + 15;
        this.y = y;
        this.width = 15;
        this.height = 7;
        this.speed = 7;
        this.vx = 0; // Horizontal velocity
        this.vy = -this.speed; // Default vertical velocity (upward)
    }
  
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
  
    display() {
        // Draw dollar bill
        push();
        // Slight rotation for effect
        translate(this.x, this.y);
        
        // Rotate based on direction
        if (this.vx !== 0 || this.vy !== -this.speed) {
            let angle = atan2(this.vy, this.vx);
            rotate(angle + PI/2);
        } else {
            rotate(frameCount * 0.05);
        }
        
        // Dollar bill background
        fill(120, 180, 120); // Green dollar color
        rect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Dollar bill details
        stroke(30, 80, 30);
        strokeWeight(0.5);
        // Border
        noFill();
        rect(-this.width/2 + 1, -this.height/2 + 1, this.width - 2, this.height - 2);
        
        // $ symbol
        stroke(20, 60, 20);
        line(0, -this.height/2 + 2, 0, this.height/2 - 2);
        
        pop();
        noStroke();
    }
    
    // Add collision detection method for bullets
    collidesWith(other) {
        // Calculate distance between bullet center and enemy center
        let bulletCenterX = this.x;
        let bulletCenterY = this.y;
        let enemyCenterX = other.x + (other.width / 2);
        let enemyCenterY = other.y + (other.height / 2);
        
        // Use distance formula to check collision
        let distance = dist(bulletCenterX, bulletCenterY, enemyCenterX, enemyCenterY);
        
        // If distance is less than the sum of radii, collision occurred
        // Using half of enemy width as its "radius"
        return distance < (this.width / 2 + other.width / 2);
    }
}

// Power-up class
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = 25;
        this.speed = 2;
        this.rotation = 0;
    }
    
    update() {
        this.y += this.speed;
        this.rotation += 0.05;
    }
    
    display() {
        push();
        translate(this.x + this.size/2, this.y + this.size/2);
        rotate(this.rotation);
        
        // Base shape
        fill(200, 200, 200, 200);
        rect(-this.size/2, -this.size/2, this.size, this.size, 5);
        
        // Power-up specific icon
        switch(this.type) {
            case "speedBoost":
                // Lightning bolt
                fill(255, 255, 0);
                beginShape();
                vertex(-5, -10);
                vertex(0, 0);
                vertex(-5, 0);
                vertex(5, 10);
                vertex(0, 0);
                vertex(5, 0);
                endShape(CLOSE);
                break;
            case "rapidFire":
                // Clock icon
                fill(255, 150, 0);
                ellipse(0, 0, 15, 15);
                stroke(50);
                strokeWeight(2);
                line(0, 0, 0, -5);
                line(0, 0, 7, 0);
                break;
            case "tripleShot":
                // Triple bullet icon
                fill(0, 255, 0);
                rect(-8, -2, 5, 5);
                rect(-1, -5, 5, 5);
                rect(6, -2, 5, 5);
                break;
            case "spreadShot":
                // Spread shot icon
                fill(255, 50, 255);
                // Draw arrows pointing in different directions
                // Up arrow
                triangle(0, -10, -5, -5, 5, -5);
                // Left arrow
                triangle(-10, 0, -5, -5, -5, 5);
                // Right arrow
                triangle(10, 0, 5, -5, 5, 5);
                break;
        }
        
        pop();
        
        // Glow effect
        noFill();
        stroke(255, 255, 255, 100 + sin(frameCount * 0.1) * 50);
        strokeWeight(2);
        rect(this.x, this.y, this.size, this.size, 5);
        noStroke();
    }
    
    collidesWith(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.size > other.x &&
            this.y < other.y + other.height &&
            this.y + this.size > other.y
        );
    }
    
    applyEffect() {
        // Apply power-up effect to player
        switch(this.type) {
            case "speedBoost":
                player.addPowerUp("speedBoost", 300); // 5 seconds
                break;
            case "rapidFire":
                player.addPowerUp("rapidFire", 360); // 6 seconds
                break;
            case "tripleShot":
                player.addPowerUp("tripleShot", 240); // 4 seconds
                break;
            case "spreadShot":
                player.addPowerUp("spreadShot", 300); // 5 seconds
                break;
        }
    }
}

// Particle class for explosions
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = random(-2, 2);
        this.vy = random(-2, 2);
        this.alpha = 255;
        this.size = random(3, 8);
        this.color = color || [255, 255, 255];
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 5;
    }
    
    display() {
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], this.alpha);
        ellipse(this.x, this.y, this.size);
    }
}

// Score popup class
class ScorePopup {
    constructor(x, y, points) {
        this.x = x;
        this.y = y;
        this.points = points;
        this.alpha = 255;
        this.vy = -1.5;
    }
    
    update() {
        this.y += this.vy;
        this.alpha -= 3;
    }
    
    display() {
        textAlign(CENTER);
        textSize(16);
        fill(255, 255, 0, this.alpha);
        text("+" + this.points, this.x, this.y);
        textAlign(LEFT);
    }
}

// Function to draw the pub background
function drawBackground() {
    // Main background - dark wood color
    background(60, 30, 15);
    
    // Wooden floor
    fill(120, 80, 40);
    rect(0, height - 80, width, 80);
    
    // Floor grain lines
    stroke(90, 60, 30);
    strokeWeight(1);
    for (let i = 0; i < width; i += 40) {
        line(i, height - 80, i, height);
    }
    
    // Bar counter at the bottom
    fill(150, 100, 50);
    rect(0, height - 100, width, 20);
    
    // Bar edge highlight
    stroke(180, 130, 80);
    strokeWeight(2);
    line(0, height - 100, width, height - 100);
    
    // Wall paneling
    fill(100, 70, 40);
    rect(0, 0, width, 120);
    
    // Shelves with bottles in the background
    fill(80, 50, 30);
    rect(0, 50, width, 20);
    rect(0, 100, width, 20);
    
    // Bottles on shelves
    noStroke();
    for (let i = 20; i < width; i += 40) {
        // Top shelf bottles
        fill(139, 69, 19); // Brown bottles
        rect(i, 30, 10, 20);
        rect(i + 15, 25, 10, 25);
        
        // Bottom shelf bottles
        fill(0, 100, 0); // Green bottles
        rect(i + 5, 80, 10, 20);
        fill(200, 180, 50); // Yellow bottles
        rect(i + 20, 75, 10, 25);
    }
    
    // Pub sign
    fill(180, 130, 50);
    rect(width/2 - 100, 10, 200, 30);
    fill(40, 20, 10);
    textSize(24);
    textAlign(CENTER);
    text("PlanB", width/2, 32);
    
    // Reset drawing settings
    noStroke();
    textAlign(LEFT);
}

// Select a random beer quote
function selectRandomBeerQuote() {
    let beerQuotes = [
        "Beer is proof that God loves us and wants us to be happy.",
        "Life is too short to drink cheap beer.",
        "Beauty is in the eye of the beer holder.",
        "Save water, drink beer!",
        "I'm not drunk, I'm just beer-efficient.",
        "Beer: helping ugly people have sex since 1862!",
        "24 hours in a day, 24 beers in a case. Coincidence?",
        "Give a man a beer, waste an hour. Teach a man to brew, waste a lifetime!",
        "Wish you were beer.",
        "Keep calm and drink beer."
    ];
    currentBeerQuote = beerQuotes[floor(random(beerQuotes.length))];
}