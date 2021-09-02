'use strict'
exports.handler = async (event) => {
    const executor = process.env.EXECUTOR;
    const html = `
<html>
<body style="background-color:grey;">
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