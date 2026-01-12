pipeline {
    agent any
	
    tools {
        nodejs 'NodeJS'
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        FRONTEND_IMAGE = 'refalalhazmi/frontend-app'
        BACKEND_IMAGE  = 'refalalhazmi/backend-app'
        VERSION = "${BRANCH_NAME}-1.0.${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Building branch: ${env.BRANCH_NAME}"
                checkout scm
            }
        }

	stage('Test'){
	   steps {
               echo 'Here we go testing this amazing app...'
 	       sh """
		
        	  cd frontend && npm install && npm run build
         	  cd ../backend && npm install 
	       """ }

       }

        stage('Build Image') {
            steps {
                echo 'Building Docker image...'
                sh """
                  docker build -t ${FRONTEND_IMAGE}:${VERSION} frontend
           
                  docker build -t ${BACKEND_IMAGE}:${VERSION} backend            
                """
            }
        }
		
		stage('Security Scan') {
    steps {
        echo 'Scanning Docker images for vulnerabilities...'
        sh """
          docker run --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy image ${FRONTEND_IMAGE}:${VERSION}

          docker run --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy image ${BACKEND_IMAGE}:${VERSION}
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

            when {
                anyOf {
                    branch 'development'
                    branch 'staging'
                }
            }

            steps {
                echo 'Pushing Docker image to Docker Hub...'
                sh """
                  docker push ${FRONTEND_IMAGE}:${VERSION}
                  
                  docker push ${BACKEND_IMAGE}:${VERSION}
                """
            }
        }
    }

    post {
        always {
            echo 'Cleaning up local Docker images...'
            sh """
              docker rmi ${FRONTEND_IMAGE}:${VERSION} || true
              docker rmi ${BACKEND_IMAGE}:${VERSION} || true
              docker logout
            """
        }
    }
}
