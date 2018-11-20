export const findPostXmlNode = (obj, propVal: string) => {

  let result = null;

  if (obj.name === propVal) {

    return {[propVal]: obj.elements[0].text};
  } else if (obj.elements) {
    obj.elements.find(el => {
      result = findPostXmlNode(el, propVal);
      return !!result;
    });

    return result;
  }

  return null;
};
