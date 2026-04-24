package main

import (
	"database/sql"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type Product struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Category string `json:"category"`
	Price    int    `json:"price"`
}

var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "search-service"})
	})

	r.GET("/api/search/products", func(c *gin.Context) {
		q := strings.ToLower(c.Query("q"))
		var rows *sql.Rows
		var err error
		if q == "" {
			rows, err = db.Query("SELECT id, name, category, price FROM products")
		} else {
			rows, err = db.Query(
				"SELECT id, name, category, price FROM products WHERE LOWER(name) LIKE $1 OR LOWER(category) LIKE $1",
				"%"+q+"%",
			)
		}
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()
		var results []Product
		for rows.Next() {
			var p Product
			rows.Scan(&p.ID, &p.Name, &p.Category, &p.Price)
			results = append(results, p)
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
