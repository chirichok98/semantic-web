const getPrimitiveValueString = (value: any) => {
  if(typeof value === 'string') {

  }
}

const getBaseConfig = (actionType: string, inputPath: string, value = {}) => {

  return `{
  "@context": {
    "@vocab": "http://schema.org/"
  },
  "@type": "${actionType}",
  "actionStatus": "http://schema.org/ActiveActionStatus",
  "${inputPath}": {
    "@type": "Thing",
    "latitude": "47.0400279421873",
    "longitude": {"@value": "10.6174111626351"}
  }
}`;
}

export const InputAction = { getBaseConfig };