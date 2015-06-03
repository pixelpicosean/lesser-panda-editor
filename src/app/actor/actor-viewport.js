import flyd from 'flyd';
import m from 'mithril';
import PIXI from 'pixi';
import Mousetrap from 'mousetrap';

const MODES = {
  NORMAL: 0,
  TRANSLATE: 1,
  ROTATE: 2,
  SCALE: 3
};

export default {
  controller: function(args) {
    let controller = {

      // = Attributes =====================================

      renderer: null,
      stage: null,
      root: null,
      uiContainer: null,
      actorContainer: null,

      /**
       * Selection box around current selected actor
       * @type {PIXI.Graphics}
       */
      selectionRect: null,

      instModelHash: {},

      actor: args.actor,
      selected: args.selected,

      currModifyMode: MODES.NORMAL,

      /**
       * Mouse position before enter modifying mode
       * @type {Object}
       */
      mousePosBeforeModify: {
        x: 0, y: 0
      },
      /**
       * Current mouse position in browser window
       * @type {Object}
       */
      currMousePos: {
        x: 0, y: 0
      },
      /**
       * Rotation of vector from cursor to actor
       * @type {Number}
       */
      mouseToActorAngleBeforeModify: 0,
      /**
       * Distance between cursor and actor before modify
       * @type {Number}
       */
      mouseToActorDistBeforeModify: 0,

      /**
       * Position of selected actor before enter modifying mode
       * @type {Object}
       */
      actorPosBeforeModify: {
        x: 0, y: 0
      },
      /**
       * Rotation of selected actor before enter modifying mode
       * @type {Number}
       */
      actorRotationBeforeModify: 0,
      /**
       * Scale of selected actor before enter modifying mode
       * @type {Object}
       */
      actorScaleBeforeModify: {
        x: 0, y: 0
      },

      // = Config =========================================

      config: function(element, isInitialized, ctx) {
        if (isInitialized) return;

        // Save ref to element
        controller.$ = element;

        // Initialize PIXI stuff
        controller.renderer = new PIXI.CanvasRenderer(200, 200, { view: element, resolution: window.devicePixelRatio });
        controller.stage = new PIXI.Stage();

        controller.emptyArea = new PIXI.Graphics();
        controller.stage.addChild(controller.emptyArea);

        // Let stage listen to "click nothing" event
        controller.emptyArea.interactive = true;
        controller.emptyArea.click = function() {
          m.startComputation();

          // Deselect in normal mode
          if (controller.currModifyMode === MODES.NORMAL) {
            // console.log('select root');
            controller.selected(controller.actor());
            controller.removeSelectionRect();
          }
          else {
            controller.confirmModifyChanges();
          }

          m.endComputation();
        };

        controller.root = new PIXI.DisplayObjectContainer();
        controller.stage.addChild(controller.root);

        // Container for actor instances
        controller.actorContainer = new PIXI.DisplayObjectContainer();
        controller.stage.addChild(controller.actorContainer);

        // Container for UI
        controller.uiContainer = new PIXI.DisplayObjectContainer();
        controller.stage.addChild(controller.uiContainer);

        // UI
        controller.selectionRect = new PIXI.Graphics();
        controller.uiContainer.addChild(controller.selectionRect);

        // Start rendering loop
        requestAnimationFrame(animate);
        function animate() {
          controller.renderer.render(controller.stage);
          requestAnimationFrame(animate);
        };

        // Setup event stream and handlers
        let viewSizeChanged = flyd.stream();
        window.addEventListener('resize', viewSizeChanged);

        flyd.map(controller.actorAttrChanged, args.actorAttrChanged);
        flyd.map(controller.resize, viewSizeChanged);

        // Setup shortcuts
        Mousetrap.bind('command+d', function() {
          // Reset and deselect
          if (controller.currModifyMode !== MODES.NORMAL) {
            controller.resetModifyChanges();
          }

          // Reset to root
          m.startComputation();
          controller.selected(controller.actor());
          controller.removeSelectionRect();
          m.endComputation();

          // Prevents the default action
          return false;
        });
        Mousetrap.bind('g', function() {
          // controller.enterTranslateMode();
        });
        Mousetrap.bind('r', function() {
          // controller.enterRotateMode();
        });
        Mousetrap.bind('s', function() {
          // controller.enterScaleMode();
        });
        Mousetrap.bind('enter', function() {
          // controller.confirmModifyChanges();
        });
        Mousetrap.bind('esc', function() {
          // controller.resetModifyChanges();
        });

        // Unload behavior
        controller.onunload = function() {
          window.removeEventListener('resize', viewSizeChanged);
          Mousetrap.reset();
        };

        // Resize canvas
        controller.resize();

        // Draw after assets finished loading
        let assetsToLoad = [
          'media/sprites.json'
        ];
        let loader = new PIXI.AssetLoader(assetsToLoad);
        loader.onComplete = function() {
          controller.stage.setBackgroundColor(0xb2dcef);
          controller.createInstance(controller.actor());
        };
        loader.load();
      },

      // = Actions ========================================

      resize: function() {
        let w = controller.$.clientWidth;
        let h = controller.$.clientHeight;

        // console.log('resize: %d, %d', w, h);
        controller.renderer.resize(w, h);

        // Resize empty area graphics
        controller.emptyArea.clear();
        controller.emptyArea.beginFill(0x000000, 0);
        controller.emptyArea.drawRect(0, 0, w, h);
        controller.emptyArea.endFill();
      },

      actorAttrChanged: function(actor) {
        if (controller.instModelHash[actor.id]) {
          controller.syncInstOf(actor);
        }
      },
      actorSelected: function(actor) {
        controller.selected(actor);
        let pair = controller.instModelHash[actor.id];
        if (pair) {
          controller.drawRectForActorInstance(pair.inst);
        }
      },
      actorClicked: function(actor) {
        m.startComputation();

        if (controller.currModifyMode === MODES.NORMAL) {
          controller.actorSelected(actor);
          // console.log('click to select: %s', controller.selected().name());
        }
        else {
          controller.confirmModifyChanges();
        }

        m.endComputation();
      },

      // = UI =============================================

      drawRectForActorInstance: function(inst) {
        let origin = controller.root.position;
        let pos = inst.toGlobal(origin);

        let left = -inst.width * inst.anchor.x,
          top = -inst.height * inst.anchor.y,
          width = inst.width,
          height = inst.height;

        let rect = controller.selectionRect;
        rect.clear();
        // Rectangle
        rect.lineStyle(1, 0x03a9f4, 1);
        rect.drawRect(
          left, top,
          width, height
        );
        // Left Top Circle
        rect.lineStyle(1, 0xffffff, 1);
        rect.drawCircle(left, top, 6);
        rect.beginFill(0x03a9f4, 1);
        rect.drawCircle(left, top, 6);
        rect.endFill();
        // Right Top Circle
        rect.lineStyle(1, 0xffffff, 1);
        rect.drawCircle(left + width, top, 6);
        rect.beginFill(0x03a9f4, 1);
        rect.drawCircle(left + width, top, 6);
        rect.endFill();
        // Right Bottom Circle
        rect.lineStyle(1, 0xffffff, 1);
        rect.drawCircle(left + width, top + height, 6);
        rect.beginFill(0x03a9f4, 1);
        rect.drawCircle(left + width, top + height, 6);
        rect.endFill();
        // Left Bottom Circle
        rect.lineStyle(1, 0xffffff, 1);
        rect.drawCircle(left, top + height, 6);
        rect.beginFill(0x03a9f4, 1);
        rect.drawCircle(left, top + height, 6);
        rect.endFill();

        // Sync position
        rect.position.set(pos.x, pos.y);

        // Sync rotation
        rect.rotation = inst.rotation;

        // Show it
        rect.visible = true;
      },
      removeSelectionRect: function() {
        controller.selectionRect.visible = false;
      },

      // = Create instance ================================

      createInstance: function(actor, parent) {
        switch (actor.nodeType) {
          case 'Actor':
            this.createActorInstance(actor, parent);
            break;
          case 'Sprite':
            this.createSpriteInstance(actor, parent);
            break;
          case 'Animation':
            this.createAnimationInstance(actor, parent);
            break;
          case 'TilingSprite':
            this.createTilingSpriteInstance(actor, parent);
            break;
          }
      },
      createActorInstance: function(actor, parent) {
        // Create actor instance
        let inst = new PIXI.DisplayObjectContainer();

        // Save actor-instance pair to hash for later use
        inst.id = actor.id;
        this.instModelHash[actor.id] = { actor, inst };

        // Update instance properties based on its model
        // ONLY sync non-root actors
        if (controller.actor().id !== actor.id) {
          controller.syncActorInst(actor, inst);
        }

        // Add to parent
        parent = parent || controller.actorContainer;
        parent.addChild(inst);

        // Create instances for children (Actor ONLY)
        actor.children.forEach(function(child) {
          controller.createInstance(child, inst);
        });
      },
      createSpriteInstance: function(actor, parent) {
        // Create sprite instance
        let tex = PIXI.Texture.fromImage(actor.texture());
        let inst = new PIXI.Sprite(tex);
        inst.interactive = true;
        inst.click = function() {
          controller.actorClicked(actor, inst);
          // console.log('select: %s', actor.name());
        };

        // Save actor-instance pair to hash for later use
        inst.id = actor.id;
        this.instModelHash[actor.id] = { actor, inst };

        // Update instance properties based on its model
        this.syncSpriteInst(actor, inst);

        // Add to parent
        parent = parent || controller.actorContainer;
        parent.addChild(inst);
      },

      syncInstOf: function(actor) {
        var pair = this.instModelHash[actor.id];
        if (pair) {
          // Editor specific attributes
          // pair.inst.visible = actor.get('visible');

          // Sync based on their type
          switch (actor.nodeType) {
            case 'Actor':
              this.syncActorInst(actor, pair.inst);
              break;
            case 'Animation':
              // this.syncAnimationInst(actor, pair.inst);
              // this.drawRectForActorInstance(pair.inst);
              break;
            case 'Sprite':
              this.syncSpriteInst(actor, pair.inst);
              this.drawRectForActorInstance(pair.inst);
              break;
            case 'TilingSprite':
              // this.syncTilingSpriteInst(actor, pair.inst);
              // this.drawRectForActorInstance(pair.inst);
              break;
          }
        }
      },
      syncActorInst: function(actor, inst) {
        // Actor attributes
        // inst.alpha = actor.alpha;
        // inst.rotation = actor.rotation;
        // inst.width = actor.size.x;
        // inst.height = actor.size.y;
        inst.position.set(actor.position.x(), actor.position.y());
      },
      syncSpriteInst: function(actor, inst) {
        // Actor attributes
        // inst.alpha = actor.alpha();
        // inst.rotation = actor.rotation();
        // inst.scale.set(actor.scale.x(), actor.scale.y());
        inst.position.set(actor.position.x(), actor.position.y());
        // Sprite attributes
        // inst.anchor.set(actor.anchor.x(), actor.anchor.y());
      }
    };

    return controller;
  },
  view: function(controller) {
    return m('canvas#viewport.max-size', { config: controller.config });
  }
};
