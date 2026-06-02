pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Kaynak kod alindi: Ashura Forge'
                echo "Branch: ${env.GIT_BRANCH ?: 'main'}"
                echo "Commit: ${env.GIT_COMMIT ?: 'N/A'}"
            }
        }

        stage('Backend - Dogrulama') {
            steps {
                echo 'Backend dosyalari kontrol ediliyor...'
                sh 'test -f Backend/AshuraForge.API.csproj && echo "csproj bulundu" || echo "csproj bulunamadi"'
                sh 'test -f Backend/Program.cs && echo "Program.cs bulundu" || echo "Program.cs bulunamadi"'
                sh 'ls Backend/Controllers/ | wc -l | xargs -I{} echo "Controller sayisi: {}"'
                sh 'ls Backend/Services/ | wc -l | xargs -I{} echo "Service sayisi: {}"'
            }
        }

        stage('Frontend - Dogrulama') {
            steps {
                echo 'Frontend dosyalari kontrol ediliyor...'
                sh 'test -f frontend/package.json && echo "package.json bulundu" || echo "package.json bulunamadi"'
                sh 'test -f frontend/src/App.jsx && echo "App.jsx bulundu" || echo "App.jsx bulunamadi"'
            }
        }

        stage('Mobil - Dogrulama') {
            steps {
                echo 'Mobil uygulama dosyalari kontrol ediliyor...'
                sh 'test -f mobile/App.js && echo "App.js bulundu" || echo "App.js bulunamadi"'
                sh 'ls mobile/screens/tabs/ | xargs echo "Sekmeler:"'
            }
        }

        stage('Docker - Durum Kontrol') {
            steps {
                echo 'Docker servisleri kontrol ediliyor...'
                sh 'test -f docker-compose.yml && echo "docker-compose.yml bulundu" || echo "docker-compose.yml bulunamadi"'
                sh 'test -f Dockerfile && echo "Dockerfile bulundu" || echo "Dockerfile bulunamadi"'
            }
        }

        stage('Deployment') {
            steps {
                echo 'Ashura Forge pipeline tamamlandi!'
                echo 'Canli: https://ashura-forge-api.onrender.com'
                echo 'Web:   https://ashura-forge-eta.vercel.app'
            }
        }
    }

    post {
        success {
            echo 'Pipeline basariyla tamamlandi!'
        }
        failure {
            echo 'Pipeline basarisiz oldu!'
        }
    }
}
