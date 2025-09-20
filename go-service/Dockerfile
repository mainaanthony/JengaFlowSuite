FROM golang:1.22-alpine AS build
WORKDIR /src
COPY . .
RUN go build -o /out/go-service

FROM alpine:3.20
WORKDIR /app
COPY --from=build /out/go-service ./
EXPOSE 8081
CMD ["./go-service"]
