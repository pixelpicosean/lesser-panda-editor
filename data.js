export default () => {
  let nextObjectId = 0;

  const data = {
    /* Children of current root prefeb */
    children: [],

    /* Stores real object data */
    objectStore: {},

    nextObjectId: () => nextObjectId++,
    getObjectById: (id) => data.objectStore[id],
  };

  return data;
};
