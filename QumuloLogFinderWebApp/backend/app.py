from flask import Flask, request, Response
from flask_cors import CORS
from log_searcher import LogSearcher
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

log_searcher = LogSearcher('/keys/credential/credential.ini')

@app.route('/api/search', methods=['POST'])
def stream_logs():
    data = request.json
    keyword = data.get('keyword', '')
    logfile = data.get('logfile')  # renamed from month
    node = data.get('node')

    logger.info(f"Search request: keyword={keyword}, logfile={logfile}, node={node}")

    def generate():
        for line in log_searcher.search_logs_stream(keyword, logfile, node):
            yield f'{line}\n'

    return Response(generate(), mimetype='text/plain')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
