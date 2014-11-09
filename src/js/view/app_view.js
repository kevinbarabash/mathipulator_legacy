/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var Backbone = require('backbone');

  // views
  var MathView = require('view/math_view');
  var HistoryView = require('view/history_view');

  // menus
  var GlobalMenu = require('menu/global_menu');
  var ContextMenu = require('menu/context_menu');

  // models
  var MathProblem = require('model/math_problem');
  var TransformList = require('model/transform_list');
  var ExpressionModel = require('model/expression_model');

  var modify = require('transform/modify');

  var $ = require('jquery');
  require('jquery.transit');

  return Backbone.View.extend({
    el: '.main',
    events: {
      'change #modifyTextField': 'modify'
    },

    initialize: function (options) {
      this.format = options.format;

      this.problem = new MathProblem();
      this.historyView = new HistoryView({
        format: this.format
      });

      this.globalMenu = new GlobalMenu({
        problem: this.problem,
        historyView: this.historyView
      });

      this.listenTo(this.problem, 'change:current', this.positionCallback);
      this.globalMenu.listenTo(this.problem, 'change:canUndo', this.globalMenu.canUndoChanged);
      this.globalMenu.listenTo(this.problem, 'change:canRedo', this.globalMenu.canRedoChanged);
      this.historyView.listenTo(this.problem.steps, 'add', this.historyView.modelAdded);

      this.historyView.hide();
    },

    positionCallback: function (problem, model) {
      if (this.view) {
        this.view.fadeOutAndRemove();
      }
      this.model = model;
      this.view = new MathView({
        model: model,
        options: { format: this.format }
      });

      this.listenTo(this.view.selection, 'change:mid', this.handleSelectionChange);
      this.view.render($('#fg'), true);
    },

    handleSelectionChange: function (selection, mid) {
      if (this.contextMenu) {
        this.contextMenu.remove();
      }
      if (mid) {
        var node = this.model.getNode(mid);
        var list = TransformList.filter(function (transform) {
          return transform.canTransform(node);
        });

        // TODO: add a delegate system should that app_view can tell math_view whether to
        // select a node or not
        if (list.length === 0) {
          return;
        }

        this.contextMenu = new ContextMenu({
          model: this.model,
          problem: this.problem,
          transformList: list,
          mid: mid
        });

        var selElem = this.view.elementForModelId(mid);
        var rect = selElem.getBoundingClientRect();
        var x = (rect.left + rect.right) / 2;
        var y = rect.top;
        var $el = this.contextMenu.render().$el;
        $(document.body).append($el);

        $el.css({
          left: x,
          top: y,
          position: 'absolute',
          transform: 'translate(-50%,-100%)',
          'text-align': 'center',
          margin: 0
        });
      }
    },

    modify: function (e) {
      var model, expr;
      var input = $(e.target).val();

      var operator = input[0];
      var selection = this.view.selection;

      if (selection.get('mid')) {
        var mid = selection.get('mid');
        model = this.problem.get('current');
        var clone = model.clone();
        var elem = clone.getNode(mid);

        if ('+-*/'.indexOf(operator) !== -1) {
          expr = ExpressionModel.fromASCII(input.substring(1));
          modify(elem, operator, expr.xml.firstElementChild);
          this.problem.push(clone);
        }
      } else {
        if ('+-*/'.indexOf(operator) !== -1) {
          expr = ExpressionModel.fromASCII(input.substring(1));
          model = this.problem.get('current');
          this.problem.push(model.modify(operator, expr));
        } else {
          model = ExpressionModel.fromASCII(input);
          this.problem.push(model);
        }

        var query = {
          math: input,
          style: this.format
        };
        var queryString = Object.keys(query).map(function (key) {
          return key + "=" + query[key];
        }).join("&");

        $('#permalink').attr({
          href: 'interactive.html?' + queryString
        }).css({
          'pointer-events': 'all',
          'font-size': '18px',
          'font-family': 'sans-serif'
        }).text('permalink');
      }

      $(e.target).val('');
    }
  });
});
