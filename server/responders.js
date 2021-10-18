async function respondWithJson(res, jsondata) {
	res.writeHead(200, {
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		'Access-Control-Allow-Origin': "*",
		'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept"
	});
	res.write(JSON.stringify(jsondata))
	res.end()
}

module.exports = {respondWithJson}