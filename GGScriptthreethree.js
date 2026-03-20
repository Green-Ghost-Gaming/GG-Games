// GGScript.js --- Started 12/10/2018

// A library built to emulate the version of Processing JS seen on Khan Academy, without the restrictions.

// This also adds new functions that can take you to the next level with your game design.

// Alpha -- Very basic functions commonly useful to my game design.

// 1.0 -- Added more functions that I use when I make games.

// 1.1 -- Added better color functions.

// 2.0 -- Added better pixel manipulation and image usage.

// 3.0 -- Added my own drawing functions and the mouseDragged event, worked on colors some more.

// 3.1 -- Added rectMode + point + bezierPoint + bezierTangent

// 3.2 -- Added a randomBool function (chooses one of two given options), and updated the HSB color mode

// 3.3 -- Added imageMode and loadPixels/updatePixels as well as the tanent function (for calculating in degrees).

// Get the body element.
var body = document.body;
body.oncontextmenu = function() {
	return false;
}
function enableContextMenu() {
	body.oncontextmenu = function() {
		return true;
	};
}

// Gets the canvas element and allows the user to draw on the canvas.
var canvas = document.getElementById("canvas");
//canvas.width = window.innerWidth; // Sets the canvas width to window width
var ctx = canvas.getContext("2d", { willReadFrequently: true, desynchronized : true});

// Variables hold the width and height of the canvas.
var width = canvas.width;
var height = canvas.height;

// Controls whether to draw the stroke or fill
var isStroke = true;
var isFill = true;

// A draw function for animation.
function draw() {}

// A keyPressed function for key events.
function keyPressed() {}

// A keyReleased function for key events.
function keyReleased() {}

// A mouseClicked function for when the user clicks.
function mouseClicked() {}

// A mouseDragged function for when the user clicks and drags.
function mouseDragged() {}

// If the mouse is pressed.
var mouseIsPressed;

// The frameRate variable controls animation speed.
var frameRate = 60;

// Counts frames.
var frameCount = 0;

// Positions of the mouse.
var mouseX = width / 2, mouseY = height / 2;
var pmouseX = width / 2, pmouseY = height / 2;
var mouseButton;

// A keyCode variable.
var keyCode;

// Key code variables.
var LEFT = 37,
	RIGHT = 39,
	UP = 38,
	DOWN = 40;
	
// Alignment variables.
var TOP = 0,
	CENTER = 1,
	BOTTOM = 2,
	BASELINE = 3,
	CORNER = 4;
	
var SQUARE = "butt";
var ROUND = "round";
var PROJECT = "square";
var MITER = "miter";
var BEVEL = "bevel";

var cMode = "rgb";
var rctMode = CORNER;
var imgMode = CORNER;
var RGB = "rgb";
var HSB = "hsb";
var HSL = "hsl";
	
// Aligment objects.
var alignmentX = {
	37 : "left",
	1 : "center",
	39 : "right",
};
var alignmentY = {
	0 : "top",
	1 : "middle",
	2 : "bottom",
	3 : "baseline"
};

// Holds current text size.
var txtSize = 20, ext = "", txtLead = 1;

var mainFont = "sans-serif";

// Pixel manipulation
var imageData;

/* Makes functions similar to the Processing JS functions. */
// Returns a random number in a certain range.
function random(min, max) {
	if (arguments.length < 1) {
		return Math.random();
	}
	if (arguments.length < 2) {
		return Math.random() * min;
	}
	return min + Math.random() * (max - min);
}

// Return either val1 or val2.
function randBool (val1, val2) {
	return Math.floor(random(2)) === 0 ? val1 : val2;
}

// Returns a number from a certain range.
function lerp(num1, num2, amount) {
	return num1 + (num2 - num1) * amount;
}

// Maps a number from one range to another.
function map(num, start1, stop1, start2, stop2) {
	return start2 + (num - start1) / (stop1 - start1) * (stop2 - start2);
}

