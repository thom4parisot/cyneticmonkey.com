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

(document.querySelector ? function(document, undefined){
  var affix = (function(tag){
    var el, origOffsetY, origMaxOffsetY, prevOffset;

    el = document.querySelector(tag);

    if (!el){
      return function noop(){};
    }

    origOffsetY = el.offsetTop;
    origMaxOffsetY = el.parentNode.offsetTop + el.parentNode.clientHeight;
    prevOffset = origOffsetY;

    return function affix(e) {
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
        el.setAttribute('data-offset-sticky', el.offsetTop);
        el.style.top = (origMaxOffsetY - el.clientHeight)+'px';
        el.style.position = 'absolute';
      }
      else if(isSticky && el.style.top && window.pageYOffset < (el.offsetTop - el.getAttribute('data-offset-sticky'))){
        el.style.top = el.style.position = null;
      }
    };
  })('aside');

  var toggleCollapse = function(e){
    e.preventDefault();

    var target = document.querySelector(this.getAttribute('data-target') || '.nav-collapse');

    target.classList && target.classList.toggle('in');
  };

  var imgLazyLoading = (function(treshold){
    var els = document.querySelectorAll('img[data-src]');
    var img = Array.prototype.slice.call(els);
    treshold = treshold || 200;

    function lazyLoadImage(el){
      el.src = el.getAttribute('data-src');
      el.removeAttribute('data-src');
    }

    return function imgLazyLoading(){
      var initialLength = img.length;

      if (!initialLength){
        return false;
      }

      var top = window.pageYOffset || window.scrollY;
      var height = window.screen.height;

      img = img.filter(function(el){
        var pos = el.getBoundingClientRect().top || 0;

        if (pos >= 0 && pos <= top+height){
          lazyLoadImage(el);
        }
        // keep it for later
        else{
          return el;
        }
      });

      return initialLength !== img.length;
    };
  })();

  /**
   * Auto-selects the navigation page
   * It combines contents/[content].json#id key and contents/shared.json#navigation key
   *
   * @todo move than in a Mustache or handlebars method
   */
  function autoSelectNavigationPage(){
    var page_id, pageContainer = document.querySelector('[data-navigation-id]');

    page_id = pageContainer && pageContainer.getAttribute('data-navigation-id');
    if (!page_id){
      return false;
    }

    document.querySelector('[data-page-id="'+page_id+'"]').classList.add('active');
  }

  /**
   * @this Element
   */
  var heightAdjuster = function(el){
    var source = Array.prototype.slice.call(el.querySelectorAll(el.getAttribute('data-source')));
    var target = Array.prototype.slice.call(el.querySelectorAll(el.getAttribute('data-target')));
    var length = el.getAttribute('data-vertical-resize');

    // if we have one element, we just don't care
    while (source.length > 1){
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
        var height = el.scrollHeight;

        if (height > maxHeight){
          maxHeight = height + (el.style.paddingTop || 0) + (el.style.paddingBottom || 0);
        }
      });

      return maxHeight;
    }
  };

  var autoAdjustHeight = (function(){
    var els = document.querySelectorAll('[data-vertical-resize][data-target]');

    return function autoAdjustHeight(){
      Array.prototype.slice.call(els).map(heightAdjuster);
    };
  })();

  /**
   * Default animation loop to deal with regular rendering
   */
  var animLoop = function animLoop(){
    requestAnimFrame(animLoop);

    affix();
    if (imgLazyLoading()){
      autoAdjustHeight();
    }
  };

  /**
   * OnLoad stuff
   */
  autoSelectNavigationPage();
  document.addEventListener('click', function collapseDelegator(e){
    if (e.target && e.target.getAttribute('data-toggle') === 'collapse'){
      toggleCollapse.call(e.target, e);
    }
  });

  requestAnimFrame(function onLoadRendering(){
    autoAdjustHeight();

    // Starting animation loop after first rendering
    animLoop();
  });
} : function(){})(document);
