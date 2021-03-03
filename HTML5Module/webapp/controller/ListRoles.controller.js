// @ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, History, MessageToast, MessageBox, BusyIndicator) {
		"use strict";

		return Controller.extend("ns.HTML5Module.controller.ListRoles", {
			onInit: function () {

                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._oRouter.attachRouteMatched(this.handleRouteMatched, this);

            },

            handleRouteMatched: function (evt) {
                //Check whether is the detail page is matched.
                if (evt.getParameter("name") !== "RouteListRoles") {
                    return;
                }
                //You code here to run every time when your detail page is called.
                BusyIndicator.show();
                this.loadRoles();
            },

            loadRoles: function() {
                var oModel = new sap.ui.model.json.JSONModel();

                $.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "https://richard-zuser-roles.herokuapp.com/roles",
                    dataType: "json",
                    async: false,
                    success: function(data, textStatus, jqXHR) {
                        oModel.setData(data);
                        BusyIndicator.hide();
                    }
                });

                this._oModel = oModel; 
                this.getView().setModel(oModel);

                console.log('_oModel: ', this._oModel);

            },

            onNavBack: function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain");
            },

            goToDetailsRole: function(oEvent){
                var idRole = oEvent.getSource().getBindingContext().getProperty("id");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                console.log(" ** idRole",idRole);
                oRouter.navTo("RouteDetailsRole", { 
                        id : idRole 
                    } 
                );
            }

		});
	});
