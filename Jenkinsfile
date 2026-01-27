pipeline {
    label 'any'
    customWorkspace '/opt/jenkins-workspace/refal-app_staging'
    tools {
        nodejs 'NodeJS'
    }

    environment {
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')

        APP_FRONTEND = 'frontend-app'
        APP_BACKEND  = 'backend-app'

        VERSION = "${BRANCH_NAME}-1.0.${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Init Environment') {
            steps {
                script {
                    // Map branch to environment and registry
                    if (env.BRANCH_NAME == 'development') {
                        env.ENV_NAME = 'dev'
                        env.REGISTRY = 'dev-registry.local'
                    } else if (env.BRANCH_NAME == 'staging') {
                        env.ENV_NAME = 'staging'
                        env.REGISTRY = 'staging-registry.local'
                        env.SOURCE_REGISTRY = 'dev-registry.local'
                    } else if (env.BRANCH_NAME == 'main') {
                        env.ENV_NAME = 'prod'
                        env.REGISTRY = 'prod-registry.local'
                        env.SOURCE_REGISTRY = 'staging-registry.local'
                    } else {
                        error "Unsupported branch: ${BRANCH_NAME}"
                    }

                    env.FRONTEND_IMAGE = "${REGISTRY}/${APP_FRONTEND}:${VERSION}"
                    env.BACKEND_IMAGE  = "${REGISTRY}/${APP_BACKEND}:${VERSION}"
                    env.SOURCE_FRONTEND_IMAGE = env.SOURCE_REGISTRY ? "${SOURCE_REGISTRY}/${APP_FRONTEND}:${VERSION}" : ""
                    env.SOURCE_BACKEND_IMAGE  = env.SOURCE_REGISTRY ? "${SOURCE_REGISTRY}/${APP_BACKEND}:${VERSION}" : ""

                    echo "Environment: ${ENV_NAME}"
                    echo "Target Registry: ${REGISTRY}"
                }
            }
        }

        stage('Test') {
            steps {
                sh """
                  cd frontend && npm install && npm run build
                  cd ../backend && npm install
                """
            }
        }

        stage('Build or Promote Images') {
            steps {
                script {
                    // Check if frontend image exists
                    def frontendExists = sh(
                        script: "docker pull ${FRONTEND_IMAGE} || echo 'NOT_FOUND'", 
                        returnStdout: true
                    ).trim()

                    // Check if backend image exists
                    def backendExists = sh(
                        script: "docker pull ${BACKEND_IMAGE} || echo 'NOT_FOUND'", 
                        returnStdout: true
                    ).trim()

                    if (frontendExists.contains('NOT_FOUND') || backendExists.contains('NOT_FOUND')) {
                        if (env.ENV_NAME == 'dev') {
                            echo "Building images for DEV..."
                            sh """
                              docker build -t ${FRONTEND_IMAGE} frontend
                              docker build -t ${BACKEND_IMAGE} backend
                            """
                        } else {
                            echo "Promoting images from ${SOURCE_REGISTRY} to ${REGISTRY}..."
                            sh """
                              docker pull ${SOURCE_FRONTEND_IMAGE}
                              docker tag ${SOURCE_FRONTEND_IMAGE} ${FRONTEND_IMAGE}
                              docker pull ${SOURCE_BACKEND_IMAGE}
                              docker tag ${SOURCE_BACKEND_IMAGE} ${BACKEND_IMAGE}
                            """
                        }
                    } else {
                        echo "✅ Images already exist in ${REGISTRY}, skipping build/promotion."
                        currentBuild.result = 'SUCCESS'
                        return
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh """
                  docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy image ${FRONTEND_IMAGE}

                  docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy image ${BACKEND_IMAGE}
                """
            }
        }

        stage('Login and Push') {
            steps {
                sh """
                  echo "${DOCKER_CREDENTIALS_PSW}" | docker login -u "${DOCKER_CREDENTIALS_USR}" --password-stdin
                  docker push ${FRONTEND_IMAGE}
                  docker push ${BACKEND_IMAGE}
                """
            }
        }
    }

    post {
        always {
            sh """
              docker rmi ${FRONTEND_IMAGE} || true
              docker rmi ${BACKEND_IMAGE} || true
              docker logout || true
            """
        }
    }
}
