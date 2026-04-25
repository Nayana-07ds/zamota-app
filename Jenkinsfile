pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/Nayana-07ds/zamota-app.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t zamota-backend .'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t zamota-frontend .'
                }
            }
        }

        stage('Run Application') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                echo "Waiting for backend..."
                sh '''
                sleep 30
                curl http://localhost:5000 || echo "Backend not ready"
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Skipping Kubernetes for Jenkins"
            }
        }
    }
}