// Global variables
let video
let poseNet
let pose = {}

function startVideo() {
  // Cature video feed from webcam
  video = createCapture(VIDEO)
  video.hide()  
}

function startPoseNet() {
  // Set up PoseNet to capture pose information
  poseNet = ml5.poseNet(video, "single", modelReady)
  poseNet.on('pose', gotPoses)
  
  // So we can measure angles in degrees rather than radians
  angleMode(DEGREES)
  
  rectMode(CENTER)
}

function havePoses() {
  return Object.keys(pose).length > 0
}

function modelReady() {
  console.log('Model Loaded!');
}

function gotPoses(poses) {
  // This function is called when we get pose information from PoseNet
  // See here for details
  // https://www.tensorflow.org/lite/models/pose_estimation/overview
  
  //console.log(poses)
  if (poses.length>0) {
    // Get the first detected figure
    firstPose = poses[0].pose
    
    // Extract the information we need for face detection
    pose["nose"] = firstPose.keypoints[0].position
    pose["leftEye"] = firstPose.keypoints[1].position
    pose["rightEye"] = firstPose.keypoints[2].position
    pose["leftEar"] = firstPose.keypoints[3].position
    pose["rightEar"] = firstPose.keypoints[4].position
    
    // Compute useful points related to the face key points
    
    // Distance between eyes
    pose["eyeDist"] = dist(pose.leftEye.x, pose.leftEye.y, pose.rightEye.x, pose.rightEye.y)
    pose["eyeDistX"] = pose.rightEye.x-pose.leftEye.x
    pose["eyeDistY"] = pose.rightEye.y-pose.leftEye.y    
    
    // Distance between ears
    pose["earDist"] = dist(pose.leftEar.x, pose.leftEar.y, pose.rightEar.x, pose.rightEar.y)
    pose["earDistX"] = pose.rightEar.x-pose.leftEar.x
    pose["earDistY"] = pose.rightEar.y-pose.leftEar.y       
    
    // Distance from nose to ears
    pose["noseLeftEarXDist"] = abs(pose.nose.x-pose.leftEar.x)//dist(pose.nose.x, pose.nose.y, pose.leftEar.x, pose.leftEar.y)
    pose["noseRightEarXDist"] = abs(pose.nose.x-pose.rightEar.x)//dist(pose.nose.x, pose.nose.y, pose.rightEar.x, pose.rightEar.y)
    
    // Mid point between eyes
    pose["midEye"] = {x:pose.rightEye.x+(pose.leftEye.x-pose.rightEye.x)/2, 
                      y:pose.rightEye.y+(pose.leftEye.y-pose.rightEye.y)/2}

    // Mid point between ears
    pose["midEar"] = {x:pose.rightEar.x+(pose.leftEar.x-pose.rightEar.x)/2, 
                      y:pose.rightEar.y+(pose.leftEar.y-pose.rightEar.y)/2}
    
    // Angle that eyes are tilting
    pose["eyeTiltAngle"] = atan(pose.eyeDistY/pose.eyeDistX)
    
    // Angle that ears are tilting
    pose["earTiltAngle"] = atan(pose.earDistY/pose.earDistX)    
    
    // Degree of rotation (-100 to +100, 0 being not rotated)
    pose["headRotation"] = (pose.noseLeftEarXDist - pose.noseRightEarXDist)/pose.earDist*100
    
    pose["scale"] = pose.eyeDist/120
 
  }
}


function drawKeyPointsEyes() {
  // Draw the position of the eyes
  
  push()
  textAlign(LEFT, TOP)  
  rectMode(CORNER)
  
  noStroke()
  fill("green")
  circle(pose.leftEye.x, pose.leftEye.y, 10)
  circle(pose.rightEye.x, pose.rightEye.y, 10)
  //circle(pose.midEye.x, pose.midEye.y, 5)  
  
  label("left eye", pose.leftEye.x, pose.leftEye.y+10)  
  label("right eye", pose.rightEye.x, pose.rightEye.y+10)  
  
  pop()
}

function drawKeyPointsNose() {
  // Draw the position of the nose

  push()
  textAlign(LEFT, TOP)  
  rectMode(CORNER)
  
  noStroke()
  fill("red")
  circle(pose.nose.x, pose.nose.y, 10)  

  label("nose", pose.nose.x, pose.nose.y+10)  
  
  pop()
}

