# DevOps & Deployment Guide

This guide covers Docker containerization, Kubernetes deployment, and CI/CD pipeline setup for the Netflix Clone application.

---

## 📁 Directory Structure

```
devops/
├── Dockerfile.backend          # Multi-stage build for Spring Boot
├── Dockerfile.frontend         # Multi-stage build for React + Nginx
├── nginx.conf                  # Nginx configuration for frontend
├── docker-compose.yml          # Local development setup with all services
├── .env.example                # Environment variables template
└── kubernetes/
    ├── backend-deployment.yaml # Backend Kubernetes deployment
    ├── frontend-deployment.yaml # Frontend Kubernetes deployment
    └── service.yaml            # Services, NetworkPolicies, HPA, PDB
```

---

## 🐳 Docker Setup

### Prerequisites
- Docker (v20.10+)
- Docker Compose (v2.0+)

### Running with Docker Compose

#### 1. Clone Environment Variables
```bash
cp devops/.env.example devops/.env
# Edit .env with your configuration
```

#### 2. Build Images (Optional)
```bash
cd Netflix
docker-compose build
```

#### 3. Start Services
```bash
docker-compose up -d
```

#### 4. Check Services
```bash
docker-compose ps
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

#### 5. Access Applications
- **Frontend:** http://localhost
- **Backend API:** http://localhost:8080/api
- **Database:** localhost:5432

#### 6. Stop Services
```bash
docker-compose down
```

#### 7. Clean Up (Remove Volumes)
```bash
docker-compose down -v
```

### Docker Service Details

#### PostgreSQL Service
- **Image:** postgres:15-alpine
- **Port:** 5432
- **Volume:** postgres_data (persistent)
- **Health Check:** Enabled

#### Backend Service
- **Build:** Multi-stage Maven + Java 17
- **Port:** 8080
- **Environment:** Connects to postgres service
- **Health Check:** Spring Boot actuator endpoint
- **Depends On:** postgres (waits for health check)

#### Frontend Service
- **Build:** Multi-stage Node + Nginx
- **Port:** 80
- **Configuration:** nginx.conf for SPA routing and API proxy
- **Features:** Gzip compression, security headers, static asset caching

---

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (v1.24+) running
  - **Local Options:** Minikube, Docker Desktop K8s, Kind
  - **Cloud Options:** EKS (AWS), AKS (Azure), GKE (Google Cloud)
- `kubectl` CLI configured
- Container images pushed to registry (GHCR, Docker Hub, etc.)

### Deployment Steps

#### 1. Create Kubernetes Secrets
```bash
# Database credentials
kubectl create secret generic db-credentials \
  --from-literal=username=postgres \
  --from-literal=password=your-secure-password

# JWT secret
kubectl create secret generic jwt-secret \
  --from-literal=secret=your-jwt-secret-key
```

#### 2. Update Image Registry
Edit `kubernetes/backend-deployment.yaml` and `kubernetes/frontend-deployment.yaml`:
```yaml
# Replace:
image: netflix-backend:latest
# With your registry URL:
image: ghcr.io/yourusername/netflix-backend:latest
```

#### 3. Apply Kubernetes Manifests
```bash
# Apply all manifests in order
kubectl apply -f devops/kubernetes/backend-deployment.yaml
kubectl apply -f devops/kubernetes/frontend-deployment.yaml
kubectl apply -f devops/kubernetes/service.yaml
```

#### 4. Verify Deployments
```bash
# Check deployments
kubectl get deployments
kubectl get pods
kubectl get services

# View logs
kubectl logs deployment/netflix-backend
kubectl logs deployment/netflix-frontend

# Describe resources
kubectl describe deployment netflix-backend
kubectl describe service netflix-frontend-service
```

#### 5. Port Forwarding (Local Access)
```bash
# Forward backend
kubectl port-forward service/netflix-backend-service 8080:8080

# Forward frontend
kubectl port-forward service/netflix-frontend-service 80:80
```

#### 6. Access via LoadBalancer
```bash
# Get external IP
kubectl get service netflix-frontend-service --watch

