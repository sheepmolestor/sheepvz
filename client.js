const socket = io("ws://25.36.62.158:3000/");

socket.on("connect", ()=>{
	console.log("we shilling");
});

socket.on('plant', (x,y,type) => {
	spawnPlant(x,y,type);
	console.log("solobolo");
});

socket.on('zombie',(lane,type) => {
	spawnZombie(lane,type);
})
var ready = false;

var time=0;
socket.on('done', (t) => {
	ready = true;
	time=t;
	//console.log(t);
})





const app = new PIXI.Application({ antialias: true });
const loader = new PIXI.Loader();

document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

const GRID_WIDTH=9;
const GRID_HEIGHT=8;

app.stage.addChild(graphics);

let cat, state;

let grid = [];
for (i = 0; i<GRID_WIDTH; i++) {
	var temp = [];
	for (j=0; j<GRID_HEIGHT; j++) {
		temp.push(0);
	}
	grid.push(temp);
}
let enemies = [];

let projectiles = [];

let inventory=[];
inventory.push("pea");
inventory.push("cabbage");
let plants = {
pea:{
		hp:200,
		damage:20,
		rate:1,
		timer:0,
		home: 0,
		lane: 0,
		name:"pea",
	},

cabbage:{
	hp:200,
		damage:40,
		rate:2,
		timer:0,
		home: 0,
		lane: 0,
		name:"cabbage",
},
};

let zombies = {
	normal:{
		hp: 200,
		speed: 1/5,
		lane: 0,
		dist: 0,
		name:"normal",
	},
	cone: {
		hp: 700,
		speed: 1/5,
		lane: 0,
		dist: 0,
		name:"cone",
	},
	bucket: {
		hp: 1500,
		speed: 1/5,
		lane: 0,
		dist: 0,
		name:"bucket",
	},
}

function shoot(plant) {
	switch(plant.name) {
		case "pea":
			projectiles.push({
				speed: 1.5,
				home: plant.home,
				lane: plant.lane,
				damage: 20,
				dist: 0,
			});
			break;
		case "cabbage":
			projectiles.push({
				speed: 1.5,
				home: plant.home,
				lane: plant.lane,
				damage: 40,
				dist: 0,
			});
			break;
		default:
			projectiles.push({
				speed: 1.5,
				home: plant.home,
				lane: plant.lane,
				damage: 20,
				dist: 0,
			});
			break;
	}
}
let inventorySelected = -1;
let enemyTypes = ["normal","cone","bucket"];

	document.addEventListener('keypress', (event) => {
	  var name = event.key;
	  var code = event.code;
	  // Alert the key name and key code on keydown
	  //alert(`Key pressed ${name} \r\n Key code value: ${code}`);
	  sendZombie(Math.floor(Math.random()*GRID_HEIGHT),enemyTypes[Math.floor(Math.random()*enemyTypes.length)]);
	}, false);

  let squareWidth = app.screen.width/GRID_WIDTH;
	let squareHeight = app.screen.height/GRID_HEIGHT*0.8;

	document.addEventListener('mouseup', (event) => {
		var x = Math.floor(event.offsetX/squareWidth);
		var y = Math.floor(event.offsetY/squareHeight);
		console.log(x+" "+y);
		if (x<GRID_WIDTH&&y<GRID_HEIGHT&&inventorySelected!=-1){
			sendPlant(x,y,inventory[inventorySelected]);
		}
		if (x<inventory.length&&y>=GRID_HEIGHT) {
			if (inventorySelected!=x) {
				inventorySelected = x;
			} else {
				inventorySelected = -1;
			}
		}
	}, false);

  //Set the game state
  state = play;
 	
  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));
  // ok but like tick length could be desynced...


function gameLoop(delta){

  //Update the current game state:
  if (ready) {
  	state(delta);
  	ready = false;
  }
  render();
  //console.log(app.ticker.deltaMS);
  socket.emit('done',socket.id,app.ticker.deltaMS);
}

function play(delta) {

  for (i in enemies) {
  	enemies[i].dist+=enemies[i].speed*time/1000;//app.ticker.deltaMS/1000;
  	if (enemies[i].dist>GRID_WIDTH||enemies[i].hp<=0) {
  		enemies.splice(i,1);
  	}
  }
  for (i in grid) {
  	for (j in grid[i]) {
  		if (grid[i][j]!=0) {
  			if (grid[i][j].timer<=0) {
	  			for (k in enemies) {
	  				if (enemies[k].lane==j&&(GRID_WIDTH-0.5-enemies[k].dist)>i) { // may be different depending on plant type
	  					shoot(grid[i][j]);
	  					console.log(j);
	  					console.log(grid[i][j].lane);
	  					grid[i][j].timer = grid[i][j].rate;
	  					break;
	  				}
	  			}
  			} else {
  				grid[i][j].timer-=time/1000;//app.ticker.deltaMS/1000;
  			}
  		}
  	}
  }
  for (i in projectiles) {
  	projectiles[i].dist+=projectiles[i].speed*time/1000;//app.ticker.deltaMS/1000;
  	if (projectiles[i].dist+projectiles[i].home+0.5>GRID_WIDTH) {
  		projectiles.splice(i,1);
  	} else {
	  	for (j in enemies) {
	  		if (enemies[j].lane==projectiles[i].lane&&Math.abs(projectiles[i].home+projectiles[i].dist-(GRID_WIDTH-0.5-enemies[j].dist))<(1/4+1/8)) { //hit(projectiles[i],enemies[j])
	  			
	  			enemies[j].hp-=projectiles[i].damage;
	  			projectiles.splice(i,1);
	  			break;
	  		}
	  	}
  	}
  }
}

