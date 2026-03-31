FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY . .
EXPOSE 4003
CMD ["node", "index.js"]
```

---

## ❤️ WISHLIST SERVICE (Python :4004)

### 📄 `wishlist-service/requirements.txt`
```
fastapi==0.109.0
uvicorn==0.27.0