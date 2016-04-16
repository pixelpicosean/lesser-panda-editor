export const models = {};

let nextObjId = 0;

export const defaultCreator = (model, settings) => {
  let state = {
    id: nextObjId++,
    name: model.type,
  };
  let i, prop;
  for (i = 2; i < model.props.length; i++) {
    prop = model.props[i];
    state[prop.type] = prop.initValue;
  }

  return Object.assign(state, settings);
};

export const defaultUpdator = (state, param) => {
  state.set(param[0], param[1]);
};

export const defaultInstCreator = (state, settings) => {

};

export const defaultInstUpdator = (state, settings) => {

};

class Model {
  constructor(type, parentType) {
    this.type = type;

    this.props = [];

    this.text('type', type, true);
    this.text('name', type);

    if (models.hasOwnProperty(parentType)) {
      this.props = this.props.concat(models[parentType].props.slice(2));
    }

    this.creator = defaultCreator;
    this.updator = defaultUpdator;

    this.instCreate = defaultInstCreator;
    this.instUpdate = defaultInstUpdator;
  }
  prop(type, key, initValue, readonly = false) {
    this.props.push({ type, key, initValue, readonly });
    return this;
  }

  // Methods to define properties
  boolean(key, initValue = false, readonly = false) {
    return this.prop('boolean', key, initValue);
  }
  number(key, initValue = 0, readonly = false) {
    return this.prop('number', key, initValue);
  }
  text(key, initValue = '', readonly = false) {
    return this.prop('text', key, initValue);
  }
  color(key, initValue = 0x000000, readonly = false) {
    return this.prop('color', key, initValue);
  }
  vector(key, initValue = { x: 0, y: 0 }, readonly = false) {
    return this.prop('vector', key, initValue);
  }

  // Method to setup creator/updator
  creator(create) {
    this.create = create;
    return this;
  }
  updater(update) {
    this.update = update;
    return this;
  }
  instCreator(create) {
    this.instCreate = create;
    return this;
  }
  instUpdater(update) {
    this.instUpdate = update;
    return this;
  }

  // API
  create(settings) {
    return this.creator(this, settings);
  }
  update(state, param) {
    return this.updator(state, param);
  }
}

export const model = (type) => {
  if (models.hasOwnProperty(type)) {
    console.log(`Model "${type}" is already defined!`);
    return null;
  }
  models[type] = new Model(type);
  return models[type];
};

