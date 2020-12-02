var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var block1;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var gameOver, restart;
localStorage["HighestScore"] = 0;

function preload()
{
  trex_running = loadAnimation("images/boy1.png","images/boy2.png","images/boy3.png","images/boy4.png");
  trex_collided = loadImage("images/boy5.png");
  groundImage = loadImage("images/ground2.png");
  cloudImage = loadImage("images/cloud1.png");
  obstacle1 = loadImage("images/obstacle1.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle3 = loadImage("images/obstacle3.png");
  obstacle4 = loadImage("images/obstacle4.png");
  obstacle5 = loadImage("images/obstacle5.png");
  obstacle6 = loadImage("images/obstacle6.png");
  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
  jumpSound = loadSound("audio/jump.mp3"); 
  dieSound = loadSound("audio/die.mp3");
  checkPointSound = loadSound("audio/checkPoint.mp3"); 
}

function setup()
{
  createCanvas(600, 200);
  camera.position.x = 300;
  camera.position.y = 100;

  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.3;
  
  ground = createSprite(2000,180,40,2);
  ground.addImage("ground",groundImage);
  
  ground.x = ground.width/2;
  ground.velocityX = -(6+3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false; 
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
  
  invisibleGround = createSprite(200,165,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  score = 0;
}
function draw()
{
  background("white");
 
  //trex.debug = true;
  trex.setCollider("rectangle", 0,0,50,50);
  //invisibleGround.debug = true;
  //ground.debug = true;
  text("Score: "+ score, 500,20);
  ground.setCollider("rectangle",0,0,ground.width,5);
  invisibleGround.setCollider("rectangle",0,0,invisibleGround.width,5);
 
  if(gameState===PLAY)
  {
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6+3*score/100);
  
    if(keyDown("space") && trex.y>=144) 
    {
      trex.velocityY = -10;
      jumpSound.play();
    }
    if(keyDown("w") && trex.y>=150) 
    {
      trex.velocityY = -10;
      jumpSound.play();
    }
    if(keyDown("s") && trex.y<=150) 
    {
      trex.velocityY = +10;
    }
    
    if (ground.x < 0)
    {
      ground.x = ground.width/2;
    }
    
    trex.velocityY = trex.velocityY + 0.8
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if (score>0 && score%100 === 0)
    { 
      checkPointSound.play(); 
    }
    if(obstaclesGroup.isTouching(trex))
    {
      gameState=END; 
      dieSound.play(); 
    }
  }
  else if(gameState === END)
  {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
  }
  
  if(mousePressedOver(restart))
  {
    reset();
  }
 
  drawSprites();
}
function spawnClouds()
{
  if (frameCount % 110 === 0)
  {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(50,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -3;
    cloud.lifetime = 300;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  } 
}
function spawnObstacles()
{
  if(frameCount% 80 === 0)
  {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6+3*score/100);
    //obstacle.debug = true;
    var rand = Math.round(random(1,6));
    switch(rand)
    {
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
    obstacle.scale = 0.48;
    obstacle.collide(ground);
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function reset()
{
  gameState = PLAY;
  ground.velocityX = -(6 + 3*score/100)
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score)
  { 
    localStorage["HighestScore"] = score; 
  } 
  
  console.log(localStorage["HighestScore"]);
  score = 0; 
}