function render() {
	
	graphics.clear();
	for (i=0; i<GRID_WIDTH; i++) {
		for (j=0; j<GRID_HEIGHT; j++) {
			graphics.lineStyle(2,0x000000);
			graphics.beginFill(0xFFFFFF);
			graphics.drawRect(i*squareWidth, j*squareHeight, squareWidth, squareHeight);
			graphics.endFill();
		}
	}
	for (i in grid) {
		for (j in grid[i]) {
			if (grid[i][j]!=0) {
				var pType = grid[i][j].name;
				graphics.lineStyle(2,0x000000);
				if (pType=="pea") {
					graphics.beginFill(0x0000FF);
				} else if (pType == "cabbage") {
					graphics.beginFill(0x00FF00);
				} else {
					graphics.beginFill(0x880000);
				}
				graphics.drawCircle(squareWidth/2+i*squareWidth,squareHeight/2+j*squareHeight,squareWidth/4);
				graphics.endFill();
			}
		}
	}
	for (i in inventory) {
		graphics.lineStyle(2,0x000000);
		if (i==inventorySelected) {
			graphics.beginFill(0xFFFFCC);
		} else {
			graphics.beginFill(0xFFFFFF);
		}
			graphics.drawRect(i*squareWidth, GRID_HEIGHT*squareHeight, squareWidth, squareHeight*2);
			graphics.endFill();
		var pType = inventory[i];
		if (pType=="pea") {
					graphics.beginFill(0x0000FF);
				} else if (pType == "cabbage") {
					graphics.beginFill(0x00FF00);
				} else {
					graphics.beginFill(0x880000);
				}
				graphics.drawCircle(squareWidth/2+i*squareWidth,squareHeight+GRID_HEIGHT*squareHeight,squareWidth/4);
				graphics.endFill();
	}
	enemies.reverse();
	for (i in enemies) {
		graphics.lineStyle(2,0x000000);
		var eType = enemies[i].name;
		graphics.beginFill(0x008800);
		graphics.drawCircle(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth,squareHeight/2+squareHeight*enemies[i].lane,squareWidth/4);
		graphics.endFill();
		if (eType=="cone") {
			graphics.lineStyle(2,0x000000);
			graphics.beginFill(0xFF8800);
			graphics.moveTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth/4,squareHeight/2+squareHeight*enemies[i].lane);
			graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth+squareWidth/4,squareHeight/2+squareHeight*enemies[i].lane);
			graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth,squareHeight*enemies[i].lane);
			graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth/4,squareHeight/2+squareHeight*enemies[i].lane);
			graphics.closePath();
			graphics.endFill();
		} else if (eType=="bucket") {
			graphics.lineStyle(2,0x000000);
			graphics.beginFill(0x888888);
			graphics.drawRect(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth/4,squareHeight/2-squareWidth/4+squareHeight*enemies[i].lane,squareWidth/2,squareWidth/4);
			graphics.endFill();
		}
	}
	enemies.reverse();

	projectiles.reverse();
	for (i in projectiles) {
		graphics.lineStyle(2,0x000000);
		graphics.beginFill(0xFF0000);
		graphics.drawCircle(projectiles[i].home*squareWidth+squareWidth/2+projectiles[i].dist*squareWidth,squareHeight/2+squareHeight*projectiles[i].lane,squareWidth/8);
		graphics.endFill();
	}
	projectiles.reverse();
	
}

function sendZombie(lane,type) {
	socket.emit('zombie',lane,type);
}

function spawnZombie(lane,type) {
	var temp = JSON.parse(JSON.stringify(zombies[type]));
	temp.lane = lane;
	enemies.push(temp);
}

function spawnPlant(x,y,type) {
	grid[x][y] = JSON.parse(JSON.stringify(plants[type]));
	grid[x][y].home = x;
	console.log(x + " " + y + grid[0][0].lane);
	grid[x][y].lane = y;

	console.log(x + " " + y + grid[0][0].lane);
	/*{
		hp:200,
		damage:20,
		rate:1,
		timer:0,
		shoot: () => {
			projectiles.push({
				speed: 1.5,
				home: x,
				lane: y,
				damage: 20,
				dist: 0,
			});
		},
	};*/
}

function sendPlant(x,y,type) {
	socket.emit('plant',x,y,type);
}