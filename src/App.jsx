import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import "./App.css";
import Player from "./Player.js";
import Ground from "./Ground.js";
import CactiController from "./CactiController.js";
import Score from "./Score.js";
import bhalu from "./bhalu.png";
import tiger from "./tiger.png";
import volcano from "./volcano.png";
import themeImg from "./Themes/Theme.png";
import theme1Img from "./Themes/Theme1.jpg";
import theme2Img from "./Themes/Theme2.jfif";
import theme5Img from "./Themes/Theme5.jpg";

// Import character images
import dinoDefault from "./Costom/Char2/step1.png";
import dinoJump from "./Costom/Char2/step1.png";
import dinoStep2 from "./Costom/Char2/step2.png";
import dinoStep3 from "./Costom/Char2/step3.png";
import dinoStep4 from "./Costom/Char2/step4.png";
import dinoStep5 from "./Costom/Char2/step5.png";
import dinoStep6 from "./Costom/Char2/step6.png";
import dinoStep7 from "./Costom/Char2/step7.png";
import dinoStep8 from "./Costom/Char2/step8.png";

import rebitDefault from "./Costom/Char3/step1.png";
import rebitJump from "./Costom/Char3/step1.png";
import rebitStep2 from "./Costom/Char3/step2.png";
import rebitStep3 from "./Costom/Char3/step3.png";
import rebitStep4 from "./Costom/Char3/step4.png";
import rebitStep5 from "./Costom/Char3/step5.png";
import rebitStep6 from "./Costom/Char3/step6.png";
import rebitStep7 from "./Costom/Char3/step7.png";
import rebitStep8 from "./Costom/Char3/step8.png";

import boyDefault from "./Costom/Char4/step1.png";
import boyJump from "./Costom/Char4/step1.png";
import boyStep2 from "./Costom/Char4/step2.png";
import boyStep3 from "./Costom/Char4/step3.png";
import boyStep4 from "./Costom/Char4/step4.png";
import boyStep5 from "./Costom/Char4/step5.png";
import boyStep6 from "./Costom/Char4/step6.png";
import boyStep7 from "./Costom/Char4/step7.png";
import boyStep8 from "./Costom/Char4/step8.png";

// Import coin image
import coinImg from "./Costom/coin.png";

import {
  HomeIcon,
  ReplayIcon,
  SoundOnIcon,
  SoundOffIcon,
} from "./ReplayIcon.jsx";
import CoinsController from "./CoinsController.js";

import backgroundMusic from "./Costom/Sounds/background-music.mp3";
import jumpSound from "./Costom/Sounds/jump-sound.mp3";
import coinSound from "./Costom/Sounds/coin-sound.mp3";

