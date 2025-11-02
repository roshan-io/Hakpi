#!/home/raspberrypi/myenv/bin/python
from flask import Flask, request, jsonify
from flask_cors import CORS
import serial
import re
import time

# ======================================================
# Flask setup
# ======================================================
app = Flask(__name__)
CORS(app)
@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return response
# ======================================================
# Serial setup
# ======================================================
try:
    ser = serial.Serial('/dev/serial0', 9600, timeout=1)
    time.sleep(2)
    print("âœ… Serial connected on /dev/serial0")
except Exception as e:
    ser = None
    print("âš ï¸ Serial connection failed:", e)

def send(cmd):
    """Send command to Arduino and read back response."""
    if not ser:
        return "Serial not connected"
    ser.write((cmd + "\n").encode())
    reply = ser.readline().decode(errors="ignore").strip()
    print(f"â†’ {cmd} | â† {reply}")
    return reply or "No reply"

# ======================================================
# HTML placeholder (youâ€™ll paste your HTML here)
# ======================================================
@app.route("/")
def dashboard():
    return """ 
    <!-- ==========================
         PLACE YOUR FULL HTML HERE
         ========================== -->

 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" sizes="180x180" href="favicon.png">
  <title>Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />

  <style>

   canvas#bgCanvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

    :root {
      --bg: #0e1117;
      --card: #161b22;
      --text: #c9d1d9;
      --accent: #58a6ff;
      --border: #30363d;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {

      color: var(--text);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 0;
      margin: 0;
      background: black;

    }

    .card {
      width: 70vw;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1rem;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
    }
    .double-height {
      grid-column: span 2;
      grid-row: span 2;
    }

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at center, #050510 0%, #000 100%);
  overflow: hidden; /* prevents scrolling */
  position: relative;
  padding: 0;
  margin: 0;
}


.wrapper::before {
  content: "";
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(120, 80, 255, 0.25), transparent 70%);
  filter: blur(120px);
  z-index: 0;
}



/* voice styling */

  .voice-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  background: radial-gradient(circle at top left, #0a0a0f, #0d0d16);
  box-shadow: 0 0 20px rgba(150, 100, 255, 0.2);
  border-radius: 1.2rem;
  padding: 1rem;
  color: #e0e0ff;
  position: relative;
  overflow: hidden;
}

.voice-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, #a46bff22, #ff79c622);
  pointer-events: none;
  mix-blend-mode: overlay;
}

.voice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-size: 1rem;
}

#voiceStatus {
  color: #a46bff;
  font-family: monospace;
}

.voice-display {
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 0.8rem;
  margin: 1rem 0;
  padding: 1rem;
  font-size: 0.95rem;
  color: #dcdcff;
  text-shadow: 0 0 4px #a46bff55;
  overflow-y: auto;
  max-height: 100px;
  transition: 0.2s;
}

.voice-controls {
  display: flex;
  justify-content: center;
  align-items: center;
}


.audio-visualizer-container {
  position: relative;
  width: 80%;
  height: 120px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background: transparent;
  gap: 30px; /* small space between visualizer and mic */
}

#visualizer {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: transparent;
  display: block;
  position: relative;
}

/* Mic button positioned slightly above the visualizer's bottom line */
#voiceBtn {
  position: relative;
  bottom: 15px;              /* lift mic slightly above visualizer baseline */
  width: 47px;
  height: 47px;
  border-radius: 50%;
  background: linear-gradient(90deg, #a46bff, #ff79c6);
  border: none;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  outline: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex-shrink: 0;            /* prevent size shrink when resizing */
  margin-bottom: 0px;
}

#voiceBtn:hover {
  transform: scale(1.08);
  box-shadow: 0 0 15px #ff79c688;
}

#voiceBtn.active {
  box-shadow: 0 0 25px 4px #a46bffaa;
  animation: pulse 1.2s infinite;
}


@keyframes pulse {
  0% { box-shadow: 0 0 8px 2px #a46bff55; }
  50% { box-shadow: 0 0 20px 5px #ff79c655; }
  100% { box-shadow: 0 0 8px 2px #a46bff55; }
}

</style>
</head>

<body>

    <canvas id="bgCanvas"></canvas>

<div class="wrapper">


    <div class="card double-height ">


    <div class="voice-header">  
    <h3>Voice Input</h3>  
    <span id="voiceStatus">Idle</span>  
  </div>  

  <div class="voice-display">  
    <p id="liveText">Press Mic to start speaking</p>  
  </div>  
      <div class="audio-visualizer-container">  
         <canvas id="visualizer"></canvas>  
        <button id="voiceBtn">  
           <span class="glow-ring"></span>  
         ðŸŽ¤
    </button> 
</div>  




    </div>  

  <h2>Robot Command Test</h2>
  <form id="cmdForm">
    <input type="text" id="cmdInput" placeholder="Type a command like forward" autofocus>
  </form>
  <p id="reply"></p>

</div>
<script>
const form = document.getElementById('cmdForm');
const input = document.getElementById('cmdInput');
const reply = document.getElementById('reply');
const target = "https://192.168.222.104:5000/command"; // your Pi IP

// ----- Voice setup -----
let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => reply.textContent = "🎤 Listening...";
  recognition.onend = () => reply.textContent = "✅ Voice captured.";
  recognition.onerror = e => reply.textContent = "⚠️ Voice error: " + e.error;

  recognition.onresult = e => {
    const text = e.results[0][0].transcript.trim();
    reply.textContent = `🗣️ You said: "${text}"`;
    sendCommand(text);
  };
} else {
  reply.textContent = "⚠️ Speech recognition not supported in this browser.";
}

// ----- Manual text form -----
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  sendCommand(text);
  input.value = "";
});

// ----- Send command -----
function sendCommand(text) {
  fetch(target, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ text })
  })
  .then(r => r.json())
  .then(data => {
    reply.textContent = "🤖 Robot: " + data.reply;
    console.log("✅ Sent:", text, "Reply:", data.reply);
  })
  .catch(err => {
    reply.textContent = "⚠️ " + err;
    console.error("Fetch error:", err);
  });
}

// ----- Add a button to start voice recognition -----
const btn = document.createElement("button");
btn.textContent = "🎤 Speak Command";
btn.style.marginTop = "15px";
btn.onclick = () => recognition && recognition.start();
document.body.insertBefore(btn, reply);
</script>
  











</body>
</html>




    """