// constrains a number to a certain range.
function constrain(num, min, max) {
	return Math.max(Math.min(num, max), min);
}

// Finds the distance between two points.
function dist(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

// Makes a color
function color(r, g, b, a) {
	
	// Constrain from 0-255
	if (cMode === "hsb") { // Hue is HSB mode
		r = r % 256; // Larger than 0
		
		while (r < 0) { // Smaller than 0
			r += 256;
		}
	}
	
	if (Math.abs(r) > 255) {
		if (g !== undefined && b === undefined) {
			return color(red(r), green(r), blue(r), g);
		}
		return r;
	}
	a = a === undefined ? 255 : a;
	r = Math.floor(r);
	g = Math.floor(g);
	b = Math.floor(b);
	if (arguments.length === 0) {
		r = 0;
		g = 0;
		b = 0;
	} else if (arguments.length === 1 || arguments.length === 2) {
		g = r;
		b = r;
	}
	if (arguments.length === 2) {
		a = g;
	}
	
	for (var i = 0; i < arguments.length; i++) {
		arguments[i] = constrain(arguments[i], 0, 255);
	}
	
	return a << 24 | r << 16 | g << 8 | b;
}

// Changes the color mode, can be RGB or HSB.
function colorMode(mode) {
	cMode = mode;
}

// Returns the red value of a color.
function red(color) {
	return (color >> 16) & 0xFF;
}

// Returns the green value of a color.
function green(color) {
	return (color >> 8) & 0xFF;
}

// Returns the blue value of a color.
function blue(color) {
	return color & 0xFF;
}

// Returns the opactiy of a color.
function alpha(color) {
	return (color >> 24) & 0xFF;
}

// Returns a string value color.
function getUsableColor(c) {
	if (typeof c === "string") {
		return getColor(c);
	} else if (typeof c === "number") {
		if (red(c) < 0) {
			return getColor(color(c));
		}
	}
	return c;
}

// Return a color inbetween two colors.
function lerpColor(c1, c2, amount) {
	c1 = getUsableColor(c1);
	c2 = getUsableColor(c2);
	return color(
		lerp(red(c1), red(c2), amount),
		lerp(green(c1), green(c2), amount),
		lerp(blue(c1), blue(c2), amount),
		lerp(alpha(c1), alpha(c2), amount)
	);
}

// Used for getting a color from a color object.
function getColor(n1, n2, n3, n4) {
	if (n1 === undefined) {
		n1 = 0;
		n2 = 0;
		n3 = 0;
		n4 = 1;
	} else if (n2 === undefined) {
		if (n1.isGrad) {
			return n1.grad;
		}
		if (n1 < 0 || Math.abs(n1) > 255) {
			let c = n1;
			n1 = red(c) || 0;
			n2 = green(c) || 0;
			n3 = blue(c) || 0;
			n4 = (alpha(c) / 255) || 1;
		} else {
			n2 = n1;
			n3 = n1;
			n4 = 1;
		}
	} else if (n3 === undefined) {
		if (n1 < 0 || Math.abs(n1) > 255) {
			let c = n1;
			n4 = n2 / 255;
			n1 = red(c);
			n2 = green(c);
			n3 = blue(c);
		} else {
			n2 = n1;
			n3 = n1;
			n4 = n2 / 255;
		}
	} else if (n4 === undefined) {
		n4 = 1;
	} else {
		n4 /= 255;
	}
	if (cMode === "hsb" || cMode === "hsl") {
		
		// HSL (lightness instead of brightness) is different than HSB in that L > 50% is the same is lowering the saturation.
		// So to convert HSL to HSB, you have to change the L based on the S (50%).
		
		// H - 0 to 360
		// S - 0% - 100% ('%' symbol is important)
		// L - 0% - 100% but we only want to go to 50% when the saturation is full ('%' symbol is also important here)
		
		// https://stackoverflow.com/questions/3423214/convert-hsb-hsv-color-to-hsl
		// stack overflow solution: vvv
		
		n2 /= 255;
		n3 /= 255;
		
		if (cMode === "hsb") {
			var l = (2 - n2) * n3 / 2;
			
			if (l !== 0) {
				if (l === 1) {
					n2 = 0;
				} else if (l < 0.5) {
					n2 = n2 * n3 / (l * 2);
				} else {
					n2 = n2 * n3 / (2 - l * 2);
				}
			}
			
			n3 = l;
		}
		
		
		n1 = n1 / 255 * 360; // Map hue from 0-255 to 0-360
		n2 *= 100; // Map saturation to 0-100
		n3 *= 100; // Map brightness to 0-100
		
		// My attempts v
		// n3 += (100 - n3) * (100 - n2) / 100 * n3 / 100;
		// n3 += (50 - n2 / 2) * n3 / 50;
		
		return "HSLA(" + n1 + ", " + n2 + "%, " + n3 + "%, " + n4 + ")";
	}
	return "rgba(" + n1 + ", " + n2 + ", " + n3 + ", " + n4 + ")";
}

// Sets fill color.
function fill(r, g, b, aVal) {
	isFill = true;
	ctx.fillStyle = getColor(r, g, b, aVal);
}

// Sets stroke color.
function stroke(r, g, b, aVal) {
	isStroke = true;
	ctx.strokeStyle = getColor(r, g, b, aVal);
}

// Gets rid of stroke.
function noStroke() {
	isStroke = false;
}

// Gets rid of fill.
function noFill() {
	isFill = false;
}


// Convert degrees to radians and vice-versa
function toRad(deg) {
	return deg / 180 * Math.PI;
}

function toDeg(rad) {
	return rad / Math.PI * 180;
}

// A sine function that converts from radians to degrees.
function sin(angle) {
	return Math.sin(angle / 180 * Math.PI);
}

// A cosine function that converts from radians to degrees.
function cos(angle) {
	return Math.cos(angle / 180 * Math.PI);
}

 // A tangent function that converts from radians to degrees.
function tan(angle) {
	return Math.tan(angle / 180 * Math.PI);
}

// An atan2 function.
function atan2(x, y) {
	return Math.atan2(x, y) / Math.PI * 180;
}

// Translates to a certain point.
function translate(x, y) {
	ctx.translate(x, y);
}

// Scales the drawing.
function scale(w, h) {
	if (h === undefined) {
		ctx.scale(w, w);
		return;
	}
	ctx.scale(w, h);
}

// Rotates the drawing.
function rotate(angle) {
	ctx.rotate(angle / 180 * Math.PI)
}

// Starts transformation.
function pushMatrix() {
	ctx.save();
}

// Finishes transformation.
function popMatrix() {
	ctx.restore();
}

// Sets the width of lines.
function strokeWeight(width) {
	ctx.lineWidth = width;
}

// Starts a complex shape.
function beginShape() {
	ctx.beginPath();
}

// Closes a complex shape.
function endShape() {
	if (isFill) {
		ctx.fill();
	}
	if (isStroke) {
		ctx.stroke();
	}
}

// Sets the position of the path.
function setPath(x, y) {
	ctx.moveTo(x, y);
}

// Draws a vertex for a complex shape.
function vertex(x, y) {
	ctx.lineTo(x, y);
}

// Draws a curve vertex for a complex shape.
function curveVertex(cx, cy, x, y) {
	ctx.quadraticCurveTo(cx, cy, x, y);
}

// Draws a bezier vertex for a complex shape.
function bezierVertex(cx1, cy1, cx2, cy2, x, y) {
	ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
}

// Find derivative of a bezier, courtesy of: https://Math.stackexchange.com/questions/477165/find-angle-at-point-on-bezier-curve
function bezD (p1, cp1, cp2, p2, t) {
	return Math.pow(1 - t, 2) * (cp1 - p1) + 2 * t * (1 - t) * (cp2 - cp1) + Math.pow(t, 2) * (p2 - cp2);
}

function bezierPoint (p1, cp1, cp2, p2, t) {
	return Math.pow(1 - t, 3) * p1 + 3 * t * Math.pow(1 - t, 2) * cp1 + 3 * Math.pow(t, 2) * (1 - t) * cp2 + Math.pow(t, 3) * p2;
}

function bezierTangent (x1, y1, cx1, cy1, cx2, cy2, x2, y2, t) {
	var x = bezD(x1, cx1, cx2, x2, t);
	var y = bezD(y1, cy1, cy2, y2, t);
	return atan2(y, x) + 90;
}

// Draws a curve.
function curve(x1, y1, cx, cy, x2, y2) {
	beginShape();
	setPath(x1, y1);
	curveVertex(cx, cy, x2, y2);
	endShape();
}

// Draws a bezier.
function bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
	beginShape();
	setPath(x1, y1);
	bezierVertex(cx1, cy1, cx2, cy2, x2, y2);
	endShape();
}

