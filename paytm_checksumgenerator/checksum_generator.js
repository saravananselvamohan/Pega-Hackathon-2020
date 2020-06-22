const checksum_lib = require('./checksum.js');

var PaytmConfig = {
	mid: "rIUaCQ96971026164969",
	key: "Kn9zQekNjNQYd49d",
	website: "WEBSTAGING"
}

var params 						= {};
			params['MID'] 					= PaytmConfig.mid;
			params['WEBSITE']				= PaytmConfig.website;
			params['CHANNEL_ID']			= 'WEB';
			params['INDUSTRY_TYPE_ID']	= 'Retail';
			params['ORDER_ID']			= 'TEST_'  + new Date().getTime();
			params['CUST_ID'] 			= 'Customer001';
			params['TXN_AMOUNT']			= '1.00';
			params['CALLBACK_URL']		= 'http://localhost:'+'8080'+'/callback';
			params['EMAIL']				= 'abc@mailinator.com';
			params['MOBILE_NO']			= '7777777777';










checksum_lib.genchecksum(params, PaytmConfig.key, function (err, checksum) {

				var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
				// var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
				
				var form_fields = "";
				for(var x in params){
					form_fields += "<input type='hidden' name='"+x+"' value='"+params[x]+"' >";
				}
				console.log("Sothikathingada enaya");
				form_fields += "<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"' >";
				console.log('Itha checksum ahma', checksum)
				
			});
