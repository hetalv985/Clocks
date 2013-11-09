/*
 * The MIT License (MIT)

Copyright (c) 2013 Hetal Vora

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * 
Created by: Hetal Vora
Date: 11/06/2013
Description: This Javascript file contains methods to draw an analog clock
or a digital clock onto an HTML5 canvas.
*/

var canvas = null;
var context = null;
var analogTimer = null;
var digitalTimer = null;
var currentDate = null;
var hourHandLength = 70;
var minuteHandLength = 100;
var secondsHandLength = 100;
var centerX = 150, centerY = 150;
var incrementAngleHour = Math.PI / 6;
var incrementAngleMinute = Math.PI/30;
var incrementAngleSeconds = Math.PI/30;


/* define positions for LED segments for a digital clock. The arrays represent 
 * [x1,y1,x2,y2] where (x1,y1) is the start position of the segment and (x2,y2)
 * is the end position */
var ledHr1 = {
    "seg1": [100, 110, 115, 110],
    "seg2": [115, 112, 115, 150],
    "seg3": [115, 152, 115, 188],
    "seg4": [100, 190, 115, 190],
    "seg5": [100, 152, 100, 188],
    "seg6": [100, 112, 100, 150],
    "seg7": [100, 150, 115, 150]
};
var ledHr2 = {
    "seg1": [125, 110, 140, 110],
    "seg2": [140, 112, 140, 150],
    "seg3": [140, 152, 140, 188],
    "seg4": [125, 190, 140, 190],
    "seg5": [125, 152, 125, 188],
    "seg6": [125, 112, 125, 150],
    "seg7": [125, 150, 140, 150]
};

var ledMin1 = {
    "seg1": [160, 110, 175, 110],
    "seg2": [175, 112, 175, 150],
    "seg3": [175, 152, 175, 188],
    "seg4": [160, 190, 175, 190],
    "seg5": [160, 152, 160, 188],
    "seg6": [160, 112, 160, 150],
    "seg7": [160, 150, 175, 150]
};
var ledMin2 = {
    "seg1": [185, 110, 200, 110],
    "seg2": [200, 112, 200, 150],
    "seg3": [200, 152, 200, 188],
    "seg4": [185, 190, 200, 190],
    "seg5": [185, 152, 185, 188],
    "seg6": [185, 112, 185, 150],
    "seg7": [185, 150, 200, 150]
};

/* define a map to identify the segments to be drawn for a digit to be displayed
in a digital clock. */
var map = {
    "draw0": [1, 2, 3, 4, 5, 6],
    "draw1": [2, 3],
    "draw2": [1, 2, 7, 5, 4],
    "draw3": [1, 2, 7, 3, 4],
    "draw4": [6, 7, 2, 3],
    "draw5": [1, 6, 7, 3, 4],
    "draw6": [1, 6, 5, 4, 3, 7],
    "draw7": [1, 2, 3],
    "draw8": [1, 2, 3, 4, 5, 6, 7],
    "draw9": [7, 6, 1, 2, 3, 4]
};

/* this function initializes the canvas and the context */
function initializeCanvasAndContext(){
    if (!canvas) {
        canvas = document.getElementById("mycanvas");
    }
    if (context) {
        context.clearRect(0, 0, 300, 300);
    }
    else {
        context = canvas.getContext("2d");
    }
}

/* this function is called to begin drawing an analog clock and to clear context
 * and redraw the clock elements every second. */
function drawAnalogClock() {
    initializeCanvasAndContext();
    document.getElementById("analogButton").disabled = true;
    document.getElementById("digitalButton").disabled = false;

    if(digitalTimer){
        window.clearInterval(digitalTimer);
    }
    analogTimer = window.setInterval(function() {
        if (context)
            context.clearRect(0, 0, 300, 300);
        drawAnalogClockBody();
        drawSecondHand();
        drawMinuteHand();
        drawHourHand();
    }, 1000);

}

/* this function draws the analog clock body, background gradient and the digits.
 *  */
