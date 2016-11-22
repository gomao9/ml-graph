$(function () {
  var idol_24speed_path = 'json/idol_rank_24speed.json'

  $.getJSON(idol_24speed_path, function(json) {
    draw_24speed(json);
  });

  draw_24speed = function(json) {
    var _24speedChart = Highcharts.chart('idol_rank_24speed', {
      chart: {
        zoomType: "x",
        panning: true,
        panKey: "shift",
      },
      plotOptions: { line: { marker: { enabled: false } } },
      title: {
        text: 'ULAファイナル アイドルpt(24時間移動平均)'
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
