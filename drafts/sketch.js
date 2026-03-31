// I want to create a drawing where there are 5 possible shapes, trapezoid, rectangle, circle, semi circle, and triangle. Up to twelve shapes can be drawn on the canvas.
// The shapes will be randomly placed on the canvas (but bound by margins), and will be randomly rotated. 
// The shapes will be randomly colored.
// The shapes will be randomly sized.
// The shapes will appear to be flat on the canvas, but will be 3D. The shapes will have enough thickness to be seen as 3D. In this view the shapes seem to be overlapping each other but not intersecting in 3d space.
// the shapes will apear one at a time and will be placed randomly on the canvas z-space.
// Once all of the shapes are drawn, the shapes will be rotated as a single unit in the z-space. The rotation will be 45 degrees in the z-space towards the viewer clockwise and 45 degrees upwards in the z-space.

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

let shapes = [];
let maxShapes = 20;
let currentShapeIndex = 0;
let finalRotationStarted = false;
let finalRotationStartTime;
let shapeFunctions = [drawTrapezoid, drawRectangle, drawCircle, drawSemiCircle, drawTriangle, drawTeardrop];
let margin = 200;

// Add this with your global variables
let delayStartTime;
let delayElapsed = 0;

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
        if (elapsed <= 3250) { // 1.75 seconds for the final rotation
          let progress = map(elapsed, 0, 3250, 0, 1);
          rotateX(QUARTER_PI * progress);
          rotateZ(-QUARTER_PI * progress);
        } else {
          rotateX(QUARTER_PI);
          rotateZ(-QUARTER_PI);
          noLoop();  // Stop the loop once the transformation is applied
        }
      }
    }

    // Add a new shape every 0.17 seconds (or every 18 frames)
    if (shapes.length < maxShapes && frameCount % 7 === 0) {
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


function drawTrapezoid() {
    push();
    fill(this.color);
    noStroke();
    translate(this.x, this.y, this.z);
    rotateZ(this.rotation);

    // Top face
    beginShape();
    vertex(-this.size, -this.size/2, this.thickness/2);
    vertex(this.size, -this.size/2, this.thickness/2);
    vertex(this.size*0.7, this.size/2, this.thickness/2);
    vertex(-this.size*0.7, this.size/2, this.thickness/2);
    endShape(CLOSE);

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

  
  function drawRectangle() {
    push();
    fill(this.color);
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
    fill(this.color);
    rotateX(HALF_PI);
    ellipse(0, 0, this.size * 2 * scaleFactor, this.size * 2 * scaleFactor);

    pop();
}


function drawSemiCircle() {
    push();
    fill(this.color);
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
  
function drawTriangle() {
    push();
    fill(this.color);
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

function drawTeardrop() {
  push();
  fill(this.color);
  noStroke();
  translate(this.x, this.y, this.z);
  rotateZ(this.rotation);
  
  // Upper Part (Round Section) - Top Face
  beginShape();
  for(let angle = PI; angle <= TWO_PI; angle += 0.01) {
      let x = this.size * cos(angle);
      let y = this.size * sin(angle);
      vertex(x, y, this.thickness/2);
  }
  endShape();
  
  // Lower Part (Tail Section) - Top Face
  beginShape();
  vertex(0, 0, this.thickness/2);  // Starting point
  bezierVertex(this.size, 0, this.size, this.size*1.5, 0, this.size*2, this.thickness/2);
  endShape();
  
  // Upper Part (Round Section) - Bottom Face
  beginShape();
  for(let angle = PI; angle <= TWO_PI; angle += 0.01) {
      let x = this.size * cos(angle);
      let y = this.size * sin(angle);
      vertex(x, y, -this.thickness/2);
  }
  endShape();
  
  // Lower Part (Tail Section) - Bottom Face
  beginShape();
  vertex(0, 0, -this.thickness/2);  // Starting point
  bezierVertex(this.size, 0, this.size, this.size*1.5, 0, this.size*2, -this.thickness/2);
  endShape();
  
  // Sides
  fill(150);  // Grey color for sides
  // Round Section Sides
  for(let angle = PI; angle <= TWO_PI; angle += 0.01) {
      let x = this.size * cos(angle);
      let y = this.size * sin(angle);
      let x2 = this.size * cos(angle + 0.01);
      let y2 = this.size * sin(angle + 0.01);
      beginShape();
      vertex(x, y, this.thickness/2);
      vertex(x2, y2, this.thickness/2);
      vertex(x2, y2, -this.thickness/2);
      vertex(x, y, -this.thickness/2);
      endShape(CLOSE);
  }
  // Tail Section Sides - Left
  beginShape();
  vertex(0, 0, this.thickness/2);
  vertex(0, this.size*2, this.thickness/2);
  vertex(0, this.size*2, -this.thickness/2);
  vertex(0, 0, -this.thickness/2);
  endShape(CLOSE);
  // Tail Section Sides - Right
  beginShape();
  vertex(this.size, 0, this.thickness/2);
  vertex(0, this.size*2, this.thickness/2);
  vertex(0, this.size*2, -this.thickness/2);
  vertex(this.size, 0, -this.thickness/2);
  endShape(CLOSE);
  
  pop();
}

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