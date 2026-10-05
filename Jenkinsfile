pipeline {
    agent any

    triggers {
        githubPush()
    }

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        IMAGE_NAME = 'counter-app'
        DOCKER_REGISTRY = 'https://index.docker.io/v1/'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
    }

    stages {
        stage('Checkout') {
            when {
                branch 'main'
            }
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            when {
                branch 'main'
            }
            steps {
                dir('tp1') {
                    sh 'npm ci'
                }
            }
        }

        stage('Unit tests') {
            when {
                branch 'main'
            }
            steps {
                dir('tp1') {
                    sh 'npm test'
                }
            }
        }

        stage('Build image') {
            when {
                branch 'main'
            }
            steps {
                script {
                    dockerImage = docker.build(
                        "${env.DOCKERHUB_CREDENTIALS_USR}/${env.IMAGE_NAME}:${env.BUILD_NUMBER}",
                        'tp1'
                    )
                }
            }
        }

        stage('Publish image') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.withRegistry(env.DOCKER_REGISTRY, env.DOCKER_CREDENTIALS_ID) {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }
    }

    post {
        always {
            deleteDir()
        }
    }
}
