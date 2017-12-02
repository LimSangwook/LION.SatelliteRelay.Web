var Client = require('node-rest-client').Client;
var coreRestApiClient = new Client();

var OPTION_LIST = require('./OptionList.js');
var CORE_SERVER_URL = "localhost:4567";
var DATA_AN_GBN_LIST = {};
var DATA_GBN_LIST = {};
var RESTAPI_CALL_ARGS = {
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
  setAdminPassword(app);
  setRedirectCoreRestAPI(app);
}

updateSatelliteList();
// updateDataANGBNList();
// updateDataGBNList();


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
    var coreReq = coreRestApiClient.get(URL_LIST, RESTAPI_CALL_ARGS, function (data, response) {
      console.log('GET ' + URL_LIST + " : " + data.toString());
      totData['HISTORY'] = JSON.parse(data.toString());
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
    updateSatelliteList();
    var satellitePage = req.params.page;
    var URL_SATELLITE_LIST = "http://" + CORE_SERVER_URL + "/satellite/list/" + satellitePage;
    var totData = {};
    totData['title'] = 'Satellite Infomation'
    var coreReq = coreRestApiClient.get(URL_SATELLITE_LIST, RESTAPI_CALL_ARGS, function (data, response) {
      console.log('GET ' + URL_SATELLITE_LIST + " : " + data.toString());
      totData['SATELLITE'] = JSON.parse(data.toString());
      res.render('www/AdminSatellite/index.html', totData);
    });
    coreReq.on('error', function (err) {
        console.error('Something went wrong on the client', err);
    });
    setRequestHandle(coreReq, URL_SATELLITE_LIST, res);
    // handling client error events

  });
}

function updateSatelliteList() {
  var URL = "http://" + CORE_SERVER_URL + "/satellite/listAll";

  var coreReq = coreRestApiClient.get(URL, RESTAPI_CALL_ARGS, function (data, response) {
    console.log('GET ' + URL + " : " + data.toString());
    OPTION_LIST.SATELLITE_LIST = JSON.parse(data.toString()).Datas;
  });
  coreReq.on('error', function (err) {
    console.log("Core API CALL ERROR!\nCehck Core Program plz.. : " + URL);
  });
}

function updateDataANGBNList() {
  var URL = "http://" + CORE_SERVER_URL + "/list/DATA_AN_GBN";

  var coreReq = coreRestApiClient.get(URL, RESTAPI_CALL_ARGS, function (data, response) {
    console.log('GET ' + URL + " : " + data.toString());
    DATA_AN_GBN_LIST = JSON.parse(data.toString()).Datas;
  });
}

function updateDataGBNList() {
  var URL = "http://" + CORE_SERVER_URL + "/list/DATA_GBN";

  var coreReq = coreRestApiClient.get(URL, RESTAPI_CALL_ARGS, function (data, response) {
    console.log('GET ' + URL + " : " + data.toString());
    DATA_GBN_LIST = JSON.parse(data.toString()).Datas;
  });
}

function setAdminProduct(app) {
  app.get('/AdminProduct',function(req,res){
    res.redirect('/AdminProduct/1');
  });
  app.get('/AdminProduct/:page',function(req,res){
    updateSatelliteList();
    var productPage = req.params.page;
    var URL_PRODUCT_LIST = "http://" + CORE_SERVER_URL + "/product/list/" + productPage;
    var totData = {};
    totData['title'] = 'Scheduled Job';
    totData['PRODUCT_TARGET_PATH_TYPE_OPTIONS'] = OPTION_LIST.PRODUCT_TARGET_PATH_TYPE_OPTIONS;
    totData['PRODUCT_SCHEDULE_TYPE'] = OPTION_LIST.PRODUCT_SCHEDULE_TYPE;
    totData['PRODUCT_FILTER_TYPE'] = OPTION_LIST.PRODUCT_FILTER_TYPE;
    totData['PRODUCT_DATA_FORMAT'] = OPTION_LIST.PRODUCT_DATA_FORMAT;
    totData['PRODUCT_DATA_TYPE'] = OPTION_LIST.PRODUCT_DATA_TYPE;
    totData['DATA_AN_GBN_OPTIONS'] = OPTION_LIST.DATA_AN_GBN_OPTIONS;
    totData['DATA_GBN_OPTIONS'] = OPTION_LIST.DATA_GBN_OPTIONS;
    totData['SATELLITE_LIST'] = OPTION_LIST.SATELLITE_LIST;
    totData['PRODUCT_PROCESS_TYPE'] = OPTION_LIST.PRODUCT_PROCESS_TYPE;

    var coreReq = coreRestApiClient.get(URL_PRODUCT_LIST, RESTAPI_CALL_ARGS, function (data, response) {
      console.log('GET ' + URL_PRODUCT_LIST + " : " + data.toString());
      totData['PRODUCT'] = JSON.parse(data.toString());
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
    var coreReqDB = coreRestApiClient.get(URL_DB, RESTAPI_CALL_ARGS, function (data, response) {
      console.log('GET ' + URL_DB + " : " + data.toString());
      totData['DB'] = JSON.parse(data.toString());
      var coreReqFTP = coreRestApiClient.get(URL_FTP, RESTAPI_CALL_ARGS, function (data, response) {
        console.log('GET ' + URL_FTP + " : " + data.toString());
        totData['FTP'] = JSON.parse(data.toString());
        res.render('www/AdminTargetServer/index.html', totData);
      });
      setRequestHandle(coreReqFTP, URL_FTP, res);
    });
    setRequestHandle(coreReqDB, URL_DB, res);
  });
}

function setAdminPassword(app) {
  app.get('/AdminPassword',function(req,res){
    var totData = {};
    totData['title'] = 'Admin Password';
    res.render('www/AdminPassword/index.html', totData);
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
