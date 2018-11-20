export const findAllNodes = (obj, propVal: string) => {

  if (obj.name === propVal) {
    return obj.elements;
  } else if (!!obj.elements) {

    return obj.elements.reduce((nodes, el) => {
      let result = findAllNodes(el, propVal);
      if (Array.isArray(result)) {
        return [...nodes, ...result];
      } else {
        return nodes;
      }
    }, []);
  } else {
    return null;
  }
};