// Draws a line.
function line(x1, y1, x2, y2) {
	beginShape();
	vertex(x1, y1);
	vertex(x2, y2);
	endShape();
}

// Draws an point.
function point(x, y) {
	let prev = ctx.fillStyle;
	var wasStroke;
	if (isStroke) {
		wasStroke = true;
		isStroke = false;
	}
	ctx.fillStyle = ctx.strokeStyle;
	beginShape();
	ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
	endShape();
	fill(prev);
	if (wasStroke) {
		isStroke = true;
	}
}

// Draws a rectangle.
function rect(x, y, w, h, r, r2, r3, r4) {
	r = r || 0;
	r = constrain(r, -Math.min(w, h) / 2, Math.min(w, h) / 2);
	if (r2 === undefined || r3 === undefined || r4 === undefined) {
		r2 = r;
		r3 = r;
		r4 = r;
	}
	r2 = constrain(r2, -Math.min(w, h) / 2, Math.min(w, h) / 2);
	r3 = constrain(r3, -Math.min(w, h) / 2, Math.min(w, h) / 2);
	r4 = constrain(r4, -Math.min(w, h) / 2, Math.min(w, h) / 2);
	x -= rctMode === CENTER ? w / 2 : 0;
	y -= rctMode === CENTER ? h / 2 : 0;
	beginShape();
	setPath(x, y + r);
	curveVertex(x, y, x + r, y);
	vertex(x + w - r2, y);
	curveVertex(x + w, y, x + w, y + r2);
	vertex(x + w, y + h - r3);
	curveVertex(x + w, y + h, x + w - r3, y + h);
	vertex(x + r4, y + h);
	curveVertex(x, y + h, x, y + h - r4);
	vertex(x, y + r);
	endShape();
}

