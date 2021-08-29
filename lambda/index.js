'use strict'

exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        statusDescription: "200 OK",
        isBase64Encoded: false,
        headers: {
            "Content-Type": "text/html"
        },
        body: `<html><body style='background-color:powderblue;'><h1>Screwdriver AWS Integration Lambda!</h1>` +
        `<p style='background-color:tomato;'>This app is deployed using Screwdriver and Codebuild.</p></body></html>`
    };
    return response;
};