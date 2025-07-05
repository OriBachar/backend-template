# API Gateway Documentation

## Overview
This document describes the API Gateway setup for the microservices backend using Nginx as a reverse proxy and load balancer.

## Architecture

```
Client Request → API Gateway (Nginx) → Microservices (Auth, User, AWS)
                        ↓
                   Load Balancing + Security + Monitoring
```

## Gateway Features

### 🔒 Security
- **CORS Support**: Configurable cross-origin resource sharing
- **Rate Limiting**: Multiple rate limiting zones for different endpoints
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- **IP Filtering**: Support for trusted proxy IPs
- **SSL/TLS**: Ready for HTTPS configuration

### ⚡ Performance
- **Load Balancing**: Least connections algorithm with health checks
- **Connection Pooling**: Upstream keepalive connections
- **Gzip Compression**: Automatic compression for responses
- **Response Caching**: Configurable proxy caching
- **Request Buffering**: Optimized buffer sizes

### 📊 Monitoring & Logging
- **Detailed Logging**: JSON and standard log formats
- **Health Checks**: Gateway and service health monitoring
- **Prometheus Integration**: Metrics collection ready
- **Request Tracing**: X-Gateway-Route headers for tracking

## API Endpoints

### Gateway Endpoints
- `GET /` - Gateway information
- `GET /health` - Gateway health check
- `GET /api/gateway/status` - Detailed gateway status
- `GET /api/v1/docs` - API documentation

### Service Routes
- `POST /api/v1/auth/*` - Authentication service
- `POST /api/v1/auth/login` - Login endpoint (special rate limiting)
- `GET|POST|PUT|DELETE /api/v1/users/*` - User service
- `GET|POST|PUT|DELETE /api/v1/aws/*` - AWS service

## Rate Limiting Configuration

| Zone | Rate | Burst | Description |
|------|------|-------|-------------|
| api | 10 req/s | 20 | General API endpoints |
| login | 5 req/m | 5 | Login attempts |
| auth | 30 req/m | - | Authentication endpoints |
| upload | 2 req/s | - | File upload endpoints |
| global | 100 req/s | - | Global rate limiting |

## Load Balancing

### Upstream Configuration
- **Algorithm**: Least connections
- **Health Checks**: Automatic failover
- **Timeouts**: 30s connect, 30s send, 30s read
- **Retries**: 3 max failures with 30s timeout

### Service Discovery
Services are automatically discovered through Docker networking:
- `auth-service:3001`
- `user-service:3002`
- `aws-service:3003`

## Error Handling

### HTTP Status Codes
- `200` - Success
- `404` - Endpoint not found
- `429` - Rate limit exceeded
- `500` - Internal server error
- `503` - Service unavailable

### Error Response Format
```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "timestamp": "2025-01-07T15:30:00Z"
}
```

## Deployment

### Docker Compose
```bash
# Start all services with gateway
docker-compose up -d

# Start with monitoring
docker-compose --profile monitoring up -d

# Check gateway status
curl http://localhost/health
```

### Service Access
- **Gateway**: `http://localhost:80`
- **Prometheus**: `http://localhost:9090` (with monitoring profile)
- **Grafana**: `http://localhost:3000` (with monitoring profile)

## Configuration Files

### Nginx Configuration
- `nginx/nginx.conf` - Main nginx configuration
- `nginx/default.conf` - Gateway routing configuration
- `nginx/logs/` - Log files directory

### Monitoring
- `monitoring/prometheus.yml` - Prometheus configuration
- `monitoring/grafana/` - Grafana dashboards

## Security Considerations

### Production Deployment
1. **SSL/TLS**: Configure HTTPS certificates
2. **Rate Limiting**: Adjust based on expected load
3. **CORS**: Configure specific origins instead of wildcard
4. **Secrets**: Use environment variables for sensitive data
5. **Firewall**: Configure proper network security

### Environment Variables
```bash
# Example secure configuration
CORS_WHITELIST=https://yourdomain.com,https://app.yourdomain.com
RATE_LIMIT_API=50r/s
RATE_LIMIT_LOGIN=10r/m
```

## Monitoring and Debugging

### Log Analysis
```bash
# View gateway logs
docker logs microservices-gateway

# View access logs
docker exec microservices-gateway tail -f /var/log/nginx/access.log

# View error logs
docker exec microservices-gateway tail -f /var/log/nginx/error.log
```

### Health Checks
```bash
# Gateway health
curl http://localhost/health

# Service status
curl http://localhost/api/gateway/status

# Individual service health
curl http://localhost/api/v1/auth/health
curl http://localhost/api/v1/users/health
curl http://localhost/api/v1/aws/health
```

### Testing Endpoints
```bash
# Test authentication
curl -X POST http://localhost/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test user service
curl -X GET http://localhost/api/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test AWS service
curl -X GET http://localhost/api/v1/aws/ec2/instances \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Common Issues
1. **Service Unavailable (503)**
   - Check if backend services are running
   - Verify health check endpoints
   - Check network connectivity

2. **Rate Limiting (429)**
   - Adjust rate limiting zones
   - Check client IP for proper rate limiting

3. **CORS Issues**
   - Verify CORS configuration
   - Check preflight request handling

4. **SSL/TLS Issues**
   - Verify certificate configuration
   - Check SSL cipher suites

### Debug Commands
```bash
# Test nginx configuration
docker exec microservices-gateway nginx -t

# Reload nginx configuration
docker exec microservices-gateway nginx -s reload

# Check upstream status
docker exec microservices-gateway curl -s http://localhost/api/gateway/status
```

## Performance Tuning

### Nginx Optimization
- Worker processes: `auto` (matches CPU cores)
- Worker connections: `1024` per worker
- Keepalive timeout: `65s`
- Client body size: `10M`

### Cache Configuration
- Proxy cache: `/tmp/nginx_cache`
- Cache size: `100MB`
- Cache inactive: `60m`

### Monitoring Metrics
- Request rate and response times
- Upstream health and latency
- Error rates and status codes
- Cache hit/miss ratios

## Future Enhancements

1. **Service Mesh**: Consider Istio or Linkerd for advanced traffic management
2. **API Versioning**: Implement API version routing
3. **Circuit Breaker**: Add circuit breaker pattern for resilience
4. **Distributed Tracing**: Implement OpenTracing/Jaeger
5. **Web Application Firewall**: Add WAF for enhanced security
6. **Auto-scaling**: Implement horizontal pod autoscaling
7. **Blue-Green Deployment**: Support for zero-downtime deployments 