const service_account = require('../../config/googleAnalytics');
const { google } = require('googleapis');
const reporting = google.analyticsreporting('v4');
let scopes = ['https://www.googleapis.com/auth/analytics.readonly'];
let jwt = new google.auth.JWT(
    service_account.client_email,
    null,
    service_account.private_key,
    scopes
);

let view_id = '194958652';
let getReports = async function (reports) {
    await jwt.authorize();
    let request = {
        'headers': {'Content-Type': 'application/json'}, 'auth': jwt, 'resource': reports
    };
    return await reporting.reports.batchGet(request);
};

// Delete a role with the specified roleId in the request
exports.basicReports = (req, res) => {
	let basic_report = {
        'reportRequests': [
            {
                'viewId': view_id,
                'dateRanges': [{'startDate': '2019-05-09', 'endDate': '2019-05-10'}],
                'metrics': [{'expression': 'ga:users'}]
            }
        ]
    };

    getReports(basic_report)
        .then(response => console.log(response.data))
        .catch(e => console.log(e));
};