// Draws an arc as part of a larger path.
function arcTo(x, y, r, start, stop) {
	ctx.arc(x, y, r / 2, start / 180 * Math.PI, stop / 180 * Math.PI);
}

// Draws an arc.
function arc(x, y, w, h, start, stop) {
	pushMatrix();
	translate(x, y);
	scale(1, h / w);
	beginShape();
	arcTo(0, 0, w, start, stop);
	endShape();
	popMatrix();
}

// Draws an ellipse.
function ellipse(x, y, w, h) {
	w = Math.abs(w);
	h = Math.abs(h);
	arc(x, y, w, h, 0, 360);
}

// Draws a triangle.
function triangle(x1, y1, x2, y2, x3, y3) {
	beginShape();
	vertex(x1, y1);
	vertex(x2, y2);
	vertex(x3, y3);
	vertex(x1, y1);
	endShape();
}

// Draws a quad.
function quad(x1, y1, x2, y2, x3, y3, x4, y4) {
	beginShape();
	vertex(x1, y1);
	vertex(x2, y2);
	vertex(x3, y3);
	vertex(x4, y4);
	vertex(x1, y1);
	endShape();
}

// Fills the background.
function background(r, g, b, a) {
	let prev = ctx.fillStyle;
	var wasStroke;
	if (isStroke) {
		wasStroke = true;
		isStroke = false;
	}
	fill(r, g, b, a);
	ctx.fillRect(0, 0, width, height);
	fill(prev);
	if (wasStroke) {
		isStroke = true;
	}
}