function drawAnalogClockBody() {
    context.beginPath();
    context.arc(centerX, centerY, 125, 0, 2 * Math.PI, false);
    context.lineWidth = 8;
    context.closePath();
    var grd = context.createRadialGradient(75, 50, 5, 90, 60, 100);
    grd.addColorStop(0, "gray");
    grd.addColorStop(1, "black");
    context.fillStyle = grd;
    context.fill();
    context.stroke();
    context.save();
    context.fillStyle = 'red';
    context.font = "20px Calibri";
    context.fillText("12", 140, 45);
    context.fillText("3", 255, 155);
    context.fillText("6", 150, 265);
    context.fillText("9", 35, 155);
    context.restore();
}

/* this function draws the hour hand of the analog clock */
function drawHourHand() {
   currentDate = new Date();
    var hour = currentDate.getHours() % 12;

    var min = Math.floor(currentDate.getMinutes() / 12);

    var r_end_angle = hour * incrementAngleHour + (3 * Math.PI / 2) + (Math.PI / 30 * min);

    var endx = centerX + Math.cos(r_end_angle) * hourHandLength;
    var endy = centerY + Math.sin(r_end_angle) * hourHandLength;

    context.save();
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(endx, endy);
    context.closePath();
    context.lineWidth = 4;
    context.strokeStyle = 'white';
    context.stroke();
    context.restore();

}

/* this function draws the minute hand of the analog clock */
function drawMinuteHand() {
    currentDate = new Date();
    var min = currentDate.getMinutes() % 60;

    var r_end_angle = min * incrementAngleMinute + (3 * Math.PI / 2);

    var endx = centerX + Math.cos(r_end_angle) * minuteHandLength;
    var endy = centerY + Math.sin(r_end_angle) * minuteHandLength;

    context.save();
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(endx, endy);
    context.closePath();
    context.lineWidth = 4;
    context.strokeStyle = 'white';
    context.stroke();
    context.restore();
}

/* this function draws the seconds hand of the analog clock */
function drawSecondHand() {
    currentDate = new Date();
    var sec = currentDate.getSeconds() % 60;
    
    var r_end_angle = sec * incrementAngleSeconds + (3 * Math.PI / 2);

    var endx = centerX + Math.cos(r_end_angle) * secondsHandLength;
    var endy = centerY + Math.sin(r_end_angle) * secondsHandLength;

    context.save();
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(endx, endy);
    context.lineWidth = 2;
    context.strokeStyle = '#DDDDDD';
    context.closePath();
    context.stroke();
    context.beginPath();
    context.arc(centerX, centerY, 5, 0, 2 * Math.PI, false);
    context.closePath();
    context.fillStyle = "white";
    context.fill();
    context.restore();

}

/* this function is called to begin drawing a digital clock and to clear context
 * and redraw the clock elements every second. */
function drawDigitalClock() {
    initializeCanvasAndContext();
    
    document.getElementById("analogButton").disabled = false;
    document.getElementById("digitalButton").disabled = true;
    
    if(analogTimer){
        window.clearInterval(analogTimer);
    }
    digitalTimer = window.setInterval(function() {
        if (context)
            context.clearRect(0, 0, 300, 300);
        drawDigitalClockBody();
        drawSecondsBlinker();
        drawMinutes();
        drawHours();

    }, 1000);
}

/* this function draws the digital clock body and the background gradient. */
function drawDigitalClockBody() {
    context.beginPath();
    context.arc(100, 150, 50, Math.PI, 3 * Math.PI / 2, false);
    context.lineTo(200, 100);
    context.arc(200, 150, 50, 3 * Math.PI / 2, 0, false);
    context.arc(200, 150, 50, 0, Math.PI / 2, false);
    context.lineTo(100, 200);
    context.arc(100, 150, 50, Math.PI / 2, Math.PI, false);
    context.closePath();
    context.lineWidth = 8;
    var grd = context.createLinearGradient(0, 0, 150, 0);
    grd.addColorStop(0, "gray");
    grd.addColorStop(1, "black");
    context.fillStyle = grd;
    context.fill();
    context.stroke();

}

