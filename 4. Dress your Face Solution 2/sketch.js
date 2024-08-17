function setup() {
  createCanvas(600, 400)

  // Cature video feed from webcam
  startVideo()

  // Start the PoseNet AI
  startPoseNet()

  // Slow the frame rate to avoid overloading the computer
  frameRate(10)
}


function draw() {
  // Draw the video frame
  image(video, 0, 0)

  // If we have some pose data, make our drawing
  if (havePoses()) {
    //drawKeyPoints()
    myFace()
  }
}


function myFace() {
  // Big nose
  stroke("black")
  strokeWeight(5)
  fill("red")
  noseSize = pose.eyeDist/2
  circle(pose.nose.x, pose.nose.y, noseSize)
  
  // Glasses
  stroke("yellow")
  strokeWeight(5)
  //noFill()
  fill(color(0, 255, 0, 40)) 
  circle(pose.rightEye.x, pose.rightEye.y, 50)
  circle(pose.leftEye.x, pose.leftEye.y, 50)
  
  // Draw the bridge
  line(pose.leftEye.x - 50 / 2, pose.leftEye.y, 
       pose.rightEye.x + 50 / 2, pose.rightEye.y)  
  
  // Draw the ear arms
  line(pose.leftEye.x + 50 / 2, pose.leftEye.y, pose.leftEar.x, pose.leftEar.y)
  line(pose.rightEye.x - 50 / 2, pose.rightEye.y, pose.rightEar.x, pose.rightEar.y)
  
  // Hat
  noStroke()
  fill("darkred")
  push()
  centreOn(pose.midEar.x, pose.midEar.y-100)
  rotate(pose.eyeTiltAngle)  
  arc(0,0, 
      pose.earDist, 250, 180, 0)
  pop()
  
}




function drawKeyPoints() {
  // Function to draw the key points on the face
  
  drawKeyPointsNose()

  //drawKeyPointsEyes()

  //drawKeyPointsEars()
}
  
  
function drawCalculatedKeyPoints() {
  
  //drawKeyPointsEyeDistance()
  
  //drawKeyPointsEarDistance()
  
  //drawKeyPointsTilt()

  //drawKeyPointsRotation() 
}


function bigNose() {
  // Function to draw a big nose
  
  // Define the parameters for the nose
  noseSize = 60                          // fixed size nose
  //noseSize = pose.eyeDist/2                // nose size is half the distance between the eyes
  //noseSize = 60*pose.scale               // nose size is based on the computed scale of the head
  colour = color("red")
  lineColour = color("black")
  lineThickness = 2
  
  push()                                 // save the current style
  
  // Set the style 
  stroke(lineColour)
  strokeWeight(lineThickness)
  fill(colour)
  
  // Set the position where we will centre the drawing (on the nose)
  centreOn(pose.nose.x, pose.nose.y)
  
  // Draw a circle
  circle(0, 0, noseSize)          
  
  pop()                                  // restore the style
}


function simpleGlasses() {
  // Function to draw some simple glasses
  
  // Define the parameters for the glasses
  frameColour = color("green")
  frameThickness = 8
  lensColour = color(0, 255, 0, 0)                 // first 3 parameters are RGB, 4th parameter is transparency (0 to 255)
  lensWidth = 70                                   // fixed size eyepieces
  //lensWidth = 70*pose.scale                      // size of eyepieces based on the computed scale of the head
  
  push()
  
  // Set the style
  fill(lensColour)     
  stroke(frameColour)
  strokeWeight(frameThickness)  

  // Draw the eyepieces
  
  push()
  centreOn(pose.leftEye.x, pose.leftEye.y)
  circle(0, 0, lensWidth)
  pop()
  
  push()
  centreOn(pose.rightEye.x, pose.rightEye.y)
  circle(0,0, lensWidth)
  pop()
  
  // Draw the bridge
  //line(pose.leftEye.x - lensWidth / 2, pose.leftEye.y, pose.rightEye.x + lensWidth / 2, pose.rightEye.y)
  
  // Draw the ear arms
  //line(pose.leftEye.x + lensWidth / 2, pose.leftEye.y, pose.leftEar.x, pose.leftEar.y)
  //line(pose.rightEye.x - lensWidth / 2, pose.rightEye.y, pose.rightEar.x, pose.rightEar.y)
  
  pop()
}

