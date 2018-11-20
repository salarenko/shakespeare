export const reduceData = (data: any[], mainPropName: string, otherPropName: string) => {

  const reducedNodes = data.reduce((acc, node) => {

    const reducedNode = node.reduce((nodeAcc, el) => {
      if (el.name === mainPropName) {
        return {...nodeAcc, [mainPropName]: el.elements[0].text};
      } else if (el.elements) {
        return {...nodeAcc, [otherPropName]: [...nodeAcc[otherPropName], el.elements]};
      } else {
        return null;
      }
    }, {[mainPropName]: null, [otherPropName]: []});


    return [...acc, reducedNode];
  }, []);

  return reducedNodes.filter(node => node !== null);
};
