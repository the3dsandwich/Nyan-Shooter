let characterXPos = 0;
let bullets = [];
let bulletFiringInterval = 0;
let enemySpawnInterval = 0;
let updatePositionInterval = 0;
let enemies = [];
let enemySpawnRate = 1000;
let score = 0;
let difficulty = 0;

// character movement

const updateCharacterPosition = (e) => {
  characterXPos =
    Math.floor(e.x / Math.floor(window.innerWidth / 12)) * (100 / 12);
  document
    .getElementById("character")
    .setAttribute("style", `left:${characterXPos}vw`);
};

// bullets

const drawBullet = (x) => {
  const newBullet = document.createElement("img");
  const id = `b-${x}-${Math.random().toString()}`;
  newBullet.setAttribute("src", "nyan.gif");
  newBullet.setAttribute("class", "bullet");
  newBullet.setAttribute("style", `left:${x}px`);
  newBullet.setAttribute("id", id);
  bullets.push({ id: id, x: x, y: 0 });
  document.getElementById("bullets-container").appendChild(newBullet);
};

const removeBullet = (id) => {
  bullets = bullets.filter((b) => b.id !== id);
  document.getElementById(id).remove();
};

const fireBullets = () => {
  drawBullet((characterXPos * window.innerWidth) / 100 + 20);
  drawBullet((characterXPos * window.innerWidth) / 100);
  drawBullet((characterXPos * window.innerWidth) / 100 - 20);
};

const toggleBulletFiring = () => {
  if (bulletFiringInterval !== 0) {
    clearInterval(bulletFiringInterval);
    bulletFiringInterval = 0;
  } else {
    fireBullets();
    bulletFiringInterval = setInterval(() => {
      fireBullets();
    }, 500);
  }
};

// enemy

const drawEnemy = () => {
  const newEnemy = document.createElement("img");
  const xPos = (Math.floor(Math.random() * 100) % 12) * 12;
  const id = `e-${xPos}-${Math.random().toString()}`;
  newEnemy.setAttribute("src", "enemy.png");
  newEnemy.setAttribute("class", "enemy");
  newEnemy.setAttribute("style", `left:${xPos}vh`);
  newEnemy.setAttribute("id", id);
  enemies.push({ id: id, x: xPos, y: 0, size: 1 });
  document.getElementById("enemy-container").appendChild(newEnemy);
};

const removeEnemy = (id) => {
  enemies = enemies.filter((e) => e.id !== id);
  document.getElementById(id).remove();
};

// move bullets and enemies

const touches = (a, b) => {
  if (a === null || b === null) {
    return false;
  }
  var aRect = a.getBoundingClientRect();
  var bRect = b.getBoundingClientRect();

  return !(
    aRect.top + aRect.height < bRect.top ||
    aRect.top > bRect.top + bRect.height ||
    aRect.left + aRect.width < bRect.left ||
    aRect.left > bRect.left + bRect.width
  );
};

const updatePosition = () => {
  for (const bullet of bullets) {
    bullet.y += 3;
    if (bullet.y > 100) {
      removeBullet(bullet.id);
    } else {
      document
        .getElementById(bullet.id)
        .setAttribute(
          "style",
          `left:${bullet.x}px; bottom:calc(5rem + ${bullet.y}vh)`
        );
      for (const enemy of enemies) {
        if (
          touches(
            document.getElementById(bullet.id),
            document.getElementById(enemy.id)
          )
        ) {
          // bullet touches enemy
          onBulletHitEnemy(bullet, enemy);
        }
      }
    }
  }

  for (const enemy of enemies) {
    enemy.y += 0.5;
    if (enemy.y > 100) {
      removeEnemy(enemy.id);
    } else if (
      touches(
        document.getElementById(enemy.id),
        document.getElementById("character")
      )
    ) {
      // enemy touches character
      gameEnd();
      break;
    } else {
      document
        .getElementById(enemy.id)
        .setAttribute("style", `left:${enemy.x}vw; top:${enemy.y}vh`);
    }
  }
};

// on bullet hit enemy

const onBulletHitEnemy = (bullet, enemy) => {
  removeBullet(bullet.id);
  removeEnemy(enemy.id);
  // score + 1
  increaseScore(1);
};

// score increase

const increaseScore = (by) => {
  score += by;
  onScoreIncrease(by);
};

const onScoreIncrease = (by) => {
  if ([10, 50, 200, 500].indexOf(score) > -1) {
    increaseDifficulty();
  }
  document.getElementById(
    "score-container"
  ).innerHTML = `<span>${score}</span>`;
};

// increase difficulty

const increaseDifficulty = () => {
  difficulty += 1;
  enemySpawnRate = [1000, 500, 100, 50, 10][difficulty];
  console.log(difficulty, enemySpawnRate);
};

// reset enemy spawn interval with new rate

const restartEnemySpawn = () => {
  clearInterval(enemySpawnInterval);
  enemySpawnInterval = setInterval(drawEnemy, enemySpawnRate);
};

// game driver

const main = () => {
  score = 0;
  addEventListener("mousemove", updateCharacterPosition);
  addEventListener("mousedown", toggleBulletFiring);
  updatePositionInterval = setInterval(updatePosition, 50);
  restartEnemySpawn();
};

const gameEnd = () => {
  alert("小夫我要進來囉~");
  bullets = [];
  enemies = [];
  difficulty = 0;
  enemySpawnRate = 1000;
  document.getElementById("bullets-container").innerHTML = "";
  document.getElementById("enemy-container").innerHTML = "";
  main();
};

// start game
main();
