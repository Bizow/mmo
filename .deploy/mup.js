/**
 * http://meteor-up.com/docs.html
 * mup deploy --settings=../settings.json
 * ssh root@167.172.152.55
 * docker exec -it mongodb mongo rts
 * Unsupported key format: ssh-keygen -p -m PEM -f ~/.ssh/id_rsa
 */
module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
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