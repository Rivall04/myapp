pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        FRONTEND_IMAGE = 'refalalhazmi/frontend-app'
        BACKEND_IMAGE  = 'refalalhazmi/backend-app'
    }

    stages {

        stage('Clone Repo') {
            steps {
                echo 'Cloning Git repository...'
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                echo 'Building Docker image...'
                sh """
                  docker build -t ${FRONTEND_IMAGE}:latest frontend
                  docker build -t ${BACKEND_IMAGE}:latest backend
                """
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo 'Logging in to Docker Hub...'
                sh """
                  echo "${DOCKERHUB_CREDENTIALS_PSW}" | \
                  docker login -u "${DOCKERHUB_CREDENTIALS_USR}" --password-stdin
                """
            }
        }

        stage('Push Image') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'
                sh """
                  docker push ${FRONTEND_IMAGE}:latest
                  docker push ${BACKEND_IMAGE}:latest
                """
            }
        }
    }

    post {
        always {
            echo 'Cleaning up local Docker images...'
            sh """
              docker rmi ${FRONTEND_IMAGE}:latest || true
              docker rmi ${BACKEND_IMAGE}:latest || true
              docker logout
            """
        }
    }
}