// Sets text font.
function textFont(font, size) {
	ext = "";
	if (font.toLowerCase().match(" small-caps")) {
		font = font.substring(0, font.length - 11);
		ext += "small-caps ";
	}
	if (font.toLowerCase().match(" italic")) {
		font = font.substring(0, font.length - 7);
		ext += "Italic ";
	}
	if (font.toLowerCase().match(" bold")) {
		font = font.substring(0, font.length - 5);
		ext += "Bold ";
	} else if (font.toLowerCase().match(" black")) {
		font = font.substring(0, font.length - 6);
		ext += "Bolder ";
	} else if (font.toLowerCase().match(" thin")) {
		font = font.substring(0, font.length - 5);
		ext += "Lighter ";
	} else if (font.toLowerCase().match(" light")) {
		font = font.substring(0, font.length - 6);
		ext += "Lighter ";
	}
	size = size || txtSize;
	txtSize = size;
	mainFont = font;
	ctx.font = ext + txtSize + "px " + mainFont;
}

// Sets text size.
function textSize(size) {
	txtSize = size || 20;
	ctx.font = ext + txtSize + "px " + mainFont;
}

// Sets text alignment.
function textAlign(align, baseline) {
	ctx.textAlign = alignmentX[align];
	ctx.textBaseline = alignmentY[baseline];
}

// Draws text.
function text(txt, x, y) {
	if (typeof txt !== "string") {
		txt = txt.toString();
	}
	var txtList = [""];
	for (var i = 0; i < txt.length; i++) {
		if (txt.charAt(i) === "\n") {
			txtList.push("");
		} else {
			txtList[txtList.length - 1] += txt.charAt(i);
		}
	}
	for (var i = 0; i < txtList.length; i++) {
		if (isFill) {
			ctx.fillText(txtList[i], x, y - txtList.length * txtSize * txtLead / 2 + (i + 0.5) * txtSize * txtLead);
		}
		if (isStroke) {
			ctx.strokeText(txtList[i], x, y - txtList.length * txtSize * txtLead / 2 + (i + 0.5) * txtSize * txtLead);
		}
	}
}

// Changes txtLead variable.
function textLeading(amount) {
	txtLead = amount / 10;
}

// Changes the cursor.
function cursor(name) {
	document.body.style.cursor = name;
}

// Changes the a line's cap.
function strokeCap(cap) {
	ctx.lineCap = cap;
}

// Changes the joining mode between line segments.
function strokeJoin(mode) {
	ctx.lineJoin = mode;
}

// Changes how a rectangle is aligned.
function rectMode(mode) {
	rctMode = mode;
}

// Creates a gradient.
function createGradient(x1, y1, x2, y2) {
	return {isGrad: true, grad: ctx.createLinearGradient(x1, y1, x2, y2)};
}

// Creates a radial gradient.
function createRadGradient(x1, y1, r1, x2, y2, r2) {
	return {isGrad: true, grad: ctx.createRadialGradient(x1, y1, r1, x2, y2, r2)};
}

// Adds a color to a gradient.
function addColor(gradient, amount, color) {
	gradient.grad.addColorStop(amount, getColor(color));
}

// My own function to create images.
function getImage(shapes, width, height) {
	let canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	canvas.display = "none";
	
	let prevContext = ctx;
	ctx = canvas.getContext("2d", { willReadFrequently: true });
	
	shapes();
	
	ctx = prevContext;
	
	return canvas;
}