# ======================================================
# Endpoint for voice commands from frontend
# ======================================================
@app.route("/command", methods=["POST"])
def command():
    data = request.get_json()
    text = data.get("text", "").lower().strip()
    print(f"ðŸ—£ï¸ Heard: {text}")

    # Map spoken words to robot commands
    if re.search(r"\bforward\b", text):
        reply = send("FORWARD")
    elif re.search(r"\bback|reverse\b", text):
        reply = send("BACKWARD")
    elif re.search(r"\bleft\b", text):
        reply = send("LEFT")
    elif re.search(r"\bright\b", text):
        reply = send("RIGHT")
    elif re.search(r"\bstop\b", text):
        reply = send("STOP")
    elif re.search(r"\bbrake\b", text):
        reply = send("BRAKE")
    elif re.search(r"\bpong|ping\b", text):
        reply = send("PING")
    else:
        reply = "Unknown command"

    return jsonify({"reply": reply})


# ======================================================
# Run the Flask app
# ======================================================
if __name__ == "__main__":
    cert_path = "/etc/ssl/private/demo/fullchain.pem"
    key_path = "/etc/ssl/private/demo/privkey.pem"

    print("ðŸ”’ Serving securely on https://<your-ip>:5000")
    app.run(host="0.0.0.0", port=5000, ssl_context=(cert_path, key_path), debug=False)