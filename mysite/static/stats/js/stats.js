(function ($) {

  $('ul.nav li.dropdown').hover(function () {
    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
  }, function () {
    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
  });

  var ac_region = $("#ac_region").data("region").toLowerCase();
  var ac_data_type = $("#ac_data_type").data("type").toLowerCase().replace(/ /g, "_");

  $('#regions .r').on('click', function (e) {
    e.preventDefault();
    ac_region = ($(this)[0].innerText).toLowerCase();
    window.location.replace("/" + ac_region + "/" + ac_data_type);
  });

  $('#data_type .d').on('click', function (e) {
    e.preventDefault();
    ac_data_type = ($(this)[0].innerText).toLowerCase().replace(/ /g, "_");
    window.location.replace("/" + ac_region + "/" + ac_data_type);
  });

  var colors = {
    "jan": ["rgba(244,67,54,0.2)", "rgba(244,67,54,1)"],
    "feb": ["rgba(3,169,244,0.2)", "rgba(3,169,244,1)"],
    "mar": ["rgba(0,150,136,0.2)", "rgba(0,150,136,1)"],
    "apr": ["rgba(103,58,183,0.2)", "rgba(103,58,183,1)"],
    "may": ["rgba(255,235,59,0.2)", "rgba(255,235,59,1)"],
    "jun": ["rgba(33,150,243,0.2)", "rgba(33,150,243,1)"],
    "jul": ["rgba(76,175,80,0.2)", "rgba(76,175,80,1)"],
    "aug": ["rgba(255,193,7,0.2)", "rgba(255,193,7,1)"],
    "sep": ["rgba(233,30,99,0.2)", "rgba(233,30,99,1)"],
    "oct": ["rgba(0,188,212,0.2)", "rgba(0,188,212,1)"],
    "nov": ["rgba(205,220,57,0.2)", "rgba(205,220,57,1)"],
    "dec": ["rgba(255,152,0,0.2)", "rgba(255,152,0,1)"],
    "sum": ["rgba(121,85,72,0.2)", "rgba(121,85,72,1)"],
    "spr": ["rgba(156,39,176,0.2)", "rgba(156,39,176,1)"],
    "aut": ["rgba(63,81,181,0.2)", "rgba(63,81,181,1)"],
    "win": ["rgba(139,195,74,0.2)", "rgba(139,195,74,1)"],
    "ann": ["rgba(255,87,34,0.2)", "rgba(255,87,34,1)"]
  };

  var labels = {"jan": "Jan", "feb": "Feb", "mar": "Mar", "apr": "Apr", "may": "May", "jun": "Jun", "jul": "Jul", "aug": "Aug", "sep": "Sep", "oct": "Oct", "nov": "Nov", "dec": "Dec", "sum": "Summer", "spr": "Spring", "aut": "Autumn", "win": "Winter", "ann": "Annual" };

  var stats = sortByKey($("#chart-container").data("stats"), "year");
  var keys = Object.keys(stats[0]);
  var data = {};
  for (var i = 0; i < keys.length; i++) {
    data[keys[i]] = stats.map(function (obj) {
      return obj[keys[i]]
    });
  }
  for (var key in data.year)
    $("#year_range").append($("<option>" + data.year[key] + "</option>"));
  var SIZE = data.year.length;
  var lower_limit = 0, upper_limit = SIZE, mid_limit = upper_limit / 2;

  var datasets = {
    "annual": [generate_dataset("ann")],
    "months": [generate_dataset("jan"), generate_dataset("feb"), generate_dataset("mar"), generate_dataset("apr"), generate_dataset("may"), generate_dataset("jun"), generate_dataset("jul"), generate_dataset("aug"), generate_dataset("sep"), generate_dataset("oct"), generate_dataset("nov"), generate_dataset("dec")],
    "seasons": [generate_dataset("sum"), generate_dataset("spr"), generate_dataset("aut"), generate_dataset("win")]
  }

  var active_dataset = "annual";

  var ctx = $("#chart");
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.year.slice(lower_limit, upper_limit),
      datasets: datasets[active_dataset]
    },
    options: { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }
  });

  $("#category").on('changed.bs.select', function(e) {
    active_dataset = $(this)[0].value;
    update_chart();
  });

  $("#year_range").on('changed.bs.select', function(e) {
    var options = $(this)[0].selectedOptions;
    if (options.length == 1) {
      if (options[0].index > mid_limit) {
        lower_limit = options[0].index;
        upper_limit = SIZE;
      } else {
        lower_limit = 0;
        upper_limit = options[0].index + 1;
      }
    } else if (options.length == 2) {
      lower_limit = options[0].index;
      upper_limit = options[1].index;
    } else {
      lower_limit = 0;
      upper_limit = SIZE;
    }
    update_chart();
  });

  function update_chart() {
    myChart.data.labels = data.year.slice(lower_limit, upper_limit);
    var dts_clone = $.extend(true, {}, datasets);
    var dts = dts_clone[active_dataset].slice(0);
    myChart.data.datasets = dts.map(function(obj) {
      obj.data = obj.data.slice(lower_limit, upper_limit);
      return obj;
    });
    myChart.update();
  }

  function generate_dataset(name) {
    return {
      label: labels[name],
      data: data[name].slice(lower_limit, upper_limit),
      backgroundColor: colors[name][0],
        borderColor: colors[name][1],
        borderWidth: 1,
        pointRadius: 0
    };
  }

  function sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  function ObjectLength( object ) {
    var length = 0;
    for( var key in object ) {
      if( object.hasOwnProperty(key) ) {
        ++length;
      }
    }
    return length;
  };

})(jQuery);
