// Generated by CoffeeScript 1.2.1-pre
(function() {
  var Queue, activate, add_class, anim_steps, deactivate, has_class, height, hover, padding, rm_class, svg, tooltip, tooltip_anim_Q, tooltip_font_size, tooltip_timeout, untooltip, width, _, __,
    __slice = [].slice;

  _ = function(x) {
    return document.querySelectorAll(x);
  };

  __ = function(x) {
    return document.getElementById(x);
  };

  padding = 5;

  tooltip_timeout = 0;

  tooltip_font_size = parseInt("{{ font_sizes.tooltip }}");

  anim_steps = parseInt("{{ animation_steps }}");

  Queue = (function() {

    Queue.name = 'Queue';

    function Queue(delay) {
      this.delay = delay;
      this.queue = [];
      this.running = false;
    }

    Queue.prototype.add = function() {
      var args, f;
      f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this.queue.push({
        f: f,
        a: args
      });
      if (!this.running) {
        this.running = true;
        return this._back();
      }
    };

    Queue.prototype._run = function(f) {
      var _this = this;
      if (!f) {
        return this.running = false;
      } else {
        return setTimeout((function() {
          f.f.apply(f, f.a);
          return _this._back();
        }), this.delay);
      }
    };

    Queue.prototype._back = function() {
      return this._run(this.queue.shift());
    };

    Queue.prototype.clear = function() {
      if (this.running) {
        this.queue = [];
        return this.running = false;
      }
    };

    return Queue;

  })();

  tooltip_anim_Q = new Queue(100);

  has_class = function(e, class_name) {
    var cls, cn, i, _i, _len;
    if (!e) return;
    cn = e.getAttribute('class').split(' ');
    for (i = _i = 0, _len = cn.length; _i < _len; i = ++_i) {
      cls = cn[i];
      if (cls === class_name) return true;
    }
    return false;
  };

  add_class = function(e, class_name) {
    var cn;
    if (!e) return;
    cn = e.getAttribute('class').split(' ');
    if (!has_class(e, class_name)) cn.push(class_name);
    return e.setAttribute('class', cn.join(' '));
  };

  rm_class = function(e, class_name) {
    var cls, cn, i, _i, _len;
    if (!e) return;
    cn = e.getAttribute('class').split(' ');
    for (i = _i = 0, _len = cn.length; _i < _len; i = ++_i) {
      cls = cn[i];
      if (cls === class_name) cn.splice(i, 1);
    }
    return e.setAttribute('class', cn.join(' '));
  };

  width = function(e) {
    return (e.getBBox() && e.getBBox().width) || e.offsetWidth;
  };

  height = function(e) {
    return (e.getBBox() && e.getBBox().height) || e.offsetHeight;
  };

  svg = function(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  };

  activate = function() {
    var element, elements, _i, _len, _results;
    elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _results = [];
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
      element = elements[_i];
      _results.push(add_class(element, 'active'));
    }
    return _results;
  };

  deactivate = function() {
    var element, elements, _i, _len, _results;
    elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _results = [];
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
      element = elements[_i];
      _results.push(rm_class(element, 'active'));
    }
    return _results;
  };

  Function.prototype.bind = function(scope) {
    var _fun;
    _fun = this;
    return function() {
      return _fun.apply(scope, arguments);
    };
  };

  hover = function(elts, over, out) {
    var elt, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = elts.length; _i < _len; _i++) {
      elt = elts[_i];
      elt.addEventListener('mouseover', over.bind(elt), false);
      _results.push(elt.addEventListener('mouseout', out.bind(elt), false));
    }
    return _results;
  };

  tooltip = function(elt) {
    var anim_x, anim_y, current_x, current_y, h, i, s, value, w, x, x_elt, x_step, y, y_elt, y_step, _i, _rect, _ref, _text, _tooltip;
    tooltip_anim_Q.clear();
    clearTimeout(tooltip_timeout);
    _tooltip = __('tooltip');
    _tooltip.setAttribute('display', 'inline');
    _text = _tooltip.getElementsByTagName('text')[0];
    _rect = _tooltip.getElementsByTagName('rect')[0];
    value = elt.nextElementSibling;
    _text.textContent = value.textContent;
    w = width(_text) + 2 * padding;
    h = height(_text) + 2 * padding;
    _rect.setAttribute('width', w);
    _rect.setAttribute('height', h);
    _text.setAttribute('x', padding);
    _text.setAttribute('y', padding + tooltip_font_size);
    x_elt = value.nextElementSibling;
    y_elt = x_elt.nextElementSibling;
    x = parseInt(x_elt.textContent);
    if (has_class(x_elt, 'centered')) x -= w / 2;
    y = parseInt(y_elt.textContent);
    if (has_class(y_elt, 'centered')) y -= h / 2;
    _ref = (function() {
      var _i, _len, _ref, _results;
      _ref = _tooltip.getAttribute('transform').replace('translate(', '').replace(')', '').split(' ');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push(parseInt(s));
      }
      return _results;
    })(), current_x = _ref[0], current_y = _ref[1];
    if (current_x === x && current_y === y) return;
    if (anim_steps) {
      x_step = (x - current_x) / (anim_steps + 1);
      y_step = (y - current_y) / (anim_steps + 1);
      anim_x = current_x;
      anim_y = current_y;
      for (i = _i = 0; 0 <= anim_steps ? _i <= anim_steps : _i >= anim_steps; i = 0 <= anim_steps ? ++_i : --_i) {
        anim_x += x_step;
        anim_y += y_step;
        tooltip_anim_Q.add((function(_x, _y) {
          return _tooltip.setAttribute('transform', "translate(" + _x + " " + _y + ")");
        }), anim_x, anim_y);
      }
      return tooltip_anim_Q.add(function() {
        return _tooltip.setAttribute('transform', "translate(" + x + " " + y + ")");
      });
    } else {
      return _tooltip.setAttribute('transform', "translate(" + x + " " + y + ")");
    }
  };

  untooltip = function() {
    return tooltip_timeout = setTimeout((function() {
      return __('tooltip').setAttribute('display', 'none');
    }), 1000);
  };

  this.svg_load = function() {
    var text, _i, _len, _ref;
    _ref = _('.text-overlay .series');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      text = _ref[_i];
      text.setAttribute('display', 'none');
    }
    hover(_('.reactive'), (function() {
      return activate(this);
    }), (function() {
      return deactivate(this);
    }));
    hover(_('.activate-serie'), (function() {
      var element, num, _j, _k, _len2, _len3, _ref2, _ref3, _results;
      num = this.id.replace('activate-serie-', '');
      _ref2 = _('.text-overlay .serie-' + num);
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        element = _ref2[_j];
        element.setAttribute('display', 'inline');
      }
      _ref3 = _('.serie-' + num + ' .reactive');
      _results = [];
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        element = _ref3[_k];
        _results.push(activate(element));
      }
      return _results;
    }), (function() {
      var element, num, _j, _k, _len2, _len3, _ref2, _ref3, _results;
      num = this.id.replace('activate-serie-', '');
      _ref2 = _('.text-overlay .serie-' + num);
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        element = _ref2[_j];
        element.setAttribute('display', 'none');
      }
      _ref3 = _('.serie-' + num + ' .reactive');
      _results = [];
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        element = _ref3[_k];
        _results.push(deactivate(element));
      }
      return _results;
    }));
    return hover(_('.tooltip-trigger'), (function() {
      return tooltip(this);
    }), (function() {
      return untooltip();
    }));
  };

}).call(this);
