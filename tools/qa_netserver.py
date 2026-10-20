"""Local test server for slow/offline QA of the Evidence Explorer (the team).

  /slow/...     serves the site, delaying every data/*.json response by DELAY seconds
  /offline/...  serves the page but drops the connection for data/*.json (simulates losing the network)
  /...          serves the site normally
Usage: python tools/qa_netserver.py [port] [delay]   (run from the site directory)
"""
import http.server, socketserver, sys, time

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
DELAY = float(sys.argv[2]) if len(sys.argv) > 2 else 4.0


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        mode = None
        for prefix in ("/slow", "/offline"):
            if self.path.startswith(prefix + "/"):
                mode, self.path = prefix[1:], self.path[len(prefix):]
        is_data = self.path.split("?")[0].startswith("/data/")
        if mode == "offline" and is_data:
            self.close_connection = True
            self.connection.close()
            return
        if mode == "slow" and is_data:
            time.sleep(DELAY)
        return super().do_GET()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (time.strftime("%H:%M:%S"), fmt % args))


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True


if __name__ == "__main__":
    Server(("127.0.0.1", PORT), Handler).serve_forever()
