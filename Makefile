install:
	cd apps/ai && pip install -r requirements.txt

dev:
	cd apps/ai && PYTHONPATH=. uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

prod:
	cd apps/ai && PYTHONPATH=. uvicorn app.main:app --host 127.0.0.1 --port 8000

cli:
	cd apps/ai && python cli.py sample.pdf pdf

test-url:
	curl -X POST http://localhost:8000/api/v1/research/analyze/url -F "url=https://example.com"

test-file:
	curl -X POST http://localhost:8000/api/v1/research/analyze/file \
	     -F "file=@sample.pdf" -F "file_type=pdf"
