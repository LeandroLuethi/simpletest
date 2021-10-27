const { createServer } = require('http');
const { signUp, signIn, saveData, loadData, loadTest, loadAll, distribute, finishTest, solution} = require('./handlers');
const { servestatic } = require('./servestatic');

createServer(answer).listen(8080);

async function answer(req, res) {

	if(req.url == "/signUp") 	{return signUp(req, res)}
	if(req.url == "/signIn") 	{return signIn(req, res)}
	if(req.url == "/saveData") 	{return saveData(req, res)}
	if(req.url == "/loadData") 	{return loadData(req, res)}
	if(req.url == "/loadTest") 	{return loadTest(req, res)}
	if(req.url == "/loadAll") 	{return loadAll(req, res)}
	if(req.url == "/distribute"){return distribute(req, res)}
	if(req.url == "/finishTest"){return finishTest(req, res)}
	if(req.url == "/solution"){return solution(req, res)}
	
	return servestatic(req, res)

}