export const models = {};

let nextObjId = 0;

class Model {
  constructor(type, parentTypeOrModel) {
    this.type = type;
    this.parent;

    this.props = [];
    this.propKeys = [];

    this.text('type', type, true);
    this.text('name', type);

    // Has parent type
    if (parentTypeOrModel) {
      // Parent type is a string
      if (typeof(parentTypeOrModel) === 'string' && models[parentTypeOrModel]) {
        this.parent = models[parentTypeOrModel];
      }
      // Parent type is a model
      else if (parentTypeOrModel instanceof Model) {
        this.parent = parentTypeOrModel;
        // Save the parent type to registry if not exist yet
        if (!models.hasOwnProperty(parentTypeOrModel.type)) {
          models[parentTypeOrModel.type] = parentTypeOrModel;
        }
      }
    }

    if (this.parent) {
      this.props = this.props.concat(this.parent.props.slice(2));
      this.propKeys = this.propKeys.concat(this.parent.propKeys.slice(2));
    }

    // Override these functions PLZ
    this.instCreator = () => {
      console.log(`Cannot create "${this.type}" instances`);
    };
    this.instUpdator = () => {
      console.log(`Cannot update "${this.type}" instances`);
    };
  }
  prop(type, key, initValue, readonly = false) {
    if (this.propKeys.indexOf(key) !== -1) {
      console.log(`Property "${key}" is already defined!`);
      return this;
    }

    this.props.push({ type, key, initValue, readonly });
    this.propKeys.push(key);

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

  // Method to setup instance creator/updator
  setInstCreator(creator) {
    this.instCreator = creator;
    return this;
  }
  setInstUpdator(updator) {
    this.instUpdator = updator;
    return this;
  }

  // API
  create(settings) {
    let state = {
      id: nextObjId++,
      type: this.type,
      name: this.type,
    };
    let i, prop;
    for (i = 2; i < this.props.length; i++) {
      prop = this.props[i];
      state[prop.key] = (settings[prop.key] !== undefined) ? settings[prop.key] : prop.initValue;
    }

    return state;
  }
  update(state, param) {
    if (this.propKeys.indexOf(param[0]) !== -1) {
      state.set(param[0], param[1]);
      return true;
    }
    else {
      return false;
    }
  }

  createInst(state) {
    const inst = this.instCreator();

    // General properties
    inst.id = state.id;
    inst.type = state.type;
    inst.name = state.name;

    // Update custom properties
    this.updateInst(state, inst);

    return inst;
  }
  updateInst(state, inst) {
    if (this.parent) {
      this.parent.updateInst(state, inst);
    }
    this.instUpdator(state, inst);
  }
}

export const model = (type, parentType) => {
  if (models.hasOwnProperty(type)) {
    console.log(`Model "${type}" is already defined!`);
    return null;
  }
  models[type] = new Model(type, parentType);
  return models[type];
};

