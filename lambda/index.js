'use strict'

exports.handler = async (event) => {
    const code = process.env.BG_COLOR;
    const executor = process.env.EXECUTOR;
    const response = {
        statusCode: 200,
        statusDescription: "200 OK",
        isBase64Encoded: false,
        headers: {
            "Content-Type": "text/html"
        },
        body: `<html><style>body{background-image: url('./Yahoo.png');}</style><body><h1>Screwdriver AWS Integration Lambda Demo!</h1>` +
        `<p style='background-color:tomato;'>This app is deployed using Screwdriver and AWS ${executor}.</p></body></html>`
    };
    return response;
};