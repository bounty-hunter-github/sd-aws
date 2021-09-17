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
      payload: event.body,
      headers: event.headers,
      validate: false
    };
  };
  
  const transformResponse = response => {
    const { statusCode } = response;
  
    const headers = {
      ...response.headers,
    };
  
    delete headers['content-encoding'];
    delete headers['transfer-encoding'];
  
    let body = response.result;
    if (typeof response.result !== 'string') {
      body = JSON.stringify(body);
    }
  
    return {
      statusCode,
      headers,
      body
    };
  };

exports.handler = async (event) => {
    const request = transformRequest(event);
    if (!server) {
        server = await api.start();
    }

    const response = await server.inject(request);

    return transformResponse(response);
};
