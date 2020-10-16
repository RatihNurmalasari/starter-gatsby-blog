pipeline {
    agent any

    stages {
        stage ('Checkout: PR') {
            when {
                // env ghprbPullId and ghprbTargetBranch only available from Pull Request
                allOf {
                    //expression { env.ghprbPullId != null }
                    expression { env.ghprbTargetBranch != null }
                    
                }
            }
            steps {
                // checkout branch from pull request branch
                echo 'This is Pull Request'
                checkout([$class: 'GitSCM', branches: [[name: env.ghprbSourceBranch]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '1cd34eb4-1797-493e-b346-050bbfd59fcd', url: 'https://github.com/RatihNurmalasari/starter-gatsby-blog/']]])
                echo "Pull Request Branch from $ghprbSourceBranch"
                echo "Pull Request id =$ghprbPullId"
                sh "ls"
            }
        }

        stage ('Checkout: Master') {
            when { branch 'master' }
            steps { 
                echo 'I only execute on the master branch.' 
                checkout([$class: 'GitSCM', branches: [[name: 'master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '1cd34eb4-1797-493e-b346-050bbfd59fcd', url: 'https://github.com/RatihNurmalasari/starter-gatsby-blog/']]])
                sh "ls"
            }
        }

        stage ('Checkout: Dev') {
            when { branch 'develop' }
            steps {
                echo 'I execute on develop branches.'
                checkout([$class: 'GitSCM', branches: [[name: 'develop']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '1cd34eb4-1797-493e-b346-050bbfd59fcd', url: 'https://github.com/RatihNurmalasari/starter-gatsby-blog/']]])
                sh "ls"
            }
        }
        
        stage('Unit Test') {
            when {
                allOf {
                    expression { env.ghprbPullId != null }
                    expression { env.ghprbTargetBranch != null }
                }
            }
            steps {
                withCredentials([string(credentialsId: 'user_secret', variable: 'USER_SECRET_1'), string(credentialsId: 'password_secret', variable: 'PASS_SECRET_1')]) {
                sh "echo $USER_SECRET_1"
                sh "echo $PASS_SECRET_1"
                echo "Unit Test"
                }
            }
        }
        
        stage('Sonar') {
            steps {
                echo "Sonar"
            }
        }
        
        stage('Build Master') {
            when { branch 'master' }
            steps {
                echo "Build Master"
            }
        }

        stage('Build Develop') {
            when { branch 'develop' }
            steps {
                echo "Build Develop"
            }
        }
    }
}
