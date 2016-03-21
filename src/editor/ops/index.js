const operators = {
  /**
   * Register a new operator to a specific namespace
   * @param  {String} ns    Namespace
   * @param  {String} name  Name of this operator
   * @param  {Object} op    Operator defination
   */
  registerOperator: (ns, name, op) => {
    if (!operators.hasOwnProperty(ns)) {
      operators[ns] = {};
    }
    operators[ns][name] = op;
  },
};

export default operators;
