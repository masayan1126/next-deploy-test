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
            ignores: ['node_modules', "aws", "awscliv2.zip", ".gitignore","README.md","shipitfile.js"],
            keepReleases: 3,
            key: '~/.ssh/ssh_key',
        }
    })

    shipit.on('published', async () => {
        shipit.start('npm:start')
    })
    
    shipit.blTask('npm:start', async () => {
        // shipit.log(`start next server ...`)
        // shipit
        // .remote(`cd /opt/deploy-test/current && nvm install 16 && npm install --production && node_modules/.bin/pm2 kill && npm run build && node_modules/.bin/pm2 start npm --name "next" -- start`)
        // .then(([server1Result, server2Result]) => {
        //     shipit.log(server1Result)
        // })
        // .catch(error => {
        //     shipit.error(error.stderr)
        // })

        await shipit.log(`start next server ...`)
        await shipit.remote(`ln -s /opt/deploy-test/shared/.env.prod /opt/deploy-test/current/.env.prod`)
        // cp env
        // 初回起動：node_modules/.bin/pm2 start npm --name "next" -- start
        // await shipit.remote(`cd /opt/deploy-test/current && nvm install 16 && npm install --production && npm run build && node_modules/.bin/pm2 restart next`)
        await shipit.remote(`cd /opt/deploy-test/current && nvm install 16 && npm install --production && node_modules/.bin/pm2 kill && npm run build:prod && node_modules/.bin/pm2 start npm --name "next" -- start`)
    })
}
