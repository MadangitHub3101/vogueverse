package main

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

type Product struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Category string `json:"category"`
	Price    int    `json:"price"`
}

var products = []Product{
	{1, "Classic White Tee", "Men", 799},
	{2, "Floral Sundress", "Women", 1499},
	{3, "Slim Fit Chinos", "Men", 1299},
	{4, "Crop Hoodie", "Women", 1099},
	{5, "Denim Jacket", "Unisex", 2299},
	{6, "Ethnic Kurta", "Men", 999},
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "search-service"})
	})

	r.GET("/api/search/products", func(c *gin.Context) {
		q := strings.ToLower(c.Query("q"))
		if q == "" {
			c.JSON(http.StatusOK, gin.H{"results": products})
			return
		}
		var results []Product
		for _, p := range products {
			if strings.Contains(strings.ToLower(p.Name), q) ||
				strings.Contains(strings.ToLower(p.Category), q) {
				results = append(results, p)
			}
		}
		if results == nil {
			results = []Product{}
		}
		c.JSON(http.StatusOK, gin.H{"results": results, "count": len(results)})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "4002"
	}
	r.Run(":" + port)
}