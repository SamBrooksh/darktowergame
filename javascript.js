const STARTING_POINTS = [[0,10],[8,0],[18,8],[10,18]];

function generateScreen()
{
	let choices = [];
	screenSetup = document.getElementById("choices");
	screenSetup.innerHTML = getOptions();
	if ("cs2550timestamp" in localStorage)
	{
		enterTimeStamp = document.getElementById("timestampShow");
		enterTimeStamp.innerHTML = "<p>"+localStorage.getItem("cs2550timestamp")+"</p><button id='clear' onclick='removeTime()'>Remove</button>";
	}
}

function generateIntro()
{
	let psword = document.getElementById("passwordCheck");
	psword.innerHTML = generatePasswordChecker();
}

function getOptions()
{
	html = "";
	html += "<p>Enter Amount of Players</p>";
	html += "<input type='text' id='playerCount' placeholder='Enter Amount of Players' size='30'>";
	html += "<input type='button' value='Confirm' onclick='generateGame()'>";
	html += "<p></p><select id='difficulty' required><option>Easy</option><option>Medium</option><option>Hard</option></select>";
	html += "<input type='button' value='Load Game' onclick='loadGame()'>";
	return html;
}

function generateGame()
{
	let hide = document.getElementById("choices");
	let playerNumber = parseInt(document.getElementById("playerCount").value);
	let difficulty = document.getElementById("difficulty").value;
	//not implemented yet
	hide.innerHTML = "";
	map = document.getElementById("map");
	map.innerHTML = generateMap();
	grid = createGrid();
	menu = document.getElementById("menu");
	menu.innerHTML = generateMenu();
	theGame = new game(grid, playerNumber, difficulty);
	let playSound = document.getElementById("start");
	playSound.play();
	setTimeout(()=>{theGame.startGame();}, 6000);
}

function generatePlayer(html, playerId)
{
	let picLoc = "images/p" + String(playerId)+".jpg";
	if (playerId === "Dragon")
	{
		picLoc = "images/dragon.jpg";
	}
	if (html.innerHTML.length > 0)
	{
		//implement 2 players being same square
		picStr = '<img src="'+picLoc+'" height=30, width=30>';
		html.innerHTML += picStr;
		return true;
	}
	else
	{
		picStr = '<img src="'+picLoc+'" height=30, width=30>';
		html.innerHTML += picStr;
		return true;
	}
	return false;
}

function loadGame(savedGame = "data.json")
{
	let hide = document.getElementById("choices");
	let playerNumber = parseInt(document.getElementById("playerCount").value);
	let difficulty = document.getElementById("difficulty").value;
	//not implemented yet
	hide.innerHTML = "";
	map = document.getElementById("map");
	map.innerHTML = generateMap();
	grid = createGrid();
	menu = document.getElementById("menu");
	menu.innerHTML = generateMenu();
	
	var request = new XMLHttpRequest();
	let info = "";
	request.open("GET", savedGame, false);
	request.send("theGame");
	if (request.status == 200)
	{
		info = JSON.parse(request.responseText).savedGame;
		//let info = JSON.parse(data).theGame;
		theGame = new game(grid, info.players.length);
		for (let updateP = 0; updateP < info.players.length; updateP++)
		{
			theGame.players[updateP].hasKeys[0] = info.players[updateP].hasKeys[0];
			theGame.players[updateP].hasKeys[1] = info.players[updateP].hasKeys[1];
			theGame.players[updateP].hasKeys[2] = info.players[updateP].hasKeys[2];
			theGame.players[updateP].hasSword = info.players[updateP].hasSword;
			theGame.players[updateP].hasBeast = info.players[updateP].hasBeast;
			theGame.players[updateP].hasHealer = info.players[updateP].hasHealer;
			theGame.players[updateP].hasScout = info.players[updateP].hasScout;
			theGame.players[updateP].hasPegasus = info.players[updateP].hasPegasus;
			let tempPos = info.players[updateP].position;
			theGame.players[updateP].position = tempPos;
			theGame.players[updateP].food = info.players[updateP].food;
			theGame.players[updateP].gold = info.players[updateP].gold;
			theGame.players[updateP].warriors = info.players[updateP].warriors;
			theGame.players[updateP].isCursed = info.players[updateP].isCursed;
			removePlayer(getSquare(STARTING_POINTS[updateP][0], STARTING_POINTS[updateP][1]), updateP);
			generatePlayer(getSquare(tempPos[0], tempPos[1]),updateP);
		}
		theGame.keyOrder = info.keyOrder;
		theGame.towerBrigands = info.towerBrigands;
		theGame.dragonSpace = info.dragonSpace;
		theGame.dragonGold = info.dragonGold;
		theGame.dragonWarriors = info.dragonWarriors;
		theGame.gameFinished = info.gameFinished;
		theGame.score = info.score;
		theGame.roundTurn = info.roundTurn;
		theGame.currentTurn = info.currentTurn - 1;
		theGame.iterateTurn();
	}
	else
	{
		//Error
	}
}

function removePlayer(html, playerId)
{
	let findString = "p" + String(playerId);
	if (playerId === "Dragon")
	{
		findString = "dragon"; 
	}

	for (let i = 0; i < html.children.length; i++)
	{
		if (html.children[i].outerHTML.includes(findString))
		{
			html.children[i].outerHTML = "";
			return true;
		}
	}

	return false;
}

function createGrid()
{
	theGrid = [];
	for (i = 0; i < 19; i++)
	{
		tempRow = [];
		for (j = 0; j < 19; j++)
		{
			tempRow.push(getSquare(i, j));
		}
		theGrid.push(tempRow);
	}
	return theGrid;
}

function generateInventory(player)
{
	menu = ["Warriors","Gold","Food","Keys"];
	
	html = "<table class='inventory'>";
	html += '<th class="title" colspan=4>Player ' + String(parseInt(player.playerId + 1)) + '</th>';
	html += '<tr>';
	for (value of menu)
	{
		html += "<td class='header'>"+value+"</td>";
	}
	html += '</tr>';
	html += '<tr>';
	html += '<td>' + String(player.warriors) + '</td>';
	html += '<td>' + String(player.gold) + '</td>';
	html += '<td>' + String(player.food) + '</td>';
	player.hasKeys[0] === true ? html += '<td>Has 1st Key</td>' : html += '<td>No Key 1</td>'//eventually have it just show picture

	html += '</tr>';
	//row 3
	html += '<tr>';
	player.hasBeast === true ? html += '<td>Has Beast</td>': html += "<td>Doesn't Have Beast</td>"
	player.hasScout === true ? html += '<td>Has Scout</td>': html += "<td>Doesn't Have Scout</td>"
	player.hasHealer === true ? html += '<td>Has Healer</td>' : html += "<td>Doesn't Have Scout</td>"
	player.hasKeys[1] === true ? html += '<td>Key2</td>' : html += "<td>No Key2</td>"
	html += '</tr>';
	//row 4
	html += '<tr>';
	player.hasSword === true ? html += '<td>Has Sword</td>': html += "<td>Doesn't Have Sword</td>"
	player.hasPegasus === true ? html += '<td>Has Pegasus</td>': html += "<td>Doesn't Have Pegasus</td>"
	
	html += '<td>' + String(player.position[0]) + ',' + String(player.position[1]) + '</td>';
	
	player.hasKeys[2] === true ? html += '<td>Key3</td>' : html += "<td>No Key3</td>"
	html += '</tr>';
	
	html += '</table>'
	return html;
}

function generateMenu()
{
	menu = [
	['Yes', 'Repeat', 'No'],
	['Haggle', 'Bazaar', 'Clear'],
	['Tomb/ Ruin', 'Move', 'Sanctuary/ Citadel'],
	['DARK TOWER', 'Frontier', 'Inventory']
	];
	
	html = "<div>PLAYER TURN<div id='playerTurn'></div></div><table class='menu'>";
	for (let value = 0; value < menu.length; value++)
	{
		html += "<tr>";
		for (let item = 0; item < 3; item++)
		{
			html += "<td class='row"+String(value)+" col"+String(item)+"'>" + menu[value][item];
			html += "<\/td>";
		}
		html += "</tr>";
	}
	html += '</table><div id="windowDisplay">GAME STARTED</div>';
	return html;
}

