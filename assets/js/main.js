// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
})();

(function(document, undefined){
  var onScroll = (function(tag){
    var el, origOffsetY, origMaxOffsetY, prevOffset;

    el = document.querySelector(tag);

    if (!el){
      return function noop(){};
    }

    origOffsetY = el.offsetTop;
    origMaxOffsetY = el.parentNode.offsetTop + el.parentNode.clientHeight;
    prevOffset = origOffsetY;

    return function onScroll(e) {
      var globalOffsetHeight = window.pageYOffset + el.clientHeight + el.offsetTop;
      var isSticky;

      // No need to render position if nothing changed since last frame
      if (prevOffset === globalOffsetHeight){
        return;
      }

      window.scrollY >= origOffsetY ? el.classList.add('sticky') : el.classList.remove('sticky');
      isSticky = el.classList.contains('sticky');
      prevOffset = globalOffsetHeight;

      if (isSticky && !el.style.top && globalOffsetHeight > origMaxOffsetY){
        el.dataset.offsetSticky = el.offsetTop;
        el.style.top = (origMaxOffsetY - el.clientHeight)+'px';
        el.style.position = 'absolute';
      }
      else if(isSticky && el.style.top && window.pageYOffset < (el.offsetTop - el.dataset.offsetSticky)){
        el.style.top = el.style.position = null;
      }
    };
  })('aside');

  var toggleCollapse = function(e){
    e.preventDefault();

    var target = document.querySelector(this.dataset.target || '.nav-collapse');

    target.classList && target.classList.toggle('in');
  };

  /**
   * @this Element
   */
  var heightAdjuster = function(el){
    var source = Array.prototype.slice.call(el.querySelectorAll(el.dataset.source));
    var target = Array.prototype.slice.call(el.querySelectorAll(el.dataset.target));
    var length = el.dataset.verticalResize;

    while (source.length){
      adjustHeightFor(target.splice(0, length), source.splice(0, length));
    }

    function adjustHeightFor(targets, source){
      var maxHeight = getMaxHeight(source);

      targets.forEach(function(el){
        el.style.height = maxHeight+'px';
      });
    }

    function getMaxHeight(elements){
      var maxHeight = 0;

      Array.prototype.forEach.call(elements, function(el){
        if (el.clientHeight > maxHeight){
          maxHeight = el.clientHeight + (el.style.paddingTop || 0) + (el.style.paddingBottom || 0);
        }
      });

      return maxHeight;
    }
  };

  /**
   * Default animation loop to deal with regular rendering
   */
  var animLoop = function animLoop(){
    requestAnimFrame(animLoop);

    onScroll();
  };

  /**
   * OnLoad stuff
   */
  if (document.querySelector && document.addEventListener){
    document.addEventListener('click', function collapseDelegator(e){
      if (e.target && e.target.getAttribute('data-toggle') === 'collapse'){
        toggleCollapse.call(e.target, e);
      }
    });

    requestAnimFrame(function onLoadRendering(){
      var els = document.querySelectorAll('[data-vertical-resize][data-target]');

      Array.prototype.slice.call(els).map(heightAdjuster);

      // Initializing scroll stuff
      onScroll();

      // Starting animation loop after first rendering
      animLoop();
    });
  }
})(document);
