// @ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/m/MessageToast",
        "sap/m/MessageBox"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, History, MessageToast, MessageBox) {
		"use strict";

		return Controller.extend("ns.HTML5Module.controller.NewUser", {
			onInit: function () {

            },

            onNavBack: function(){
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if(sPreviousHash !== undefined){
                    window.history.go(-1);
                } else { 
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteMain");
                }
            },

            addUser: function() {
                const userName = this.getView().byId("user_name").getValue();
                const name = this.getView().byId("name").getValue();

                if( userName === '' || name === ''){
                    MessageBox.error("Pleas, fill all the fields.");
                } else {
                    $.ajax({
                        url: "https://richard-zuser-roles.herokuapp.com/users",
                        type: 'POST',
                        data: JSON.stringify({
                            "user_name": userName, 
                            "name": name
                        }),
                        contentType: 'application/json',
                        dataType: "json",
                        async: "false",
                        processData: false,
                        success: function(data){
                            MessageBox.success("success");
                        },
                        error: function(e){
                            MessageBox.error("error: "+e);
                        }
                    });

                }
            }
		});
	});
