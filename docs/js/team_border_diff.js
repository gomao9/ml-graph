$(function () {
  var team_border_diff_path = 'json/team_border_diff.json'

  $.getJSON(team_border_diff_path, function(json) {
    draw_team_border_diff(json);
  });

  draw_team_border_diff = function(json) {
    var team_border_diffChart = Highcharts.chart('team_border_diff', {
      chart: {
        zoomType: "x",
        panning: true,
        panKey: "shift",
      },
      plotOptions: { line: { marker: { enabled: false } } },
      title: {
        text: 'ULAファイナル チームptランキング(最終結果)'
      },
      xAxis: json.xAxis,
      yAxis: {
        title: {
          text: 'チームpt',
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
