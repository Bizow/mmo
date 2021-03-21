/**
 * http://meteor-up.com/docs.html
 * mup deploy --settings=../settings.json
 * ssh root@167.172.152.55
 *
 * https://forum.unity.com/threads/linux-il2cpp-cross-compiler-packages-now-available-in-preview.975693/
 * Linux: com.unity.toolchain.linux-x86_64@0.1.13-preview
 * macOS: com.unity.toolchain.macos-x86_64-linux-x86_64@0.1.15-preview
 * Windows: com.unity.toolchain.win-x86_64-linux-x86_64@0.1.14-preview
 * scp ~/Desktop/mmoserver.zip root@167.172.152.55:/
 * scp ~/Desktop/DotsServer.zip root@167.172.152.55:/
 * unzip DotsSampleServer.zip
 * chmod +x ./DotsLinuxServer.x86_64
 * chmod +x ./mmoserver.x86_64
 *
 * ./mmoserver.x86_64 -batchmode -nographics &
 * ./DotsLinuxServer.x86_64
 * ps -A
 * kill 14291
 * docker exec -it mongodb mongo rts
 * Unsupported key format: ssh-keygen -p -m PEM -f ~/.ssh/id_rsa
 *
 */
module.exports = {
  servers: {
    one: {
      host: '167.172.152.55',
      username: 'root',
      pem: '~/.ssh/id_rsa'
      // password: 'server-password'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    name: 'rts',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'https://rts.dgremillion.com',
      MONGO_URL: 'mongodb://mongodb/meteor',
      MONGO_OPLOG_URL: 'mongodb://mongodb/local',
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-12-base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  proxy: {
    domains: 'rts.dgremillion.com',
    ssl: {
      letsEncryptEmail: 'derrick.gremillion@gmail.com',
      forceSSL: true
    }
  }
};