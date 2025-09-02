export default class CoinsController {
  constructor(
    ctx,
    coinImage,
    scaleRatio,
    speed,
    gameHeight,
    groups,
    cactiController,
    onCollect // Sound callback
  ) {
    this.ctx = ctx;
    this.coinImage = coinImage;
    this.scaleRatio = scaleRatio;
    this.speed = speed;
    this.gameHeight = gameHeight;
    this.groups = groups;
    this.cactiController = cactiController; // Reference to obstacles controller
    this.onCollect = onCollect; // Sound callback

    this.coins = [];
    this.coinTimer = 0;
    this.coinInterval = 2000; // Time between coin group spawns

    this.collectedCoins = 0;
    this.totalCoins = 0;
    this.minDistanceFromEnemies = 300 * scaleRatio; // Minimum distance from obstacles
  }

  update(gameSpeed, frameTimeDelta, player) {
    // Spawn new coin groups
    this.coinTimer += frameTimeDelta;
    if (this.coinTimer > this.coinInterval) {
      this.coinTimer = 0;
      this.spawnCoinGroup();
    }

    // Update existing coins
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      coin.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;

      // Check for collision with player
      if (this.collideWith(player, coin)) {
        this.collectedCoins++;
        
        // Trigger coin collection sound callback
        if (this.onCollect) {
          this.onCollect();
        }
        
        this.coins.splice(i, 1);
        continue;
      }

      // Remove coins that are off-screen
      if (coin.x + coin.width < 0) {
        this.coins.splice(i, 1);
      }
    }
  }

  isTooCloseToEnemies(x, y) {
    // Check if position is too close to any enemy
    for (const cactus of this.cactiController.cacti) {
      const distance = Math.sqrt(
        Math.pow(x - cactus.x, 2) + Math.pow(y - cactus.y, 2)
      );
      if (distance < this.minDistanceFromEnemies) {
        return true;
      }
    }
    return false;
  }

  spawnCoinGroup() {
    const groupType = Math.floor(Math.random() * 3); // 0, 1, or 2
    let coinCount;

    switch (groupType) {
      case 0:
        coinCount = 3;
        break; // Triangle
      case 1:
        coinCount = 6;
        break; // Pyramid
      case 2:
        coinCount = 10;
        break; // Double row
      default:
        coinCount = 3;
    }

    // Try to find a safe position away from enemies
    let safePositionFound = false;
    let attempts = 0;
    let yPos, startX;

    while (!safePositionFound && attempts < 10) {
      // Position coins lower on the screen (60-70% of screen height)
      yPos = this.gameHeight * 0.6 + Math.random() * this.gameHeight * 0.1;
      startX = this.ctx.canvas.width + attempts * 50;

      if (!this.isTooCloseToEnemies(startX, yPos)) {
        safePositionFound = true;
      }
      attempts++;
    }

    // If we couldn't find a safe position after 10 attempts, place coins anyway
    if (!safePositionFound) {
      yPos = this.gameHeight * 0.65;
      startX = this.ctx.canvas.width + 500;
    }

    // Create coins in different patterns based on group type
    if (groupType === 0) {
      // Triangle pattern (3 coins)
      this.createTrianglePattern(startX, yPos, coinCount);
    } else if (groupType === 1) {
      // Pyramid pattern (5 coins)
      this.createPyramidPattern(startX, yPos, coinCount);
    } else {
      // Double row pattern (10 coins)
      this.createDoubleRowPattern(startX, yPos, coinCount);
    }

    this.totalCoins += coinCount;
  }

  createTrianglePattern(startX, startY, coinCount) {
    const spacing = 50 * this.scaleRatio;

    for (let i = 0; i < coinCount; i++) {
      const x = startX + i * spacing;
      const y = startY - (i % 2 === 0 ? 0 : spacing * 0.7);

      this.coins.push({
        x: x,
        y: y,
        width: 30 * this.scaleRatio,
        height: 30 * this.scaleRatio,
        collected: false,
      });
    }
  }

  createPyramidPattern(startX, startY, coinCount) {
    const spacing = 40 * this.scaleRatio;
    const rows = Math.ceil(Math.sqrt(coinCount));

    let coinIndex = 0;
    for (let row = 0; row < rows && coinIndex < coinCount; row++) {
      const coinsInRow = row + 1;
      const y = startY - row * spacing;

      for (let col = 0; col < coinsInRow && coinIndex < coinCount; col++) {
        const x = startX + (col - coinsInRow / 2 + 0.5) * spacing;

        this.coins.push({
          x: x,
          y: y,
          width: 30 * this.scaleRatio,
          height: 30 * this.scaleRatio,
          collected: false,
        });
        coinIndex++;
      }
    }
  }

  createDoubleRowPattern(startX, startY, coinCount) {
    const spacing = 45 * this.scaleRatio;
    const rowOffset = 35 * this.scaleRatio;

    for (let i = 0; i < coinCount; i++) {
      const row = i % 2;
      const positionInRow = Math.floor(i / 2);

      const x = startX + positionInRow * spacing;
      const y = startY - (row === 0 ? 0 : rowOffset);

      this.coins.push({
        x: x,
        y: y,
        width: 30 * this.scaleRatio,
        height: 30 * this.scaleRatio,
        collected: false,
      });
    }
  }

  collideWith(player, coin) {
    const playerX = player.x + player.width * 0.2;
    const playerY = player.y + player.height * 0.2;
    const playerWidth = player.width * 0.6;
    const playerHeight = player.height * 0.6;

    return (
      playerX < coin.x + coin.width &&
      playerX + playerWidth > coin.x &&
      playerY < coin.y + coin.height &&
      playerY + playerHeight > coin.y
    );
  }

  draw() {
    this.coins.forEach((coin) => {
      this.ctx.drawImage(
        this.coinImage,
        coin.x,
        coin.y,
        coin.width,
        coin.height
      );
    });
  }

  reset() {
    this.coins = [];
    this.coinTimer = 0;
    this.collectedCoins = 0;
    this.totalCoins = 0;
  }

  getCoinsInfo() {
    return {
      collected: this.collectedCoins,
      total: this.totalCoins,
    };
  }
}