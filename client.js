const socket = io("ws://25.36.62.158:3000/");
let enemies = [];

let projectiles = [];

let grid = [];
let sprites = [];
let host = false;

const GRID_WIDTH=9;
const GRID_HEIGHT=8;

const AMBUSH_TIMER=1000;

const BALANCE = 1;//5/GRID_HEIGHT;

var gameState = "selection";

const PEA_RADIUS=1/8;
const PLANT_RADIUS=1/4;

var inventorySize = 8;

const app = new PIXI.Application({ antialias: true });
const loader = new PIXI.Loader();

document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

let squareWidth = app.screen.width/GRID_WIDTH;
let squareHeight = app.screen.height/GRID_HEIGHT*0.8;


/*function Random(seed) {
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}*/

let sun=100;// temporary
let plants = {
pea:{
	hp:300,
	damage:24,
	rate:1.35,
	timer:1,
	home: 0,
	lane: 0,
	cost:100,
	cooldown:3*BALANCE,
	initCooldown:3*BALANCE,
	cooldownTimer:0,
	range:GRID_WIDTH,
	shooter:true,
	eatable:true,
	low:false,
	name:"pea",
	image:"peashooter.png",
},
peatwo: {
		hp:375,
		damage:40,
		rate:1.35,
		timer:1,
		home: 0,
		lane: 0,
		cost: 225,
		cooldown:3*BALANCE,
		initCooldown:3*BALANCE,
		cooldownTimer:0,
		range:GRID_WIDTH,
		shooter:true,
		eatable:true,
		base:"pea",
		name:"peatwo",
	},
	peathree:{
		hp:450,
		damage:80,
		rate:1.35,
		timer:1,
		home:0,
		lane:0,
		cost:500,
		cooldown:3*BALANCE,
		initCooldown:3*BALANCE,
		cooldownTimer:0,
		range:GRID_WIDTH,
		shooter:true,
		eatable:true,
		base:"pea",
		name:"peathree",
	},
/*bigpea: {
	hp:450,
	damage:80,
	rate:1.35,
	timer:1,
	home:0,
	lane:0,
	cost:400,
	cooldown:3*BALANCE,
	initCooldown:3*BALANCE,
	cooldownTimer:0,
	range:GRID_WIDTH,
	shooter:true,
	eatable:true,
	low:false,
	base: "pea",
	name:"bigpea",
},*/
melon: {
	hp:600,
	damage:180,
	splashDamage:50,
	splashRadius:1,
	rate:2.7,
	timer:1,
	home: 0,
	lane: 0,
	cost:650,
	cooldown:15*BALANCE,
	initCooldown:30*BALANCE,
	cooldownTimer:0,
	range:GRID_WIDTH,
	shooter:true,
	eatable:true,
	low:false,
	lobbed:true,
	name:"melon",
},
melontwo: {
	hp:750,
	damage:240,
	splashDamage:80,
	splashRadius:1,
	rate:2.7,
	timer:1,
	home: 0,
	lane: 0,
	cost:1000,
	cooldown:20*BALANCE,
	initCooldown:40*BALANCE,
	cooldownTimer:0,
	range:GRID_WIDTH,
	shooter:true,
	eatable:true,
	low:false,
	lobbed:true,
	base:"melon",
	name:"melontwo",
},
melonthree: {
	hp:900,
	damage:340,
	splashDamage:120,
	splashRadius:1,
	rate:2.7,
	timer:1,
	home: 0,
	lane: 0,
	cost:1600,
	cooldown:25*BALANCE,
	initCooldown:50*BALANCE,
	cooldownTimer:0,
	range:GRID_WIDTH,
	shooter:true,
	eatable:true,
	low:false,
	lobbed:true,
	base:"melon",
	name:"melonthree",
},
cabbage:{
	hp:300,
	damage:50,
	rate:2.7,
	timer:1,
	home: 0,
	lane: 0,
	cost:100,
	cooldown:3*BALANCE,
	initCooldown:3*BALANCE,
	cooldownTimer:0,
	range:GRID_WIDTH,
	shooter:true,
	eatable:true,
	low:false,
	lobbed:true,
	name:"cabbage",
	image:"cabbagepult.png",
},
cabbagetwo:{
	hp:375,
	damage:80,
	rate:2.7,
	timer:1,
	home: 0,
	lane: 0,
	cost:200,
	cooldown:7*BALANCE,
	initCooldown:7*BALANCE,
	cooldownTimer:0,
	range:GRID_WIDTH,
	shooter:true,
	eatable:true,
	low:false,
	lobbed:true,
	base:"cabbage",
	name:"cabbagetwo",
	image:"cabbagepult.png",
},
cabbagethree:{
	hp:450,
	damage:150,
	rate:2.7,
	timer:1,
	home: 0,
	lane: 0,
	cost:425,
	cooldown:14*BALANCE,
	initCooldown:14*BALANCE,
	cooldownTimer:0,
	range:GRID_WIDTH,
	shooter:true,
	eatable:true,
	low:false,
	lobbed:true,
	base:"cabbage",
	name:"cabbagethree",
	image:"cabbagepult.png",
},
cherry: {
	hp:300,
	damage:1800,
	timer:1,
	cooldown:70*BALANCE,
	initCooldown:70*BALANCE,
	cooldownTimer:0,
	shooter:false,
	eatable:false,
	unkillable:true,
	cost:150,
	name:"cherry",
},
kernel: {
	hp:300,
	damage:10,
	butter:40,
	rate:2.7,
	timer:1,
	home: 0,
	lane: 0,
	cost:100,
	cooldown:5*BALANCE,
	initCooldown:5*BALANCE,
	cooldownTimer:0,
	range:GRID_WIDTH,
	shooter:true,
	eatable:true,
	low:false,
	lobbed:true,
	name:"kernel",
	image:"kernelpult.png",
},
bonk: {
	hp:450,
	damage:15,
	rate:5/12,
	timer:0.25,
	home: 0,
	lane: 0,
	cost:150,
	cooldown:3*BALANCE,
	initCooldown:3*BALANCE,
	cooldownTimer:0,
	range:1.5,
	shooter:false,
	eatable:true,
	low:false,
	lobbed:true,
	name:"bonk",
	image:"bonkchoy.png",
},
sunflower:{
	hp:300,
	damage:0,
	timer:10,
	rate:24,
	cost:100,
	cooldown:12,
	initCooldown:0,
	cooldownTimer:0,
	range:0,
	shooter:false,
	eatable:true,
	low:false,
	name:"sunflower",
	image:"sunflower.png",
},
walnut:{
	hp:3000,
	damage:0,
	timer:0,
	rate:0,
	cost:50,
	cooldown:20,
	initCooldown:20,
	cooldownTimer:0,
	range:0,
	shooter:false,
	eatable:true,
	low:false,
	name:"walnut",
	image:"wallnut.png",
},
iceberg:{
	hp:300,
	damage:0,
	timer:1/2,
	rate:0,
	cost:0,
	cooldown:15,
	initCooldown:15,
	cooldownTimer:0,
	range:1,
	shooter:false,
	eatable:false,
	unkillable:true,
	low:true,
	name:'iceberg',
	image:"iceberglettuce.png",
},
boomer:{
	hp:300,
	damage:20,
	rate:2.7,
	timer:1,
	cost:250,
	cooldown:20*BALANCE,
	initCooldown:20*BALANCE,
	cooldownTimer:0,
	range:GRID_WIDTH,
	shooter:true,
	eatable:true,
	low:false,
	name:"boomer",
	image:"bloomerang.png",
},
};

let plantUpgrades = {
	/*pea: [{
		hp:375,
		damage:40,
		rate:1.35,
		timer:1,
		home: 0,
		lane: 0,
		cost: 225,
		cooldown:3*BALANCE,
		initCooldown:3*BALANCE,
		cooldownTimer:0,
		range:GRID_WIDTH,
		shooter:true,
		eatable:true,
		name:"pea",
	},{
		hp:450,
		damage:80,
		rate:1.35,
		timer:1,
		home:0,
		lane:0,
		cost:500,
		cooldown:3*BALANCE,
		initCooldown:3*BALANCE,
		cooldownTimer:0,
		range:GRID_WIDTH,
		shooter:true,
		eatable:true,
		name:"pea",
	}],*/
};
for (i in plantUpgrades) {
	for (j in plantUpgrades[i]) {
		plantUpgrades[i][j].num=j+1;
	}
}

let plantArray=[];
for (i in plants) {
	if (!plants[i].base) {
		plants[i].base = plants[i].name;
		plantArray.push(plants[i]);
	} else {
		if (!plantUpgrades[plants[i].base]) {
			plantUpgrades[plants[i].base]=[];
		}
		plantUpgrades[plants[i].base].push(plants[i]);
	}
}
let inventory=[];
//inventory.push("pea");
//inventory.push("cabbage");
//inventory.push("sunflower");
//inventory.push("walnut");
//inventory.push("iceberg");
//inventory.push("boomer");
//inventory.push("kernel");
//inventory.push("bonk");


