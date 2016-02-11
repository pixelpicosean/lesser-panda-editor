import engine from 'engine/core';
import loader from 'engine/loader';
import PIXI from 'engine/pixi';
import R from 'engine/reactive';
import { clamp } from 'engine/utils';

import ops from 'editor/ops';

export default class AssetsModal {
  constructor(scene, layer, operate) {
    // Constants
    this.ITEM_SIZE = 100;

    // States
    this.gridBottom = 0;
    this.selectCallback = null;

    const choose = (key) => {
      if (typeof(this.selectCallback) === 'function') {
        this.selectCallback(key);
      }

      operate('ui.HIDE_ASSETS');
    };

    // Components
    this.modal = new PIXI.Graphics().addTo(layer);
    this.modal.visible = false;

    this.gridView = new PIXI.Container().addTo(this.modal);
    this.gridMask = new PIXI.Graphics().addTo(this.modal);
    this.gridView.mask = this.gridMask;
    this.gridContainer = new PIXI.Container().addTo(this.gridView);

    this.items = Object.keys(loader.resources).map((key) => {
      // Item rectangle
      let item = new PIXI.Graphics();
      item.beginFill(0xa0a0a0);
      item.drawRoundedRect(0, 0, this.ITEM_SIZE, this.ITEM_SIZE, 8);
      item.endFill();
      this.gridContainer.addChild(item);

      // Input
      item.interactive = true;
      item.on('mousedown', () => choose(key));

      // Sprite
      // TODO: create instance based on its type
      let g = new PIXI.Sprite(PIXI.Texture.fromAsset(key)).addTo(item);
      if (g.width >= g.height) {
        g.width = this.ITEM_SIZE * 0.9;
        g.scale.y = g.scale.x;
      }
      else {
        g.height = this.ITEM_SIZE * 0.9;
        g.scale.x = g.scale.y;
      }
      g.position.set((this.ITEM_SIZE - g.width) * 0.5, (this.ITEM_SIZE - g.height) * 0.5);

      // Label
      let label = new PIXI.Graphics().addTo(item);
      label.beginFill(0x000000, 0.5);
      label.drawRoundedRect(0, 0, this.ITEM_SIZE, 24, 8);
      label.endFill();
      label.position.set((this.ITEM_SIZE - label.width) * 0.5, this.ITEM_SIZE - 24);
      let t = new PIXI.Text(key, {
        font: '12px Roboto, HelveticaNeue-Light, Helvetica Neue, HelveticaNeue, Helvetica, Arial, Geneva, sans-serif',
        fill: '#ccc',
      }, window.devicePixelRatio).addTo(label);
      t.position.set((label.width - t.width) * 0.5, 4);

      return item;
    });

    engine.on('resize', this.redraw, this);

    // Setup scroll of grid view
    let wheelEvtName = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
      document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
      'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

    engine.view.addEventListener(wheelEvtName, (e) => {
      if (this.modal.visible) {
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
    this.modal.visible = true;

    this.esc$.onValue(this.hide);
  }
  hide() {
    this.selectCallback = null;
    this.modal.visible = false;

    this.esc$.offValue(this.hide);
  }

  redraw() {
    if (this.modal.visible) {
      this.drawModal();
      this.drawGrid();
    }
  }
  drawModal() {
    // Update modal
    this.modal.clear();
    this.modal.beginFill(0x000000);
    this.modal.drawRoundedRect(0, 0, engine.width * 0.9, engine.height * 0.9, 12);
    this.modal.endFill();

    this.modal.position.set((engine.width - this.modal.width) * 0.5, (engine.height - this.modal.height) * 0.5);

    // Update modal mask
    this.gridMask.clear();
    this.gridMask.beginFill(0x000000);
    this.gridMask.drawRect(this.gridView.x, this.gridView.y, this.gridWidth, this.gridHeight);
    this.gridMask.endFill();
  }
  drawGrid() {
    this.gridWidth = engine.width * 0.9 - 8;
    this.gridHeight = engine.height * 0.9 - 8;

    let itemsPerRow = Math.floor(this.gridWidth / this.ITEM_SIZE);

    this.items.forEach((item, idx) => {
      let r = Math.floor(idx / itemsPerRow);
      let q = idx % itemsPerRow;

      item.position.set(8 + q * (this.ITEM_SIZE + 8), 8 + r * (this.ITEM_SIZE + 8));

      this.gridBottom = Math.max(item.position.y + item.height, this.gridBottom);
    });
  }

  panGridView(fct) {
    this.gridContainer.position.y = clamp(this.gridContainer.position.y - fct, Math.min(-(this.gridBottom - this.gridHeight), 0), 0);
  }
};
