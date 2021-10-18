const URL = require("url").URL
const fs = require("fs")
const path = require("path")

const mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"png": "image/png",
	"svg": "image/svg+xml",
	"json": "application/json",
	"js": "text/javascript",
	"css": "text/css"
}

function send404(res) {
	res.writeHead(404, {
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		'Access-Control-Allow-Origin': "*",
		'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept"
	});
	res.write("404 Not Found\n");
	res.end();
}

async function servestatic(req, res) {
	const urlpath = new URL(req.url, "http://localhost").pathname
	let filepath = path.join("..", "client", urlpath);
	
	console.log(filepath);
	if(!fs.existsSync(filepath)) {
		return send404(res)
	}

	if(fs.statSync(filepath).isDirectory()) 
    filepath += '/index.html';
 
	fs.readFile(filepath, "binary", function(err, file) {
		if(err) {        
			return send404(res)
		}
		
		const mimeType = mimeTypes[filepath.split('.').pop()] || 'text/plain';
		res.writeHead(200, {
			"Content-Type": mimeType,
			'Access-Control-Allow-Origin': "*",
			'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept"
		});
		res.write(file, "binary");
		res.end();
	});
}

module.exports = {servestatic}

