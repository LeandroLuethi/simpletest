function parseJsonBody(req) {
  return new Promise((resolve, reject)=>{
    const body = [];
    req.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      let bodystr = Buffer.concat(body).toString();
      try {
        resolve(JSON.parse(bodystr || "{}"));
      }
      catch(e) {
        reject(e);
      }
    });
  });
}

function parseTextBody(req) {
  return new Promise((resolve, reject)=>{
    const body = [];
    req.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      let bodystr = Buffer.concat(body).toString();
      resolve(bodystr || "");
    });
  });
}

module.exports = {parseTextBody, parseJsonBody};