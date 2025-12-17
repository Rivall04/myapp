# Project Name
Refal's First Kubernetes Application

# Description 
This project consists of a backend, frontend, and postgres database containerized using Docker and deployed using Kubernetes. The app demonstrates a simple microservices-based architecture.

# Technologies Used
- Docker
- Kubernetes
- Node.js
- React
- PostgreSQL

# Project Structure 
- backend/
- frontend/ 
- k8s/
- .gitignore
- README.md

## Database
The Database is deployed as *Kubernetes resource*. All database-related configurations (Deployment, Service, PVC) are located under k8s/ Folder.

## Prerequisites 
```md
Please Install the Following Tools Before Running the Project: 
- Docker
  Download From: https://docs.docker.com/engine/install/

- kubernetes (MiniKube or k3s)
  MiniKube: https://minikube.sigs.k8s.io/docs/start/
  K3s: https://k3s.io/

- kubectl
  Download From: https://kubernetes.io/docs/tasks/tools/
```
## how to Run the Project  
```bash
git clone https://github.com/Rivall04/myapp.git
cd myapp
```
## Build Docker Images 
```bash
docker build -t Backend ./backend
docker build -t frontend ./frontend
```
## Deploy to Kubernetes 
```bash
kubectl apply -f k8s/
```
## Check pods and Services 
```bash
kubectl get pods
kubectl get svc
```

## Access the Application 
```bash
curl http://backend:3000
```

### Resources used 
```md
- https://kubernetes.io/docs/home/
- https://docs.docker.com/guides/
```