function drawKeyPointsEars() {
  // Draw the position of the ears
  
  push()
  textAlign(LEFT, TOP)  
  rectMode(CORNER)
  
  noStroke()
  fill("blue")
  circle(pose.leftEar.x, pose.leftEar.y, 10)
  circle(pose.rightEar.x, pose.rightEar.y, 10)
  //circle(pose.midEar.x, pose.midEar.y, 5)  
  
  label("left ear", pose.leftEar.x, pose.leftEar.y+10)  
  label("right ear", pose.rightEar.x, pose.rightEar.y+10)  
  
  pop()
}

function drawKeyPointsEyeDistance() {
  
  push()
  textAlign(LEFT, TOP)  
  rectMode(CORNER)
  
  noFill()
  stroke("green")
  strokeWeight(2)
  line(pose.leftEye.x, pose.leftEye.y, pose.rightEye.x, pose.rightEye.y)
  label(nf(round(pose.eyeDist)), 
        pose.midEye.x, 
        pose.midEye.y)    
  
  pop()
}

function drawKeyPointsEarDistance() {
  push()
  textAlign(LEFT, TOP)  
  rectMode(CORNER)
  
  noFill()
  stroke("blue")
  strokeWeight(2)
  line(pose.leftEar.x, pose.leftEar.y, pose.rightEar.x, pose.rightEar.y)
  label(nf(round(pose.earDist)), 
        pose.midEar.x, 
        pose.midEar.y)    
  
  pop()
}


function drawKeyPointsTilt() {
  // Draw the tilt angle calculation
  
  push()
  textAlign(LEFT, TOP)  
  rectMode(CORNER)
  
  noFill()
  stroke("green")
  strokeWeight(2)
  line(pose.leftEye.x, pose.leftEye.y, pose.rightEye.x, pose.rightEye.y)
  line(pose.leftEye.x, pose.leftEye.y, pose.rightEye.x, pose.leftEye.y)
  
  angleFrom = min(180, 180+pose.eyeTiltAngle)
  angleTo = max(180, 180+pose.eyeTiltAngle)
  arc(pose.leftEye.x, pose.leftEye.y, 100, 100, angleFrom, angleTo)
  
  label(nf(round(pose.eyeTiltAngle)), 
        pose.rightEye.x + 50, 
        pose.leftEye.y+(pose.rightEye.y-pose.leftEye.y)/3 - 6)  
  
  pop()
}

function drawKeyPointsRotation() {
  // Draw the rotation calculation
  
  push()
  textAlign(LEFT, TOP)  
  rectMode(CORNER)  
  
  noFill()
  noStroke()
  stroke("blue")
  strokeWeight(2)
  line(pose.nose.x, pose.nose.y, pose.rightEar.x, pose.nose.y)
  line(pose.nose.x, pose.nose.y, pose.leftEar.x, pose.nose.y)
  
  label(nf(round(pose.noseRightEarXDist)) + "  " + nf(round(pose.noseLeftEarXDist)), 
        pose.nose.x, 
        pose.nose.y)

  
  label(nf(round(pose.headRotation)), 
        pose.nose.x, 
        pose.nose.y+12)  
  
  pop()
}

function label(t, x, y) {
  // Draw a label at the given point
  x = x - textWidth(t)/2
  noStroke()
  fill(0)
  rect(x, y, textWidth(t), 12)
  fill("white")
  text(t, x, y)    
}

function centreOn(x, y) {
  translate(x, y)
}

function tilt() {
  rotate(pose.earTiltAngle)  
}

function starburst(x, y, start, stop, step, inner, outer) {
  // Draw starburst centred at x,y starting and stopping at start and stop angles, 
  // drawing one line every step degrees.  Line starts inner pixels from centre and stops at
  // outer pixels from centre
  push()
  translate(x, y)
  rotate(start)
  for (a = start; a <= stop; a += step) {
    line(0, inner, 0, outer)
    rotate(step)
  }  
  pop()
}

function randomStarburst(x, y, start, stop, step, inner, outer, randomness) {
  // Draw starburst with some randomness centred at x,y starting and stopping at start and stop angles, 
  // drawing one line every step degrees.  Line starts inner pixels from centre and stops at
  // outer pixels from centre
  push()
  translate(x, y)
  rotate(start)
  for (a = start; a <= stop; a += step) {
    line(0, inner, random(-randomness,randomness), outer+random(-randomness,randomness))
    rotate(step)
  }  
  pop()
}

function shiftUp(pixels) {
  // Shift following drawing up the given number of pixels on the head
  translate(pixels * sin(pose.earTiltAngle), -pixels * cos(pose.earTiltAngle))
}

function shiftDown(pixels) {
  // Shift following drawing up the given number of pixels on the head
  translate(-pixels * sin(pose.earTiltAngle), pixels * cos(pose.earTiltAngle))
}