function App() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("menu");
  const [selectedTheme, setSelectedTheme] = useState(theme5Img);
  const [selectedCharacter, setSelectedCharacter] = useState("dino");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [finalCoins, setFinalCoins] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [orientation, setOrientation] = useState(
    window.innerHeight > window.innerWidth ? "portrait" : "landscape"
  );

  // Audio refs
  const backgroundMusicRef = useRef(null);
  const jumpSoundRef = useRef(null);
  const coinSoundRef = useRef(null);

  // Character data
  const characters = [
    {
      id: "dino",
      name: "Peter",
      runImages: [
        dinoDefault,
        dinoStep2,
        dinoStep3,
        dinoStep4,
        dinoStep5,
        dinoStep6,
        dinoStep7,
        dinoStep8,
      ],
      jumpImage: dinoJump,
      preview: dinoDefault,
      description: "Classic runner with smooth animation",
    },
    {
      id: "rebit",
      name: "Rebit",
      runImages: [
        rebitDefault,
        rebitStep2,
        rebitStep3,
        rebitStep4,
        rebitStep5,
        rebitStep6,
        rebitStep7,
        rebitStep8,
      ],
      jumpImage: rebitJump,
      preview: rebitDefault,
      description: "A cute rabbit with a unique style",
    },
    {
      id: "boy",
      name: "Boy",
      runImages: [
        boyDefault,
        boyStep2,
        boyStep3,
        boyStep4,
        boyStep5,
        boyStep6,
        boyStep7,
        boyStep8,
      ],
      jumpImage: boyJump,
      preview: boyDefault,
      description: "A brave boy with a cool outfit",
    },
  ];

  // Theme data
  const themes = [
    { id: "desert", name: "Desert Dunes", image: themeImg },
    { id: "forest", name: "Mystic Forest", image: theme1Img },
    { id: "mountain", name: "Mountain Peaks", image: theme2Img },
    { id: "cave", name: "Dark Cave", image: theme5Img },
  ];

  // Check orientation function
  const checkOrientation = () => {
    return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  };

  // Add this function to handle manual full screen toggle
  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullScreen(true);

        // Lock orientation to landscape on mobile after entering full screen
        if (
          isMobile &&
          window.screen.orientation &&
          window.screen.orientation.lock
        ) {
          try {
            await window.screen.orientation.lock("landscape");
            setOrientation("landscape");
          } catch (error) {
            console.log("Orientation lock failed:", error);
          }
        }
      } else {
        await document.exitFullscreen();
        setIsFullScreen(false);
      }
    } catch (error) {
      console.log("Full screen toggle failed:", error);
    }
  };

  // Initialize audio elements
  useEffect(() => {
    backgroundMusicRef.current = new Audio(backgroundMusic);
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = 0.3;

    jumpSoundRef.current = new Audio(jumpSound);
    jumpSoundRef.current.volume = 0.5;

    coinSoundRef.current = new Audio(coinSound);
    coinSoundRef.current.volume = 0.7;

    // Cleanup on unmount
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(checkOrientation());
    };

    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    // Set up event listeners
    window.addEventListener("resize", handleOrientationChange);
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    if (window.screen.orientation) {
      window.screen.orientation.addEventListener(
        "change",
        handleOrientationChange
      );
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleOrientationChange);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);

      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener(
          "change",
          handleOrientationChange
        );
      }
    };
  }, []);

  // Lock orientation and enter full screen when game starts on mobile
  useEffect(() => {
    const handleMobileGameStart = async () => {
      if (isMobile && gameState === "playing") {
        // Enter full screen
        if (!document.fullscreenElement) {
          try {
            await document.documentElement.requestFullscreen();
            setIsFullScreen(true);
          } catch (error) {
            console.log("Full screen request failed:", error);
          }
        }

        // Lock orientation to landscape
        if (window.screen.orientation && window.screen.orientation.lock) {
          try {
            await window.screen.orientation.lock("landscape");
            setOrientation("landscape");
          } catch (error) {
            console.log("Orientation lock failed:", error);
          }
        }
      }
    };

    handleMobileGameStart();
  }, [gameState, isMobile]);

  // Handle sound toggle
  const toggleSound = () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);

    if (backgroundMusicRef.current) {
      if (newSoundState) {
        if (gameState === "playing") {
          backgroundMusicRef.current
            .play()
            .catch((e) => console.log("Audio play error:", e));
        }
      } else {
        backgroundMusicRef.current.pause();
      }
    }
  };

  useEffect(() => {
    if (!backgroundMusicRef.current) return;

    if (gameState === "playing" && soundEnabled) {
      backgroundMusicRef.current
        .play()
        .catch((e) => console.log("Audio play error:", e));
    } else {
      backgroundMusicRef.current.pause();

      if (gameState === "menu") {
        backgroundMusicRef.current.currentTime = 0;
      }
    }
  }, [gameState, soundEnabled]);

  useEffect(() => {
    const handleUserGesture = () => {
      if (backgroundMusicRef.current && soundEnabled) {
        backgroundMusicRef.current
          .play()
          .catch((e) => console.log("Music blocked:", e));
      }
      window.removeEventListener("click", handleUserGesture);
      window.removeEventListener("touchstart", handleUserGesture);
    };

    window.addEventListener("click", handleUserGesture);
    window.addEventListener("touchstart", handleUserGesture);

    return () => {
      window.removeEventListener("click", handleUserGesture);
      window.removeEventListener("touchstart", handleUserGesture);
    };
  }, [soundEnabled]);

  useEffect(() => {
    // Load high score and coins from localStorage
    const savedHighScore = localStorage.getItem("dinoRunnerHighScore");
    const savedTotalCoins = localStorage.getItem("dinoRunnerTotalCoins");
    const savedSoundSetting = localStorage.getItem("dinoRunnerSoundEnabled");

    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    if (savedTotalCoins) {
      setTotalCoins(parseInt(savedTotalCoins));
    }
    if (savedSoundSetting !== null) {
      setSoundEnabled(savedSoundSetting === "true");
    }
  }, []);

  useEffect(() => {
    // Save sound setting to localStorage
    localStorage.setItem("dinoRunnerSoundEnabled", soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    if (gameState === "loading") {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setGameState("playing");
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // === Background Image Setup ===
    const bgImage = new Image();
    bgImage.src = selectedTheme;
    let bgOffset = 0;
    const BG_SCROLL_SPEED = 0.2;

    function drawBackground(frameTimeDelta, isGameStarted) {
      if (isGameStarted) {
        bgOffset -= BG_SCROLL_SPEED * frameTimeDelta * 0.05;
        if (bgOffset <= -bgImage.width) {
          bgOffset += bgImage.width;
        }
      }

      const numImages = Math.ceil(canvas.width / bgImage.width) + 1;
      for (let i = 0; i < numImages; i++) {
        ctx.drawImage(
          bgImage,
          bgOffset + i * bgImage.width,
          0,
          bgImage.width,
          canvas.height
        );
      }
    }

    // === Game Constants ===
    const GAME_SPEED_START = 1;
    const GAME_SPEED_INCREMENT = 0.00001;
    const ASPECT_RATIO = 800 / 350;
    let GAME_WIDTH, GAME_HEIGHT;

    // Calculate game dimensions based on device
    if (isMobile) {
      // For mobile, use the full available space
      GAME_WIDTH = window.innerWidth;
      GAME_HEIGHT = window.innerHeight;
    } else {
      if (window.innerWidth / window.innerHeight > ASPECT_RATIO) {
        GAME_HEIGHT = window.innerHeight;
        GAME_WIDTH = GAME_HEIGHT * ASPECT_RATIO;
      } else {
        GAME_WIDTH = window.innerWidth;
        GAME_HEIGHT = GAME_WIDTH / ASPECT_RATIO;
      }
    }

    // Adjust player size for mobile
    const PLAYER_WIDTH = isMobile ? 88 / 2 : 88 / 1.5;
    const PLAYER_HEIGHT = isMobile ? 94 / 2 : 94 / 1.5;

    // Adjust jump height for mobile
    const MAX_JUMP_HEIGHT = isMobile ? GAME_HEIGHT * 0.6 : GAME_HEIGHT * 0.8;
    const MIN_JUMP_HEIGHT = isMobile ? GAME_HEIGHT * 0.2 : GAME_HEIGHT * 0.3;

    const GROUND_WIDTH = 2400;
    const GROUND_HEIGHT = isMobile ? 30 : 24;
    const GROUND_AND_CACTUS_SPEED = 0.5;

    const CACTI_CONFIG = [
      {
        width: isMobile ? 150 / 2 : 150 / 1.5,
        height: isMobile ? 130 / 2 : 130 / 1.5,
        image: bhalu,
      },
      {
        width: isMobile ? 120 / 2 : 120 / 1.5,
        height: isMobile ? 130 / 2 : 130 / 1.5,
        image: tiger,
      },
      {
        width: isMobile ? 150 / 2 : 150 / 1.5,
        height: isMobile ? 130 / 2 : 130 / 1.5,
        image: volcano,
      },
    ];

    // Coin setup
    const coinImage = new Image();
    coinImage.src = coinImg;
    const COIN_GROUPS = [3, 6, 10];

    // === Game Objects ===
    let player = null;
    let ground = null;
    let cactiController = null;
    let coinsController = null;
    let score = null;

    let scaleRatio = null;
    let previousTime = null;
    let gameSpeed = GAME_SPEED_START;
    let gameOver = false;
    let hasAddedEventListenersForRestart = false;
    let waitingToStart = true;

    function createSprites() {
      const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
      const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
      const minJumpHeightInGame = MIN_JUMP_HEIGHT;
      const maxJumpHeightInGame = MAX_JUMP_HEIGHT;

      const groundWidthInGame = GROUND_WIDTH * scaleRatio;
      const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

      // Get selected character data
      const characterData = characters.find((c) => c.id === selectedCharacter);

      player = new Player(
        ctx,
        playerWidthInGame,
        playerHeightInGame,
        minJumpHeightInGame,
        maxJumpHeightInGame,
        scaleRatio,
        characterData,
        GAME_HEIGHT,
        () => {
          // Jump callback function
          if (soundEnabled && jumpSoundRef.current) {
            jumpSoundRef.current.currentTime = 0;
            jumpSoundRef.current
              .play()
              .catch((e) => console.log("Jump sound error:", e));
          }
        }
      );

      ground = new Ground(
        ctx,
        groundWidthInGame,
        groundHeightInGame,
        GROUND_AND_CACTUS_SPEED,
        scaleRatio,
        GAME_HEIGHT
      );

      const cactiImages = CACTI_CONFIG.map((cactus) => {
        const image = new Image();
        image.src = cactus.image;
        return {
          image: image,
          width: cactus.width * scaleRatio,
          height: cactus.height * scaleRatio,
        };
      });

      cactiController = new CactiController(
        ctx,
        cactiImages,
        scaleRatio,
        GROUND_AND_CACTUS_SPEED,
        GAME_HEIGHT
      );

      // Create coins controller
      coinsController = new CoinsController(
        ctx,
        coinImage,
        scaleRatio,
        GROUND_AND_CACTUS_SPEED,
        GAME_HEIGHT,
        COIN_GROUPS,
        cactiController,
        () => {
          // Coin collection callback function
          if (soundEnabled && coinSoundRef.current) {
            coinSoundRef.current.currentTime = 0;
            coinSoundRef.current
              .play()
              .catch((e) => console.log("Coin sound error:", e));
          }
        }
      );

      score = new Score(ctx, scaleRatio, GAME_WIDTH);
    }

    function setScreen() {
      scaleRatio = getScaleRatio();

      // Use window's inner dimensions in full screen
      if (document.fullscreenElement) {
        GAME_WIDTH = window.innerWidth;
        GAME_HEIGHT = window.innerHeight;
      } else if (isMobile) {
        // For mobile, use full screen dimensions
        GAME_WIDTH = window.innerWidth;
        GAME_HEIGHT = window.innerHeight;
      } else if (window.innerWidth / window.innerHeight > ASPECT_RATIO) {
        GAME_HEIGHT = window.innerHeight;
        GAME_WIDTH = GAME_HEIGHT * ASPECT_RATIO;
      } else {
        GAME_WIDTH = window.innerWidth;
        GAME_HEIGHT = GAME_WIDTH / ASPECT_RATIO;
      }

      canvas.width = GAME_WIDTH;
      canvas.height = GAME_HEIGHT;
      createSprites();
    }

    function getScaleRatio() {
      if (isMobile) {
        // Different scaling for mobile devices
        return Math.min(window.innerWidth / 400, window.innerHeight / 250);
      }
      return Math.min(window.innerWidth / 800, window.innerHeight / 350);
    }

    function showGameOver() {
      const fontSize = isMobile ? 40 * scaleRatio : 70 * scaleRatio;
      ctx.font = `${fontSize}px 'Luckiest Guy', cursive`;
      ctx.fillStyle = "#ff4d4d";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 4;
      const x = canvas.width / 2 - (fontSize * 4) / 2;
      const y = canvas.height / 2;
      ctx.strokeText("GAME OVER", x, y);
      ctx.fillText("GAME OVER", x, y);
    }

    function drawCoinsCounter() {
      const coinsInfo = coinsController.getCoinsInfo();
      const fontSize = isMobile ? 12 * scaleRatio : 15 * scaleRatio;
      const padding = isMobile ? 4 * scaleRatio : 5 * scaleRatio;
      const coinSize = isMobile ? 16 * scaleRatio : 20 * scaleRatio;

      // Calculate dimensions
      const text = `Coins: ${coinsInfo.collected}/${coinsInfo.total}`;
      const textWidth = ctx.measureText(text).width;
      const totalWidth = coinSize + padding + textWidth + padding * 2;

      // Position → left corner
      const x = 20 * scaleRatio;
      const y = 20 * scaleRatio;

      // Draw semi-transparent background
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(x, y, totalWidth, coinSize + padding * 2);

      // Draw coin icon
      ctx.drawImage(coinImage, x + padding, y + padding, coinSize, coinSize);

      // Draw text with outline
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textBaseline = "middle";

      // Text outline
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3 * scaleRatio;
      ctx.strokeText(
        text,
        x + padding + coinSize + padding,
        y + padding + coinSize / 2
      );

      // Text fill
      ctx.fillStyle = "#FFD700";
      ctx.fillText(
        text,
        x + padding + coinSize + padding,
        y + padding + coinSize / 2
      );
    }

    function setupGameReset() {
      if (!hasAddedEventListenersForRestart) {
        hasAddedEventListenersForRestart = true;
        setFinalScore(score.score);

        const coinsInfo = coinsController.getCoinsInfo();
        setFinalCoins(coinsInfo.collected);

        // Update high score and total coins
        if (score.score > highScore) {
          setHighScore(score.score);
          localStorage.setItem("dinoRunnerHighScore", score.score);
        }

        const newTotalCoins = totalCoins + coinsInfo.collected;
        setTotalCoins(newTotalCoins);
        localStorage.setItem("dinoRunnerTotalCoins", newTotalCoins);

        setGameState("gameOver");
      }
    }

    function reset() {
      hasAddedEventListenersForRestart = false;
      gameOver = false;
      waitingToStart = false;
      ground.reset();
      cactiController.reset();
      coinsController.reset();
      score.reset();
      gameSpeed = GAME_SPEED_START;
    }

    function showStartGameText() {
      const fontSize = isMobile ? 20 * scaleRatio : 40 * scaleRatio;
      ctx.font = `${fontSize}px 'Luckiest Guy', cursive`;
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      const text = "Tap Screen or Press Space To Start";
      const textWidth = ctx.measureText(text).width;
      const x = (canvas.width - textWidth) / 2;
      const y = canvas.height / 2;
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
    }

    function updateGameSpeed(frameTimeDelta) {
      gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
    }

    function clearScreen(frameTimeDelta) {
      drawBackground(frameTimeDelta, !waitingToStart && !gameOver);
    }

    function gameLoop(currentTime) {
      if (previousTime === null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
      }
      const frameTimeDelta = currentTime - previousTime;
      previousTime = currentTime;

      clearScreen(frameTimeDelta);

      if (!gameOver && !waitingToStart) {
        ground.update(gameSpeed, frameTimeDelta);
        cactiController.update(gameSpeed, frameTimeDelta);
        coinsController.update(gameSpeed, frameTimeDelta, player);
        player.update(gameSpeed, frameTimeDelta);
        score.update(frameTimeDelta);
        updateGameSpeed(frameTimeDelta);
      }

      if (!gameOver && cactiController.collideWith(player)) {
        gameOver = true;
        setupGameReset();
      }

      ground.draw();
      cactiController.draw();
      coinsController.draw();
      player.draw();
      score.draw();
      drawCoinsCounter();

      if (gameOver) {
        showGameOver();
      }

      if (waitingToStart) {
        showStartGameText();
      }

      requestAnimationFrame(gameLoop);
    }

    // Wait for images to load before starting game
    let imagesLoaded = 0;
    const totalImages = 1;

    function checkAllImagesLoaded() {
      imagesLoaded++;
      if (imagesLoaded >= totalImages) {
        setScreen();
        window.addEventListener("resize", () => setTimeout(setScreen, 500));
        if (screen.orientation) {
          screen.orientation.addEventListener("change", setScreen);
        }
        requestAnimationFrame(gameLoop);

        window.addEventListener("keyup", reset, { once: true });
        window.addEventListener("touchstart", reset, { once: true });
      }
    }

    bgImage.onload = checkAllImagesLoaded;

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", setScreen);
      if (screen.orientation) {
        screen.orientation.removeEventListener("change", setScreen);
      }
      window.removeEventListener("keyup", reset);
      window.removeEventListener("touchstart", reset);
    };
  }, [gameState, selectedTheme, selectedCharacter, soundEnabled]);

  const startGame = () => {
    setIsTransitioning(true);
    setGameState("loading");
    setLoadingProgress(0);
    setIsTransitioning(false);

    if (backgroundMusicRef.current && soundEnabled) {
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current
        .play()
        .catch((e) => console.log("Music play error:", e));
    }
  };

  const restartGame = () => {
    setGameState("loading");
    setLoadingProgress(0);
  };

  const goToMenu = () => {
    setGameState("menu");
  };

  const selectTheme = (theme) => {
    setSelectedTheme(theme);
  };

  const selectCharacter = (characterId) => {
    setSelectedCharacter(characterId);
  };

  // Show orientation warning on mobile in portrait mode
  const showOrientationWarning = isMobile && orientation === "portrait";

  return (
    <>
      {showOrientationWarning && (
        <div className="orientation-warning visible">
          <div className="rotate-icon">🔄</div>
          <h2>Please rotate your device</h2>
          <p>
            This game works best in landscape mode. Please rotate your device to
            continue playing.
          </p>
          <button className="fullscreen-button" onClick={toggleFullScreen}>
            {isFullScreen ? "Exit Full Screen" : "Go Full Screen"}
          </button>
        </div>
      )}

      {gameState === "loading" && (
        <div className="loading-container">
          <div className="loader-wrapper">
            <div className="game-logo">JUMPY RUNNER</div>
            <div className="loader">
              <div className="loader-bar">
                <div
                  className="loader-progress"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <div className="loader-text">Loading... {loadingProgress}%</div>
            </div>
            <div className="loader-tip">
              Tip: Press SPACE or TAP to jump over obstacles and collect coins!
            </div>
          </div>
        </div>
      )}

      {gameState === "menu" && !showOrientationWarning && (
        <div className="menu-container">
          <div className="menu-background"></div>

          <div className="menu-content">
            <h1 className="game-title">JUMPY RUNNER</h1>

            <div className="total-coins-display">
              <span className="coins-icon">$</span>
              <span className="total-coins">{totalCoins}</span>
            </div>

            <div className="sound-toggle-menu" onClick={toggleSound}>
              {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
            </div>

            <div className="menu-options">
              <button className="menu-button play-button" onClick={startGame}>
                PLAY GAME
              </button>

              <div className="menu-section">
                <h2 className="menu-section-title">SELECT CHARACTER</h2>
                <div className="character-grid">
                  {characters.map((character) => (
                    <div
                      key={character.id}
                      className={`character-card ${
                        selectedCharacter === character.id ? "selected" : ""
                      }`}
                      onClick={() => selectCharacter(character.id)}
                    >
                      <div className="character-image">
                        <img src={character.preview} alt={character.name} />
                      </div>
                      <div className="character-info">
                        <h3>{character.name}</h3>
                        <p>{character.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="menu-section">
                <h2 className="menu-section-title">SELECT THEME</h2>
                <div className="theme-grid">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`theme-card ${
                        selectedTheme === theme.image ? "selected" : ""
                      }`}
                      onClick={() => selectTheme(theme.image)}
                    >
                      <div className="theme-image">
                        <img src={theme.image} alt={theme.name} />
                        <div className="theme-overlay">
                          <span>{theme.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {isTransitioning && <div className="transition-overlay"></div>}
        </div>
      )}

      {gameState === "gameOver" && !showOrientationWarning && (
        <div className="game-over-container">
          <div className="game-over-background"></div>

          <div className="game-over-content">
            <div className="game-over-card">
              <h2 className="game-over-title">Game Over</h2>

              <div className="score-display">
                <div className="score-item">
                  <span className="score-label">Your Score</span>
                  <span className="score-value">
                    {parseFloat(finalScore.toFixed(0))}
                  </span>
                </div>

                <div className="score-item">
                  <span className="score-label">Coins Collected</span>
                  <span className="score-value">{finalCoins}</span>
                </div>

                <div className="score-item">
                  <span className="score-label">High Score</span>
                  <span className="score-value">
                    {parseFloat(highScore.toFixed(0))}
                  </span>
                </div>

                <div className="score-item">
                  <span className="score-label">Total Coins</span>
                  <span className="score-value">{totalCoins}</span>
                </div>
              </div>

              <div className="game-over-actions">
                <button
                  className="action-button replay-button"
                  onClick={restartGame}
                >
                  <ReplayIcon />
                  <span>Play Again</span>
                </button>

                <button
                  className="action-button menu-button"
                  onClick={goToMenu}
                >
                  <HomeIcon />
                  <span>Main Menu</span>
                </button>
              </div>

              <div className="sound-toggle-game-over" onClick={toggleSound}>
                {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === "playing" && !showOrientationWarning && (
        <div className={`game-container ${isFullScreen ? "fullscreen" : ""}`}>
          {isMobile && (
            <button
              className="fullscreen-button floating-fullscreen-btn"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? "Exit Full" : "Full Screen"}
            </button>
          )}
          <canvas ref={canvasRef} id="game"></canvas>
        </div>
      )}
    </>
  );
}

export default App;