function simpleHat() {

  // Function to draw a hat
  
  // Define the parameters for the hat
  capHeight = 250                         // height of the cap 
  capWidth = pose.earDist*1.1             // width of cap 
  capHeight = capHeight                   // height of cap 
  capColour = color("darkred")
  sitPosition = 100                       // how high up the head to move the hat
  
  push()
  
  // Adjust the position of the drawing  
  centreOn(pose.midEar.x, pose.midEar.y)
  //shiftUp(sitPosition)
  //tilt()

  // Draw the cap
  noStroke()
  fill(capColour)
  arc(0, 0, capWidth, capHeight, 180, 0)

  pop()  
}

function glasses() {
  // Function to draw some more complex glasses
  
  // Define the parameters for the glasses
  frameColour = color("green")
  frameThickness = 8*pose.scale
  lensColour = color(0, 255, 0, 60)
  lensWidth = (50 - 40 * abs(pose.headRotation) / 100)*pose.scale
  lensHeight = 50*pose.scale
  
  push()
  
  // Set the style
  fill(lensColour)
  stroke(frameColour)
  strokeWeight(frameThickness)
  
  // Compute lift for ear arms
  lift = pose.earDist / 10

  // Left eye
  push()
  centreOn(pose.leftEye.x, pose.leftEye.y)
  ellipse(0, 0, lensWidth, lensHeight)
  pop()

  // Right eye
  push()
  centreOn(pose.rightEye.x, pose.rightEye.y)
  ellipse(0, 0, lensWidth, lensHeight)
  pop()

  // Bridge
  strokeWeight(5)  
  line(pose.leftEye.x - lensWidth / 2, pose.leftEye.y, pose.rightEye.x + lensWidth / 2, pose.rightEye.y)
  
  // Ear arms
  line(pose.leftEye.x + lensWidth / 2, pose.leftEye.y, pose.leftEar.x, pose.leftEar.y - lift)
  line(pose.rightEye.x - lensWidth / 2, pose.rightEye.y, pose.rightEar.x, pose.rightEar.y - lift)
  
  pop()
}

function eyeLashes() {
  // Function to draw some eye lashes
  
  // Define the parameters for the lashes
  startAngle = 110            // angle to start drawing from (0 is pointing downwards, +ve is clockwise)
  stopAngle = 250             // angle to stop drawing
  step = 20                   // angle between each lash
  inner = 25                  // radius of inner circle (root of lashes)
  outer = 40                  // radius of outer circle (tips of lashes)
  thickness = 5
  colour = color("tomato")
  
  push()
  
  // Set the style
  noFill()
  stroke(colour)
  strokeWeight(thickness)
  
  // Left eye
  push()
  centreOn(pose.leftEye.x, pose.leftEye.y)
  starburst(0, 0, startAngle, stopAngle, step, inner, outer) 
  pop()

  // Right eye
  push()
  centreOn(pose.rightEye.x, pose.rightEye.y)
  starburst(0, 0, startAngle, stopAngle, step, inner, outer) 
  pop()
  
  pop()
}



function hat() {
  // Function to draw a hat
  
  // Define the parameters for the hat
  capHeight = 200                         // height of the cap part
  shadeHeight = 50                        // height of the shade part
  sitPosition = 150                       // how high up the head to move the hat
  capWidth = pose.earDist                 // width of cap part
  capHeight = capHeight*pose.scale        // height of cap part
  shadeWidth = pose.earDist               // width of the shade part
  shadeHeight = shadeHeight*pose.scale    // height of the shade part
  rimThickness = 20                       // thickness of the rim
  stickOut = 30                           // how far the rim will stick out beyond the ears
  capColour = color("darkred")
  rimColour = color("darkred")
  shadeColour = color("red")
  
  push()
  
  // Adjust the position of the drawing  
  centreOn(pose.midEar.x, pose.midEar.y)
  shiftUp(sitPosition*pose.scale)

  // Draw the cap
  noStroke()
  fill(capColour)
  arc(0, 0, capWidth, capHeight, 180, 0)

  // Draw the rim
  stroke(rimColour)
  strokeWeight(rimThickness)
  line(pose.earDist/2+stickOut, 0, -pose.earDist/2-stickOut, 0)

  // Draw the shade
  noStroke()
  fill(shadeColour)
  arc(0, 0, shadeWidth, shadeHeight, 0, 180)

  pop()
}


