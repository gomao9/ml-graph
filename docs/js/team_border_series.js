$(function () {
  var team_border_series_path = 'json/team_border_series.json'

  $.getJSON(team_border_series_path, function(json) {
    draw_team_border_series(json);
  });

  draw_team_border_series = function(json) {
    var team_border_seriesChart = Highcharts.chart('team_border_series', {
      chart: {
        zoomType: "x",
        panning: true,
        panKey: "shift",
      },
      plotOptions: { line: { marker: { enabled: false } } },
      title: {
        text: 'ULAファイナル チーム別ランキング ボーダー推移(146位)'
      },
      xAxis: json.xAxis,
      yAxis: {
        title: {
          text: 'ボーダー(pt)',
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
