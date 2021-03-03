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

		return Controller.extend("ns.HTML5Module.controller.ListUsers", {
			onInit: function () {

                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._oRouter.attachRouteMatched(this.handleRouteMatched, this);

            },

            handleRouteMatched: function (evt) {
                //Check whether is the detail page is matched.
                console.log('Executando', evt.getParameter("name"))
                if (evt.getParameter("name") !== "RouteListUsers") {
                    return;
                }
                //You code here to run every time when your detail page is called.
                BusyIndicator.show();
                this.loadUsers();
            },

            loadUsers: function() {
                // BusyIndicator.show();

                var oModel = new sap.ui.model.json.JSONModel();

                $.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "https://richard-zuser-roles.herokuapp.com/users",
                    dataType: "json",
                    async: false,
                    success: function(data, textStatus, jqXHR) {
                        oModel.setData(data);
                        BusyIndicator.hide();
                    }
                });

                this._oModel = oModel; 
                this.getView().setModel(oModel);

                // console.log('_oModel: ', this._oModel);

            },

            onNavBack: function(){
                // var oHistory = History.getInstance();
                // var sPreviousHash = oHistory.getPreviousHash();

                // if(sPreviousHash !== undefined){
                //     window.history.go(-1);
                // } else { 
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteMain");
                // }
            },

            onSearch: function(oEvent){
		
                var nameSearch = this.getView().byId("inputName").getValue();
                var sUrl =  "https://richard-zuser-roles.herokuapp.com/users?name="+nameSearch+"";
                
                this._oModel.loadData(sUrl);	
            },

            goToDetailsUser: function(oEvent){
			
                var idUser = oEvent.getSource().getBindingContext().getProperty("id");
                // console.log('idUser',idUser);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteDetailsUser", { 
                        id : idUser 
                    } 
                );
            }

		});
	});
