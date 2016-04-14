let nextObjectId = 0;

export default () => {
  nextObjectId = 0;

  return {
    /* Children of current root prefeb */
    children: [],
  };
};
