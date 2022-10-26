//
// JavaScript Functions For mysql-get-employees.htm
// 
// You need to EDIT so as to use YOUR IdentityPoolId !
//

AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: '',
});
let LAMBDA = new AWS.Lambda({"region" : "us-east-1", "apiVersion" : "2015-03-31"});

function initUi() {
	$("#empId").val("");
	$("#supId").val("");
	$("#empFirstNname").val("");
	$("#empLastName").val("");
	$("#empTitle").val("");
}

function clearResults() {
	$("#responseArea").html("");
}

function displayJson(jsn) {
	for (var j in jsn) {
		var msg = jsn[j];
		if (typeof msg != 'object') {
			alert(j + " : " + JSON.stringify(msg));
		} else {
			displayJson(msg);
		}
	}
}

function displayEmployees(ans) {
	// displayJson(ans);
	// {"StatusCode":200,"Payload":"{\"statusCode\": \"200\", \"body\": \"[[1, 0, \\\"Robert\\\", \\\"Striver\\\", \\\"CEO\\\"]]\", \"headers\": {\"Content-Type\": \"application/json\"}}"}
	try {
		var payloadObj = JSON.parse(ans.Payload);
		var employeeArray = JSON.parse(payloadObj.body);
		
		var table = "<table border=\"1\" style=\"text-align:center;\">";
		var rows = "\n<tr><th>Employee ID</th><th>Supervisor ID</th><th>Name</th><th>Title</th></tr>";
		for (var i in employeeArray) {
			// alert("index = " + i);
			var emp_id = employeeArray[i][0];
			var sup_id = employeeArray[i][1];
			var emp_fname = employeeArray[i][2];
			var emp_lname = employeeArray[i][3];
			var emp_title = employeeArray[i][4];

			rows += "\n<tr><td>" + emp_id + "</td><td>" + sup_id + "</td><td>" + emp_fname + " " + emp_lname + "</td><td>" + emp_title + "</td></tr>";
		}
		table += rows + "\n</table>";
		$("#responseArea").html(table);
	} catch(err) {
		$("#responseArea").html("<pre>" + JSON.stringify(ans) + "</pre>");
	}	
}

function getEmployeesUsingLambda() {

	var queryParams = {};
	queryParams.TableName = "employees";
	var item = {};
	item.emp_id = $("#empId").val();
	item.sup_id = $("#supId").val();
	item.emp_fname = $("#empFirstName").val();
	item.emp_lname = $("#empLastName").val();
	item.emp_title = $("#empTitle").val();
	queryParams.Item = item;

	var lambdaParams = {};
	lambdaParams.httpMethod = 'GET';
	lambdaParams.body = queryParams

	let invokeParams = {
		"FunctionName" : "myMySqlEmployeeDbFn",
		"InvocationType" : "RequestResponse",
		"Payload" : JSON.stringify(lambdaParams)
	};

	LAMBDA.invoke(invokeParams, function(err, data) {
		var ans = "";
		if (err) {
			//alert(JSON.stringify(err));
			displayJson(err);
		} else {
			ans = data;
			//alert(JSON.stringify(ans));
			displayEmployees(ans);
		}
	});
}
