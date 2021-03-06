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
        const pageViewByweek = await self.pageViewByweek()
        const allReports = {
            weekOverWeekChartData,
            pageViewByweek
        }
        res.json(allReports);
    },
    renderWeekOverWeekChart: async () => {

        const thisWeekResults = await google.analytics('v3').data.ga.get({
            'auth': jwt,
            'ids': 'ga:' + view_id,
            'dimensions': 'ga:date',
            'metrics': 'ga:sessions',
            'start-date': moment().subtract(1, 'day').day(0).format('YYYY-MM-DD'),
            'end-date': moment().format('YYYY-MM-DD')
        })

        const lastWeekResults = await google.analytics('v3').data.ga.get({
            'auth': jwt,
            'ids': 'ga:' + view_id,
            'dimensions': 'ga:date',
            'metrics': 'ga:sessions',
            'start-date': moment().subtract(1, 'day').day(0).subtract(1, 'week').format('YYYY-MM-DD'),
            'end-date': moment().subtract(1, 'day').day(6).subtract(1, 'week').format('YYYY-MM-DD')
        })

        var data1 = thisWeekResults.data.rows.map(function(row) { return +row[1]; });
        var data2 = lastWeekResults.data.rows.map(function(row) { return +row[1]; });
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
    },
    pageViewByweek: async () => {

        const results = await google.analytics('v3').data.ga.get({
            'auth': jwt,
            'ids': 'ga:' + view_id,
            'metrics': 'ga:pageviews',
            'start-date': '6daysAgo',
            'end-date': 'today',
            'dimensions': 'ga:date'
        })

        var data1 = results.data.rows.map(function(row) { return +row[1]; });
        var labels = results.data.rows.map(function(row) { return +row[0]; });

        labels = labels.map(function(label) {
            return moment(label, 'YYYYMMDD').format('dddd, DD-MM-YYYY');
        });

        var data = {
            labels : labels,
            datasets : [
                {
                    label: 'Page views',
                    backgroundColor : 'rgba(151,187,205,0.5)',
                    data : data1
                }
            ]
        };

        return data;
    }
};

module.exports = self;
