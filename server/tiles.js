import { Meteor } from 'meteor/meteor';
import { tiles } from '../shared/tiles';

Meteor.publish('tiles', function (x, z) {
  x = x === undefined ? 0 : x;
  z = z === undefined ? 0 : z;

  const left = -10;
  const top = 10;
  const right = 10;
  const bottom = -10;
  const leftTop = [left, top];
  const rightBottom = [right, bottom];
  const box = [leftTop, rightBottom];
  console.log(box);
  const cursor = tiles.find({
    // location: { $geoWithin: { $box: box } }
  });
  console.log(`tiles subscribed x:${x} z:${z} box: ${box} count: ${cursor.count()}`);
  return cursor;
});

Meteor.methods({
  removeTiles: function () {
    return tiles.remove({});
  },
  /**
   * ^ z
   *      x,z
   * | (-10,10) (0,10) (10,10)
   * |
   * | (-10,0)  (0,0)  (10,0)
   * |
   * | (-10,-10)(0,-10)(10,-10)
   * --------->
   *          x
   */
  getTiles: function (xPos, zPos) {
    this.unblock();
    xPos = (xPos === undefined || xPos === 0) ? -100 : xPos;
    zPos = (zPos === undefined || zPos === 0) ? 100 : zPos;
    const left = xPos;
    const top = zPos;
    const right = left + 200;
    const bottom = zPos - 200;
    // topLeft down then back to top and down again
    for (let x = left; x <= right; x += 10) {
      for (let z = top; z >= bottom; z -= 10) {
        const location = { type: "Point", coordinates: [x, z] };
        const existing = tiles.find({ location: location }).count()
        if (existing === 0) {
          const inserted = tiles.insert({
            prefab: "tilePrefab",
            location: location,
            rotation: { x: 0, y: 0, z: 0 },
            y: 0,
          });
          console.log(inserted, location);
        } else {
          console.log(existing, location);
        }
      }
    }
  },
  getTileCount: function () {
    return tiles.find({}).count();
  },
  updateTilePrefab: function (id, prefab) {
    console.log(`updateTilePrefab: ${id} prefab: ${prefab}`);
    return tiles.update(id, { $set: { prefab } });
  },
  updateTileRotation: function (id, y) {
    console.log(`updateTileRotation: ${id} rotation: ${y}`);
    return tiles.update(id, { $set: { 'rotation.y': y } });
  },
  updateTileY: function (id, y) {
    y = parseInt(y);
    return tiles.update(id, { $set: { y } });
  },
});