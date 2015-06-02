import flyd from 'flyd';
import m from 'mithril';

import Actor from './actor';
import Sprite from '../sprite/sprite';

import ActorOutliner from './actor-outliner';
import ActorViewport from './actor-viewport';
import ActorInspector from './actor-inspector';

const attr = flyd.stream;

export default {
  controller: function() {
    // Setup model
    this.root = attr(new Actor('World', 20, 40));

    let bgLayer = attr(),
      entLayer = attr(),
      uiLayer = attr();

    this.root().addChild(bgLayer(new Actor('bgLayer', 20, 80))());
    bgLayer().addChild(new Actor('Parallel', 20, 120));
    bgLayer().addChild(new Actor('Ground', 20, 160));

    this.root().addChild(entLayer(new Actor('entLayer', 20, 200))());
    entLayer().addChild(new Actor('Mario', 20, 240));
    for (let i = 0; i < 20; i++) {
      entLayer().addChild(new Sprite('Coin_' + i, 200, 40 * (i + 1)));
    }
    for (let i = 0; i < 20; i++) {
      entLayer().addChild(new Sprite('Coin_' + (i + 20), 400, 40 * (i + 1)));
    }

    this.root().addChild(uiLayer(new Actor('uiLayer', 600, 40))());
    uiLayer().addChild(new Sprite('HUD', 600, 80));

    // Select the root by default
    this.selected = attr(this.root());

    // Setup streams
    this.whenModelChanged = flyd.stream();
  },
  view: function(controller) {
    return [
      m.component(ActorOutliner, { actor: controller.root, selected: controller.selected, whenModelChanged: controller.whenModelChanged }),
      m.component(ActorViewport, { actor: controller.root, selected: controller.selected, whenModelChanged: controller.whenModelChanged }),
      m.component(ActorInspector, { actor: controller.selected, whenModelChanged: controller.whenModelChanged })
    ];
  }
};