function forehead() {
  // Draw a big forehead
  
  // Define the parameters for the forehead
  foreheadWidth = pose.earDist
  foreheadHeight = 300*pose.scale
  colour = color("tan")
  
  push()
  
  // Adjust the position of the drawing
  centreOn(pose.midEar.x, pose.midEar.y)
  shiftUp(90*pose.scale)  

  // Set the style
  fill(colour)
  noStroke()
  
  // Draw the forehead
  arc(0, 0, foreheadWidth, foreheadHeight, 180, 0)
  
  pop()
}

function hair() {
  // Function to draw some hair
  
  push()  
  
  // Define the parameters for the hair
  startAngle = 90             // angle to start drawing from (0 is pointing downwards, +ve is clockwise)
  stopAngle = 270             // angle to stop drawing
  step = 10                   // angle between each strand
  inner = pose.earDist/2      // radius of inner circle (root of strand)
  outer = pose.earDist*3/4    // radius of outer circle (tips of strand)
  thickness = 30
  colour = color("black")
  
  // Set the style
  stroke(colour)
  strokeWeight(thickness)
  
  // Shift the hair up the head
  //shiftUp(90*pose.scale)
  
  // Adjust the position of the drawing
  centreOn(pose.midEar.x, pose.midEar.y)
  shiftUp(90*pose.scale)  
  
  // Draw the hair
  starburst(0, 0, startAngle, stopAngle, step, inner, outer) 
  
  pop()
  
}

function sideburns() {
  // Function to draw some sideburns
  
  // Define the parameters for the sideburns
  startAngle = 80             // angle to start drawing from (0 is pointing downwards, +ve is clockwise)
  stopAngle = 110             // angle to stop drawing
  step = 8                    // angle between each strand
  inner = pose.earDist        // radius of inner circle (root of strand)
  outer = pose.earDist+50     // radius of outer circle (tips of strand)
  thickness = 30
  colour = color("black")
  
  push()
  
  // Set the style
  fill(colour)
  strokeWeight(thickness)
  
  // Left sideburn (a starburst centred on the right ear)
  push()
  
  // Adjust the position of the drawing
  centreOn(pose.rightEar.x, pose.rightEar.y)
  shiftDown(60*pose.scale)
  
  if (pose.headRotation>-30) // hide if head rotated too much
    starburst(0, 0, -stopAngle, -startAngle, step, inner, outer) 
  
  pop()  
  
  // Right sideburn (a starburst centred on the left ear)
  push()
  
  // Adjust the position of the drawing
  centreOn(pose.leftEar.x, pose.leftEar.y)
  shiftDown(60*pose.scale)
  
  if (pose.headRotation<30)  // hide if head rotated too much
    starburst(0, 0, startAngle, stopAngle, step, inner, outer) 
  pop()  
  
  pop()
}


function moustache() {
  // Function to draw a moustache

  // Define the parameters for the moustache
  thickness = 20
  colour = color("black")
  xLength = 60
  yLength = 30
  
  push()
  
  // Set the style
  fill(colour)
  strokeWeight(thickness)  
  
  // Adjust the position of the drawing
  centreOn(pose.nose.x, pose.nose.y)  // centre on the nose
  shiftDown(40*pose.scale)             // shift down to below the nose
  
  // Draw as 2 lines
  line(0, 0, -xLength, yLength)
  line(0, 0, xLength, yLength)  
  
  pop()
}

function beard() {
  // Function to draw a beard
  
  // Define the parameters for the beard
  startAngle = -90             // angle to start drawing from (0 is pointing downwards, +ve is clockwise)
  stopAngle = 90               // angle to stop drawing
  step = 20                    // angle between each strand
  inner = 0                    // radius of inner circle (root of strand)
  outer = 50                   // radius of outer circle (tips of strand)
  thickness = 20
  colour = color("black")
  
  push()
  
  // Set the style
  fill(colour)
  strokeWeight(thickness)
  
  // Adjust the position of the drawing
  centreOn(pose.nose.x, pose.nose.y)  // centre on the nose
  shiftDown(80*pose.scale)             // shift down to below the nose
  
  // Draw the starburst
  starburst(0, 0, startAngle, stopAngle, step, inner, outer) 

  pop()
}