pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.56.1-noble'
            args '--user 1001 --ipc=host'
        }
    }

    parameters {
        choice(name: 'SUITE', choices: ['smoke', 'full'], description: 'Test suite to run')
    }

    environment {
        PLAYWRIGHT_BASE_URL = credentials('PLAYWRIGHT_BASE_URL')
        WP_USERNAME         = credentials('WP_USERNAME')
        WP_PASSWORD         = credentials('WP_PASSWORD')
        STAGING_HTTP_USER   = credentials('STAGING_HTTP_USER')
        STAGING_HTTP_PASS   = credentials('STAGING_HTTP_PASS')
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Smoke Tests') {
            steps {
                sh 'npm run test:smoke'
            }
        }

        stage('Full Regression') {
            when {
                expression { params.SUITE == 'full' }
            }
            steps {
                sh 'npm run test:ci'
            }
        }
    }

    post {
        always {
            publishHTML(target: [
                allowMissing         : true,
                alwaysLinkToLastBuild: true,
                keepAll              : true,
                reportDir            : 'playwright-report',
                reportFiles          : 'index.html',
                reportName           : 'Playwright Report'
            ])
        }
    }
}