# Access via external IP (if available)
# http://<external-ip>
```

### Kubernetes Features Implemented

#### High Availability
- ✅ Multi-replica deployments (2+ backend, 3+ frontend)
- ✅ Pod Disruption Budgets (PDB) for graceful shutdowns
- ✅ Pod Anti-Affinity to spread across nodes
- ✅ Rolling update strategy

#### Auto-Scaling
- ✅ Horizontal Pod Autoscaler (HPA) for CPU/Memory thresholds
- ✅ Backend: 2-10 replicas (70% CPU, 80% memory)
- ✅ Frontend: 3-20 replicas (75% CPU, 85% memory)

#### Monitoring & Health
- ✅ Liveness probes (pod restart on failure)
- ✅ Readiness probes (traffic routing)
- ✅ Resource requests & limits

#### Security
- ✅ Non-root container execution
- ✅ No privilege escalation
- ✅ Network policies for segmentation
- ✅ Secrets for sensitive data

#### Service Communication
- ✅ ClusterIP for backend (internal only)
- ✅ LoadBalancer for frontend (external access)
- ✅ DNS-based service discovery

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### Workflow File
`.github/workflows/ci.yml` - Comprehensive automated pipeline

### Pipeline Stages

#### 1. **Backend Tests & Build**
- ✅ Java 17 with Maven cache
- ✅ Unit tests with PostgreSQL service
- ✅ Maven build and JAR creation
- ✅ Artifact upload for docker build

#### 2. **Frontend Tests & Build**
- ✅ Node.js 18 with npm cache
- ✅ ESLint code quality checks
- ✅ Vite build process
- ✅ Dist artifact upload

#### 3. **Docker Build & Push**
- ✅ Backend & Frontend image builds
- ✅ Push to GitHub Container Registry (GHCR)
- ✅ Semantic versioning support
- ✅ Docker cache optimization

#### 4. **Security Scanning**
- ✅ Trivy vulnerability scan (files, dependencies)
- ✅ SARIF report upload to GitHub Security tab
- ✅ Scanning for backend and frontend

#### 5. **Code Quality**
- ✅ SonarCloud integration
- ✅ Code coverage analysis
- ✅ Quality gate checks

#### 6. **Staging Deployment** (On develop branch)
- ✅ Automated deployment to staging
- ✅ Integration tests
- ✅ Slack notifications

#### 7. **Production Deployment** (On main branch)
- ✅ Automated production deployment
- ✅ Release creation
- ✅ Health checks
- ✅ Slack notifications

### GitHub Secrets Setup

Add these secrets to your GitHub repository settings:

```bash
GITHUB_TOKEN        # Auto-provided by GitHub
SONAR_TOKEN         # From SonarCloud.io (optional)
SLACK_WEBHOOK       # From Slack workspace (optional)
```

### Triggering Pipeline

**Automatic triggers:**
- Push to `main` → Full pipeline + production deployment
- Push to `develop` → Full pipeline + staging deployment
- Pull Request to `main` or `develop` → Tests only

**Manual trigger:**
Via GitHub Actions UI in repository

### Monitoring Pipeline

1. Go to **Actions** tab in GitHub repository
2. View workflow runs and logs
3. Check **Security** tab for vulnerability reports
4. Monitor deployment status

---

## 🚀 Deployment Strategies

### Local Development
```bash
# Using Docker Compose (easiest)
docker-compose -f devops/docker-compose.yml up -d
```

### Staging Environment
```bash
# Using Kubernetes on staging cluster
kubectl apply -f devops/kubernetes/ --context=staging
```

### Production Environment
```bash
# Using Kubernetes on production cluster
# With custom namespace and resource limits
kubectl apply -f devops/kubernetes/ --context=production --namespace=netflix-prod
```

---

## 📊 Monitoring & Debugging

### View Logs

**Docker Compose:**
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

**Kubernetes:**
```bash
kubectl logs deployment/netflix-backend -f
kubectl logs deployment/netflix-frontend -f
kubectl logs pod/netflix-backend-xxx-yyy
```

### Resource Monitoring

**Docker Compose:**
```bash
docker stats
```

**Kubernetes:**
```bash
kubectl top nodes
kubectl top pods
kubectl describe node <node-name>
```

### Database Access

**Docker Compose:**
```bash
docker exec -it netflix_postgres psql -U postgres -d netflix_clone
```

**Kubernetes:**
```bash
# Create temporary pod to access database
kubectl run -it --image=postgres:15-alpine psql-client --rm --restart=Never -- \
  psql -h postgres-service -U postgres -d netflix_clone
