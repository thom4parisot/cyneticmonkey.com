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

      window.scrollY >= origOffsetY ? el.classList.add('sticky') :
        el.classList.remove('sticky');

      if (!el.style.top && globalOffsetHeight > origMaxOffsetY){
        el.dataset.offsetSticky = el.offsetTop;
        el.style.top = (origMaxOffsetY - el.clientHeight)+'px';
        el.style.position = 'absolute';
      }
      else if(el.style.top && window.pageYOffset < (el.offsetTop - el.dataset.offsetSticky)){
        el.style.top = el.style.position = null;
      }
    };
  })('aside');

  var toggleCollapse = function(){
    var target = document.querySelector(this.dataset.target || '.nav-collapse');

    target.classList && target.classList.toggle('in');
  };

  if (document.querySelector && document.addEventListener){
    document.addEventListener('scroll', onScroll);
    document.querySelector('#services [data-toggle="collapse"]').addEventListener('click', toggleCollapse);
  }
})(document);