let socketQueue = [];
socket.on("shovel",(x,y,tick) => {
	
	if (host) {
		grid[x][y]=0;
		if (sprites[x][y]) {
			app.stage.removeChild(sprites[x][y]);
			sprites[x][y]=0;
		}
		tickQueue.push(["shovel",x,y]);
		//socket.emit('shovel',x,y,host,tickCount);
	} else {
		//socketQueue.push(["shovel",x,y,tick]);
	}
});
socket.on("host", () => {
	host=true;
	console.log("yoking");
});
socket.on("disconnect", ()=> {
	host=false;
});
socket.on("connect", ()=>{
	console.log("we shilling");
	socket.emit('init',GRID_HEIGHT);
});
socket.on('confirm',(type)=> {
	plants[type].cooldownTimer=plants[type].cooldown;
	sun-=plants[type].cost;
});
socket.on('plant', (x,y,type,id,tick) => {
	if (host) {
		if (!grid[x][y]) {
			spawnPlant(x,y,type);
			tickQueue.push(["plant",x,y,type,tick]);
			//sendPlant(x,y,inventory[inventorySelected],host)
		} else {
			socket.emit("refund",type,id);
		}
	} else {
		//tickQueue.push(["plant",x,y,type,tick]);
		//spawnPlant(x,y,type);
	}
});

socket.on('refund', (type) => {
	sun += plants[type].cost;
	plants[type].cooldownTimer=0;
	console.log("refund "+plants[type].cost);
});

socket.on('zombie',(lane,type,ambush,tick) => {
	if (host) {//spawnZombie(lane,type);
		spawnZombie(lane,type,ambush);
		tickQueue.push(["zombie",lane,type,ambush,tick]);
	} else {
		
	}
});
socket.on('softreset',()=>{
	enemies = [];
	projectiles = [];
	inventory=[];
	gameState="selection";
	app.stage.removeChildren();
	app.stage.addChild(graphics);
	app.stage.addChild(sunCounter);
	app.stage.addChild(score);
	app.stage.addChild(highest);
});
socket.on('reset',() => {
	enemies = [];
	projectiles = [];
	grid=[];
	sprites=[];
	for (i = 0; i<GRID_WIDTH; i++) {
		var temp = [];
		for (j=0; j<GRID_HEIGHT; j++) {
			temp.push(0);
		}
		grid.push(temp);
		sprites.push(temp);
	}
	sun=100; // temporary
	for (i in inventory) {
		plants[inventory[i]].cooldownTimer=plants[inventory[i]].initCooldown;
	}
	inventory=[];
	gameState="selection";
	app.stage.removeChildren();
	app.stage.addChild(graphics);
	app.stage.addChild(sunCounter);
	app.stage.addChild(score);
	app.stage.addChild(highest);
});
socket.on("sun", (amt) => {
	sun+=amt;
});
socket.on('ready', () => {
	if (gameState!="ingame") {
		gameState = "ingame";
		for (i in inventory) {
			plants[inventory[i]].cooldownTimer=plants[inventory[i]].initCooldown;
			var iText = new PIXI.Text(plants[inventory[i]].cost);
			iText.x=(squareWidth)*(i);
			iText.y=(squareHeight)*(GRID_HEIGHT+1.5);
			app.stage.addChild(iText);
			var nText = new PIXI.Text(plants[inventory[i]].name);
			nText.x=(squareWidth)*(i);
			nText.y=(squareHeight)*(GRID_HEIGHT);
			app.stage.addChild(nText);
		}
	}
});
var ready = false;

var time=0;
var tickCount=0;
//var bufferTime=0;
//var buffer = false;
var seed=0;

socket.on('done', (t,tick,s,q,sd) => {
	//if (ready) {
		//if (buffer) {
	//		console.log("OOOOOOOOOOOPS");
		//}
		//buffer = true;
		//bufferTime = t;
	//} //else {
		//ready = true;
		//time=t;

	if (host) {
		//tickQueue.push(['done',tick]);
		//console.log(tick);
	} else {
		socketQueue.push([q,t,sd]);
		//console.log(tick);
		
	}
	//}
	score.text=Math.round(s);
	highest.text=Math.max(highest.text,Math.round(s));
	//if (t>100) {
		//console.log(t);
	//}
})












let cat, state;

for (i = 0; i<GRID_WIDTH; i++) {
	var temp = [];
	for (j=0; j<GRID_HEIGHT; j++) {
		temp.push(0);
	}
	grid.push(temp);
	sprites.push(temp);
}


const ATT_SPD=0.55;

let zombies = {
	imp:{
		hp: 190,
		speed: 3/10,
		lane: 0,
		dist: 0,
		attackDamage:50,
		attackTimer:0,
		attackSpeed:ATT_SPD,
		airborneTimer:2000,
		radius:1/6,
		name:"imp",
	},
	gargantaur:{
		hp:200,//3600,
		speed:1/10,
		lane:0,
		dist:0,
		attackDamage:10000,
		attackTimer:ATT_SPD*4,
		attackSpeed:ATT_SPD*4,
		throw:false,
		throwTimer:2500,
		radius:1/2,
		name:"gargantaur",
	},
	normal:{
		hp: 190,
		speed: 1/5,
		lane: 0,
		dist: 0,
		attackDamage:50,
		attackTimer:0,
		attackSpeed:ATT_SPD,
		name:"normal",
	},
	cone: {
		hp: 190,
		armour:370,
		speed: 1/5,
		lane: 0,
		dist: 0,
		attackDamage:50,
		attackTimer:0,
		attackSpeed:ATT_SPD,
		name:"cone",
	},
	bucket: {
		hp: 190,
		armour:1100,
		speed: 1/5,
		lane: 0,
		dist: 0,
		attackDamage:50,
		attackTimer:0,
		attackSpeed:ATT_SPD,
		name:"bucket",
	},
	football: {
		hp:190,
		armour:2200,
		speed:2/5,
		lane:0,
		dist:0,
		attackDamage:50,
		attackTimer:0,
		attackSpeed:ATT_SPD/2,
		name:"football",
	},
	laser: {
		hp: 250,
		speed: 1/5,
		lane: 0,
		dist: 0,
		attackDamage:50,
		attackTimer:0,
		attackSpeed:ATT_SPD,
		attacking:false,
		cooldownTimer:0,
		cooldown:5000,
		channeling:false,
		channelTimer:0,
		channelLength:3000,
		name:"laser",
	},
	flying: {
		dropName: 'normal',
		hp:350,
		flyingSpeed:3/10,
		slowSpeed:1/5,
		speed: 1/5,
		lane:0,
		dist:0,
		attackDamage:0,
		attackTimer:0,
		attackSpeed:0,
		flying:true,
		name:"flying",
	},
	flyingCone: {
		dropName: 'cone',
		hp:350,
		flyingSpeed:3/10,
		slowSpeed:1/5,
		speed: 1/5,
		lane:0,
		dist:0,
		attackDamage:0,
		attackTimer:0,
		attackSpeed:0,
		flying:true,
		name:"flyingCone",
	},
	flyingBucket: {
		dropName: 'bucket',
		hp:350,
		flyingSpeed:3/10,
		slowSpeed:1/5,
		speed: 1/5,
		lane:0,
		dist:0,
		attackDamage:0,
		attackTimer:0,
		attackSpeed:0,
		flying:true,
		name:"flyingBucket",
	},
	umbrella: {
		hp: 350,
		speed: 3/10,
		lane: 0,
		dist: 0,
		attackDamage:50,
		attackTimer:0,
		attackSpeed:ATT_SPD,
		name:"umbrella",
	},
	screen: {
		screenHp:1100,
		hp: 350,
		speed: 3/10,
		lane: 0,
		dist: 0,
		attackDamage:50,
		attackTimer:0,
		attackSpeed:ATT_SPD,
		name:"screen",
	},
}

for (i in zombies) {
	zombies[i].slow=0;
	zombies[i].slowTimer=0;
	zombies[i].stun=false;
	zombies[i].stunTimer=0;
	if (!zombies[i].radius) {
		zombies[i].radius=1/4;
	}
}

