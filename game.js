var target_xPosition = 640;
var target_yPosition = 645;
var target_width = 75;
var target_height = 75;
var target_Speed = 1;

var cannon_Angle = 0;

var bullet_xPosition = 659;
var bullet_yPosition = 35;
var bullet_width = 15;
var bullet_height = 15;
var bullet_Speed = 2;
var remaining_bullets = 10;

var curr_Score = 0;
var curr_Level = 1;
var right_Movement = true;

function resetGame () {
  target_xPosition = 640;
  target_yPosition = 645;
  target_Speed = 1;

  cannon_Angle = 0;

  bullet_xPosition = 659;
  bullet_yPosition = 35;
  bullet_Speed = 2;
  remaining_bullets = 10;

  curr_Score = 0;
  curr_Level = 1;
  right_Movement = true;

  $("#bullet_Text").text("Remaining Cannonballs: " + remaining_bullets);
  $("#score_Text").text("Player Score: " + curr_Score);
  $("#level_Text").text("Current Level: " + curr_Level);
}
function targetMovement() {
  setInterval(function () {
    if(right_Movement) {
      target_xPosition += target_Speed;
    }
    else{
      target_xPosition -= target_Speed;
    }

    if(target_xPosition >= 1205) {
      right_Movement = false;
    }else if(target_xPosition <= 0) {
      right_Movement = true;
    }

    $("#target").css("left", target_xPosition + "px");
  }, 10);
}

function aimCannon() {
  $(document).on("mousemove", function(event) {
    var parentOffset = $("#player").offset();
    var relX = event.pageX - parentOffset.left;
    var relY = event.pageY - parentOffset.top;
    // console.log(relX);
    // console.log(relY);
    cannon_Angle = Math.atan(relY / relX);
    if(relX < 0) {
      cannon_Angle += Math.PI;
    }
    $("#barrel").css("transform", "rotate("+ cannon_Angle +"rad)");
    //console.log(cannon_Angle);
  });
}

function shootCannon() {
  var bulletShot = false;
  $("#bullet_Text").text("Remaining Cannonballs: " + remaining_bullets);
  $("#score_Text").text("Player Score: " + curr_Score);
  $("#level_Text").text("Current Level: " + curr_Level);
  $("#container").click(function() {
    var xIncrease = bullet_Speed * Math.cos(cannon_Angle);
    var yIncrease = bullet_Speed * Math.sin(cannon_Angle);
    if(!bulletShot && remaining_bullets > 0) {
      $("#bullet").show();
      remaining_bullets--;
      $("#bullet_Text").text("Remaining Cannonballs: " + remaining_bullets);
      var bulletInterval = setInterval(function() {
        bulletShot = true;
        bullet_xPosition += xIncrease;
        bullet_yPosition -= yIncrease;
        $("#bullet").css("left", bullet_xPosition + "px");
        $("#bullet").css("bottom", bullet_yPosition + "px");

        // console.log("bullet x: " + bullet_xPosition);
        // console.log("bullet y: " + bullet_yPosition);
        // console.log("target x: " + target_xPosition);
        // console.log("target y: " + target_yPosition);

        //if the bullet collides with the target
        if((bullet_xPosition >= target_xPosition && bullet_xPosition <= target_xPosition + target_width &&
          bullet_yPosition >= target_yPosition && bullet_yPosition <= target_height + target_yPosition)
          || (bullet_xPosition + bullet_width >= target_xPosition && bullet_xPosition + bullet_width <= target_xPosition + target_width &&
          bullet_yPosition + bullet_height >= target_yPosition && bullet_yPosition + bullet_height <= target_height + target_yPosition)) {
          clearInterval(bulletInterval);
          bullet_xPosition = 659;
          bullet_yPosition = 35;
          $("#bullet").hide();
          bulletShot = false;
          curr_Score++;
          $("#score_Text").text("Player Score: " + curr_Score);
          if(curr_Score % 3 === 0) {
            curr_Level++;
            target_Speed++;
            remaining_bullets += 5;
            $("#level_Text").text("Current Level: " + curr_Level);
            $("#bullet_Text").text("Remaining Cannonballs: " + remaining_bullets);
          }
        }

        //if the bullet has reached the boundary of the screen
        if(bullet_xPosition < -15 || bullet_yPosition < -15 || bullet_xPosition > 1280 || bullet_yPosition > 720) {
          clearInterval(bulletInterval);
          bullet_xPosition = 659;
          bullet_yPosition = 35;
          $("#bullet").hide();
          bulletShot = false;
        }

      });
    }
  });
}

$(function (){
  $("#reset_button").click(function () {
    resetGame();
  })
  $("#bullet").hide();
  targetMovement();
  aimCannon();
  shootCannon();
});
