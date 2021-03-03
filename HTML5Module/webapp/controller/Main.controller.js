// @ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent",
        "sap/ui/core/BusyIndicator"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, UIComponent, BusyIndicator) {
		"use strict";

		return Controller.extend("ns.HTML5Module.controller.Main", {
			onInit: function () {
                this._oRouter = UIComponent.getRouterFor(this);
            },

            goToNewUser: function() {
                this._oRouter.navTo("RouteNewUser");
            },

            goToListUsers: function() {
                this._oRouter.navTo("RouteListUsers");
            },

            goToListRoles: function() {
                this._oRouter.navTo("RouteListRoles");
            },

            goToSimulation: function() {
                this._oRouter.navTo("RouteSimulation");
            },
		});
	});
