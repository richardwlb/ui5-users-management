// @ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/model/json/JSONModel",
        "sap/m/Dialog",
        "sap/m/DialogType",
        "sap/m/Button",
        "sap/m/ButtonType",
        "sap/m/Label",
        "sap/m/Text",
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, MessageToast, MessageBox, JSONModel
        , Dialog, DialogType, Button, ButtonType, Label, Text ) {
		"use strict";

		return Controller.extend("ns.HTML5Module.controller.DetailsRole", {
			onInit: function () {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteDetailsRole").attachMatched(this._onRouteMatched, this);
                
                console.log(" => DetailsRole", oRouter)

            },

            // Função para pegar o valor que vem por parametro
            _onRouteMatched : function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                this._idRole = oArgs.id;

                console.log("*** idRole: ",this._idRole )

                var oModel = new JSONModel("https://richard-zuser-roles.herokuapp.com/roles/"+oArgs.id+"");
                this._oModel = oModel; 
                this.getView().setModel(oModel);
            },

            onNavBack: function(){
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteListRoles");
            },

            saveRole: function() {
                const roleName = this.getView().byId("role_name").getValue();
                const tcode = this.getView().byId("tcode").getValue();
                const functions = this.getView().byId("functions").getValue();

                if( roleName === '' || tcode === ''){
                    MessageBox.error("Pleas, fill all the fields.");
                } else {
                    $.ajax({
                        url: "https://richard-zuser-roles.herokuapp.com/roles",
                        type: "PUT",
                        data: JSON.stringify({
                            "id": parseInt(this._idRole),
                            "role_name": roleName, 
                            "tcode": tcode,
                            "functions": functions,
                        }),
                        contentType: 'application/json',
                        dataType: "JSON",
                        success: function(data){
                            MessageBox.success("success");
                        },
                        error: function(e){
                            MessageBox.error("error: "+e);
                        }
                    });
                }
            },
		});
	});
