let gameState = "start";  // Tracks the current state of the game
let previousRoom = {x: 0, y: 0}; 
let currentRoom = {x: 0, y: 0};  // Tracks the current room's coordinates on the minimap
let message = "You wake up in a dungeon! Choose your path using the arrow keys.";
let playerResponse = "";  // Variable to store player response (Y/N)
let decisionState = false; // Track whether the player is in a decision-making state
let decisionMade = false;  // To track if a decision has been made in particular rooms
let gameOver = false; // Tracks whether the game is over


//playerVariables
let hasTreasureKey = false;
let hasTorch = false;
let hasRoomKey = false;
let hasBadSword = false;
let hasGoodSword = false;
let hasCoins = false;
let hasShield = false;

//sfx
let sounds = [];
let coinSound;

function preload()
{
  // Load all files
  coinSound = loadSound('Coin.mp3');
  lockedDoorSound = loadSound('LockedDoor.mp3');
  skeleton1 = loadSound('Skeleton.mp3');
  steps = loadSound('Steps.mp3');
  swordDraw1 = loadSound('swordDraw1.mp3');
  deathScream = loadSound('deathScream.mp3');
  
  sounds.push(coinSound, lockedDoorSound, skeleton1, steps, swordDraw1);
  // Other sounds...
}


// Define room details and logic
const roomDetails = {
  "0,0": //Starting Room
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [150, 150, 150],
    getMessage: () => "You are at the starting point.  There is nothing here for you to find",
    action: () => {},
    sound: null,
    visited: false
  },
  
  "0,-1": 
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [150, 150, 150],
    getMessage: () => "You take the north passage, \npushing past cobwebs and crawling insects.  \nThe hallway goes East and West, and there is a door to the North.  \nWhich way do you go?",
    action: () =>
    {
      steps.play();
    },
    sound: null,
    visited: false
  },
  
  "0,-2": 
  {
    locked: true,
    defaultColor: [200, 200, 200],
    visitedColor: [150, 150, 150],
    getMessage: () => "You find a rusty sword.  \nYou are now better armed than before\nBut don't get cocky",
    action: () =>
    {
      swordDraw1.play();
      hasBadSword = true;
      console.log("You picked up a rusty sword!");
    },
    sound: null,
    visited: false
  },
  
  "0,1": {
  locked: false,
  defaultColor: [200, 200, 200],
  visitedColor: [150, 150, 150],
  getMessage: () => {
    if (playerResponse === "Y" || playerResponse === 'y')
    {
      return "You press on through the darkness.";
    }
    else if (playerResponse === "N" || playerResponse === 'n')
    {
      return "You decide not to enter the darkness and head back.";
    }
    else
    {
      return "The way ahead is dark. Do you continue? Y / N";
    }
  },
  action: () => {
    if (playerResponse === "Y" || playerResponse === 'y')
    {
        if (hasTorch == false)
        {
        let chance = random();  // Generates a random number between 0 and 1
        if (chance > 0.5)
        {
          // Player survives
          console.log("You survived the darkness!");
          message = "You survived the darkness!";
        }
        else
        {
          // Player dies
          gameOver = true;
          message = "You died in the darkness.";
          deathScream.play();
          displayGameOverScreen();  // Call to display the game over screen
        }
      }
      else if (hasTorch == true)
        {
          // Player survives
          console.log("You survived the darkness!");
          message = "You survived the darkness!";
        }
      playerResponse = "";
    }
    else if (playerResponse === "N" || playerResponse === 'n')
    {
      console.log("You decided not to enter.");
      decisionMade = true;  // Mark decision as made

      // Reset player response and send them back to the previous room immediately
      playerResponse = "";
      moveTo(previousRoom.x, previousRoom.y);
    }
  },
    sound: null,
  visited: false
},
  
  "0,2": 
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [150, 150, 150],
    getMessage: () => "You find a strange looking key in this room!",
    action: () => {
      hasRoomKey = true;
      console.log("You find a key that seems made for a door");
    },
    sound: null,
    visited: false
  },
  
  "-1,0": 
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [255, 215, 0],
    getMessage: () => 
    {
      if (hasTreasureKey) 
      {
        return "You find a treasure chest. \nWith your key, you open it.  \nYou find some expensive-looking gold coins!";
      } 
      else 
      {
        return "You find a treasure chest. \nYou have no way of opening it.";
      }
    },
    action: () => 
    {
      console.log("You found a treasure chest!");
      if (hasTreasureKey)
        coinSound.play();
        hasCoins = true;
    },
    sound: null, //Play coin sfx
    visited: false
  },
  
  "1,0": 
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [255, 165, 0],
    getMessage: () => "You walk through a hallway.  \nYou feel the temperature rising! \nA great beasts lies ahead!  \nBe wary!",
    action: () => { console.log("Danger! A dragon lurks ahead."); },
    visited: false
  },
  
  "2,0":
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [255, 0, 0],
    getMessage: () => "You encounter a dragon!  Are you prepared to face him? \nY / N",
    action: () =>
    {
      if (playerResponse === "Y" || playerResponse === 'y')
      {
        let chance = random(0, 5);  // Generates a random number between 0 and 1
        if (hasShield == true)
          chance = chance + 1;
        if (hasBadSword == true)
          chance = chance + 1;
        if (hasGoodSword == true)
          chance = chance + 2;
        if (chance > 5)
        {
          message = "You have managed to defeat the Dragon!  \nThe Dungeon is cleared and \nthe world is now a safer place!  \nCongratulations!";
          gameState = "gameWin";
          displayWinScreen();  // Call to display the win screen
        }
        else
        {
          message = "Unfortunately, you were not able to defeat the Dragon.  \nYour journey ends here, adventurer.";
          gameOver = true;
          deathScream.play();
          displayGameOverScreen();  // Call to display the game over screen
        }
      }
      else if (playerResponse === 'N' || playerResponse === 'n')
      {
        console.log("You decided not to enter.");
        decisionMade = true;  // Mark decision as made

        // Reset player response and send them back to the previous room immediately
        playerResponse = "";
        moveTo(previousRoom.x, previousRoom.y);
      }
    },
    visited: false
  },
  
  "1,1":
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [150, 150, 150],
    getMessage: () => "You enter a well-lit room and find a still-lit torch on the ground \nbeside the skeleton of a fallen adventurer",
    action: () =>
    {
      hasTorch = true;
      console.log("You obtain a torch!");
    },
    visited: false
  },
  
  "1,-1":
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [150, 150, 150],
    getMessage: () => "There is little of note in this room, \nbut ahead to the north east, you can hear the\nhammering of a forge...",
    action: () => {},
    visited: false
  },
  
  "-1,1":
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [150, 150, 150],
    getMessage: () => "You walk through the hallway and can hear the muttering of an old man ahead",
    action: () => {},
    visited: false
  },
  
  "-1,-1":
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [255, 0, 0],
    getMessage: () => {
    if (playerResponse === "Y" || playerResponse === 'y') {
      return "You have cleared this room.";
    } else if (playerResponse === "N" || playerResponse === 'n') {
      return "You decide not to enter the darkness and head back.";
    } else {
      return "There is a skeleton ahead. Do you choose to fight him? Y / N";
    }
  },
  action: () => {
    if (playerResponse === "Y" || playerResponse === 'y') 
    {
      let chance = random();  // Generates a random number between 0 and 1
      if (hasBadSword == false)
      {
        if (chance > 0.5)
        {
          // Player survives
          console.log("You survived the battle!");
          message = "You defeat the skeleton and \nretrieve a key from its corpse!";
          hasTreasureKey = true;
        }
        else
        {
          // Player dies
          gameOver = true;
          message = "You are slain.";
          deathScream.play();
          displayGameOverScreen();  // Call to display the game over screen
        }
      }
      if (hasBadSword == true || hasGoodSword == true)
      {
        // Player survives
        console.log("You survived the battle!");
        message = "You defeat the skeleton with your sword and \nretrieve a key from its corpse!";
        hasTreasureKey = true;
      }
      playerResponse = "";
    }
    else if (playerResponse === "N" || playerResponse === 'n')
    {
      console.log("You retreat back from the room.");
      decisionMade = true;  // Mark decision as made

      // Reset player response and send them back to the previous room immediately
      playerResponse = "";
      moveTo(previousRoom.x, previousRoom.y);
    }
  },
  visited: false
  },
  
  "1,2":
  {
    locked: true,
    defaultColor: [0, 0, 0],
    visitedColor: [150, 150, 150],
    getMessage: () => "",
    action: () => {},
    visited: false
  },
  
  "-1,2":
  {
    locked: true,
    defaultColor: [0, 0, 0],
    visitedColor: [150, 150, 150],
    getMessage: () => "",
    action: () => {},
    visited: false
  },
  
  "1,-2":
  {
    locked: true,
    defaultColor: [0, 0, 0],
    visitedColor: [150, 150, 150],
    getMessage: () => "",
    action: () => {},
    visited: false
  },
  
  "-1,-2":
  {
    locked: true,
    defaultColor: [0, 0, 0],
    visitedColor: [150, 150, 150],
    getMessage: () => "",
    action: () => {},
    visited: false
  },
  
  "-2,0":
  {
    locked: true,
    defaultColor: [0, 0, 0],
    visitedColor: [150, 150, 150],
    getMessage: () => "",
    action: () => {},
    visited: false
  },
  
  "-2,-1":
  {
    locked: true,
    defaultColor: [0, 0, 0],
    visitedColor: [150, 150, 150],
    getMessage: () => "",
    action: () => {},
    visited: false
  },
  
  "-2,-2":
  {
    locked: true,
    defaultColor: [0, 0, 0],
    visitedColor: [150, 150, 150],
    getMessage: () => "",
    action: () => {},
    visited: false
  },
  
  "2,1":
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [255, 165, 0],
    getMessage: () => "You are at a crossroads\nTo the south is a dark cavern, likely a dead end\nTo the north, heat, and the subtle groaning of a Dragon\nThe choice is yours...",
    action: () => {},
    visited: false
  },
  
  "2,-1":
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [255, 165, 0],
    getMessage: () => "You are at a crossroads\nTo the north is the sound of hammer against anvil\nTo the south, heat, and the subtle groaning of a Dragon\nThe choice is yours...",
    action: () => {},
    visited: false
  },
  
  "-2,1":
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [150, 150, 150],
    getMessage: () => "As you travel through the dungeon, \nyou hear a strange muttering to the south",
    action: () => {},
    visited: false
  },
  
  "2,-2":
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [0, 0, 200],
    getMessage: () =>
    {
      if (playerResponse === "Y" || playerResponse === 'y' && hasCoins == true) {
      return "You have finished your interaction with the blacksmith.";
    } else if (playerResponse === "N" || playerResponse === 'n') {
      return "You decide not to approach the blacksmith.";
    } else {
      return "There is a blacksmith ahead hard at work\nDo you approach him?\n Y / N";
    }
    },
    action: () => 
    {
      if (playerResponse === "Y" || playerResponse === 'y') 
      {
        if (hasCoins == false)
        {
          message = "You are turned away for having nothing to barter with";
        }
        else if (hasCoins == true)
        {
          message = "With something to barter with, the blacksmith agreed to\ngive you a shield in exchange for your coins.";
          hasShield = true;
          console.log("You obtain a shield from the blacksmith!");
        }
      }
      else if (playerResponse === "N" || playerResponse === 'n')
      {
        console.log("You leave the blacksmith to his business.");
        decisionMade = true;  // Mark decision as made

        // Reset player response and send them back to the previous room immediately
        playerResponse = "";
        moveTo(previousRoom.x, previousRoom.y);
      }
    },
    visited: false
  },
  
  "2,2":
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [255, 165, 0],
    getMessage: () => "You find here the corpse of a fallen adventurer,\nscorched by fire, \ndied facing north in horror.",
    action: () => {},
    visited: false
  },
  
  "-2,2":
  {
    locked: false,
    defaultColor: [200, 200, 200],
    visitedColor: [0, 128, 0],
    getMessage: () => "",
    action: () => 
    {
      if (hasTreasureKey == true)
      {
        if (hasBadSword == true)
            {
              message = "You travel south, and here find a secluded library with \nan old man sitting at a desk.\nHe looks up to you, and smiles.  \nSeeing you only equipped with a rusty sword, he mentions to you the dangers of \ntravelling alone,and offers you a powerful sword";
              console.log("Improved Sword Obtained");
              hasGoodSword = true;
            }
          else
            {
              message = "You travel south, and here find a secluded library with \nan old man sitting at a desk.\nHe looks up to you, and smiles.  \nSeeing you without a weapon, he mentions to you the dangers of \ntravelling alone,and offers you a powerful sword";
              console.log("Improved Sword Obtained");
              hasGoodSword = true;
            }
      }
      else if (hasTreasureKey == false)
      {
        message = "You travel south, and here find a secluded library with \nan old man sitting at a desk.  \nHe looks up at you, and smiles, saying that you have not yet proven \nyourself against the dungeon's danger.\nHe bids you to come back when you have faced true combat."
      }
    },
    visited: false
  },
};

