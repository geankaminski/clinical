/* istanbul ignore file */
import { get, post, put, del, patch } from './fetch';

export const apiBaseRoute = process.env.API_BASE_URL;

const generateBody = (payload, type) => ((payload instanceof Array && {
  data: payload.map(dataItem => ({
    type,
    attributes: dataItem,
  })),
}) || payload
);

const performAction = method => (...models) => {
  if (models.length > 1) {
    return (...args) => performAction(method)(`${models[0]}/${args[0]}/${models[1]}`, ...models.slice(2))(...args.slice(1));
  }
  const model = models[0];
  const type = model.split('/').slice(-1)[0]; // Get the last part (a/b/c/d => d)
  switch (method) {
    case 'create':
      return payload => post(`${apiBaseRoute}/${model}`, { requestBody: generateBody(payload, type), contentType: payload instanceof FormData ? 'multipart/form-data' : 'application/json' });
    case 'update':
      return (id, payload) => put(`${apiBaseRoute}/${model}/${id}`, { requestBody: generateBody(payload, type) });
    case 'patch':
      return (id, payload) => patch(`${apiBaseRoute}/${model}/${id}`, { requestBody: generateBody(payload, type) });
    case 'remove':
      return (id, payload) => del(`${apiBaseRoute}/${model}/${id}`, { requestBody: generateBody(payload, type) });
    case 'read':
      return id => get(`${apiBaseRoute}/${model}/${id}`);
    case 'multiRemove':
      return query => del(`${apiBaseRoute}/${model}`, { query });
    case 'list':
    default:
      return query => get(`${apiBaseRoute}/${model}`, query);
  }
};

export default (...models) => ({
  create: performAction('create')(...models),
  update: performAction('update')(...models),
  patch: performAction('patch')(...models),
  remove: performAction('remove')(...models),
  multiRemove: performAction('multiRemove')(...models),
  list: performAction('list')(...models),
  read: performAction('read')(...models),
});
