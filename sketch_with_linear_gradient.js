// The objective of the project is to create an animated drawing with six possible shapes: trapezoid, rectangle, circle, semi-circle, triangle, and teardrop.
// The canvas will accommodate as many shapes as defined by 'maxShapes', each randomly placed within specified margins and rotated.
// The shapes will have random colors and sizes, and will appear flat on the canvas while maintaining a visible thickness to create a 3D effect.
// The shapes will be drawn one at a time, with random placement in the z-space.
// Once all shapes are drawn, they will rotate as a single unit in the z-space.


// maxShapes can be adjusted to increase or decrease the number of shapes drawn on the canvas. The more shapes, the longer the animation will take to complete.
let maxShapes = 45;
let shapes = [];
let currentShapeIndex = 0;
let finalRotationStarted = false;
let finalRotationStartTime;
let shapeFunctions = [drawTrapezoid, drawRectangle, drawCircle, drawSemiCircle, drawTriangle, drawTeardrop];
let margin = 200;

/**
 * Computes a gradient based on the given base color.
 * @param {string} baseColor - The base color for the gradient.
 * @returns {Array} An array containing two color objects representing the gradient.
 */
function computeGradient(baseColor) {
    let c1 = color(baseColor);
    let c2 = lerpColor(c1, color(255, 255, 255), 0.01);  // Lighter version of base color
    return [c1, c2];
}

// Setting up mp4 capture.
let capturer = new CCapture({
    format: 'webm', 
    framerate: 60
  });
  let capturing = false;

  function setup() {
    let canvasAttributes = { antialias: true };
    pixelDensity(2); // Adjust if there are performance issues.
    createCanvas(1080, 1920, WEBGL);
    background(200);
    frameRate(60);
  }


let delayStartTime;
let delayElapsed = 0;

/**
 * The main drawing function that is called continuously by p5.js.
 * It clears the previous frame, applies collective rotation to shapes,
 * adds new shapes, and displays all shapes.
 */
function draw() {
    background(200);  // Clear the previous frame
    
    // Apply the collective rotation if all shapes have been drawn
    if (shapes.length === maxShapes) {
      if (!finalRotationStarted) {
        finalRotationStarted = true;
        delayStartTime = millis();  // Store the start time of the delay
      }

      delayElapsed = millis() - delayStartTime;
      if (delayElapsed > 500) {  // Delay for 0.5 seconds
        if (!finalRotationStartTime) {
          finalRotationStartTime = millis();  // Set the start time for the rotation after the delay
        }
        
        let elapsed = millis() - finalRotationStartTime;
        if (elapsed <= 8500) { // 5.75 seconds for the final rotation
          let progress = map(elapsed, 0, 8500, 0, 1);
          rotateX(PI * 2 * progress);
          rotateZ(-PI * 2 * progress);
        } else {
          rotateX(PI * 2);
          rotateZ(-PI * 2);
          noLoop();  // Stop the loop once the transformation is applied
        }
      }
    }

    // Add a new shape every 0.07 seconds (or every 7 frames)
    if (shapes.length < maxShapes && frameCount % 2 === 0) {
      let shape = createRandomShape();
      shapes.push(shape);
    }
  
    // Display all shapes
    for (let s of shapes) {
      s.display();
    }
    
    if (capturing) {
        capturer.capture(document.getElementById('defaultCanvas0'));
    }
}
  
/**
 * Creates a random shape object.
 * @returns {Object} The randomly generated shape object.
 */
function createRandomShape() {
    let maxSize = 360;  // The maximum possible size for a shape
    let xPosMargin = margin + maxSize/2;  // Adjusted margin for x
    let yPosMargin = margin + maxSize/2;  // Adjusted margin for y

    return {
      display: random(shapeFunctions),
      x: random(-width / 2 + xPosMargin, width / 2 - xPosMargin),
      y: random(-height / 2 + yPosMargin, height / 2 - yPosMargin),
      z: random(-width / 2, width / 2),
      rotation: random(TWO_PI),
      size: random(100, 300),
      color: color(random(255), random(255), random(255)),
      thickness: random(10, 45)
    };
}


/**
 * Draws a trapezoid shape with a linear gradient.
 */