function setup() 
{
  createCanvas(800, 300);  // Expanded canvas to accommodate more space
  textSize(16);
}

function draw() 
{
  if (gameOver == true)
    showGameOverScreen();
  else if (gameState == "gameWin")
    showGameWinScreen();
  else
  {
    background(220);

    // Display the message to the player
    fill(0);
    textAlign(CENTER);
    text(message, width / 2 - 150, height / 2);  // Adjusted to leave space for minimap

    // Draw the minimap
    drawMinimap();

    // Display room coordinates for debugging
    displayRoomCoordinates();
  }
}

// Detect arrow key presses for directions
function keyPressed() {
  if (key ==='d')
  {
    console.log("Current game state:", gameState);
  }
  if (key === 'R' || key === 'r') {
    restartGame();  // Call a function to restart the game
  }
  if (!decisionState) { // Allow movement only if not in a decision-making state
    if (keyCode === UP_ARROW) {
      moveTo(currentRoom.x, currentRoom.y - 1);
      gameState = "up";
    } else if (keyCode === DOWN_ARROW) {
      moveTo(currentRoom.x, currentRoom.y + 1);
      gameState = "down";
    } else if (keyCode === LEFT_ARROW) {
      moveTo(currentRoom.x - 1, currentRoom.y);
      gameState = "left";
    } else if (keyCode === RIGHT_ARROW) {
      moveTo(currentRoom.x + 1, currentRoom.y);
      gameState = "right";
    }
  }
  
  // Handle player responses only if in a decision-making state
  if (key === 'Y' || key === 'y' || key === 'N' || key === 'n') {
    if (decisionState)
    {
      playerResponse = key;
      const roomKey = `${currentRoom.x},${currentRoom.y}`;
      const room = roomDetails[roomKey] || {
        defaultColor: [200, 200, 200],
        visitedColor: [150, 150, 150],
        getMessage: () => "You are in an unknown room.",
        action: () => {},
        visited: false,
        locked: false
      };
      message = room.getMessage();
      room.action();
      decisionState = false; // Unlock movement after decision
    }
  }
}

