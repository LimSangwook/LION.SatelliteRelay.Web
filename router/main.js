var Client = require('node-rest-client').Client;
var coreRestApiClient = new Client();
var CORE_SERVER_URL = "localhost:4567";

var args = {
    requestConfig: {
        timeout: 1000, //request timeout in milliseconds
    },
    responseConfig: {
        timeout: 1000 //response timeout
    }
};

module.exports = function(app)
{
  setRoot(app);
  setHistory(app);
  setAdminSatellite(app);
  setAdminProduct(app);
  setAdminTargetServer(app);
  setRedirectCoreRestAPI(app);
}

function setRedirectCoreRestAPI(app) {
  // ### Satellite ###
  // Create
  app.post('/satellite/create',function(req,res){
  });
}

function setRoot(app) {
  app.get('/',function(req,res){
    res.render('www/index.html');
  });
}

function setHistory(app) {
  app.get('/AdminHistory',function(req,res){
    res.redirect('/AdminHistory/1');
  });

  app.get('/AdminHistory/:page',function(req,res){
    var page = req.params.page;
    var URL_LIST = "http://" + CORE_SERVER_URL + "/history/list/" + page;
    var totData = {};
    totData['title'] = 'Job History List'
    var coreReq = coreRestApiClient.get(URL_LIST, args, function (data, response) {
      console.log('GET ' + URL_LIST + " : " + data.toString());
      totData['HISTORY'] = JSON.parse(data.toString());
      console.info(data.toString());
      res.render('www/AdminHistory/index.html', totData);
    });
    setRequestHandle(coreReq, URL_LIST, res);
  });
}

function setAdminSatellite(app) {
  app.get('/AdminSatellite',function(req,res){
    res.redirect('/AdminSatellite/1');
  });

  app.get('/AdminSatellite/:page',function(req,res){
    var satellitePage = req.params.page;
    var URL_SATELLITE_LIST = "http://" + CORE_SERVER_URL + "/satellite/list/" + satellitePage;
    var totData = {};
    totData['title'] = 'Satellite Infomation'
    console.log("@@@@@@");
    var coreReq = coreRestApiClient.get(URL_SATELLITE_LIST, args, function (data, response) {
      console.log('GET ' + URL_SATELLITE_LIST + " : " + data.toString());
      totData['SATELLITE'] = JSON.parse(data.toString());
      console.info(totData);
      res.render('www/AdminSatellite/index.html', totData);
    });
    setRequestHandle(coreReq, URL_SATELLITE_LIST, res);
  });
}

function setAdminProduct(app) {
  app.get('/AdminProduct',function(req,res){
    res.redirect('/AdminProduct/1');
  });
  app.get('/AdminProduct/:page',function(req,res){
    var productPage = req.params.page;
    var URL_PRODUCT_LIST = "http://" + CORE_SERVER_URL + "/product/list/" + productPage;
    var totData = {};
    totData['title'] = 'Product Infomation'
    var coreReq = coreRestApiClient.get(URL_PRODUCT_LIST, args, function (data, response) {
      console.log('GET ' + URL_PRODUCT_LIST + " : " + data.toString());
      totData['PRODUCT'] = JSON.parse(data.toString());
      console.info(totData);
      res.render('www/AdminProduct/index.html', totData);
    });
    setRequestHandle(coreReq, URL_PRODUCT_LIST, res);
  });
}

function setAdminTargetServer(app) {
  app.get('/AdminTargetServer',function(req,res){
    var URL_DB = "http://" + CORE_SERVER_URL + "/serverInfo/db";
    var URL_FTP = "http://" + CORE_SERVER_URL + "/serverInfo/ftp";
    var totData = {};
    totData['title'] = 'Relay Server Infomation'
    var coreReqDB = coreRestApiClient.get(URL_DB, args, function (data, response) {
      console.log('GET ' + URL_DB + " : " + data.toString());
      totData['DB'] = JSON.parse(data.toString());
      var coreReqFTP = coreRestApiClient.get(URL_FTP, args, function (data, response) {
        console.log('GET ' + URL_FTP + " : " + data.toString());
        totData['FTP'] = JSON.parse(data.toString());
        console.info(totData);
        res.render('www/AdminTargetServer/index.html', totData);
      });
      setRequestHandle(coreReqFTP, URL_FTP, res);
    });
    setRequestHandle(coreReqDB, URL_DB, res);
  });
}

function setRequestHandle(req, requestURL, masterRes) {
  req.on('requestTimeout', function (req) {
      console.log(requestURL + '(requestTimeout) : request has expired');
      masterRes.render('errorCoreServer.html');
  });

  req.on('responseTimeout', function (res) {
      console.log(requestURL + '(responseTimeout) : response has expired');
      masterRes.render('errorCoreServer.html');
  });

  req.on('error', function (err) {
      console.log(requestURL + '(error) : request error');
      masterRes.render('errorCoreServer.html');
  });
}
