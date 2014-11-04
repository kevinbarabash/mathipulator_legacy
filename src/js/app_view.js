/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var Backbone = require('backbone');
  var MathProblem = require('math_problem');
  var MathView = require('view/math_view');
  var HistoryView = require('history_view');
  var GlobalMenu = require('global_menu');
  var ContextMenu = require('context_menu');
  var TransformList = require('model/transform_list');
  var ExpressionModel = require('model/expression_model');

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
      var input = $(e.target).val();

      var operator = input[0];
      var expr = ExpressionModel.fromASCII(input.substring(1));
      var model = this.problem.get('current');
      this.problem.push(model.modify(operator, expr));

      $(e.target).val('');
    }
  });
});