function generateMap(x, y)
{
	section = [
	 ['f', 'e', 'e', 'e', 'sanct', 'e', 'e','e','e','e', 'cita', 'e','e','e','e','e','e','e'],
	 ['f', 'e2', 'e3', 'e3', 'e2', 'e2', 'baz', 'e2'],
	 ['f', 'e2', 'e2', 'e3', 'e2', 'ruin', 'e3'],
	 ['f', 'e3', 'tom', 'e3', 'e2', 'e2'],
	 ['f', 'e3', 'e3', 'e3'],
	 ['f', 'dt'] 
	];
	
	theMap = [];
	for (t1 = 0; t1 < 19; t1++)
	{
		tempArr = []
		for (t2 = 0; t2 < 19; t2++)
		{
			tempArr.push("Empty");
		}
		theMap.push(tempArr)
	}
	
	startPos = [[0,0],[18,0],[18,18],[0,18]];
	directions = [[0, 1], [-1, 0],[0, -1],[1, 0]];
	secondInc = [[1, 0], [0,1], [-1, 0], [0, -1]];
	
	for (i = 0; i < 4; i++)
	{
		currentPos = [];
		currentPos[0] = startPos[i][0];
		currentPos[1] = startPos[i][1];
		for (k = 0, max = section.length; k < max; k++)
		{
			for (m = 0; m < k; m++)
			{
				currentPos[0] += secondInc[i][0];
				currentPos[1] += secondInc[i][1];
				currentPos[0] += directions[i][0];
				currentPos[1] += directions[i][1];
			}
			
			for (j = 0, maxJ = section[k].length; j < maxJ; j++)
			{
				theMap[currentPos[0]][currentPos[1]] = section[k][j];
				if (section[k][j] === 'e2')
				{
					if (i === 1)
					{
						theMap[currentPos[0]-1][currentPos[1]] = section[k][j];
						theMap[currentPos[0]][currentPos[1]] = "Empty";
						theMap[currentPos[0]-1][currentPos[1]] += String(i);
					}
					else if (i === 2)
					{
						theMap[currentPos[0]][currentPos[1]-1] = section[k][j];
						theMap[currentPos[0]][currentPos[1]] = "Empty";
						theMap[currentPos[0]][currentPos[1]-1] += String(i);
					}
					else
					{
						theMap[currentPos[0]][currentPos[1]] = section[k][j];
						theMap[currentPos[0]][currentPos[1]] += String(i);
					}
					currentPos[0] = currentPos[0] + 2*directions[i][0];
					currentPos[1] = currentPos[1] + 2*directions[i][1];
				}
				else if (section[k][j] === 'e3')
				{
					if (i === 1)
					{
						theMap[currentPos[0]-2][currentPos[1]] = section[k][j];
						theMap[currentPos[0]][currentPos[1]] = "Empty";
						theMap[currentPos[0]-2][currentPos[1]] += String(i);
					}
					else if (i === 2)
					{
						theMap[currentPos[0]][currentPos[1]-2] = section[k][j];
						theMap[currentPos[0]][currentPos[1]] = "Empty";
						theMap[currentPos[0]][currentPos[1]-2] += String(i);
					}
					else
					{
						theMap[currentPos[0]][currentPos[1]] = section[k][j];
						theMap[currentPos[0]][currentPos[1]] += String(i)
					}
					currentPos[0] = currentPos[0] + 3*directions[i][0];
					currentPos[1] = currentPos[1] + 3*directions[i][1];
				}
				else if (section[k][j] === 'dt')
				{
					if (i === 1)
					{
						theMap[currentPos[0]-6][currentPos[1]] = section[k][j];
						theMap[currentPos[0]][currentPos[1]] = "Empty";
						theMap[currentPos[0]-6][currentPos[1]] += String(i);
					}
					else if (i === 2)
					{
						theMap[currentPos[0]][currentPos[1]-6] = section[k][j];
						theMap[currentPos[0]][currentPos[1]] = "Empty";
						theMap[currentPos[0]][currentPos[1]-6] += String(i);
					}
					else
					{
						theMap[currentPos[0]][currentPos[1]] += String(i);
						currentPos[0] = currentPos[0] + 7 * directions[i][0];
						currentPos[1] = currentPos[1] + 7 * directions[i][1];
					}
				}
				else 
				{
					currentPos[0] += directions[i][0];
					currentPos[1] += directions[i][1];
				}
			}
			currentPos = [];
			currentPos[0] = startPos[i][0];
			currentPos[1] = startPos[i][1];
		}
	}
	theMap[6][6] = "TOWER";
	html = "<table id='grid'>";
	
	for (i = 0, rows = theMap.length; i < rows; i++)
	{
		html += "<tr>";
		for (j = 0, columns = theMap[i].length; j < columns; j++)
		{
			gridSpace = "row"+String(i)+ " col"+String(j);
			if (theMap[i][j] === 'f')
			{
				html += "<td class='frontier "+gridSpace+"'></td>";
			}
			else if (theMap[i][j] === 'e')
			{
				html += "<td class='"+gridSpace+"'></td>";
			}
			else if (theMap[i][j] === 'sanct')
			{
				html += "<td class='sanct "+gridSpace+"'></td>";
			}
			else if (theMap[i][j] === 'cita')
			{
				html += "<td class='citadel "+gridSpace+"'></td>";
			}
			else if (theMap[i][j] === 'baz')
			{
				html += "<td class='bazaar "+gridSpace+"'></td>";
			}
			else if (theMap[i][j] === 'ruin')
			{
				html += "<td class='ruin "+gridSpace+"'></td>";
			}
			else if (theMap[i][j] === 'tom')
			{
				html += "<td class='tomb "+gridSpace+"'></td>";
			}
			else if (theMap[i][j][1] === '2')
			{
				dir = "";
				if (theMap[i][j][2] % 2 === 0)
				{
					dir = " colspan= '2' ";
					html += "<td class='Empty "+gridSpace+" col"+String(j+1) + "'" + dir + "></td>";
				}
				else
				{
					dir = " rowspan= '2' ";
					html += "<td class='Empty "+gridSpace+" row"+String(i+1)+ "'" + dir + "></td>";
				}
			}
			else if (theMap[i][j].startsWith('e3'))
			{
				dir = "";
				if (theMap[i][j][2] % 2 === 0)
				{
					dir = " colspan= '3' ";
					html += "<td class='Empty " + gridSpace + " col"+String(j+1) + " col" + String(j+2) + "'" + dir + "></td>";
				}
				else
				{
					dir = " rowspan= '3' ";
					html += "<td class='Empty "+ gridSpace + " row"+String(i+1) + " row" + String(i+2) + "'" + dir + "></td>";
				}
			}
			else if (theMap[i][j][0] === 'd')
			{
				dir = "";
				addClasses = gridSpace;
				if (theMap[i][j][2] % 2 === 0)
				{
					dir = " colspan= '7' ";
					for (toSeven = 1; toSeven < 7; toSeven++)
					{
						addClasses += " col"+String(j+toSeven);
					}
				}
				else
				{
					for (toSeven = 1; toSeven < 7; toSeven++)
					{
						addClasses += " row"+String(i+toSeven);
					}
					dir = " rowspan='7' ";
				}
				
				html += "<td class='enter "+ addClasses +"'" + dir+ ">Dark Tower</td>";
			}
			else if (theMap[i][j] === "TOWER")
			{
				html += "<td colspan='7' rowspan='7' class='display'><div id='inventory'></div><div id='menu'></div></td>";
			}
			else
			{
				//Skip
			}
		}
		html += "</tr>";
	}
	html += "</table>";
	return html;
}