/* this function draws the seconds dots that blink in the digital clock */
function drawSecondsBlinker() {
    context.save();
    context.fillStyle = '#FF0000';
    context.beginPath();
    context.arc(centerX, centerY-10, 2.5, 0, 2 * Math.PI, false);
    context.arc(centerX, centerY+10, 2.5, 0, 2 * Math.PI, false);
    context.closePath();
    context.fill();
    var timer = window.setInterval(function() {
        context.save();
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(centerX, centerY-10, 2.5, 0, 2 * Math.PI, false);
        context.arc(centerX, centerY+10, 2.5, 0, 2 * Math.PI, false);
        context.closePath();
        context.fill();
        context.restore();
        window.clearInterval(timer);
    }, 500);
    context.restore();

}

/* this function gets the minutes and calls calculateAndDrawDigits() to draw 
 * them*/
function drawMinutes() {
    currentDate = new Date();
    var mins = currentDate.getMinutes();
    calculateAndDrawDigits(mins, "MINS");
}

/* this function gets the hours and calls calculateAndDrawDigits() to draw them 
 * */
function drawHours() {
    currentDate = new Date();
    var hour = currentDate.getHours();
    calculateAndDrawDigits(hour,"HOURS");
}

/* calculates the digits to be drawn in the digital clock
 * and calls the drawDigits() function to draw them */
function calculateAndDrawDigits(val, denomination){
    if (val === 0) {
        drawDigits(0, denomination, 0);
        drawDigits(1, denomination, 0);
    }
    else if (val <= 9) {
        drawDigits(0, denomination, 0);
        drawDigits(1, denomination, val);
    }
    else {
        drawDigits(0, denomination, Math.floor(val / 10));
        drawDigits(1, denomination, val % 10);

    }
}

/* this function draws the digits inside the digital clock using the LED segment 
 * positions and map for each digit */
function drawDigits(position, denomination, val) {
    var pointsmap = null;
    if (position === 0) {
        if (denomination === "HOURS") {
            pointsmap = ledHr1;
        }
        else {
            pointsmap = ledMin1;
        }
    }
    else {
        if (denomination === "HOURS") {
            pointsmap = ledHr2;
        }
        else {
            pointsmap = ledMin2;
        }
    }

    var usemap = eval("map.draw" + val);

    context.save();
    context.lineWidth = 6;
    for (var i = 0; i < usemap.length; i++) {
        var ledNum = usemap[i];
        var points = eval("pointsmap.seg" + ledNum);
        var xAdjustTip = 0;
        var yAdjustTip = 0;
        if(ledNum === 1|| ledNum === 4 || ledNum === 7){
            //horizontal segments
            xAdjustTip = 3;
            yAdjustTip = 0;
        }
        else{
            //vertical segments
            xAdjustTip = 0;
            yAdjustTip = 3;
        }
        
        context.beginPath();
        context.moveTo(points[0], points[1]);
        context.lineTo(points[0]-yAdjustTip+xAdjustTip,points[1]+yAdjustTip-xAdjustTip);
        context.lineTo(points[0]+yAdjustTip+xAdjustTip,points[1]+yAdjustTip+xAdjustTip);
        context.closePath();
        context.fillStyle = 'red';
        context.fill();
        context.beginPath();
        context.moveTo(points[0]+xAdjustTip, points[1]+yAdjustTip);
        context.lineTo(points[2]-xAdjustTip, points[3]-yAdjustTip);
        context.closePath();
        context.shadowColor = 'red';
        context.strokeStyle = '#FF0000';
        context.stroke();
        context.beginPath();
        context.moveTo(points[2], points[3]);
        context.lineTo(points[2]+yAdjustTip-xAdjustTip,points[3]-yAdjustTip+xAdjustTip);
        context.lineTo(points[2]-yAdjustTip-xAdjustTip, points[3]-yAdjustTip-xAdjustTip);
        context.closePath();
        context.fill();

    }
    context.restore();

}