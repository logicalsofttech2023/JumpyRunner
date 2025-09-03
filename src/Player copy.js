export default class Player {
  WALK_ANIMATION_TIMER = 100;
  JUMP_ANIMATION_TIMER = 70;
  DIE_ANIMATION_TIMER = 150;
  
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  jumpAnimationTimer = this.JUMP_ANIMATION_TIMER;
  dieAnimationTimer = this.DIE_ANIMATION_TIMER;
  
  dinoRunImages = [];
  dinoJumpImages = [];
  dinoDieImages = [];
  
  currentWalkFrame = 0;
  currentJumpFrame = 0;
  currentDieFrame = 0;

  jumpPressed = false;
  jumpInProgress = false;
  falling = false;
  isDead = false;

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
    this.standingStillImage.src = characterData.walkImages[0];
    this.image = this.standingStillImage;

    // Load running frames
    this.dinoRunImages = [];
    characterData.walkImages.forEach((imgSrc) => {
      const image = new Image();
      image.src = imgSrc;
      this.dinoRunImages.push(image);
    });

    // Load jumping frames
    this.dinoJumpImages = [];
    if (characterData.jumpImages) {
      characterData.jumpImages.forEach((imgSrc) => {
        const image = new Image();
        image.src = imgSrc;
        this.dinoJumpImages.push(image);
      });
    }

    // Load die frames
    this.dinoDieImages = [];
    if (characterData.dieImages) {
      characterData.dieImages.forEach((imgSrc) => {
        const image = new Image();
        image.src = imgSrc;
        this.dinoDieImages.push(image);
      });
    }

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
    if (this.isDead) {
      this.die(gameSpeed, frameTimeDelta);
      return;
    }
    
    this.run(gameSpeed, frameTimeDelta);
    this.jump(gameSpeed, frameTimeDelta);
  }

  jump(gameSpeed, frameTimeDelta) {
    if (this.jumpPressed && !this.jumpInProgress && !this.falling) {
      this.jumpInProgress = true;
      this.falling = false;
      this.currentJumpFrame = 0; // Reset jump animation

      if (this.onJump) {
        this.onJump();
      }
    }

    // scale jump & gravity with game speed
    const jumpSpeed = this.BASE_JUMP_SPEED * gameSpeed;
    const gravity = this.BASE_GRAVITY * gameSpeed;

    if (this.jumpInProgress && !this.falling) {
      // Handle jump animation
      if (this.dinoJumpImages.length > 0) {
        if (this.jumpAnimationTimer <= 0) {
          this.currentJumpFrame = (this.currentJumpFrame + 1) % this.dinoJumpImages.length;
          this.image = this.dinoJumpImages[this.currentJumpFrame];
          this.jumpAnimationTimer = this.JUMP_ANIMATION_TIMER;
        }
        this.jumpAnimationTimer -= frameTimeDelta * gameSpeed;
      }
      
      // Handle jump physics
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
        this.currentJumpFrame = 0;
      }
    }
  }

  run(gameSpeed, frameTimeDelta) {
    if (!this.jumpInProgress && !this.falling && !this.isDead) {
      if (this.walkAnimationTimer <= 0) {
        this.currentWalkFrame = (this.currentWalkFrame + 1) % this.dinoRunImages.length;
        this.image = this.dinoRunImages[this.currentWalkFrame];
        this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
      }
      this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
    }
  }

  die(gameSpeed, frameTimeDelta) {
    if (this.dinoDieImages.length > 0) {
      if (this.currentDieFrame < this.dinoDieImages.length - 1) {
        if (this.dieAnimationTimer <= 0) {
          this.currentDieFrame = Math.min(this.currentDieFrame + 1, this.dinoDieImages.length - 1);
          this.image = this.dinoDieImages[this.currentDieFrame];
          this.dieAnimationTimer = this.DIE_ANIMATION_TIMER;
        }
        this.dieAnimationTimer -= frameTimeDelta * gameSpeed;
      }
    } else {
      // Fallback if no die images are available
      this.image = this.standingStillImage;
    }
  }

  setDead() {
    this.isDead = true;
    this.currentDieFrame = 0;
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