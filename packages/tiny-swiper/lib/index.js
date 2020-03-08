(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Swiper = factory());
}(this, (function () { 'use strict';

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  var defaultOptions = {
    // `isHorizontal` is computed value
    direction: 'horizontal',
    touchRatio: 1,
    touchAngle: 45,
    longSwipesRatio: 0.5,
    initialSlide: 0,
    loop: false,
    freeMode: false,
    mousewheel: false,
    pagination: false,
    passiveListeners: true,
    resistance: true,
    resistanceRatio: 0.85,
    speed: 300,
    longSwipesMs: 300,
    intermittent: 0,
    spaceBetween: 0,
    slidesPerView: 1,
    centeredSlides: false,
    slidePrevClass: 'swiper-slide-prev',
    slideNextClass: 'swiper-slide-next',
    slideActiveClass: 'swiper-slide-active',
    slideClass: 'swiper-slide',
    wrapperClass: 'swiper-wrapper',
    touchStartPreventDefault: true,
    touchStartForcePreventDefault: false,
    touchMoveStopPropagation: false,
    excludeElements: []
  };
  function optionFormatter(userOptions) {
    var options = _extends({}, defaultOptions, {}, userOptions);

    return _extends({}, options, {
      isHorizontal: options.direction === 'horizontal'
    });
  }

  function EventHub() {
    var hub = {};

    function on(evtName, cb) {
      if (!hub[evtName]) {
        hub[evtName] = [cb];
      } else {
        hub[evtName].push(cb);
      }
    }

    function off(evtName, cb) {
      if (hub[evtName]) {
        var index = hub[evtName].indexOf(cb); // eslint-disable-next-line @typescript-eslint/no-unused-expressions

        index > -1 && hub[evtName].splice(index, 1);
      }
    }

    function emit(evtName) {
      for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
      }

      if (hub[evtName]) {
        hub[evtName].forEach(function (cb) {
          return cb.apply(void 0, data);
        });
      }
    }

    function clear() {
      hub = {};
    }

    return {
      on: on,
      off: off,
      emit: emit,
      clear: clear
    };
  }

  var delta = 180 / Math.PI;
  function Vector(logs, index) {
    var trace = logs[index];
    var formerTrace = logs[index - 1];
    var diff = {
      x: trace.x - formerTrace.x,
      y: trace.y - formerTrace.y
    };
    var duration = trace.time - formerTrace.time;
    var velocityX = diff.x / duration;
    var velocityY = diff.y / duration;
    var angle = Math.atan2(Math.abs(diff.y), Math.abs(diff.x)) * delta;
    return _extends({}, diff, {
      angle: angle,
      velocityX: velocityX,
      velocityY: velocityY
    });
  }
  function Tracker() {
    var logs = [];

    function push(position) {
      logs.push(_extends({}, position, {
        time: Date.now()
      }));
    }

    function vector() {
      return Vector(logs, logs.length - 1);
    }

    function clear() {
      logs = [];
    }

    function getLogs() {
      return logs;
    }

    function getDuration() {
      var first = logs[0];
      var last = logs[logs.length - 1];
      return first ? last.time - first.time : 0;
    }

    function getOffset() {
      var first = logs[0];
      var last = logs[logs.length - 1];
      return first ? {
        x: last.x - first.x,
        y: last.y - first.y
      } : {
        x: 0,
        y: 0
      };
    }

    return {
      getDuration: getDuration,
      getOffset: getOffset,
      getLogs: getLogs,
      vector: vector,
      clear: clear,
      push: push
    };
  }

  function State() {
    var state = {
      tracker: Tracker(),
      index: 0,
      startTransform: 0,
      isStart: false,
      isScrolling: false,
      isTouching: false,
      transforms: 0,
      progress: 0
    };
    return state;
  }

  function addClass(el, list) {
    if (list === void 0) {
      list = [];
    }

    if (!Array.isArray(list)) list = [list];
    list.forEach(function (clz) {
      return !el.classList.contains(clz) && el.classList.add(clz);
    });
  }
  function removeClass(el, list) {
    if (list === void 0) {
      list = [];
    }

    if (!Array.isArray(list)) list = [list];
    list.forEach(function (clz) {
      return el.classList.contains(clz) && el.classList.remove(clz);
    });
  }
  function attachListener(el, evtName, handler, opts) {
    el.addEventListener(evtName, handler, opts);
  }
  function detachListener(el, evtName, handler) {
    el.removeEventListener(evtName, handler);
  }
  function setStyle(el, style, forceRender) {
    Object.keys(style).forEach(function (prop) {
      // TS7015: Element implicitly has an 'any' type because index expression is not of type 'number'.
      el.style[prop] = style[prop];
    }); // eslint-disable-next-line @typescript-eslint/no-unused-expressions

    forceRender && getComputedStyle(el);
  }
  function getTranslate(el, isHorizontal) {
    var matrix = getComputedStyle(el).transform.replace(/[a-z]|\(|\)|\s/g, '').split(',').map(parseFloat);
    var arr = [];

    if (matrix.length === 16) {
      arr = matrix.slice(12, 14);
    } else if (matrix.length === 6) {
      arr = matrix.slice(4, 6);
    }

    return arr[isHorizontal ? 0 : 1] || 0;
  }

  function Sensor(env, state, options, operations) {
    var formEls = ['INPUT', 'SELECT', 'OPTION', 'TEXTAREA', 'BUTTON', 'VIDEO'];
    var preheat = operations.preheat,
        move = operations.move,
        stop = operations.stop;
    var touchable = env.touchable;

    function getPosition(e) {
      var touch = touchable ? e.changedTouches[0] : e;
      return {
        x: touch.pageX,
        y: touch.pageY
      };
    }

    function onTouchStart(e) {
      var $wrapper = env.element.$wrapper;
      var shouldPreventDefault = options.touchStartPreventDefault && formEls.indexOf(e.target.nodeName) === -1 || options.touchStartForcePreventDefault;
      if (shouldPreventDefault && !options.passiveListeners) e.preventDefault();
      preheat(getPosition(e), getTranslate($wrapper, options.isHorizontal));
    }

    function onTouchMove(e) {
      if (options.touchMoveStopPropagation) e.stopPropagation();
      move(getPosition(e));
      state.isTouching && e.preventDefault();
    }

    function onTouchEnd(e) {
      onTouchMove(e);
      stop();
    }

    function attach() {
      var $el = env.element.$el;

      if (touchable) {
        attachListener($el, 'touchstart', onTouchStart, {
          passive: options.passiveListeners,
          capture: false
        });
        attachListener($el, 'touchmove', onTouchMove);
        attachListener($el, 'touchend', onTouchEnd);
        attachListener($el, 'touchcancel', onTouchEnd);
      } else {
        attachListener($el, 'mousedown', onTouchStart);
        attachListener(document, 'mousemove', onTouchMove);
        attachListener(document, 'mouseup', onTouchEnd);
      }
    }

    function detach() {
      var $el = env.element.$el;
      detachListener($el, 'touchstart', onTouchStart);
      detachListener($el, 'touchmove', onTouchMove);
      detachListener($el, 'touchend', onTouchEnd);
      detachListener($el, 'touchcancel', onTouchEnd);
      detachListener($el, 'mousedown', onTouchStart);
      detachListener(document, 'mousemove', onTouchMove);
      detachListener(document, 'mouseup', onTouchEnd);
    }

    return {
      attach: attach,
      detach: detach
    };
  }

  function Element(el, options) {
    var $el = typeof el === 'string' ? document.body.querySelector(el) : el;
    var $wrapper = $el.querySelector("." + options.wrapperClass);
    var $list = [].slice.call($el.getElementsByClassName(options.slideClass));
    return {
      $el: $el,
      $wrapper: $wrapper,
      $list: $list
    };
  }

  function Measure(options, element) {
    var $el = element.$el;
    var viewSize = options.isHorizontal ? $el.offsetWidth : $el.offsetHeight;
    var slideSize = (viewSize - Math.ceil(options.slidesPerView - 1) * options.spaceBetween) / options.slidesPerView;
    var boxSize = slideSize + options.spaceBetween;
    return {
      boxSize: boxSize,
      viewSize: viewSize,
      slideSize: slideSize
    };
  }

  function getExpand(options, element) {
    if (options.loop) {
      // return options.slidesPerView >= element.$list.length
      //     ? options.slidesPerView - element.$list.length + 1
      //     : 1
      return Math.ceil(options.slidesPerView);
    }

    return 0;
  }
  function Limitation(element, measure, options) {
    var $list = element.$list;
    var viewSize = measure.viewSize,
        slideSize = measure.slideSize,
        boxSize = measure.boxSize;
    var expand = getExpand(options);
    var buffer = expand * boxSize;
    var base = -buffer + (options.centeredSlides ? (viewSize - slideSize) / 2 : 0); // [min, max] usually equal to [-x, 0]

    var max = base;
    var min = options.spaceBetween + (options.loop ? slideSize : viewSize) + base - boxSize * $list.length;
    var minIndex = 0;
    var maxIndex = $list.length - (options.centeredSlides || options.loop ? 1 : Math.ceil(options.slidesPerView));
    var limitation = {
      max: max,
      min: min,
      base: base,
      expand: expand,
      buffer: buffer,
      minIndex: minIndex,
      maxIndex: maxIndex
    };
    return limitation;
  }

  function Env(el, options) {
    var env = {};

    function update() {
      var element = Element(el, options);
      var measure = Measure(options, element);
      var limitation = Limitation(element, measure, options);
      var touchable = Boolean('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 || window.DocumentTouch && document instanceof DocumentTouch);
      Object.assign(env, {
        touchable: touchable,
        element: element,
        measure: measure,
        limitation: limitation
      });
    }

    env.update = update;
    update();
    return env;
  }

  function Renderer(env, options) {
    var $leftExpandList = [];
    var $rightExpandList = [];

    function render(state, duration, cb, force) {
      var _env$element = env.element,
          $list = _env$element.$list,
          $wrapper = _env$element.$wrapper;
      var index = state.index;
      var wrapperStyle = {
        transition: state.isStart ? 'none' : "transform ease " + (duration === undefined ? options.speed : duration) + "ms",
        transform: options.isHorizontal ? "translate3d(" + state.transforms + "px, 0, 0)" : "translate3d(0, " + state.transforms + "px, 0)"
      };
      var $current = $list[index];
      var $prev = $list[index - 1];
      var $next = $list[index + 1];
      setStyle($wrapper, wrapperStyle);

      if (!state.isStart) {
        $list.forEach(function ($slide, i) {
          removeClass($slide, [options.slidePrevClass, options.slideNextClass, options.slideActiveClass]);

          if (i === index) {
            addClass($current, options.slideActiveClass);
          }

          if (i === index - 1) {
            addClass($prev, options.slidePrevClass);
          }

          if (i === index + 1) {
            addClass($next, options.slideNextClass);
          }
        });
      }

      force && getComputedStyle($wrapper).transform;
    }

    function appendExpandList() {
      if (!options.loop) return;
      var element = env.element,
          limitation = env.limitation;
      var $list = element.$list,
          $wrapper = element.$wrapper;
      var expand = limitation.expand;
      $leftExpandList = $list.slice(-expand).map(function ($slide) {
        return $slide.cloneNode(true);
      });
      $rightExpandList = $list.slice(0, expand).map(function ($slide) {
        return $slide.cloneNode(true);
      });
      $leftExpandList.forEach(function ($shadowSlide, index) {
        $wrapper.appendChild($rightExpandList[index]);
        $wrapper.insertBefore($leftExpandList[index], $list[0]);
      });
    }

    function destroyExpandList() {
      var expandList = $leftExpandList.splice(0, $leftExpandList.length).concat($rightExpandList.splice(0, $rightExpandList.length));
      expandList.forEach(function (item) {
        return env.element.$wrapper.removeChild(item);
      });
    }

    function updateDom() {
      destroyExpandList();
      appendExpandList();
    }

    function updateSize() {
      var _itemStyle;

      var element = env.element,
          measure = env.measure;
      var $list = element.$list,
          $wrapper = element.$wrapper;
      var wrapperStyle = {
        display: 'flex',
        willChange: 'transform',
        flexDirection: options.isHorizontal ? 'row' : 'column'
      };
      var itemStyle = (_itemStyle = {}, _itemStyle[options.isHorizontal ? 'width' : 'height'] = measure.slideSize + "px", _itemStyle[options.isHorizontal ? 'margin-right' : 'margin-bottom'] = options.spaceBetween + "px", _itemStyle);
      setStyle($wrapper, wrapperStyle);
      $list.slice().concat($leftExpandList, $rightExpandList).forEach(function ($slide) {
        return setStyle($slide, itemStyle);
      });
    }

    function init() {
      updateDom();
      updateSize();
    }

    function destroy() {
      var _env$element2 = env.element,
          $list = _env$element2.$list,
          $wrapper = _env$element2.$wrapper;
      var arr = ['display', 'will-change', 'flex-direction'];
      var itemProp = options.isHorizontal ? 'margin-right' : 'margin-bottom';
      arr.forEach(function (propertyName) {
        $wrapper.style.removeProperty(propertyName);
      });
      $list.forEach(function ($slide) {
        return $slide.style.removeProperty(itemProp);
      });
      destroyExpandList();
    }

    return {
      init: init,
      render: render,
      destroy: destroy,
      updateSize: updateSize
    };
  }

  function isExceedingLimits(velocity, transform, options, limitation) {
    return velocity > 0 && transform > limitation.max || velocity < 0 && transform < limitation.min;
  }
  /**
   * Get transform exceed value
   * Return zero if is not reached border.
   *
   * @param transform
   * @param options
   * @param limitation
   */

  function getExcess(transform, options, limitation) {
    var exceedLeft = transform - limitation.max;
    var exceedRight = transform - limitation.min;
    return exceedLeft > 0 ? exceedLeft : exceedRight < 0 ? exceedRight : 0;
  }
  function Operations(env, state, options, renderer, eventHub) {
    function update() {}

    function getOffsetSteps(offset) {
      var measure = env.measure;
      return Math.ceil(Math.abs(offset) / measure.boxSize - options.longSwipesRatio);
    }

    function render(duration, cb, force) {
      renderer.render(state, duration, cb, force);
    }

    function transform(trans) {
      var _env$limitation = env.limitation,
          min = _env$limitation.min,
          max = _env$limitation.max;
      var transRange = max - min + (options.loop ? env.measure.boxSize : 0);
      var len = transRange + 1;
      var progress;
      state.transforms = trans;

      if (options.loop) {
        progress = (max - trans) % len / transRange;
        state.progress = progress < 0 ? 1 + progress : progress > 1 ? progress - 1 : progress;
      } else {
        progress = (max - trans) / transRange;
        state.progress = progress < 0 ? 0 : progress > 1 ? 1 : progress;
      }

      eventHub.emit('scroll', _extends({}, state));
    }

    function slideTo(targetIndex, duration) {
      var measure = env.measure,
          limitation = env.limitation;
      var len = limitation.maxIndex - limitation.minIndex + 1;
      var computedIndex = options.loop ? (targetIndex % len + len) % len : targetIndex > limitation.maxIndex ? limitation.maxIndex : targetIndex < limitation.minIndex ? limitation.minIndex : targetIndex;
      var offset = -computedIndex * measure.boxSize + limitation.base;

      if (state.index === computedIndex && getOffsetSteps(offset - state.transforms) !== 0) {
        var excess = getExcess(state.transforms, options, limitation);
        transform(excess > 0 ? limitation.min - measure.boxSize + excess : limitation.max + measure.boxSize + excess);
        render(0, undefined, true);
        transform(offset);
      }

      state.index = computedIndex;
      transform(offset);
      eventHub.emit('before-slide', targetIndex, state);
      render(duration);
    }

    function scrollPixel(px) {
      var transforms = state.transforms;
      var measure = env.measure,
          limitation = env.limitation;
      var ratio = Number(px.toExponential().split('e')[1]);
      var expand = ratio <= 0 ? Math.pow(10, -(ratio - 1)) : 1;
      var newTransform = transforms; // For optimizing, do not calculate `px` if options.loop === true

      if (options.resistance && !options.loop) {
        if (px > 0 && transforms >= limitation.max) {
          px -= Math.pow(px * expand, options.resistanceRatio) / expand;
        } else if (px < 0 && transforms <= limitation.min) {
          px += Math.pow(-px * expand, options.resistanceRatio) / expand;
        }
      }

      newTransform += px;

      if (options.loop) {
        var vector = state.tracker.vector();
        var velocity = options.isHorizontal ? vector.velocityX : vector.velocityY;
        var excess = getExcess(transforms, options, limitation);

        if (excess && isExceedingLimits(velocity, transforms, options, limitation)) {
          newTransform = excess > 0 ? limitation.min - measure.boxSize + excess : limitation.max + measure.boxSize + excess;
        }
      }

      transform(newTransform);
    }

    function initStatus(startTransform) {
      if (startTransform === void 0) {
        startTransform = 0;
      }

      state.startTransform = startTransform;
      state.isStart = false;
      state.isScrolling = false;
      state.isTouching = false;
    }

    function initLayout(originTransform) {
      transform(originTransform);
    }

    function preheat(originPosition, originTransform) {
      var tracker = state.tracker;
      tracker.push(originPosition);
      initLayout(originTransform);
      initStatus(originTransform);
      state.isStart = true;
      render();
    }

    function move(position) {
      var tracker = state.tracker;
      var touchRatio = options.touchRatio,
          touchAngle = options.touchAngle,
          isHorizontal = options.isHorizontal;
      if (!state.isStart || state.isScrolling) return;
      tracker.push(position);
      var vector = tracker.vector();
      var displacement = tracker.getOffset(); // Ignore this move action if there is no displacement of screen touch point.
      // In case of minimal mouse move event. (Moving mouse extreme slowly will get the zero offset.)

      if (!displacement.x && !displacement.y) return;

      if (isHorizontal && vector.angle < touchAngle || !isHorizontal && 90 - vector.angle < touchAngle || state.isTouching) {
        var offset = vector[isHorizontal ? 'x' : 'y'] * touchRatio;
        state.isTouching = true;
        scrollPixel(offset);
        render();
      } else {
        state.isScrolling = true;
        tracker.clear();
      }
    }

    function stop() {
      var index = state.index,
          tracker = state.tracker;
      var measure = env.measure;
      var duration = tracker.getDuration();
      var trans = tracker.getOffset()[options.isHorizontal ? 'x' : 'y'];
      var jump = Math.ceil(Math.abs(trans) / measure.boxSize);
      var longSwipeIndex = getOffsetSteps(trans);
      state.isStart = false;

      if (duration > options.longSwipesMs) {
        slideTo(index + longSwipeIndex * (trans > 0 ? -1 : 1));
      } else {
        // short swipe
        slideTo(trans > 0 ? index - jump : index + jump);
      }

      tracker.clear();
      initStatus();
    }

    return {
      update: update,
      render: render,
      transform: transform,
      slideTo: slideTo,
      scrollPixel: scrollPixel,
      initStatus: initStatus,
      initLayout: initLayout,
      preheat: preheat,
      move: move,
      stop: stop
    };
  }

  var Swiper = function Swiper(el, userOptions) {
    var options = optionFormatter(userOptions);
    var eventHub = EventHub();
    var env = Env(el, options);
    var state = State();
    var renderer = Renderer(env, options);
    var operations = Operations(env, state, options, renderer, eventHub);
    var sensor = Sensor(env, state, options, operations);

    function destroy() {
      sensor.detach();
      renderer.destroy();
      eventHub.clear();
    }

    function updateSize() {
      env.update();
      operations.update();
      renderer.updateSize();
    }

    function update() {
      renderer.destroy();
      env.update();
      renderer.init();
      updateSize();
    }

    var on = eventHub.on,
        off = eventHub.off,
        emit = eventHub.emit;
    var slideTo = operations.slideTo;
    var instance = {
      env: env,
      state: state,
      options: options,
      on: on,
      off: off,
      update: update,
      destroy: destroy,
      slideTo: slideTo,
      updateSize: updateSize
    };

    function load() {
      (options.plugins || Swiper.plugins || []).forEach(function (plugin) {
        return plugin(instance, options);
      });
      emit('before-init', instance);
      renderer.init();
      sensor.attach();
      emit('after-init', instance);
      operations.slideTo(options.initialSlide || 0, 0);
    }

    load();
    return instance;
  };

  Swiper.use = function (plugins) {
    Swiper.plugins = plugins;
  };

  return Swiper;

})));
//# sourceMappingURL=index.js.map
