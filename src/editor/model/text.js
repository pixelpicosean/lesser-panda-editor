import { model } from './model';
import container from './container';

import PIXI from 'engine/pixi';

export default model('text', container)
  .number('anchorX')
  .number('anchorY')
  .text('blendMode', 'NORMAL')
  .text('font', 'bold 20px Arial')
  .text('fill', 'black') // TODO: color

  .setInstCreator((state) => {
    return new PIXI.Text('');
  })
  .setInstUpdator((state, inst) => {
    inst.anchor.set(state.anchorX, state.anchorY);
    inst.blendMode = PIXI.BLEND_MODES[state.blendMode];
    inst.style = {
      font: state.font,
      fill: state.fill,
    };

    // Force redraw
    inst.dirty = true;
  });
