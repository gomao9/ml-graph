$(function () {
  var idol_series_path = 'json/idol_rank_series.json'

  $.getJSON(idol_series_path, function(json) {
    draw_series(json);
  });

  draw_series = function(json) {
    var seriesChart = Highcharts.chart('idol_rank_series', {
      chart: {
        zoomType: "x",
        panning: true,
        panKey: "shift",
      },
      plotOptions: { line: { marker: { enabled: false } } },
      title: {
        text: 'ULAファイナル アイドルpt推移'
      },
      xAxis: json.xAxis,
      yAxis: {
        title: {
          text: 'アイドルpt',
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        valueSuffix: 'pt'
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      series: json.series,
    });
  };
});
