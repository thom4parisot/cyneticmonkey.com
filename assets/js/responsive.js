(function($, undefined){
  $('body').on('click touchstart', '.content .span4', function(){
    $(this).toggleClass('active');
  });
})(jQuery);