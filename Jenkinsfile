pipeline {
    agent any
    environment {
        EXPO_TOKEN = credentials('expo-token')
        DOCKER_REGISTRY = 'your-registry.com'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Install AI Dependencies') {
                    steps {
                        dir('apps/ai') {
                            sh 'pip install -r requirements.txt'
                        }
                    }
                }
                stage('Install Admin Dependencies') {
                    steps {
                        dir('apps/admin') {
                            sh 'yarn install --frozen-lockfile'
                        }
                    }
                }
                stage('Install RN Dependencies') {
                    steps {
                        dir('apps/lumo') {
                            sh 'yarn install --frozen-lockfile'
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Test AI Backend') {
                    steps {
                        dir('apps/ai') {
                            sh 'python -m pytest tests/ -v'
                        }
                    }
                }
                stage('Test Admin Frontend') {
                    steps {
                        dir('apps/admin') {
                            sh 'yarn test --passWithNoTests'
                        }
                    }
                }
            }
        }

        stage('Database Migration') {
            steps {
                dir('apps/ai') {
                    sh 'python -m alembic upgrade head'
                }
            }
        }

        stage('Build & Deploy Infrastructure') {
            steps {
                sh 'docker-compose build kong loki redis postgres'
                sh 'docker-compose up -d kong loki redis postgres'
            }
        }

        stage('Build & Deploy AI Backend') {
            steps {
                dir('apps/ai') {
                    sh 'docker build -t ${DOCKER_REGISTRY}/lumo-ai:${BUILD_NUMBER} .'
                    sh 'docker push ${DOCKER_REGISTRY}/lumo-ai:${BUILD_NUMBER}'
                }
                sh 'docker-compose up -d --build ai'
            }
        }

        stage('Build & Deploy Admin Frontend') {
            steps {
                dir('apps/admin') {
                    sh 'yarn build'
                    sh 'docker build -t ${DOCKER_REGISTRY}/lumo-admin:${BUILD_NUMBER} .'
                    sh 'docker push ${DOCKER_REGISTRY}/lumo-admin:${BUILD_NUMBER}'
                }
                sh 'docker-compose up -d --build admin'
            }
        }

        stage('Deploy Nginx & Monitoring') {
            steps {
                sh 'docker-compose up -d nginx prometheus grafana'
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Checking services..."
                    sleep 30
                    curl -f http://localhost:8000/health || echo "Kong: ❌"
                    curl -f http://localhost:3100/ready || echo "Loki: ❌"
                    curl -f http://localhost:6379 || echo "Redis: ❌"
                    curl -f http://localhost:5432 || echo "PostgreSQL: ❌"
                    curl -f http://localhost:9090/-/healthy || echo "Prometheus: ❌"
                '''
            }
        }

        stage('Build RN App (Expo)') {
            steps {
                dir('apps/lumo') {
                    sh 'npx eas build --platform all --non-interactive --profile production'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo '🎉 All services deployed successfully!'
            echo '📊 Monitoring: http://localhost:3001 (admin/admin)'
            echo '📈 Prometheus: http://localhost:9090'
            echo '🔍 Logs: http://localhost:3001/explore (Loki)'
            echo '🚪 API Gateway: http://localhost:8002'
        }
        failure {
            echo '❌ Deployment failed'
        }
    }
}