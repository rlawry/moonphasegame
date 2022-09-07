function MoonPainter( canvas ) {
	this.lineWidth = 1;
	this.radius = (canvas.width) / 2 - this.lineWidth / 2;
	this.offset = (this.lineWidth) / 2;

	this.canvas = canvas;
	this.ctx = canvas.getContext( '2d' );
}

MoonPainter.prototype = {
	_drawDisc: function() {
		this.ctx.translate( this.offset, this.offset ) ;
		this.ctx.beginPath();
		this.ctx.arc( this.radius, this.radius, this.radius, 0, 2 * Math.PI, true );
		this.ctx.closePath();
		this.ctx.fillStyle = '#fff';
		this.ctx.strokeStyle = '#fff';
		this.ctx.lineWidth = this.lineWidth;

		this.ctx.fill();			
		this.ctx.stroke();
	},

	_drawPhase: function( phase ) {
		this.ctx.beginPath();
		this.ctx.arc( this.radius, this.radius, this.radius, -Math.PI/2, Math.PI/2, true );
		this.ctx.closePath();
		this.ctx.fillStyle = '#000';
		this.ctx.fill();

		this.ctx.translate( this.radius, this.radius );
		this.ctx.scale( phase, 1 );
		this.ctx.translate( -this.radius, -this.radius );
		this.ctx.beginPath();
		this.ctx.arc( this.radius, this.radius, this.radius, -Math.PI/2, Math.PI/2, true );
		this.ctx.closePath();
		this.ctx.fillStyle = phase > 0 ? '#fff' : '#000';
		this.ctx.fill();
	},
	
	/**
	 * @param {Number} The phase expressed as a float in [0,1] range .
	 */	
	paint( phase ) {
		this.ctx.save();
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
		if ( phase <= 0.5 ) {
			this._drawDisc();
			this._drawPhase( 4 * phase - 1 );
		} else {
			this.ctx.translate( this.radius + 2 * this.offset, this.radius + 2 * this.offset );
			this.ctx.rotate( Math.PI );
			this.ctx.translate( -this.radius, -this.radius );

			this._drawDisc();
			this._drawPhase( 4 * ( 1 - phase ) - 1 );
		}

		this.ctx.restore();		
	}
}

var phase = 0.25;
var points = 0;
var painter = new MoonPainter( document.getElementById( 'canvas' ) );
var b = 235;
var a = 135;
var g = 206;
painter.paint(phase);
document.getElementById("illumination").innerHTML = outputIllumination(phase).toFixed(0)+"%";
document.getElementById("canvas").addEventListener("wheel",function cycleThePhase(event){
    if(event.deltaY>0){painter.paint(phase+=0.01);}
    else if(event.deltaY<0){painter.paint(phase-=0.01);}
    if(phase > 1){phase = 0;}
    else if(phase<0){phase = 1;}
    document.getElementById("illumination").innerHTML = outputIllumination(phase).toFixed(0)+"%";
    var sky = outputIllumination(phase);
    var a = 170;
    var backgroundColor = "rgb("+Math.floor(a-a*sky/100)+", "+Math.floor(g-g*sky/100)+", "+Math.floor(b-b*sky/100)+")";
    document.body.style.background = backgroundColor;
});

document.addEventListener('keydown', (e) => {
    if (e.code === "ArrowUp")        {painter.paint(phase += 0.01);}
    else if (e.code === "ArrowDown") {painter.paint(phase -= 0.01);}
    if(phase > 1){phase = 0;}
    else if(phase<0){phase = 1;}
    document.getElementById("illumination").innerHTML = outputIllumination(phase).toFixed(0)+"%";
    var sky = outputIllumination(phase);
    var a = 170;
    var backgroundColor = "rgb("+Math.floor(a-a*sky/100)+", "+Math.floor(g-g*sky/100)+", "+Math.floor(b-b*sky/100)+")";
    document.body.style.background = backgroundColor;
    console.log(backgroundColor);
});
document.addEventListener('keyup', (e) => {
    if(e.code === "Enter"){score();}
});

