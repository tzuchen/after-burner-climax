/* ============================================================
   AFTER BURNER CLIMAX - AWACS TACTICAL RADIO VOICE COMMS
   Voice Radio Synthesizer (AWACS "Oversight" Callouts)
   ============================================================ */

export class RadioCommsSystem {
  constructor() {
    this.speechSynth = window.speechSynthesis || null;
    this.voice = null;
    this.isMuted = false;
    this.uiBox = null;
    this.senderEl = null;
    this.msgEl = null;
    this.hideTimer = null;

    this.initVoices();
  }

  initUI() {
    this.uiBox = document.getElementById('radio-box');
    this.senderEl = document.getElementById('radio-sender');
    this.msgEl = document.getElementById('radio-message');
  }

  initVoices() {
    if (!this.speechSynth) return;
    const findVoice = () => {
      const voices = this.speechSynth.getVoices();
      // Prefer English voice with military clarity (e.g. Daniel, Alex, Samantha, or Google US English)
      this.voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Alex') || v.name.includes('Daniel') || v.name.includes('Natural') || v.name.includes('US'))) || voices.find(v => v.lang.startsWith('en'));
    };

    findVoice();
    if (this.speechSynth.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = findVoice;
    }
  }

  speak(message, sender = 'AWACS OVERSIGHT', priority = false) {
    if (this.isMuted) return;

    // Display in Radio UI Box
    if (!this.uiBox) this.initUI();
    if (this.uiBox && this.msgEl && this.senderEl) {
      this.senderEl.innerText = `📻 [${sender}]`;
      this.msgEl.innerText = message;
      this.uiBox.style.display = 'block';

      if (this.hideTimer) clearTimeout(this.hideTimer);
      this.hideTimer = setTimeout(() => {
        if (this.uiBox) this.uiBox.style.display = 'none';
      }, 3500);
    }

    // Voice Synthesis
    if (!this.speechSynth) return;

    if (priority && this.speechSynth.speaking) {
      this.speechSynth.cancel();
    }

    const utter = new SpeechSynthesisUtterance(message);
    if (this.voice) utter.voice = this.voice;
    utter.rate = 1.15; // Fast military tactical callout
    utter.pitch = 1.05;
    utter.volume = 0.85;

    try {
      this.speechSynth.speak(utter);
    } catch (e) {
      // Ignore audio synthesis errors on blocked policies
    }
  }

  // Pre-configured Callouts
  calloutMissionStart() {
    this.speak("Tomcat 1, you are cleared for takeoff. Sunset Coast sector is hot. Intercept all hostiles!", "AWACS OVERSIGHT", true);
  }

  calloutBanditAhead() {
    this.speak("Bandits inbound! Multiple bogies on your 12 o'clock, engage!", "AWACS OVERSIGHT");
  }

  calloutMissileWarning() {
    this.speak("Warning! Missile on your six! Break break, barrel roll!", "AWACS OVERSIGHT", true);
  }

  calloutClimaxReady() {
    this.speak("Climax gauge maxed! Engage Climax Mode and light 'em up!", "RIO MAVERICK", true);
  }

  calloutBossWarning() {
    this.speak("WARNING! Massive radar contact! Superfortress XB-0 spotted! Target their weapon arrays!", "AWACS OVERSIGHT", true);
  }

  calloutStageClear() {
    this.speak("Sector cleared! Great shooting, Tomcat! Rendezvous with tanker for aerial refueling.", "AWACS OVERSIGHT", true);
  }
}

export const radio = new RadioCommsSystem();
