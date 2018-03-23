(function($) {

  $(".btn-w").on('click', function(e) {
    e.preventDefault();
    window.location.replace("/"+$(this).data('region').toLowerCase()+"/"+$(this).data('type').toLowerCase().replace(/ /g,"_"));
  });

})(jQuery);
