import Input from '../input/input';

export default function(controller) {
  return [
    m('h2', 'GENERAL'),
    m('div.property-edit', [
      m('label', 'Name'),
      m.component(Input, { value: controller.selected().name(), onchange: controller.nameChanged })
    ]),

    controller.selectedIsNotRoot() ?
    m('div.property-edit', [
      m('label', 'Position'),
      m.component(Input, { type: 'number', value: controller.selected().position.x(), onchange: controller.posXChanged }),
      m.component(Input, { type: 'number', value: controller.selected().position.y(), onchange: controller.posYChanged })
    ]) : ''
  ];
};
