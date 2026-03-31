FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN go build -o search-service .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/search-service .
EXPOSE 4002
CMD ["./search-service"]