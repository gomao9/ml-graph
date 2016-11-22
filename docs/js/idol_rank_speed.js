$(function () {
  var idol_speed_path = 'json/idol_rank_speed.json'

  $.getJSON(idol_speed_path, function(json) {
    draw_speed(json);
  });

  draw_speed = function(json) {
    var speedChart = Highcharts.chart('idol_rank_speed', {
      chart: {
        zoomType: "x",
        panning: true,
        panKey: "shift",
      },
      plotOptions: { line: { marker: { enabled: false } } },
      title: {
        text: 'ULAファイナル アイドルpt(時速)'
      },
      xAxis: json.xAxis,
      yAxis: {
        title: {
          text: 'アイドルpt/h',
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
