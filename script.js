
 // script for menu


	  const menuIcon = document.getElementById("menuIcon");
    const menu = document.getElementById("menuPanel");
    const overlay = document.getElementById("overlay");
    const content = document.getElementById("content");

    menuIcon.addEventListener("click", () => {
      const isOpen = menu.classList.contains("open");
      if (isOpen) {
        closeMenu();
      } else {
        menu.classList.add("open");
        overlay.classList.add("show");
        content.classList.add("blurred");
        menuIcon.classList.add("open");
      }
    });

    function closeMenu() {
      menu.classList.remove("open");
      overlay.classList.remove("show");
      content.classList.remove("blurred");
      menuIcon.classList.remove("open");
    }



// script for bg


// script for panels 


    const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    } else {
      entry.target.classList.remove('show');
    }
  });
}, {
  threshold: 0.3
});

document.querySelectorAll('.panel').forEach(panel => {
  observer.observe(panel);
});


// auto-reload



  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'style.css?v=' + new Date().getTime();
  document.head.appendChild(css);



  
    const voiceBtn = document.getElementById("voiceBtn");
    const status = document.getElementById("status");

    const commands = {
      "home": "index.html",
      "dashboard": "dashboard.html",
      "launchpad": "launchpad.html",
      "stat": "systats.html",
      "contact": "contact.html",
      "about": "about.html",
      "terms": "terms.html",
      "privacy": "terms.html"
    };

    const faqs = [
      { q: ["what is hakpi", "tell me about hakpi", "explain hakpi"], a: "Hakpi is a futuristic web interface built to showcase tools, experiments, and projects by the developer." },
      { q: ["who created hakpi", "who made hakpi", "developer of hakpi"], a: "Hakpi was created by Roshan, a solo developer and hacker enthusiast." },
      { q: ["what technologies", "tech used", "built with"], a: "Hakpi uses HTML, CSS, JavaScript, and is hosted on GitHub Pages." },
      { q: ["can i login", "login system", "how do i login"], a: "Yes, there's a login system demo as part of the developer's tool showcase." },
      { q: ["is hakpi open source"], a: "The site is public, but not all parts may be open source. You can contact the developer for more info." },
      { q: ["what tools", "features included", "tools in hakpi"], a: "Hakpi includes a dashboard, feedback form, system stats, and a voice assistant interface." },
      { q: ["assistant feature", "what is the assistant", "how does assistant work"], a: "The assistant can respond to basic questions and voice commands, acting as a guide to the site." },
      { q: ["why futuristic", "why the design", "futuristic layout"], a: "The design mimics a next-gen system UI to showcase creative and experimental interfaces." },
      { q: ["can i contribute", "can i test", "how to contribute"], a: "You can try out all public tools and leave feedback, but contribution is currently limited." },
      { q: ["does hakpi store data", "user data", "is my data saved"], a: "No personal data is collected. The site is mainly a frontend demo with local or simulated storage." },
      { q: ["feedback popup", "feedback form"], a: "The feedback form lets users rate the tools using emoji and send suggestions." },
      {
        q: [
          "how do i use dashboard", "what is dashboard", "tell me about dashboard", 
          "explain dashboard", "dashboard page", "dashboard function"
        ],
        a: "The dashboard displays real-time or demo system stats like CPU, visits, uptime, and more. It's part of Hakpi’s showcase tools."
      },
      {
        q: [
          "what is contact page", "tell me about contact", "contact info", "explain contact page"
        ],
        a: "The contact page provides ways to reach out to the developer, give feedback, or report bugs."
      },
      {
        q: [
          "what is launchpad", "explain launchpad", "launchpad feature", "tell me about launchpad"
        ],
        a: "The launchpad is a demo interface for launching or navigating to different modules from a single point."
      },
      {
        q: ["is hakpi mobile friendly", "does hakpi work on phone"], a: "Yes, the layout is responsive and supports mobile devices with touch gestures." },
      { q: ["what does hakpi mean"], a: "Hakpi likely combines Hack and Pi, symbolizing hacker tools and Raspberry Pi influence." }
    ];

    function speak(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
      status.textContent = text;
    }

    function similarity(str1, str2) {
      const longer = str1.length > str2.length ? str1 : str2;
      const shorter = str1.length > str2.length ? str2 : str1;
      const longerLength = longer.length;
      if (longerLength === 0) return 1.0;
      return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    }

    function editDistance(s1, s2) {
      s1 = s1.toLowerCase();
      s2 = s2.toLowerCase();
      const costs = Array(s2.length + 1).fill().map((_, i) => i);
      for (let i = 1; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 1; j <= s2.length; j++) {
          const newValue = s1[i - 1] === s2[j - 1] ? costs[j - 1] : Math.min(costs[j - 1], lastValue, costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
        costs[s2.length] = lastValue;
      }
      return costs[s2.length];
    }

    function handleCommand(transcript) {
      const text = transcript.toLowerCase().trim();

      // 1. FAQ fuzzy match
      for (let item of faqs) {
        for (let phrase of item.q) {
          if (similarity(text, phrase) > 0.75 || text.includes(phrase)) {
            speak(item.a);
            return;
          }
        }
      }

      // 2. Direct page name match
      if (commands[text]) {
        speak(`Opening ${text} page.`);
        setTimeout(() => {
          window.location.href = commands[text];
        }, 1200);
        return;
      }

      // 3. Intent + keyword match
      const intents = ["go to", "open", "navigate", "launch", "take me to", "visit", "access"];
      for (let intent of intents) {
        if (text.includes(intent)) {
          for (let keyword in commands) {
            if (text.includes(keyword)) {
              speak(`Redirecting to ${keyword} page.`);
              setTimeout(() => {
                window.location.href = commands[keyword];
              }, 1200);
              return;
            }
          }
        }
      }

      // 4. Fallback
      speak("Sorry, I didn't understand that. Try asking about Hakpi or say a page name.");
    }

    voiceBtn.onclick = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in your browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      let finalTranscript = "";

      recognition.onstart = () => {
        status.textContent = "Listening... 🎧";
      };

      recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        status.textContent = interim ? `You’re saying: "${interim}"` : `Heard: "${finalTranscript}"`;
      };

      recognition.onerror = (e) => {
        speak("There was an error: " + e.error);
      };

      recognition.onend = () => {
        if (finalTranscript.trim() !== "") {
          handleCommand(finalTranscript.trim());
        } else {
          speak("I didn't catch that. Please try again.");
        }
      };

      recognition.start();
    };
  


