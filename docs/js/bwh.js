$(function () {

  var bwh_path = 'json/bwh.json'

  $.getJSON(bwh_path, function(json) {
    draw_bwh(json);
  });

  // Set up the chart
  draw_bwh = function(json) {
    var bwh_chart = new Highcharts.Chart({
      chart: {
        renderTo: 'bwh',
        margin: 100,
        type: 'scatter',
        options3d: {
          enabled: true,
          alpha: 10,
          beta: 30,
          depth: 250,
          viewDistance: 5,
          fitToPlot: false,
          frame: {
            bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
            back: { size: 1, color: 'rgba(0,0,0,0.04)' },
            side: { size: 1, color: 'rgba(0,0,0,0.06)' }
          },
        }
      },
      title: {
        text: 'バスト-ウエスト-ヒップ'
      },
      yAxis: {
        title: "バスト"
      },
      xAxis: {
        gridLineWidth: 1,
        title: "ウエスト"
      },
      zAxis: {
        title: "ヒップ"
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'バスト-ウエスト-ヒップ',
        colorByPoint: true,
        data: json.data
      }],
      tooltip: {
        formatter: function() {
          var p = this.point;
          return p.name + '<br>' + 
            p.x + '-' + p.y + '-' + p.z;
        }
      }
    });


    // Add mouse events for rotation
    $(bwh_chart.container).on('mousedown.hc touchstart.hc', function (eStart) {
      eStart = bwh_chart.pointer.normalize(eStart);

      var posX = eStart.pageX,
        posY = eStart.pageY,
        alpha = bwh_chart.options.chart.options3d.alpha,
        beta = bwh_chart.options.chart.options3d.beta,
        newAlpha,
        newBeta,
        sensitivity = 5; // lower is more sensitive

      $(document).on({
        'mousemove.hc touchdrag.hc': function (e) {
          // Run beta
          newBeta = beta + (posX - e.pageX) / sensitivity;
          bwh_chart.options.chart.options3d.beta = newBeta;

          // Run alpha
          newAlpha = alpha + (e.pageY - posY) / sensitivity;
          bwh_chart.options.chart.options3d.alpha = newAlpha;

          bwh_chart.redraw(false);
        },
        'mouseup touchend': function () {
          $(document).off('.hc');
        }
      });
    });
  };
});
