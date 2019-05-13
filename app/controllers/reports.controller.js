import service_account from '../../config/googleAnalytics'
import { google } from 'googleapis'
import moment from 'moment'

const reporting = google.analyticsreporting('v4');
let scopes = ['https://www.googleapis.com/auth/analytics.readonly'];
let jwt = new google.auth.JWT(
    service_account.client_email,
    null,
    service_account.private_key,
    scopes
);
let view_id = '195035346';

const self = {
    basicReports : async (req, res) => {
        const weekOverWeekChartData = await self.renderWeekOverWeekChart()
        res.json(weekOverWeekChartData);
    },
    renderWeekOverWeekChart: async () => {

        const thisWeekResults = await google.analytics('v3').data.ga.get({
            'auth': jwt,
            'ids': 'ga:' + view_id,
            'dimensions': 'ga:date,ga:nthDay',
            'metrics': 'ga:sessions',
            'start-date': moment().subtract(1, 'day').day(0).format('YYYY-MM-DD'),
            'end-date': moment().format('YYYY-MM-DD')
        })

        const lastWeekResults = await google.analytics('v3').data.ga.get({
            'auth': jwt,
            'ids': 'ga:' + view_id,
            'dimensions': 'ga:date,ga:nthDay',
            'metrics': 'ga:sessions',
            'start-date': moment().subtract(1, 'day').day(0).subtract(1, 'week').format('YYYY-MM-DD'),
            'end-date': moment().subtract(1, 'day').day(6).subtract(1, 'week').format('YYYY-MM-DD')
        })

        var data1 = thisWeekResults.data.rows.map(function(row) { return +row[2]; });
        var data2 = lastWeekResults.data.rows.map(function(row) { return +row[2]; });
        var labels = thisWeekResults.data.rows.map(function(row) { return +row[0]; });

        labels = labels.map(function(label) {
            return moment(label, 'YYYYMMDD').format('ddd');
        });

        var data = {
            labels : labels,
            datasets : [
                {
                    label: 'Last Week',
                    backgroundColor: 'rgba(220,220,220,0.5)',
                    data : data2
                },
                {
                    label: 'This Week',
                    backgroundColor : 'rgba(151,187,205,0.5)',
                    data : data1
                }
            ]
        };

        return data;
    }
};

module.exports = self;