function getSquare(row, col)
{
	return document.getElementsByClassName("row"+String(row)+" col"+String(col))[0];
}

function getPosition(html)
{
	lists = html.classList;
	getRow = -1;
	getCol = -1;
	for (let l = 0; l < lists.length; l++)
	{
		number = lists[l].slice(3);
		if (lists[l].includes("row"))
		{
			getRow = parseInt(number);
		}
		else if (lists[l].includes("col"))
		{
			getCol = parseInt(number);
		}
	}
	if (getRow !== -1 && getCol !== -1)
	{
		return [getRow, getCol];
	}
	return false;
}

class pc 
{
	constructor(newPlayer=true, start = [0,0], playerId = 0)
	{
		this.hasKeys = [false, false, false];
		this.hasSword = false;
		this.hasBeast = false;
		this.hasHealer = false;
		this.hasScout = false;
		this.hasPegasus = false;
		this.inKingdom = 0; //they all start in kingdom 0, whenever going through frontier increment
		this.position = start;
		this.food = 25;
		this.gold = 30;
		this.warriors = 10;
		this.isCursed = false;
		this.playerId = playerId;
		this.starvingCounter = 0;
	}
	
	changeWarriors(amount) //Caps out at 99 - will need to detect if lost outside of class
	{
		this.warriors += parseInt(amount);
		if (this.warriors > 99)
		{
			this.warriors = 99;
		}
		this.checkCarry();
		return this.warriors;
	}
	
	checkCarry()//Each warrior can carry 6 bags of gold - A beast - 50. Lose any extra
	{
		let carryWeight = this.warriors * 6;
		if (this.hasBeast)
		{
			carryWeight += 50;
		}
		if (this.gold > carryWeight)
		{
			this.gold = carryWeight;
		}
	}
	
	changeGold(amount)
	{
		if (amount * -1 > this.gold)
		{
			return false;
		}
		this.gold += amount;
		this.checkCarry();
		return true;
	}
	
	reduceFood()
	{
		let foodLoss = Math.ceil(this.warriors / 15);
		this.food -= foodLoss;
		let timer = 0;
		let timerInc = 750;
		if (this.food < 0)
		{
			this.food = 0;
		}
		
		
		if (this.food <= 0)
		{
			this.starving();
			setTimeout(()=>{updateDisplay(this, "Losing Men to Starvation!");}, timer);
			timer += timerInc;
		}
		else if (foodLoss * 3 >= this.food)
		{
			setTimeout(()=>{updateDisplay(this, "Low on Food!");}, timer);
			timer += timerInc;
			//alert that almost out of food
		}
		else
		{
			this.starvingCounter = 0;
		}
		return timer;
	}
	
	starving()
	{
		this.starvingCounter--;
		this.changeWarriors(this.starvingCounter);
		//Implement starvation penalties
	}
	
	moveToLocation(newLocation)
	{
		this.position = getPosition(newLocation);
	}
	
	changeKingdom()
	{
		if (this.inKingdom === 3)
		{
			this.inKingdom = 0;
		}
		else
		{
			this.inKingdom++;
		}
	}
	gainKey()
	{
		if (this.hasKeys[0] === false)
		{
			this.hasKeys[0] = true;
			return true;
		}
		else if (this.hasKeys[1] === false)
		{
			this.hasKeys[1] = true;
			return true;
		}
		else if (this.hasKeys[2] === false)
		{
			this.hasKeys[2] = true;
			return true;
		}
		//If it makes it here, that's an error
	}
	
	cursed()
	{
		this.isCursed = true;
		let warriorLoss = Math.floor(this.warriors / 4);
		let goldLoss = Math.floor(this.gold / 4);
		this.changeGold(goldLoss * -1);
		this.changeWarriors(warriorLoss * -1);
		return [warriorLoss, goldLoss];
	}
}

function addClass(className, htmlElement)
{
	currentClasses = htmlElement.className.split(" ");
	if (currentClasses.indexOf(className) === -1)
	{
		htmlElement.className += " " + className;
	}
}

function removeClass(className, htmlElement)
{
	currentClasses = htmlElement.className.split(" ");
	index = currentClasses.indexOf(className);
	newClasses = "";
	if (index !== -1)
	{
		for (i = 0; i < currentClasses.length; i++)
		{
			if (i !== index)
			{
				newClasses += currentClasses[i] + " ";
			}
		}
		htmlElement.className = newClasses;
	}
}

class game
{
	constructor(grid, playerAmount = 4, difficulty = "Easy")
	{
		this.theMap = grid;
		this.players = [];
		
		for (i = 0; i < playerAmount; i++)
		{			
			this.players.push(new pc(true, STARTING_POINTS[i], i));
			addClass("Player"+String(this.players[i].playerId), this.theMap[this.players[i].position[0]][this.players[i].position[1]]);
			generatePlayer(getSquare(this.players[i].position[0], this.players[i].position[1]), i);
		}
		this.keyOrder = [0, 1 ,2];
		//Randomize the keys 
		for (let shuffler = this.keyOrder.length - 1; shuffler > 0; shuffler--) //Fisher Yates Algorithm
		{
			let j = Math.floor(Math.random() * (shuffler + 1));
			[this.keyOrder[shuffler], this.keyOrder[j]]  = [this.keyOrder[j], this.keyOrder[shuffler]];
		}
		if (difficulty === "Hard")
		{
			this.towerBrigands = 64;
		}
		else if (difficulty === "Medium")
		{
			this.towerBrigands = randomNumber(32, 64);
		}
		else
		{
			this.towerBrigands = 32;
		}
		//semi randomize this and use difficulty
		this.dragonSpace = [-1,-1];
		this.dragonGold = 0;
		this.dragonWarriors = 0;
		this.gameFinished = false;
		this.score = 0;
		this.roundTurn = 1;
		this.currentTurn = 0;
		this.eventHandlerTracker = [];
		this.store = [];
		this.storeInc = 0;
		this.fightCont = true;
	}
	
	startGame()
	{
		let theMenu = document.getElementById("quickClick");
		theMenu.addEventListener("click", startTurn);
		this.takeTurn(this.players[this.currentTurn]);
	}
	
	getAction(player) //gets user input of action - returns an action object
	{
		let theMenu = document.getElementById("menu");
		let action = theMenu.getElementsByClassName("row1 col1")[0];
		this.eventHandlerTracker.push(action); //Bazaar
		action.addEventListener("click", getBazaar);
		
		action = theMenu.getElementsByClassName("row2 col0")[0];
		this.eventHandlerTracker.push(action);//Tomb/Ruin
		action.addEventListener("click", getTombRuin);
		
		action = theMenu.getElementsByClassName("row2 col1")[0];
		this.eventHandlerTracker.push(action);//Move
		action.addEventListener("click", getMove);
		
		action = theMenu.getElementsByClassName("row2 col2")[0];
		this.eventHandlerTracker.push(action);//Sanct/Citadel
		action.addEventListener("click", getSanctCitadel);
		
		action = theMenu.getElementsByClassName("row3 col0")[0];
		this.eventHandlerTracker.push(action);//DarkTower
		action.addEventListener("click", getDarkTower);
		
		action = theMenu.getElementsByClassName("row3 col1")[0];
		this.eventHandlerTracker.push(action);//Frontier
		action.addEventListener("click", getFrontier);
		
		action = theMenu.getElementsByClassName("row3 col2")[0];
		this.eventHandlerTracker.push(action);//Inventory
		action.addEventListener("click", getInventory);
	}
	
