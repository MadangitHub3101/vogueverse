from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

app = FastAPI(title="Wishlist Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store
wishlists = {}

class WishlistItem(BaseModel):
    productId: str
    name: str
    price: float
    image: Optional[str] = None

@app.get("/health")
def health():
    return {"status": "ok", "service": "wishlist-service"}

@app.post("/api/wishlist/add")
def add_item(item: WishlistItem, x_user_id: Optional[str] = "guest"):
    user_id = x_user_id or "guest"
    if user_id not in wishlists:
        wishlists[user_id] = []
    exists = any(i["productId"] == item.productId for i in wishlists[user_id])
    if not exists:
        wishlists[user_id].append(item.dict())
    return {"success": True, "wishlist": wishlists[user_id]}

@app.get("/api/wishlist/items")
def get_items(x_user_id: Optional[str] = "guest"):
    user_id = x_user_id or "guest"
    return {"items": wishlists.get(user_id, [])}

@app.delete("/api/wishlist/remove/{product_id}")
def remove_item(product_id: str, x_user_id: Optional[str] = "guest"):
    user_id = x_user_id or "guest"
    if user_id in wishlists:
        wishlists[user_id] = [i for i in wishlists[user_id] if i["productId"] != product_id]
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 4004))
    uvicorn.run(app, host="0.0.0.0", port=port)