// Function to move to a new room and update the message and actions
function moveTo(newX, newY) 
{
  
  stopAllSounds();
  
  // Store the current room as the previous room
  previousRoom = { ...currentRoom };
  
  // Update the room position and ensure it stays within bounds
  currentRoom.x = constrain(newX, -2, 2);
  currentRoom.y = constrain(newY, -2, 2);
  
  // Get room details
  const roomKey = `${currentRoom.x},${currentRoom.y}`;
  let room = roomDetails[roomKey] || 
  {
    defaultColor: [200, 200, 200],
    visitedColor: [150, 150, 150],
    getMessage: () => "You are in an unknown room.",
    action: () => {},
    visited: false,
    locked: false
  };
  
  // Check if the room is locked
  if (room.locked) {
    if (roomKey === "0,-2" && hasRoomKey) {
      // Unlock the room if the player has the key for room 0,-2
      room.locked = false;
      message = "You unlock the door to the north with the key.";
    } else {
      // Revert to the previous room if the new room is locked
      currentRoom = { ...previousRoom };
      lockedDoorSound.play();
      message = "The room is locked. You cannot enter.";
      return; // Exit the function
    }
  }
  
  // Reset the room state if needed
  if (roomKey === "0,1" && decisionMade) {
    room.visited = false;  // Reset visited status
    decisionMade = false;  // Reset decision status
    playerResponse = "";   // Clear player response
  }
  if (roomKey === "-2,2" && hasTreasureKey) {
    room.visited = false;  // Reset visited status
    decisionMade = false;  // Reset decision status
    playerResponse = "";   // Clear player response
  }
  if (roomKey === "-1,0" && hasTreasureKey) {
    room.visited = false;  // Reset visited status
    decisionMade = false;  // Reset decision status
    playerResponse = "";   // Clear player response
  }
  
  // If the room requires a decision, lock movement and set decisionState
  if (room.getMessage().includes("Y / N"))
  {
    decisionState = true;
    playerResponse = ""; // Reset playerResponse
  }

  // Update the message and perform actions
  message = room.getMessage();
  
  //play room sound effect
  /*if (room.sound)
  {
    playSound(room.sound);
  }*/
  
  // Mark room as visited and set the color to visitedColor if it hasn't been visited
  if (!room.visited) 
  {
    room.visited = true;
    room.action();
  }
}