	removeMenuActions()
	{
		let theMenu = document.getElementById("menu");
		let action = theMenu.getElementsByClassName("row1 col1")[0];
		action.removeEventListener("click", getBazaar);
		
		action = theMenu.getElementsByClassName("row0 col0")[0];
		action.removeEventListener("click", buyItem);
		action.removeEventListener("click", closeBazaar);
		
		action = theMenu.getElementsByClassName("row0 col2")[0];
		action.removeEventListener("click", nextItem);
		action.removeEventListener("click", getRetreat);
		
		action = theMenu.getElementsByClassName("row1 col0")[0];
		action.removeEventListener("click", getHaggle);
		
		
		action = theMenu.getElementsByClassName("row2 col0")[0];
		action.removeEventListener("click", getTombRuin);
		
		action = theMenu.getElementsByClassName("row2 col1")[0];
		action.removeEventListener("click", getMove);
		
		action = theMenu.getElementsByClassName("row2 col2")[0];
		action.removeEventListener("click", getSanctCitadel);
		
		action = theMenu.getElementsByClassName("row3 col0")[0];
		action.removeEventListener("click", getDarkTower);
		
		action = theMenu.getElementsByClassName("row3 col1")[0];
		action.removeEventListener("click", getFrontier);
	}
	
	placeDragon(player)
	{
		updateDisplay(player, "DRAGON ATTACK! Choose a square to place Dragon");
		this.clearEventHandlers();
		//play dragon sound
		if (this.dragonSpace[0] !== -1 && this.dragonSpace[1] !== -1)
		{
			let oldSquare = getSquare(this.dragonSpace[0], this.dragonSpace[1]);
			removePlayer(oldSquare, "Dragon");
			removeClass("Dragon", oldSquare);
			//remove dragon from previous square
		}
		
		let options = this.getAdjacentSquares(player.position, false, true)
		for (let i = 0; i < options.length; i++)
		{
			this.addToEventHandler(options[i]);
			options[i].addEventListener("click", dragonAttack);
		}
		
		//place eventListeners that call dragonAttack
	
	}

	takeTurn() //passes a class pc and goes through their turn
	{
		let player = this.players[this.currentTurn];
		let theMenu = document.getElementById("quickClick");
		theMenu.removeEventListener("click", startTurn);
		let timer = 750;
		let timerInc = 750;
		timer += player.reduceFood();
		if (this.players.length === 1 && player.warriors <= 0)
		{
			this.singlePlayerLoss(player, "Last warrior died to starvation");
			return;
		}
		else if (player.warriors <= 0)
		{
			player.warriors = 1;
		}
		if (player.isCursed)
		{
			//Tell them they've been cursed and then display their inventory then end turn
			updateDisplay(player, "CURSED");
			setTimeout(()=>{this.displayInventory(player);}, timer);
			timer += timerInc * 3; //for display Delay
			setTimeout(()=>{this.iterateTurn();}, timer);
			player.isCursed = false;
			return true;
		}
		else
		{
			updateDisplay(player, "What would you like to do?");
			this.getAction(player);
		}
	}
	
	iterateTurn()
	{
		//have some sort of pause so that people can switch before saying ok
		this.currentTurn++;
		let timer = 300;
		let timerInc = 300;
		if (this.currentTurn >= this.players.length)
		{
			this.roundTurn++;
			this.currentTurn = 0;
		}
		this.clearEventHandlers();
		if (this.players.length === 1)
		{
			this.takeTurn();
		}
		else
		{
			setTimeout(()=> {updateDisplay(this.players[this.currentTurn], "Click to begin turn");}, timer);
			timer += timerInc;
			//setTimeout(()=> {this.takeTurn(this.players[this.currentTurn]);}, timer);
			let theMenu = document.getElementById("quickClick");
			setTimeout(()=> {theMenu.addEventListener("click", startTurn);}, timer);
		}
	}
	
	addToEventHandler(square)
	{
		if (!this.eventHandlerTracker.includes(square))
		{
			this.eventHandlerTracker.push(square);
			return true;
		}
	}
	
	removeFromEventHandler(square)
	{
		if (this.eventHandlerTracker.includes(square))
		{
			let removeID = this.eventHandlerTracker.indexOf(square);
			this.eventHandlerTracker.splice(removeID, 1);
			return true;
		}
	}
	
	getAdjacentSquares(square, goingToFrontier = false, dragonPlace = false)
	{
		let origSquare = [];
		if (square.length === 2)
		{
			origSquare = getSquare(square[0], square[1]);
		}
		else
		{
			origSquare = square;
		}
		let positions = origSquare.className.split(" ");
		let rowDests = [];
		let colDests = [];
		
		for (let sPoint = 0; sPoint < positions.length; sPoint++)
		{
			if (positions[sPoint].includes("row"))
			{
				rowDests.push(parseInt(positions[sPoint].slice(3)));
			}
			else if (positions[sPoint].includes("col"))
			{
				colDests.push(parseInt(positions[sPoint].slice(3)));
			}
		}
		let options = [];
		let checkSides = [[1,0],[-1,0],[0,1],[0,-1]];
		for (let rAmount = 0; rAmount < rowDests.length; rAmount++)
		{
			for (let cAmount = 0; cAmount < colDests.length; cAmount++)
			{
				for (let iter = 0; iter < checkSides.length; iter++)
				{
					let alreadyEntered = [];
					alreadyEntered.push(rowDests[rAmount] + checkSides[iter][0]);
					alreadyEntered.push(colDests[cAmount] + checkSides[iter][1]);
					if (!options.includes(getSquare(alreadyEntered[0], alreadyEntered[1])) && this.moveable(alreadyEntered, goingToFrontier, dragonPlace) && getSquare(alreadyEntered[0], alreadyEntered[1]) !== origSquare)
					{
						options.push(getSquare(alreadyEntered[0], alreadyEntered[1]));
					}
				}
			}
		}
		return options;
	}
	
	moveable(position, goingToFrontier = false, dragonPlace = false)
	{
		if (position[0] < 0 || position[1] < 0 || position[0] >= this.theMap.length || position[1] >= this.theMap.length)
		{
			return false; //Outside of map
		}
		else if (position[0] > 5 && position[0] < 13 && position[1] > 5 && position[1] < 13)
		{
			return false; //Dark Tower Area
		}
		else if (position[0] === this.dragonSpace[0] && position[1] === this.dragonSpace[1])
		{
			return false; //Blocked by dragon 
		}
		else if (getSquare(position[0], position[1]).classList.value.includes("frontier") && !goingToFrontier)
		{
			return false;//Need to use Frontier to move onto frontiers
		}
		else if (!getSquare(position[0], position[1]).classList.value.includes("frontier") && goingToFrontier)
		{
			return false; //if heading to frontier only get frontier points
		}
		else if (getSquare(position[0], position[1]).classList.value.includes("bazaar") || 
				getSquare(position[0], position[1]).classList.value.includes("tomb") || 
				getSquare(position[0], position[1]).classList.value.includes("ruin") || 
				getSquare(position[0], position[1]).classList.value.includes("sanct") || 
				getSquare(position[0], position[1]).classList.value.includes("frontier") || 
				getSquare(position[0], position[1]).classList.value.includes("enter") || 
				getSquare(position[0], position[1]).classList.value.includes("citadel"))
		{
			if (dragonPlace)	//If there is a structure, return false
			{
				return false;
			}
			return true;
		}
					
		else
		{
			return true;
		}
	}
	
	createFrontier(origPosition)
	{
		if (!this.isFrontier(origPosition)) //if not a frontier to begin with - return
		{
			console.log("Not a frontier");
			return false;
		}
		
		let diagonals = [[1, 0], [0, 1], [-1, 0], [0, -1]];
		let frontierPos = [[origPosition]];
		for (let i = 0; i < diagonals.length; i++)
		{
			let tempSquare = [origPosition[0] + diagonals[i][0], origPosition[1] + diagonals[i][1]];
			if (isFrontier(tempSquare))
			{
				frontierPos.push(tempSquare);
			}
		}
		let options = this.getAdjacentSquares(frontierPos);
		return options;
		
	}
	
	move(player)
	{
		let options = this.getAdjacentSquares(player.position);
		for (let optNum = 0; optNum < options.length; optNum++)
		{
			this.addToEventHandler(options[optNum]);
			options[optNum].addEventListener("click", getDestination);
		}
	}
	
