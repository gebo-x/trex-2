var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOver;

var restart;

var chekpointSound;
var dieSound;
var jumpSound;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  trex_collided= loadImage("trex_collided.png");
  gameOverImage = loadImage("gameOver.png");

  restartImage = loadImage("restart.png");
  
  chekpointSound = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  var message = "esto es in mensaje";

  trex = createSprite(50,height-160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
 
 // trex.setCollider(rectangle 0,0,40,trex.hide);

  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log("esto es " + gameState);
  trex.setCollider("circle", 0,0,40);
  trex.debug=false;//para ver el radio colicionador

  score = 0;

  gameOver = createSprite(300,40);
  gameOver.addImage("gameOver",gameOverImage);
  restart=createSprite(300,140);
  restart.addImage("r",restartImage);
  gameOver.scale=0.5;
  restart.scale=0.5;
}


function draw() {
  background(180);
  text("Puntuación: "+ score, 500,50);
  
  if(mousePressedOver(restart)){
   
  reset();
  console.log("reinicia el juego");

  }
  
  if(gameState === PLAY){
       
    ground.velocityX = -(4+3*score/100);
    gameOver.visible=false;
    restart.visible=false;
    score = score + Math.round(frameCount/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
   
    if(score>0 && score%100===0){
       chekpointSound.play();
     } 
     if ((touches.length > 0 || keyDown("space")) && trex.y >= height-164){
        trex.velocityY = -13;
       jumpSound.play();
       touches=[];
      }

    
  
     trex.velocityY = trex.velocityY + 0.8
     
  
  
    spawnClouds(); 
  
   
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
     }
  }
   else if (gameState === END) {
       
      ground.velocityX = 0;
      trex.velocityY = 0;
      gameOver.visible=true;
      restart.visible=true;
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     trex.changeAnimation("collided",trex_collided);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
      
    
    }
  
 

  trex.collide(invisibleGround);
  
  
  
  drawSprites();
 
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(6+score/100);
   
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    obstacle.scale = 0.5;
    obstacle.lifetime = -1;
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 134;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
   cloudsGroup.add(cloud);
    }
}
function reset(){
  gameState=PLAY
  gameOverImage.visible=false;
  gameOver.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score=0;
}

