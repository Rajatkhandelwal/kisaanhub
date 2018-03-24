(function ($) {

  // region is defined ['UK', 'England', 'Wales', 'Scotland']
  // data_type is defined ['Max Temp', 'Min Temp', 'Mean Temp', 'Sunshine', 'Rainfall']
  
  // for the region and data_type dropdown in the header
  $('ul.nav li.dropdown').hover(function () {
    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
  }, function () {
    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
  });
  var ac_region = $("#ac_region").data("region").toLowerCase();
  var ac_data_type = $("#ac_data_type").data("type").toLowerCase().replace(/ /g, "_");
  
  // rendering the template for region selected
  $('#regions .r').on('click', function (e) {
    e.preventDefault();
    ac_region = ($(this)[0].innerText).toLowerCase();
    window.location.replace("/" + ac_region + "/" + ac_data_type);
  });

  // rendering the template for a data_type selected
  $('#data_type .d').on('click', function (e) {
    e.preventDefault();
    ac_data_type = ($(this)[0].innerText).toLowerCase().replace(/ /g, "_");
    window.location.replace("/" + ac_region + "/" + ac_data_type);
  });

  // Defining particular colors for each dataset.
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

  // defining axis labels
  var labels = {"jan": "Jan", "feb": "Feb", "mar": "Mar", "apr": "Apr", "may": "May", "jun": "Jun", "jul": "Jul", "aug": "Aug", "sep": "Sep", "oct": "Oct", "nov": "Nov", "dec": "Dec", "sum": "Summer", "spr": "Spring", "aut": "Autumn", "win": "Winter", "ann": "Annual" };

  // fetching the stats data received from the backend for a region and data_type
  var stats = sortByKey($("#chart-container").data("stats"), "year");
  
  if (stats.length > 0) {
    $("#chart-container").removeClass("hidden");
    $("#empty-container").addClass("hidden");

    // Creating an array of keys. For eg. ['jan', 'feb', 'mar'...]
    var keys = Object.keys(stats[0]);
    // categorizing stats data with generated keys. Values for those keys are array of values for those keys in the stats.
    // For eg. {"year": ["1910","1911"...], "jan": ["1.2", "1.44"...], ....}
    var data = {};
    for (var i = 0; i < keys.length; i++) {
      data[keys[i]] = stats.map(function (obj) {
        return obj[keys[i]]
      });
    }

    // populating the years in the select dropdown
    for (var key in data.year)
      $("#year_range").append($("<option>" + data.year[key] + "</option>"));

    // This gives us the length of data points in a dataset
    var SIZE = data.year.length;

    // lower_limit - decides the lower limit of data points that will be rendered
    // upper_limit - decides the upper limit of data points that will be rendered
    // mid_limit - gives the mid point of those limits
    var lower_limit = 0, upper_limit = SIZE, mid_limit = upper_limit / 2;

    // calculating all the datasets and categorizing them by "annual", "months", "seasons"
    var datasets = {
      "annual": [generate_dataset("ann")],
      "months": [generate_dataset("jan"), generate_dataset("feb"), generate_dataset("mar"), generate_dataset("apr"), generate_dataset("may"), generate_dataset("jun"), generate_dataset("jul"), generate_dataset("aug"), generate_dataset("sep"), generate_dataset("oct"), generate_dataset("nov"), generate_dataset("dec")],
      "seasons": [generate_dataset("sum"), generate_dataset("spr"), generate_dataset("aut"), generate_dataset("win")]
    }

    // the variable store the active datasets which is currently being rendered
    // keeping it annual by default
    var active_dataset = "annual";

    // declaring a chart from Chart.js library
    var ctx = $("#chart");
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.year.slice(lower_limit, upper_limit), // initialzing the labels
        datasets: datasets[active_dataset] // initializing the datasets
      },
      options: { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }
    });
  } else {
    $("#chart-container").addClass("hidden");
    $("#empty-container").removeClass("hidden");
  }

  // on category change from select dropdown the chart is updated for selected category
  $("#category").on('changed.bs.select', function(e) {
    active_dataset = $(this)[0].value;
    update_chart();
  });

  // on selecting a range from the year dropdown the lower and upper limits are updated and the chart is updated
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

  // resyncing data from metoffice
  $(".btn-resync").on('click', function(e) {
    $.ajax({
      type: 'POST',
      url: '/resync_data',
      data: {
        data_type: ac_data_type,
        region: ac_region
      },
      success: function(data){
        console.log(data);
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  // helper function to update the chart rendered
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

  // helper methos used to generate a dataset for any data point argument
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

  // helper method to an object by a particular key
  function sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  // helper method to calculate the number of properties in an object
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