	bazaar(player)
	{
		this.clearEventHandlers();
		//price range - Item, low, high
		let priceRange = [["Warrior", 8, 12],["Food", 1, 1],["Healer" , 18, 23], ["Scout", 17, 22], ["Beast", 18, 24]];
		this.store = [];
		this.storeInc = 0;
		for (let iter = 0; iter < priceRange.length; iter++)
		{
			let itemType = priceRange[iter][0];
			let cost = randomNumber(priceRange[iter][1], priceRange[iter][2]);
			this.store.push([itemType, cost, cost]);
		}
		this.store.push(["Exit?"]);
		//enable yes and no
		this.displayStore();
	}
	
	curse(player)
	{
		let timer = 750;
		let timerInc = 750;
		if (this.players.length === 1)
		{
			let menGain = Math.floor(player.warriors / 4);
			let goldGain = Math.floor(player.gold / 4);
			player.changeWarriors(menGain);
			player.changeGold(goldGain);
			let msg =  "Through the wizards magics you gain " + String(menGain) + " Warriors ";
			msg += "and " + String(goldGain) + " Gold!";
			setTimeout(()=> {updateDisplay(player, msg);}, timer);
			timer += timerInc * 2;
			setTimeout(()=> {this.iterateTurn();}, timer);
		}
		else
		{
			let choice = player.playerId;
			while (choice === player.playerId || choice > this.players.length || choice < 0)
			{
				choice = parseInt(window.prompt("Enter player to curse")) - 1;
				if (isNaN(choice))
				{
					choice = player.playerId;
				}
			}
			let playersGains = this.players[choice].cursed();
			player.changeWarriors(playersGains[0]);
			player.changeGold(playersGains[1]);
			let msg = "Cursed Player " + String(choice + 1) + " and gained " + String(playersGains[0]) + " Warriors ";
			msg += "and " + String(playersGains[1]) + " bags of Gold!";
			setTimeout(()=> {updateDisplay(player, msg);}, timer);
			timer += timerInc;
			setTimeout(()=> {this.displayInventory(player);}, timer);
			timer += timerInc * 3; //for display
			setTimeout(()=> {this.iterateTurn(player);}, timer);
		}
	}
	
	getReward(player, options)//The earlier the item is in the list the more likely it is - always rewards some of index 0
	{
		let currKingdom = player.inKingdom;
		let keysObtained = player.hasKeys;
		let timer = 750;
		let timerInc = 750;
		
		if (currKingdom === 0 && options.indexOf("Key") !== -1)//if in original kingdom
		{
			options.splice(options.indexOf("Key"), 1);
		}
		else if (keysObtained[currKingdom-1] && options.indexOf("Key") !== -1) //If already have key for area
		{
			options.splice(options.indexOf("Key"), 1); //remove that from rewards
		}
		
		if (player.hasSword && options.indexOf("Sword") !== -1)//If player has Sword or pegasus remove them as rewards
		{
			options.splice(options.indexOf("Sword"), 1);
		}
		if (player.hasPegasus && options.indexOf("Pegasus") !== -1)
		{
			options.splice(options.indexOf("Pegasus"), 1);
		}
		
		let chance = randomNumber(1, 100);
		let goldGain = randomNumber(5, 24);
		let counter = 50;
		let msg = "Gained " + String(goldGain) + " Gold!";
		if (chance < 50)
		{
			player.changeGold(goldGain);
			setTimeout(()=>{updateDisplay(player, msg);}, timer);
			timer += timerInc;
			setTimeout(()=>{this.displayInventory(player);}, timer);
			timer += timerInc * 3; //for display
			setTimeout(()=>{this.iterateTurn();}, timer);
			return;
			//no additional reward
		}
		else
		{
			let additionalReward = "";
			for (let index = 1; index < options.length; index++)
			{
				counter += (40 - 5 * (options.length - 1)) - (index - 1) * 5; //fancy code to make it so that there are different odds
				if (chance < counter)
				{
					additionalReward = options[index];
					break;
				}
			}
			player.changeGold(goldGain);
			setTimeout(()=>{updateDisplay(player, msg);}, timer);
			timer += timerInc;
			if (additionalReward === "Sword")
			{
				setTimeout(()=>{updateDisplay(player, "Gained the Dragonsword!");}, timer);
				timer += timerInc;
				player.hasSword = true;
				setTimeout(()=>{this.displayInventory(player);}, timer);
				timer += timerInc * 3;//for display
				setTimeout(()=>{this.iterateTurn();}, timer);
				timer += timerInc;
			}
			else if (additionalReward === "Pegasus")
			{
				setTimeout(()=>{updateDisplay(player, "Gained a Pegasus!");}, timer);
				timer += timerInc;
				player.hasPegasus = true;
				setTimeout(()=>{this.displayInventory(player);}, timer);
				timer += timerInc * 3;
				setTimeout(()=>{this.iterateTurn();}, timer);
			}
			else if (additionalReward === "Key")
			{
				setTimeout(()=>{updateDisplay(player, "Gained a Magic Key!");}, timer);
				timer += timerInc;
				player.gainKey();
				setTimeout(()=>{this.displayInventory(player);}, timer);
				timer += timerInc * 3;
				setTimeout(()=>{this.iterateTurn();}, timer);
			}
			else if (additionalReward === "Wizard")
			{
				setTimeout(()=>{updateDisplay(player, "Found a Wizard!");}, timer);
				timer += timerInc;
				setTimeout(()=>{this.curse(player);}, timer);//Turn will iterate in curse
			}
		}
	}
	
	fightBrigands(player, rewards, tower=false)
	{
		//play sound
		let playSound = document.getElementById("brigands");
		playSound.play();
		let brigandCount = -1;
		let timer = 3000;
		let timerInc = 750;
		while (brigandCount < 5 || brigandCount > 99) 
		{
			brigandCount = randomNumber(player.warriors - 10, (player.warriors + 5) * 2);
		}
		
		if (tower)
		{
			brigandCount = this.towerBrigands;
		}
		this.fightCont = true;
		this.clearEventHandlers();
		
		let shopMenu = document.getElementById("menu");
		let no = shopMenu.getElementsByClassName("row0 col2")[0];//Initilize No Button as Retreat
		no.addEventListener("click", getRetreat);
		setTimeout(()=> {this.brigandRound(player, brigandCount, rewards, tower);}, timer);
		//Start fight!
	}
	
	brigandRound(player, brigandCount, rewards, tower = false)
	{
		let playSound = "";
		if (this.fightCont === false)
		{
			playSound = document.getElementById("roundLost");
			playSound.play();
			this.retreat(player);
			return;
		}
		let timer = 3000;
		let timerInc = 750;
		updateDisplay(player, "Brigands: " + String(brigandCount) + " Warriors: " + String(player.warriors));
		let fightingOdds = randomNumber(Math.floor(player.warriors / -3), player.warriors);
		let playerPower = player.warriors + fightingOdds;
		if (playerPower >= brigandCount)
		{
			//Win Round
			brigandCount = Math.floor(brigandCount / 2);
			setTimeout(()=> {updateDisplay(player, "Round won! Brigands: " + String(brigandCount) + " Warriors: " + String(player.warriors));}, timer);
			timer += timerInc;
			playSound = document.getElementById("roundWon");
			playSound.play();
			if (tower)
			{
				this.towerBrigands = brigandCount;
			}
		}
		else
		{
			playSound = document.getElementById("roundLost");
			playSound.play();
			//Lose Round
			let warriorLoss = randomNumber(1, Math.ceil((brigandCount - playerPower) / 10));
			if (warriorLoss < 1)
			{
				warriorLoss = 1;
			}
			player.changeWarriors(warriorLoss * -1);
			setTimeout(()=> {updateDisplay(player, "Round lost! Brigands: " + String(brigandCount) + " Warriors: " + String(player.warriors));}, timer);
			timer += timerInc;
		}
		
		if (player.warriors < 3 && this.players.length > 1) //Multiplayer must retreat
		{
			this.retreat(player);
			return;
		}
		else if (player.warriors < 1 && this.players.length === 1) // Single Player LOST
		{
			this.singlePlayerLoss(player, "Last Warrior died to a Brigand!");
			return;
		}
		else if (brigandCount < 1 && tower)	//Player beat DARK TOWER!
		{
			this.clearEventHandlers();
			this.victory(player);
			return;
		}
		else if (brigandCount < 1) //Player beat Brigands
		{
			setTimeout(()=>{this.getReward(player, rewards);}, timer);
			timer += timerInc;
			return;
		}
		setTimeout(()=>{this.brigandRound(player, brigandCount, rewards, tower);}, timer); //Wait a bit then call this again
	}

