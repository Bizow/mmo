import { Meteor } from 'meteor/meteor';
import { enemies } from '../shared/enemies';

Meteor.publish('enemies', function () {
  return enemies.find({connectionId : {$ne: ""}});
});

enemies.find().observe({
  removed(doc){
    // tbd
    console.log('enemy removed', doc);
    //Meteor.call('addEnemy', doc.spawn);
  }
});

Meteor.methods({
  addEnemy: function (spawn) {
    const enemy = enemies.findOne({ spawn: spawn });
    const connectionId = this.connection.id;
    if (!enemy) {
      const enemy = { connectionId, spawn };
      enemies.insert(enemy);
    } else if (!enemy.connectionId) {
      enemies.update(enemy._id, {$set: { connectionId }});
    }
  },
  updateEnemy: function (id, posString, rotString, destString, actionString) {
    const position = JSON.parse(posString);
    const rotation = JSON.parse(rotString);
    const destination = JSON.parse(destString);
    const action = JSON.parse(actionString);
    const modifier = {};

    if (position) {
      modifier.position = position;
    }
    if (rotation) {
      modifier.rotation = rotation;
    }
    if (destination) {
      modifier.destination = destination;
    }
    if (action) {
      modifier.action = action;
    }
    return enemies.update(id, { $set: modifier });
  },
  removeEnemy: function (id) {
    return enemies.remove(id);
  }
});