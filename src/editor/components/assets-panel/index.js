import engine from 'engine/core';
import loader from 'engine/loader';
import PIXI from 'engine/pixi';
import R from 'engine/reactive';
import { clamp } from 'engine/utils';

import ops from 'editor/ops';

const ITEM_SIZE = 80;
const ITEM_SPACING = 6;
const PANEL_WIDTH = ITEM_SIZE * 2 + ITEM_SPACING * 3;

export default class AssetsPanel {
  constructor(scene, layer, operate) {
    // States
    this.gridWidth = PANEL_WIDTH;
    this.gridHeight = engine.viewSize.y;
    this.gridBottom = 0;
    this.selectCallback = null;
    this.neverShown = true;

    const choose = (key) => {
      if (typeof(this.selectCallback) === 'function') {
        this.selectCallback(key);
      }

      operate('ui.HIDE_ASSETS');
    };

    // Components
    this.panel = new PIXI.Graphics().addTo(layer);
    this.panel.visible = false;

    this.gridView = new PIXI.Container().addTo(this.panel);
    this.gridMask = new PIXI.Graphics().addTo(this.panel);
    this.gridView.mask = this.gridMask;
    this.gridContainer = new PIXI.Container().addTo(this.gridView);

    this.items = Object.keys(loader.resources).map((key) => {
      // Item rectangle
      let item = new PIXI.Graphics();
      item.beginFill(0xa0a0a0);
      item.drawRoundedRect(0, 0, ITEM_SIZE, ITEM_SIZE, 8);
      item.endFill();
      this.gridContainer.addChild(item);

      // Input
      item.interactive = true;
      item.on('mousedown', () => choose(key));

      // Sprite
      // TODO: create instance based on its type
      let g = new PIXI.Sprite(PIXI.Texture.fromAsset(key)).addTo(item);
      if (g.width >= g.height) {
        g.width = ITEM_SIZE * 0.9;
        g.scale.y = g.scale.x;
      }
      else {
        g.height = ITEM_SIZE * 0.9;
        g.scale.x = g.scale.y;
      }
      g.position.set((ITEM_SIZE - g.width) * 0.5, (ITEM_SIZE - g.height) * 0.5);

      // Label
      let label = new PIXI.Graphics().addTo(item);
      label.beginFill(0x000000, 0.5);
      label.drawRoundedRect(0, 0, ITEM_SIZE, 24, 8);
      label.endFill();
      label.position.set((ITEM_SIZE - label.width) * 0.5, ITEM_SIZE - 24);
      let t = new PIXI.Text(key, {
        font: '12px Roboto, HelveticaNeue-Light, Helvetica Neue, HelveticaNeue, Helvetica, Arial, Geneva, sans-serif',
        fill: '#ccc',
      }, window.devicePixelRatio).addTo(label);
      t.anchor.set(0.5);
      t.position.set(label.width * 0.5, label.height * 0.5);

      // Display label only when mouse is over the item
      label.visible = false;
      item.interactive = true;
      item.mouseover = () => { label.visible = true; console.log('mouseover') };
      item.mouseout = () => { label.visible = false; console.log('mouseout') };

      return item;
    });

    engine.on('resize', this.redraw, this);

    // Setup scroll of grid view
    let wheelEvtName = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
      document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
      'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

    engine.view.addEventListener(wheelEvtName, (e) => {
      if (this.panel.visible) {
        this.panGridView(e.deltaY);

        e.preventDefault();
      }
    });

    // Register operators
    ops.ui = Object.assign(ops.ui || {}, {
      SHOW_ASSETS: (model, cb) => {
        this.show(cb);

        return model;
      },
      HIDE_ASSETS: (model) => {
        this.hide();

        return model;
      },
    });

    // Event streams
    this.esc$ = R.fromEvents(scene.events, 'esc');

    // Handlers
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  // API
  show(callback) {
    this.selectCallback = callback;

    // Confirm its size is correct
    if (this.neverShown) {
      this.neverShown = false;
      this.redraw();
    }

    // Show
    this.panel.visible = true;

    this.esc$.onValue(this.hide);
  }
  hide() {
    this.selectCallback = null;
    this.panel.visible = false;

    this.esc$.offValue(this.hide);
  }

  redraw() {
    this.drawPanel();
    this.drawGrid();
  }
  drawPanel() {
    // Update panel
    this.panel.clear();
    this.panel.beginFill(0x000000);
    this.panel.drawRect(0, 0, PANEL_WIDTH, engine.viewSize.y);
    this.panel.endFill();

    // Update panel mask
    this.gridMask.clear();
    this.gridMask.beginFill(0x000000);
    this.gridMask.drawRect(this.gridView.x, this.gridView.y, this.gridWidth, this.gridHeight);
    this.gridMask.endFill();
  }
  drawGrid() {
    this.gridWidth = PANEL_WIDTH;
    this.gridHeight = engine.viewSize.y;

    let itemsPerRow = Math.floor(this.gridWidth / ITEM_SIZE);

    this.items.forEach((item, idx) => {
      let r = Math.floor(idx / itemsPerRow);
      let q = idx % itemsPerRow;

      item.position.set(ITEM_SPACING + q * (ITEM_SIZE + ITEM_SPACING), ITEM_SPACING + r * (ITEM_SIZE + ITEM_SPACING));

      this.gridBottom = Math.max(item.position.y + item.height, this.gridBottom);
    });
  }

  panGridView(fct) {
    this.gridContainer.position.y = clamp(this.gridContainer.position.y - fct, Math.min(-(this.gridBottom - this.gridHeight), 0), 0);
  }
};
