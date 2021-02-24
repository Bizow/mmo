import { Meteor } from 'meteor/meteor';
import { actions } from '../shared/actions';

Meteor.publish('actions', function () {
  const connectionId = this.connection.id;
  return actions.find({ connectionId: { $ne: connectionId } });
});

Meteor.methods({
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
  addAction: function (action) {
    action = JSON.parse(action);
    return actions.insert({ action });
  },
});