	victory(player)
	{
		let playSound = document.getElementById("victory");
		playSound.play();
		let menu = document.getElementById("menu");
		menu.style.display = "none";
		let inv = document.getElementById("inventory");
		inv.innerHTML = this.generateVictoryScreen(player);
	}
	
	generateVictoryScreen(winningPlayer)
	{
		let msg = "<h1>Player " + String(winningPlayer.playerId + 1) + " Wins!</h1>";
		//make it so this creates score as well
		this.score = 120 - this.roundTurn + (50 - Math.ceil(winningPlayer.warriors / 5));
		
		msg += "<h3>Score: " + String(this.score) + " </h3>";
		return msg;
	}
	
	singlePlayerLoss(player, loss)
	{
		this.clearEventHandlers();
		let menu = document.getElementById("menu");
		menu.style.display = "none";
		let inv = document.getElementById("inventory");
		inv.innerHTML = this.generateLossScreen(loss);
	}
	generateLossScreen(addMsg)
	{
		let msg = "<h1>YOU LOSE</h1>";
		msg += "<h3>"+addMsg+"</h3>";
		return msg;
	}
	retreat(player)
	{
		let timer = 2000;
		let timerInc = 750;
		updateDisplay(player, "Retreating!");
		if (player.warriors < 2)
		{
			let makeOne = player.warriors - 1;
			player.changeWarriors(makeOne * -1);
		}
		else
		{
			player.changeWarriors(-1); //lose one warrior
		}
		setTimeout(()=>{updateDisplay(player, "Lost a man retreating");}, timer);
		timer += timerInc;
		setTimeout(()=>{this.displayInventory(player);}, timer);
		timer += timerInc * 3;
		setTimeout(()=>{this.iterateTurn()}, timer);
	}
	
	displayStore()
	{
		let shopMenu = document.getElementById("menu");
		let yes = shopMenu.getElementsByClassName("row0 col0")[0];
		let no = shopMenu.getElementsByClassName("row0 col2")[0];
		
		this.addToEventHandler(yes);
		this.addToEventHandler(no);
		if (this.store[this.storeInc][0] === "Exit?")
		{
			let remove = shopMenu.getElementsByClassName("row0 col0")[0];
			remove.removeEventListener("click", buyItem);
			yes.addEventListener("click", closeBazaar);
			no.addEventListener("click", nextItem);
			updateDisplay(this.players[this.currentTurn], "Exit?")
		}
		else
		{
			yes.removeEventListener("click", closeBazaar);
			let haggle = shopMenu.getElementsByClassName("row1 col0")[0];
			this.addToEventHandler(haggle);
			yes.addEventListener("click", buyItem);
			no.addEventListener("click", nextItem);
			haggle.addEventListener("click", getHaggle);
			let shopMsg = this.store[this.storeInc][0] + ": " + this.store[this.storeInc][1] + " Gold";
			updateDisplay(this.players[this.currentTurn], shopMsg);
		}
	}
	
	tombRuin(player)
	{
		let discovery = randomNumber(1, 100);
		let timer = 750;
		let timerInc = 750;
		//play sound
		if (discovery < 20) //Nothing
		{
			updateDisplay(player, "Empty!");
			setTimeout(()=>{this.iterateTurn();}, timer);
			timer += timerInc;
		}
		else
		{
			let rewards = ["Gold", "Key", "Wizard", "Pegasus"];
			if (discovery < 75) //Fight Brigands
			{
				this.fightBrigands(player, rewards);
			}
			else //Find reward
			{
				this.getReward(player, rewards);
			}
		}
	}
	
	sanctCitadel(player)
	{
		let menAid = 0;
		let goldAid = 0;
		let foodAid = 0;
		let timer = 750;
		let timerInc = 750;
		let msg = "The citadel helped out by giving you: ";
		if (player.warriors < 5 || player.food < 5 || player.gold < 7)
		{
			if (player.warriors < 5)
			{
				menAid = randomNumber(3, 10);
				player.changeWarriors(menAid);
				msg += String(menAid) + " Warriors ";
			}
			if (player.gold < 7)
			{
				goldAid = randomNumber (3, 10);
				player.changeGold(goldAid);
				msg += String(goldAid) + " Gold "; 
			}
			if (player.food < 5)
			{
				foodAid = randomNumber(4, 8);
				player.food += foodAid;
				msg += String(foodAid) + " Food";
			}
		}
		else if (player.hasKeys[2] && player.inKingdom === 0 && player.warriors < 24) //If the player has all 3 keys and in home kingdom
		{
			menAid = player.warriors;
			player.changeWarriors(menAid); //they double your warriors
			msg += String(menAid) + " Warriors ";
			//Make a variable to keep track of this - reset when going in tomb/ruin/Baz or DT
		}
		else
		{
			setTimeout(()=>{this.iterateTurn();}, timer);
			timer += timerInc;
			return;
		}
		updateDisplay(player, msg);
		setTimeout(()=>{this.iterateTurn();}, timer);
		timer += timerInc;
	}
	
	frontier(player, nearFronts) ///////////////Works for now, but make better//////////////////////////////
	{
		
		let oldSquare = getSquare(player.position[0], player.position[1]);
		removePlayer(oldSquare, player.playerId);
		removeClass("Player"+String(player.playerId), oldSquare);
		addClass("Player" + String(player.playerId), nearFronts[0]);
		generatePlayer(nearFronts[0], player.playerId);
		player.moveToLocation(nearFronts[0]);
		console.log("Player "+String(player.playerId)+" moved to "+String(getPosition(nearFronts[0])));
		player.changeKingdom();
		theGame.iterateTurn();
	}
	
	darkTower(player)
	{
		let keyChoice = -1;
		let timer = 750;
		let timerInc = 750;
		do
		{
			keyChoice = parseInt(window.prompt("Which key do you put in first?")) - 1;
			if (isNaN(keyChoice))
			{
				keyChoice = -1;
			}
		} while (keyChoice < 0 || keyChoice > 2);
		
		if (keyChoice !== this.keyOrder[0])
		{
			updateDisplay(player, "Wrong Key!");
			setTimeout(()=>{this.iterateTurn();}, timer);
			timer += timerInc;
			return;
			//Break and tell them they are wrong
		}
		
		do
		{
			keyChoice = parseInt(window.prompt("Which key do you put in second?")) - 1;
			if (isNaN(keyChoice))
			{
				keyChoice = -1;
			}
		} while (keyChoice < 0 || keyChoice > 2);
		
		if (keyChoice !== this.keyOrder[1])
		{
			updateDisplay(player, "Wrong Key!");
			setTimeout(()=>{this.iterateTurn();}, timer);
			timer += timerInc;
			return;
			//break and tell them they are wrong
		}
		updateDisplay(player, "After entering the third key in, the door creaks open. To Brigands! Prepare to fight!");
		setTimeout(()=>{this.fightBrigands(player, [], true);}, timer); //Tell function that this is the tower!
		timer += timerInc;
	}
	
	displayInventory(player)
	{
		let timer = 750;
		let timerInc = 750;
		timer += timerInc * 2;
		let menu = document.getElementById("menu");
		menu.style.display = "none";
		let inv = document.getElementById("inventory");
		inv.innerHTML = generateInventory(player);
		setTimeout(()=> {inv.innerHTML = "";}, timer);
		setTimeout(()=> {menu.style.display = "block";}, timer);
	}
	
