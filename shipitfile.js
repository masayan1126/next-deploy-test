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
            deployTo: '/opt/deploy-test/',
            rsyncFrom: '.',
            ignores: ['node_modules'],
            keepReleases: 3,
            key: '~/.ssh/ssh_key',
        }
    })

    shipit.on('published', async () => {
        shipit.start('npm:start')
    })
    
    shipit.blTask('npm:start', async () => {
        await shipit.log(`start next server ...`)
        // await shipit.remoteCopy("package.json", "/opt/deploy-test/current/")
        // await shipit.remoteCopy("package-lock.json", "/opt/deploy-test/current/")
        await shipit.remote(`cd /opt/deploy-test/current && nvm install 16 && npm install --production && node_modules/.bin/pm2 start npm --name "next" -- start`)
    })
}
