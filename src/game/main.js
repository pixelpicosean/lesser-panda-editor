import engine from 'engine/core';
import Scene from 'engine/scene';
import PIXI from 'engine/pixi';
import loader from 'engine/loader';

import 'editor/scene';

import 'game/loading';

loader.addAsset('background1.png', 'background1');
loader.addAsset('background2.png', 'background2');
loader.addAsset('background3.png', 'background3');

loader.addAsset('block1.png', 'block1');
loader.addAsset('block2.png', 'block2');
loader.addAsset('block3.png', 'block3');
loader.addAsset('block4.png', 'block4');

loader.addAsset('gem1.png', 'gem1');
loader.addAsset('gem2.png', 'gem2');
loader.addAsset('gem3.png', 'gem3');
loader.addAsset('gem4.png', 'gem4');

loader.addAsset('heart1.png', 'heart1');
loader.addAsset('heart2.png', 'heart2');
loader.addAsset('heart3.png', 'heart3');

loader.addAsset('key1.png', 'key1');
loader.addAsset('key2.png', 'key2');
loader.addAsset('key3.png', 'key3');
loader.addAsset('key4.png', 'key4');
loader.addAsset('key5.png', 'key5');
loader.addAsset('key6.png', 'key6');
loader.addAsset('key7.png', 'key7');
loader.addAsset('key8.png', 'key8');

loader.addAsset('stone-monster1.png', 'stone-monster1');
loader.addAsset('stone-monster2.png', 'stone-monster2');
loader.addAsset('stone-monster3.png', 'stone-monster3');
loader.addAsset('stone-monster4.png', 'stone-monster4');

loader.addAsset('yellow1.png', 'yellow1');
loader.addAsset('yellow2.png', 'yellow2');
loader.addAsset('yellow3.png', 'yellow3');
loader.addAsset('yellow4.png', 'yellow4');
loader.addAsset('yellow5.png', 'yellow5');
loader.addAsset('yellow6.png', 'yellow6');
loader.addAsset('yellow7.png', 'yellow7');
loader.addAsset('yellow8.png', 'yellow8');
loader.addAsset('yellow9.png', 'yellow9');
loader.addAsset('yellow10.png', 'yellow10');
loader.addAsset('yellow11.png', 'yellow11');

loader.addAsset('tilesheet.png', 'tilesheet');

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

class Main extends Scene {
  awake() {
    engine.setScene('Editor');
  }
};
engine.addScene('Main', Main);

engine.startWithScene('Loading');
