'use strict'
const fs = require('fs');
exports.handler = async (event) => {
    const code = process.env.BG_COLOR;
    //const image = fs.readFileSync('./Yahoo.png');
    const executor = process.env.EXECUTOR;
    const html = `
<html>
<style>
    body {
        background-image: url('./Yahoo.png');
    }
</style>
<body background="./Yahoo.png">
    <h1>Screwdriver AWS Integration Lambda Demo!</h1>` +
    `<p style='background-color:tomato;'>This app is deployed using Screwdriver and AWS ${executor}.</p>
</body>
</html>
    `
    const response = {
        statusCode: 200,
        statusDescription: "200 OK",
        isBase64Encoded: false,
        headers: {
            "Content-Type": "text/html"
        },
        body: html
    };
    return response;
};