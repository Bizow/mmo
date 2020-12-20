import { Meteor } from 'meteor/meteor';
import { players } from '../shared/players';
import { enemies } from '../shared/enemies';
import './enemies';

Meteor.startup(() => {
  const removed = players.remove({});
  console.log(`removed: ${removed}`);
});

Meteor.onConnection((connection) => {
  connection.onClose(() => {
    const connectionId = connection.id;
    const removed = players.remove({ connectionId });
    const playerCount = players.find().count();
    console.log(`${removed} player disconnected: ${connectionId} player count: ${playerCount}`);
    if (playerCount > 0) {
      const hostEnemyCount = enemies.find({ connectionId }).count();
      if (hostEnemyCount > 0) {
        const player = players.findOne({});
        enemies.update({ connectionId }, {
          $set: { connectionId : player.connectionId }
        }, { multi: true });
      }
    } else {
      enemies.update({}, {
        $set: { connectionId : "" }
      }, { multi: true });
    }
  })
});

Meteor.publish('players', function (playerId) {
  let cursor = playerId ? players.find({ _id: { $ne: playerId } }) : players.find({});
  console.log(`${cursor.count()} players published for: ${playerId}`);
  if (playerId) {
    return cursor;
  } else {
    return cursor;
  }
});

Meteor.methods({
  addPlayer: function () {
    const connectionId = this.connection.id;
    const playerNumber = players.find().count();
    const player = {
      connectionId,
      number: playerNumber,
      position: { x: 0, y: 1, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      action: { },
    }
    const playerId = players.insert(player);
    console.log(`addPlayer connectionId: ${connectionId} playerId: ${playerId} playerNumber: ${playerNumber}`);
    return JSON.stringify({ playerId, connectionId, playerNumber });
  },
  updatePlayer: function (playerId, position, rotation, action) {
    position = position ? JSON.parse(position): null;
    rotation = rotation ? JSON.parse(rotation): null;
    action = action ? JSON.parse(action): null;
    const modifier = {};
    if (position) {
      modifier.position = position;
    }
    if (rotation) {
      modifier.rotation = rotation;
    }
    if (action) {
      modifier.action = action;
    }
    return players.update(playerId, { $set: modifier });
  },
  removePlayers: function () {
    return players.remove({});
  },
});

Accounts.onCreateUser(function (user) {
  console.log(`User created: ${user._id}`);
  return user;
});

Accounts.onLogin(function (loginDetails) {
  console.log(`onLogin: ${loginDetails.user._id}`);
});
