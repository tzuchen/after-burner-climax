#!/usr/bin/env python3
"""
AFTER BURNER CLIMAX - High Performance Game Server
Supports Localhost, LAN, and Tailscale multi-device play.
"""
import http.server
import socketserver
import socket
import subprocess
import sys
import os

PORT = 8088
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def get_tailscale_ip():
    try:
        res = subprocess.run(["tailscale", "ip", "-4"], capture_output=True, text=True, timeout=2)
        if res.returncode == 0 and res.stdout.strip():
            return res.stdout.strip()
    except Exception:
        pass
    try:
        res = subprocess.run(["/Applications/Tailscale.app/Contents/MacOS/Tailscale", "ip", "-4"], capture_output=True, text=True, timeout=2)
        if res.returncode == 0 and res.stdout.strip():
            return res.stdout.strip()
    except Exception:
        pass
    return None

class GameHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching for rapid development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run():
    socketserver.TCPServer.allow_reuse_address = True
    tailscale_ip = get_tailscale_ip()
    
    with socketserver.TCPServer(("0.0.0.0", PORT), GameHTTPRequestHandler) as httpd:
        print("=" * 60)
        print("🔥 AFTER BURNER CLIMAX - HTTP GAME SERVER RUNNING 🔥")
        print(f" Serving Directory : {DIRECTORY}")
        print(f" Local URL         : http://localhost:{PORT}/")
        print(f" LAN URL           : http://127.0.0.1:{PORT}/")
        if tailscale_ip:
            print(f" 🌐 Tailscale URL  : http://{tailscale_ip}:{PORT}/")
            print(" (Open on iPhone/iPad/Steam Deck connected to your Tailscale network)")
        print("=" * 60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == '__main__':
    run()
