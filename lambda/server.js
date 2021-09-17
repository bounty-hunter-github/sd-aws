'use strict';

const Path = require('path');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision');

const start = async () => {

    const server = Hapi.server({
        port: process.env.port || 4000,
        host: 'localhost',
        routes: {
          files: {
            relativeTo: Path.join(__dirname, 'public')
          }
        }
      });
    await server.register(Inert);
    await server.register(Vision);

    server.views({
        engines: {
            html: {
                module: require('handlebars'),
                compileMode: 'sync' 
            }
        },
        relativeTo: __dirname,
        path: 'public',
        context: {
            executor: process.env.EXECUTOR
        }
    });
      
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true,
            }
        }
    });

    server.ext('onPreResponse', (request, h) => {
        const response = request.response;
        if (response.isBoom &&
            response.output.statusCode === 404) {
    
            return h.file('404.html').code(404);
        }
    
        return h.continue;
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    
    return server;
};

//api()
module.exports.start = start