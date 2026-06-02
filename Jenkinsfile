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

        stage('Backend - Restore') {
            steps {
                echo 'NuGet paketleri yükleniyor...'
                sh 'dotnet restore backend/AshuraForge.API.csproj'
            }
        }

        stage('Backend - Build') {
            steps {
                echo 'Backend derleniyor...'
                sh 'dotnet build backend/AshuraForge.API.csproj --no-restore -c Release'
            }
        }

        stage('Backend - Publish') {
            steps {
                echo 'Backend publish alınıyor...'
                sh 'dotnet publish backend/AshuraForge.API.csproj -c Release -o ./publish --no-build'
            }
        }

        stage('Frontend - Install') {
            steps {
                echo 'Frontend bağımlılıkları yükleniyor...'
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend - Build') {
            steps {
                echo 'Frontend derleniyor...'
                dir('frontend') {
                    sh 'npm run build'
                }
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
                echo 'Servisler başlatılıyor...'
                sh 'docker compose up -d --build api'
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