function drawTrapezoid() {
    push();
    let gradientColors = computeGradient(this.color);
fill(lerpColor(gradientColors[0], gradientColors[1], 0.9));
    noStroke();
    translate(this.x, this.y, this.z);
    rotateZ(this.rotation);

    
    // Top face with gradient
    fill(gradientColors[0]);
    beginShape();
    vertex(-this.size, -this.size/2, this.thickness/2);
    vertex(this.size, -this.size/2, this.thickness/2);
    vertex(this.size*0.7, this.size/2, this.thickness/2);
    vertex(-this.size*0.7, this.size/2, this.thickness/2);
    fill(lerpColor(gradientColors[0], gradientColors[1], 0.5));
    endShape(CLOSE);
;

    // Bottom face
    beginShape();
    vertex(-this.size, -this.size/2, -this.thickness/2);
    vertex(this.size, -this.size/2, -this.thickness/2);
    vertex(this.size*0.7, this.size/2, -this.thickness/2);
    vertex(-this.size*0.7, this.size/2, -this.thickness/2);
    endShape(CLOSE);

    // Sides (in grey)
    fill(150);

    beginShape();
    vertex(-this.size, -this.size/2, -this.thickness/2);
    vertex(this.size, -this.size/2, -this.thickness/2);
    vertex(this.size, -this.size/2, this.thickness/2);
    vertex(-this.size, -this.size/2, this.thickness/2);
    endShape(CLOSE);

    beginShape();
    vertex(this.size, -this.size/2, -this.thickness/2);
    vertex(this.size*0.7, this.size/2, -this.thickness/2);
    vertex(this.size*0.7, this.size/2, this.thickness/2);
    vertex(this.size, -this.size/2, this.thickness/2);
    endShape(CLOSE);

    beginShape();
    vertex(-this.size, -this.size/2, -this.thickness/2);
    vertex(-this.size*0.7, this.size/2, -this.thickness/2);
    vertex(-this.size*0.7, this.size/2, this.thickness/2);
    vertex(-this.size, -this.size/2, this.thickness/2);
    endShape(CLOSE);

    beginShape();
    vertex(this.size*0.7, this.size/2, -this.thickness/2);
    vertex(-this.size*0.7, this.size/2, -this.thickness/2);
    vertex(-this.size*0.7, this.size/2, this.thickness/2);
    vertex(this.size*0.7, this.size/2, this.thickness/2);
    endShape(CLOSE);

    pop();
}

  
/**
 * Draws a rectangle with gradient colors and specified dimensions.
 */
function drawRectangle() {
    push();
    let gradientColors = computeGradient(this.color);
fill(lerpColor(gradientColors[0], gradientColors[1], 0.1));
    noStroke();

    translate(this.x, this.y, this.z);
    rotateZ(this.rotation);

    // Top face
    beginShape();
    vertex(-this.size/2, -this.size/2, this.thickness/2);
    vertex(this.size/2, -this.size/2, this.thickness/2);
    vertex(this.size/2, this.size/2, this.thickness/2);
    vertex(-this.size/2, this.size/2, this.thickness/2);
    endShape(CLOSE);

    // Bottom face
    translate(0, 0, -this.thickness);
    beginShape();
    vertex(-this.size/2, -this.size/2, this.thickness/2);
    vertex(this.size/2, -this.size/2, this.thickness/2);
    vertex(this.size/2, this.size/2, this.thickness/2);
    vertex(-this.size/2, this.size/2, this.thickness/2);
    endShape(CLOSE);

    // Sides (in grey)
    fill(150);
    beginShape();
    vertex(-this.size/2, -this.size/2, -this.thickness/2);
    vertex(this.size/2, -this.size/2, -this.thickness/2);
    vertex(this.size/2, -this.size/2, this.thickness/2);
    vertex(-this.size/2, -this.size/2, this.thickness/2);
    endShape(CLOSE);

    beginShape();
    vertex(-this.size/2, this.size/2, -this.thickness/2);
    vertex(this.size/2, this.size/2, -this.thickness/2);
    vertex(this.size/2, this.size/2, this.thickness/2);
    vertex(-this.size/2, this.size/2, this.thickness/2);
    endShape(CLOSE);

    beginShape();
    vertex(-this.size/2, -this.size/2, -this.thickness/2);
    vertex(-this.size/2, this.size/2, -this.thickness/2);
    vertex(-this.size/2, this.size/2, this.thickness/2);
    vertex(-this.size/2, -this.size/2, this.thickness/2);
    endShape(CLOSE);

    beginShape();
    vertex(this.size/2, -this.size/2, -this.thickness/2);
    vertex(this.size/2, this.size/2, -this.thickness/2);
    vertex(this.size/2, this.size/2, this.thickness/2);
    vertex(this.size/2, -this.size/2, this.thickness/2);
    endShape(CLOSE);

    pop();
}

/**
 * Draws a circle with a cylinder side and a colored top disc.
 */
