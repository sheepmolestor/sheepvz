const socket = io("ws://25.36.62.158:3000/");
let enemies = [];

let projectiles = [];

let grid = [];

let inventory=[];
inventory.push("pea");
inventory.push("cabbage");
inventory.push("sunflower");

let sun=1000;// temporary
let plants = {
pea:{
		hp:200,
		damage:20,
		rate:1,
		timer:0,
		home: 0,
		lane: 0,
		cost:100,
		cooldown:1,
		cooldownTimer:0,
		shooter:true,
		name:"pea",
	},

cabbage:{
	hp:200,
		damage:40,
		rate:2,
		timer:0,
		home: 0,
		lane: 0,
		cost:100,
		cooldown:5,
		cooldownTimer:0,
		shooter:true,
		name:"cabbage",
},
sunflower:{
	hp:200,
	damage:0,
	timer:10,
	rate:10,
	cost:100,
	cooldown:10,
		cooldownTimer:0,
	shooter:false,
	name:"sunflower",
}
};
socket.on("connect", ()=>{
	console.log("we shilling");
	socket.emit('init',GRID_HEIGHT);
});

socket.on('plant', (x,y,type) => {
	spawnPlant(x,y,type);
	console.log("solobolo");
});

socket.on('zombie',(lane,type) => {
	spawnZombie(lane,type);
});
socket.on('reset',() => {
	enemies = [];
	projectiles = [];
	grid=[];
	for (i = 0; i<GRID_WIDTH; i++) {
	var temp = [];
	for (j=0; j<GRID_HEIGHT; j++) {
		temp.push(0);
	}
}
	grid.push(temp);
	sun=100; // temporary
	for (i in inventory) {
		plants[inventory[i]].cooldownTimer=0;
	}
});
var ready = false;

var time=0;

socket.on('done', (t,s) => {
	if (ready) {
		console.log("OOOOOOOOOOOPS");
	}
	ready = true;
	time=t;
	score.text=Math.round(s/1000);
	highest.text=Math.max(highest.text,Math.round(s/1000));
	if (t>100) {
		console.log(t);
	}
})





const app = new PIXI.Application({ antialias: true });
const loader = new PIXI.Loader();

document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

const GRID_WIDTH=9;
const GRID_HEIGHT=8;




let cat, state;

for (i = 0; i<GRID_WIDTH; i++) {
	var temp = [];
	for (j=0; j<GRID_HEIGHT; j++) {
		temp.push(0);
	}
	grid.push(temp);
}




let zombies = {
	normal:{
		hp: 200,
		speed: 1/5,
		lane: 0,
		dist: 0,
		name:"normal",
	},
	cone: {
		hp: 200,//700,
		speed: 1/5,
		lane: 0,
		dist: 0,
		name:"cone",
	},
	bucket: {
		hp: 200,//1500,
		speed: 1/5,
		lane: 0,
		dist: 0,
		name:"bucket",
	},
	football: {
		hp:200,//2000,
		speed:2/5,
		lane:0,
		dist:0,
		name:"football",
	}
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
		case "sunflower":
			sun+=50;
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
let enemyTypes = ["normal","cone","bucket","football"];

	document.addEventListener('keypress', (event) => {
	  var name = event.key;
	  var code = event.code;
	  // Alert the key name and key code on keydown
	  //alert(`Key pressed ${name} \r\n Key code value: ${code}`);
	  sendZombie(Math.floor(Math.random()*GRID_HEIGHT),enemyTypes[Math.floor(Math.random()*enemyTypes.length)]);
	}, false);

  let squareWidth = app.screen.width/GRID_WIDTH;
	let squareHeight = app.screen.height/GRID_HEIGHT*0.8;

	var sunCounter = new PIXI.Text('0');
sunCounter.x=(squareWidth)*(GRID_WIDTH-1);
sunCounter.y=(squareHeight)*(GRID_HEIGHT+0.5);
var score = new PIXI.Text('0');
var highest = new PIXI.Text('0');
score.x=(squareWidth)*(GRID_WIDTH-1);
score.y=(squareHeight)*(GRID_HEIGHT+1);
highest.x=(squareWidth)*(GRID_WIDTH-1);
highest.y=(squareHeight)*(GRID_HEIGHT+1.5);
app.stage.addChild(graphics);
app.stage.addChild(sunCounter);
app.stage.addChild(score);
app.stage.addChild(highest);

	document.addEventListener('mouseup', (event) => {
		var x = Math.floor(event.offsetX/squareWidth);
		var y = Math.floor(event.offsetY/squareHeight);
		console.log(x+" "+y);
		if (x<GRID_WIDTH&&y<GRID_HEIGHT&&inventorySelected!=-1&&plants[inventory[inventorySelected]].cooldownTimer<=0&&sun>=plants[inventory[inventorySelected]].cost){
			sendPlant(x,y,inventory[inventorySelected]);
			plants[inventory[inventorySelected]].cooldownTimer=plants[inventory[inventorySelected]].cooldown;
			sun-=plants[inventory[inventorySelected]].cost;
		}
		if (x<inventory.length&&y>=GRID_HEIGHT) {
			if (inventorySelected!=x) {
				inventorySelected = x;
			} else {
				inventorySelected = -1;
			}
		}
		if (x>=10&&y>=10) {
			socket.emit('reset');
		}
	}, false);

  //Set the game state
  state = play;
 	
  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));
  // ok but like tick length could be desynced...

