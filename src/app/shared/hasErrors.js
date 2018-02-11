// @flow

export default (fieldsError: Object) =>
  Object.keys(fieldsError).some(field => fieldsError[field]);
