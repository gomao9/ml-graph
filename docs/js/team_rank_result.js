$(function () {
  var team_rank_result_path = 'json/team_rank_result.json'

  $.getJSON(team_rank_result_path, function(json) {
    draw_team_rank_result(json);
  });

  draw_team_rank_result = function(json) {
    var team_rank_resultChart = Highcharts.chart('team_rank_result', {
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
