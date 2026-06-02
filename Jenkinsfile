pipeline {
    agent any

    environment {
        DOTNET_VERSION = '8.0'
        NODE_VERSION   = '20'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Kaynak kod alınıyor...'
                checkout scm
            }
        }

        stage('Backend - Restore & Build') {
            steps {
                echo 'Backend derleniyor (Docker ile)...'
                sh '''
                    docker run --rm \
                        -v "$(pwd)/Backend:/src" \
                        -w /src \
                        mcr.microsoft.com/dotnet/sdk:8.0 \
                        sh -c "dotnet restore AshuraForge.API.csproj && dotnet build AshuraForge.API.csproj -c Release --no-restore"
                '''
            }
        }

        stage('Frontend - Build') {
            steps {
                echo 'Frontend derleniyor (Docker ile)...'
                sh '''
                    docker run --rm \
                        -v "$(pwd)/frontend:/app" \
                        -w /app \
                        node:20-alpine \
                        sh -c "npm ci && npm run build"
                '''
            }
        }

        stage('Docker - Build Image') {
            steps {
                echo 'Docker image oluşturuluyor...'
                sh 'docker build -t ashura-forge-api:latest .'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment tamamlandı!'
            }
        }
    }

    post {
        success {
            echo 'Pipeline başarıyla tamamlandı!'
        }
        failure {
            echo 'Pipeline başarısız oldu!'
        }
    }
}
