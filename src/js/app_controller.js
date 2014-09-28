/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var GlobalMenu = require('global_menu');
  var MathProblem = require('math_problem');
  var AppView = require('app_view');

  require('jquery.transit');

  function AppController() {
    this.problem = new MathProblem();
    this.globalMenu = new GlobalMenu(this);

    this.appView = new AppView();
    this.appView.listenTo(this.problem, 'change:position', this.appView.positionCallback);
    this.globalMenu.listenTo(this.problem, 'change:position', this.globalMenu.positionCallback);
  }

  return AppController;
});
