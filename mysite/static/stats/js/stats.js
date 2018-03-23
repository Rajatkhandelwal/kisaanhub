(function($) {

  $('ul.nav li.dropdown').hover(function() {
    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
  }, function() {
    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
  });

  var ac_region = $("#ac_region").data("region").toLowerCase();
  var ac_data_type = $("#ac_data_type").data("type").toLowerCase().replace(/ /g,"_");

  $('#regions .r').on('click', function (e) {
    e.preventDefault();
    ac_region = ($(this)[0].innerText).toLowerCase();
    window.location.replace("/" + ac_region + "/" + ac_data_type);
  });

  $('#data_type .d').on('click', function (e) {
    e.preventDefault();
    ac_data_type = ($(this)[0].innerText).toLowerCase().replace(/ /g,"_");
    window.location.replace("/" + ac_region + "/" + ac_data_type);
  });
  
  function sortByKey(array, key) {
    return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
  
  var stats = sortByKey($("#chart-container").data("stats"), "year");
  console.log(stats);
  var keys = Object.keys(stats[0]);
  console.log(keys);
  var data = {};
  for(var i = 0; i < keys.length; i++) {
    data[keys[i]] = stats.map(function(obj) {
      return obj[keys[i]]
    });
  }
  console.log(data);
  
  var ctx = $("#chart");
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: data.year.slice(0, 10),
        datasets: [{
            label: 'Jan',
            data: data.jan.slice(0, 10),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
            pointRadius: 0
        }, {
            label: 'Feb',
            data: data.feb.slice(0, 10),
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

})(jQuery);
