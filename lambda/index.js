'use strict'

exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        statusDescription: "200 OK",
        isBase64Encoded: False,
        headers: {
            "Content-Type": "text/html"
        },
        body: "<html><h1 color='red'>Hello from Screwdriver AWS Integration Lambda!</h1></html>"
    };
    return response;
};