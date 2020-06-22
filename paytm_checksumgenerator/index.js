
// Required modules
var express        =         require("express");
var bodyParser     =         require("body-parser");
var cors = require('cors');
var app            =         express();
const checksum_lib = require('./checksum');


app.options('*', cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




//check server is running
label = "Paytm checksum Generator"

app.get('/', cors(), function(req,res){
  res.send([
  {
    
	label
  }
]);
});


//checksum generator


app.post('/checksumgenerator/', function (req, res) {
  console.log("Received Params ", req.query);
  var paytmParams = {};

/* put checksum parameters in Object */
paytmParams["MID"] = req.query.mid;
paytmParams["ORDERID"] = req.query.orderid;

/**
* Generate checksum by parameters we have
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
checksum_lib.genchecksum(paytmParams, req.query.key, function(err, checksum){
	console.log(checksum);
	global.value = checksum
	res.send([
		{
		 
		   "label":checksum
		}
	  ]);
});
  
  
  
});


// InitiateTransactionAPI for paytm

app.post('/initiate_transaction/', function (req, res) {

	
	/**
	* import checksum generation utility
	* You can get this utility from https://developer.paytm.com/docs/checksum/
	*/
	
	const https = require('https');
	/* initialize an object */
	var paytmParams = {};

	/* body parameters */
	paytmParams.body = {

		/* for custom checkout value is 'Payment' and for intelligent router is 'UNI_PAY' */
		"requestType" : req.query.requestType,

		/* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
		"mid" : req.query.mid,

		/* Find your Website Name in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
		"websiteName" : req.query.websiteName,

		/* Enter your unique order id */
		"orderId" : req.query.orderid,

		/* on completion of transaction, we will send you the response on this URL */
		"callbackUrl" : req.query.callbackUrl,

		/* Order Transaction Amount here */
		"txnAmount" : {

		/* Transaction Amount Value */
		"value" : req.query.value,

		/* Transaction Amount Currency */
		"currency" : req.query.currency,
		},

		/* Customer Infomation here */
		"userInfo" : {

		/* unique id that belongs to your customer */
		"custId" : req.query.custId,
		},
	};

	/**
	* Generate checksum by parameters we have in body
	* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
	*/
	checksum_lib.genchecksumbystring(JSON.stringify(paytmParams.body), req.query.key, function(err, checksum){

		/* head parameters */
		paytmParams.head = {
		
		/* put generated checksum value here */
		"signature"	: checksum
		};

		/* prepare JSON string for request */
		var post_data = JSON.stringify(paytmParams);

		var options = {

		/* for Staging */
		hostname: 'securegw-stage.paytm.in',

		/* for Production */
		// hostname: 'securegw.paytm.in',

		port: 443,
		path: '/theia/api/v1/initiateTransaction?mid='+req.query.mid+'&orderId='+req.query.orderid,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': post_data.length
		}
		};

		// Set up the request
		var response = "";
		var post_req = https.request(options, function(post_res) {
		post_res.on('data', function (chunk) {
			response += chunk;
		});

		post_res.on('end', function(){
			console.log('Response: ', response);
			var obj = JSON.parse(response);

			sample(obj)
			

		});
		});

		// post the data
		post_req.write(post_data);
		post_req.end();
		function sample(obj){
			res.send([
				{
				  //"label": labell
				  label : obj.body.txnToken
				}
			  ]);

		}
	});
		





});







app.listen(3000,function(){
  console.log("Started on PORT 3000");
})

