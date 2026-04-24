from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import databases, os

DATABASE_URL = os.environ["DATABASE_URL"]
database = databases.Database(DATABASE_URL)

app = FastAPI(title="Wishlist Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class WishlistItem(BaseModel):
    productId: str
    name: str
    price: float
    image: Optional[str] = None

@app.on_event("startup")
async def startup():
    await database.connect()
    await database.execute("""
        CREATE TABLE IF NOT EXISTS wishlist_items (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(100) NOT NULL,
            product_id VARCHAR(100) NOT NULL,
            name TEXT NOT NULL,
            price NUMERIC NOT NULL,
            image TEXT,
            UNIQUE(user_id, product_id)
        )
    """)

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/health")
def health():
    return {"status": "ok", "service": "wishlist-service"}

@app.post("/api/wishlist/add")
async def add_item(item: WishlistItem, x_user_id: Optional[str] = "guest"):
    await database.execute("""
        INSERT INTO wishlist_items (user_id, product_id, name, price, image)
        VALUES (:uid, :pid, :name, :price, :image)
        ON CONFLICT (user_id, product_id) DO NOTHING
    """, {"uid": x_user_id, "pid": item.productId, "name": item.name, "price": item.price, "image": item.image})
    rows = await database.fetch_all("SELECT * FROM wishlist_items WHERE user_id=:uid", {"uid": x_user_id})
    return {"success": True, "wishlist": [dict(r) for r in rows]}

@app.get("/api/wishlist/items")
async def get_items(x_user_id: Optional[str] = "guest"):
    rows = await database.fetch_all("SELECT * FROM wishlist_items WHERE user_id=:uid", {"uid": x_user_id})
    return {"items": [dict(r) for r in rows]}

@app.delete("/api/wishlist/remove/{product_id}")
async def remove_item(product_id: str, x_user_id: Optional[str] = "guest"):
    await database.execute(
        "DELETE FROM wishlist_items WHERE user_id=:uid AND product_id=:pid",
        {"uid": x_user_id, "pid": product_id}
    )
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 4004)))
