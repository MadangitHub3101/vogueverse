from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import databases, os, random

DATABASE_URL = os.environ["DATABASE_URL"]
database = databases.Database(DATABASE_URL)

app = FastAPI(title="Recommendation Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

SEED_PRODUCTS = [
    (1,"Classic White Tee","Men",799),
    (2,"Floral Sundress","Women",1499),
    (3,"Slim Fit Chinos","Men",1299),
    (4,"Crop Hoodie","Women",1099),
    (5,"Denim Jacket","Unisex",2299),
    (6,"Ethnic Kurta","Men",999),
]

@app.on_event("startup")
async def startup():
    await database.connect()
    await database.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INT PRIMARY KEY,
            name TEXT,
            category TEXT,
            price INT
        )
    """)
    for p in SEED_PRODUCTS:
        await database.execute("""
            INSERT INTO products (id,name,category,price) VALUES (:id,:name,:cat,:price)
            ON CONFLICT (id) DO NOTHING
        """, {"id":p[0],"name":p[1],"cat":p[2],"price":p[3]})

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/health")
def health():
    return {"status": "ok", "service": "recommendation-service"}

@app.get("/api/rec/products")
async def get_recommendations(user_id: str = "guest", limit: int = 4):
    rows = await database.fetch_all("SELECT * FROM products")
    recs = random.sample([dict(r) for r in rows], min(limit, len(rows)))
    return {"userId": user_id, "recommendations": recs}

@app.get("/api/rec/similar/{product_id}")
async def get_similar(product_id: int, limit: int = 3):
    product = await database.fetch_one("SELECT * FROM products WHERE id=:id", {"id": product_id})
    if not product:
        return {"similar": []}
    similar = await database.fetch_all(
        "SELECT * FROM products WHERE category=:cat AND id!=:id LIMIT :lim",
        {"cat": product["category"], "id": product_id, "lim": limit}
    )
    return {"productId": product_id, "similar": [dict(r) for r in similar]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 4005)))
