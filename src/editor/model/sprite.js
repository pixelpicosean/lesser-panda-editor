import { model } from './model';
import container from './container';

import PIXI from 'engine/pixi';
import loader from 'engine/loader';

export default model('sprite', container)
  .number('anchorX')
  .number('anchorY')
  .text('blendMode', 'NORMAL')
  .text('texture', '') // TODO: texture

  .setInstCreator((state) => {
    return new PIXI.Sprite();
  })
  .setInstUpdator((state, inst) => {
    inst.anchor.set(state.anchorX, state.anchorY);
    inst.blendMode = PIXI.BLEND_MODES[state.blendMode];
    inst.texture = loader.resources[state.texture].texture; // TODO: texture lookup
  });
