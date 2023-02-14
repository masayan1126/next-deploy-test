module.exports = (shipit) => {
    const shipDeploy = require('shipit-deploy')

    shipDeploy(shipit)

    shipit.initConfig({
    default: {
        workspace: '.',
        repositoryUrl: false,
        shallowClone: false,
        keepWorkspace: true,
    },
    staging: {
    servers: {
        host: 'ec2-13-230-136-66.ap-northeast-1.compute.amazonaws.com',
        port: 22,
        user: 'ec2-user',
        extraSshOptions: {
            StrictHostKeyChecking: 'no',
            UserKnownHostsFile: '/dev/null',
        },
        },
            branch: 'origin/develop',
            deployTo: '/opt/deploy-test',
            rsyncFrom: './.next',
            keepReleases: 3,
            key: '~/.ssh/ssh_key',
        }
    })

    shipit.on('fetched', async () => {
        shipit.start('npm:build')
    })

    shipit.blTask('npm:build', async () => {
        await shipit.log(`start build ...`)
        await shipit.local('npm install && npm run build')
    })

    shipit.on('updated', async () => {
        shipit.start('npm:install')
    })
    
    shipit.blTask('npm:install', async () => {
    await shipit.log(`install dep ...`)
    await shipit.remoteCopy("package.json", "/opt/deploy-test/")
    await shipit.remoteCopy("package-lock.json", "/opt/deploy-test/")
    })

    shipit.on('published', async () => {
        shipit.start('npm:start')
    })
    
    shipit.blTask('npm:start', async () => {
    await shipit.log(`start server ...`)
    // await shipit.remote(`cd /opt/deploy-test/current && nvm install 16 && npm install --production && npm run start`)
    await shipit.remote(`cd /opt/deploy-test/current && nvm install 16 && npm install --production`)
    })
}
