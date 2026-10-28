"""Process-boundary protocol fixture only; no data service or settings business logic."""
from __future__ import annotations

import argparse
import json
import os
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', required=True)
    parser.add_argument('--port-file', required=True)
    parser.add_argument('--token', required=True)
    parser.add_argument('--port', type=int, default=0)
    parser.add_argument('--exit-on-stdin-eof', action='store_true')
    parser.add_argument('--onboarded', type=int, choices=[0, 1], default=1)
    parser.add_argument('--mode', default='ok')
    args = parser.parse_args()
    mode, _, value = args.mode.partition(':')
    if mode not in {'ok', 'slow-ready', 'health-fail', 'hang', 'exit-before-ready',
                    'crash-after-ready', 'startup-failed'}:
        parser.error('unknown fixture mode')
    milliseconds = int(value) if mode in {'slow-ready', 'crash-after-ready'} else 0
    registry = os.environ.get('FAI_FAKE_REGISTRY')
    if registry:
        directory = Path(registry)
        directory.mkdir(parents=True, exist_ok=True)
        with (directory / 'spawns.jsonl').open('a', encoding='utf-8') as output:
            output.write(json.dumps({'pid': os.getpid(), 'time': time.time()}) + '\n')
    if mode == 'startup-failed':
        print('FAI_HOST ' + json.dumps({'event': 'startup_failed', 'code': value,
              'path': args.root, 'detail': 'protocol fixture startup failure'}), flush=True)
        return 3
    if mode == 'exit-before-ready':
        return 1

    stop = threading.Event()
    if args.exit_on_stdin_eof:
        def watch_stdin():
            while os.read(sys.stdin.fileno(), 4096):
                pass
            stop.set()
        threading.Thread(target=watch_stdin, daemon=True).start()
    if mode == 'hang':
        stop.wait()
        return 0
    if mode == 'slow-ready' and stop.wait(milliseconds / 1000):
        return 0

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_args):
            pass  # Never log request bodies, authorization, or argv.

        def respond(self, status, body):
            data = json.dumps(body).encode('utf-8')
            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def authorized(self):
            if self.headers.get('Authorization') != 'Bearer ' + args.token:
                self.respond(401, {'detail': 'unauthorized'})
                return False
            return True

        def do_GET(self):
            if self.path == '/health':
                if mode == 'health-fail':
                    self.respond(503, {'status': 'unavailable', 'data_ready': False, 'version': 'fixture'})
                else:
                    self.respond(200, {'status': 'ok', 'data_ready': True, 'version': 'fixture'})
                return
            if not self.authorized():
                return
            if self.path == '/settings/profile':
                self.respond(200, {'onboarding': {'completed': bool(args.onboarded), 'skipped': False}})
            else:
                self.respond(404, {'detail': 'fixture endpoint not implemented'})

        def do_POST(self):
            if not self.authorized():
                return
            if self.path == '/shutdown':
                self.respond(200, {'status': 'shutting_down'})
                stop.set()
            else:
                self.respond(404, {'detail': 'fixture endpoint not implemented'})

    try:
        server = HTTPServer(('127.0.0.1', args.port), Handler)
    except OSError:
        print('FAI_HOST ' + json.dumps({'event': 'startup_failed', 'code': 'port_in_use',
              'path': args.root, 'detail': 'fixture port unavailable'}), flush=True)
        return 3
    port_file = Path(args.port_file)
    try:
        Path(args.root).mkdir(parents=True, exist_ok=True)
        port_file.parent.mkdir(parents=True, exist_ok=True)
        port_file.write_text(json.dumps({'port': server.server_port, 'token': args.token}), encoding='utf-8')
        server.timeout = 0.05
        started = time.monotonic()
        while not stop.is_set():
            if mode == 'crash-after-ready' and (time.monotonic() - started) * 1000 >= milliseconds:
                return 1
            server.handle_request()
        return 0
    finally:
        server.server_close()
        port_file.unlink(missing_ok=True)


if __name__ == '__main__':
    raise SystemExit(main())
