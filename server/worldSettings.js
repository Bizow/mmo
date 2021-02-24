import { Meteor } from 'meteor/meteor';
import { worldSettings } from '../shared/worldSettings';

Meteor.publish('worldSettings', function () {
  return worldSettings.find({});
});

Meteor.methods({
  updateSunRotation(id, xRotation){
    const modifier = {
      sun: { xRotation }
    };
    return worldSettings.update(id, {$set: modifier } );
  }
})