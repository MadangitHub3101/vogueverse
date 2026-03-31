FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 4004
CMD ["python", "main.py"]
```

---

## 🤖 RECOMMENDATION SERVICE (Python :4005)

### 📄 `recommendation-service/requirements.txt`
```
fastapi==0.109.0
uvicorn==0.27.0