function drawCircle() {
    push();
    noStroke();

    const detailX = 50;  // Smoothness for the cylinder
    const scaleFactor = 0.6;  // Adjust this for size scaling

    translate(this.x, this.y, this.z);

    // Draw the side (cylinder) in grey
    fill(150);
    rotateX(HALF_PI);
    cylinder(this.size * scaleFactor, this.thickness * scaleFactor, detailX);

    // Move up slightly to make the top disc hover over the cylinder
    translate(0, 20, 0);

    // Draw the top disc in color
    let gradientColors = computeGradient(this.color);
fill(lerpColor(gradientColors[0], gradientColors[1], 0.1));
    rotateX(HALF_PI);
    ellipse(0, 0, this.size * 2 * scaleFactor, this.size * 2 * scaleFactor);

    pop();
}


/**
 * Draws a semi-circle shape with a linear gradient fill.
 */
function drawSemiCircle() {
    push();
    let gradientColors = computeGradient(this.color);
fill(lerpColor(gradientColors[0], gradientColors[1], 0.1));
    noStroke(); 
    translate(this.x, this.y, this.z);
    rotateX(HALF_PI); 
    rotateZ(this.rotation);
    for(let angle = 0; angle <= PI; angle+=0.05) { // Reduced the step size for a smoother curve
      let x = this.size * cos(angle);
      let y = this.size * sin(angle);
      let x2 = this.size * cos(angle+0.05);
      let y2 = this.size * sin(angle+0.05);
      beginShape();
      vertex(x, y, -this.thickness/2);
      vertex(x2, y2, -this.thickness/2);
      vertex(x2, y2, this.thickness/2);
      vertex(x, y, this.thickness/2);
      endShape(CLOSE);
    }
    pop();
}
  
/**
 * Draws a triangle shape with gradient colors.
 */
function drawTriangle() {
    push();
    let gradientColors = computeGradient(this.color);
fill(lerpColor(gradientColors[0], gradientColors[1], 0.1));
    noStroke();
    translate(this.x, this.y, this.z);
    rotateZ(this.rotation);

    // Top face
    beginShape();
    vertex(-this.size/2, -this.size/2, this.thickness/2);
    vertex(this.size/2, -this.size/2, this.thickness/2);
    vertex(0, this.size/2, this.thickness/2);
    endShape(CLOSE);

    // Bottom face
    beginShape();
    vertex(-this.size/2, -this.size/2, -this.thickness/2);
    vertex(this.size/2, -this.size/2, -this.thickness/2);
    vertex(0, this.size/2, -this.thickness/2);
    endShape(CLOSE);

    // Sides (in grey)
    fill(150); 

    beginShape();
    vertex(-this.size/2, -this.size/2, -this.thickness/2);
    vertex(this.size/2, -this.size/2, -this.thickness/2);
    vertex(this.size/2, -this.size/2, this.thickness/2);
    vertex(-this.size/2, -this.size/2, this.thickness/2);
    endShape(CLOSE);

    beginShape();
    vertex(-this.size/2, -this.size/2, -this.thickness/2);
    vertex(0, this.size/2, -this.thickness/2);
    vertex(0, this.size/2, this.thickness/2);
    vertex(-this.size/2, -this.size/2, this.thickness/2);
    endShape(CLOSE);

    beginShape();
    vertex(this.size/2, -this.size/2, -this.thickness/2);
    vertex(0, this.size/2, -this.thickness/2);
    vertex(0, this.size/2, this.thickness/2);
    vertex(this.size/2, -this.size/2, this.thickness/2);
    endShape(CLOSE);

    pop();
}


/**
 * Draws a teardrop shape on the canvas.
 */
function drawTeardrop() {
    push();
    let gradientColors = computeGradient(this.color);
fill(lerpColor(gradientColors[0], gradientColors[1], 0.1));
    noStroke();
    translate(this.x, this.y, this.z);
    rotateZ(this.rotation);

    // Upper Part (Round Section) - Top Face
    beginShape();
    curveVertex(-this.size/2, this.size);
    curveVertex(0, 0);
    curveVertex(this.size/2, this.size);
    curveVertex(0, this.size*2.5);
    curveVertex(-this.size/2, this.size);
    endShape();
    
    // Upper Part (Round Section) - Bottom Face
    beginShape();
    curveVertex(-this.size/2, this.size);
    curveVertex(0, 0);
    curveVertex(this.size/2, this.size);
    curveVertex(0, this.size*2.5);
    curveVertex(-this.size/2, this.size);
    endShape(CLOSE);
    
    fill(150);
    pop();



/**
 * Handles the key press event.
 * If the 'C' or 'c' key is pressed, it toggles the capturing state.
 * If capturing is enabled, it starts the capturer.
 * If capturing is disabled, it stops the capturer and saves the captured data.
 */
function keyPressed() {
    if (key == 'C' || key == 'c') {
      capturing = !capturing;
  
      if (capturing) {
        capturer.start();
      } else {
        capturer.stop();
        capturer.save();
      }
    }
  }
}