function shoot(plant) {
	switch(plant.name) {
		case "pea":
			projectiles.push({
				speed: 3,
				home: plant.home,
				lane: plant.lane,
				damage: plant.damage,
				dist: 0,
				name:"pea",
			});
			break;
		case "cabbage":
		case "cabbagetwo":
		case "cabbagethree":
		case "kernel":
		case "melon":
		case "melontwo":
		case "melonthree":
			var destination=-1;

			var pTarget = 0;
			for (l in enemies) {
				if (!enemies[l].unhittable&&enemies[l].lane==plant.lane&&(GRID_WIDTH-plant.home-0.5)>enemies[l].dist) {
					var estimatedDist = Math.min(GRID_WIDTH-plant.home-0.5,enemies[l].dist+enemies[l].radius);
					if (destination==-1) {
						destination=estimatedDist;//enemies[l].dist;
						pTarget=enemies[l].id;
					} else {
						if (estimatedDist//enemies[l].dist
							>destination) {
							destination=estimatedDist;//enemies[l].dist;
							pTarget=enemies[l].id;
						}
					}
				}
			}
			destination=GRID_WIDTH-plant.home-0.5-destination;//distance from home
			var pDmg = plant.damage;
			var pName = plant.name;
			if (plant.name=="kernel") {
				console.log(seed + " PEEPEE");
				if (seed<0.5) {
					pName = "butter";
					pDmg = plant.butter;
				}
			}
			projectiles.push({
				speed: destination,
				home: plant.home,
				lane: plant.lane,
				damage: pDmg,
				timer:1000,
				dist: 0,
				target:pTarget,
				dest: destination,
				lobbed:true,
				name:pName,
			});
			break;
		case "sunflower":
			sun+=50;
			break;
		case "boomer":
			var targets = [];
			console.log(grid[plant.home][plant.lane]);
			for (l in enemies) {
				if (enemies[l].lane==plant.lane) {
					if (targets.length<3) {
						targets.push(enemies[l].dist);
						targets.sort((a,b) => {return a-b;});
					} else {
						if (enemies[l].dist>targets[0]) {
							targets[0] = enemies[l].dist;
							targets.sort((a,b) => {return a-b;});
						}
					}
				}
			}
			if (targets) {
				projectiles.push({
					speed: 3,
					home:plant.home,
					lane:plant.lane,
					damage:plant.damage,
					dist:0,
					return:false,
					dest:GRID_WIDTH-plant.home-0.5-targets[0],
					hits:0,
					alreadyHit:[],
					twiceHit:[],
					pierce:3,
					name:"boomer",
				});
			}
			console.log(grid[plant.home][plant.lane]);
			break;
		default:
			projectiles.push({
				speed: 3,
				home: plant.home,
				lane: plant.lane,
				damage: 20,
				dist: 0,
				name:"pea",
			});
			break;
	}
}
let inventorySelected = -1;
let enemyTypes = ["gargantaur"];//,"flyingCone","flyingBucket"];//,"cone","bucket","football"];

	document.addEventListener('keypress', (event) => {
	  var name = event.key;
	  var code = event.code;
	  // Alert the key name and key code on keydown
	  //alert(`Key pressed ${name} \r\n Key code value: ${code}`);
	  if (gameState=="ingame"){
	  sendZombie(0,//Math.floor(Math.random()*GRID_HEIGHT),
	  	enemyTypes[Math.floor(Math.random()*enemyTypes.length)],3);}
	}, false);

  

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

/*for (i in inventory) {
	var iText = new PIXI.Text(plants[inventory[i]].cost);
	iText.x=(squareWidth)*(i);
	iText.y=(squareHeight)*(GRID_HEIGHT+1.5);
	app.stage.addChild(iText);
	var nText = new PIXI.Text(plants[inventory[i]].name);
	nText.x=(squareWidth)*(i);
	nText.y=(squareHeight)*(GRID_HEIGHT);
	app.stage.addChild(nText);
}*/

document.addEventListener('contextmenu', e => e.preventDefault());

var upgradeSelect = -1;

document.addEventListener('mousemove', (event) => {
	var x = Math.floor(event.offsetX/squareWidth);
	var y = Math.floor(event.offsetY/squareHeight);
	switch (gameState) {
		case "selection":
			var cnt = y*GRID_WIDTH+x;
			var nm = "";
			if (y==GRID_HEIGHT-1) {
				if (upgradeSelect!=-1) {
					if (x==0) {
						nm=plantArray[upgradeSelect].name;
					} else if (x<plantUpgrades[plantArray[upgradeSelect].name].length+1) {
						nm=plantUpgrades[plantArray[upgradeSelect].name][x-1].name;
					}
				}
			} else if (x>=0&&y>=0&&x<GRID_WIDTH&&y<GRID_HEIGHT&&cnt<plantArray.length) {
				if (cnt<plantArray.length) {
					nm=plantArray[cnt].name;
				}
			}
			else if (x>=0&&x<inventory.length&&y>=GRID_HEIGHT&&y<GRID_HEIGHT+2) {
				nm=inventory[x];
			}
			if (nm) {
				document.getElementById("description").innerHTML="Name: "+nm+", HP: "+plants[nm].hp+", Cost: "+plants[nm].cost+", Damage: "+ (plants[nm].damage ? plants[nm].damage : "N/A") +", Attack Speed: " + (plants[nm].rate ? Math.round(100/plants[nm].rate)/100 + " hits per second" : "N/A") + ", Cooldown: "+plants[nm].cooldown;
			}//console.log(nm);
			break;
		case "ingame":
			var nm="";
			if (x>=0&&y>=0&&x<GRID_WIDTH&&y<GRID_HEIGHT) {
				if (grid[x][y]) {
					nm=grid[x][y].name;
				}
			}else
			if (x>=0&&x<inventory.length&&y>=GRID_HEIGHT&&y<GRID_HEIGHT+2) {
				nm=inventory[x];
			}
			if (nm) {
				document.getElementById("description").innerHTML="Name: "+nm+", HP: "+plants[nm].hp+", Cost: "+plants[nm].cost+", Damage: "+ (plants[nm].damage ? plants[nm].damage : "N/A") +", Attack Speed: " + (plants[nm].rate ? Math.round(100/plants[nm].rate)/100 + " hits per second" : "N/A") + ", Cooldown: "+plants[nm].cooldown;
			}
	}
});

	document.addEventListener('mouseup', (event) => {
		var x = Math.floor(event.offsetX/squareWidth);
		var y = Math.floor(event.offsetY/squareHeight);
		console.log(x+" "+y);
		switch (gameState) {
			case "selection":
				var cnt = y*GRID_WIDTH+x;
				if (event.button==0) {
					if (y==GRID_HEIGHT-1) {
						if (upgradeSelect!=-1) {
							var contained = inventory.indexOf(plantArray[upgradeSelect].name);
							for (i in plantUpgrades[plantArray[upgradeSelect].name]) {
								if (contained!=-1) {
									break;
								}
								contained = inventory.indexOf(plantUpgrades[plantArray[upgradeSelect].name][i].name)
							}
							if (contained==-1) {
								if (x==0) {
									inventory.push(plantArray[upgradeSelect].name);
								} else
								if (x<plantUpgrades[plantArray[upgradeSelect].name].length+1) {
									inventory.push(plantUpgrades[plantArray[upgradeSelect].name][x-1].name);
								}
							} else {
								if (x==0) {
									inventory[contained]=plantArray[upgradeSelect].name;
								} else
								if (x<plantUpgrades[plantArray[upgradeSelect].name].length+1) {
									inventory[contained]=plantUpgrades[plantArray[upgradeSelect].name][x-1].name;
								}
							}
						}
					} else
					if (x>=0&&y>=0&&x<GRID_WIDTH&&y<GRID_HEIGHT&&cnt<plantArray.length&&inventory.length<inventorySize) {
						if (!inventory.includes(plantArray[cnt].name)) {

							inventory.push(plantArray[cnt].name);
						}
					}
					if (x>=0&&x<inventorySize&&y>=GRID_HEIGHT&&y<GRID_HEIGHT+2) {
						if (x<inventory.length) {
							inventory.splice(x,1);
						}
					}
					upgradeSelect=-1;
				} else if (event.button==2) {
					if (upgradeSelect==-1) {
						if (cnt<plantArray.length&&plantUpgrades[plantArray[cnt].name]) {
							upgradeSelect=cnt;
						} 
					} else if (cnt==upgradeSelect) {
						upgradeSelect=-1;
					}
				}
				break;
			case "ingame":
				if (event.button==0) {
					if (x>=0&&y>=0&&x<GRID_WIDTH&&y<GRID_HEIGHT&&inventorySelected!=-1&&plants[inventory[inventorySelected]].cooldownTimer<=0&&sun>=plants[inventory[inventorySelected]].cost){
						if (!grid[x][y]) {
							plants[inventory[inventorySelected]].cooldownTimer=plants[inventory[inventorySelected]].cooldown;
							sun-=plants[inventory[inventorySelected]].cost;
							//sendPlant(x,y,inventory[inventorySelected],host);
							if (host) {
								spawnPlant(x,y,inventory[inventorySelected]);
								tickQueue.push(['plant',x,y,inventory[inventorySelected]]);
							} else {
								sendPlant(x,y,inventory[inventorySelected],host);
							}
						}
					}
					if (x>=0&&x<inventory.length&&y>=GRID_HEIGHT&&y<GRID_HEIGHT+2) {
						if (inventorySelected!=x) {
							inventorySelected = x;
						} else {
							inventorySelected = -1;
						}
					}
					if (x>=10&&y>=10) {
						if (host) {
							socket.emit('reset');
						}
					}
				} else if (event.button==2) {
					if (x<GRID_WIDTH&&y<GRID_HEIGHT) {
						if (host) {
							grid[x][y]=0;
							if (sprites[x][y]) {
								app.stage.removeChild(sprites[x][y]);
								sprites[x][y]=0;
							}
							tickQueue.push(["shovel",x,y]);
						} else {
							socket.emit("shovel",x,y,host);
						}
					}
				}
		}
	}, false);

  //Set the game state
  state = play;
 	
  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));
  // ok but like tick length could be desynced...

