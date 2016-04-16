import PIXI from 'engine/pixi';
import { model } from './model';

export default model('container')
  .number('x')
  .number('y')
  .number('rotation')
  .number('scaleX')
  .number('scaleY')
  .number('alpha', 1)
  .number('pivotX')
  .number('pivotY')
  .number('skewX')
  .number('skewY')
  .boolean('visible', true)

  .setInstCreator((state) => {
    return new PIXI.Container();
  })
  .setInstUpdator((state, inst) => {
    inst.position.set(state.x, state.y);
    inst.rotation = state.rotation;
    inst.scale.set(state.scaleX, state.scaleY);
    inst.alpha = state.alpha;
    inst.pivot.set(state.pivotX, state.pivotY);
    inst.skew.set(state.skewX, state.skewY);
    inst.visible = state.visible;
  });
