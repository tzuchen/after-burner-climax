/* ============================================================
   AFTER BURNER CLIMAX - INPUT MANAGER MODULE
   Keyboard, Mouse, Gamepad API, and Virtual Touch Screen
   ============================================================ */

import { state } from './state.js';

export class InputManager {
  constructor() {
    this.keys = {};
    this.mouse = { x: 0, y: 0 };
    this.gamepadIndex = null;
    this.touchStick = { active: false, startX: 0, startY: 0, curX: 0, curY: 0 };
    this.callbacks = {
      onFireVulcan: null,
      onFireMissile: null,
      onBarrelRoll: null,
      onToggleClimax: null,
      onToggleView: null,
      onStartGame: null,
      onEnterHangar: null,
      onDeployFlares: null,
      onFireSpecialWeapon: null,
      onPrevAircraft: null,
      onNextAircraft: null,
      onSelectRoute: null
    };

    this.initKeyboard();
    this.initMouse();
    this.initGamepad();
    this.initTouch();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      this.keys[k] = true;

      // 1. Title screen shortcut: Space or Enter enters the 3D Hangar
      if (state.inTitle) {
        if (e.code === 'Space' || e.code === 'Enter') {
          if (this.callbacks.onEnterHangar) this.callbacks.onEnterHangar();
          return;
        }
      }

      // 2. Hangar selection shortcuts
      if (state.inHangar) {
        if (k === 'arrowleft' || k === 'a') {
          if (this.callbacks.onPrevAircraft) this.callbacks.onPrevAircraft();
          return;
        }
        if (k === 'arrowright' || k === 'd') {
          if (this.callbacks.onNextAircraft) this.callbacks.onNextAircraft();
          return;
        }
        if (e.code === 'Space' || e.code === 'Enter') {
          if (this.callbacks.onStartGame) this.callbacks.onStartGame();
          return;
        }
      }

      // 3. Route branching selection shortcuts
      if (state.isSelectingRoute) {
        if (k === '1') {
          if (this.callbacks.onSelectRoute) this.callbacks.onSelectRoute(0);
          return;
        }
        if (k === '2') {
          if (this.callbacks.onSelectRoute) this.callbacks.onSelectRoute(1);
          return;
        }
      }

      // 4. In-flight combat actions
      if (state.started && !state.inHangar && !state.inTitle) {
        if (e.code === 'Space') {
          if (this.callbacks.onFireVulcan) this.callbacks.onFireVulcan();
          if (this.callbacks.onFireMissile) this.callbacks.onFireMissile();
        }
        if (k === 'x') {
          if (this.callbacks.onDeployFlares) this.callbacks.onDeployFlares();
        }
        if (k === 'f') {
          if (this.callbacks.onFireSpecialWeapon) this.callbacks.onFireSpecialWeapon();
        }
        if (k === 'q') {
          if (this.callbacks.onBarrelRoll) this.callbacks.onBarrelRoll(-1);
        }
        if (k === 'e') {
          if (this.callbacks.onBarrelRoll) this.callbacks.onBarrelRoll(1);
        }
        if (k === 'c') {
          if (this.callbacks.onToggleClimax) this.callbacks.onToggleClimax();
        }
        if (k === 'v') {
          if (this.callbacks.onToggleView) this.callbacks.onToggleView();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  initMouse() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('mousedown', (e) => {
      // In hangar or route branching, UI buttons handle their own interactions
      if (state.inHangar || state.isSelectingRoute || !state.started) {
        return;
      }
      if (e.button === 0) {
        // Left Click
        if (this.callbacks.onFireVulcan) this.callbacks.onFireVulcan();
        if (this.callbacks.onFireMissile) this.callbacks.onFireMissile();
      } else if (e.button === 2) {
        // Right Click: Climax Mode
        if (this.callbacks.onToggleClimax) this.callbacks.onToggleClimax();
      }
    });

    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  initGamepad() {
    window.addEventListener('gamepadconnected', (e) => {
      console.log(`[Gamepad] Controller connected: ${e.gamepad.id}`);
      this.gamepadIndex = e.gamepad.index;
    });
    window.addEventListener('gamepaddisconnected', () => {
      this.gamepadIndex = null;
    });
  }

  initTouch() {
    const stickZone = document.getElementById('touch-stick-zone');
    const stickThumb = document.getElementById('touch-stick-thumb');

    if (!stickZone) return;

    stickZone.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      const rect = stickZone.getBoundingClientRect();
      this.touchStick.active = true;
      this.touchStick.startX = rect.left + rect.width / 2;
      this.touchStick.startY = rect.top + rect.height / 2;
      this.updateTouchStick(t.clientX, t.clientY, stickThumb);
    }, { passive: false });

    stickZone.addEventListener('touchmove', (e) => {
      if (!this.touchStick.active) return;
      e.preventDefault();
      const t = e.touches[0];
      this.updateTouchStick(t.clientX, t.clientY, stickThumb);
    }, { passive: false });

    const endTouch = () => {
      this.touchStick.active = false;
      this.touchStick.curX = 0;
      this.touchStick.curY = 0;
      if (stickThumb) {
        stickThumb.style.transform = `translate(0px, 0px)`;
      }
    };

    stickZone.addEventListener('touchend', endTouch);
    stickZone.addEventListener('touchcancel', endTouch);

    // Touch Action Buttons
    const btnFire = document.getElementById('btn-touch-fire');
    if (btnFire) {
      btnFire.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.callbacks.onFireVulcan) this.callbacks.onFireVulcan();
        if (this.callbacks.onFireMissile) this.callbacks.onFireMissile();
      });
    }

    const btnSpw = document.getElementById('btn-touch-spw');
    if (btnSpw) {
      btnSpw.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.callbacks.onFireSpecialWeapon) this.callbacks.onFireSpecialWeapon();
      });
    }

    const btnFlare = document.getElementById('btn-touch-flare');
    if (btnFlare) {
      btnFlare.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.callbacks.onDeployFlares) this.callbacks.onDeployFlares();
      });
    }

    const btnRoll = document.getElementById('btn-touch-roll');
    if (btnRoll) {
      btnRoll.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.callbacks.onBarrelRoll) this.callbacks.onBarrelRoll(1);
      });
    }

    const btnClimax = document.getElementById('btn-touch-climax');
    if (btnClimax) {
      btnClimax.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.callbacks.onToggleClimax) this.callbacks.onToggleClimax();
      });
    }
  }

  updateTouchStick(clientX, clientY, thumbEl) {
    const dx = clientX - this.touchStick.startX;
    const dy = clientY - this.touchStick.startY;
    const maxRadius = 55;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxRadius);

    const nx = Math.cos(angle) * clampedDist;
    const ny = Math.sin(angle) * clampedDist;

    this.touchStick.curX = nx / maxRadius;
    this.touchStick.curY = -(ny / maxRadius);

    if (thumbEl) {
      thumbEl.style.transform = `translate(${nx}px, ${ny}px)`;
    }
  }

  poll() {
    let flightX = this.mouse.x;
    let flightY = this.mouse.y;

    // Check Touch virtual joystick
    if (this.touchStick.active) {
      flightX = this.touchStick.curX;
      flightY = this.touchStick.curY;
    }

    // Check Gamepad
    if (this.gamepadIndex !== null) {
      const gp = navigator.getGamepads()[this.gamepadIndex];
      if (gp) {
        // Left Analog Stick
        const stickX = gp.axes[0];
        const stickY = -gp.axes[1];
        const deadzone = 0.12;
        if (Math.abs(stickX) > deadzone || Math.abs(stickY) > deadzone) {
          flightX = stickX;
          flightY = stickY;
        }

        // Triggers / Buttons
        if (gp.buttons[7] && gp.buttons[7].pressed) {
          // Right Trigger: Afterburner
          this.keys['shift'] = true;
        }
        if (gp.buttons[0] && gp.buttons[0].pressed) {
          // Button A / Cross: Fire
          if (this.callbacks.onFireVulcan) this.callbacks.onFireVulcan();
        }
        if (gp.buttons[1] && gp.buttons[1].pressed) {
          // Button B / Circle: Deploy Flares
          if (this.callbacks.onDeployFlares) this.callbacks.onDeployFlares();
        }
        if (gp.buttons[2] && gp.buttons[2].pressed) {
          // Button X / Square: Climax
          if (this.callbacks.onToggleClimax) this.callbacks.onToggleClimax();
        }
        if (gp.buttons[3] && gp.buttons[3].pressed) {
          // Button Y / Triangle: Special Weapon
          if (this.callbacks.onFireSpecialWeapon) this.callbacks.onFireSpecialWeapon();
        }
        if (gp.buttons[4] && gp.buttons[4].pressed) {
          // L1: Roll Left
          if (this.callbacks.onBarrelRoll) this.callbacks.onBarrelRoll(-1);
        }
        if (gp.buttons[5] && gp.buttons[5].pressed) {
          // R1: Roll Right
          if (this.callbacks.onBarrelRoll) this.callbacks.onBarrelRoll(1);
        }
      }
    }

    // Check Keyboard WASD override
    if (this.keys['a'] || this.keys['arrowleft']) flightX = -0.85;
    if (this.keys['d'] || this.keys['arrowright']) flightX = 0.85;
    if (this.keys['s'] || this.keys['arrowdown']) flightY = -0.7;
    if ((this.keys['w'] && !this.keys['shift']) || this.keys['arrowup']) flightY = 0.7;

    return { flightX, flightY };
  }
}
