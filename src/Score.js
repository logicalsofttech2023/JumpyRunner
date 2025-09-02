export default class Score {
  score = 0;
  HIGH_SCORE_KEY = "dinoRunnerHighScore";
  crownImage = null;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY)) || 0;
    
    // Load crown icon for high score
    this.crownImage = new Image();
    this.crownImage.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFD700'%3E%3Cpath d='M12 2L8 7 3 4l1 7c0 5 4 9 8 9s8-4 8-9l1-7-5 3-4-5z'/%3E%3C/svg%3E";
  }

  update(frameTimeDelta) {
    this.score += frameTimeDelta * 0.01;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
      this.newHighScore = true;
      setTimeout(() => {
        this.newHighScore = false;
      }, 2000);
    }
  }

  draw() {
  const y = 20 * this.scaleRatio;
  const fontSize = 20 * this.scaleRatio;
  const padding = 10 * this.scaleRatio;
  const iconSize = 20 * this.scaleRatio;
  const cornerRadius = 10 * this.scaleRatio;

  const scoreText = Math.floor(this.score).toString().padStart(6, "0");
  const highScoreText = Math.floor(this.highScore).toString().padStart(6, "0");

  // ✅ Set font before measureText
  this.ctx.font = `bold ${fontSize}px 'Luckiest Guy', cursive, Arial`;
  this.ctx.textBaseline = "middle";

  // Now measure widths
  const scoreWidth = this.ctx.measureText(scoreText).width + padding * 2;
  const highScoreWidth =
    this.ctx.measureText(highScoreText).width +
    padding * 2 +
    iconSize +
    padding / 2;

  const scoreX = this.canvas.width - scoreWidth - 20 * this.scaleRatio;
  const highScoreX = scoreX - highScoreWidth - 15 * this.scaleRatio;

  // Draw high score box...
  const highScoreColor = this.newHighScore ? "#FFD700" : "#525252";
  const highScoreTextColor = this.newHighScore ? "#000000" : "#FFD700";

  this.drawScoreBox(
    highScoreX,
    y,
    highScoreWidth,
    fontSize + padding * 2,
    cornerRadius,
    highScoreColor
  );

  this.drawScoreBox(
    scoreX,
    y,
    scoreWidth,
    fontSize + padding * 2,
    cornerRadius,
    "#525252"
  );

  // Draw high score text with crown
  this.ctx.fillStyle = highScoreTextColor;
  if (this.crownImage.complete) {
    this.ctx.drawImage(
      this.crownImage,
      highScoreX + padding,
      y + padding - 2 * this.scaleRatio,
      iconSize,
      iconSize
    );
  }

  this.ctx.fillText(
    highScoreText,
    highScoreX + padding + iconSize + padding / 2,
    y + fontSize / 2 + padding
  );

  // Draw current score
  this.ctx.fillStyle = "#FFFFFF";
  this.ctx.fillText(
    scoreText,
    scoreX + padding,
    y + fontSize / 2 + padding
  );
}

  
  drawScoreBox(x, y, width, height, radius, color) {
    this.ctx.save();
    
    // Draw shadow
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    this.ctx.shadowBlur = 10 * this.scaleRatio;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 3 * this.scaleRatio;
    
    // Draw rounded rectangle
    this.ctx.fillStyle = color;
    this.roundRect(this.ctx, x, y, width, height, radius);
    this.ctx.fill();
    
    // Reset shadow
    this.ctx.shadowBlur = 0;
    
    // Draw border
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    this.ctx.lineWidth = 2 * this.scaleRatio;
    this.roundRect(this.ctx, x, y, width, height, radius);
    this.ctx.stroke();
    
    this.ctx.restore();
  }
  
  roundRect(ctx, x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }
}