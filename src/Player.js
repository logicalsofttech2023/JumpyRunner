export default class Player {
  WALK_ANIMATION_TIMER = 100;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  dinoRunImages = [];
  currentFrame = 0;

  jumpPressed = false;
  jumpInProgress = false;
  falling = false;
  JUMP_SPEED = 0.9;
  GRAVITY = 0.6;

  constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio, characterData, gameHeight, onJump) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;
    this.scaleRatio = scaleRatio;
    this.characterData = characterData;
    this.gameHeight = gameHeight;
    this.onJump = onJump; // Sound callback

    this.x = 10 * scaleRatio;
    this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
    this.yStandingPosition = this.y;

    // Load jump image
    this.jumpImage = new Image();
    this.jumpImage.src = characterData.jumpImage;
    
    // Load standing still image (use first run image)
    this.standingStillImage = new Image();
    this.standingStillImage.src = characterData.runImages[0];
    this.image = this.standingStillImage;

    // Load all running images
    this.dinoRunImages = [];
    characterData.runImages.forEach(imgSrc => {
      const image = new Image();
      image.src = imgSrc;
      this.dinoRunImages.push(image);
    });

    // Keyboard event listeners
    this.keydown = this.keydown.bind(this);
    this.keyup = this.keyup.bind(this);
    
    // Touch event listeners
    this.touchstart = this.touchstart.bind(this);
    this.touchend = this.touchend.bind(this);

    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);
    window.removeEventListener("touchstart", this.touchstart);
    window.removeEventListener("touchend", this.touchend);

    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
    window.addEventListener("touchstart", this.touchstart);
    window.addEventListener("touchend", this.touchend);
  }

  touchstart() {
    this.jumpPressed = true;
  }

  touchend() {
    this.jumpPressed = false;
  }

  keydown(event) {
    if (event.code === "Space" || event.key === " " || event.code === "ArrowUp" || event.code === "ArrowDown") {
      this.jumpPressed = true;
    }
  }

  keyup(event) {
    if (event.code === "Space" || event.key === " " || event.code === "ArrowUp" || event.code === "ArrowDown") {
      this.jumpPressed = false;
    }
  }

  update(gameSpeed, frameTimeDelta) {
    this.run(gameSpeed, frameTimeDelta);

    if (this.jumpInProgress || this.falling) {
      this.image = this.jumpImage; // Use jump image when jumping or falling
    }

    this.jump(frameTimeDelta);
  }

  jump(frameTimeDelta) {
    if (this.jumpPressed && !this.jumpInProgress && !this.falling) {
      this.jumpInProgress = true;
      this.falling = false;
      
      // Trigger jump sound callback
      if (this.onJump) {
        this.onJump();
      }
    }

    if (this.jumpInProgress && !this.falling) {
      if (
        this.y > this.gameHeight - this.minJumpHeight ||
        (this.y > this.gameHeight - this.maxJumpHeight && this.jumpPressed)
      ) {
        this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
      } else {
        this.falling = true;
      }
    } else {
      if (this.y < this.yStandingPosition) {
        this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
        if (this.y + this.height > this.canvas.height) {
          this.y = this.yStandingPosition;
        }
      } else {
        this.falling = false;
        this.jumpInProgress = false;
      }
    }
  }

  run(gameSpeed, frameTimeDelta) {
    // Only animate if not jumping
    if (!this.jumpInProgress && !this.falling) {
      if (this.walkAnimationTimer <= 0) {
        // Cycle through all 8 frames
        this.currentFrame = (this.currentFrame + 1) % this.dinoRunImages.length;
        this.image = this.dinoRunImages[this.currentFrame];
        this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
      }
      this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
    }
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  // Cleanup method to remove event listeners
  cleanup() {
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);
    window.removeEventListener("touchstart", this.touchstart);
    window.removeEventListener("touchend", this.touchend);
  }
}
