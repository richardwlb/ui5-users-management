// @ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
        "sap/m/Dialog",
        "sap/m/Button",
        "sap/m/StandardListItem",
        "sap/m/List",
  	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, History, MessageToast, MessageBox, BusyIndicator, Dialog, Button, StandardListItem, List ) {
		"use strict";

		return Controller.extend("ns.HTML5Module.controller.Simulation", {
			onInit: function () {

                this._wizard = this.byId("CreateProductWizard");
                this._oNavContainer = this.byId("wizardNavContainer");
                this._oWizardContentPage = this.byId("wizardContentPage");

                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._oRouter.attachRouteMatched(this.handleRouteMatched, this);

            },

            handleRouteMatched: function (evt) {
                //Check whether is the detail page is matched.
                if (evt.getParameter("name") !== "RouteSimulation") { return;  }
                //You code here to run every time when your detail page is called.

                this.loadUsers();
                this.loadRoles();
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

            onNavBackSimulation: function(){
                this._oNavContainer.to(this.byId("wizardContentPage"));
            },

            loadUsers: function() {
                var oModel = new sap.ui.model.json.JSONModel();

                $.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "https://richard-zuser-roles.herokuapp.com/users",
                    dataType: "json",
                    async: false,
                    success: function(data, textStatus, jqXHR) {
                        oModel.setData(data);
                    }
                });

                this._oModel = oModel; 
                this.getView().setModel(oModel, "oModelUsers");

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
                    }
                });

                this._oModel = oModel; 
                this.getView().setModel(oModel, "oModelRoles");

            },

            wizardCompletedHandler: function() {

                this._oNavContainer.to(this.byId("wizardReviewPage"));

                const userSelected = this.getView().byId("userSelect").getSelectedKey();
                const roleSelected = this.getView().byId("roleSelect").getSelectedKey();
                const systemselected = this.getView().byId("systemSelect").getSelectedKey();

                this.getView().byId("userSelected").setText(userSelected);
                this.getView().byId("roleSelected").setText(roleSelected);
                this.getView().byId("systemSelected").setText(systemselected);

            },

            _handleNavigationToStep: function (iStepNumber) {
                var fnAfterNavigate = function () {
                    this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                    this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);

                this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
                this.backToWizardContent();
            },

            backToWizardContent: function () {
                this._oNavContainer.backToPage(this._oWizardContentPage.getId());
            },

            editStepOne: function () {
                this._handleNavigationToStep(0);
            },

            editStepTwo: function () {
                this._handleNavigationToStep(1);
            },

            editStepThree: function () {
                this._handleNavigationToStep(2);
            },

            handleWizardSubmit: function() {
                BusyIndicator.show();

                setTimeout(() => {
                    BusyIndicator.hide();
                    this.onDialogWithSizePress();
                }, 5000);

            },

            onDialogWithSizePress: function () {
                if (!this.oFixedSizeDialog) {
                    this.oFixedSizeDialog = new Dialog({
                        title: "Simulation Status",
                        contentWidth: "550px",
                        contentHeight: "300px",
                        content: new List({
                            items: {
                                path: "simulation>/simulation",
                                template: new StandardListItem({
                                    title: "{simulation>title}",
                                    counter: "{simulation>counter}"
                                })
                            }
                        }),
                        endButton: new Button({
                            text: "Close",
                            press: function () {
                                this.oFixedSizeDialog.close();
                            }.bind(this)
                        })
                    });

                    //to get access to the controller's model
                    this.getView().addDependent(this.oFixedSizeDialog);
                }

                this.oFixedSizeDialog.open();
            },

		});
	});