/*function playSound(soundFileName)
{
  let sound = loadSound(soundFileName);
  sound.play();
}*/

function stopAllSounds()
{
  for (let i = 0; i < sounds.length; i++)
  {
    if (sounds[i].isPlaying())
      {
        sounds[i].stop();
      }
  }
}

// Draw the minimap
function drawMinimap() 
{
  let mapX = 650;  // X position of the minimap
  let mapY = 100;  // Y position of the minimap to move it down
  let roomSize = 50;  // Size of each room in the minimap
  let borderWidth = 3;  // Width of the border

  // Draw rooms on the minimap
  for (let x = -2; x <= 2; x++) 
  {
    for (let y = -2; y <= 2; y++) 
    {
      // Determine the color of the room
      let roomKey = x + ',' + y;
      let room = roomDetails[roomKey] || 
      {
        defaultColor: [200, 200, 200],
        visitedColor: [150, 150, 150],
        getMessage: () => "You are in an unknown room.",
        action: () => {},
        visited: false
      };
      let roomColor = room.visited ? room.visitedColor : room.defaultColor;

      fill(roomColor);
      if (x === currentRoom.x && y === currentRoom.y) 
      {
        stroke(0, 255, 0);  // Border color for current room
        strokeWeight(borderWidth);  // Border width
      } 
      else 
      {
        noStroke();  // No border for other rooms
      }
      rect(mapX + x * roomSize, mapY + y * roomSize, roomSize, roomSize);
    }
  }

  // Draw labels for the minimap
  fill(0);
  textAlign(CENTER);
  //text("Minimap", mapX + 2 * roomSize, mapY - 10);
}