var first = true;
var tickQueue = [];
var lasers = [];

function gameLoop(delta){

	//Update the current game state:
	/*if (ready) { //ready to update
		state(delta);
		ready = false;
		first = true;

	}*/
	//console.log(app.ticker.deltaMS);
	switch (gameState) {
		case "selection":
			if (inventory.length==inventorySize) {
				socket.emit('ready');
			} else {
				socket.emit('unready');
			}
			//state(delta);
			break;
		case "ingame":
			if (host) {
				time=app.ticker.elapsedMS;
				
		  		//tickCount=socketQueue[0][1];
				tickQueue.push(['done',tickCount]);
				seed = Math.random();
				state(delta);
				socket.emit('done',time,tickCount,tickQueue,enemies.length==0,seed); //ready to confirm
				tickQueue=[];
				tickCount++;
			} else {
				//console.log(socketQueue);
			//var toBeSpliced=[];
			if (socketQueue[0]) {
			time = socketQueue[0][1];

			seed = socketQueue[0][2];
		  	for (i in socketQueue[0][0]) {
			//if (socketQueue[0][0]=='done') {
		  	//	state(delta);
		  	//	tickCount=socketQueue[0][1];
		  	//	socketQueue.splice(0,1);
		  	//	//toBeSpliced.push(i);
		  	//}
		  	/*if (host) {
		  		socketQueue.
				socket.emit('done',app.ticker.elapsedMS,tickCount); //ready to confirm
		  	}*/
			  	//while (socketQueue[0][socketQueue[0].length-1]==tickCount) {
				  	//if (socketQueue[0][socketQueue[0].length-1]==tickCount) {
				  		switch (socketQueue[0][0][i][0]) {
				  			case 'plant':
				  				spawnPlant(socketQueue[0][0][i][1],socketQueue[0][0][i][2],socketQueue[0][0][i][3]);
				  				break;
				  			case 'shovel':
				  				grid[socketQueue[0][0][i][1]][socketQueue[0][0][i][2]]=0;
				  				if (sprites[socketQueue[0][0][i][1]][socketQueue[0][0][i][2]]) {
									app.stage.removeChild(sprites[socketQueue[0][0][i][1]][socketQueue[0][0][i][2]]);
									sprites[socketQueue[0][0][i][1]][socketQueue[0][0][i][2]]=0;
								}
				  				break;
				  			case 'zombie':
				  				spawnZombie(socketQueue[0][0][i][1],socketQueue[0][0][i][2],socketQueue[0][0][i][3]);
				  				break;
				  			case 'done':
				  				state(delta);
				  				
				  				//console.log("what");
							  	break;
				  			default:
				  				break;
				  		}
				  		//socketQueue.splice(0,1);
				  		//toBeSpliced.push(i);
				  	//}
			  	}
			  	socketQueue.splice(0,1);
			  }
		  	}
		  	break;
  	}
  	render();

 	/*if (socket.id) {
		first = false;
	}*/
}

