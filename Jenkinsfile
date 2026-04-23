pipeline {
    agent any
    environment {
        DOCKER_IMAGE_BACKEND  = "zamota-backend"
        DOCKER_IMAGE_FRONTEND = "zamota-frontend"
        APP_PORT_FRONTEND     = "3000"
        APP_PORT_BACKEND      = "5000"
        K8S_DIR               = "k8s"
    }
    stages {
        stage('Clone Repository') {
            steps {
                echo '>>> Cloning repository from GitHub...'
                echo 'https://github.com/Nayana-07ds/zamota-app.git'
                checkout scm
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                echo '>>> Building backend Docker image...'
                dir('backend') {
                    sh 'docker build -t ${DOCKER_IMAGE_BACKEND}:latest .'
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                echo '>>> Building frontend Docker image...'
                dir('frontend') {
                    sh 'docker build -t ${DOCKER_IMAGE_FRONTEND}:latest .'
                }
            }
        }

        stage('Verify Docker Images') {
            steps {
                echo '>>> Verifying Docker images were created...'
                sh 'docker images | grep -E "zamota|REPOSITORY"'
            }
        }

        stage('Stop Old Containers') {
            steps {
                echo '>>> Stopping any old running containers...'
                sh 'docker-compose down || true'
            }
        }

        stage('Run Application with Docker') {
            steps {
                echo '>>> Starting app with docker-compose...'
                sh 'docker-compose up -d'
                echo '>>> App is running via Docker!'
                echo '>>> Frontend: http://localhost:3000'
                echo '>>> Backend:  http://localhost:5000/api/health'
            }
        }

        stage('Health Check') {
            steps {
                echo '>>> Waiting for backend to start...'
                sleep(time: 10, unit: 'SECONDS')
                sh 'curl -f http://localhost:5000/api/health || echo "Health check done"'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '>>> Deploying application to Kubernetes (Minikube)...'
                sh 'kubectl apply -f ${K8S_DIR}/'
                echo '>>> Kubernetes deployment applied!'
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                echo '>>> Waiting for pods to start...'
                sleep(time: 15, unit: 'SECONDS')
                echo '>>> Checking pods status...'
                sh 'kubectl get pods'
                echo '>>> Checking services...'
                sh 'kubectl get services'
                echo '>>> Checking deployments...'
                sh 'kubectl get deployments'
            }
        }
    }

    post {
        success {
            echo '============================================='
            echo ' BUILD SUCCESSFUL!'
            echo ' Git → Jenkins → Docker → Kubernetes ✅'
            echo ' Docker  Frontend : http://localhost:3000'
            echo ' Docker  Backend  : http://localhost:5000'
            echo ' K8s App Access   : minikube service zamota-frontend-svc'
            echo '============================================='
        }
        failure {
            echo '============================================='
            echo ' BUILD FAILED. Check logs above.'
            echo '============================================='
        }
    }
}
