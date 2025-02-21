# --- Builder Stage (optional for compiling dependencies) ---
FROM python:3.9-slim as builder
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# --- Final Stage ---
FROM python:3.9-slim
WORKDIR /app
# Copy installed packages from builder or install directly
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
# Copy backend code
COPY backend /app
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
