(function(document, undefined){
  var onScroll = (function(tag){
    var el, origOffsetY, origMaxOffsetY, noop = function(){};

    el = document.querySelector(tag);

    if (!el){
      return noop;
    }

    origOffsetY = el.offsetTop;
    origMaxOffsetY = el.parentNode.offsetTop + el.parentNode.clientHeight;

    return function onScroll(e) {
      var globalOffsetHeight = window.pageYOffset + el.clientHeight + el.offsetTop;
      var isSticky;

      window.scrollY >= origOffsetY ? el.classList.add('sticky') : el.classList.remove('sticky');
      isSticky = el.classList.contains('sticky');

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

  if (document.querySelector && document.addEventListener){
    document.addEventListener('scroll', onScroll);
    document.addEventListener('click', function collapseDelegator(e){
      if (e.target && e.target.getAttribute('data-toggle') === 'collapse'){
        toggleCollapse.call(e.target, e);
      }
    });

    window.addEventListener('load', function(){
      Array.prototype.slice.call(document.querySelectorAll('[data-vertical-resize][data-target]')).map(heightAdjuster);
    });
  }
})(document);
