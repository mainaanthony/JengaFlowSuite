# JengaFlow Go Service

High-performance Go microservice for **AI-powered materials estimation** and **Google Maps route optimization**.

## 🚀 Features

### Route Optimization

- **🗺️ Google Maps Integration** - Real-time route optimization with traffic
- **📍 Geocoding** - Convert addresses to coordinates automatically
- **🔄 Automatic Fallback** - Uses Haversine calculations without API key
- **⚡ Priority Handling** - High-priority deliveries first
- **👥 Multi-Driver Support** - Distribute deliveries across drivers

### Materials Estimation

- **🤖 AI-Powered** - Natural language project descriptions
- **📊 Multiple Methods** - Building type, area, or cement-based
- **💰 Cost Calculation** - Materials + labor + timeline
- **📋 Smart Recommendations** - Context-aware suggestions
- **🔧 Manual Methods** - Formula-based calculations as fallback

## Quick Start

```bash
# Basic setup (no API keys)
go run main.go

# With AI & Google Maps
cp .env.example .env
# Edit .env with your API keys
export $(cat .env | xargs)
go run main.go
```

**Access**: http://localhost:8081

## Documentation

- **[AI & Google Maps Guide](AI_GOOGLE_MAPS_GUIDE.md)** - Full integration guide
- **[Service Documentation](SERVICE_DOCUMENTATION.md)** - API reference
- **[Testing Guide](TESTING_GUIDE.md)** - Test scripts and examples

## API Endpoints

### Materials Estimation

- `POST /api/materials/estimate/ai` - AI-powered estimation
- `POST /api/materials/estimate/building` - Standard building types
- `POST /api/materials/estimate/area` - Area-based estimation
- `POST /api/materials/estimate/cement` - Cement-based calculation
- `GET /api/materials/prices` - Current material prices

### Route Optimization

- `POST /api/routes/optimize/single` - Single driver route
- `POST /api/routes/optimize/multiple` - Multiple drivers
- `GET /api/routes/examples` - API examples

## Example Usage

### AI Materials Estimation

```bash
curl -X POST http://localhost:8081/api/materials/estimate/ai \
  -H "Content-Type: application/json" \
  -d '{
    "projectDescription": "Modern 3-bedroom house with quality finishes",
    "area": 150,
    "floors": 1
  }'
```

### Route Optimization

```bash
curl -X POST http://localhost:8081/api/routes/optimize/single \
  -H "Content-Type: application/json" \
  -d @route_request.json
```

## Configuration

See `.env.example` for all configuration options.

**Key Variables:**

- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- `AI_API_KEY` - OpenAI or compatible AI API key
- `AI_MODEL` - Model to use (default: gpt-4)
- `PORT` - Server port (default: 8081)

## Requirements

- Go 1.22 or higher
- (Optional) Google Maps API key
- (Optional) OpenAI API key

## Building

```bash
go build -o jengaflow-service
./jengaflow-service
```

## Docker

```bash
docker build -t jengaflow-go-service .
docker run -p 8081:8081 \
  -e GOOGLE_MAPS_API_KEY=your_key \
  -e AI_API_KEY=your_key \
  jengaflow-go-service
```

## License

Part of JengaFlowSuite - Business Management System
