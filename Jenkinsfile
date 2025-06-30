pipeline {
    agent any
    environment {
        EXPO_TOKEN = credentials('expo-token')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy FastAPI') {
            steps {
                dir('apps/ai') {
                    sh 'docker build -t ai-backend .'
                }
                sh 'docker-compose up -d --build ai'
            }
        }

        stage('Build & Deploy Admin (Next.js)') {
            steps {
                dir('apps/admin') {
                    sh 'yarn install'
                    sh 'yarn build'
                    sh 'docker build -t admin-web .'
                }
                sh 'docker-compose up -d --build admin'
            }
        }
        stage('Build RN App (Expo)') {
            steps {
                dir('apps/lumo') {
                    sh 'yarn install'
                    sh 'npx eas build --platform all --non-interactive --profile production'
                }
            }
        }
    }

    post {
        success {
            echo 'All apps deployed!'
        }
        failure {
            echo 'Deployment failed'
        }
    }
}