var updated = false;
function gameLoop(delta){

  //Update the current game state:
  if (ready) { //ready to update
  	state(delta);
  	ready = false;
  }
  render();
  //console.log(app.ticker.deltaMS);
  socket.emit('done',socket.id,app.ticker.elapsedMS,!ready); //ready to confirm
}

function play(delta) {
	let toBeSpliced = [];

  for (i in enemies) {
  	enemies[i].dist+=enemies[i].speed*time/1000;//app.ticker.deltaMS/1000;
  	if (enemies[i].hp<=0) {
  		//enemies.splice(i,1);
  		toBeSpliced.push(i);
  	} else if (enemies[i].dist>GRID_WIDTH) {
  		//socket.emit('reset');
  		toBeSpliced.push(i);
  	}
  }
  toBeSpliced.reverse();
  for (i in toBeSpliced) {
  	enemies.splice(toBeSpliced[i],1);
  }
  for (i in grid) {
  	for (j in grid[i]) {
  		if (grid[i][j]!=0) {
  			if(!grid[i][j].shooter) {
  				if (grid[i][j].timer<=0) {
  					shoot(grid[i][j]); //temporary fix
  					grid[i][j].timer = grid[i][j].rate;
  				} else {
  					grid[i][j].timer-=time/1000;
  				}
	  			continue;
	  		} else {
	  			if (grid[i][j].timer<=0) {
		  			for (k in enemies) {
		  				if (enemies[k].lane==j&&(GRID_WIDTH-0.5-enemies[k].dist)>i) { // may be different depending on plant type
		  					shoot(grid[i][j]);
		  					grid[i][j].timer += grid[i][j].rate;
		  					break;
		  				}
		  			}
	  			} else {
	  				grid[i][j].timer-=time/1000;//app.ticker.deltaMS/1000;
	  			}
  			}
  		}
  	}
  }
   toBeSpliced = [];
  for (i in projectiles) {
  	projectiles[i].dist+=projectiles[i].speed*time/1000;//app.ticker.deltaMS/1000;
  	if (projectiles[i].dist+projectiles[i].home+0.5>GRID_WIDTH) {
  		//projectiles.splice(i,1);
  		toBeSpliced.push(i);
  	} else {
	  	for (j in enemies) {
	  		if (enemies[j].lane==projectiles[i].lane&&Math.abs((GRID_WIDTH-0.5-enemies[j].dist)-(projectiles[i].home+projectiles[i].dist))<(1/4+1/8)) { //hit(projectiles[i],enemies[j])
	  			
	  			enemies[j].hp-=projectiles[i].damage;
	  			//projectiles.splice(i,1);
	  			toBeSpliced.push(i);
	  			break;
	  		}
	  	}
  	}
  }
  toBeSpliced.reverse();
  for (i in toBeSpliced) {
  	projectiles.splice(toBeSpliced[i],1);
  }
  for (i in inventory) {
  	if (plants[inventory[i]].cooldownTimer>0) {
  		plants[inventory[i]].cooldownTimer-=time/1000;
  		plants[inventory[i]].cooldownTimer=Math.max(plants[inventory[i]].cooldownTimer,0);
  	}
  }
  sunCounter.text=sun;
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
				} else if (pType == "sunflower") {
					graphics.beginFill(0xFFFF00);
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
				} else if (pType == "sunflower") {
					graphics.beginFill(0xFFFF00);
				} else {
					graphics.beginFill(0x880000);
				}
				graphics.drawCircle(squareWidth/2+i*squareWidth,squareHeight+GRID_HEIGHT*squareHeight,squareWidth/4);
				graphics.endFill();
		graphics.lineStyle(0);
		graphics.beginFill(0x000000,0.2);
		graphics.drawRect(i*squareWidth,GRID_HEIGHT*squareHeight,squareWidth,squareHeight*2*plants[inventory[i]].cooldownTimer/plants[inventory[i]].cooldown);
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
		} else if (eType=="football") {
			graphics.lineStyle(2,0x000000);
			graphics.beginFill(0xFF0000);
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

	graphics.lineStyle(0);
	graphics.beginFill(0xFFFFFF);
	graphics.drawRect(squareWidth*(GRID_WIDTH-2),squareHeight*GRID_HEIGHT,squareWidth*2,squareHeight*2);
}

function sendZombie(lane,type) {
	socket.emit('zombie',lane,type);
}

function spawnZombie(lane,type) {
	if(zombies[type]) {
		var temp = JSON.parse(JSON.stringify(zombies[type]));
		temp.lane = lane;
		enemies.push(temp);
	}
}

function spawnPlant(x,y,type) {
	let p = plants[type];
	//grid[x][y] = JSON.parse(JSON.stringify(plants[type]));
	grid[x][y]={};
	grid[x][y].hp=p.hp;
	grid[x][y].damage=p.damage;
	grid[x][y].rate=p.rate;
	grid[x][y].timer=p.timer;
	grid[x][y].shooter=p.shooter;
	grid[x][y].name=p.name;
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