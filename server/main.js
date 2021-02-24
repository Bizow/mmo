import { Meteor } from 'meteor/meteor';
import { players } from '../shared/players';
import { enemies } from '../shared/enemies';
import { assets } from '../shared/assets';
import { actions } from '../shared/actions';
import { worldSettings } from '../shared/worldSettings';
import './worldSettings';
import './assets';
import './enemies';
import './actions';
import './udp';

Meteor.startup(() => {
  const removed = players.remove({});
  console.log(`removed: ${removed}`);
  //worldSettings.remove({});
  if (worldSettings.find().count() === 0) {
    worldSettings.insert({
      sun: {
        xRotation: 45,
      },
    });
  }
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
      assets.remove({});
      enemies.remove({});
      actions.remove({});
      // enemies.update({}, {
      //   $set: { connectionId : "" }
      // }, { multi: true });
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
  addPlayer: function (name) {
    const connectionId = this.connection.id;
    const playerNumber = players.find().count();
    const player = {
      name,
      connectionId,
      number: playerNumber,
      position: { x: 0, y: 1, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      action: { },
      actions: [],
    }
    const playerId = players.insert(player);
    console.log(`addPlayer connectionId: ${connectionId} playerId: ${playerId} playerNumber: ${playerNumber}`);
    return JSON.stringify({ playerId, connectionId, playerNumber });
  },
  updatePlayer: function (playerId, position, rotation, action, stats) {
    position = position ? JSON.parse(position): null;
    rotation = rotation ? JSON.parse(rotation): null;
    action = action ? JSON.parse(action): null;
    stats = stats ? JSON.parse(stats): null;
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
    if (stats) {
      modifier.stats = stats;
    }
    return players.update(playerId, { $set: modifier });
  },
  updatePlayerName: function (playerId, name) {
    return players.update(playerId, { $set: { name } });
  },
  removePlayers: function () {
    return players.remove({});
  },
  /**
   * {
   *   i: 0
   *   h: -1 0 1
   *   v: -1 0 1
   *   px: 0
   *   py: 0
   *   pz: 0
   *   rx: 0
   *   ry: 0
   *   rz: 0
   *   rw: 0
   * }
   */
  addPlayerAction (playerId, action, maxActions) {
    const player = players.findOne(playerId);
    let actions = [];
    if (player) {
      actions = player.actions;
      actions.push(action);
      actions.sort((a, b) => (a.i > b.i) ? 1 : -1);
      if (actions.length > maxActions) {
        actions.shift();
      }
    }
    return players.update(playerId, {
      $set: { actions }
    });
  }
});

Accounts.onCreateUser(function (user) {
  console.log(`User created: ${user._id}`);
  return user;
});

Accounts.onLogin(function (loginDetails) {
  console.log(`onLogin: ${loginDetails.user._id}`);
});
