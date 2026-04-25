pipeline {
    agent any

    stages {

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
                sh '''
                sleep 30
                curl http://localhost:5000 || echo "Backend not ready"
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Skipping Kubernetes"
            }
        }
    }
}