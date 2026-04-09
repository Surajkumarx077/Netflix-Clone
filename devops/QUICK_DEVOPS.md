# Quick DevOps Commands

## 🐳 Docker Compose Quick Reference

### Development Setup
```bash
# Clone and setup
git clone <repo> && cd Netflix
cp devops/.env.example devops/.env

# Start services
docker-compose -f devops/docker-compose.yml up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### Daily Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Rebuild images
docker-compose build

# Execute commands in container
docker-compose exec backend sh
docker-compose exec frontend sh

# Clean up everything
docker-compose down -v
```

### Database Operations
```bash
# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d netflix_clone

# Backup database
docker-compose exec postgres pg_dump -U postgres netflix_clone > backup.sql

# Restore database
docker-compose exec postgres psql -U postgres netflix_clone < backup.sql
```

---

## ☸️ Kubernetes Quick Reference

### Initial Setup
```bash
# Create secrets
kubectl create secret generic db-credentials \
  --from-literal=username=postgres \
  --from-literal=password=postgres

kubectl create secret generic jwt-secret \
  --from-literal=secret=super-secret-jwt-key

# Deploy application
kubectl apply -f devops/kubernetes/
```

### Monitoring & Debugging
```bash
# View all resources
kubectl get all
kubectl get pods,svc,deploy

# View logs
kubectl logs deployment/netflix-backend
kubectl logs -f pod/<pod-name>

# Describe resources
kubectl describe deployment/netflix-backend
kubectl describe service/netflix-frontend-service

# Port forwarding
kubectl port-forward service/netflix-backend-service 8080:8080
kubectl port-forward service/netflix-frontend-service 80:80
```

### Scaling & Management
```bash
# Manual scaling
kubectl scale deployment netflix-backend --replicas=4

# View HPA status
kubectl get hpa

# Watch pod status
kubectl get pods --watch

# Delete resources
kubectl delete deployment netflix-backend
kubectl delete -f devops/kubernetes/
```

### Database Access
```bash
# Connect to database via pod
kubectl run -it --rm --image=postgres:15-alpine db-client \
  -- psql -h postgres-service -U postgres -d netflix_clone

# View pods
kubectl get pods | grep postgres
```

---

## 🔄 CI/CD Pipeline Commands

### Local Testing
```bash
# Test backend
cd backend
mvn clean test

# Test frontend
cd frontend
npm test

# Build backend
cd backend
mvn clean package -DskipTests

# Build frontend
cd frontend
npm run build
```

### Docker Image Building
```bash
# Build backend image
docker build -f devops/Dockerfile.backend -t netflix-backend:local .

# Build frontend image
docker build -f devops/Dockerfile.frontend -t netflix-frontend:local .

# Push to registry
docker tag netflix-backend:local ghcr.io/username/netflix-backend:latest
docker push ghcr.io/username/netflix-backend:latest
```

### GitHub Actions
```bash
# View workflow status (GitHub CLI)
gh run list
gh run view <run-id>

# Trigger workflow manually (if configured)
gh workflow run ci.yml

# View recent logs
gh run view <run-id> --log
```

---

## 🔍 Troubleshooting Commands

### Docker Issues
```bash
# View image layers
docker history netflix-backend:local

# Inspect container
docker inspect <container-id>

# Clean up unused resources
docker system prune -a

# Check disk usage
docker system df
```

### Kubernetes Issues
```bash
# Get node status
kubectl get nodes
kubectl describe node <node-name>

# Check resource usage
kubectl top pods
kubectl top nodes

# Troubleshoot pod creation
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl logs <pod-name> --previous

# Check events
kubectl get events --sort-by='.lastTimestamp'
```

### Port Conflicts
```bash
# Find process using port (Linux/Mac)
lsof -i :8080
lsof -i :5173

# Find process using port (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## 📊 Monitoring Commands

### Docker Compose Monitoring
```bash
# Real-time resource usage
docker stats

# Network inspection
docker network inspect netflix_network

# Volume inspection
docker volume inspect netflix_postgres_data
```

### Kubernetes Monitoring
```bash
# Resource metrics
kubectl top nodes
kubectl top pods
kubectl describe nodes

# Pod resource requests
kubectl get pods -o json | jq '.items[].spec.containers[].resources'

# HPA metrics
kubectl get hpa -w
kubectl describe hpa netflix-backend-hpa

# Metrics server status
kubectl get deployment metrics-server -n kube-system
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Security scan completed
- [ ] Environment variables configured
- [ ] Backups created
- [ ] Scaling policies reviewed

### Deployment Steps
- [ ] Update image tags
- [ ] Apply Kubernetes manifests
- [ ] Verify pod startup
- [ ] Check health probes
- [ ] Verify service endpoints
- [ ] Test API endpoints
- [ ] Monitor logs for errors

### Post-Deployment
- [ ] Monitor resource usage
- [ ] Check application health
- [ ] Verify database connectivity
- [ ] Test user workflows
- [ ] Monitor error rates
- [ ] Check performance metrics

---

## 📝 Useful Aliases (Add to ~/.bashrc or ~/.zshrc)

```bash
# Docker shortcuts
alias dc='docker-compose'
alias dcup='docker-compose up -d'
alias dcdown='docker-compose down'
alias dclogs='docker-compose logs -f'
alias dcps='docker-compose ps'

# Kubernetes shortcuts
alias k='kubectl'
alias kg='kubectl get'
alias kd='kubectl describe'
alias kl='kubectl logs'
alias kaf='kubectl apply -f'
alias kdel='kubectl delete'
alias kpf='kubectl port-forward'

# Combined
alias devstart='docker-compose -f devops/docker-compose.yml up -d'
alias devstop='docker-compose -f devops/docker-compose.yml down'
alias devlogs='docker-compose -f devops/docker-compose.yml logs -f'
```

---

## 🔗 Resources

- [Docker Documentation](https://docs.docker.com)
- [Kubernetes Documentation](https://kubernetes.io/docs)
- [GitHub Actions](https://github.com/features/actions)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)

---

## ❓ Common Issues & Solutions

### Docker Compose Port Conflict
```bash
# Solution: Change port in docker-compose.yml
ports:
  - "8081:8080"  # Use 8081 instead
```

### Kubernetes Pod Stuck
```bash
# View events for the pod
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>

# Force delete if necessary
kubectl delete pod <pod-name> --grace-period=0 --force
```

### CI/CD Pipeline Failure
```bash
# Check workflow logs in GitHub Actions
# Fix issues locally:
cd backend && mvn clean test
cd frontend && npm test

# Push fix to trigger new workflow
git add .
git commit -m "Fix: ..."
git push
```

### Database Connection Error
```bash
# Docker Compose:
docker-compose logs postgres
docker-compose restart postgres

# Kubernetes:
kubectl logs postgres-pod
kubectl describe pod postgres-pod
```

---

For detailed information, see [DEVOPS.md](./DEVOPS.md)