// Function to display room coordinates for debugging
function displayRoomCoordinates() 
{
  fill(0);
  textAlign(LEFT);
  text(`Room Coordinates: (${currentRoom.x}, ${currentRoom.y})`, 10, height - 10);
}

function displayGameOverScreen() {
  background(0);  // Black background for the game over screen
  fill(255, 0, 0);  // Red text for game over
  textAlign(CENTER);
  textSize(32);
  text("Game Over", width / 2, height / 2 - 20);
  textSize(16);
  text("Press 'R' to restart", width / 2, height / 2 + 20);
  
  // Lock player movement while game is over
  noLoop();
}

function displayWinScreen() {
  background(0);  // Black background for the win screen
  fill(0, 255, 0);  // Green text for victory
  textAlign(CENTER);
  textSize(32);
  text("Victory!", width / 2, height / 2 - 20);
  textSize(16);
  text("The world is a safer place now.", width / 2, height / 2 + 10);
  text("Press 'R' to restart", width / 2, height / 2 + 40);
  
  // Lock player movement while the game is won
  noLoop();
}

function restartGame() {
  // Reset player variables and states
  hasTreasureKey = false;
  hasTorch = false;
  hasRoomKey = false;
  hasBadSword = false;
  hasGoodSword = false;
  hasCoins = false;
  hasShield = false;
  gameOver = false;

  // Reset all rooms' visited property to false
  for (let room in roomDetails) {
    roomDetails[room].visited = false;
  }

  // Reset the current room to the starting room
  currentRoom = { x: 0, y: 0 };
  previousRoom = { x: 0, y: 0 };
  message = "You wake up in a dungeon! Choose your path using the arrow keys.";
  gameState = "start"; // Restart game state
  playerResponse = ""; // Reset player response
  decisionState = false; // Reset decision state
  loop();
}

