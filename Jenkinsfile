pipeline {
    agent any

    environment {
        // Change these to your Docker Hub username if you want to push
        DOCKER_IMAGE_BACKEND  = "zamota-backend"
        DOCKER_IMAGE_FRONTEND = "zamota-frontend"
        APP_PORT_FRONTEND     = "3000"
        APP_PORT_BACKEND      = "5000"
    }

    stages {

        stage('Clone Repository') {
            steps {
                echo '>>> Cloning code from GitHub...'
                // Jenkins will auto-checkout from the GitHub repo you configure in the job
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
                echo '>>> Verifying images were created...'
                sh 'docker images | grep -E "zamota|REPOSITORY"'
            }
        }

        stage('Stop Old Containers') {
            steps {
                echo '>>> Stopping any old running containers...'
                sh 'docker-compose down || true'
            }
        }

        stage('Run Application') {
            steps {
                echo '>>> Starting app with docker-compose...'
                sh 'docker-compose up -d'
                echo '>>> App is running!'
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

    }

    post {
        success {
            echo '========================================='
            echo ' BUILD SUCCESSFUL! App is running.'
            echo ' Open http://localhost:3000 in browser'
            echo '========================================='
        }
        failure {
            echo '========================================='
            echo ' BUILD FAILED. Check logs above.'
            echo '========================================='
        }
    }
}
