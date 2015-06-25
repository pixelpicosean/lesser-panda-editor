import Input from '../input/input';

import attrViews from './attr-views';

export default {
  controller: function(args) {
    let c = {
      // = Attributes =====================================

      actor: args.actor,
      selected: args.selected,
      actorAttrChanged: args.actorAttrChanged,

      attrView: attrViews[args.selected().nodeType],

      selectedIsNotRoot: function() {
        // console.log('selectedIsNotRoot: %s', (c.actor().id !== c.selected().id ? 'true' : 'false'));
        return c.actor().id !== c.selected().id;
      },

      onunload: function() {
        args.selected.offValue(changeAttrView);
      },

      // = Actions ========================================

      showAssetBrowser: function(cb) {
        // console.log('Inspector showAssetBrowser')
        args.showAssetBrowser && args.showAssetBrowser(cb);
      },

      nameChanged: function(name) {
        c.selected().name(name);
        c.actorAttrChanged(c.selected());
      },

      posXChanged: function(x) {
        c.selected().position.x(x);
        c.actorAttrChanged(c.selected());
      },
      posYChanged: function(y) {
        c.selected().position.y(y);
        c.actorAttrChanged(c.selected());
      },
      scaleXChanged: function(x) {
        c.selected().scale.x(x);
        c.actorAttrChanged(c.selected());
      },
      scaleYChanged: function(y) {
        c.selected().scale.y(y);
        c.actorAttrChanged(c.selected());
      },
      rotationChanged: function(rotation) {
        c.selected().rotation(rotation);
        c.actorAttrChanged(c.selected());
      },

      textureChanged: function(texture) {
        c.selected().texture(texture);
        c.actorAttrChanged(c.selected());
      },
      alphaChanged: function(alpha) {
        c.selected().alpha(alpha);
        c.actorAttrChanged(c.selected());
      },
      anchorXChanged: function(anchorX) {
        c.selected().anchorX(anchorX);
        c.actorAttrChanged(c.selected());
      },
      anchorYChanged: function(anchorY) {
        c.selected().anchorY(anchorY);
        c.actorAttrChanged(c.selected());
      },
      pivotXChanged: function(pivotX) {
        c.selected().pivotX(pivotX);
        c.actorAttrChanged(c.selected());
      },
      pivotYChanged: function(pivotY) {
        c.selected().pivotY(pivotY);
        c.actorAttrChanged(c.selected());
      },
      blendModeChanged: function(blendMode) {
        c.selected().blendMode(blendMode);
        c.actorAttrChanged(c.selected());
      },
      tintChanged: function(tint) {
        c.selected().tint(tint);
        c.actorAttrChanged(c.selected());
      }
    };

    function changeAttrView(actor) {
      c.attrView = attrViews[actor.nodeType]
    }
    args.selected.onValue(changeAttrView);

    return c;
  },
  view: function(controller) {
    // console.log('[Inspector] view');
    return m('aside.sidebar.right.shadow', [
      m('header.header', 'Inspector'),
      m('div.content.y-overflow', controller.attrView(controller))
    ]);
  }
};
