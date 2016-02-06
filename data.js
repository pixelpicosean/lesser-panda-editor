export default () => {
  let nextObjectId = 0;

  const data = {
    /* Children of current root prefeb */
    children: [],

    /* Stores real object data */
    objectStore: {},

    nextObjectId: () => nextObjectId++,
    getObjectById: (id) => data.objectStore[id],
    removeObject: (id) => {
      let obj = data.objectStore[id];
      let parent = obj.parent < 0 ? data : data.objectStore[obj.parent];
      parent.children.splice(parent.children.indexOf(id), 1);

      delete data.objectStore[id];
    },
  };

  return data;
};