function play(delta) {
	switch (gameState) {
		case "selection":
			break;
		case "ingame":
			let toBeSpliced = [];

		  for (i in enemies) {

		  	//enemies[i].dist+=enemies[i].speed*time/1000;//app.ticker.deltaMS/1000;
		  	let enemyX = Math.floor(GRID_WIDTH-enemies[i].dist);
		  	if (enemyX>=0&&enemyX<GRID_WIDTH&&!enemies[i].stun&&!enemies[i].ambush) {
		  		switch(enemies[i].name) {
		  			case 'laser':
			  			let laserX = Math.floor(GRID_WIDTH-enemies[i].dist+0.5);
			  			let shootable = false;
			  			for (j=enemyX-3; j<laserX; j++) {
		  					if (j>=0) {
		  						if (grid[j][enemies[i].lane]) {
		  							if (!grid[j][enemies[i].lane].low) {
		  								shootable=true;
		  							}
		  						}
		  					}
		  				}
		  				var noEat = false;
		  				if (grid[enemyX][enemies[i].lane]&&!enemies[i].channeling) {
		  					if (grid[enemyX][enemies[i].lane].eatable) {
					  			if (enemies[i].attackTimer<=0) {
					  				grid[enemyX][enemies[i].lane].hp-=enemies[i].attackDamage;
					 				enemies[i].attackTimer+=enemies[i].attackSpeed;
					  			} else {
					  				enemies[i].attackTimer-=time*(1-enemies[i].slow)/1000;
					  			}
				  			} else {
				  				if (enemies[i].attackTimer>0) {
					  				enemies[i].attackTimer-=time*(1-enemies[i].slow)/1000;
					  				if (enemies[i].attackTimer<0) {
					  					enemies[i].attackTimer=0;
					  				}
					  			}
				  				noEat=true;
				  			}
				  		}
				  		if (!grid[enemyX][enemies[i].lane]||enemies[i].channeling||noEat) {
				  			if (enemies[i].channeling) {
				  				enemies[i].channelTimer-=time*(1-enemies[i].slow);
				  				if (enemies[i].channelTimer<=0) {
				  					for (j=enemyX-3; j<laserX; j++) {
					  					if (j>=0) {
					  						//if (host) {
					  						if (grid[j][enemies[i].lane]) {
					  							if (!grid[j][enemies[i].lane].low&&!grid[j][enemies[i].lane].unkillable) {
					  								grid[j][enemies[i].lane]=0;
					  								if (sprites[j][enemies[i].lane]) {
														app.stage.removeChild(sprites[j][enemies[i].lane]);
														sprites[j][enemies[i].lane]=0;
													}
					  							}
					  						}
					  						//}
					  						//socket.emit('shovel',i,enemies[i].lane);
					  					}
					  				}
					  				lasers.push([Math.max(0.5,enemyX-3+0.5),GRID_WIDTH-enemies[i].dist,enemies[i].lane,500]);
				  					enemies[i].channeling=false;
				  					enemies[i].cooldownTimer=enemies[i].cooldown;
				  				}
				  			} else {
					  			if (shootable&&laserX<GRID_WIDTH&&enemies[i].cooldownTimer<=0) {
					  				enemies[i].channeling=true;
					  				enemies[i].channelTimer=enemies[i].channelLength;
						  		} else {
						  			if (enemies[i].cooldownTimer>0) {
						  				enemies[i].cooldownTimer-=time*(1-enemies[i].slow);
						  			}
						  			enemies[i].dist+=enemies[i].speed*time*(1-enemies[i].slow)/1000;
						  		}
					  		}
		  				}
		  				break;
		  			case 'flying':
		  			case 'flyingCone':
		  			case 'flyingBucket':
		  				if (grid[enemyX][enemies[i].lane]) {
		  					if (!grid[enemyX][enemies[i].lane].low) {

				  				enemies[i].speed=enemies[i].slowSpeed;
				  				//enemies[i].dist+=enemies[i].speed*time*(1-enemies[i].slow)/1000;
				  			} else {
				  				enemies[i].speed=enemies[i].flyingSpeed;
					  			//enemies[i].dist+=enemies[i].flyingSpeed*time*(1-enemies[i].slow)/1000;
				  			}
				  		} else {
				  			enemies[i].speed=enemies[i].flyingSpeed;
				  			//enemies[i].dist+=enemies[i].flyingSpeed*time*(1-enemies[i].slow)/1000;
				  		}
				  		enemies[i].dist+=enemies[i].speed*time*(1-enemies[i].slow)/1000;
		  				break;
		  			case "gargantaur":
		  				if (!enemies[i].throw&&enemies[i].dist<(GRID_WIDTH-4)&&enemies[i].hp<=zombies[enemies[i].name].hp/2) {
		  					if (enemies[i].throwTimer>0) {
		  						enemies[i].throwTimer-=time*(1-enemies[i].slow);
		  					} else {
		  						var temp = JSON.parse(JSON.stringify(zombies["imp"]));
								temp.lane = enemies[i].lane;
								temp.dist = enemies[i].dist;
								temp.init = enemies[i].dist;
								temp.id=Math.random();
								temp.unhittable = true;
								temp.airborne = true;
								temp.airborneTimer = zombies["imp"].airborneTimer;
								enemies.push(temp); //maybe need a better way of doing this
		  						enemies[i].attackTimer=enemies[i].attackSpeed;
		  						enemies[i].throw=true;
		  					}
		  				} else if (grid[enemyX][enemies[i].lane]||enemies[i].attackTimer<zombies[enemies[i].name].attackSpeed) {
		  					if (enemies[i].attackTimer<=0) {
		  						if (grid[enemyX][enemies[i].lane]&&!grid[enemyX][enemies[i].lane].unkillable) {
				  					grid[enemyX][enemies[i].lane].hp-=enemies[i].attackDamage;
				  				}
				 				enemies[i].attackTimer=enemies[i].attackSpeed;
				  			} else {
				  				enemies[i].attackTimer-=time*(1-enemies[i].slow)/1000;
				  			}
		  				} else {
		  					enemies[i].dist+=enemies[i].speed*time*(1-enemies[i].slow)/1000;
		  					enemies[i].attackTimer=enemies[i].attackSpeed;
		  				}
		  				break;
		  			case "imp":
		  				if (enemies[i].airborne) {
		  					enemies[i].airborneTimer-=time;
		  					enemies[i].dist = enemies[i].init+(GRID_WIDTH-3-enemies[i].init)*(1-enemies[i].airborneTimer/zombies[enemies[i].name].airborneTimer);
		  					if (enemies[i].airborneTimer<=0) {
		  						enemies[i].airborne=false;
		  						enemies[i].unhittable=false;
		  						enemies[i].dist = GRID_WIDTH-2.99;
		  					}
		  					console.log(enemies[i].dist);
		  					break;
		  				}
		  			default:
				  		if (grid[enemyX][enemies[i].lane]) { //maybe make a range instead
				  			if (grid[enemyX][enemies[i].lane].eatable) {
					  			if (enemies[i].attackTimer<=0) {
					  				grid[enemyX][enemies[i].lane].hp-=enemies[i].attackDamage;
					 				enemies[i].attackTimer+=enemies[i].attackSpeed;
					  			} else {
					  				enemies[i].attackTimer-=time*(1-enemies[i].slow)/1000;
					  			}
				  			} else {
					  			enemies[i].dist+=enemies[i].speed*time*(1-enemies[i].slow)/1000;
					  			if (enemies[i].attackTimer>0) {
					  				enemies[i].attackTimer-=time*(1-enemies[i].slow)/1000;
					  				if (enemies[i].attackTimer<0) {
					  					enemies[i].attackTimer=0;
					  				}
					  			}
				  			}
				  		} else {
				  			enemies[i].dist+=enemies[i].speed*time*(1-enemies[i].slow)/1000;
				  			if (enemies[i].attackTimer>0) {
				  				enemies[i].attackTimer-=time*(1-enemies[i].slow)/1000;
				  				if (enemies[i].attackTimer<0) {
				  					enemies[i].attackTimer=0;
				  				}
				  			}
				  		}
		  		}
		  	} else {
		  		if (enemies[i].ambush) {
		  			if (enemies[i].ambushTimer<=0) {
		  				enemies[i].dist = enemies[i].ambush+0.01;
		  				enemies[i].ambush=false;
		  			} else {
		  				enemies[i].ambushTimer-=time;
		  				if (enemies[i].ambushTimer<0) {
		  					enemies[i].ambushTimer=0;
		  				}
		  				enemies[i].dist = enemies[i].ambush*(1-enemies[i].ambushTimer/AMBUSH_TIMER);
		  			}
		  		}
		  		if (enemies[i].stun) {
		  			enemies[i].stunTimer-=time;
		  			if (enemies[i].stunTimer<=0) {
		  				enemies[i].stun = false;
		  			}
		  		} else
		  		if (enemyX<0||enemyX>=GRID_WIDTH&&!enemies[i].ambush&&!enemies[i].stun) {
			  		enemies[i].dist+=enemies[i].speed*time*(1-enemies[i].slow)/1000;
			  	}
		  	}
		  	if (enemies[i].slowTimer>0) {
		  		enemies[i].slowTimer-=time;
		  		if (enemies[i].slowTimer<=0) {
		  			enemies[i].slow=0;
		  		}
		  	}
		  	if (enemies[i].hp<=0) {
		  		//enemies.splice(i,1);
		  		switch (enemies[i].name) {
		  			case 'flying':
		  			case 'flyingCone':
		  			case 'flyingBucket':
		  				var temp = JSON.parse(JSON.stringify(zombies[enemies[i].dropName]));
						temp.lane = enemies[i].lane;
						temp.id=Math.random();
						temp.dist = enemies[i].dist;
						enemies.push(temp);
						break;
					default:
						break;
		  		}
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
		  			if (grid[i][j].hp<=0) {
		  				//socket.emit("shovel",i,j,host);
		  				//if (host) {
		  					grid[i][j]=0;
		  					if (sprites[i][j]) {
								app.stage.removeChild(sprites[i][j]);
								sprites[i][j]=0;
							}
		  				//}
		  			} else {
			  			if(!grid[i][j].shooter) {
			  				switch(grid[i][j].name) {
			  					case 'sunflower':
					  				if (grid[i][j].timer<=0) {
					  					shoot(grid[i][j]); //temporary fix
					  					grid[i][j].timer += grid[i][j].rate;
					  				} else {
					  					grid[i][j].timer-=time/1000;
					  				}
					  				break;
					  			case 'bonk':
					  				if (grid[i][j].timer<=0) {
					  					var toBeHit=-1;
						  				for (k in enemies) {
						  					if (!enemies[k].unhittable&&enemies[k].lane==j&&Math.abs(GRID_WIDTH-0.5-enemies[k].dist-i)<=grid[i][j].range+enemies[k].radius) {
						  						if (toBeHit==-1){
						  							toBeHit=k;
						  						} else {
						  							if (GRID_WIDTH-0.5-enemies[k].dist>i&&GRID_WIDTH-0.5-enemies[toBeHit].dist<i) {
						  								toBeHit=k;
						  							} else
						  							if (enemies[toBeHit].dist<enemies[k].dist) {
						  								toBeHit=k;
						  							}
						  						}
						  					}
						  				}
						  				if (toBeHit!=-1) {
						  					if (enemies[toBeHit].armour>0) {
						  						enemies[toBeHit].armour-=grid[i][j].damage;
						  					} else {
						  						enemies[toBeHit].hp-=grid[i][j].damage;
						  					}
						  					if (enemies[toBeHit].hp<0&&(enemies[toBeHit].name=="flying"||enemies[toBeHit].name=="flyingCone"||enemies[toBeHit].name=="flyingBucket")) {
						  						enemies.splice(toBeHit,1);
						  					}
						  				}
					  					grid[i][j].timer += grid[i][j].rate;
					  				} else {
					  					grid[i][j].timer-=time/1000;
					  				}
					  				break;
					  			case 'cherry':
					  				if (grid[i][j].timer<=0) {
					  					for (k in enemies) {
					  						if (!enemies[k].unhittable&&Math.abs(enemies[k].lane-j)<=1&&Math.abs(GRID_WIDTH-0.5-enemies[k].dist-i)<=1) {
							  					enemies[k].hp-=grid[i][j].damage;
					  						}
					  					}
					  					grid[i][j]=0;
					  				} else {
					  					grid[i][j].timer-=time/1000;
					  				}
					  				break;
					  			case 'iceberg':
					  				if (grid[i][j].timer<=0) {
					  					var toBeFrozen=-1;
						  				for (k in enemies) {
						  					if (!enemies[k].unhittable&&enemies[k].lane==j&&Math.abs(GRID_WIDTH-0.5-enemies[k].dist-i)<=0.5+enemies[k].radius&&!enemies[k].flying&&!enemies[k].stun) {
						  						if (toBeFrozen==-1){
						  							toBeFrozen=k;
						  						} else {
						  							if (enemies[toBeFrozen].dist<enemies[k].dist) {
						  								toBeFrozen=k;
						  							}
						  						}
						  					}
						  				}
						  				if (toBeFrozen!=-1) {
						  					enemies[toBeFrozen].slow=1/2;
						  					enemies[toBeFrozen].slowTimer=14000;
						  					enemies[toBeFrozen].stun=true;
						  					enemies[toBeFrozen].stunTimer=10000;
						  						grid[i][j]=0;
						  				}
					  				} else {
					  					grid[i][j].timer-=time/1000;
					  				}
					  				break;
			  				}
				  			continue;
				  		} else {
				  			if (grid[i][j].timer<=0) {
					  			for (k in enemies) {
					  				if (!enemies[k].unhittable&&enemies[k].lane==j&&(GRID_WIDTH-0.5-enemies[k].dist)>i) { // may be different depending on plant type
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
		  }
		   toBeSpliced = [];
		  for (i in projectiles) {
		  	projectiles[i].dist+=projectiles[i].speed*time/1000;//app.ticker.deltaMS/1000;
		  	switch (projectiles[i].name) {
		  		case "boomer":
		  			if (projectiles[i].dist<=0&&projectiles[i].return) {
		  				toBeSpliced.push(i);
		  			} else {
		  				if (projectiles[i].dist>projectiles[i].dest&&!projectiles[i].return) {
		  					projectiles[i].speed=-projectiles[i].speed;
		  					projectiles[i].return=true;
		  					projectiles[i].hits=0;
		  				}
		  				var toBeHit=[];
		  				if (projectiles[i].hits<projectiles[i].pierce) {
			  				for (j in enemies) {
						  		if (projectiles[i].return) {
						  			if (!enemies[j].unhittable&&!projectiles[i].twiceHit.includes(enemies[j].id)
						  				&&projectiles[i].alreadyHit.includes(enemies[j].id)
						  				&&enemies[j].lane==projectiles[i].lane
						  				&&Math.abs((GRID_WIDTH-0.5-enemies[j].dist)-(projectiles[i].home+projectiles[i].dist))<(enemies[j].radius+PEA_RADIUS)){//(1/4+1/8)) { //hit(projectiles[i],enemies[j])
							  			toBeHit.push(j);
							  		}
						  		} else {
							  		if (!enemies[j].unhittable&&!projectiles[i].alreadyHit.includes(enemies[j].id)&&enemies[j].lane==projectiles[i].lane&&Math.abs((GRID_WIDTH-0.5-enemies[j].dist)-(projectiles[i].home+projectiles[i].dist))<(enemies[j].radius+PEA_RADIUS)){//(1/4+1/8)) { //hit(projectiles[i],enemies[j])
							  			toBeHit.push(j);
							  		}
						  		}
						  	}
					  	}
					  	if (toBeHit) {
					  		for (j in toBeHit) {
					  			if (projectiles[i].hits>=projectiles[i].pierce) {
				  					break;
				  				}
				  				if (enemies[toBeHit[j]].name=="screen") {
				  					if (projectiles[i].return) {
				  						enemies[toBeHit[j]].hp-=projectiles[i].damage;
				  						if (!enemies[toBeHit[j]].stun) {
								  			enemies[toBeHit[j]].stun=true;
								  			enemies[toBeHit[j]].stunTimer=100;
								  		}
				  					} else {
					  					if (enemies[toBeHit[j]].screenHp>0) {
							  				enemies[toBeHit[j]].screenHp-=projectiles[i].damage;
					  					} else {
					  						enemies[toBeHit[j]].hp-=projectiles[i].damage;
								  			if (!enemies[toBeHit[j]].stun) {
									  			enemies[toBeHit[j]].stun=true;
									  			enemies[toBeHit[j]].stunTimer=100;
									  		}
					  					}
					  				}
				  				} else {
				  					if (enemies[toBeHit[j]].armour>0) {
				  						enemies[toBeHit[j]].armour-=projectiles[i].damage;
				  					} else {
				  						enemies[toBeHit[j]].hp-=projectiles[i].damage;
				  					}
						  			//enemies[toBeHit[j]].hp-=projectiles[i].damage;
						  			if (!enemies[toBeHit[j]].stun) {
							  			enemies[toBeHit[j]].stun=true;
							  			enemies[toBeHit[j]].stunTimer=100;
							  		}
					  			}
						  		projectiles[i].hits++;
					  			if (projectiles[i].return) {
					  				projectiles[i].twiceHit.push(enemies[toBeHit[j]].id);
					  			} else {
					  				
		 				  			projectiles[i].alreadyHit.push(enemies[toBeHit[j]].id);
					  			}
					  		}
					  	}
		  			}
		  			break;
		  		case "butter":
		  		case "kernel":
		  		case "cabbage":
				case "cabbagetwo":
				case "cabbagethree":
		  		case "melon":
				case "melontwo":
				case "melonthree":
		  			projectiles[i].timer-=time;
		  			if (projectiles[i].timer<=0) {
		  				toBeSpliced.push(i);
		  				var toBeHit = -1;
		  				var splash = [];
					  	for (j in enemies) {
					  		if (!enemies[j].unhittable&&enemies[j].lane==projectiles[i].lane&&Math.abs((GRID_WIDTH-0.5-enemies[j].dist)-(projectiles[i].home+projectiles[i].dest))<(enemies[j].radius+PEA_RADIUS)){//(1/4+1/8)) { //hit(projectiles[i],enemies[j])
					  			if (enemies[j].name=="umbrella") {
					  				toBeHit=-1;
					  				break;
					  			}
					  			if (toBeHit==-1) {
					  				toBeHit = j;
					  			} else {
					  				if (enemies[toBeHit].dist<enemies[j].dist) {
					  					toBeHit = j;
					  				}
					  			}
					  		}
					  	}
					  	if (projectiles[i].name=="melon"&&projectiles[i].name=="melontwo"&&projectiles[i].name=="melonthree") {
					  		for (j in enemies) {
					  			if (!enemies[j].unhittable&&Math.abs(enemies[j].lane-projectiles[i].lane)<=1&&j!=toBeHit&&((GRID_WIDTH-0.5-enemies[j].dist)-(projectiles[i].home+projectiles[i].dest))<1) {//+enemies[j].radius?
					  				splash.push[j];
					  			}
					  		}
					  		for (j in splash) {
					  			if (enemies[j].armour>0) {
			  						enemies[j].armour-=projectiles[i].splashDamage;
			  					} else {
			  						enemies[j].hp-=projectiles[i].splashDamage;
			  					}
					  		}
					  	}
					  	if (toBeHit!=-1) {
					  		if (enemies[toBeHit].armour>0) {
		  						enemies[toBeHit].armour-=projectiles[i].damage;
		  					} else {
		  						enemies[toBeHit].hp-=projectiles[i].damage;
		  					}
					  		//enemies[toBeHit].hp-=projectiles[i].damage;
					  		if (projectiles[i].name=="butter") {
					  			enemies[toBeHit].stun=true;
					  			enemies[toBeHit].stunTimer=Math.max(enemies[toBeHit].stunTimer,4000);
					  			if (enemies[toBeHit].name=="flying"||enemies[toBeHit].name=="flyingCone"||enemies[toBeHit].name=="flyingBucket") {
					  				enemies[toBeHit].hp=0;
					  			}
					  		}
					  	}
		  			}
		  			break;
		  		case "pea":
		  		default:
				  	if (projectiles[i].dist+projectiles[i].home+0.5>GRID_WIDTH) {
				  		//projectiles.splice(i,1);
				  		toBeSpliced.push(i);
				  	} else {
				  		var toBeHit = -1;
					  	for (j in enemies) {
					  		if (!enemies[j].unhittable&&enemies[j].lane==projectiles[i].lane&&Math.abs((GRID_WIDTH-0.5-enemies[j].dist)-(projectiles[i].home+projectiles[i].dist))<(enemies[j].radius+PEA_RADIUS)){//(1/4+1/8)) { //hit(projectiles[i],enemies[j])
					  			if (toBeHit==-1) {
					  				toBeHit = j;
					  			} else {
					  				if (enemies[toBeHit].dist<enemies[j].dist) {
					  					toBeHit = j;
					  				}
					  			}
					  			//enemies[j].hp-=projectiles[i].damage;
					  			//projectiles.splice(i,1);
					  			//toBeSpliced.push(i);
					  			//break;
					  		}
					  	}
					  	if (toBeHit!=-1) {
					  		if (enemies[toBeHit].name=="screen") {
					  			if (enemies[toBeHit].screenHp>0) {
					  				enemies[toBeHit].screenHp-=projectiles[i].damage;
					  			} else {
					  				enemies[toBeHit].hp-=projectiles[i].damage;
					  			}
					  		} else {
					  			if (enemies[toBeHit].armour>0) {
			  						enemies[toBeHit].armour-=projectiles[i].damage;
			  					} else {
			  						enemies[toBeHit].hp-=projectiles[i].damage;
			  					}
					  			//enemies[toBeHit].hp-=projectiles[i].damage;
					  		}
					  		toBeSpliced.push(i);
					  	}
				  	}
				  	break;
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
		  toBeSpliced=[];
		  for (i in lasers) {
		  	lasers[i][3]-=time;
		  	if (lasers[i][3]<=0) {
		  		toBeSpliced.push(i);
		  	}
		  }
		  toBeSpliced.reverse();
		  for (i in toBeSpliced) {
		  	lasers.splice(toBeSpliced[i],1);
		  }
		  sunCounter.text=sun;
		}
}

function render() {
	graphics.clear();
	switch (gameState) {
		case "selection":
			var cnt=0;
			for (i in plantArray) {
				graphics.lineStyle(2,0x000000);
				graphics.beginFill(0xFFFFFF);
				graphics.drawRect((cnt%GRID_WIDTH)*squareWidth, Math.floor(cnt/GRID_WIDTH)*squareHeight, squareWidth, squareHeight);
				var pType = plantArray[i].base;
				graphics.lineStyle(2,0x000000);
				switch (pType) {
					case 'pea':
						graphics.beginFill(0x0000FF);
						break;
					case "cabbage":
						graphics.beginFill(0x00FF00);
						break;
					case "sunflower":
						graphics.beginFill(0xFFFF00);
						break;
					case "walnut":
						graphics.beginFill(0x964B00);
						break;
					case "iceberg":
						graphics.beginFill(0x00FFFF);
						break;
					case "boomer":
						graphics.beginFill(0xC39B77);
						break;
					case "kernel":
						graphics.beginFill(0xFFFFED);
						break;
					case "bonk":
						graphics.beginFill(0x90EE90);
						break;
					case "melon":
						graphics.beginFill(0x006400);
						break;
					case "cherry":
						graphics.beginFill(0xFF0000);
						break;
					default:
						graphics.beginFill(0x880000);
				}
				graphics.drawCircle((cnt%GRID_WIDTH+1/2)*squareWidth, (Math.floor(cnt/GRID_WIDTH)+1/2)*squareHeight, squareWidth*PLANT_RADIUS);
				cnt++;
			}
			if (upgradeSelect!=-1) {
				for (i=0; i<plantUpgrades[plantArray[upgradeSelect].name].length+1; i++) {
					graphics.lineStyle(2,0x000000);
					graphics.beginFill(0xFFFFFF);
					graphics.drawRect((i%GRID_WIDTH)*squareWidth, (GRID_HEIGHT-1)*squareHeight, squareWidth, squareHeight);
					var pType = plantArray[upgradeSelect].base;
					graphics.lineStyle(2,0x000000);
					switch (pType) {
						case 'pea':
							graphics.beginFill(0x0000FF);
							break;
						case "cabbage":
							graphics.beginFill(0x00FF00);
							break;
						case "sunflower":
							graphics.beginFill(0xFFFF00);
							break;
						case "walnut":
							graphics.beginFill(0x964B00);
							break;
						case "iceberg":
							graphics.beginFill(0x00FFFF);
							break;
						case "boomer":
							graphics.beginFill(0xC39B77);
							break;
						case "kernel":
							graphics.beginFill(0xFFFFED);
							break;
						case "bonk":
							graphics.beginFill(0x90EE90);
							break;
						case "melon":
							graphics.beginFill(0x006400);
							break;
						case "cherry":
							graphics.beginFill(0xFF0000);
							break;
						default:
							graphics.beginFill(0x880000);
					}
					graphics.drawCircle((i%GRID_WIDTH+1/2)*squareWidth, (GRID_HEIGHT-1/2)*squareHeight, squareWidth*PLANT_RADIUS);
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
				var pType = plants[inventory[i]].base;
				switch (pType) {
					case 'pea':
						graphics.beginFill(0x0000FF);
						break;
					case "cabbage":
						graphics.beginFill(0x00FF00);
						break;
					case "sunflower":
						graphics.beginFill(0xFFFF00);
						break;
					case "walnut":
						graphics.beginFill(0x964B00);
						break;
					case "iceberg":
						graphics.beginFill(0x00FFFF);
						break;
					case "boomer":
						graphics.beginFill(0xC39B77);
						break;
					case "kernel":
						graphics.beginFill(0xFFFFED);
						break;
					case "bonk":
						graphics.beginFill(0x90EE90);
						break;
					case "melon":
						graphics.beginFill(0x006400);
						break;
					case "cherry":
						graphics.beginFill(0xFF0000);
						break;
					default:
						graphics.beginFill(0x880000);
				}
				graphics.drawCircle(squareWidth/2+i*squareWidth,squareHeight+GRID_HEIGHT*squareHeight,squareWidth*PLANT_RADIUS);
				graphics.endFill();
			}
			break;
		case "ingame":
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
						var pType = grid[i][j].base;
						graphics.lineStyle(2,0x000000);
						switch (pType) {
							case 'pea':
								graphics.beginFill(0x0000FF);
								break;
							case "cabbage":
								graphics.beginFill(0x00FF00);
								break;
							case "sunflower":
								graphics.beginFill(0xFFFF00);
								break;
							case "walnut":
								graphics.beginFill(0x964B00);
								break;
							case "iceberg":
								graphics.beginFill(0x00FFFF);
								break;
							case "boomer":
								graphics.beginFill(0xC39B77);
								break;
							case "kernel":
								graphics.beginFill(0xFFFFED);
								break;
							case "bonk":
								graphics.beginFill(0x90EE90);
								break;
							case "melon":
								graphics.beginFill(0x006400);
								break;
							case "cherry":
								graphics.beginFill(0xFF0000);
								break;
							default:
								graphics.beginFill(0x880000);
						}
						if (pType=="walnut") {
							if (grid[i][j].hp>plants[grid[i][j].name].hp*2/3) {
								graphics.drawCircle(squareWidth/2+i*squareWidth,squareHeight/2+j*squareHeight,squareWidth*PLANT_RADIUS);
							} else if (grid[i][j].hp>plants[grid[i][j].name].hp*1/3) {
								graphics.arc(squareWidth/2+i*squareWidth,squareHeight/2+j*squareHeight,squareWidth*PLANT_RADIUS,-Math.PI/3,Math.PI+Math.PI/3);
							} else {
								graphics.arc(squareWidth/2+i*squareWidth,squareHeight/2+j*squareHeight,squareWidth*PLANT_RADIUS,-Math.PI/6,Math.PI+Math.PI/6);
							}
						} else {
							graphics.drawCircle(squareWidth/2+i*squareWidth,squareHeight/2+j*squareHeight,squareWidth*PLANT_RADIUS);
						}
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
				var pType = plants[inventory[i]].base;
				switch (pType) {
					case 'pea':
						graphics.beginFill(0x0000FF);
						break;
					case "cabbage":
						graphics.beginFill(0x00FF00);
						break;
					case "sunflower":
						graphics.beginFill(0xFFFF00);
						break;
					case "walnut":
						graphics.beginFill(0x964B00);
						break;
					case "iceberg":
						graphics.beginFill(0x00FFFF);
						break;
					case "boomer":
						graphics.beginFill(0xC39B77);
						break;
					case "kernel":
						graphics.beginFill(0xFFFFED);
						break;
					case "bonk":
						graphics.beginFill(0x90EE90);
						break;
					case "melon":
						graphics.beginFill(0x006400);
						break;
					case "cherry":
						graphics.beginFill(0xFF0000);
						break;
					default:
						graphics.beginFill(0x880000);
				}
				graphics.drawCircle(squareWidth/2+i*squareWidth,squareHeight+GRID_HEIGHT*squareHeight,squareWidth*PLANT_RADIUS);
				graphics.endFill();
				graphics.lineStyle(0);
				graphics.beginFill(0x000000,0.2);
				graphics.drawRect(i*squareWidth,GRID_HEIGHT*squareHeight,squareWidth,squareHeight*2*plants[inventory[i]].cooldownTimer/plants[inventory[i]].cooldown);
			}
			enemies.reverse();
			let alph=0.5;
			for (i in enemies) {
				var eType = enemies[i].name;

				switch (eType) {
					case "flying":
					case "flyingCone":
					case "flyingBucket":
						graphics.lineStyle(2,0x00FFFF);
						break;
					case "laser":
						graphics.lineStyle(2,0xFF0000);
						break;
					default:
						graphics.lineStyle(2,0x000000);
				}
				if (enemies[i].slow>0) {
					graphics.beginFill(0x000088,alph);
				} else {
					graphics.beginFill(0x008800,alph);
				}
				if (enemies[i].name=="laser") {
					if (enemies[i].channeling) {
						if (enemies[i].slow>0) {
							graphics.beginFill(0x880088,alph);
						} else {
							graphics.beginFill(0x880000,alph);
						}
					}
				}
				graphics.drawCircle(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth,squareHeight/2+squareHeight*enemies[i].lane,squareWidth*enemies[i].radius);
				graphics.endFill();
				
					switch (eType) {
						case "flyingCone":
							graphics.lineStyle(2,0x000000);
							graphics.beginFill(0xFF8800);
							graphics.moveTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2+squareHeight*enemies[i].lane);
							graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth+squareWidth*enemies[i].radius,squareHeight/2+squareHeight*enemies[i].lane);
							graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth,squareHeight/2+squareHeight*enemies[i].lane-squareWidth*enemies[i].radius);
							graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2+squareHeight*enemies[i].lane);
							graphics.closePath();
							graphics.endFill();
							break;
						case "cone":
							if (enemies[i].armour>zombies[enemies[i].name].armour*2/3) {
								graphics.lineStyle(2,0x000000);
								graphics.beginFill(0xFF8800);
								graphics.moveTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2+squareHeight*enemies[i].lane);
								graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth+squareWidth*enemies[i].radius,squareHeight/2+squareHeight*enemies[i].lane);
								graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth,squareHeight/2+squareHeight*enemies[i].lane-squareWidth*enemies[i].radius);
								graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2+squareHeight*enemies[i].lane);
								graphics.closePath();
								graphics.endFill();
							} else if (enemies[i].armour>zombies[enemies[i].name].armour*1/3) {
								graphics.lineStyle(2,0x000000);
								graphics.beginFill(0xFF8800);
								graphics.moveTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2+squareHeight*enemies[i].lane);
								graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth+squareWidth*enemies[i].radius,squareHeight/2+squareHeight*enemies[i].lane);
								graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth+squareWidth*enemies[i].radius/3,squareHeight/2+squareHeight*enemies[i].lane-squareWidth*enemies[i].radius+squareWidth*enemies[i].radius/3);
								graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius/3,squareHeight/2+squareHeight*enemies[i].lane-squareWidth*enemies[i].radius+squareWidth*enemies[i].radius/3);
								//graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth,squareHeight*enemies[i].lane);
								graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2+squareHeight*enemies[i].lane);
								graphics.closePath();
								graphics.endFill();
							} else if (enemies[i].armour>0) {
								graphics.lineStyle(2,0x000000);
								graphics.beginFill(0xFF8800);
								graphics.moveTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2+squareHeight*enemies[i].lane);
								graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth+squareWidth*enemies[i].radius,squareHeight/2+squareHeight*enemies[i].lane);
								graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth+2*squareWidth*enemies[i].radius/3,squareHeight/2+squareHeight*enemies[i].lane-squareWidth*enemies[i].radius+2*squareWidth*enemies[i].radius/3);
								graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-2*squareWidth*enemies[i].radius/3,squareHeight/2+squareHeight*enemies[i].lane-squareWidth*enemies[i].radius+2*squareWidth*enemies[i].radius/3);
								//graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth,squareHeight*enemies[i].lane);
								graphics.lineTo(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2+squareHeight*enemies[i].lane);
								graphics.closePath();
								graphics.endFill();
							}
							break;
						case "flyingBucket":
							graphics.lineStyle(2,0x000000);
							graphics.beginFill(0x888888);
							graphics.drawRect(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2-squareWidth*enemies[i].radius+squareHeight*enemies[i].lane,2*squareWidth*enemies[i].radius,squareWidth*enemies[i].radius);
							graphics.endFill();
							break;
						case "bucket":
							graphics.lineStyle(2,0x000000);
							graphics.beginFill(0x888888);
							if (enemies[i].armour>zombies[enemies[i].name].armour*2/3) {
								graphics.drawRect(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2-squareWidth*enemies[i].radius+squareHeight*enemies[i].lane,2*squareWidth*enemies[i].radius,squareWidth*enemies[i].radius);
							} else if (enemies[i].armour>zombies[enemies[i].name].armour*1/3) {
								graphics.drawRect(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2-squareWidth*enemies[i].radius*2/3+squareHeight*enemies[i].lane,2*squareWidth*enemies[i].radius,squareWidth*enemies[i].radius*2/3);
							} else if (enemies[i].armour>0) {
								graphics.drawRect(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2-squareWidth*enemies[i].radius/3+squareHeight*enemies[i].lane,2*squareWidth*enemies[i].radius,squareWidth*enemies[i].radius/3);
							}
							graphics.endFill();
							break;
						case "football":
							graphics.lineStyle(2,0x000000);
							graphics.beginFill(0xFF0000);
							if (enemies[i].armour>zombies[enemies[i].name].armour*2/3) {
								graphics.drawRect(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2-squareWidth*enemies[i].radius+squareHeight*enemies[i].lane,2*squareWidth*enemies[i].radius,squareWidth*enemies[i].radius);
							} else if (enemies[i].armour>zombies[enemies[i].name].armour*1/3) {
								graphics.drawRect(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2-squareWidth*enemies[i].radius*2/3+squareHeight*enemies[i].lane,2*squareWidth*enemies[i].radius,squareWidth*enemies[i].radius*2/3);
							} else if (enemies[i].armour>0) {
								graphics.drawRect(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2-squareWidth*enemies[i].radius/3+squareHeight*enemies[i].lane,2*squareWidth*enemies[i].radius,squareWidth*enemies[i].radius/3);
							}
							graphics.endFill();
							break;
						case "umbrella":
							graphics.lineStyle(2,0x000000);
							graphics.beginFill(0xADD8E6);
							graphics.arc(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth,squareHeight/2+squareHeight*enemies[i].lane,squareWidth*enemies[i].radius+5,-Math.PI,0);
							break;
						case "screen":
							graphics.lineStyle(2,0x000000);
							graphics.beginFill(0x888888);
							if (enemies[i].screenHp>zombies[enemies[i].name].screenHp*2/3) {
								graphics.drawRect(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2-squareWidth*enemies[i].radius+squareHeight*enemies[i].lane,squareWidth*enemies[i].radius,2*squareWidth*enemies[i].radius);
							} else if (enemies[i].screenHp>zombies[enemies[i].name].screenHp*1/3) {
								graphics.drawRect(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2-squareWidth*enemies[i].radius+squareHeight*enemies[i].lane,squareWidth*enemies[i].radius*2/3,2*squareWidth*enemies[i].radius);
							} else if (enemies[i].screenHp>0) {
								graphics.drawRect(squareWidth*GRID_WIDTH-enemies[i].dist*squareWidth-squareWidth*enemies[i].radius,squareHeight/2-squareWidth*enemies[i].radius+squareHeight*enemies[i].lane,squareWidth*enemies[i].radius/3,2*squareWidth*enemies[i].radius);
							}
							graphics.endFill();
							break;
					}
			}
			enemies.reverse();

			for (i in lasers) {
				graphics.lineStyle(2,0xFF0000);
				graphics.beginFill(0xFF0000);
				graphics.drawRect(lasers[i][0]*squareWidth,(lasers[i][2]+0.5)*squareHeight-10,(lasers[i][1]-lasers[i][0])*squareWidth,20);
			}

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
			graphics.drawRect(squareWidth*(GRID_WIDTH-1),squareHeight*GRID_HEIGHT,squareWidth,squareHeight*2);
	}
}