// mask function "cuts out" one shape from another.
// use popMatrix to reset
function mask() {
	ctx.clip();
}

// Pixel manipulation.
function get(x, y, w, h) {
	return ctx.getImageData(x, y, w, h);
}

function image(img, x, y, dX, dY, w, h) {
	if (img instanceof ImageData) {
		dX = arguments[3] || 0;
		dY = arguments[4] || 0;
		w = arguments[5] || img.width;
		h = arguments[6] || img.height;
		ctx.putImageData(img, x - (imgMode === CENTER ? w * 0.5 : 0), y - (imgMode === CENTER ? h * 0.5 : 0), dX, dY, w, h);
	} else {
		w = arguments[3] || img.width;
		h = arguments[4] || img.height;
		ctx.drawImage(img, x - (imgMode === CENTER ? w * 0.5 : 0), y - (imgMode === CENTER ? h * 0.5 : 0), w, h);
	}
}

function imageMode(mode) {
	imgMode = mode;
}

// Credits for how to manipulate imageData in HTML canvas: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
function loadPixels() {
	imageData = ctx.getImageData(0, 0, width, height);
}

function updatePixels() {
	ctx.putImageData(imageData, 0, 0);
}

loadPixels();

// Get imageData index based on x & y
function getPixel(x, y) {
	return x + y * width << 2;
}

// Replace a pixel's RGB values
function overwritePixel(x, y, c) {
	var p = getPixel(x, y);
	imageData.data[p] = red(c);
	imageData.data[p + 1] = green(c);
	imageData.data[p + 2] = blue(c);
	imageData.data[p + 3] = alpha(c);
}

// Add to a pixel's RGB values
function editPixel(x, y, r, g, b) {
	if (arguments.length < 5) {
		g = r;
		b = r;
	}
	var p = getPixel(x, y);
	imageData.data[p] += r;
	imageData.data[p + 1] += g;
	imageData.data[p + 2] += b;
}

// Basically lerpColor but for an individual pixel
function lerpPixel(x, y, c, l) {
	var p = getPixel(x, y);
	imageData.data[p] = lerp(imageData.data[p], red(c), l);
	imageData.data[p + 1] = lerp(imageData.data[p + 1], green(c), l);
	imageData.data[p + 2] = lerp(imageData.data[p + 2], blue(c), l);
	imageData.data[p + 3] = lerp(imageData.data[p + 3], alpha(c), l);
}

// Shearing courtesy of stackoverflow
// theta = amount of shear (90 = no effect)
// flip changes axis (-1 = x, 1 = y)
// h = change in height, basically just scaling (changes the width if controlling x axis)
function shear (theta, flip, h) {
	theta *= flip;
	rotate(-theta / 2 + map(flip, -1, 1, 90, 0));
	scale(sin(theta / 2), cos(theta / 2));
	rotate(45);
	scale(Math.sqrt(2) / sin(theta), Math.sqrt(2) * h);
	rotate(-map(flip, -1, 1, 90, 0));
}

