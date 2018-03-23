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

})(jQuery);
