import dgram from 'dgram';
const server = dgram.createSocket('udp4');

const PORT = 33333;
const HOST = '127.0.0.1';
let clientPort = "";
let messageCount = 0;

server.on('listening', function() {
  const address = server.address();
  console.log('UDP Server listening on ' + address.address + ':' + address.port);
});

server.on('message', function(message, remote) {
  messageCount++;
  console.log(`${messageCount}: ${remote.address}:${remote.port} - ${message}`);
  clientPort = remote.port;
});

server.bind(PORT, HOST, function (){
  console.log('server.bind cb');
  setInterval(() => {
    if (clientPort) {
      const message = Buffer.from("Message from server");
      server.send(message, 0, message.length, clientPort, HOST, function() {
        console.log("Sent '" + message + "'");
        clientPort = "";
      });
    }
  },3000);
});

