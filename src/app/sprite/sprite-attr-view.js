import Input from '../input/input';
import TextureChooser from '../input/texture-chooser';

export default function(controller) {
  return [
    m('h2', 'GENERAL'),
    m('div.property-edit', [
      m('label', 'Name'),
      m.component(Input, { value: controller.selected().name(), onchange: controller.nameChanged })
    ]),

    m('h2', 'TRANSFORM'),
    m('div.property-edit', [
      m('label', 'Position'),
      m.component(Input, { type: 'number', value: controller.selected().position.x(), onchange: controller.posXChanged }),
      m.component(Input, { type: 'number', value: controller.selected().position.y(), onchange: controller.posYChanged }),
    ]),
    m('div.property-edit', [
      m('label', 'Scale'),
      m.component(Input, { type: 'number', value: controller.selected().scale.x(), onchange: controller.scaleXChanged }),
      m.component(Input, { type: 'number', value: controller.selected().scale.y(), onchange: controller.scaleYChanged }),
    ]),
    m('div.property-edit', [
      m('label', 'Rotation'),
      m.component(Input, { type: 'number', value: controller.selected().rotation(), onchange: controller.rotationChanged }),
    ]),

    m('h2', 'VISUAL'),
    m('div.property-edit', [
      m('label', 'Texture'),
      m.component(TextureChooser, { value: controller.selected().texture(), onchange: controller.textureChanged, showAssetBrowser: controller.showAssetBrowser }),
    ]),
    m('div.property-edit', [
      m('label', 'Alpha'),
      m.component(Input, { type: 'number', value: controller.selected().alpha(), onchange: controller.alphaChanged }),
    ]),
    m('div.property-edit', [
      m('label', 'Anchor'),
      m.component(Input, { type: 'number', value: controller.selected().anchor.x(), onchange: controller.anchorXChanged }),
      m.component(Input, { type: 'number', value: controller.selected().anchor.y(), onchange: controller.anchorYChanged }),
    ]),
    m('div.property-edit', [
      m('label', 'Pivot'),
      m.component(Input, { type: 'number', value: controller.selected().pivot.x(), onchange: controller.pivotXChanged }),
      m.component(Input, { type: 'number', value: controller.selected().pivot.y(), onchange: controller.pivotYChanged }),
    ]),
    m('div.property-edit', [
      m('label', 'BlendMode'),
      // TODO: color and select inputs
      m.component(Input, { type: 'text', value: controller.selected().blendMode(), onchange: controller.blendModeChanged }),
    ]),
    m('div.property-edit', [
      m('label', 'Tint'),
      m.component(Input, { type: 'text', value: controller.selected().tint(), onchange: controller.tintChanged })
    ])
  ];
};
