/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var Backbone = require('backbone');
  var MathProblem = require('math_problem');
  var MathView = require('view/math_view');
  var GlobalMenu = require('global_menu');
  var ContextMenu = require('context_menu');
  var TransformList = require('model/transform_list');

  var $ = require('jquery');
  require('jquery.transit');

  return Backbone.View.extend({

    initialize: function () {
      this.problem = new MathProblem();
      this.globalMenu = new GlobalMenu({
        problem: this.problem
      });

      this.listenTo(this.problem, 'change:current', this.positionCallback);

      this.globalMenu.listenTo(this.problem, 'change:canUndo', this.globalMenu.canUndoChanged);
      this.globalMenu.listenTo(this.problem, 'change:canRedo', this.globalMenu.canRedoChanged);
    },

    positionCallback: function (problem, model) {
      if (this.view) {
        this.view.fadeOutAndRemove();
      }
      this.model = model;
      this.view = new MathView({
        model: model,
        options: { format: 'arithmetic' }
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

        this.contextMenu = new ContextMenu({
          model: this.model,
          problem: this.problem,
          transformList: list,
          mid: mid
        });

        var $el = this.contextMenu.render().$el;
        $('#context-menu').append($el);
      }
    }
  });
});
