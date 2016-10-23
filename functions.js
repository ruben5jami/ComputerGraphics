var shape;
var points = [];
var num_curve;
var num_poly;
var pt = 1; //thickness
var color = '1A1CD9';



jQuery( document ).ready(function($) {
    $( ".jscolor" ).change(function() { //if color is changed
        color = $("#mycolor").val();
    });
    $("input[name=shape]:radio").change(function (){    //if shape is changed
        shape = $("input[name=shape]:checked").val();
        points = [];

    });
    $(".thick").change(function(){  //if stroke is changed
       pt = $("#thickness").val();

    });

    $("#num_poly").hide();
    $("#num_curve").hide();

    $("#line").change(function(){
        $("#num_poly").hide();
        $("#num_curve").hide();
    });
    $("#circle").change(function(){
        $("#num_poly").hide();
        $("#num_curve").hide();
    });
    $("#curve").change(function(){
        $("#num_poly").hide();
        $("#num_curve").show();
    });
    $("#polygon").change(function(){
        $("#num_poly").show();
        $("#num_curve").hide();
    });

    // Instance the tour
    var tour = new Tour({
        debug: true,
        storage: false,
        steps: [
            {
                element: "#thickness",
                title: "Stroke",
                content: "choose the width of your shape",
                placement: "left"
            },
            {
                element: "#mycolor",
                title: "Color Pallet",
                content: "Choose your shape color",
                placement: "bottom"
            },
            {
                element: "#my_line",
                title: "Line",
                content: "Choose line and draw using 2 dots",
                placement: "bottom"
            },
            {
                element: "#my_circle",
                title: "Circle",
                content: "first pick will be the circle center, second will be on the circle perimeter",
                placement: "bottom"

            },
            {
                element: "#my_curve",
                title: "Curve",
                content: "when you click a number will appear, choose the curve accuracy",
                placement: "bottom"
            },
            {
                element: "#my_polygon",
                title: "Polygon",
                content: "when you click a number will appear, choose the number of sides to you polygon",
                placement: "right"

            },
            {
                element: "#clearbtn",
                title: "Clear",
                content: "Clear the entire canvas",
                placement: "left"
            },
        ]});

    if (tour.ended()) {
        tour.restart();
    } else {
        tour.init();
        tour.start();
    }
});




//get the position in the canvas
document.addEventListener("DOMContentLoaded", init, false);
function init() {
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("mousedown", getPosition, false);
}

function getPosition(event) {
    var x;
    var y;
    var canvas = document.getElementById("canvas");
    x = event.x;    //get x position from user
    y = event.y;    //get y position from user
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    points.push({x:x,y:y}); //push to the points array
    //drawCircle(x, y, x+2, y+2); //feedback points

    if((points.length == 2) && (shape == "line")){
        drawLine(points[0].x,points[1].x, points[0].y,points[1].y);
        points = [];
    }
    else if((points.length == 2) && (shape == "circle")){
        drawCircle(points[0].x, points[0].y, points[1].x, points[1].y);
        points = [];
    }
    else if((points.length == 2) && (shape == "polygon")){
        var e = document.getElementById("num_poly");
        num_poly = e.options[e.selectedIndex].value;
        drawPolygon(points[0], points[1]);
        points = [];
    }
    else if((points.length == 4) && (shape == "curve")){
        var e = document.getElementById("num_curve");
        num_curve = e.options[e.selectedIndex].value;

        drawCurve(points[0].x, points[1].x, points[2].x, points[3].x, points[0].y, points[1].y, points[2].y, points[3].y);
        points = [];
    }
}


function Point(x, y) {
    this.x = x;
    this.y = y;
}

function clearCanvas(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height); //clear the canvas
    points = []; //intialize the array of points
}

function drawLine(x1, x2, y1, y2) {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle="#"+color;
    //get the m
    var dy = Math.abs(y2 - y1);
    var dx = Math.abs(x2 - x1);
    var sx = x1 < x2? 1 : -1;
    var sy = y1 < y2? 1 : -1;
    if (dx >= dy) {
        var p = 2 * dy - dx;
        while (x1 != x2) {
            ctx.fillRect(x1, y1, pt, pt);   //draw dots all along the line
            if (p > 0) {
                y1 += sy;
                p -= 2 * dx;
            }
            x1 += sx;
            p += 2 * dy;
        }
    }
    else if (dy > dx) {
        var p = 2 * dx - dy;
        while (y1 != y2) {
            ctx.fillRect(x1, y1,pt,pt);
            if (p > 0) {
                x1 += sx;
                p -= 2 * dy;
            }
            y1 += sy;
            p += 2 * dx;
        }
    }
}