function outputIllumination(phase){
    return (-2*Math.abs(phase-0.5)+1)*100;
}

var phases = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Third Quarter",
    "Waning Crescent"
];

var colors = [
    "#66FF00",
    "#FFF000",
    "#08E8DE",
    "#FF007F"
];

var target;
var levelWon = false;
var newLevel = false;
var wrongCount = 0;
var winPercent = 0;
var tries = 0;

function generateTarget(){
    var min = 0;
    var max = phases.length-1;
    target = Math.floor(Math.random()*(max-min+1)+min);
    document.getElementById("target").innerHTML = phases[target];
    console.log("I did it");
    newLevel = true;
    tries = 0;
}

generateTarget();

function score(){
    tries++;
    var currentTarget = target;
    var currentPhase =phase.toFixed(5);
    document.getElementById("points").innerHTML = points + " points";
    //ranges of phases are 0 through 1.  Full moon is .5 New Moon is 0 and 1.  First quarter is 0.25 and last quarter is 0.75.
    //waxing is from 0 to .5 and waning from .5 to 1
    console.log(currentTarget + " current and " + currentPhase + " current phase and " + phase + " phase");
    if(levelWon==false){
        switch(currentTarget){
            case 0:
                if(currentPhase==0||currentPhase==1){points++; levelWon=true;}
                break
            case 1:
                if(currentPhase<0.25&&currentPhase>0){points++; levelWon=true;}
                break
            case 2:
                if(currentPhase==0.25){points++; levelWon=true;}
                break
            case 3:
                if(currentPhase<0.5&&currentPhase>0.25){points++; levelWon=true;}
                break
            case 4:
                if(currentPhase==0.5){points++; levelWon=true;}
                break
            case 5:
                if(currentPhase>0.5&&currentPhase<0.75){points++; levelWon=true;}
                break
            case 6:
                if(currentPhase==0.75){points++; levelWon=true;}
                break
            case 7:
                if(currentPhase<1&&currentPhase>0.75){points++; levelWon=true;}
                break
            case 8:
                if(currentPhase==0||currentPhase==1){points++; levelWon=true;}
                break
            default:
                break
        }
        if(levelWon==true){
            levelWon = false;
            document.getElementById("mistake").style.color = newColor;
            if(tries<2){document.getElementById("mistake").innerHTML = "Correct! In "+ tries + " try.";}
            else if(tries>=2){document.getElementById("mistake").innerHTML = "Correct! In "+ tries + " tries.";}
            document.querySelectorAll(".button").forEach(item => {item.classList.add("flashcorrect");});
            generateTarget();
        }
        else if(levelWon==false){
            wrongCount++;
            var colorIndex = Math.floor(Math.random()*(colors.length));
            var newColor = colors[colorIndex];
            console.log(colorIndex);
            document.getElementById("mistake").style.color = newColor;
            if(tries<5){document.getElementById("mistake").innerHTML = "WRONG";}
            else if(tries>5&&tries<10){document.getElementById("mistake").innerHTML = "try harder. WRONG";}
            else if(tries>10){document.getElementById("mistake").innerHTML = "wrong.  you can do this.";}
            document.querySelectorAll(".button").forEach(item => {item.classList.add("flashwrong");});
        }
        document.getElementById("points").innerHTML = points + " points";
        winPercent = points/(points+wrongCount) * 100;
        document.getElementById("winPercent").innerHTML = winPercent.toFixed(1) + "% W/L";
    }
}

document.addEventListener("DOMContentLoaded", addListenForClear);
function addListenForClear(){
    var button = document.getElementById("submit");
    var clearIt = function() {
       button.classList.remove("flashwrong");
       button.classList.remove("flashcorrect");
    };
    button.addEventListener("animationend",clearIt);
    console.log("they were made.");
}