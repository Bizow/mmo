import { Template } from 'meteor/templating';
import { players } from '../shared/players';
import { enemies } from '../shared/enemies';
import { assets } from '../shared/assets';
import { worldSettings } from '../shared/worldSettings';
import './main.html';

Template.main.onCreated(function () {
  const instance = this
  instance.subscribe('players', () => {
    console.log(players.find({}).fetch());
  });
  instance.subscribe('allEnemies', () => {
    console.log(enemies.find({}).fetch());
  });
  instance.subscribe('assets', () => {
    console.log(assets.find({}).fetch());
  });
});

Template.main.helpers({
  players() {
    return players.find({});
  },
  enemies() {
    return enemies.find({});
  },
  assets() {
    return assets.find({});
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
  'click [data-remove-asset]'(event, instance) {
    const data = this;
    Meteor.call('removeAsset', data.label, (e, r) => {
      const message = e ? e.message : `Removed asset: ${r}`;
      alert(message);
    });
  },
  'click [data-remove-enemy]'(event, instance) {
    const data = this;
    Meteor.call('removeEnemy', data.label, (e, r) => {
      const message = e ? e.message : `Removed enemy: ${r}`;
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


Template.sunControl.onCreated(function () {
  const instance = this

  instance.subscribe('worldSettings', () => {
    console.log(worldSettings.find({}).fetch());
  });
});

Template.sunControl.helpers({
  worldSettings() {
    return worldSettings.findOne({});
  },
});

Template.sunControl.events({
  'change input'(event, instance) {
    const worldSettings = this;
    const xRotation = event.target.value;
    Meteor.call("updateSunRotation", worldSettings._id, xRotation);
  },
});