function drawCircle(xCenter, yCenter, xRadius, yRadius){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle="#"+color;
    var r = Math.sqrt((Math.pow((xCenter-xRadius),2) + Math.pow((yCenter-yRadius),2))); //distance formula
    var x = 0;
    var p = 3-2*r;
    while (x<r) {
        //for all the quarters
        ctx.fillRect(xCenter+x, yCenter+r, pt, pt);
        ctx.fillRect(xCenter-x, yCenter+r, pt, pt);
        ctx.fillRect(xCenter+x, yCenter-r, pt, pt);
        ctx.fillRect(xCenter-x, yCenter-r, pt, pt);
        ctx.fillRect(xCenter+r, yCenter+x, pt, pt);
        ctx.fillRect(xCenter-r, yCenter+x, pt, pt);
        ctx.fillRect(xCenter+r, yCenter-x, pt, pt);
        ctx.fillRect(xCenter-r, yCenter-x, pt, pt);
        if (p < 0) {
            p = p+(4*x)+6;
        }
        else {
            p = p+4*(x-r)+10;
            r--;
        }
        x++;
    }
}

function drawPolygon(pc,  pr){
    var teta = 2 * Math.PI / num_poly;
    var points = [];
    for (var i = 0, tempTeta = teta; i < num_poly; i++, tempTeta += teta) {
        var point = rotate(pc, pr, tempTeta);
        points.push(point);
    }
    for (var i = 0, l = points.length - 1; i < l; i++) {
        drawLine(Math.round(points[i].x), Math.round(points[i + 1].x), Math.round(points[i].y), Math.round(points[i + 1].y));
    }
    drawLine(Math.round(points[i].x), Math.round(points[0].x), Math.round(points[i].y), Math.round(points[0].y));

}



function drawCurve(x1, x2, x3, x4, y1, y2, y3, y4) {
    console.log("drawing curve");
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#" + color;
    var Mb = [[-1,3,-3,1],[3,-6,3,0],[-3,3,0,0],[1,0,0,0]];
    var Px = [x1, x2, x3, x4];
    var Py = [y1, y2, y3, y4];
    var xParams = matrixMultiply(Mb, Px);
    var yParams = matrixMultiply(Mb, Py);
    var lastX = 0;
    var lastY = 0;
    var xt, yt;
    var step = parseFloat(1 / parseFloat(num_curve));
    for (var t = 0;t <= 1; t += step){
        if (t == 0) { //the first point
            lastX = x1;
            lastY = y1;
            xt = parseInt((xParams[0] * Math.pow(t, 3) + xParams[1] * Math.pow(t, 2) + xParams[2] * t + xParams[3]));
            yt = parseInt((yParams[0] * Math.pow(t, 3) + yParams[1] * Math.pow(t, 2) + yParams[2] * t + yParams[3]));
            drawLine(lastX, xt, lastY, yt);
        }
        else if (t == 1) {//draw the last point
            xt = x4;
            yt = y4;
            drawLine(lastX, xt, lastY, yt);
        }
        else {
            xt = parseInt((xParams[0] * Math.pow(t, 3) + xParams[1] * Math.pow(t, 2) + xParams[2] * t + xParams[3]));
            yt = parseInt((yParams[0] * Math.pow(t, 3) + yParams[1] * Math.pow(t, 2) + yParams[2] * t + yParams[3]));
            drawLine(lastX, xt, lastY, yt);
            lastX = xt;
            lastY = yt;
        }
    }
    drawLine(lastX, x4, lastY, y4);

}

function matrixMultiply(mb, px) {
    var result = [0,0,0,0];
    for (var i=0;i<mb.length;i++) {
        for (var j=0;j<px.length;j++) {
            result[i] += mb[i][j]*px[j];
        }
    }
    return result;
}


function rotate(pc, pr, t) {
    var R = [[Math.cos(t), Math.sin(t), 0], [-Math.sin(t), Math.cos(t), 0], [0, 0, 1]];
    pc.x = -pc.x;
    pc.y = -pc.y;
    var p = this.translate(pr , pc);
    pc.x = -pc.x;
    pc.y = -pc.y;
    var result = numeric.dot([p.x, p.y, 1], R);
    p = this.translate(new Point(result[0], result[1]), pc);
    return p;
}

function translate (p, pt) {
    var T = [[1, 0, 0], [0, 1, 0], [pt.x, pt.y, 1]];
    var result = numeric.dot([p.x, p.y, 1], T);
    return  new Point(result[0], result[1]);
}