	clearEventHandlers()
	{
		while (this.eventHandlerTracker.length > 0)
		{
			this.eventHandlerTracker[0].removeEventListener("click", getDestination);
			this.removeFromEventHandler(this.eventHandlerTracker[0]);
		}
		this.removeMenuActions();
	}

}

function updateDisplay(player, action)
{
	let pNum = document.getElementById("playerTurn");
	let currentAction = document.getElementById("windowDisplay");
	pNum.innerHTML = String(player.playerId+1);
	currentAction.innerHTML = action;
}
	
function getMove(position)
{
	updateDisplay(theGame.players[theGame.currentTurn], "Moving");
	theGame.move(theGame.players[theGame.currentTurn]);
}

function getBazaar(position)
{
	let playSound = document.getElementById("bazaar");
	currentPlayer = theGame.players[theGame.currentTurn];
	currentSquare = getSquare(currentPlayer.position[0], currentPlayer.position[1]);
	if (currentSquare.classList.value.includes("baz"))
	{
		playSound.play();
		updateDisplay(currentPlayer, "Visiting Bazaar");
		setTimeout(()=>{theGame.bazaar(currentPlayer);}, 3000);
	}
	else
	{
		updateDisplay(currentPlayer, "Not on Bazaar Square");
	}
}

function dragonAttack(position)
{
	while (theGame.eventHandlerTracker.length > 0)
	{
		theGame.eventHandlerTracker[0].removeEventListener("click", dragonAttack);
		theGame.removeFromEventHandler(theGame.eventHandlerTracker[0]);
	}
	let goal = position.currentTarget;
	let newDragonSquare = getPosition(goal);
	theGame.dragonSpace = newDragonSquare;
	let player = theGame.players[theGame.currentTurn];
	let timer = 750;
	let timerInc = 750;
	
	//place dragon
	addClass("Dragon", goal);
	generatePlayer(goal, "Dragon");
	console.log("Dragon moved to "+String(newDragonSquare));
	
	if (player.hasSword)//if player doesn't have a sword
	{
		player.changeWarriors(theGame.dragonWarriors);
		player.changeGold(theGame.dragonGold);
		theGame.dragonGold = 0;
		theGame.dragonWarriors = 0;
		player.hasSword = false;
		setTimeout(()=> {updateDisplay(player, "Sword owned!");}, timer);
		timer += timerInc;
	}
	else
	{
		let gainWar = Math.floor(player.warriors / 4);
		let gainGold = Math.floor(player.gold / 4);
		player.changeGold(gainGold * -1);
		player.changeWarriors(gainWar * -1);
		theGame.dragonGold += gainGold;
		theGame.dragonWarriors += gainWar;
	}
	setTimeout(()=> {theGame.displayInventory(player);}, timer);
	timer += timerInc * 3;
	setTimeout(()=>{theGame.iterateTurn();}, timer);
}

function getRetreat(position)
{
	theGame.fightCont = false;
	theGame.clearEventHandlers();
}

function getTombRuin(position)
{
	let timer = 4000;
	let timerInc = 750;
	let playSound = document.getElementById("tombRuin");
	currentPlayer = theGame.players[theGame.currentTurn];
	currentSquare = getSquare(currentPlayer.position[0], currentPlayer.position[1]);
	if (currentSquare.classList.value.includes("tomb") || currentSquare.classList.value.includes("ruin") )
	{
		playSound.play();
		theGame.clearEventHandlers();
		updateDisplay(currentPlayer, "Delving into a Tomb or Ruin");
		setTimeout(()=>{theGame.tombRuin(currentPlayer);}, timer);
		timer += timerInc;
	}
	else
	{
		updateDisplay(currentPlayer, "Not on Tomb or Ruin Square");
	}
}

function getFrontier(position)
{
	let timer = 750;
	let timerInc = 750;
	let currP = theGame.players[theGame.currentTurn]
	let pPos = currP.position; //player position
	let adjSqua = theGame.getAdjacentSquares(pPos, true);
	let adjFront = false;
	if (adjSqua.length > 0)
	{
		adjFront = true;
	}
	
	if (currP.inKingdom === 0 && adjFront && currP.hasKeys[2] === false) //In starter kingdom
	{
		updateDisplay(currP, "Entering Frontier");
		theGame.clearEventHandlers();
		setTimeout(()=> {theGame.frontier(currP, adjSqua);}, timer);
		timer += timerInc;
		return;
	}
	else if (currP.inKingdom === 0 && adjFront && currP.hasKeys[2])
	{
		updateDisplay(currP, "You are prepared to enter the Dark Tower! Go conquer it!");
		return;
	}
	else if (currP.hasKeys[currP.inKingdom - 1] === false && adjFront)
	{
		updateDisplay(currP, "Have not yet acquired key from this kingdom yet");
		return;
	}
	else if (adjFront)
	{
		theGame.clearEventHandlers();
		updateDisplay(currP, "Entering Frontier");
		setTimeout(()=> {theGame.frontier(currP, adjSqua);}, timer);
		timer += timerInc;
	}
	else
	{
		updateDisplay(currP, "No Frontier Nearby");
		return;
	}
	
}

function getDarkTower(position)
{
	let timer = 750;
	let timerInc = 750;
	let playSound = document.getElementById("enter");
	let currentPlayer = theGame.players[theGame.currentTurn];
	let currentSquare = getSquare(currentPlayer.position[0], currentPlayer.position[1]);
	if (currentSquare.classList.value.includes("enter") && currentPlayer.hasKeys[2] && currentPlayer.inKingdom === 0)
	{
		updateDisplay(currentPlayer, "Entering Dark Tower");
		playSound.play();
		theGame.clearEventHandlers();
		setTimeout(()=>{theGame.darkTower(theGame.players[theGame.currentTurn]);}, timer);
		timer += timerInc;
	}
	else if (currentSquare.classList.value.includes("enter") && currentPlayer.inKingdom === 0)
	{
		updateDisplay(currentPlayer, "You don't have all three keys!");
	}
	else if (currentSquare.classList.value.includes("enter") && currentPlayer.inKingdom !== 0)
	{
		updateDisplay(currentPlayer, "One must venture into the Dark tower within their home kingdom");
	}
	else
	{
		updateDisplay(currentPlayer, "Not at the Dark Tower"); 
	}
}

function getSanctCitadel(position)
{
	currentPlayer = theGame.players[theGame.currentTurn];
	currentSquare = getSquare(currentPlayer.position[0], currentPlayer.position[1]);
	let playSound = document.getElementById("sanctCitadel");
	if (currentSquare.classList.value.includes("citadel") && currentPlayer.inKingdom !== 0)
	{
		updateDisplay(currentPlayer, "Unable to enter other kingdoms citadels!");
	}
	else if (currentSquare.classList.value.includes("citadel") || currentSquare.classList.value.includes("sanct") )
	{
		playSound.play();
		updateDisplay(currentPlayer, "Resting at a Citadel or Sanctuary");
		theGame.sanctCitadel(currentPlayer);
	}
	else
	{
		updateDisplay(currentPlayer, "Not on a Citadel or Sanctuary Square");
	}
}

function movePlayer(tempPC, goal)
{
	//If make it, remove click listeners -> classId -> picture -> placeClassId -> place picture -> change playerPosition
	let oldSquare = getSquare(tempPC.position[0], tempPC.position[1]);
	removePlayer(oldSquare, tempPC.playerId);
	removeClass("Player"+String(tempPC.playerId), oldSquare);
	addClass("Player" + String(tempPC.playerId), goal);
	generatePlayer(goal, tempPC.playerId);
	tempPC.moveToLocation(goal);
	console.log("Player "+String(tempPC.playerId)+" moved to "+String(getPosition(goal)));
}

