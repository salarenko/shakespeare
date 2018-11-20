import {findPostXmlNode} from './find-post-xml-node';

export const extractBaseData = (data: any, tags: string[]): { [key: string]: any } => {

  return tags.reduce((searchResults, tag: string) => {

    return {...searchResults, ...findPostXmlNode(data, tag)};

  }, {});
};