function sendZombie(lane,type,ambush) {
	socket.emit('zombie',lane,type,ambush);
}

function spawnZombie(lane,type,ambush) {
	if(zombies[type]) {
		var temp = JSON.parse(JSON.stringify(zombies[type]));
		temp.lane = lane%GRID_HEIGHT;
		temp.ambush=ambush;
		console.log("ambush "+ambush);
		if (ambush) {
			temp.ambushTimer=AMBUSH_TIMER;
		}
		temp.id=Math.random();
		enemies.push(temp);
	}
}

function spawnPlant(x,y,type) {
	let p = plants[type];
	/*if (plants[type].image) {
		let pee = PIXI.Sprite.from('images/'+plants[type].image)
		pee.x = (x+0.5)*squareWidth;
		pee.y = (y+0.5)*squareHeight;
		app.stage.addChild(pee);
		sprites[x][y]=pee;
	}*/
	grid[x][y] = JSON.parse(JSON.stringify(plants[type]));
	/*grid[x][y]={};
	grid[x][y].hp=p.hp;
	grid[x][y].damage=p.damage;
	grid[x][y].rate=p.rate;
	grid[x][y].timer=p.timer;
	grid[x][y].shooter=p.shooter;
	grid[x][y].name=p.name;*/
	grid[x][y].home = x;
	grid[x][y].lane = y;
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

function sendPlant(x,y,type,h) {
	socket.emit('plant',x,y,type,plants[type].cost,h,socket.id,tickCount);
}