// manayOS — main application script

let nextZIndex = 100;
const openWindows = {};

const boot = document.getElementById("boot");
const menu = document.getElementById("menu");
const desktop = document.getElementById("desktop");
const dock = document.getElementById("dock");
const gameScreen = document.getElementById("game");

// ============ BOOT SEQUENCE ============

let bootProgress = 0;
const bootTimer = setInterval(() => {
  bootProgress += Math.random() * 18 + 5;
  if (bootProgress >= 100) {
    bootProgress = 100;
    clearInterval(bootTimer);
    document.getElementById("boot-btn").classList.remove("hidden");
  }
  document.getElementById("boot-fill").style.width = bootProgress + "%";
  document.getElementById("boot-pct").textContent = Math.floor(bootProgress) + "%";
}, 220);

document.getElementById("boot-btn").addEventListener("click", function () {
  boot.style.opacity = "0";
  boot.style.transition = "opacity 0.4s";
  setTimeout(() => {
    boot.classList.add("hidden");
    menu.classList.remove("hidden");
    desktop.classList.remove("hidden");
    dock.classList.remove("hidden");
  }, 400);
});

// ============ CLOCK ============

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("time").textContent = `${h}:${m}:${s}`;
}
updateClock();
setInterval(updateClock, 1000);
// ============ WALLPAPER SWITCHER ============

const wallpapers = ["space.png", "space1.png", "space2.png"];
let wallpaperIndex = parseInt(localStorage.getItem("manay-wallpaper") || "0");

function applyWallpaper() {
  desktop.style.backgroundImage = `url('${wallpapers[wallpaperIndex]}')`;
}
applyWallpaper();

document.getElementById("bg-btn").addEventListener("click", () => {
  wallpaperIndex = (wallpaperIndex + 1) % wallpapers.length;
  localStorage.setItem("manay-wallpaper", wallpaperIndex);
  applyWallpaper();
});
// ============ MENU & ICONS ============

document.querySelectorAll(".menu-link").forEach(link => {
  link.addEventListener("click", () => openApp(link.dataset.app));
});

document.querySelectorAll(".icon").forEach(icon => {
  let clickCount = 0;
  icon.addEventListener("click", () => {
    clickCount++;
    if (clickCount === 1) {
      setTimeout(() => {
        if (clickCount >= 2) openApp(icon.dataset.app);
        clickCount = 0;
      }, 280);
    }
  });
});

// number keys 1-7 launch apps
const shortcutMap = { "1": "about", "2": "notes", "3": "terminal", "4": "synth", "5": "draw", "6": "calc", "7": "game" };
document.addEventListener("keydown", e => {
  const tag = document.activeElement.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (shortcutMap[e.key]) openApp(shortcutMap[e.key]);
});

// ============ APP DEFINITIONS ============

