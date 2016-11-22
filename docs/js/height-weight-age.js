$(function () {

  var height_weight_age_path = 'json/height_weight_age.json'

  // Give the points a 3D feel by adding a radial gradient
  Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function (color) {
    return {
      radialGradient: {
        cx: 0.4,
        cy: 0.3,
        r: 0.5
      },
      stops: [
        [0, color],
        [1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
      ]
    };
  });

  $.getJSON(height_weight_age_path, function(json) {
    draw_height_weight_age(json);
  });

  // Set up the chart
  draw_height_weight_age = function(json) {
    var hwa_chart = new Highcharts.Chart({
      chart: {
        renderTo: 'height_weight_age',
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
        text: '身長-体重-年齢'
      },
      yAxis: {
        title: "体重"
      },
      xAxis: {
        gridLineWidth: 1,
        title: "身長"
      },
      zAxis: {
        title: "年齢"
      },
      legend: {
        enabled: false
      },
      series: [{
        name: '身長-体重-年齢',
        colorByPoint: true,
        data: json.data
      }],
      tooltip: {
        formatter: function() {
          var p = this.point;
          return p.name + '<br>' + 
            p.x + 'cm, ' + p.y + 'kg, ' + p.z + '歳';
        }
      }
    });


    // Add mouse events for rotation
    $(hwa_chart.container).on('mousedown.hc touchstart.hc', function (eStart) {
      eStart = hwa_chart.pointer.normalize(eStart);

      var posX = eStart.pageX,
        posY = eStart.pageY,
        alpha = hwa_chart.options.chart.options3d.alpha,
        beta = hwa_chart.options.chart.options3d.beta,
        newAlpha,
        newBeta,
        sensitivity = 5; // lower is more sensitive

      $(document).on({
        'mousemove.hc touchdrag.hc': function (e) {
          // Run beta
          newBeta = beta + (posX - e.pageX) / sensitivity;
          hwa_chart.options.chart.options3d.beta = newBeta;

          // Run alpha
          newAlpha = alpha + (e.pageY - posY) / sensitivity;
          hwa_chart.options.chart.options3d.alpha = newAlpha;

          hwa_chart.redraw(false);
        },
        'mouseup touchend': function () {
          $(document).off('.hc');
        }
      });
    });
  };


});
