/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var GlobalMenu = require('global_menu');
  var ContextMenu = require('context_menu');
  var MathCollection = require('math_collection');
  var AppView = require('app_view');

  require('jquery.transit');

  function AppController() {
    this.mathCollection = new MathCollection();
    this.globalMenu = new GlobalMenu(this);

    this.appView = new AppView();
    this.appView.listenTo(this.mathCollection, 'position', this.appView.positionCallback);
    this.globalMenu.listenTo(this.mathCollection, 'position', this.globalMenu.positionCallback);
  }

  return AppController;
});
