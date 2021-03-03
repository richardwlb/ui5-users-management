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

		return Controller.extend("ns.HTML5Module.controller.DetailsUser", {
			onInit: function () {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("RouteDetailsUser").attachMatched(this._onRouteMatched, this);

            },

            // Função para pegar o valor que vem por parametro
            _onRouteMatched : function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                this._idUser = oArgs.id;

                // Load the user data
                var oModel = new JSONModel("https://richard-zuser-roles.herokuapp.com/users/"+oArgs.id+"");
                this._oModel = oModel; 
                this.getView().setModel(oModel);

                // Load the roles data
                var oModelRoles = new JSONModel("https://richard-zuser-roles.herokuapp.com/roles");
                // this._oModelRoles = oModelRoles; 
                this.getView().setModel(oModelRoles, "oModelRoles");

                // Load the role of the user
                var oModelRoleUser = new JSONModel("https://richard-zuser-roles.herokuapp.com/userroles/"+this._idUser+"");
                this._oModelRoleUser = oModelRoleUser; 
                this.getView().setModel(oModelRoleUser, "oModelRoleUser");

            },

            onNavBack: function(){
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteListUsers");
            },

            saveUser: function() {
                const userName = this.getView().byId("user_name").getValue();
                const name = this.getView().byId("name").getValue();
                const idRole = this.getView().byId("role").getSelectedKey();

                var idUserRole = this._oModelRoleUser.oData.id;

                $.ajax({
                    url: "https://richard-zuser-roles.herokuapp.com/userroles/",
                    type: "PUT",
                    data: JSON.stringify({
                        "id": parseInt(idUserRole),
                        "id_role": parseInt(idRole), 
                        "id_user": parseInt(this._idUser)
                    }),
                    contentType: 'application/json',
                    dataType: "JSON",
                    success: function(data){},
                    error: function(e){ MessageBox.error("error: "+e);  }
                });

                if( userName === '' || name === ''){
                    MessageBox.error("Pleas, fill all the fields.");
                } else {
                    $.ajax({
                        url: "https://richard-zuser-roles.herokuapp.com/users",
                        type: "PUT",
                        data: JSON.stringify({
                            "id": parseInt(this._idUser),
                            "user_name": userName, 
                            "name": name
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

            onApproveDialogPress: function () {
                if (!this.oApproveDialog) {
                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: new Text({ text: "Do you want to delete this user?" }),
                            beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Confirm",
                            press: function () {
                                // MessageToast.show("Submit pressed!");
                                this.deleteUser();
                                this.oApproveDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "Cancel",
                            press: function () {
                                this.oApproveDialog.close();
                            }.bind(this)
                        })
                    });
                }

                this.oApproveDialog.open();
            },  

            deleteUser: function() {
                    $.ajax({
                        url: "https://richard-zuser-roles.herokuapp.com/users/"+this._idUser+"",
                        type: "DELETE",
                        contentType: 'application/json',
                        dataType: "JSON",
                        success: function(){
                            MessageBox.success("success");
                            
                        },
                        error: function(e){
                            MessageBox.error("error: "+e);
                        }
                    });
                   this.onNavBack();
            },

		});
	});
