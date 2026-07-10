// spacexOS — main application script

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
        <div class="term-out" id="term-output">spacexOS shell
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
          "spacexOS — available commands:",
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

        whoami: () => "guest@spacexOS",
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
        link.download = "spacexos-drawing.png";
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

  pomodoro: {
    title: "Pomodoro Technique Timer", width: 280, height: 240,
    render: () => `
      <div style="display:flex; flex-direction:column; align-items:center; height:100%; justify-content:center; gap:14px;">
        <div style="font-family:var(--mono); font-size:48px; color:var(--c7); font-weight:bold;" id="pomo-time">25:00</div>
        <div style="display:flex; gap:8px;">
          <button id="pomo-start" style="padding:6px 16px; background:var(--c1); color:#fff; border:2px solid; border-color:#5fd0d2 #05585a #05585a #5fd0d2; cursor:pointer; font-family:var(--ui);">Start</button>
          <button id="pomo-reset" style="padding:6px 16px; background:var(--gray); color:#000; border:2px solid; border-color:var(--gray-l) var(--gray-d) var(--gray-d) var(--gray-l); cursor:pointer; font-family:var(--ui);">Reset</button>
        </div>
      </div>
    `,
    init: (win) => {
      let seconds = 1500;
      let running = false;
      const display = win.querySelector("#pomo-time");
      const startBtn = win.querySelector("#pomo-start");
      const resetBtn = win.querySelector("#pomo-reset");
      let interval = null;

      const updateDisplay = () => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        display.textContent = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      };

      startBtn.addEventListener("click", () => {
        if (!running) {
          running = true;
          startBtn.textContent = "Pause";
          interval = setInterval(() => {
            if (seconds > 0) {
              seconds--;
              updateDisplay();
            } else {
              running = false;
              clearInterval(interval);
              startBtn.textContent = "Start";
              alert("Time's up! Take a break.");
            }
          }, 1000);
        } else {
          running = false;
          clearInterval(interval);
          startBtn.textContent = "Start";
        }
      });

      resetBtn.addEventListener("click", () => {
        running = false;
        clearInterval(interval);
        seconds = 1500;
        updateDisplay();
        startBtn.textContent = "Start";
      });
    },
  },

  tictac: {
    title: "Tic-Tac-Toe", width: 280, height: 340,
    render: () => `
      <div style="display:flex; flex-direction:column; height:100%; gap:10px; padding:10px;">
        <div style="text-align:center; font-weight:bold; font-size:14px;" id="ttt-status">Your turn (X)</div>
        <div id="ttt-board" style="display:grid; grid-template-columns:repeat(3,1fr); gap:4px; flex:1; aspect-ratio:1;">
          ${Array(9).fill(0).map((_, i) => `<button data-idx="${i}" style="font-size:20px; font-weight:bold; cursor:pointer; background:var(--gray); border:2px solid; border-color:var(--gray-l) var(--gray-d) var(--gray-d) var(--gray-l);" class="ttt-cell"></button>`).join("")}
        </div>
        <button id="ttt-reset" style="padding:6px 12px; background:var(--c1); color:#fff; border:2px solid; border-color:#5fd0d2 #05585a #05585a #5fd0d2; cursor:pointer; font-family:var(--ui); width:100%;">New Game</button>
      </div>
    `,
    init: (win) => {
      let board = Array(9).fill(null);
      let turn = "X";
      const cells = win.querySelectorAll(".ttt-cell");
      const status = win.querySelector("#ttt-status");
      const resetBtn = win.querySelector("#ttt-reset");

      const checkWinner = () => {
        const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (let [a, b, c] of lines) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        return null;
      };

      const aiMove = () => {
        let empty = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
        if (empty.length > 0) {
          let idx = empty[Math.floor(Math.random() * empty.length)];
          board[idx] = "O";
          cells[idx].textContent = "O";
        }
      };

      cells.forEach(cell => {
        cell.addEventListener("click", () => {
          const idx = parseInt(cell.dataset.idx);
          if (board[idx] === null && turn === "X") {
            board[idx] = "X";
            cell.textContent = "X";
            if (checkWinner() === "X") { status.textContent = "You win!"; return; }
            if (!board.includes(null)) { status.textContent = "Draw!"; return; }
            turn = "O";
            setTimeout(() => {
              aiMove();
              if (checkWinner() === "O") { status.textContent = "AI wins!"; return; }
              if (!board.includes(null)) { status.textContent = "Draw!"; return; }
              turn = "X";
              status.textContent = "Your turn (X)";
            }, 400);
          }
        });
      });

      resetBtn.addEventListener("click", () => {
        board = Array(9).fill(null);
        turn = "X";
        cells.forEach(c => c.textContent = "");
        status.textContent = "Your turn (X)";
      });
    },
  },

  todo: {
    title: "Todo", width: 300, height: 380,
    render: () => `
      <div style="display:flex; flex-direction:column; height:100%; gap:8px; padding:10px;">
        <div style="display:flex; gap:4px;">
          <input id="todo-input" type="text" placeholder="add a task..." style="flex:1; padding:4px 6px; border:2px solid; border-color:var(--gray-d) var(--gray-l) var(--gray-l) var(--gray-d); font-family:var(--ui); font-size:11px;">
          <button id="todo-add" style="padding:4px 10px; background:var(--c1); color:#fff; border:2px solid; border-color:#5fd0d2 #05585a #05585a #5fd0d2; cursor:pointer; font-family:var(--ui); font-size:11px;">Add</button>
        </div>
        <div id="todo-list" style="flex:1; overflow-y:auto; border:2px solid; border-color:var(--gray-d) var(--gray-l) var(--gray-l) var(--gray-d); padding:6px; background:#fffef8;"></div>
      </div>
    `,
    init: (win) => {
      const input = win.querySelector("#todo-input");
      const addBtn = win.querySelector("#todo-add");
      const list = win.querySelector("#todo-list");
      let todos = JSON.parse(localStorage.getItem("spacex-todos") || "[]");

      const save = () => localStorage.setItem("spacex-todos", JSON.stringify(todos));
      const render = () => {
        list.innerHTML = todos.map((t, i) => `
          <div style="display:flex; gap:6px; padding:4px; align-items:center; border-bottom:1px solid #ddd;">
            <input type="checkbox" ${t.done ? "checked" : ""} style="cursor:pointer;" onchange="this.parentElement.parentElement.parentElement.todoToggle(${i})">
            <span style="flex:1; text-decoration:${t.done ? "line-through" : "none"}; opacity:${t.done ? 0.6 : 1}; font-size:12px;">${t.text}</span>
            <button style="padding:2px 6px; background:#ff6b6b; color:#fff; border:1px solid #c92a2a; cursor:pointer; font-size:10px; font-family:var(--ui);" onclick="this.parentElement.parentElement.parentElement.todoDel(${i})">X</button>
          </div>
        `).join("");
      };

      win.todoToggle = (i) => { todos[i].done = !todos[i].done; save(); render(); };
      win.todoDel = (i) => { todos.splice(i, 1); save(); render(); };

      addBtn.addEventListener("click", () => {
        if (input.value.trim()) {
          todos.push({ text: input.value, done: false });
          input.value = "";
          save();
          render();
        }
      });
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addBtn.click();
      });
      render();
    },
  },

  guess: {
    title: "Guess It", width: 300, height: 260,
    render: () => `
      <div style="display:flex; flex-direction:column; align-items:center; height:100%; justify-content:center; gap:12px; text-align:center;">
        <p style="font-size:13px;">thinking of a number 1-100... guess it!</p>
        <div style="display:flex; gap:6px;">
          <input id="guess-input" type="number" min="1" max="100" placeholder="?" style="width:70px; padding:6px; text-align:center; font-family:var(--ui); font-size:16px; border:2px solid; border-color:var(--gray-d) var(--gray-l) var(--gray-l) var(--gray-d);">
          <button id="guess-btn" style="padding:6px 14px; background:var(--c1); color:#fff; border:2px solid; border-color:#5fd0d2 #05585a #05585a #5fd0d2; cursor:pointer; font-family:var(--ui);">Guess</button>
        </div>
        <p id="guess-feedback" style="font-size:13px; font-weight:bold; min-height:20px;"></p>
        <button id="guess-reset" style="padding:4px 12px; background:var(--gray); color:#000; border:2px solid; border-color:var(--gray-l) var(--gray-d) var(--gray-d) var(--gray-l); cursor:pointer; font-family:var(--ui); font-size:11px;">New Number</button>
      </div>
    `,
    init: (win) => {
      let target = Math.floor(Math.random() * 100) + 1;
      let tries = 0;
      const input = win.querySelector("#guess-input");
      const btn = win.querySelector("#guess-btn");
      const feedback = win.querySelector("#guess-feedback");
      const resetBtn = win.querySelector("#guess-reset");

      const doGuess = () => {
        const val = parseInt(input.value);
        if (!val || val < 1 || val > 100) { feedback.textContent = "type a number 1-100!"; return; }
        tries++;
        if (val === target) {
          feedback.textContent = `got it in ${tries} tries!`;
          feedback.style.color = "var(--c3)";
        } else if (val < target) {
          feedback.textContent = "too low, go higher";
          feedback.style.color = "var(--c5)";
        } else {
          feedback.textContent = "too high, go lower";
          feedback.style.color = "var(--c7)";
        }
        input.value = "";
        input.focus();
      };

      btn.addEventListener("click", doGuess);
      input.addEventListener("keypress", e => { if (e.key === "Enter") doGuess(); });
      resetBtn.addEventListener("click", () => {
        target = Math.floor(Math.random() * 100) + 1;
        tries = 0;
        feedback.textContent = "new number picked, guess away";
        feedback.style.color = "#000";
        input.value = "";
        input.focus();
      });
    },
  },

  sticky: {
    title: "Sticky Notes", width: 360, height: 320,
    render: () => `
      <div style="display:flex; flex-direction:column; height:100%; gap:8px;">
        <button id="sticky-add" style="padding:5px 12px; background:var(--c6); color:#000; border:2px solid; border-color:var(--gray-l) var(--gray-d) var(--gray-d) var(--gray-l); cursor:pointer; font-family:var(--ui); align-self:flex-start;">+ New Note</button>
        <div id="sticky-board" style="flex:1; overflow-y:auto; display:flex; flex-wrap:wrap; gap:10px; align-content:flex-start; padding:4px;"></div>
      </div>
    `,
    init: (win) => {
      const board = win.querySelector("#sticky-board");
      const addBtn = win.querySelector("#sticky-add");
      const colors = ["#fff59d", "#ffab91", "#a5d6a7", "#90caf9", "#ce93d8", "#f48fb1"];
      let notes = JSON.parse(localStorage.getItem("spacex-sticky") || "[]");

      const save = () => localStorage.setItem("spacex-sticky", JSON.stringify(notes));

      const render = () => {
        board.innerHTML = "";
        notes.forEach((note, i) => {
          const div = document.createElement("div");
          const rotation = (i % 2 === 0 ? -1 : 1) * (2 + (i % 3));
          div.style.cssText = `width:110px; min-height:100px; background:${note.color}; padding:8px; box-shadow:2px 2px 5px rgba(0,0,0,0.3); transform:rotate(${rotation}deg); position:relative; font-family:var(--ui); font-size:11px;`;

          const editable = document.createElement("div");
          editable.contentEditable = "true";
          editable.style.cssText = "outline:none; min-height:70px; word-break:break-word; color:#000;";
          editable.textContent = note.text;
          editable.addEventListener("blur", () => { notes[i].text = editable.textContent; save(); });

          const delBtn = document.createElement("button");
          delBtn.textContent = "X";
          delBtn.style.cssText = "position:absolute; top:2px; right:2px; width:16px; height:16px; font-size:9px; line-height:1; cursor:pointer; background:rgba(0,0,0,0.15); border:none; border-radius:50%;";
          delBtn.addEventListener("click", () => { notes.splice(i, 1); save(); render(); });

          div.append(editable, delBtn);
          board.appendChild(div);
        });
      };

      addBtn.addEventListener("click", () => {
        notes.push({ text: "new note...", color: colors[Math.floor(Math.random() * colors.length)] });
        save();
        render();
      });

      render();
    },
  },

  rps: {
    title: "Rock Paper Scissors", width: 340, height: 300,
    render: () => `
      <div style="display:flex; flex-direction:column; align-items:center; height:100%; justify-content:center; gap:14px; text-align:center;">
        <div style="font-size:13px;">pick your move!</div>
        <div style="display:flex; gap:8px;">
          <button class="rps-move" data-move="rock" style="padding:8px 12px; background:var(--c5); color:#fff; border:2px solid; border-color:rgba(255,255,255,.5) rgba(0,0,0,.35) rgba(0,0,0,.35) rgba(255,255,255,.5); cursor:pointer; font-family:var(--ui);">Rock</button>
          <button class="rps-move" data-move="paper" style="padding:8px 12px; background:var(--c3); color:#fff; border:2px solid; border-color:rgba(255,255,255,.5) rgba(0,0,0,.35) rgba(0,0,0,.35) rgba(255,255,255,.5); cursor:pointer; font-family:var(--ui);">Paper</button>
          <button class="rps-move" data-move="scissors" style="padding:8px 12px; background:var(--c7); color:#fff; border:2px solid; border-color:rgba(255,255,255,.5) rgba(0,0,0,.35) rgba(0,0,0,.35) rgba(255,255,255,.5); cursor:pointer; font-family:var(--ui);">Scissors</button>
        </div>
        <div id="rps-result" style="font-size:13px; min-height:36px; font-weight:bold;"></div>
        <div id="rps-score" style="font-family:var(--mono); font-size:12px;">wins: 0 &nbsp; losses: 0 &nbsp; draws: 0</div>
      </div>
    `,
    init: (win) => {
      let wins = 0, losses = 0, draws = 0;
      const moves = ["rock", "paper", "scissors"];
      const result = win.querySelector("#rps-result");
      const score = win.querySelector("#rps-score");

      win.querySelectorAll(".rps-move").forEach(btn => {
        btn.addEventListener("click", () => {
          const you = btn.dataset.move;
          const cpu = moves[Math.floor(Math.random() * 3)];
          let outcome;
          if (you === cpu) { outcome = "draw!"; draws++; }
          else if (
            (you === "rock" && cpu === "scissors") ||
            (you === "paper" && cpu === "rock") ||
            (you === "scissors" && cpu === "paper")
          ) { outcome = "you win!"; wins++; }
          else { outcome = "you lose!"; losses++; }
          result.textContent = `you: ${you} vs cpu: ${cpu} — ${outcome}`;
          score.innerHTML = `wins: ${wins} &nbsp; losses: ${losses} &nbsp; draws: ${draws}`;
        });
      });
    },
  },

  pixel: {
    title: "Pixel Art", width: 340, height: 400,
    render: () => {
      const cells = Array(144).fill(0).map(() =>
        `<div class="px-cell" style="background:#fff;"></div>`
      ).join("");
      const palette = ["#000000", "#e93f33", "#d4a017", "#2a9d5c", "#3a6ea5", "#6d5acd", "#ffffff"];
      const swatches = palette.map((c, i) =>
        `<div class="px-color${i === 0 ? " active" : ""}" data-color="${c}" style="width:22px; height:22px; background:${c}; cursor:pointer; border:2px solid ${i === 0 ? "#000" : (c === "#ffffff" ? "#ccc" : "transparent")};"></div>`
      ).join("");
      return `
        <div style="display:flex; flex-direction:column; height:100%; gap:8px;">
          <div style="display:flex; gap:5px; flex-wrap:wrap;">${swatches}</div>
          <div id="px-grid" style="flex:1; display:grid; grid-template-columns:repeat(12, 1fr); grid-template-rows:repeat(12, 1fr); border:2px solid; border-color:var(--gray-d) var(--gray-l) var(--gray-l) var(--gray-d);">${cells}</div>
          <button id="px-clear" style="padding:5px 12px; background:var(--gray); color:#000; border:2px solid; border-color:var(--gray-l) var(--gray-d) var(--gray-d) var(--gray-l); cursor:pointer; font-family:var(--ui); align-self:flex-start;">Clear</button>
        </div>
      `;
    },
    init: (win) => {
      let current = "#000000";
      let painting = false;
      const swatches = win.querySelectorAll(".px-color");
      const cells = win.querySelectorAll(".px-cell");

      swatches.forEach(sw => {
        sw.style.borderColor = sw.dataset.color === current ? "#000" : (sw.dataset.color === "#ffffff" ? "#ccc" : "transparent");
        sw.addEventListener("click", () => {
          current = sw.dataset.color;
          swatches.forEach(s => s.style.borderColor = s.dataset.color === "#ffffff" ? "#ccc" : "transparent");
          sw.style.borderColor = "#000";
        });
      });

      cells.forEach(cell => {
        cell.style.borderRight = "1px solid #eee";
        cell.style.borderBottom = "1px solid #eee";
        const paint = () => { cell.style.background = current; };
        cell.addEventListener("mousedown", () => { painting = true; paint(); });
        cell.addEventListener("mouseenter", () => { if (painting) paint(); });
      });
      document.addEventListener("mouseup", () => { painting = false; });

      win.querySelector("#px-clear").addEventListener("click", () => {
        cells.forEach(c => c.style.background = "#fff");
      });
    },
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
