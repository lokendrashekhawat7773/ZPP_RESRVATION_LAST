sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, MessageBox, MessageToast, Fragment) {
        "use strict";

        return Controller.extend("zppreservation.controller.second", {
            onInit: function () {

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.getView().getModel("oTableDataModel").setProperty("/aTableData", []);
                // UIComponent.getRouterFor(this).getRoute('second').attachPatternMatched(this.FirstScreenDataCall, this);
                // UIComponent.getRouterFor(this).getRoute('second').attachPatternMatched(this.ServiceDataCall, this);



                UIComponent.getRouterFor(this).getRoute('second').attachPatternMatched(this.FirstScreenDataCall, this);

            },
            ServiceDataCall: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES")
                this.getView().setModel(new sap.ui.model.json.JSONModel, "oReservation_SummaryModel");
                oModel.read("/Reservation_summary", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oReservation_SummaryModel").setProperty("/aReservationSummaryData", oresponse.results);
                        // oBusy.close();
                    }.bind(this)
                })
            },
            //onScreen Table Row Delete
            DeleteSelectedRow: function (oEvent) {
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                if (aSelectedIndex.length == 0) {
                    MessageBox.error("Please Select atLeast One Row")
                } else {
                    var aTableArr = this.getView().getModel('oTableDataModel').getProperty("/aTableData");
                    var aNewArr = [];
                    for (var D = 0; D < aTableArr.length; D++) {
                        var ind = aSelectedIndex.indexOf(D);
                        if (ind == -1) {
                            aNewArr.push(aTableArr[D]);
                        }
                    }
                    this.getView().getModel('oTableDataModel').setProperty("/aTableData", aNewArr)
                }
            },



            FirstScreenDataCall1: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please Wait"
                });
                oBusyDialog.open();

                var aFirstScreenSLocData = this.getOwnerComponent().getModel("oFirstScreenStorageLocationModel").getProperty("/aFirstScreenStorageLocationData");
                var ToLocation = aFirstScreenSLocData[0].ToLoc;

                var sLoc = aFirstScreenSLocData[0].FromLoc;
                var OrderID = aFirstScreenSLocData[0].ProdOrd;
                var aFirstScreenData = this.getOwnerComponent().getModel("oFirstScreenModel").getProperty("/aFirstScreenData");
                var OrderFilter = [];
                var first_Qty = [];
                aFirstScreenData.map(function (items) {
                    var order = items.ComponentOrder;
                    var Qty = items.MfgOrderPlannedTotalQty;

                    OrderFilter.push(order);
                    first_Qty.push(Qty);

                })
                var aFilters1 = OrderFilter.map(function (value) {
                    return new sap.ui.model.Filter("OrderID", sap.ui.model.FilterOperator.EQ, value);

                });
                var aFilters2 = OrderFilter.map(function (value) {
                    return new sap.ui.model.Filter("MfgOrderPlannedTotalQty", sap.ui.model.FilterOperator.EQ, value);

                });
                var oFilter = new sap.ui.model.Filter({
                    filters: aFilters1, aFilters2,
                    and: false
                });
                var oModel2 = this.getView().getModel();
                var aTableArr = [];
                this.getView().setModel(new sap.ui.model.json.JSONModel, "oReservation_SummaryModel");
                oModel2.read("/Reservation_summary", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oReservation_SummaryModel").setProperty("/aReservationSummaryData", oresponse.results);
                        // oBusy.close();
                    }.bind(this)
                })
                oModel2.read("/ZRES_COMPPONENT", {
                    filters: [oFilter],
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var SecondScreen_RequiredQty = Number(items.ResvnItmRequiredQtyInBaseUnit);
                            var FirstScreen_RequiredQty;
                            var FirstScreen_Quantity;
                            aFirstScreenData.map(function (item) {
                                if (items.OrderID == item.ComponentOrder) {
                                    var MfgOrderPlannedTotalQty = item.MfgOrderPlannedTotalQty == "" ? "0" : item.MfgOrderPlannedTotalQty;
                                    var MfgOrderPlannedTotalQty = item.MfgOrderPlannedTotalQty == "" ? "0" : item.MfgOrderPlannedTotalQty;
                                    FirstScreen_RequiredQty = Number(MfgOrderPlannedTotalQty);
                                    FirstScreen_Quantity = Number(MfgOrderPlannedTotalQty);
                                }
                            })
                            // var ResivedQuantity = SecondScreen_RequiredQty * FirstScreen_RequiredQty
                            var ResivedQuantity1 = (SecondScreen_RequiredQty / FirstScreen_Quantity) * FirstScreen_RequiredQty
                            //       ResivedQuantity = parseInt(ResivedQuantity);
                            //      var ResivedQuantity1 = ResivedQuantity.toString();



                            var obj1 = {
                                "OrderID": items.OrderID,
                                "Product": items.Product,
                                "ProductDescription": items.ProductDescription,
                                "ResvnItmRequiredQtyInBaseUnit": Number(ResivedQuantity1).toFixed(3),
                                //"ResvnItmRequiredQtyInBaseUnit": items.ResvnItmRequiredQtyInBaseUnit,
                                "ComponentLong": items.ProductManufacturerNumber,
                                "BaseUnit": items.BaseUnit,
                                "StorageLocation": sLoc,
                                "Batch": items.Batch,
                                "StockQty": items.StockQty,
                                "MfgOrderPlannedTotalQty": items.MfgOrderPlannedTotalQty,
                                //"OrderID": items.OrderID,


                            }
                            aTableArr.push(obj1);
                        })
                        var aRes_ServiceData = this.getView().getModel("oReservation_SummaryModel").getProperty("/aReservationSummaryData")
                        aTableArr.map(function (items) {
                            aRes_ServiceData.map(function (item) {
                                if (items.OrderID == item.GoodsRecipientName && items.Product == item.Product) {
                                    items.PendingQty = item.Qty;
                                }
                            })
                        })

                        const productsMerged = Object.values(aTableArr.reduce((acc, el) => {
                            const uniqueKey = el.Product;
                            if (!acc[uniqueKey]) {
                                acc[uniqueKey] = el;
                            } else {
                                acc[uniqueKey].ResvnItmRequiredQtyInBaseUnit += el.ResvnItmRequiredQtyInBaseUnit;
                            }
                            return acc;
                        }, {}));
                        console.log('Product quantities:', productsMerged);

                        this.getView().getModel('oTableDataModel').setProperty("/aTableData", aTableArr)
                        oBusyDialog.close();

                    }.bind(this)

                })
            },

            FirstScreenDataCall: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please Wait"
                });
                oBusyDialog.open();

                var oRefresh = {
                    oRefresh: false,
                }
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(oRefresh), "oCommonModel");

                var aFirstScreenSLocData = this.getOwnerComponent().getModel("oFirstScreenStorageLocationModel").getProperty("/aFirstScreenStorageLocationData");
                var ToLocation = aFirstScreenSLocData[0].ToLoc;

                var sLoc = aFirstScreenSLocData[0].FromLoc;
                var OrderID = aFirstScreenSLocData[0].ProdOrd;
                var aFirstScreenData = this.getOwnerComponent().getModel("oFirstScreenModel").getProperty("/aFirstScreenData");
                var OrderFilter = [];
                var first_Qty = [];
                aFirstScreenData.map(function (items) {
                    var order = items.ComponentOrder;
                    var Qty = items.MfgOrderPlannedTotalQty;

                    OrderFilter.push(order);
                    first_Qty.push(Qty);

                })
                var aFilters1 = OrderFilter.map(function (value) {
                    return new sap.ui.model.Filter("OrderID", sap.ui.model.FilterOperator.EQ, value);

                });
                var aFilters2 = OrderFilter.map(function (value) {
                    return new sap.ui.model.Filter("MfgOrderPlannedTotalQty", sap.ui.model.FilterOperator.EQ, value);

                });
                var oFilter = new sap.ui.model.Filter({
                    filters: aFilters1, aFilters2,
                    and: false
                });
                var oModel2 = this.getView().getModel();
                var aTableArr = [];
                this.getView().setModel(new sap.ui.model.json.JSONModel, "oReservation_SummaryModel");
                oModel2.read("/Reservation_summary", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oReservation_SummaryModel").setProperty("/aReservationSummaryData", oresponse.results);
                        // oBusy.close();
                    }.bind(this)
                })
                oModel2.read("/ZRES_COMPPONENT", {
                    filters: [oFilter],
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var SecondScreen_RequiredQty = Number(items.ResvnItmRequiredQtyInBaseUnit);
                            var FirstScreen_RequiredQty;
                            var FirstScreen_Quantity;
                            aFirstScreenData.map(function (item) {
                                if (items.OrderID == item.ComponentOrder) {
                                    var RequiredQuantity = item.ReqQty == "" ? "0" : item.ReqQty;
                                    var MfgOrderPlannedTotalQty = item.MfgOrderPlannedTotalQty == "" ? "0" : item.MfgOrderPlannedTotalQty;
                                    FirstScreen_RequiredQty = Number(RequiredQuantity);
                                    FirstScreen_Quantity = Number(MfgOrderPlannedTotalQty);
                                }
                            })
                            // var ResivedQuantity = SecondScreen_RequiredQty * FirstScreen_RequiredQty
                            var ResivedQuantity1 = (SecondScreen_RequiredQty / FirstScreen_Quantity) * FirstScreen_RequiredQty
                            //       ResivedQuantity = parseInt(ResivedQuantity);
                            //      var ResivedQuantity1 = ResivedQuantity.toString();



                            var obj1 = {
                                "OrderID": items.OrderID,
                                "Product": items.Product,
                                "ProductDescription": items.ProductDescription,
                                "ResvnItmRequiredQtyInBaseUnit": Number(ResivedQuantity1).toFixed(3),
                                //"ResvnItmRequiredQtyInBaseUnit": items.ResvnItmRequiredQtyInBaseUnit,
                                "ComponentLong": items.ProductManufacturerNumber,
                                "BaseUnit": items.BaseUnit,
                                "StorageLocation": sLoc,
                                "Batch": items.Batch,
                                "StockQty": items.StockQty,
                                "MfgOrderPlannedTotalQty": items.MfgOrderPlannedTotalQty,
                                //"OrderID": items.OrderID,


                            }
                            aTableArr.push(obj1);
                        })
                        console.log(aTableArr)

                        var aRes_ServiceData = this.getView().getModel("oReservation_SummaryModel").getProperty("/aReservationSummaryData")
                        aTableArr.map(function (items) {
                            aRes_ServiceData.map(function (item) {
                                if (items.OrderID == item.GoodsRecipientName && items.Product == item.Product) {
                                    items.PendingQty = item.Qty;
                                }
                            })
                        })
                        var result = aTableArr.sort((a, b) => a.Product.localeCompare(b.Product));
                        var result1 = [];
                        var map = new Map();
                        for (var item of result) {
                            if (!map.has(item.Product)) {
                                map.set(item.Product, true)
                                result1.push(item)
                            }
                        }

                        const groupedItems = aTableArr.reduce((result, item) => {
                            const { Product, ResvnItmRequiredQtyInBaseUnit } = item;
                            // Check if the item name is already in the result
                            if (!result[Product]) {
                                result[Product] = { Product, ResvnItmRequiredQtyInBaseUnit: 0 };
                            }
                            // Add the amount to the total for the item name
                            result[Product].ResvnItmRequiredQtyInBaseUnit += Number(ResvnItmRequiredQtyInBaseUnit);
                            return result;
                        }, {});
                        var Calculate_Quantity = Object.values(groupedItems);
                        // Calculate_Quantity.push(groupedItemsArray);
                        var ResultArray = [];
                        for (var d = 0; d < result1.length; d++) {
                            var Product_result1 = result1[d].Product;
                            for (var s = 0; s < Calculate_Quantity.length; s++) {
                                var Product_Calculate_Quantity = Calculate_Quantity[s].Product;
                                var quant = Calculate_Quantity[s].ResvnItmRequiredQtyInBaseUnit;
                                var quant1 = quant.toString();
                                if (Product_Calculate_Quantity == Product_result1) {
                                    var obj1 = {
                                        "Product": result1[d].Product,
                                        "ProductDescription": result1[d].ProductDescription,
                                        "ResvnItmRequiredQtyInBaseUnit": quant1,
                                        "BaseUnit": result1[d].BaseUnit,
                                        "StorageLocation": result1[d].StorageLocation,
                                        "Batch": result1[d].Batch,
                                        "ComponentLong": result1[d].ComponentLong,
                                        "StockQty": result1[d].StockQty,
                                        "OrderID": result1[d].OrderID,
                                        "MfgOrderPlannedTotalQty": result1[d].MfgOrderPlannedTotalQty,
                                    }
                                    ResultArray.push(obj1);
                                }
                            }
                        }
                        this.getView().getModel('oTableDataModel').setProperty("/aTableData", ResultArray)
                        oBusyDialog.close();

                    }.bind(this)

                })
            },


            fetchToken: function () {
                var oFirst_TableData = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                var ZeroQuantityError = [];
                for (var A = 0; A < oFirst_TableData.length; A++) {
                    if (Number(oFirst_TableData[A].ResvnItmRequiredQtyInBaseUnit) == 0) {
                        ZeroQuantityError.push("Error")
                    }
                }
                if (ZeroQuantityError.length != 0) {
                    MessageBox.error("Required Qty. should be grater than Zero")
                } else {
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Loading",
                        text: "Please wait"
                    });
                    oBusyDialog.open();
                    var tableListitem = [];         // for using loop to send responce  
                    var Product = this.getView().byId("idCompo").getValue();
                    console.log(Product);

                    // var oCommonModel = this.getOwnerComponent().setModel("oCommonModel");
                    var CurrentDate = new Date();
                    var dt1 = Number(CurrentDate.getDate());
                    var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                    var mm1 = Number(CurrentDate.getMonth() + 1);
                    var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                    var CurrentDate1 = CurrentDate.getFullYear() + '-' + MM1 + '-' + DT1;
                    var aFirstScreenSLocData = this.getOwnerComponent().getModel("oFirstScreenStorageLocationModel").getProperty("/aFirstScreenStorageLocationData");
                    var sLoc = aFirstScreenSLocData[0].FromLoc;
                    var ToLocation = aFirstScreenSLocData[0].ToLoc;
                    var ProdOrd1 = aFirstScreenSLocData[0].ProdOrd;
                    var ReqDate1 = aFirstScreenSLocData[0].ReqDate;

                    //                var OrderID1 = aFirstScreenSLocData[0].ProdOrd;

                    var MyFirst_Table = [];

                    oFirst_TableData.map(function (element) {
                        tableListitem.push({

                            "Product": element.Product,
                            "MatlCompRequirementDate": ReqDate1,
                            //  "MatlCompRequirementDate": CurrentDate1,
                            "Plant": "1001",
                            "GoodsMovementIsAllowed": true,
                            "StorageLocation": element.StorageLocation,
                            "Batch": "",
                            "ValuationType": "",
                            "DebitCreditCode": "H",
                            "GLAccount": "",
                            "ResvnAccountIsEnteredManually": false,
                            "EntryUnit": element.BaseUnit,
                            "ReservationItemIsFinallyIssued": false,
                            "ReservationItmIsMarkedForDeltn": false,
                            "ResvnItmRequiredQtyInEntryUnit": Number(element.ResvnItmRequiredQtyInBaseUnit),
                            "GoodsRecipientName": element.OrderID,


                        })
                    });


                    oFirst_TableData.map(function (items) {
                        var obj = {
                            "Product": items.Product,
                            "ProductDescription": items.ProductDescription,
                            "ResvnItmRequiredQtyInBaseUnit": items.ResvnItmRequiredQtyInBaseUnit,
                            "BaseUnit": items.BaseUnit,
                            "StorageLocation": items.StorageLocation,
                            "Batch": items.Batch,
                            "StockQty": items.StockQty,
                        }
                        MyFirst_Table.push(obj);
                    })



                    //  https://my406746.s4hana.cloud.sap/sap/bc/http/sap/ZRESERVATION_0224?sap-client=080
                    var url = "/sap/bc/http/sap/ZRESERVATION_0224?";

                    $.ajax({
                        type: "post",
                        url: "/sap/bc/http/sap/ZRESERVATION_0224?",
                        data: JSON.stringify({
                            "GoodsMovementType": "311",
                            //      "Reservation": ProdOrd1,
                            //  "GoodsRecipientName": "12345",
                            "IssuingOrReceivingPlant": "1001",
                            "IssuingOrReceivingStorageLoc": ToLocation,
                            //  "ReservationDate": CurrentDate1,
                            "ReservationDate": ReqDate1,
                            "IsCheckedAgainstFactoryCal": true,
                            "WBSElement": "",
                            "OrderID": "",
                            "_ReservationDocumentItem": tableListitem

                        }),
                        contentType: "application/json; charset=utf-8",
                        traditional: true,
                        //     success: function (oresponse) {
                        //         if (oresponse.slice(0, 5) === 'ERROR') {
                        //             // oBusy.close();
                        //             oBusyDialog.close();
                        //             MessageBox.error(oresponse);


                        //         }
                        //         else {

                        //             // oBusy.close()
                        //             oBusyDialog.close();
                        //             MessageBox.success(oresponse, {

                        //                 onClose: function (oAction) {
                        //                     if (oAction === MessageBox.Action.OK) {
                        //                         history.go(-1);

                        //                     }
                        //                 }.bind(this)

                        //             });
                        //         }
                        //     }.bind(this),
                        //     error:function(error)
                        //     {
                        //         MessageBox.error(error);
                        //     }
                        // })
                        success: function (data) {
                            oBusyDialog.close();
                            if (data.slice(0, 5) === 'ERROR' || data.slice(0, 5) === 'Error') {
                                // oBusy.close();
                                oBusyDialog.close();
                                MessageBox.error(data);


                            }
                            else {
                                let Reservation = data;
                                MessageBox.success("Reservation Number: " + Reservation + " Generated Succesfully", {

                                    onClose: function (oAction) {
                                        if (oAction === MessageBox.Action.OK) {
                                            history.go(-1);

                                        }
                                    }.bind(this)
                                });
                                var oRefresh = {
                                    oRefresh: true,
                                }
                                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(oRefresh), "oCommonModel");
                            }


                        }.bind(this),

                        // error: function (error) {
                        // //  let message1 = error.responseJSON.error.message;
                        //   // MessageBox.error(message1);
                        //   MessageBox.error("Data Not Save", {
                        //     onClose: function (oAction) {
                        //       if (oAction === MessageBox.Action.CLOSE) {
                        //         //     window.location.reload();
                        //       }
                        //     }
                        //   });
                        //   oBusyDialog.close();
                        // }
                    });
                }
            },






            getData: function () {
                alert("hellow buddy")
            },
            handleSave: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Response is being sent......"
                });
                oBusyDialog.open();
                var oFirst_TableData = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                var MyFirst_Table = [];
                oFirst_TableData.map(function (items) {
                    var obj = {
                        "Product": items.Product,
                        "ProductDescription": items.ProductDescription,
                        "ResvnItmRequiredQtyInBaseUnit": items.ResvnItmRequiredQtyInBaseUnit,
                        "BaseUnit": items.BaseUnit,
                        "StorageLocation": items.StorageLocation,
                        "Batch": items.Batch,
                    }
                    MyFirst_Table.push(obj);
                })


                //https://my406746.s4hana.cloud.sap:443/sap/bc/http/sap/ZRES_HTTP?sap-client=080

                var url = "/sap/opu/odata4/sap/api_reservation_document/srvd_a2x/sap/apireservationdocument/0001/ReservationDocument";

                $.ajax({
                    type: "post",
                    url: url,
                    headers: {
                        "X-CSRF-TOKEN": "-WzjMVHbCUsAfcBOMWfaWg==",
                        // "Content-Type": "application/json",
                        "Authorization": "Basic UFAwMTpOREdrbGRXVm5oc3l5bFZUekF6WUdNdXJvcHlOVEUtYXhUNmNBUHFn",
                        // "Cookie": "SAP_SESSIONID_Z6T_100=wZMA3ktfbaaCXcOPLOOjx5A_6F1o7BHumxPBEGvaVO4%3d; sap-usercontext=sap-client=100",
                    },

                    data: JSON.stringify({
                    }),
                    contentType: "application/json; charset=utf-8",
                    traditional: true,
                    success: function (data) {
                        oBusyDialog.close();
                        MessageBox.success("Data Save Successfully" + Reservation);
                    }.bind(this),
                    error: function (error) {
                        MessageBox.error("Data Not Save");
                        oBusyDialog.close();
                    }

                });

            },
        });
    });