const apps = {
  about: {
    title: "About Me", width: 340, height: 360,
    render: () => `
      <div class="app-about">
        <div class="about-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/></svg></div>
        <h2 class="about-name">Manay</h2>
        <p class="about-text">hey! i built this whole OS from scratch using html, css &amp; javascript. i enjoy many things and this sure was one of it. i spent a long time figuring out what it was gonna be about and after 3 hours of planning and around 2.5-3 hours of coding i finally completed it. and yes ai helped me with the base but to make it more creative i added way more features and i reworked the css sooo much because the ai one looked kinda boring.</p>
        <p class="about-text">drag windows, draw something, make noise on the synth, or dodge meteors. no password ever.</p>
        <div class="tags"><span class="tag">html</span><span class="tag">css</span><span class="tag">js</span><span class="tag">hack club</span></div>
      </div>`,
  },

  notes: {
    title: "Notes", width: 340, height: 300,
    render: () => `<textarea id="notes-area" placeholder="type stuff..."></textarea>`,
    init: (win) => {
      const ta = win.querySelector("#notes-area");
      ta.value = localStorage.getItem("manay-notes") || "";
      ta.addEventListener("input", () => localStorage.setItem("manay-notes", ta.value));
      ta.focus();
    },
  },

  terminal: {
    title: "Terminal", width: 400, height: 320,
    render: () => `
      <div class="terminal">
        <div class="term-out" id="term-output">manayOS shell
type 'help' for commands
</div>
        <div class="term-row"><span>$</span><input id="term-input" class="term-in" autocomplete="off" spellcheck="false"></div>
      </div>`,
    init: (win) => {
      const output = win.querySelector("#term-output");
      const input = win.querySelector("#term-input");
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

      const commands = {
        help: () => [
          "manayOS — available commands:",
          "  help      show this command list",
          "  whoami    who is logged in",
          "  date      today's date",
          "  time      the current time",
          "  echo txt  repeat your text back",
          "  joke      a random programming joke",
          "  quote     a random inspiring quote",
          "  fortune   your fortune cookie",
          "  8ball     ask the magic 8-ball",
          "  roll      roll a six-sided dice",
          "  flip      flip a coin",
          "  rps       rock, paper, scissors",
          "  color     a random hex color",
          "  ascii     a little ascii cat",
          "  ls        list the apps",
          "  apps      what's installed",
          "  calc      a quick math demo",
          "  myskills  a bit about me",
          "  favsport  my favorite sport",
          "  hobbies   what i do for fun",
          "  secret    find the easter egg",
          "  clear     wipe the screen",
        ].join("\n"),

        whoami: () => "guest@manayOS",
        date: () => new Date().toDateString(),
        time: () => new Date().toLocaleTimeString(),

        joke: () => pick([
          "why do programmers prefer dark mode? because light attracts bugs.",
          "there are 10 types of people: those who read binary and those who don't.",
          "why did the developer go broke? he used up all his cache.",
          "a SQL query walks into a bar, sees two tables and asks: mind if i join you?",
        ]),

        quote: () => pick([
          "\"code is like humor. when you have to explain it, it's bad.\"",
          "\"first solve the problem, then write the code.\"",
          "\"make it work, make it right, make it fast.\"",
          "\"simplicity is the soul of efficiency.\"",
        ]),

        fortune: () => pick([
          "a bug you squash today saves a headache tomorrow.",
          "great things are coming your way.",
          "you will write beautiful code this week.",
          "take a break — you've earned it.",
        ]),

        "8ball": () => pick(["yes.", "no.", "definitely!", "ask again later.", "not a chance.", "for sure.", "hmm, maybe."]),
        roll: () => "you rolled a " + (Math.floor(Math.random() * 6) + 1),
        flip: () => (Math.random() < 0.5 ? "heads" : "tails"),
        rps: () => "i pick... " + pick(["rock", "paper", "scissors"]),

        color: () => "your random color: #" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
        ascii: () => "  /\\_/\\\n ( o.o )\n  > ^ <",

        ls: () => "about  notes  terminal  synth  draw  calc  game",
        apps: () => "installed: About, Notes, Terminal, Synth, Draw, Calculator, Game",
        calc: () => "example: 7 * 6 = " + (7 * 6),

        myskills: () => "I like playing the flute and I love coding. I'm a beginner though.",
        favsport: () => "My favorite sport is badminton because it's FUNN.",
        hobbies: () => "flute, coding, badminton, and building tiny web operating systems.",
        secret: () => "you found the secret lol! psst... try 'joke', or hit the Wallpaper button up top trusttt.",

        clear: () => { output.textContent = ""; return null; },
      };
      const log = (t) => { output.textContent += t + "\n"; output.scrollTop = output.scrollHeight; };
      input.addEventListener("keydown", e => {
        if (e.key !== "Enter") return;
        const cmd = input.value.trim();
        log("$ " + cmd);
        input.value = "";
        if (!cmd) return;
        if (cmd.toLowerCase().startsWith("echo ")) return log(cmd.slice(5));
        const fn = commands[cmd.toLowerCase()];
        const result = fn ? fn() : `command not found: ${cmd}`;
        if (result) log(result);
      });
      input.focus();
    },
  },

  synth: {
    title: "Synth", width: 380, height: 200,
    render: () => {
      const notes = ["C", "D", "E", "F", "G", "A", "B"];
      return `<div class="synth-keys">${notes.map(n => `<button class="key" data-note="${n}" type="button">${n}</button>`).join("")}</div>`;
    },
    init: (win) => {
      const freq = { C: 261.6, D: 293.7, E: 329.6, F: 349.2, G: 392, A: 440, B: 493.9 };
      let audioContext;
      win.querySelectorAll(".key").forEach(key => {
        key.addEventListener("mousedown", () => {
          if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.type = "triangle";
          osc.frequency.value = freq[key.dataset.note];
          gain.gain.setValueAtTime(0.2, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.6);
          osc.connect(gain).connect(audioContext.destination);
          osc.start();
          osc.stop(audioContext.currentTime + 0.6);
        });
      });
    },
  },

  draw: {
    title: "Draw", width: 460, height: 360,
    render: () => `
      <div class="draw-wrap">
        <div class="draw-toolbar">
          <div class="draw-color active" style="background:#fff" data-color="#fff"></div>
          <div class="draw-color" style="background:#22d3ee" data-color="#22d3ee"></div>
          <div class="draw-color" style="background:#a855f7" data-color="#a855f7"></div>
          <div class="draw-color" style="background:#ec4899" data-color="#ec4899"></div>
          <div class="draw-color" style="background:#fbbf24" data-color="#fbbf24"></div>
          <div class="draw-color" style="background:#34d399" data-color="#34d399"></div>
          <input type="range" id="brush-size" min="1" max="30" value="3">
          <button id="draw-clear" type="button">Clear</button>
          <button id="draw-save" type="button">Save</button>
        </div>
        <canvas id="draw-canvas"></canvas>
      </div>`,
    init: (win) => {
      const canvas = win.querySelector("#draw-canvas");
      const ctx = canvas.getContext("2d");
      const surface = "#0b0b1e";
      let drawing = false, color = "#fff", size = 3;

      function fitCanvas() {
        const wrap = canvas.parentElement.getBoundingClientRect();
        const toolbar = win.querySelector(".draw-toolbar").offsetHeight;
        canvas.width = wrap.width;
        canvas.height = wrap.height - toolbar;
        ctx.fillStyle = surface;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      setTimeout(fitCanvas, 0);

      const pos = (e) => {
        const r = canvas.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      };

      canvas.addEventListener("mousedown", e => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
      canvas.addEventListener("mousemove", e => {
        if (!drawing) return;
        const p = pos(e);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = color; ctx.lineWidth = size; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.stroke();
      });
      window.addEventListener("mouseup", () => { drawing = false; });

      win.querySelectorAll(".draw-color").forEach(sw => {
        sw.addEventListener("click", () => {
          win.querySelectorAll(".draw-color").forEach(s => s.classList.remove("active"));
          sw.classList.add("active");
          color = sw.dataset.color;
        });
      });
      win.querySelector("#brush-size").addEventListener("input", e => { size = Number(e.target.value); });
      win.querySelector("#draw-clear").addEventListener("click", () => { ctx.fillStyle = surface; ctx.fillRect(0, 0, canvas.width, canvas.height); });
      win.querySelector("#draw-save").addEventListener("click", () => {
        const link = document.createElement("a");
        link.download = "manayos-drawing.png";
        link.href = canvas.toDataURL();
        link.click();
      });

      new ResizeObserver(() => fitCanvas()).observe(win);
    },
  },

  calc: {
    title: "Calculator", width: 260, height: 340,
    render: () => `
      <div class="calc-wrap">
        <div class="calc-screen" id="calc-screen">0</div>
        <div class="calc-grid">
          <button data-key="clear">C</button>
          <button data-key="(" class="op">(</button>
          <button data-key=")" class="op">)</button>
          <button data-key="/" class="op">÷</button>
          <button data-key="7">7</button><button data-key="8">8</button><button data-key="9">9</button>
          <button data-key="*" class="op">×</button>
          <button data-key="4">4</button><button data-key="5">5</button><button data-key="6">6</button>
          <button data-key="-" class="op">−</button>
          <button data-key="1">1</button><button data-key="2">2</button><button data-key="3">3</button>
          <button data-key="+" class="op">+</button>
          <button data-key="0">0</button><button data-key=".">.</button>
          <button data-key="back">⌫</button>
          <button data-key="=" class="equals">=</button>
        </div>
      </div>`,
    init: (win) => {
      const screen = win.querySelector("#calc-screen");
      let expr = "";
      const compute = (s) => {
        if (!/^[0-9+\-*/().\s]+$/.test(s)) return "Error";
        try { return Function(`"use strict"; return (${s})`)(); } catch { return "Error"; }
      };
      win.querySelectorAll(".calc-grid button").forEach(btn => {
        btn.addEventListener("click", () => {
          const key = btn.dataset.key;
          if (key === "clear") expr = "";
          else if (key === "back") expr = expr.slice(0, -1);
          else if (key === "=") expr = String(compute(expr));
          else expr += key;
          screen.textContent = expr || "0";
        });
      });
    },
  },

  settings: {
    title: "Settings", width: 300, height: 280,
    render: () => `
      <div class="settings-group"><h3>SYSTEM</h3>
        <div class="settings-row"><span>Theme</span> <span>Deep Space</span></div>
        <div class="settings-row"><span>Fonts</span> <span>Space Grotesk / JetBrains Mono</span></div>
      </div>
      <div class="settings-group"><h3>SHORTCUTS</h3>
        <div class="settings-row"><span>1 – 7</span> <span>launch apps</span></div>
        <div class="settings-row"><span>Esc</span> <span>close window / exit game</span></div>
      </div>
      <div class="settings-group"><h3>ABOUT</h3>
        <div class="settings-row"><span>Built for</span> <span>Hack Club Jam</span></div>
        <div class="settings-row"><span>No password</span> <span>yes</span></div>
      </div>`,
  },
};

// fallback glyph for apps with no desktop icon (settings)
const fallbackGlyphs = {
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/></svg>`,
};

// ============ WINDOW MANAGER ============

function openApp(appId) {
  if (appId === "game") { launchGame(); return; }

  if (openWindows[appId]) {
    openWindows[appId].style.display = "flex";
    focusWindow(openWindows[appId]);
    return;
  }

  const app = apps[appId];
  if (!app) return;

  const win = document.createElement("div");
  win.className = "window";
  win.dataset.app = appId;

  const titlebar = document.createElement("div");
  titlebar.className = "titlebar";
  titlebar.innerHTML = `<span class="titlebar-name">${app.title}</span><button class="win-close" type="button">✕</button>`;

  const content = document.createElement("div");
  content.className = "content";
  content.innerHTML = app.render();

  const resize = document.createElement("div");
  resize.className = "resize-handle";

  win.append(titlebar, content, resize);
  win.style.width = app.width + "px";
  win.style.height = app.height + "px";
  win.style.left = Math.random() * 200 + 60 + "px";
  win.style.top = Math.random() * 90 + 60 + "px";

  document.getElementById("windows").appendChild(win);
  openWindows[appId] = win;

  makeWindowDraggable(win);
  makeWindowResizable(win);
  focusWindow(win);

  titlebar.querySelector(".win-close").addEventListener("click", () => closeWindow(appId));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && openWindows[appId] === win) closeWindow(appId);
  });

  if (app.init) app.init(win);
  updateDock();
}

function closeWindow(appId) {
  if (!openWindows[appId]) return;
  openWindows[appId].remove();
  delete openWindows[appId];
  updateDock();
}

function focusWindow(win) { win.style.zIndex = nextZIndex++; }

// ============ DRAG & RESIZE ============

function makeWindowDraggable(win) {
  const bar = win.querySelector(".titlebar");
  let offsetX = 0, offsetY = 0;
  bar.addEventListener("mousedown", e => {
    focusWindow(win);
    const rect = win.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    const move = e => {
      let x = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - win.offsetWidth));
      let y = Math.max(34, Math.min(e.clientY - offsetY, window.innerHeight - win.offsetHeight));
      win.style.left = x + "px";
      win.style.top = y + "px";
    };
    const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
}

function makeWindowResizable(win) {
  const handle = win.querySelector(".resize-handle");
  handle.addEventListener("mousedown", e => {
    e.preventDefault();
    const rect = win.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY, sw = rect.width, sh = rect.height;
    const move = e => {
      win.style.width = Math.max(260, sw + (e.clientX - sx)) + "px";
      win.style.height = Math.max(180, sh + (e.clientY - sy)) + "px";
    };
    const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
}

// ============ DOCK ============

function updateDock() {
  const dockEl = document.getElementById("dock");
  dockEl.innerHTML = "";
  Object.keys(apps).forEach(appId => {
    if (!openWindows[appId]) return;
    const srcBadge = document.querySelector(`.icon[data-app="${appId}"] .icon-badge`);
    const button = document.createElement("button");
    button.className = "dock-icon active";
    button.title = apps[appId].title;
    if (srcBadge) {
      button.innerHTML = srcBadge.innerHTML;
      srcBadge.classList.forEach(c => { if (c.startsWith("badge-")) button.classList.add(c); });
    } else {
      button.innerHTML = fallbackGlyphs[appId] || "";
      button.classList.add("badge-cyan");
    }
    button.addEventListener("click", () => openApp(appId));
    dockEl.appendChild(button);
  });
}

// ============ GAME ============

function launchGame() {
  gameScreen.classList.remove("hidden");
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  let shipX = canvas.width / 2;
  const shipY = canvas.height - 40;
  let score = 0, lives = 3, gameActive = true;
  const bestScore = parseInt(localStorage.getItem("manay-best-score") || "0");
  document.getElementById("g-best").textContent = bestScore;

  const meteors = [], orbs = [];
  let mouseX = shipX;
  canvas.addEventListener("mousemove", e => { mouseX = e.clientX; });

  let frame = 0;
  const loop = setInterval(() => {
    if (!gameActive) { clearInterval(loop); return; }
    frame++;

    if (frame % 38 === 0) meteors.push({ x: Math.random() * canvas.width, y: -20, size: 8 + Math.random() * 6, speed: 2 + Math.random() });
    if (frame % 130 === 0) orbs.push({ x: Math.random() * canvas.width, y: -15, size: 6, speed: 1.5 });

    shipX = Math.max(0, Math.min(mouseX - 15, canvas.width - 30));
    meteors.forEach((m, i) => { m.y += m.speed; if (m.y > canvas.height) meteors.splice(i, 1); });
    orbs.forEach((o, i) => { o.y += o.speed; if (o.y > canvas.height) orbs.splice(i, 1); });

    meteors.forEach((m, i) => {
      if (shipX < m.x + m.size && shipX + 30 > m.x && shipY < m.y + m.size && shipY + 20 > m.y) {
        lives--; meteors.splice(i, 1);
        if (lives <= 0) gameActive = false;
      }
    });
    orbs.forEach((o, i) => {
      if (shipX < o.x + o.size && shipX + 30 > o.x && shipY < o.y + o.size && shipY + 20 > o.y) {
        score += 25; orbs.splice(i, 1);
      }
    });
    score += 0.12;

    ctx.fillStyle = "#04040e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    for (let i = 0; i < 60; i++) {
      const x = (frame * 0.5 + i * 70) % canvas.width;
      const y = (i * 47) % canvas.height;
      ctx.fillRect(x, y, 1, 1);
    }

    ctx.fillStyle = "#f87171";
    meteors.forEach(m => { ctx.beginPath(); ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = "#fbbf24";
    orbs.forEach(o => { ctx.beginPath(); ctx.arc(o.x, o.y, o.size, 0, Math.PI * 2); ctx.fill(); });

    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(shipX, shipY, 30, 20);
    ctx.fillStyle = "#a855f7";
    ctx.fillRect(shipX + 10, shipY - 10, 10, 10);

    document.getElementById("g-score").textContent = Math.floor(score);
  }, 1000 / 60);

  const check = setInterval(() => {
    if (gameActive) return;
    clearInterval(check);
    const finalScore = Math.floor(score);
    const newBest = Math.max(bestScore, finalScore);
    if (newBest > bestScore) localStorage.setItem("manay-best-score", newBest);

    const msg = document.getElementById("game-msg");
    msg.innerHTML = `
      <div class="game-card">
        <h2>Game Over</h2>
        <p>You survived ${frame} frames</p>
        <div class="score-big">${finalScore}</div>
        <p>Best: ${newBest}</p>
        <div class="game-btns">
          <button class="game-btn" type="button" id="game-restart">Play Again</button>
          <button class="game-btn secondary" type="button" id="game-exit">Exit</button>
        </div>
      </div>`;
    msg.classList.remove("hidden");
    document.getElementById("game-restart").addEventListener("click", () => { msg.classList.add("hidden"); gameScreen.classList.add("hidden"); launchGame(); });
    document.getElementById("game-exit").addEventListener("click", () => { msg.classList.add("hidden"); gameScreen.classList.add("hidden"); });
  }, 100);

  const escHandler = e => {
    if (e.key === "Escape") {
      clearInterval(loop);
      clearInterval(check);
      gameScreen.classList.add("hidden");
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);
}
