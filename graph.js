$(function () {
    $('#container').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Voice Analysis - 23 May'
        },
        subtitle: {
            text: 'Frequency'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                millisecond:"%A, %b %e, %H:%M:%S.%L",
            },
            title: {
                text: 'timestamp'
            }
        },
        yAxis: {
            title: {
                text: 'Frequency (Hz)'
            },
            min: 85
        },
        tooltip: {
            headerFormat: '<b>{point.y:.2f} Hz</b><br>',
            pointFormat: '{point.x: current time: %H:%M min %S sec %L ms}'
        },

        series: [{
            name: 'current snapshot',
            data: [
                    [Date.UTC(2016, 4, 23, 14, 0, 41, 11), 105], 
                    [Date.UTC(2016, 4, 23, 14, 0, 46, 18), 96], 
                    [Date.UTC(2016, 4, 23, 14, 0, 51, 26), 94], 
                    [Date.UTC(2016, 4, 23, 14, 0, 59, 10), 103], 
                    [Date.UTC(2016, 4, 23, 14, 1, 23, 46), 108], 
                    [Date.UTC(2016, 4, 23, 14, 1, 29, 56), 107], 
                    [Date.UTC(2016, 4, 23, 14, 1, 31, 08), 105], 
                    [Date.UTC(2016, 4, 23, 14, 1, 39, 37), 101], 
                    [Date.UTC(2016, 4, 23, 14, 1, 43, 39), 99],
                    [Date.UTC(2016, 4, 23, 14, 2, 01, 26), 106],
                    [Date.UTC(2016, 4, 23, 14, 2, 18, 32), 99],
                    [Date.UTC(2016, 4, 23, 14, 2, 25, 48), 96],
                    [Date.UTC(2016, 4, 23, 14, 2, 31, 21), 94],
                    [Date.UTC(2016, 4, 23, 14, 2, 47, 13), 93],
                    [Date.UTC(2016, 4, 23, 14, 2, 56, 27), 95]]
            }
    ]
    });
});