import { Template } from 'meteor/templating';
import { players } from '../shared/players';
import { enemies } from '../shared/enemies';
import './main.html';

Template.main.onCreated(function () {
  const instance = this
  instance.subscribe('players', () => {
    console.log(players.find({}).fetch());
  });
  instance.subscribe('enemies', () => {
    console.log(enemies.find({}).fetch());
  });
});

Template.main.helpers({
  players() {
    return players.find({});
  },
  enemies() {
    return enemies.find({});
  },
  toJSON(){
    const player = this;
    return JSON.stringify(player, undefined, 2);
  }
});

Template.main.events({
  'click [data-remove-players]'(event, instance) {
    Meteor.call('removePlayers', (e, r) => {
      const message = e ? e.message : `Removed players: ${r}`;
      alert(message);
    });
  },
  'click [data-remove-tiles]'(event, instance) {
    Meteor.call('removeTiles', (e, r) => {
      const message = e ? e.message : `Removed tiles: ${r}`;
      alert(message);
    });
  },
});


Template.collapsible.onCreated(function () {
  const instance = this
  instance.active = new ReactiveVar(false);
});

Template.collapsible.helpers({
  active() {
    return Template.instance().active.get() ? 'active' : '';
  },
});

Template.collapsible.events({
  'click button'(event, instance) {
    const active = instance.active.get();
    instance.active.set(!active);
  },
});
