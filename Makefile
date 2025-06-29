install:
	pip install -r requirements.txt

dev:
	PYTHONPATH=apps uvicorn ai.main_api:app --reload --reload-dir=apps

cli:
	python main.py sample.pdf pdf

test-url:
	curl -X POST http://localhost:8000/analyze/url -F "url=https://example.com"

test-file:
	curl -X POST http://localhost:8000/analyze/file \
	     -F "file=@sample.pdf" -F "file_type=pdf"
