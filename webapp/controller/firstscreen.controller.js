sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/core/UIComponent",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, MessageToast, JSONModel, Fragment, Filter, UIComponent, FilterOperator) {
        "use strict";
        return Controller.extend("zppreservation.controller.firstscreen", {
            onInit: function () {
                //    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.getView().getModel("oTableDataModel").setProperty("/aTableData", []);
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "oFirstScreenStorageLocationModel");
                this.getOwnerComponent().getModel("oFirstScreenStorageLocationModel").setProperty("/aFirstScreenStorageLocationData", []);
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "oFirstScreenModel");
                this.getOwnerComponent().getModel("oFirstScreenModel").setProperty("/aFirstScreenData", []);
                UIComponent.getRouterFor(this).getRoute('firstscreen').attachPatternMatched(this.ScreenRefrashFunction, this);

            },


            ScreenRefrashFunction: function () {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var refr = oCommonModel.getProperty("/oRefresh");
                if (refr === true) {
                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", []);
                    this.getView().byId("idDate").setValue();
                    this.getView().byId("idDepart").setValue();
                    this.getView().byId("idToLoc").setValue();
                    this.getView().byId("idOrdNumber").setValue();
                    this.getView().byId("idReqDate").setValue();
                }


            },



            handleGet: function () {

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES")
                var Del_Date = this.getView().byId("idDate").getValue();
                var Department = this.getView().byId("idDepart").getValue();
                var OrderNumber = this.getView().byId("idOrdNumber").getValue();
                var ReqDate =   this.getView().byId("idReqDate").getValue();

                var ToLoc = this.getView().byId("idToLoc").getValue();
                var FromLoc = this.getView().byId("idFromLoc").getValue();
                var Dept = "";
                if (Department == "Cutting") {
                    Dept = "CF01";
                } else if (Department == "Sewing") {
                    Dept = "CS01";
                }
                else if (Department == "Door") {
                    Dept = "DR01";
                }
                else if (Department == "Event") {
                    Dept = "EV01";
                }
                else if (Department == "FR Seat Assembly") {
                    Dept = "FR01";
                }
                else if (Department == "FR Weld") {
                    Dept = "FW01";
                }
                else if (Department == "Head Rest") {
                    Dept = "HR01";
                }
                else if (Department == "Mattresses Cover") {
                    Dept = "MT01";
                }
                else if (Department == "Others") {
                    Dept = "OP01";
                }
                else if (Department == "Offline Riverting") {
                    Dept = "OR01";
                }
                else if (Department == "Pipe Bending") {
                    Dept = "PB01";
                }
                else if (Department == "RR Seat Assembly") {
                    Dept = "RR01";
                }


                else if (Department == "RR Weld") {
                    Dept = "RW01";
                }
                else if (Department == "SPD1") {
                    Dept = "SPD1";
                }
                else if (Department == "SWITCH PANEL") {
                    Dept = "SW01";
                }
                if (Dept === "" && Del_Date != "" && OrderNumber ==="")
                {
                    MessageBox.error("Please Fill Department or Order No.");
                }
                else if(ReqDate ===""){
                    MessageBox.error("Mandatory to fill Required Date");
                }
                else{
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please Wait"
                });
                oBusyDialog.open();

                var oFilter = new sap.ui.model.Filter("MfgOrderPlannedStartDate", "EQ", Del_Date)

                var oFilter1 = new sap.ui.model.Filter("ManufacturingOrderType", "EQ", Dept)
                var oFilter2 = new sap.ui.model.Filter("ComponentOrder", "EQ", OrderNumber)
              
                if (Dept != "" && OrderNumber != "") {
                    var aTableArr = [];
                    oModel.read("/ZRES_ORDER", {
                        filters: [oFilter1, oFilter2],
                        urlParameters: { "$top": "100000" },
                        success: function (oresponse) {
                            oresponse.results.map(function (items) {
                                var CurrentDate = new Date(items.MfgOrderPlannedStartDate)
                                var dt1 = Number(CurrentDate.getDate());
                                var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                                var mm1 = Number(CurrentDate.getMonth() + 1);
                                var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                                var CurrentDate1 = CurrentDate.getFullYear() + '-' + MM1 + '-' + DT1;
                                if (Number(items.Reservation) === 0) {
                                    var reservat = "";
                                }
                                else {
                                    var reservat = items.Reservation;
                                }
                                var obj = {
                                    //   "ToLoc": ToLoc,
                                    "ManufacturingOrderType": Dept,
                                    "MfgOrderPlannedStartDate": CurrentDate1,
                                    "ComponentOrder": items.ComponentOrder,
                                    "Product": items.Product,
                                    "ProductDescription": items.ProductDescription,
                                    "ProductManufacturerNumber": items.ProductManufacturerNumber,
                                    "MfgOrderPlannedTotalQty": items.MfgOrderPlannedTotalQty,
                                    "ReqQty": items.MfgOrderPlannedTotalQty,
                                    "OrderIsReleased": items.OrderIsReleased,
                                    "ProductionUnit": items.ProductionUnit,
                                    "Reservation": reservat,
                                }
                                aTableArr.push(obj);
                            })
                            this.getView().getModel('oTableDataModel').setProperty("/aTableData", aTableArr)
                            oBusyDialog.close();
                        }.bind(this)
                    })
                }
                else if (Dept === "" && OrderNumber != "" && Del_Date != "") {
                    var aTableArr = [];
                    oModel.read("/ZRES_ORDER", {
                        filters: [oFilter, oFilter2],
                        urlParameters: { "$top": "100000" },
                        success: function (oresponse) {
                            oresponse.results.map(function (items) {
                                var CurrentDate = new Date(items.MfgOrderPlannedStartDate)
                                var dt1 = Number(CurrentDate.getDate());
                                var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                                var mm1 = Number(CurrentDate.getMonth() + 1);
                                var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                                var CurrentDate1 = CurrentDate.getFullYear() + '-' + MM1 + '-' + DT1;
                                if (Number(items.Reservation) === 0) {
                                    var reservat = "";
                                }
                                else {
                                    var reservat = items.Reservation;
                                }
                                var obj = {
                                    //   "ToLoc": ToLoc,
                                    "ManufacturingOrderType": Dept,
                                    "MfgOrderPlannedStartDate": CurrentDate1,
                                    "ComponentOrder": items.ComponentOrder,
                                    "Product": items.Product,
                                    "ProductDescription": items.ProductDescription,
                                    "ProductManufacturerNumber": items.ProductManufacturerNumber,
                                    "MfgOrderPlannedTotalQty": items.MfgOrderPlannedTotalQty,
                                    "ReqQty": items.MfgOrderPlannedTotalQty,
                                    "ProductionUnit": items.ProductionUnit,
                                    "Reservation": reservat,
                                    "OrderIsReleased": items.OrderIsReleased,


                                }
                                aTableArr.push(obj);
                            })
                            this.getView().getModel('oTableDataModel').setProperty("/aTableData", aTableArr)
                            oBusyDialog.close();
                        }.bind(this)
                    })
                }
                else if (Dept != "" && OrderNumber === "" && Del_Date != "") {
                    var aTableArr = [];
                    oModel.read("/ZRES_ORDER", {
                        filters: [oFilter, oFilter1],
                        urlParameters: { "$top": "100000" },
                        success: function (oresponse) {
                            oresponse.results.map(function (items) {
                                var CurrentDate = new Date(items.MfgOrderPlannedStartDate)
                                var dt1 = Number(CurrentDate.getDate());
                                var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                                var mm1 = Number(CurrentDate.getMonth() + 1);
                                var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                                var CurrentDate1 = CurrentDate.getFullYear() + '-' + MM1 + '-' + DT1;

                                if (Number(items.Reservation) === 0) {
                                    var reservat = "";
                                }
                                else {
                                    var reservat = items.Reservation;
                                }

                                var obj = {
                                    //   "ToLoc": ToLoc,
                                    "ManufacturingOrderType": Dept,
                                    "MfgOrderPlannedStartDate": CurrentDate1,
                                    "ComponentOrder": items.ComponentOrder,
                                    "Product": items.Product,
                                    "ProductDescription": items.ProductDescription,
                                    "ProductManufacturerNumber": items.ProductManufacturerNumber,
                                    "MfgOrderPlannedTotalQty": items.MfgOrderPlannedTotalQty,
                                    "ReqQty": items.MfgOrderPlannedTotalQty,
                                    "ProductionUnit": items.ProductionUnit,
                                    "Reservation": reservat,
                                    "OrderIsReleased": items.OrderIsReleased,

                                }
                                aTableArr.push(obj);
                            })
                            this.getView().getModel('oTableDataModel').setProperty("/aTableData", aTableArr)
                            oBusyDialog.close();
                        }.bind(this)
                    })
                }
                else if (Dept === "" && OrderNumber != "" && Del_Date === "") {
                    var aTableArr = [];
                    oModel.read("/ZRES_ORDER", {
                        filters: [oFilter2],
                        urlParameters: { "$top": "100000" },
                        success: function (oresponse) {
                            oresponse.results.map(function (items) {
                                var CurrentDate = new Date(items.MfgOrderPlannedStartDate)
                                var dt1 = Number(CurrentDate.getDate());
                                var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                                var mm1 = Number(CurrentDate.getMonth() + 1);
                                var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                                var CurrentDate1 = CurrentDate.getFullYear() + '-' + MM1 + '-' + DT1;
                                if (Number(items.Reservation) === 0) {
                                    var reservat = "";
                                }
                                else {
                                    var reservat = items.Reservation;
                                }
                                var obj = {
                                    //   "ToLoc": ToLoc,
                                    "ManufacturingOrderType": Dept,
                                    "MfgOrderPlannedStartDate": CurrentDate1,
                                    "ComponentOrder": items.ComponentOrder,
                                    "Product": items.Product,
                                    "ProductDescription": items.ProductDescription,
                                    "ProductManufacturerNumber": items.ProductManufacturerNumber,
                                    "MfgOrderPlannedTotalQty": items.MfgOrderPlannedTotalQty,
                                    "ReqQty": items.MfgOrderPlannedTotalQty,
                                    "ProductionUnit": items.ProductionUnit,
                                    "PendingQty": "",
                                    "OrderIsReleased": items.OrderIsReleased,
                                    "Reservation": reservat,
                                }
                                aTableArr.push(obj);
                            })
                            this.getView().getModel('oTableDataModel').setProperty("/aTableData", aTableArr)
                            oBusyDialog.close();
                        }.bind(this)
                    })
                }

                else if (Dept === "" && OrderNumber === "" && Del_Date != "") {
                    var aTableArr = [];
                    oModel.read("/ZRES_ORDER", {
                        filters: [oFilter],
                        urlParameters: { "$top": "100000" },
                        success: function (oresponse) {
                            oresponse.results.map(function (items) {
                                var CurrentDate = new Date(items.MfgOrderPlannedStartDate)
                                var dt1 = Number(CurrentDate.getDate());
                                var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                                var mm1 = Number(CurrentDate.getMonth() + 1);
                                var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                                var CurrentDate1 = CurrentDate.getFullYear() + '-' + MM1 + '-' + DT1;
                                if (Number(items.Reservation) === 0) {
                                    var reservat = "";
                                }
                                else {
                                    var reservat = items.Reservation;
                                }
                                var obj = {
                                    //   "ToLoc": ToLoc,
                                    "ManufacturingOrderType": Dept,
                                    "MfgOrderPlannedStartDate": CurrentDate1,
                                    "ComponentOrder": items.ComponentOrder,
                                    "Product": items.Product,
                                    "ProductDescription": items.ProductDescription,
                                    "ProductManufacturerNumber": items.ProductManufacturerNumber,
                                    "MfgOrderPlannedTotalQty": items.MfgOrderPlannedTotalQty,
                                    "ReqQty": items.MfgOrderPlannedTotalQty,
                                    "ProductionUnit": items.ProductionUnit,
                                    "OrderIsReleased": items.OrderIsReleased,
                                    "Reservation": reservat,
                                }
                                aTableArr.push(obj);
                            })
                            this.getView().getModel('oTableDataModel').setProperty("/aTableData", aTableArr)
                            oBusyDialog.close();
                        }.bind(this)
                    })
                }

                else if (Dept != "" && OrderNumber != "" && Del_Date === "") {
                    var aTableArr = [];
                    oModel.read("/ZRES_ORDER", {
                        filters: [oFilter1, oFilter2],
                        urlParameters: { "$top": "100000" },
                        success: function (oresponse) {
                            oresponse.results.map(function (items) {
                                var CurrentDate = new Date(items.MfgOrderPlannedStartDate)
                                var dt1 = Number(CurrentDate.getDate());
                                var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                                var mm1 = Number(CurrentDate.getMonth() + 1);
                                var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                                var CurrentDate1 = CurrentDate.getFullYear() + '-' + MM1 + '-' + DT1;
                                if (Number(items.Reservation) === 0) {
                                    var reservat = "";
                                }
                                else {
                                    var reservat = items.Reservation;
                                }
                                var obj = {
                                    //   "ToLoc": ToLoc,
                                    "ManufacturingOrderType": Dept,
                                    "MfgOrderPlannedStartDate": CurrentDate1,
                                    "ComponentOrder": items.ComponentOrder,
                                    "Product": items.Product,
                                    "ProductDescription": items.ProductDescription,
                                    "ProductManufacturerNumber": items.ProductManufacturerNumber,
                                    "MfgOrderPlannedTotalQty": items.MfgOrderPlannedTotalQty,
                                    "ReqQty": items.MfgOrderPlannedTotalQty,
                                    "ProductionUnit": items.ProductionUnit,
                                    "OrderIsReleased": items.OrderIsReleased,
                                    "Reservation": reservat,
                                }
                                aTableArr.push(obj);
                            })
                            this.getView().getModel('oTableDataModel').setProperty("/aTableData", aTableArr)
                            oBusyDialog.close();
                        }.bind(this)
                    })
                }
                
            }

            },

            ChangeToLocationAccordingDepartment: function () {
                var combobox1 = this.getView().byId("idDepart").getValue();
                if (combobox1 != "Cutting" && combobox1 != "Sewing" && combobox1 != "Door" && combobox1 != "Event" && combobox1 != "FR Seat Assembly" && combobox1 != "FR Weld" && combobox1 != "Head Rest" && combobox1 != "Mattresses Cover" && combobox1 != "Others" && combobox1 != "Offline Riverting" && combobox1 != "Pipe Bending" && combobox1 != "RR Seat Assembly" && combobox1 != "RR Weld" && combobox1 != "SWITCH PANEL") {
                    MessageBox.error("Please Select Valid Company Code")
                } else {

                    if (combobox1 === "Cutting") {
                        this.getView().byId("idToLoc").setValue("CT01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 1,
                                    Description: "CT01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");

                    } else if (combobox1 === "Sewing") {
                        this.getView().byId("idToLoc").setValue("SW01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 2,
                                    Description: "SW01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                    } else if (combobox1 === "Door") {
                        this.getView().byId("idToLoc").setValue("DA01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 3,
                                    Description: "DA01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                    } else if (combobox1 === "Event") {
                        this.getView().byId("idToLoc").setValue("EG01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 4,
                                    Description: "EG01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                    } else if (combobox1 === "FR Seat Assembly") {
                        this.getView().byId("idToLoc").setValue("FS01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 5,
                                    Description: "FS01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                    } else if (combobox1 === "FR Weld") {
                        this.getView().byId("idToLoc").setValue("WA01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 6,
                                    Description: "WA01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                    } else if (combobox1 === "Head Rest") {
                        this.getView().byId("idToLoc").setValue("HR01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 7,
                                    Description: "HR01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                    } else if (combobox1 === "Mattresses Cover") {
                        this.getView().byId("idToLoc").setValue("SW01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 8,
                                    Description: "SW01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                    } else if (combobox1 === "Others") {
                        this.getView().byId("idToLoc").setValue("OT01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 9,
                                    Description: "OT01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                    } else if (combobox1 === "Offline Riverting") {
                        this.getView().byId("idToLoc").setValue("WA01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 10,
                                    Description: "WA01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                    } else if (combobox1 === "Pipe Bending") {
                        this.getView().byId("idToLoc").setValue("WA01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 11,
                                    Description: "WA01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                    } else if (combobox1 === "RR Seat Assembly") {
                        this.getView().byId("idToLoc").setValue("RS01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 12,
                                    Description: "RS01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                    } else if (combobox1 === "RR Weld") {
                        this.getView().byId("idToLoc").setValue("WA01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 13,
                                    Description: "WA01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                    } else if (combobox1 === "SWITCH PANEL") {
                        this.getView().byId("idToLoc").setValue("SP01");
                        var oToLocation = {
                            ToLocation: [
                                {
                                    Key: 14,
                                    Description: "SP01"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                        // } else if (combobox1 === "SWITCH PANEL") {
                        //     this.getView().byId("idToLoc").setValue("SW01");
                        //     var oToLocation = {
                        //         ToLocation: [
                        //             {
                        //                 Key: 15,
                        //                 Description: "SW01"
                        //             }, {
                        //                 Key: 16,
                        //                 Description: "SW01"
                        //             },
                        //         ]
                        //     }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oToLocation), "oToLocationModel");
                    }
                }
            },



            //     handleGet1: function()
            //     {

            //         var department =  this.getView().byId("idDepart").getValue();
            //         var date =  this.getView().byId("idDate").getValue();
            //         if(date == "")
            //         {
            //           MessageBox.warning("Please fill the Date");
            //         }
            //       var Onscreen_Date1 = new Date(date);
            //       var oModel1 = this.getView().getModel();
            //       var aTableArr = [];
            //       var oFilter1 = new sap.ui.model.Filter("date", "EQ", Onscreen_Date1);
            //       oModel1.read("/ZRES_ORDER", {
            //           filters: [oFilter1],
            //           success: function (oresponse) {
            //               oresponse.results.map(function (items) {
            //              //     var quant = items.BillOfMaterialItemQuantity;
            //                   var StartDate = items.MfgOrderPlannedStartDate;
            //                   var EndDate = items.MfgOrderPlannedEndDate;
            //                   if (StartDate <= Onscreen_Date1 && Onscreen_Date1 <= EndDate) {
            //                       var obj = {

            //                           "ComponentOrder": items.ComponentOrder,
            //                           "Product": items.Product,
            //                           "ProductDescription": items.ProductDescription,
            //                           "MfgOrderPlannedTotalQty": items.MfgOrderPlannedTotalQty,
            //                           "ProductionUnit": items.ProductionUnit,
            //                       }
            //                       aTableArr.push(obj);
            //                   }
            //               })

            //               this.getView().getModel('oTableDataModel').setProperty("/aTableData", aTableArr)
            //           }.bind(this)
            //       })
            //   },


            //Table Component Field Fragment
            handleValueHelpOrder2: function (oEvent) {
                var oView = this.getView();
                this.oSource = oEvent.getSource();
                this.sPath = oEvent.getSource().getBindingContext('oTableDataModel');
                // var sKey = this.oSource.getCustomData()[0].getKey();
                if (!this._pValueHelpDialog1) {
                    this._pValueHelpDialog1 = Fragment.load({
                        id: oView.getId(),
                        name: "zppreservation.fragments.materialheader",
                        controller: this
                    }).then(function (oValueHelpDialog1) {
                        oView.addDependent(oValueHelpDialog1);
                        return oValueHelpDialog1;
                    });
                }
                this._pValueHelpDialog1.then(function (oValueHelpDialog1) {
                    // this._configValueHelpDialog(this.oSource);
                    var oTemplate = new sap.m.StandardListItem({
                        title: "{ComponentOrder}",

                        //    description: "{ProductDescription}",
                        //   description: "{ProductManufacturerNumber}",
                        //    description: "{description}",


                        type: "Active"
                    });
                    oValueHelpDialog1.bindAggregation("items", {
                        path: '/ZRES_ORDER',
                        length: 30,
                        template: oTemplate,
                    });
                    oValueHelpDialog1.setTitle("Select Order Number");
                    oValueHelpDialog1.open();
                }.bind(this));
            },

            onSearch1: function (oEvent) {
                var sValue = oEvent.getParameter("value");

                if (sValue.length > 16) {
                    var oFilter = new Filter([
                        new Filter("ComponentOrder", FilterOperator.Contains, sValue),

                    ])
                }
                else {
                    var oFilter = new Filter([

                        new Filter("ComponentOrder", FilterOperator.Contains, sValue),
                        //  new Filter("ProductManufacturerNumber", FilterOperator.Contains, sValue),

                    ])
                }


                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);

                // const ids = oFilter.map(({Product}) => Product);
                // const filtered = oFilter.filter(({Product}, index) => 
                // !ids.includes(Product, index + 1));;
                // console.log(filtered);

            },

            //Table Component Field Fragment
            onValueHelpDialogClose_Material: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sPath = oEvent.getParameter("selectedContexts")[0].getPath();
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                //this.oSource = this.byId("productInput");
                if (!oSelectedItem) {
                    this.oSource.resetProperty("value");
                    return;
                }
                // this.getView().getModel('oTableDataModel').getProperty(this.sPath).Product = oObject.Product;

                this.getView().getModel('oTableDataModel').setProperty(this.sPath, this.getView().getModel('oTableDataModel').getProperty(this.sPath));

                this.oSource.setValue(oSelectedItem.getTitle());

                // this.getView().getModel('oTableDataModel').setProperty(this.sPath, this.getView().getModel('oTableDataModel').getProperty(this.sPath));
                // this.oSource.setValue(oSelectedItem.getDescription());




            },







            // handleValueHelpOrderNo: function () {
            //     var oBusyDialog = new sap.m.BusyDialog({
            //         text: "Please wait"
            //     });
            //     oBusyDialog.open();
            //     // var dataModel = this.getOwnerComponent().getModel('dataModel'); // here 'dataModel' need to defined in OnInit function without set any property
            //     var oInput1 = this.getView().byId("idOrdNumber");

            //     if (!this._oValueHelpDialog) {
            //         this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("idOrdNumber", { // input id "idsupplier"
            //             supportMultiselect: false,
            //             supportRangesOnly: false,
            //             stretch: sap.ui.Device.system.phone,
            //             keys: "Orderid",  // fixed
            //             descriptionKey: "Orderid", // fixed
            //             filtermode: "true",
            //             enableBasicSearch: "true",
            //             contentWidth: "00px",
            //             length:5000,


            //             ok: function (oEvent) {

            //                 // here below ".Supplier" will be your entity set property

            //                 var valueset = oEvent.mParameters.tokens[0].mAggregations.customData[0].mProperties.value.ComponentOrder;

            //                 // dataModel.setProperty("/value", valueset);

            //                 oInput1.setValue(valueset) // here fetching from input id otherwise comment and use dataModel.setProperty

            //                 this.close();
            //             },
            //             cancel: function () {
            //                 this.close();
            //             }
            //         });
            //     }


            //     //spath is entity path 

            //     var sPath = "/ZRES_ORDER"

            //     var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
            //         advancedMode: true,
            //         filterBarExpanded: false,
            //         filterBarExpanded: true,
            //         enableBasicSearch: true,
            //         length: 5000,
            //         showGoOnFB: !sap.ui.Device.system.phone,
            //         filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "ComponentOrder", length: 5000, control: new sap.m.Input() })],




            //         search: function (oEvt) {
            //             oBusyDialog.open();

            //             var SupplierData = oEvt.mParameters.selectionSet[0].mProperties.value;

            //             // if threee no  values 

            //             if (SupplierData === "") {
            //                 oTable.bindRows({
            //                     path: sPath, // entity set name
            //                     length:5000
            //                 });
            //             }

            //             //    if BillingDocument  value is insert then search  under block
            //             else if (SupplierData != "") {
            //                 oTable.bindRows({
            //                     path: sPath, filters: [

            //                         new sap.ui.model.Filter("ComponentOrder", sap.ui.model.FilterOperator.Contains, SupplierData)],
            //                     //     new sap.ui.model.Filter("ProductManufacturerNumber", sap.ui.model.FilterOperator.Contains, SupplierData)]

            //                 });
            //             }


            //             oBusyDialog.close();
            //         }
            //     });

            //     this._oValueHelpDialog.setFilterBar(oFilterBar);
            //     var oColModel = new sap.ui.model.json.JSONModel();
            //     oColModel.setSizeLimit(5000)
            //     oColModel.setData({
            //         cols: [
            //             { label: "ComponentOrder", template: "ComponentOrder" },


            //         ]
            //     });
            //     var oTable = this._oValueHelpDialog.getTable();
            //     oTable.setModel(oColModel, "columns");

            //     // here oDataModel("/oData Service")

            //     // /V2/Northwind/Northwind.svc
            //     var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
            //     oTable.setModel(oModel);
            //     oBusyDialog.close();
            //     this._oValueHelpDialog.open();
            // },




            handleNext: function (oEvent) {


                var ToLoc = this.getView().byId("idToLoc").getValue();
                var FromLoc = this.getView().byId("idFromLoc").getValue();
                var ProdOrd = this.getView().byId("idOrdNumber").getValue();
                var ReqDate = this.getView().byId("idReqDate").getValue();


                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();


                if (aSelectedIndex.length == 0) {

                    sap.m.MessageBox.error("Please Select atleast One Row");
                //    MessageBox.close();
                }
                else if (ReqDate == "") {
                    MessageBox.error("Please Fill Required Date");
                }
                else if(ToLoc =="")
                {
                    MessageBox.error("Please Fill Department & To Location");
                }

                else {

                    var aTableArr = this.getView().getModel("oTableDataModel").getProperty("/aTableData")
                    var aNewArr = []

                    for (var i = 0; i < aTableArr.length; i++) {
                        var ind = aSelectedIndex.indexOf(i)
                        if (ind != -1) {
                            aNewArr.push(aTableArr[i])
                        }
                    }

                    var OrderIsReleased_Error = [];
                    for (var D = 0; D < aNewArr.length; D++) {

                        if (aNewArr[D].OrderIsReleased != "X") {
                            // var index = aTableArr.indexOf(aNewArr[D]);
                            // OrderIsReleased_Error.push(index + 1)
                            OrderIsReleased_Error.push(aNewArr[D].ComponentOrder)
                        }
                    }
                    if (OrderIsReleased_Error.length != 0) {
                        var str = OrderIsReleased_Error.toString();
                        MessageBox.error("Production Order No. " + str +" is not Released");
                
                    } else {

                        var aNewArr1 = []
                        var aNewArr_Reservation = [];
                        var obj = {
                            "ToLoc": ToLoc,
                            "FromLoc": FromLoc,
                            "ProdOrd": ProdOrd,
                            "ReqDate": ReqDate,
                        }
                        aNewArr1.push(obj)

                        
                        for (var S = 0; S < aNewArr.length; S++) {
                            if (aNewArr[S].Reservation != "") {
                                aNewArr_Reservation.push(aNewArr[S].Reservation);
                            }
                        }
                        if (aNewArr_Reservation.length > 0) {
                            sap.m.MessageBox.error("Reservation Number Already Generated");
                         //   oBusy.close();
                        }
                        else {
                            this.getOwnerComponent().getModel("oFirstScreenStorageLocationModel").setProperty("/aFirstScreenStorageLocationData", aNewArr1);
                            this.getOwnerComponent().getModel("oFirstScreenModel").setProperty("/aFirstScreenData", aNewArr);
                            this.getOwnerComponent().getRouter().navTo("second");

                            if (aSelectedIndex.length == 0) {
    
                                sap.m.MessageBox.error("Please Select Row");
    
                            }
                            // else {
    
    
                            else {
                                var aTableArr = this.getView().getModel("oTableDataModel").getProperty("/aTableData")
                                var aNewArr = []
                                var aNewArr1 = []
                                var obj = {
                                    "ToLoc": ToLoc,
                                    "FromLoc": FromLoc,
                                    "ProdOrd": ProdOrd,
                                    "ReqDate": ReqDate,
    
    
                                }
                                aNewArr1.push(obj)
    
    
                                for (var i = 0; i < aTableArr.length; i++) {
                                    var ind = aSelectedIndex.indexOf(i)
                                    if (ind != -1) {
                                        aNewArr.push(aTableArr[i])
                                    }
                                }
                                this.getOwnerComponent().getModel("oFirstScreenStorageLocationModel").setProperty("/aFirstScreenStorageLocationData", aNewArr1);
                                this.getOwnerComponent().getModel("oFirstScreenModel").setProperty("/aFirstScreenData", aNewArr);
                                this.getOwnerComponent().getRouter().navTo("second");
    
                            }
                            if (aSelectedIndex.length == 0) {
    
                                sap.m.MessageBox.error("Please Select Row");
    
                            }
    
                            else {
    
                                var aTableArr = this.getView().getModel("oTableDataModel").getProperty("/aTableData")
                                var aNewArr = []
                                var aNewArr1 = []
                                var obj = {
                                    "ToLoc": ToLoc,
                                    "FromLoc": FromLoc,
                                    "ProdOrd": ProdOrd,
                                    "ReqDate": ReqDate,
    
    
                                }
                                aNewArr1.push(obj)
    
                                for (var i = 0; i < aTableArr.length; i++) {
                                    var ind = aSelectedIndex.indexOf(i)
                                    if (ind != -1) {
                                        aNewArr.push(aTableArr[i])
                                    }
                                }
                                this.getOwnerComponent().getModel("oFirstScreenStorageLocationModel").setProperty("/aFirstScreenStorageLocationData", aNewArr1);
                                this.getOwnerComponent().getModel("oFirstScreenModel").setProperty("/aFirstScreenData", aNewArr);
                                this.getOwnerComponent().getRouter().navTo("second");
    
                            }
                        }

                    }

                }
            }


        });
    });
