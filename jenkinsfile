pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME = 'refalalhazmi/my-app'
        IMAGE_TAG = 'latest'
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
                  docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
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
                  docker push ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        always {
            echo 'Cleaning up local Docker images...'
            sh """
              docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true
              docker logout
            """
        }
    }
}
