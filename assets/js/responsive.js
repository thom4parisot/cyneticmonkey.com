(function($, undefined){
  $('body').on('click', '.content .span4', function(){
    $(this).toggleClass('active');
  });
})(jQuery);