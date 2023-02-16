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
        host: 'ec2-54-64-62-219.ap-northeast-1.compute.amazonaws.com',
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
            ignores: ['node_modules', "aws", "awscliv2.zip", ".git*","README.md","shipitfile.js", ".env.sample"],
            keepReleases: 3,
            key: '~/.ssh/ssh_key',
        }
    })

    shipit.on('published', async () => {    
        shipit.start('npm:start')
    })
    
    shipit.blTask('npm:start', async () => {
        await shipit.log(`start next server ...`)
        await shipit.remote(`ln -s /opt/deploy-test/shared/.env.prod /opt/deploy-test/current/.env.prod`)
        await shipit.remote(`ln -s /opt/deploy-test/ecosystem.config.js /opt/deploy-test/current/ecosystem.config.js`)

        // pm2はグローバルインストールする(×node_modules/.bin/pm2)
        // npm install -g pm2
        // シークレット登録
        // env、pm2のconfing実体ファイルを作成
        await shipit.remote(`npm install -g pm2 && cd /opt/deploy-test/current && npm install --production && npm run build:prod && ~/.volta/bin/pm2 start ecosystem.config.js`)
    })
}
