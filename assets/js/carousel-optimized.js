(function($, undefined){
  /*
   * Detect resolution
   */
  if ($('#projects').css('height') < '400px'){
    return;
  }

  /*
   * Checking if cover is loaded
   */
  function isCoverLoaded($el){
    return $el && $el.css('background-image') !== 'none';
  }

  /*
   * Item loading function
   */
  function loadCover($el){
    $el.css('background-image', 'url('+$el.data('cover')+')');
  }

  function loadFirstCover(){
    loadCover($('#projects .item.active'));
  }

  /*
   * Load on scroll
   */
  $(window).height() + 200 >= $('#projects').offset().top
    ? loadFirstCover()
    : $(window).one('scroll', loadFirstCover);

  /*
   * Load on event
   */
  $('#projects').on('slide', function(e){
    if (e.relatedTarget === undefined){
      return;
    }

    loadCover($(e.relatedTarget));
  });
})(jQuery);