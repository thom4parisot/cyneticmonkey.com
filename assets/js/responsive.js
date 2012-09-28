(function($, undefined){
  $('body').on('click touchstart', '.content [class^="span"]', function(){
    $(this).toggleClass('active');
  });
})(jQuery);