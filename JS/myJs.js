
window.onload=function(){
    var can1=document.getElementById("canvas1");
    var can2=document.getElementById("canvas2");
    var context1=can1.getContext("2d");
    var context2=can2.getContext("2d");
    var lastTime=Date.now();
    var passTime=0;
    var anemones=[];
    var dust=[];
    var anemoneTop=0;
    var foods=[];
    var mouseX=400;
    var mouseY=300;
    var UI_x=0;
    var UI_y=0;
    var animation=0;
    var changeTai=0;
    var changeBigEye=0;
    var changeBabyEye=0;
    var changeBody=0;
    var score=0;
    var sumScore=0;
    var eatting=0;
    var feed=false;
    var feeding=0;
    var feedCircle=10;
    var CircleColor=1;
    var UI=0;
    var gameOver=true;
    var hard=0;
    var newGame=true;
    addAnemone();
    addFood();
    setFishMum();
    setBabyFish();
    addDust();
    update();
    can1.onmousemove=function(){
        if(!gameOver){
            if(event.offsetX||event.layerX){
                mouseX=(event.offsetX==undefined?event.layerX:event.offsetX);
                mouseY=(event.offsetY==undefined?event.layerY:event.offsetY);
            }
        }else{
            if(event.offsetX||event.layerX){
                UI_x=(event.offsetX==undefined?event.layerX:event.offsetX);
                UI_y=(event.offsetY==undefined?event.layerY:event.offsetY);
            }
        }

    };
    function update() {
        requestAnimFrame(update)
        var now=Date.now();
        passTime=now-lastTime;
        lastTime=Date.now();
        if(passTime>30)passTime=30;

        drawBackground();
        drawAnemone();
        drawFood();
        grown();
        context1.clearRect(0,0,can1.width,can1.height);
        drawFishMum();
        eatFoods();
        drawBabyFish();
        fishAnimation();
        drawScore();
        drawCircle();
        drawDust();
    }



    /*背景设置开始！*/
    function drawBackground(){               /*绘制背景*/
        context2.clearRect(0,0,can2.width,can2.height)
        var bgPic=new Image();
        bgPic.src="./src/background.jpg";
        var canWidth=can2.width;
        var canHeight=can2.height;
        context2.drawImage(bgPic,0,0,canWidth,canHeight)
    }
    /*海葵绘制开始！*/

    function addAnemone(){                  /*给海葵设置属性*/
        console.log("addAnemone")
        for(var i=0;i<50;i++){
            anemone={
                x:18*i+8*Math.random(),
                y:450+100*Math.random(),
                width:15+10*Math.random(),
                haveFood:false
            };
            anemones.push(anemone);
        }
    }
    function drawAnemone(){         /*绘制海葵*/
        context2.save();
        anemoneTop+=passTime;
        anemoneTop%=6282;
        for(var i=0;i<anemones.length;i++){
            context2.beginPath();
            context2.moveTo(anemones[i].x,can2.height);
            context2.quadraticCurveTo(anemones[i].x,anemones[i].y,anemones[i].x+Math.sin(anemoneTop/1000)*40,anemones[i].y-80);
            context2.lineWidth=anemones[i].width;
            context2.lineCap="round";
            context2.strokeStyle="rgba(200,43,255,0.3)";
            context2.stroke()
        }
        context2.restore()
    }
    function addDust(){
        for (var i=0;i<19;i++){
            aAust={
                x:Math.random()*can1.width,
                y:Math.random()*can1.height,
                v:1-Math.random()*0.5,
                pic:new Image
            }
            aAust.pic.src="./src/dust"+i%7+".png";
            dust.push(aAust)
        }
    }
    function drawDust(){
        for( var i=0;i<dust.length;i++){
            context2.beginPath();
            context2.drawImage(dust[i].pic,(dust[i].x+Math.sin(anemoneTop/1000)*40)*dust[i].v,dust[i].y);
        }
    }
    /*食物绘制开始！*/
    function addFood(){             /*增加食物*/

        for(var i=0;i<15;i++){
            foods.push(setFood());
        }
    }
    function setFood(){             /*设置一个随机食物*/

        var location=  Math.floor(Math.random() * anemones.length);
        aFood={                     /*设置食物的属性*/
            up:false,
            color:new Image(),
            x:anemones[location].x+Math.sin(anemoneTop/1000)*20,
            y:anemones[location].y-90,
            vx:0.03*(Math.random()-0.5),
            vy:0.03+0.07*(Math.random()),
            size:0,
            location:location
        };
        if(Math.random()<0.7){
            aFood.color.src="./src/fruit.png"
        }else{
            aFood.color.src="./src/blue.png"
        }
        return aFood;
    }
    function drawFood(){                /*绘制食物*/

        for( var i=0;i<foods.length;i++){
            context2.beginPath();
            context2.drawImage(foods[i].color,foods[i].x,foods[i].y,foods[i].size,foods[i].size);
        }
    }
    function grown(){  /*食物大小的增长*/
        for(var i=0;i<foods.length;i++){
            if(foods[i].size<20){
                foods[i].size+=0.2;
                foods[i].x=(anemones[foods[i].location].x+Math.sin(anemoneTop/1000)*40-1);
                foods[i].y-=0.01;
            }else{
                foods[i].up=true;
                foods[i].y-=foods[i].vy*passTime*1.5;
                if(foods[i].y<-10||foods[i].x<-10||foods[i]>can2.width+10){      /*如果食物出屏幕了*/
                    foods[i]=setFood();
                }
            }
        }
    }
    function setFishMum(){                      /*鱼妈妈的初始化*/
        fishMum={
            x:400,
            y:300,
            eye:new Image(),
            body:new Image(),
            tail:new Image(),
            direction:0,
            eatFood:false
        };
        fishMum.body.src="./src/bigSwim0.png";
        fishMum.eye.src="./src/bigEye0.png";
        fishMum.tail.src="./src/bigTail0.png"
    }
    function upDateFishMum(){                   /*改变鱼妈妈状态*/
        fishMum.x=mouseX+(fishMum.x-mouseX)*0.98;
        fishMum.y=mouseY+(fishMum.y-mouseY)*0.98;
        fishMum.direction=changeDirection(Math.atan2((mouseY-fishMum.y),(mouseX-fishMum.x)),fishMum.direction,0.6);
    }
    function drawFishMum(){                 /*绘制鱼妈妈*/
        upDateFishMum()
        context1.save();
        context1.translate(fishMum.x,fishMum.y);
        context1.rotate(fishMum.direction+Math.PI);
        context1.drawImage(fishMum.body,-fishMum.body.width*0.5,-fishMum.body.height*0.5);
        context1.drawImage(fishMum.eye,-fishMum.eye.width*0.5,-fishMum.eye.height*0.5);
        context1.drawImage(fishMum.tail,-fishMum.tail.width*0.5+28,-fishMum.tail.height*0.5);
        context1.restore()
    }
    function eatFoods(){                            /*鱼妈妈的体积碰撞检测*/
        if(!gameOver){
            for(var i=0;i<foods.length;i++){
                if(foods[i].up){
                    if(getLength2(foods[i].x+10,foods[i].y+10,fishMum.x,fishMum.y)<1600){
                        fishMum.body.src="./src/bigEat"+(score<8?score:7)+".png";
                        fishMum.eatFood=true;
                        eatting=0;
                        if(getLength2(foods[i].x+10,foods[i].y+10,fishMum.x,fishMum.y)<700){
                            score++;
                            foods[i]=setFood();
                        }
                    }
                    if(getLength2(fishBaby.x,fishBaby.y,fishMum.x,fishMum.y)<900){
                        if(score){feed=true;sumScore+=score}
                        if(changeBody>score){
                            changeBody-=score;
                        }
                        else changeBody=0;
                        score=0;

                        fishMum.body.src="./src/bigSwim"+score+".png";
                    }
                }
            }
        }
    }
    function setBabyFish(){                      /*鱼宝宝的初始化*/
        fishBaby={
            x:400,
            y:300,
            eye:new Image(),
            body:new Image(),
            tail:new Image(),
            direction:0
        };
        fishBaby.eye.src="./src/babyEye0.png";
        fishBaby.body.src="./src/baby.png";
        fishBaby.tail.src="./src/babyTail0.png"
    }
    function upDateBabyFish(){                   /*改变鱼宝宝状态*/
        fishBaby.x=fishMum.x+(fishBaby.x-fishMum.x)*0.995;
        fishBaby.y=fishMum.y+(fishBaby.y-fishMum.y)*0.995;
        fishBaby.direction=changeDirection(Math.atan2((fishMum.y-fishBaby.y),(fishMum.x-fishBaby.x)),fishBaby.direction,0.9);
    }
    function drawBabyFish(){                 /*绘制鱼宝宝*/
        upDateBabyFish();

        context1.save();
        context1.translate(fishBaby.x,fishBaby.y);
        context1.rotate(fishBaby.direction+Math.PI);
        context1.drawImage(fishBaby.body,-fishBaby.body.width*0.5,-fishBaby.body.height*0.5);
        context1.drawImage(fishBaby.eye,-fishBaby.eye.width*0.5,-fishBaby.eye.height*0.5);
        context1.drawImage(fishBaby.tail,-fishBaby.tail.width*0.5+23,-fishBaby.tail.height*0.5);
        context1.restore()
    }
    function fishAnimation(){               /*鱼儿眨眼甩尾和闭嘴*/
        animation+=passTime;
        hard+=passTime;
        if(animation>60){
            animation%=60;
            changeBigEye+=0.5+Math.random();
            changeBabyEye+=5*Math.random();
            changeTai++;
            changeTai%=8;
            fishBaby.tail.src="./src/babyTail"+changeTai+".png";
            fishMum.tail.src="./src/bigTail"+changeTai+".png";
            if(changeBabyEye>4&&changeBabyEye<150){
                fishBaby.eye.src="./src/babyEye0.png";
            }
            if(changeBabyEye>100){
                changeBabyEye=0;
                fishBaby.eye.src="./src/babyEye1.png";
            }
            if(changeBigEye>4&&changeBabyEye<150){
                fishMum.eye.src="./src/babyEye0.png";
            }
            if(changeBigEye>100){
                changeBigEye=0;
                fishMum.eye.src="./src/babyEye1.png";
            }
            if(fishMum.eatFood){
                eatting++;
                if(eatting>3){
                    fishMum.eatFood=false;
                    if(score<7){
                        fishMum.body.src="./src/bigSwim"+score+".png";
                    }else{
                        fishMum.body.src="./src/bigSwim7.png";
                    }
                    eatting=0;
                }
            }
        }
        if(hard>700){
            if(changeBody<19){
                changeBody+=1;
                fishBaby.body.src="./src/babyFade"+parseInt(changeBody)+".png";
                hard=0;
            }else{
                gameOver=true;
            }
        }
    }
    function drawCircle(){          /*喂食特效*/
        if(feeding>500){
            feed=false;
            feeding=0;
            feedCircle=10;
            CircleColor=1;
        }
        if(feed){
            fishBaby.body.src="./src/babyFade"+parseInt(changeBody)+".png";
            feeding+=passTime;
            feedCircle+=7;
            CircleColor-=0.03;
            context1.beginPath();
            context1.arc(fishBaby.x,fishBaby.y,feedCircle,0,2*Math.PI);
            context1.strokeStyle="rgba(255,120,20,"+CircleColor+")";
            context1.lineWidth=3;
            context1.stroke()
        }
    }
    function drawScore(){    /*UI部分*/

        context1.textAlign="center"

        if(newGame&&gameOver){
            context1.save()

            context1.beginPath()
            context1.fillStyle="rgba(255,255,255,1)";
            context1.font="bold 40px cursive";
            context1.fillText("开始游戏",can1.width*0.5,460);
            context1.beginPath();
            context1.shadowBlur=30;
            context1.shadowColor="#fff"
            context1.strokeStyle="#fff"
            context1.moveTo(290,420);
            context1.lineTo(290,480);
            context1.lineTo(506,480);
            context1.lineTo(506,420);
            context1.closePath();
            context1.stroke();
            context1.beginPath()
            context1.font="bold 100px cursive";
            context1.fillText("爱心小鱼",can1.width*0.5,200)
            context1.beginPath()
            context1.font="bold 20px cursive";
            context1.fillText("鼠标控制鱼妈妈前进方向",can1.width*0.5,280)
            context1.fillText("吃到更多的果实并喂给她的孩子",can1.width*0.5,310)
            context1.restore()
        }else if (gameOver){
            if(UI<1) UI+=0.006;
            context1.save()
            context1.shadowBlur=30;
            context1.shadowColor="#fff"
            context1.beginPath()
            context1.fillStyle="rgba(255,255,255,"+UI+")";
            context1.font="bold 100px cursive";
            context1.fillText("游戏结束",can1.width*0.5,200)
            context1.beginPath()
            context1.font="bold 70px cursive";
            context1.fillText("得分:"+sumScore,can1.width*0.5,300)
            context1.beginPath()
            context1.font="bold 40px cursive";
            context1.fillText("重新开始",can1.width*0.5+100,440);
            context1.beginPath();
            context1.shadowBlur=30;
            context1.shadowColor="#fff"
            context1.strokeStyle="rgba(255,255,255,"+UI+")";
            context1.moveTo(411,399);
            context1.lineTo(411,460);
            context1.lineTo(586,460);
            context1.lineTo(586,399);
            context1.closePath();
            context1.stroke();
            context1.restore()
        }else{
            context1.beginPath();
            context1.fillStyle="white";
            context1.fillText("得分:"+sumScore,can1.width*0.5,50);
            context1.fillText("饥饿度:"+(19-changeBody),can1.width*0.5,can1.height-120)

        }

    }
    can1.onclick=function(){                      /*replay被点击*/
        if(!newGame&&gameOver&&UI_x>411&&UI_x<586&&UI_y>399&&UI_y<460){
            score=0;
            sumScore=0;
            changeBody=0;
            UI=0
            gameOver=false;
            setFishMum();
            setBabyFish();
        }
        if(newGame&&gameOver&&UI_x>290&&UI_x<560&&UI_y>420&&UI_y<480){
            score=0;
            sumScore=0;
            changeBody=0;
            UI=0
            newGame=false;
            gameOver=false;
        }
    };
};