function getDestination(newSquare)
{
	let playSound = "";
	while (theGame.eventHandlerTracker.length > 0)
	{
		theGame.eventHandlerTracker[0].removeEventListener("click", getDestination);
		theGame.removeFromEventHandler(theGame.eventHandlerTracker[0]);
	}
	let goal = newSquare.currentTarget;
	let occurrence = randomNumber(1, 100);
	console.log("Moving rolls a " + String(occurrence));
	let tempPC = theGame.players[theGame.currentTurn];
	let timer = 750;
	let timerInc = 750;
	if (occurrence < 84)
	{
		updateDisplay(tempPC, "Safely Moved");
		setTimeout(()=>{movePlayer(tempPC, goal);}, timer);
		timer += timerInc;
		setTimeout(()=>{theGame.iterateTurn();}, timer);
		timer += timerInc;
		return;
	}
	//test to see if they make it 
	else if (occurrence < 88)
	{
		//LOST
		updateDisplay(tempPC, "The traveling gets confusing and your team becomes Lost!");
		if (tempPC.hasScout)
		{
			setTimeout(()=>{updateDisplay(tempPC, "Luckily your Scout leads the way forward!");}, timer);
			setTimeout(()=>{movePlayer(tempPC, goal);}, timer);
			timer += timerInc;
			setTimeout(()=>{theGame.takeTurn(tempPC);}, timer);
			timer += timerInc;
			return; //Leave so the function doesn't end turn
		}
	}
	else if (occurrence < 92)//they don't make it
	{
		//DRAGON
		updateDisplay(tempPC, "Dragon mauled you along the way!");
		setTimeout(()=>{movePlayer(tempPC, goal);}, timer);
		setTimeout(()=>{theGame.placeDragon(tempPC);}, timer);
		return;//Ends turn within Place Dragon
	}
	else if (occurrence < 96)
	{
		updateDisplay(tempPC, "Your party is stricken with a plague!");
		if (tempPC.hasHealer)
		{
			tempPC.changeWarriors(2); //Gain 2 warriors
			setTimeout(()=>{updateDisplay(tempPC, "Luckily your healer is able to cure your warriors, 2 more join!");}, 750);
			setTimeout(()=>{movePlayer(tempPC, goal);}, timer);
			timer += timerInc;
		}
		else
		{
			tempPC.changeWarriors(-2);
			setTimeout(()=>{movePlayer(tempPC, goal);}, timer);
			timer += timerInc;
		}
		//PLAGUE
	}
	else
	{
		updateDisplay(tempPC, "Brigands ambush you at your destination!");
		movePlayer(tempPC, goal);
		theGame.fightBrigands(tempPC, ["Gold", "Sword", "Pegasus", "Wizard"]);
		return;//Leave so that fightBrigands function handles end of turn
		//BRIGANDS
	}
	setTimeout(()=>{theGame.iterateTurn();}, timer);
}

function getInventory()
{
	theGame.displayInventory(theGame.players[theGame.currentTurn]);
}

function buyItem()
{
	let itemToBuy = theGame.store[theGame.storeInc];
	let currPlay = theGame.players[theGame.currentTurn];
	let totalCost = 0;
	let amount = 1;
	if (itemToBuy[0] === "Food" || itemToBuy[0] === "Warrior")
	{
		amount = -1;
		
		while(isNaN(amount) || amount < 0) 
		{
			amount = parseInt(window.prompt("How many?"));
		} 
		
		totalCost =  amount * itemToBuy[1];
	}
	else
	{
		totalCost = itemToBuy[1];
	}
	
	if (totalCost > currPlay.gold)
	{
		closeBazaar();
		return false;
		//Bazaar Closes
	}
	let confirmation = "Bought ";
	currPlay.gold -= totalCost;
	if (itemToBuy[0] === "Beast" || itemToBuy[0] === "Scout" || itemToBuy[0] === "Healer") 
	{
		if (itemToBuy[0] === "Beast")
		{
			confirmation += "Beast for " + String(totalCost) + " Gold";
			currPlay.hasBeast = true;
		}
		else if (itemToBuy[0] === "Scout")
		{
			confirmation += "Scout for " + String(totalCost) + " Gold";
			currPlay.hasScout = true;
		}
		else if (itemToBuy[0] === "Healer")
		{
			confirmation += "Healer for " + String(totalCost) + " Gold";
			currPlay.hasHealer = true;
		}
		else
		{
			console.log("Error");
			return false;
		}
	}
	else if (itemToBuy[0] === "Warrior")
	{
		confirmation += String(amount) + " " + itemToBuy[0];
		if (amount > 1)
		{
			confirmation += "s";
		}
		confirmation += " for " + String(totalCost) + " Gold";
		currPlay.changeWarriors(amount);
	}
	else if (itemToBuy[0] === "Food")
	{
		confirmation += String(amount) + " " + itemToBuy[0];
		if (amount > 1)
		{
			confirmation += "s";
		}
		confirmation += " for " + String(totalCost) + " Gold";
		currPlay.food += amount;
	}
	else
	{
		console.log("Something went wrong");
		return false;
	}
	
	updateDisplay(currPlay, confirmation);
	theGame.clearEventHandlers();
	theGame.iterateTurn();
	return true;
}

function closeBazaar()
{
	let playSound = document.getElementById("closeBazaar");
	playSound.play();
	
	updateDisplay(theGame.players[theGame.currentTurn], "Bazaar Closed");
	theGame.clearEventHandlers();
	setTimeout(()=>{theGame.iterateTurn();}, 3000);
	return true;
}

function nextItem()
{
	let currPlay = theGame.players[theGame.currentTurn];
	if (theGame.storeInc >= theGame.store.length - 1)
	{
		theGame.storeInc = -1;
	}
	theGame.storeInc++;
	if (theGame.store[theGame.storeInc][0] === "Healer" && currPlay.hasHealer)
	{
		nextItem();
	}
	else if (theGame.store[theGame.storeInc][0] === "Scout" && currPlay.hasScout)
	{
		nextItem();
	}
	else if (theGame.store[theGame.storeInc][0] === "Beast" && currPlay.hasBeast)
	{
		nextItem()
	}
	else
	{
		theGame.displayStore();
	}
}

function getHaggle(position)
{
	let chance = 33;
	let success = randomNumber(1, 100);
	let newCost = theGame.store[theGame.storeInc][1] - 1;
	if (success <= chance && newCost > 0 && newCost + 2 >= theGame.store[theGame.storeInc][2])
	{
		//Success!
		theGame.store[theGame.storeInc][1]--;
		theGame.displayStore();
	}
	else 
	{
		closeBazaar();
	}
}

function generatePasswordChecker()
{
	html = "";
	html += "<p>Username  <input type='text' id='username'></input></p>";
	html += "<p>Password <input type='password' id='passW'></input></p>";
	html += "<button onclick='getAJAX()'>Log in</button>";
	return html;
}

function getAJAX()
{
	userName = document.getElementById("username").value;
	passW = document.getElementById("passW").value;
	data = "userName=" + userName + "&password=" + passW;
	var request = new XMLHttpRequest();
	request.open("POST", "http://universe.tc.uvu.edu/cs2550/assignments/PasswordCheck/check.php", false);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.send(data);
	
	if (request.status == 200)
	{
		rJSON = JSON.parse(request.responseText);
		console.log(rJSON);
		if (rJSON["result"] === "valid")
		{
			localStorage.setItem("cs2550timestamp", rJSON["result"]+ " " + rJSON["userName"] + " " + rJSON["timestamp"]);
			window.location.href = "gameboard.html";
		}
		else
		{
			sendMessage = document.getElementById("errorMessage");
			sendMessage.innerHTML = "<p>Incorrect Password or Username</p>";
			console.log("Access Denied");
		}
	}
}

function removeTime()
{
	localStorage.removeItem("cs2550timestamp");
	enterTimeStamp = document.getElementById("timestampShow");
	enterTimeStamp.innerHTML = "";
}

function randomNumber(min, max)
{
	return Math.floor(Math.random() * (max - min) + min);
}

function startTurn()
{
	theGame.takeTurn();
}
