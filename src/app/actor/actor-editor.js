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
    bgLayer.addChild(new Sprite('Parallax1', 0, 400, 'parallax1.png'));
    bgLayer.addChild(new Sprite('Parallax2', 0, 550, 'parallax2.png'));
    bgLayer.addChild(new Sprite('Parallax3', 0, 650, 'parallax3.png'));
    bgLayer.addChild(new Sprite('cloud1', 100, 100, 'cloud1.png'));
    bgLayer.addChild(new Sprite('cloud2', 300, 50, 'cloud2.png'));
    bgLayer.addChild(new Sprite('LogoFlying', 100, 40, 'logo1.png'));
    bgLayer.addChild(new Sprite('LogoDog', 200, 180, 'logo2.png'));
    bgLayer.addChild(new Sprite('cloud3', 680, 100, 'cloud3.png'));
    bgLayer.addChild(new Sprite('cloud4', 700, 200, 'cloud4.png'));
    bgLayer.addChild(new Sprite('bushes', 0, 700, 'bushes.png'));
    bgLayer.addChild(new Sprite('ground', 0, 800, 'ground.png'));

    c.root().addChild(entLayer);
    entLayer.addChild(new Sprite('player1', 100, 500, 'player1.png'));

    c.root().addChild(uiLayer);

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
