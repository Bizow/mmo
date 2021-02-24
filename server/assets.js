import { Meteor } from 'meteor/meteor';
import { assets } from '../shared/assets';

Meteor.publish('assets', function () {
  return assets.find({});
});

Meteor.methods({
  addAsset(asset){
    asset = JSON.parse(asset);
    delete asset._id;
    const cur = assets.findOne({name: asset.name});
    if (cur) {
      return cur._id;
    } else {
      return assets.insert(asset);
    }
  },
  updateAsset(id, props){
    props = JSON.parse(props);
    const asset = assets.findOne(id);
    if (asset) {
      if (props.open) {
        props.playerCount = asset.playerCount + 1;
      } else {
        props.playerCount = asset.playerCount - 1;
      }
    }
    delete props._id;
    return assets.update(id, { $set: props });
  },
  removeAsset(id){
    return assets.remove(id);
  }
});