'use strict'
const api = require('./server');
let server;

const transformUrlPath = (event, options) => {
  let url = event.path;

  // extract the stage from the url
  if (options.stripStage) {
    const currentStage = event.requestContext ? event.requestContext.stage : null;
    if (currentStage) {
      url = url.replace(`${currentStage}/`, '');
    }
  }

  // append qs params
  const params = event.queryStringParameters;
  if (params) {
    const qs = Object.keys(params).map(key => `${key}=${params[key]}`);
    if (qs.length > 0) {
      url += `?${qs.join('&')}`;
    }
  }

  return url;
};

const transformRequest = (event, options) => {
  const opt = {
    path: {
      stripStage: false,
    },
    ...options,
  };

  return {
    method: event.httpMethod,
    url: transformUrlPath(event, opt.path),
    payload: event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.bodyevent.body,
    headers: event.headers
  };
};

const transformResponse = response => {
  const { statusCode, statusDescription } = response;

  const headers = {
    ...response.headers,
    "Content-Type": "text/html; charset=utf-8"
  };

  if (headers['transfer-encoding'] === 'chunked') {
    delete headers['transfer-encoding']
  }
  // delete headers['content-encoding'];
  // delete headers['transfer-encoding'];

  const { 'content-type': type, 'content-encoding': encoding } = response.headers
  const isBase64Encoded = Boolean(type && !type.match(/; *charset=/)) || Boolean(encoding && encoding !== 'identity')

  return {
    statusCode,
    statusDescription,
    isBase64Encoded: isBase64Encoded,
    headers,
    body: response.rawPayload().toString(this.isBase64Encoded() ? 'base64' : 'utf8')
  };
};

exports.handler = async (event) => {
  console.log(event)
  const request = transformRequest(event);
  console.log(request)

  if (!server) {
    server = await api.start();
  }

  // delete request.headers['accept-encoding'];

  const response = await server.inject(request);
  console.log(response)

  const tResponse = transformResponse(response);

  console.log(tResponse)

  return tResponse;
};

// const handler = async (event) => {
//   if (!server) {
//     server = await api.start();
//   }
//   const request = {
//     method: 'GET',
//     url: '/',
//     payload: '',
//     headers: {
//       accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//       'accept-language': 'en-US,en;q=0.5',
//       connection: 'keep-alive',
//       host: 'localhost:4000',
//       'upgrade-insecure-requests': '1',
//       'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0',
//       'x-amzn-trace-id': 'Root=1-6144119d-2078341f5d091fa40bd72423',
//       'x-forwarded-for': '98.136.3.143',
//       'x-forwarded-port': '80',
//       'x-forwarded-proto': 'http'
//     },
//     validate: false
//   }

//   const response = await server.inject(request);
//   console.log(response.payload)
// }
// handler()