from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import random

app = FastAPI(title="Recommendation Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PRODUCTS = [
    {"id": 1, "name": "Classic White Tee", "category": "Men", "price": 799},
    {"id": 2, "name": "Floral Sundress", "category": "Women", "price": 1499},
    {"id": 3, "name": "Slim Fit Chinos", "category": "Men", "price": 1299},
    {"id": 4, "name": "Crop Hoodie", "category": "Women", "price": 1099},
    {"id": 5, "name": "Denim Jacket", "category": "Unisex", "price": 2299},
    {"id": 6, "name": "Ethnic Kurta", "category": "Men", "price": 999},
]

@app.get("/health")
def health():
    return {"status": "ok", "service": "recommendation-service"}

@app.get("/api/rec/products")
def get_recommendations(user_id: str = "guest", limit: int = 4):
    # Simulate recommendation logic (shuffle for demo)
    recs = random.sample(PRODUCTS, min(limit, len(PRODUCTS)))
    return {
        "userId": user_id,
        "recommendations": recs,
        "algorithm": "collaborative-filtering-v1"
    }

@app.get("/api/rec/similar/{product_id}")
def get_similar(product_id: int, limit: int = 3):
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if not product:
        return {"similar": []}
    similar = [p for p in PRODUCTS if p["category"] == product["category"] and p["id"] != product_id]
    return {"productId": product_id, "similar": similar[:limit]}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 4005))
    uvicorn.run(app, host="0.0.0.0", port=port)