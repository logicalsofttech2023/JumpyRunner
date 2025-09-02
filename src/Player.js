export default class Player {
  WALK_ANIMATION_TIMER = 100;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  dinoRunImages = [];
  currentFrame = 0;

  jumpPressed = false;
  jumpInProgress = false;
  falling = false;

  BASE_JUMP_SPEED = 0.9;
  BASE_GRAVITY = 0.3;

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

    this.standingStillImage = new Image();
    this.standingStillImage.src = characterData.jumpImage;
    this.image = this.standingStillImage;

    // Load running frames
    this.dinoRunImages = [];
    characterData.runImages.forEach((imgSrc) => {
      const image = new Image();
      image.src = imgSrc;
      this.dinoRunImages.push(image);
    });

    // Bind handlers
    this.keydown = this.keydown.bind(this);
    this.keyup = this.keyup.bind(this);
    this.touchstart = this.touchstart.bind(this);
    this.touchend = this.touchend.bind(this);

    // Ensure no duplicate listeners
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);
    window.removeEventListener("touchstart", this.touchstart);
    window.removeEventListener("touchend", this.touchend);

    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
    window.addEventListener("touchstart", this.touchstart);
    window.addEventListener("touchend", this.touchend);
  }

  // Touch handlers (mobile)
  touchstart(e) {
    // prevent accidental scrolling on some devices
    if (e && e.preventDefault) e.preventDefault();
    this.jumpPressed = true;
  }

  touchend() {
    this.jumpPressed = false;
  }

  // Helper: detect jump keys (Space, ArrowUp, ArrowDown)
  isJumpKey(event) {
    const code = event.code;
    const key = event.key;
    return (
      code === "Space" ||
      key === " " ||
      key === "Spacebar" || // old browsers
      code === "ArrowUp" ||
      code === "ArrowDown" ||
      key === "ArrowUp" ||
      key === "ArrowDown"
    );
  }

  keydown(event) {
    if (this.isJumpKey(event)) {
      if (event.preventDefault) event.preventDefault();
      this.jumpPressed = true;
    }
  }

  keyup(event) {
    if (this.isJumpKey(event)) {
      if (event.preventDefault) event.preventDefault();
      this.jumpPressed = false;
    }
  }

  update(gameSpeed, frameTimeDelta) {
    this.run(gameSpeed, frameTimeDelta);

    if (this.jumpInProgress) {
      this.image = this.standingStillImage;
    }

    this.jump(gameSpeed, frameTimeDelta);
  }

  jump(gameSpeed, frameTimeDelta) {
    if (this.jumpPressed && !this.jumpInProgress && !this.falling) {
      this.jumpInProgress = true;
      this.falling = false;

      if (this.onJump) {
        this.onJump();
      }
    }

    // scale jump & gravity with game speed
    const jumpSpeed = this.BASE_JUMP_SPEED * gameSpeed;
    const gravity = this.BASE_GRAVITY * gameSpeed;

    if (this.jumpInProgress && !this.falling) {
      if (
        this.y > this.gameHeight - this.minJumpHeight ||
        (this.y > this.gameHeight - this.maxJumpHeight && this.jumpPressed)
      ) {
        this.y -= jumpSpeed * frameTimeDelta * this.scaleRatio;
      } else {
        this.falling = true;
      }
    } else {
      if (this.y < this.yStandingPosition) {
        this.y += gravity * frameTimeDelta * this.scaleRatio;
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
    if (!this.jumpInProgress && !this.falling) {
      if (this.walkAnimationTimer <= 0) {
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