```

---

## 🔧 Troubleshooting

### Docker Issues

#### Port Already in Use
```bash
# Find process using port 8080
lsof -i :8080
# Kill process
kill -9 <PID>
```

#### Container Exit Immediately
```bash
docker-compose logs backend
# Check for missing environment variables or DB connection issues
```

#### Volume Permission Issues
```bash
# On Linux, ensure user owns the volume directory
chmod 755 $(docker volume inspect -f '{{.Mountpoint}}' netflix_postgres_data)
```

### Kubernetes Issues

#### Pod Stuck in CrashLoopBackOff
```bash
kubectl logs <pod-name>
kubectl describe pod <pod-name>
# Check resource limits, env variables, secrets
```

#### Service Not Accessible
```bash
kubectl get endpoints <service-name>
kubectl get service <service-name>
# Verify service selector matches pod labels
```

#### Persistent Volume Issues
```bash
kubectl get pv
kubectl get pvc
kubectl describe pvc <pvc-name>
```

### CI/CD Issues

#### Workflow Not Triggering
- Check branch name matches trigger conditions
- Verify `.github/workflows/ci.yml` syntax with `yamllint`
- Ensure required secrets are set in GitHub

#### Docker Build Fails in CI
```bash
# Check Dockerfile syntax
docker build -f devops/Dockerfile.backend .

# Verify context is correct
docker build -f devops/Dockerfile.backend --build-arg BUILDKIT_INLINE_CACHE=1 .
```

#### Permission Denied for GHCR Push
```bash
# Ensure GitHub token has write access to packages
# Regenerate token with 'write:packages' scope if needed
```

---

## 📝 Configuration Files

### Dockerfile.backend
- Multi-stage build (Maven builder + Java runtime)
- Alpine Java image (small size)
- Health check enabled
- Non-root user execution

### Dockerfile.frontend
- Multi-stage build (Node builder + Nginx runtime)
- Alpine Nginx image
- Nginx configuration from nginx.conf
- Health check enabled

### docker-compose.yml
- PostgreSQL service with volume persistence
- Spring Boot backend with env variables
- React frontend served by Nginx
- Network bridge for inter-service communication
- Health checks for all services

### kubernetes/backend-deployment.yaml
- 2 replicas with RollingUpdate strategy
- Resource requests (256Mi RAM, 250m CPU)
- Resource limits (512Mi RAM, 500m CPU)
- Liveness & readiness probes
- Pod anti-affinity for distribution

### kubernetes/frontend-deployment.yaml
- 3 replicas (more instances for web tier)
- Lower resource consumption (128Mi RAM, 100m CPU)
- EmptyDir volumes for Nginx cache
- Non-root security context

### kubernetes/service.yaml
- ClusterIP service for backend (internal)
- LoadBalancer service for frontend (external)
- NetworkPolicy for traffic control
- HPA with CPU/memory metrics
- PDB for disruption tolerance

### .github/workflows/ci.yml
- Multi-stage workflow with 8+ jobs
- Parallel execution where possible
- Docker image registry integration
- Security scanning with Trivy
- Conditional deployments based on branch
- Slack notifications (optional)

---

## ✅ Best Practices

### Docker
- ✅ Use multi-stage builds to reduce image size
- ✅ Use specific base image versions (not `latest`)
- ✅ Include health checks
- ✅ Use non-root users for security
- ✅ Set resource limits

### Kubernetes
- ✅ Use namespaces for organization
- ✅ Define resource requests & limits
- ✅ Implement HPA for auto-scaling
- ✅ Use network policies for security
- ✅ Enable pod disruption budgets
- ✅ Use health probes (liveness & readiness)

### CI/CD
- ✅ Run tests before building images
- ✅ Security scan all images
- ✅ Use semantic versioning for releases
- ✅ Implement gated deployments (manual approval)
- ✅ Keep secrets in GitHub Secrets, not in code
- ✅ Log deployments for audit trails

---

## 🎯 Next Steps

1. **Local Testing**: Use Docker Compose for development
2. **Staging Deployment**: Deploy to staging K8s cluster
3. **Production Readiness**: 
   - Set up monitoring (Prometheus, Grafana)
   - Configure logging (ELK, CloudWatch)
   - Implement alerting
   - Set backup strategy for databases
4. **CI/CD Optimization**: Add custom tests, security scans
5. **Infrastructure**: Set up load balancing, CDN, DNS

---

For more information on specific services, refer to:
- [Backend README](../backend/README.md)
- [Frontend Documentation](../frontend/README.md)
- [Main README](../README.md)
