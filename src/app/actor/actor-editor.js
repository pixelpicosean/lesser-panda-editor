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
    let c = {
      // = Attributes =====================================

      root: attr(),
      selected: attr(),

      // = Actions ========================================

      /**
       * Actor attributes changed events.
       * @type {flyd.stream}
       */
      actorAttrChanged: flyd.stream()
    };

    // Setup model
    // TODO: Pass model from "route" to this controller
    c.root(new Actor('World', 20, 40));

    let bgLayer = new Actor('bgLayer', 20, 80),
      entLayer = new Actor('entLayer', 20, 200),
      uiLayer = new Actor('uiLayer', 600, 40);

    c.root().addChild(bgLayer);
    bgLayer.addChild(new Actor('Parallel', 20, 120));
    bgLayer.addChild(new Actor('Ground', 20, 160));

    c.root().addChild(entLayer);
    entLayer.addChild(new Actor('Mario', 20, 240));
    for (let i = 0; i < 20; i++) {
      entLayer.addChild(new Sprite('Coin_' + i, 200, 40 * (i + 1)));
    }
    for (let i = 0; i < 20; i++) {
      entLayer.addChild(new Sprite('Coin_' + (i + 20), 400, 40 * (i + 1)));
    }

    c.root().addChild(uiLayer);
    uiLayer.addChild(new Sprite('HUD', 600, 80));

    // Select the root by default
    c.selected(c.root());

    return c;
  },
  view: function(controller) {
    return [
      m.component(ActorOutliner, {
        actor: controller.root,
        selected: controller.selected,
        actorAttrChanged: controller.actorAttrChanged
      }),
      m.component(ActorViewport, {
        actor: controller.root,
        selected: controller.selected,
        actorAttrChanged: controller.actorAttrChanged
      }),
      m.component(ActorInspector, {
        actor: controller.root,
        selected: controller.selected,
        actorAttrChanged: controller.actorAttrChanged
      })
    ];
  }
};
