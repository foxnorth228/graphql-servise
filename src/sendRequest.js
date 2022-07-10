import { request } from "http";
export async function sendRequest(path, method="GET", body={}, headers = {}) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(body);
        let length = 0;
        if(method !== "GET" || method !== "DELETE") {
            length = Buffer.byteLength(postData);
        }
        console.log(postData);
        const options = {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': length
            }
        };
        const req = request(path, options, (res) => {
            let body = "";
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
              console.log(`BODY: ${chunk}`);
              body += chunk;
            });
            res.on('end', () => {
                console.log('No more data in response.')
                resolve(body);
            });
        });
        for (let [key, value] of Object.entries(headers)) {
            req.setHeader(key, value);
        }
        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject(e);
        });
        if(method !== "GET" || method !== "DELETE") {
            req.write(postData);
        }
        req.end();
    });
}