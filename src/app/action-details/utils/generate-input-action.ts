const getPrimitiveValue = (value: any): any => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  } else {
    return value;
  }
}

// const getPrimitiveValue = (value: any): any => {
//   if (value instanceof Date) {
//     return { "@value": `${value.toISOString().slice(0, 10)}` };
//   } else {
//     return { "@value": value };
//   }
// }

const getBaseConfig = (action: any, value: Record<string, any> = {}) => {
  const actionType: string = action.type;
  const inputPath: string = action.input.path;

  const result: any = {
    '@context': {
      "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
      "schema": "http://schema.org/",
      "wasa": "http://vocab.sti2.at/wasa/",
      "sh": "http://www.w3.org/ns/shacl#",
      "xsd": "http://www.w3.org/2001/XMLSchema#",
      "odta": "https://odta.io/voc/",
    },
    'schema:actionStatus': 'http://schema.org/ActiveActionStatus',
  };

  result['@type'] = actionType;
  result["schema:name"] = action.name;
  result["schema:description"] = action.description;
  result[inputPath] = {};

  Object.keys(value).forEach((key: string, i: number) => {

    if (value[key]) {
      const fieldValue = getPrimitiveValue(value[key]);

      result[inputPath][key] = fieldValue;

    }

    return null;
  });

  // const result = {
  //   "@context": {
  //     "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  //     "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
  //     "schema": "http://schema.org/",
  //     "wasa": "http://vocab.sti2.at/wasa/",
  //     "sh": "http://www.w3.org/ns/shacl#",
  //     "xsd": "http://www.w3.org/2001/XMLSchema#",
  //     "odta": "https://odta.io/voc/"
  //   },
  //   "@type": "schema:Event",
  //   "schema:name": "Event Search",
  //   "schema:description": "Insert different types of events based on name or date",
  //   "schema:actionStatus": "schema:PotentialActionStatus",
  //   "schema:object": {

  //   }
  // };

  return JSON.stringify(result, null, 2);
}

export const InputAction = { getBaseConfig };