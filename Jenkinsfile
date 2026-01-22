pipeline {
    agent any
	
    tools {
        nodejs 'NodeJS'
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DEV_REGISTRY = 'refalalhazmi/dev-app'
        STAGING_REGISTRY = 'refalalhazmi/staging-app'
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
                script {
                    if (env.BRANCH_NAME == 'development') {
                        env.IMAGE = "${DEV_REGISTRY}:${VERSION}"
                    } else if (env.BRANCH_NAME == 'staging') {
                        env.IMAGE = "${STAGING_REGISTRY}:${VERSION}"
                    } else {
                        error("Branch ${BRANCH_NAME} is not handled in this pipeline")
                    }
                    echo "Building image ${IMAGE}"
                    sh "docker build -t ${IMAGE} ."
                }
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

			steps {
                script {
                
                    sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"

                    def imageExists = sh(script: "docker manifest inspect ${IMAGE}", returnStatus: true)

                    if (imageExists != 0) {
                        echo "Image ${IMAGE} does not exist. Pushing..."
                        sh "docker push ${IMAGE}"
                    } else {
                        echo "Image ${IMAGE} already exists in registry. Skipping push."
                    }

                    sh "docker logout"
                }
            }
    }

    post {
        always {
            echo 'Cleaning up local Docker images...'
            sh """
              sh "docker rmi ${IMAGE} || true"
              docker logout
            """
        }
    }
}
