$(function () {
    var data = voxmod.storage.load('VoiceAnalysisHistory') || [];
    averagePitchData = data.map(function (value) { return [new Date(value.timestamp).getTime(), value.averagePitch] })
    pitchVarianceData = data.map(function (value) { return [new Date(value.timestamp).getTime(), value.pitchVariance] })
    $('#container').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Voice Analysis'
        },
        subtitle: {
            text: 'Frequency'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                millisecond: "%b %e, %H:%M:%S.%L",
                second: "%b %e, %H:%M:%S",
                minute: "%b %e, %H:%M",
                hour: "%b %e, %H:%M",
                day: "%b %e, %Y",
                week: "%b %e, %Y",
                month: "%B %Y",
                year: "%Y"
            },
            title: {
                text: 'Timestamp'
            }
        },
        yAxis: {
            title: {
                text: 'Frequency (Hz)'
            }
        },
        tooltip: {
            headerFormat: '<b>{point.y:.2f} Hz</b><br>',
            pointFormat: '{point.x: current time: %H:%M min %S sec %L ms}'
        },

        series: [{
            name: 'Average pitch',
            data: averagePitchData
        },
        {
            name: 'Pitch variance',
            data: pitchVarianceData
        }
    ]
    });
});