// Circle inscribed in a quad
function circQuad (x1, y1, x2, y2, x3, y3, x4, y4, lerpAmt) {
	var pts = [
		{x : lerp(x1, x2, 0.5), y : lerp(y1, y2, 0.5)},
		{x : lerp(x2, x3, 0.5), y : lerp(y2, y3, 0.5)},
		{x : lerp(x3, x4, 0.5), y : lerp(y3, y4, 0.5)},
		{x : lerp(x4, x1, 0.5), y : lerp(y4, y1, 0.5)}
	];
	
	beginShape();
	vertex(pts[0].x, pts[0].y);
	bezierVertex(
		lerp(pts[0].x, x2, lerpAmt),
		lerp(pts[0].y, y2, lerpAmt),
		lerp(pts[1].x, x2, lerpAmt),
		lerp(pts[1].y, y2, lerpAmt),
		pts[1].x,
		pts[1].y
	);
	bezierVertex(
		lerp(pts[1].x, x3, lerpAmt),
		lerp(pts[1].y, y3, lerpAmt),
		lerp(pts[2].x, x3, lerpAmt),
		lerp(pts[2].y, y3, lerpAmt),
		pts[2].x,
		pts[2].y
	);
	bezierVertex(
		lerp(pts[2].x, x4, lerpAmt),
		lerp(pts[2].y, y4, lerpAmt),
		lerp(pts[3].x, x4, lerpAmt),
		lerp(pts[3].y, y4, lerpAmt),
		pts[3].x,
		pts[3].y
	);
	bezierVertex(
		lerp(pts[3].x, x1, lerpAmt),
		lerp(pts[3].y, y1, lerpAmt),
		lerp(pts[0].x, x1, lerpAmt),
		lerp(pts[0].y, y1, lerpAmt),
		pts[0].x,
		pts[0].y
	);
	endShape();
}

// Special methods.
Array.prototype.random = function() {
	return this[Math.floor(random(this.length))];
}

Number.prototype.smooth = function(dest, amt) {
	if (amt > 1) {
		amt = 1 / amt;
	}
	return (dest - this) * amt;
}

String.prototype.reverse = function() {
	let ret = "";
	for (var i = this.length - 1; i >= 0; i--) {
		ret += this.charAt(i);
	}
	return ret;
}

// Math stuff
Math.smooth = function(pos, dest, amt) {
	if (amt > 1) {
		amt = 1 / amt;
	}
	return (dest - pos) * amt;
}

Math.equal = function(obj1, obj2) {
	return obj1.x === obj2.x && obj1.y === obj2.y;
}

Math.overRect = function(x, y, w, h) {
	return (mouseX > x && mouseX < x + w) && (mouseY > y && mouseY < y + h);
}

// Interactivity.
// Moves the mouseX and mouseY variables.
document.body.addEventListener("mousemove", function(event) {
	pmouseX = mouseX;
	pmouseY = mouseY;
	mouseX = event.pageX;
	mouseY = event.pageY;
	mouseButton = event.button;
	
	if (mouseIsPressed) {
		mouseDragged();
	}
}, false);

// Moves the mouseX and mouseY variables.
document.body.addEventListener("touchmove", function(event) {
	pmouseX = mouseX;
	pmouseY = mouseY;
	mouseX = event.pageX;
	mouseY = event.pageY;
	mouseButton = event.button;
	
	if (mouseIsPressed) {
		mouseDragged();
	}
}, false);

// Checks for key pressed events.
body.addEventListener("keydown", function(event) {
	event.preventDefault();
	keyCode = event.keyCode;
	keyPressed();
}, false);

// Checks for key released events.
body.addEventListener("keyup", function(event) {
	event.preventDefault();
	keyCode = event.keyCode;
	keyReleased();
}, false);

// Checks for when the mouse is clicked.
body.addEventListener("mousedown", function(event) {
	mouseIsPressed = true;
	mouseButton = event.button;
}, false);

// Checks for when the mouse is clicked.
body.addEventListener("touchstart", function(event) {
	mouseIsPressed = true;
	mouseButton = event.button;
}, false);

// Checks for when the mouse is clicked.
body.addEventListener("mouseup", function(event) {
	mouseClicked();
	mouseIsPressed = false;
	mouseButton = event.button;
}, false);

// Checks for when the mouse is clicked.
body.addEventListener("touchend", function(event) {
	mouseClicked();
	mouseIsPressed = false;
	mouseButton = event.button;
}, false);

// Uses the draw function and frameRate variable.
function intervalId () {
	setTimeout(function() {
		frameCount ++;
		draw();
		intervalId();
	}, 1000 / frameRate);
}

intervalId();
