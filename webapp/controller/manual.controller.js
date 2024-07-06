sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/BusyDialog",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Sorter",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"

  ],
  function (BaseController, BusyDialog, UIComponent, MessageBox, MessageToast, Sorter, syncStyleClass, JSONModel, Filter, FilterOperator, Fragment) {
    "use strict";

    return BaseController.extend("zppreservation.controller.manual", {
      onInit() {
        UIComponent.getRouterFor(this).getRoute('manual').attachPatternMatched(this.SingleRowAdd, this);

        UIComponent.getRouterFor(this).getRoute('manual').attachPatternMatched(this.ScreenRefrashFunction, this);

        this.getView().setModel(new sap.ui.model.json.JSONModel(), "oVisibleModel")
        // this.getView().getModel("oVisibleModel").setProperty("/Variable", false)
        this.getView().getModel("oVisibleModel").setProperty("/Standard", false)
        // this.PriceControll_Combo_Fun();


        this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
        this.getView().getModel('oTableDataModel').setProperty("/aTableData", []);
        UIComponent.getRouterFor(this).getRoute('manual').attachPatternMatched(this.SingleRowAdd, this);
        var CurrentDate = new Date()
        var dt1 = Number(CurrentDate.getDate());
        var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
        var mm1 = Number(CurrentDate.getMonth() + 1);
        var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
        var CurrentDate1 = CurrentDate.getFullYear() + '-' + MM1 + '-' + DT1;
        this.getView().byId("idDate1").setValue(CurrentDate1);

      },


      SingleRowAdd: function () {
        var myArr = [];
        this.getView().byId("idFromLocation").setValue();
        this.getView().byId("idToLocation").setValue();
        this.getView().byId("idFromPlant").setValue();
        var obj = {
          "SerialNo": 1,
          "Product": "",
          "ProductManufacturerNumber": "",
          "MaterialDescription": "",
          "ResvnItmRequiredQtyInEntryUnit": "",
          "UnitofMeasurement": "",
          "Batch": "",
          "StockQty": "",
          "FromLocation": "",
          "ToLocation": "",


        }
        myArr.push(obj)
        this.getView().getModel('oTableDataModel').setProperty("/aTableData", myArr);

      },

      AddAutomaticSingleRow1: function (oEvent) {
        var aTableArr = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
        var len = aTableArr.length - 1;
        var ResvnItmRequiredQtyInEntryUnit = aTableArr[len].ResvnItmRequiredQtyInEntryUnit;
        if (ResvnItmRequiredQtyInEntryUnit != "") {
          aTableArr.push({
            "SerialNo": aTableArr.length + 1,
            "Product": "",
            "ProductManufacturerNumber": "",
            "MaterialDescription": "",
            "ResvnItmRequiredQtyInEntryUnit": "",
            "UnitofMeasurement": "",
            "Batch": "",
            "StockQty": "",
            "FromLocation": this.getView().byId("idFromLocation").getValue(),
            "ToLocation": this.getView().byId("idToLocation").getValue(),
          })
          this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr);
        } else {
          MessageBox.error("Material is Mandatory")
        }
      },



      ScreenRefrashFunction: function () {
        this.getView().getModel("oTableDataModel").setProperty("/aTableData", []);
        this.getView().byId("idToLocation").setValue("");
        this.getView().byId("idFromLocation").setValue("");
        this.getView().byId("idQty").setValue("");
        this.getView().byId("Material").setValue("");
        this.getView().byId("idModel").setValue("");
        this.getView().byId("idDate1").setValue("");
        this.getView().byId("idSupplier").setValue("");
        this.getView().byId("idReservationNo").setValue("");
        this.getView().byId("idDocNo").setValue("");
        this.getView().byId("Price").setValue("");
        this.getView().byId("PriceControl").setValue("");
        this.getView().byId("idFromPlant").setValue("");



      },



      PriceControll_Combo_Fun: function () {

        var Combo = this.getView().byId("PriceControl").getValue();

        if (Combo == "201") {
          this.getView().getModel("oVisibleModel").setProperty("/Standard", true);

        }

        else if (Combo == "311") {   //on select 201 shown and 311 hide
          this.getView().getModel("oVisibleModel").setProperty("/Standard", false);

        }
      },



      //Table Component Field Fragment
      handleValueHelpSupplier: function (oEvent) {
        var oView = this.getView();
        this.oSource1 = oEvent.getSource();
        this.sPath1 = oEvent.getSource().getBindingContext('oTableDataModel');
        // var sKey = this.oSource.getCustomData()[0].getKey();
        if (!this._pValueHelpDialog) {
          this._pValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "zppreservation.fragments.supplier",
            controller: this
          }).then(function (oValueHelpDialog) {
            oView.addDependent(oValueHelpDialog);
            return oValueHelpDialog;
          });
        }
        this._pValueHelpDialog.then(function (oValueHelpDialog) {
          // this._configValueHelpDialog(this.oSource);
          var oTemplate = new sap.m.StandardListItem({
            title: "{SupplierName}",
            type: "Active"
          });
          oValueHelpDialog.bindAggregation("items", {
            path: '/supplier_f4',
            length: 30,
            template: oTemplate,
          });
          oValueHelpDialog.setTitle("Select Supplier");
          oValueHelpDialog.open();
        }.bind(this));
      },

      onSearch_Supplier: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new Filter([
          new Filter("SupplierName", FilterOperator.Contains, sValue),
        ])
        var oBinding = oEvent.getParameter("itemsBinding");
        oBinding.filter([oFilter]);
      },
      onValueHelpDialogClose_Supplier: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sPath = oEvent.getParameter("selectedContexts")[0].getPath();
        var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
        this.getView().byId("idSupplier").setValue(oObject.SupplierName)
      },


      //Table Component Field Fragment
      handleValueHelpMaterialheader1: function (oEvent) {
        var oView = this.getView();
        this.oSource = oEvent.getSource();
        this.sPath = oEvent.getSource().getBindingContext('oTableDataModel');
        // var sKey = this.oSource.getCustomData()[0].getKey();
        if (!this._pValueHelpDialog123) {
          this._pValueHelpDialog123 = Fragment.load({
            id: oView.getId(),
            name: "zppreservation.fragments.materialheader",
            controller: this
          }).then(function (oValueHelpDialog123) {
            oView.addDependent(oValueHelpDialog123);
            return oValueHelpDialog123;
          });
        }
        this._pValueHelpDialog123.then(function (oValueHelpDialog123) {
          // this._configValueHelpDialog(this.oSource);
          var oTemplate = new sap.m.StandardListItem({
            title: "{Product}",

            //    description: "{ProductDescription}",
            description: "{ProductManufacturerNumber}",
            //    description: "{description}",


            type: "Active"
          });
          oValueHelpDialog123.bindAggregation("items", {
            path: '/ZRES_MATERIAL_F4',
            length: 30,
            template: oTemplate,
          });
          oValueHelpDialog123.setTitle("Select Material");
          oValueHelpDialog123.open();
        }.bind(this));
      },

      onSearch1: function (oEvent) {
        var sValue = oEvent.getParameter("value");

        if (sValue.length > 20) {
          var oFilter = new Filter([
            //   new Filter("Product", FilterOperator.Contains, sValue),
            new Filter("ProductManufacturerNumber", FilterOperator.Contains, sValue),

          ])
        }
        else {
          var oFilter = new Filter([

            new Filter("Product", FilterOperator.Contains, sValue),
            new Filter("ProductManufacturerNumber", FilterOperator.Contains, sValue),

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
        this.getView().byId("Material").setValue(oObject.Product)
        //   //this.oSource = this.byId("productInput");
        //   if (!oSelectedItem) {
        //     this.oSource.resetProperty("value");
        //     return;
        //   }
        //  // this.getView().getModel('oTableDataModel').getProperty(this.sPath).Product = oObject.Product;

        //   this.getView().getModel('oTableDataModel').setProperty(this.sPath, this.getView().getModel('oTableDataModel').getProperty(this.sPath));

        //   this.oSource.setValue(oSelectedItem.getTitle());

        // this.getView().getModel('oTableDataModel').setProperty(this.sPath, this.getView().getModel('oTableDataModel').getProperty(this.sPath));
        // this.oSource.setValue(oSelectedItem.getDescription());




      },











      // handleValueHelpMaterialheader: function () {
      //   var oBusyDialog1 = new sap.m.BusyDialog({
      //     text: "Please wait"
      //   });
      //   oBusyDialog1.open();
      //   // var dataModel = this.getOwnerComponent().getModel('dataModel'); // here 'dataModel' need to defined in OnInit function without set any property
      //   var oInput1 = this.getView().byId("Material");

      //   if (!this._oValueHelpDialog1) {
      //     this._oValueHelpDialog1 = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("Material", { // input id "idsupplier"
      //       supportMultiselect: false,
      //       supportRangesOnly: false,
      //       stretch: sap.ui.Device.system.phone,
      //       keys: "Material",  // fixed
      //       descriptionKey: "Material", // fixed
      //       filtermode: "true",
      //       enableBasicSearch: "true",
      //       contentWidth: "800px",
      //       length: 5000,


      //       ok: function (oEvent) {

      //         // here below ".Supplier" will be your entity set property

      //         var valueset1 = oEvent.mParameters.tokens[0].mAggregations.customData[0].mProperties.value.Product;

      //         // dataModel.setProperty("/value", valueset);

      //         oInput1.setValue(valueset1) // here fetching from input id otherwise comment and use dataModel.setProperty

      //         this.close();
      //       },
      //       cancel: function () {
      //         this.close();
      //       }
      //     });
      //   }


      //   //spath is entity path 

      //   var sPath1 = "/ZRES_MATERIAL"

      //   var oFilterBar1 = new sap.ui.comp.filterbar.FilterBar({
      //     advancedMode: true,
      //     filterBarExpanded: false,
      //     filterBarExpanded: true,
      //     enableBasicSearch: true,
      //     length: 5000,
      //     showGoOnFB: !sap.ui.Device.system.phone,
      //     filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "Product", length: 5000, control: new sap.m.Input() }),
      //     new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n2", label: "ProductManufacturerNumber", control: new sap.m.Input() })],




      //     search: function (oEvt1) {
      //       oBusyDialog1.open();

      //       var Product = oEvt1.mParameters.selectionSet[0].mProperties.value;
      //       var ProductManufacturerNumber = oEvt1.mParameters.selectionSet[1].mProperties.value;

      //       // if threee no  values 

      //       if (Product === "" && ProductManufacturerNumber === "") {
      //         oTable1.bindRows({
      //           path: sPath1, // entity set name
      //           length: 5000
      //         });
      //       }

      //       //    if BillingDocument  value is insert then search  under block
      //       else if (Product != "" && ProductManufacturerNumber === "") {
      //         oTable1.bindRows({
      //           path: sPath1, filters: [

      //             new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, Product)],


      //         });
      //       }
      //       else if (Material === "" && ProductManufacturerNumber != "") {
      //         oTable1.bindRows({
      //           path: sPath1, filters: [

      //             new sap.ui.model.Filter("ProductManufacturerNumber", sap.ui.model.FilterOperator.EQ, ProductManufacturerNumber)],


      //         });
      //       }
      //       else if (ProductManufacturerNumber != "") {
      //         oTable1.bindRows({
      //           path: sPath1, filters: [

      //           new sap.ui.model.Filter("ProductManufacturerNumber", sap.ui.model.FilterOperator.EQ, ProductManufacturerNumber)],


      //         });
      //       }


      //       else if (Product != "" && ProductManufacturerNumber != "") {
      //         oTable1.bindRows({
      //           path: sPath1, filters: [
      //             new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, Product),
      //             new sap.ui.model.Filter("ProductManufacturerNumber", sap.ui.model.FilterOperator.EQ, ProductManufacturerNumber)],


      //         });
      //       }


      //       oBusyDialog1.close();
      //     }
      //   });

      //   this._oValueHelpDialog1.setFilterBar(oFilterBar1);
      //   var oColModel = new sap.ui.model.json.JSONModel();
      //   oColModel.setSizeLimit(5000)
      //   oColModel.setData({
      //     cols: [
      //       { label: "Product", template: "Product" },
      //       { label: "ProductManufacturerNumber", template: "ProductManufacturerNumber" },
      //       { label: "ProductDescription", template: "ProductDescription" },


      //     ]
      //   });
      //   var oTable1 = this._oValueHelpDialog1.getTable();
      //   oTable1.setModel(oColModel, "columns");

      //   // here oDataModel("/oData Service")

      //   // /V2/Northwind/Northwind.svc
      //   var oModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
      //   oTable1.setModel(oModel1);
      //   oBusyDialog1.close();
      //   this._oValueHelpDialog1.open();
      // },



      handleLocation: function (oEvent) {
        var FromLocation1 = this.getView().byId("idFromLocation").getValue();
        var ToLocation1 = this.getView().byId("idToLocation").getValue();
        this.getView().getModel("oTableDataModel").setProperty("/aTableData", [])
        // var value = oEvent.mParameters.selectedItem.mProperties.text;
        // if (oEvent.getSource().mProperties.placeholder == "Select From Location") {
        //   var aTableArr = [];
        //   var obj = {
        //     "SerialNo": 1,
        //     "FromLocation": value,
        //     "ToLocation": ToLocation1,
        //   }
        //   aTableArr.push(obj)
        //   this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
        // } else if (oEvent.getSource().mProperties.placeholder == "Select To Location") {
        var aTableArr = [];
        var obj = {
          "SerialNo": 1,
          "FromLocation": FromLocation1,
          "ToLocation": ToLocation1,
        }
        aTableArr.push(obj)
        this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
        // }

      },


      onSelectionChange: function (oEvent) {
        var oComboBox = oEvent.getSource();
        var sSelectedKey = oComboBox.getSelectedKey();
        var oInputField = this.getView().byId("idToLocation");

        if (sSelectedKey === "201") {
          oInputField.setVisible(false);
        }
        // else if(sSelectedKey === "551") 
        // {
        //   oInputField.setVisible(false);
        // }
        else {
          oInputField.setVisible(true);
        }
      },

      handleGet2222: function () {
        var toloacation = this.getView().byId("idToLocation").getValue();
        var idFromLocation = this.getView().byId("idFromLocation").getValue();
        //    var aAvlStockServiceData = this.getView().getModel("oAvlStockServiceModel").getProperty("/aAvlStockServiceData");
        if (toloacation == "" || idFromLocation == "") {
          MessageBox.error("Please Fill From Location & To Location");
        }
        else {
          var oBusyDialog = new sap.m.BusyDialog({
            text: "Please Wait"
          });
          oBusyDialog.open();
          var FromLocation1 = this.getView().byId("idFromLocation").getValue();
          var toloacation = this.getView().byId("idToLocation").getValue();
          var Qty = Number(this.getView().byId("idQty").getValue());
          var Material = this.getView().byId("Material").getValue();
          var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
          // var oFilter_product = new sap.ui.model.Filter("Product", "EQ", Material);
          var oFilter = new sap.ui.model.Filter("Material", "EQ", Material);
          var oFilter1 = new sap.ui.model.Filter("toloacation", "EQ", toloacation);

          var aNewArr = [];
          var aTableArr = [];
          var aTableArr1 = [];

          var toloc = [];
          var aTableArr2 = [];


          oModel.read("/Bom_View", {
            filters: [oFilter],
            success: function (ores) {
              aNewArr.push(ores.results[0]);
              var aNewArr1 = [];
              var material = [];
              for (var D = 0; D < ores.results.length; D++) {
                material.push(ores.results[D].BillOfMaterialComponent)
              }
              var aFilters = material.map(function (value) {
                return new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, value);
              });

              var oFilter2 = new sap.ui.model.Filter({
                filters: aFilters,
                and: false
              });
              oModel.read("/ZRES_MATERIAL", {
                filters: [oFilter1, oFilter2],
                success: function (ores1) {
                  var entityQty = parseFloat(((ores.results[0].BillOfMaterialItemQuantityTO) * Qty).toFixed(2));
                  if (ores1.results.length === 0) {
                    for (var D = 0; D < ores.results.length; D++) {
                      var obj = {
                        "SerialNo": D + 1,
                        "Product": ores.results[D].Product,
                        "ProductManufacturerNumber": ores.results[D].ProductManufacturerNumber,
                        "description": ores.results[D].ProductDescription,
                        "ResvnItmRequiredQtyInEntryUnit": entityQty,
                        "BillOfMaterialItemUnit": ores.results[D].BaseUnit,
                        "Batch": ores.results[D].Batch,
                        "StockQty": ores.results[D].StockQty,
                        "FromLocation": FromLocation1,
                        "ToLocation": toloacation,
                      }
                      aNewArr1.push(obj)
                    }


                  }
                  else {
                    for (var D = 0; D < ores1.results.length; D++) {
                      var obj = {
                        "SerialNo": D + 1,
                        "Product": ores1.results[D].Product,
                        "ProductManufacturerNumber": ores1.results[D].ProductManufacturerNumber,
                        "description": ores1.results[D].ProductDescription,
                        "ResvnItmRequiredQtyInEntryUnit": entityQty,
                        "BillOfMaterialItemUnit": ores1.results[D].BaseUnit,
                        "Batch": ores1.results[D].Batch,
                        "StockQty": ores1.results[D].StockQty,
                        "FromLocation": FromLocation1,
                        "ToLocation": toloacation,
                      }
                      aNewArr1.push(obj)
                    }
                  }
                  oBusyDialog.close();
                  this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr1);
                }.bind(this),
                error: function () {

                  oBusyDialog.close();
                  this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr1);
                }
              })


            }.bind(this)
          })
        }
      },



      handleGet1: function () {
        var idToLocation = this.getView().byId("idToLocation").getValue();
        var idFromLocation = this.getView().byId("idFromLocation").getValue();
        var Material = this.getView().byId("Material").getValue();
        var ReservationNo = this.getView().byId("idReservationNo").getValue();
        var documentNo = this.getView().byId("idDocNo").getValue();

        var movementtype = this.getView().byId("PriceControl").getValue();
        var costcenter = this.getView().byId("Price").getValue();
        if (movementtype == "201" && idFromLocation == "") {
          MessageBox.error("Please Fill From Location");
        }
        else if (movementtype == "311" && idToLocation == "" || idFromLocation == "") {
          MessageBox.error("Please Fill From Location & To Location")
        }
        else
          if (movementtype == "201" && costcenter == "") {
            MessageBox.error("Fill Cost Center")
          } else {

            if (movementtype === "") {
              MessageBox.error("Mandatory to fill Movement Type")
            }


            else if (Material === "" && (ReservationNo != "" && documentNo != "")) {
              MessageBox.error("Fill only one out of Reservation No. or Document No.")
            }
            else if (ReservationNo === "" && (Material != "" && documentNo != "")) {
              MessageBox.error("Fill only one out of Document No. or Material")
            }
            else if (documentNo === "" && (Material != "" && ReservationNo != "")) {
              MessageBox.error("Fill only one out of Reservation No. or Material")
            }

            else if ((documentNo === "") && (Material === "") && (ReservationNo === "")) {
              MessageBox.error("Fill only one out of Reservation No. or Document No. or Material")
            }
            else if ((documentNo != "") && (Material != "") && (ReservationNo != "")) {
              MessageBox.error("Fill only one out of Reservation No. or Document No. or Material")
            }
            //  else if (idToLocation == "" || idFromLocation == "") {
            //     MessageBox.error("Please Fill From Location & To Location");
            //   }


            else {
              if (Material != "") {
                var oBusyDialog = new sap.m.BusyDialog({
                  text: "Please Wait"
                });
                oBusyDialog.open();
                var FromLocation1 = this.getView().byId("idFromLocation").getValue();
                var ToLocation1 = this.getView().byId("idToLocation").getValue();
                var Qty = Number(this.getView().byId("idQty").getValue());
                var Material = this.getView().byId("Material").getValue();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
                var oFilter = new sap.ui.model.Filter("Material", "EQ", Material);

                var aTableArr = [];
                var aTableArr1 = [];
                oModel.read("/Bom_View", {
                  filters: [oFilter],
                  urlParameters: {
                    "$top": "5000"
                  },
                  success: function (oresponse) {
                    oresponse.results.map(function (items) {
                      // console.log(" BILL  "+typeof(parseFloat(((items.BillOfMaterialItemQuantityTO) * Qty).toFixed(2))));
                      var entityQty = parseFloat(((items.BillOfMaterialItemQuantityTO) * Qty).toFixed(2));
                      var obj = {
                        "Product": items.BillOfMaterialComponent,
                        "ProductManufacturerNumber": items.ProductManufacturerNumber,
                        "description": items.description,
                        "ResvnItmRequiredQtyInEntryUnit": entityQty,
                        "BillOfMaterialItemUnit": items.BaseUnit,
                        "Batch": "",
                        "StockQty": items.StockQty,
                        "FromLocation": FromLocation1,
                        "ToLocation": ToLocation1,
                      }
                      aTableArr.push(obj)
                    })
                    for (var D = 0; D < aTableArr.length; D++) {
                      //  var entityQty = parseFloat(((aTableArr.BillOfMaterialItemQuantityTO) * Qty).toFixed(2));
                      var obj = {
                        "SerialNo": D + 1,
                        "Product": aTableArr[D].Product,
                        "ProductManufacturerNumber": aTableArr[D].ProductManufacturerNumber,
                        "description": aTableArr[D].description,
                        "ResvnItmRequiredQtyInEntryUnit": aTableArr[D].ResvnItmRequiredQtyInEntryUnit,
                        "BillOfMaterialItemUnit": aTableArr[D].BillOfMaterialItemUnit,
                        "Batch": aTableArr[D].Batch,
                        "StockQty": aTableArr[D].StockQty,
                        "FromLocation": aTableArr[D].FromLocation,
                        "ToLocation": aTableArr[D].ToLocation,
                      }
                      aTableArr1.push(obj)
                    }
                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr1)
                    //   this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                    oBusyDialog.close();
                  }.bind(this),
                  error: function (error) {
                    MessageBox.error("Data Is Not Available");
                    oBusyDialog.close();
                  }
                })
              }
              else if (ReservationNo != "") {
                var oBusyDialog = new sap.m.BusyDialog({
                  text: "Please Wait"
                });
                oBusyDialog.open();
                var FromLocation1 = this.getView().byId("idFromLocation").getValue();
                var ToLocation1 = this.getView().byId("idToLocation").getValue();
                var Qty = Number(this.getView().byId("idQty").getValue());
                var Reservation = this.getView().byId("idReservationNo").getValue();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
                var oFilter = new sap.ui.model.Filter("Reservation", "EQ", Reservation);
                var aTableArr = [];
                var aTableArr1 = [];
                oModel.read("/res_copy", {
                  filters: [oFilter],
                  urlParameters: {
                    "$top": "5000"
                  },
                  success: function (oresponse) {
                    oresponse.results.map(function (items) {
                      var obj = {
                        "Product": items.Product,
                        "ProductManufacturerNumber": items.ProductManufacturerNumber,
                        "description": items.ProductDescription,
                        "ResvnItmRequiredQtyInEntryUnit": items.ResvnItmRequiredQtyInBaseUnit,
                        "BillOfMaterialItemUnit": items.BaseUnit,
                        "Batch": "",
                        "StockQty": "",
                        "FromLocation": FromLocation1,
                        "ToLocation": ToLocation1,
                      }
                      aTableArr.push(obj)
                    })
                    for (var D = 0; D < aTableArr.length; D++) {
                      var obj = {
                        "SerialNo": D + 1,
                        "Product": aTableArr[D].Product,
                        "ProductManufacturerNumber": aTableArr[D].ProductManufacturerNumber,
                        "description": aTableArr[D].description,
                        "ResvnItmRequiredQtyInEntryUnit": aTableArr[D].ResvnItmRequiredQtyInEntryUnit,
                        "BillOfMaterialItemUnit": aTableArr[D].BillOfMaterialItemUnit,
                        "FromLocation": aTableArr[D].FromLocation,
                        "ToLocation": aTableArr[D].ToLocation,
                      }
                      aTableArr1.push(obj)
                    }
                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr1)
                    //   this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                    oBusyDialog.close();

                  }.bind(this),


                })
              }
              else if (documentNo != "") {
                var oBusyDialog = new sap.m.BusyDialog({
                  text: "Please Wait"
                });
                oBusyDialog.open();
                var FromLocation1 = this.getView().byId("idFromLocation").getValue();
                var ToLocation1 = this.getView().byId("idToLocation").getValue();
                var Qty = Number(this.getView().byId("idQty").getValue());
                var documentNo = this.getView().byId("idDocNo").getValue();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
                var oFilter = new sap.ui.model.Filter("MaterialDocument", "EQ", documentNo);
                var aTableArr = [];
                var aTableArr1 = [];
                oModel.read("/document_number", {
                  filters: [oFilter],
                  urlParameters: {
                    "$top": "5000"
                  },
                  success: function (oresponse) {
                    oresponse.results.map(function (items) {
                      var obj = {
                        "Product": items.Material,
                        "ProductManufacturerNumber": items.ProductManufacturerNumber,
                        "description": items.ProductDescription,
                        "ResvnItmRequiredQtyInEntryUnit": items.QuantityInBaseUnit,
                        "BillOfMaterialItemUnit": items.MaterialBaseUnit,
                        "Batch": "",
                        "StockQty": "",
                        "FromLocation": FromLocation1,
                        "ToLocation": ToLocation1,
                      }
                      aTableArr.push(obj)
                    })
                    for (var D = 0; D < aTableArr.length; D++) {
                      var obj = {
                        "SerialNo": D + 1,
                        "Product": aTableArr[D].Product,
                        "ProductManufacturerNumber": aTableArr[D].ProductManufacturerNumber,
                        "description": aTableArr[D].description,
                        "ResvnItmRequiredQtyInEntryUnit": aTableArr[D].ResvnItmRequiredQtyInEntryUnit,
                        "BillOfMaterialItemUnit": aTableArr[D].BillOfMaterialItemUnit,
                        "FromLocation": aTableArr[D].FromLocation,
                        "ToLocation": aTableArr[D].ToLocation,
                      }
                      aTableArr1.push(obj)
                    }
                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr1)
                    //   this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                    oBusyDialog.close();

                  }.bind(this),


                })
              }
            }
          }
        //     }
      },


      handleGet: function () {
        var idToLocation = this.getView().byId("idToLocation").getValue();
        var idFromLocation = this.getView().byId("idFromLocation").getValue();
        var Material = this.getView().byId("Material").getValue();
        var ReservationNo = this.getView().byId("idReservationNo").getValue();
        var documentNo = this.getView().byId("idDocNo").getValue();

        var movementtype = this.getView().byId("PriceControl").getValue();
        var costcenter = this.getView().byId("Price").getValue();
        if (movementtype == "201" && idFromLocation == "") {
          MessageBox.error("Please Fill From Location");
        }
        else if (movementtype == "311" && idToLocation == "" || idFromLocation == "") {
          MessageBox.error("Please Fill From Location & To Location")
        }
        else
          if (movementtype == "201" && costcenter == "") {
            MessageBox.error("Fill Cost Center")
          } else {

            if (movementtype === "") {
              MessageBox.error("Mandatory to fill Movement Type")
            }


            else if (Material === "" && (ReservationNo != "" && documentNo != "")) {
              MessageBox.error("Fill only one out of Reservation No. or Document No.")
            }
            else if (ReservationNo === "" && (Material != "" && documentNo != "")) {
              MessageBox.error("Fill only one out of Document No. or Material")
            }
            else if (documentNo === "" && (Material != "" && ReservationNo != "")) {
              MessageBox.error("Fill only one out of Reservation No. or Material")
            }

            else if ((documentNo === "") && (Material === "") && (ReservationNo === "")) {
              MessageBox.error("Fill only one out of Reservation No. or Document No. or Material")
            }
            else if ((documentNo != "") && (Material != "") && (ReservationNo != "")) {
              MessageBox.error("Fill only one out of Reservation No. or Document No. or Material")
            }
            //  else if (idToLocation == "" || idFromLocation == "") {
            //     MessageBox.error("Please Fill From Location & To Location");
            //   }


            else {
              if (Material != "") {
                var oBusyDialog = new sap.m.BusyDialog({
                  text: "Please Wait"
                });
                oBusyDialog.open();
                var FromLocation1 = this.getView().byId("idFromLocation").getValue();
                var ToLocation1 = this.getView().byId("idToLocation").getValue();
                var Qty = Number(this.getView().byId("idQty").getValue());
                var Material = this.getView().byId("Material").getValue();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
                var oFilter = new sap.ui.model.Filter("Material", "EQ", Material);

                var aTableArr = [];
                var aTableArr1 = [];
                oModel.read("/Bom_View", {
                  filters: [oFilter],
                  urlParameters: {
                    "$top": "5000"
                  },
                  success: function (oresponse) {
                    oresponse.results.map(function (items) {
                      // console.log(" BILL  "+typeof(parseFloat(((items.BillOfMaterialItemQuantityTO) * Qty).toFixed(2))));
                      var entityQty = parseFloat(((items.BillOfMaterialItemQuantityTO) * Qty).toFixed(2));
                      var obj = {
                        "Product": items.BillOfMaterialComponent,
                        "ProductManufacturerNumber": items.ProductManufacturerNumber,
                        "description": items.description,
                        "ResvnItmRequiredQtyInEntryUnit": entityQty,
                        "BillOfMaterialItemUnit": items.BaseUnit,
                        "Batch": "",
                        "StockQty": items.StockQty,
                        "FromLocation": FromLocation1,
                        "ToLocation": ToLocation1,
                      }
                      aTableArr.push(obj)
                    })
                    for (var D = 0; D < aTableArr.length; D++) {
                      //  var entityQty = parseFloat(((aTableArr.BillOfMaterialItemQuantityTO) * Qty).toFixed(2));
                      var obj = {
                        "SerialNo": D + 1,
                        "Product": aTableArr[D].Product,
                        "ProductManufacturerNumber": aTableArr[D].ProductManufacturerNumber,
                        "description": aTableArr[D].description,
                        "ResvnItmRequiredQtyInEntryUnit": aTableArr[D].ResvnItmRequiredQtyInEntryUnit,
                        "BillOfMaterialItemUnit": aTableArr[D].BillOfMaterialItemUnit,
                        "Batch": aTableArr[D].Batch,
                        "StockQty": aTableArr[D].StockQty,
                        "FromLocation": aTableArr[D].FromLocation,
                        "ToLocation": aTableArr[D].ToLocation,
                      }
                      aTableArr1.push(obj)
                    }
                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr1)
                    //   this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                    oBusyDialog.close();
                  }.bind(this),
                  error: function (error) {
                    MessageBox.error("Data Is Not Available");
                    oBusyDialog.close();
                  }
                })
              }
              else if (ReservationNo != "") {
                var oBusyDialog = new sap.m.BusyDialog({
                  text: "Please Wait"
                });
                oBusyDialog.open();
                var FromLocation1 = this.getView().byId("idFromLocation").getValue();
                var ToLocation1 = this.getView().byId("idToLocation").getValue();
                var Qty = Number(this.getView().byId("idQty").getValue());
                var Reservation = this.getView().byId("idReservationNo").getValue();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
                var oFilter = new sap.ui.model.Filter("Reservation", "EQ", Reservation);
                var aTableArr = [];
                var aTableArr1 = [];
                oModel.read("/res_copy", {
                  filters: [oFilter],
                  urlParameters: {
                    "$top": "5000"
                  },
                  success: function (oresponse) {
                    oresponse.results.map(function (items) {
                      var obj = {
                        "Product": items.Product,
                        "ProductManufacturerNumber": items.ProductManufacturerNumber,
                        "description": items.ProductDescription,
                        "ResvnItmRequiredQtyInEntryUnit": items.ResvnItmRequiredQtyInBaseUnit,
                        "BillOfMaterialItemUnit": items.BaseUnit,
                        "Batch": "",
                        "StockQty": "",
                        "FromLocation": FromLocation1,
                        "ToLocation": ToLocation1,
                      }
                      aTableArr.push(obj)
                    })
                    for (var D = 0; D < aTableArr.length; D++) {
                      var obj = {
                        "SerialNo": D + 1,
                        "Product": aTableArr[D].Product,
                        "ProductManufacturerNumber": aTableArr[D].ProductManufacturerNumber,
                        "description": aTableArr[D].description,
                        "ResvnItmRequiredQtyInEntryUnit": aTableArr[D].ResvnItmRequiredQtyInEntryUnit,
                        "BillOfMaterialItemUnit": aTableArr[D].BillOfMaterialItemUnit,
                        "FromLocation": aTableArr[D].FromLocation,
                        "ToLocation": aTableArr[D].ToLocation,
                      }
                      aTableArr1.push(obj)
                    }
                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr1)
                    //   this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                    oBusyDialog.close();

                  }.bind(this),


                })
              }
              else if (documentNo != "") {
                var oBusyDialog = new sap.m.BusyDialog({
                  text: "Please Wait"
                });
                oBusyDialog.open();
                var FromLocation1 = this.getView().byId("idFromLocation").getValue();
                var ToLocation1 = this.getView().byId("idToLocation").getValue();
                var Qty = Number(this.getView().byId("idQty").getValue());
                var documentNo = this.getView().byId("idDocNo").getValue();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
                var oFilter = new sap.ui.model.Filter("MaterialDocument", "EQ", documentNo);
                var aTableArr = [];
                var aTableArr1 = [];
                oModel.read("/document_number", {
                  filters: [oFilter],
                  urlParameters: {
                    "$top": "5000"
                  },
                  success: function (oresponse) {
                    oresponse.results.map(function (items) {
                      var obj = {
                        "Product": items.Material,
                        "ProductManufacturerNumber": items.ProductManufacturerNumber,
                        "description": items.ProductDescription,
                        "ResvnItmRequiredQtyInEntryUnit": items.QuantityInBaseUnit,
                        "BillOfMaterialItemUnit": items.MaterialBaseUnit,
                        "Batch": "",
                        "StockQty": "",
                        "FromLocation": FromLocation1,
                        "ToLocation": ToLocation1,
                      }
                      aTableArr.push(obj)
                    })
                    for (var D = 0; D < aTableArr.length; D++) {
                      var obj = {
                        "SerialNo": D + 1,
                        "Product": aTableArr[D].Product,
                        "ProductManufacturerNumber": aTableArr[D].ProductManufacturerNumber,
                        "description": aTableArr[D].description,
                        "ResvnItmRequiredQtyInEntryUnit": aTableArr[D].ResvnItmRequiredQtyInEntryUnit,
                        "BillOfMaterialItemUnit": aTableArr[D].BillOfMaterialItemUnit,
                        "FromLocation": aTableArr[D].FromLocation,
                        "ToLocation": aTableArr[D].ToLocation,
                      }
                      aTableArr1.push(obj)
                    }
                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr1)
                    //   this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                    oBusyDialog.close();

                  }.bind(this),


                })
              }
            }
          }
        //     }
      },

      CallBackendData: async function () {
        var idToLocation = this.getView().byId("idToLocation").getValue();
        var idFromLocation = this.getView().byId("idFromLocation").getValue();
        var Material = this.getView().byId("Material").getValue();
        var ReservationNo = this.getView().byId("idReservationNo").getValue();
        var documentNo = this.getView().byId("idDocNo").getValue();
        var that = this;
        var movementtype = this.getView().byId("PriceControl").getValue();
        var costcenter = this.getView().byId("Price").getValue();
        var Plant = this.getView().byId("idFromPlant").getValue();
        if(Plant == "")
        {
          MessageBox.error("Mandatory to select Plant")

        }
          else if (movementtype == "201" && idFromLocation == "") {
          MessageBox.error("Please Fill From Location");
        }
        else if (movementtype == "311" && idToLocation == "" || idFromLocation == "") {
          MessageBox.error("Please Fill From Location & To Location")
        }
        else
          if (movementtype == "201" && costcenter == "") {
            MessageBox.error("Fill Cost Center")
          } else {

            if (movementtype === "") {
              MessageBox.error("Mandatory to fill Movement Type")
            }


            else if (Material === "" && (ReservationNo != "" && documentNo != "")) {
              MessageBox.error("Fill only one out of Reservation No. or Document No.")
            }
            else if (ReservationNo === "" && (Material != "" && documentNo != "")) {
              MessageBox.error("Fill only one out of Document No. or Material")
            }
            else if (documentNo === "" && (Material != "" && ReservationNo != "")) {
              MessageBox.error("Fill only one out of Reservation No. or Material")
            }

            else if ((documentNo === "") && (Material === "") && (ReservationNo === "")) {
              MessageBox.error("Fill only one out of Reservation No. or Document No. or Material")
            }
            else if ((documentNo != "") && (Material != "") && (ReservationNo != "")) {
              MessageBox.error("Fill only one out of Reservation No. or Document No. or Material")
            }
            //  else if (idToLocation == "" || idFromLocation == "") {
            //     MessageBox.error("Please Fill From Location & To Location");
            //   }


            else {
              if (Material != "") {
                var oBusyDialog = new sap.m.BusyDialog({
                  text: "Please Wait"
                });
                oBusyDialog.open();
                var FromLocation1 = this.getView().byId("idFromLocation").getValue();
                var ToLocation1 = this.getView().byId("idToLocation").getValue();
                var Qty = Number(this.getView().byId("idQty").getValue());
                var Material = this.getView().byId("Material").getValue();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
                var oFilter = new sap.ui.model.Filter("Material", "EQ", Material);

                var aTableArr = [];
                var aTableArr1 = [];
                oModel.read("/Bom_View", {
                  filters: [oFilter],
                  urlParameters: {
                    "$top": "5000"
                  },
                  success: function (oresponse) {
                    oresponse.results.map(async function (items, index, arr) {
                      var entityQty = parseFloat(((items.BillOfMaterialItemQuantity) * Qty).toFixed(2));
                      var obj = {
                        "SerialNo": index + 1,
                        "Product": items.BillOfMaterialComponent,
                        "ProductManufacturerNumber": items.ProductManufacturerNumber,
                        "description": items.description,
                        "ResvnItmRequiredQtyInEntryUnit": entityQty,
                        "BillOfMaterialItemUnit": items.BillOfMaterialItemUnit,
                        "Batch": "",
                        "StockQty": items.StockQty,
                        "FromLocation": FromLocation1,
                        "ToLocation": ToLocation1,
                      }
                      aTableArr.push(obj)
                    })
                    aTableArr.map(function (item, index, arr) {
                      var oFilter_Material = new sap.ui.model.Filter("Product", "EQ", item.Product);
                      var ServiceModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
                      ServiceModel.read("/ZRES_MATERIAL", {
                        filters: [oFilter_Material],
                        success: function (data) {
                          item.StockQty = data.results[0].StockQty;
                          if (index == arr.length - 1) {
                            that.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr);
                            oBusyDialog.close();
                          }
                        },
                        error: function (error) {
                          item.StockQty = data.results[0].StockQty;
                          if (index == arr.length - 1) {
                            oBusyDialog.close();
                            that.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr);
                          }
                        }
                      });
                    })

                  }.bind(this),
                  error: function (error) {
                    MessageBox.error("Data Is Not Available");
                    oBusyDialog.close();
                  }
                })
              }
              else if (ReservationNo != "") {
                var oBusyDialog = new sap.m.BusyDialog({
                  text: "Please Wait"
                });
                oBusyDialog.open();
                var FromLocation1 = this.getView().byId("idFromLocation").getValue();
                var ToLocation1 = this.getView().byId("idToLocation").getValue();
                var Qty = Number(this.getView().byId("idQty").getValue());
                var Reservation = this.getView().byId("idReservationNo").getValue();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
                var oFilter = new sap.ui.model.Filter("Reservation", "EQ", Reservation);
                var aTableArr = [];
                var aTableArr1 = [];
                oModel.read("/res_copy", {
                  filters: [oFilter],
                  urlParameters: {
                    "$top": "5000"
                  },
                  success: function (oresponse) {
                    oresponse.results.map(function (items) {
                      var obj = {
                        "Product": items.Product,
                        "ProductManufacturerNumber": items.ProductManufacturerNumber,
                        "description": items.ProductDescription,
                        "ResvnItmRequiredQtyInEntryUnit": items.ResvnItmRequiredQtyInBaseUnit,
                        "BillOfMaterialItemUnit": items.BaseUnit,
                        "Batch": "",
                        "StockQty": "",
                        "FromLocation": FromLocation1,
                        "ToLocation": ToLocation1,
                      }
                      aTableArr.push(obj)
                    })
                    for (var D = 0; D < aTableArr.length; D++) {
                      var obj = {
                        "SerialNo": D + 1,
                        "Product": aTableArr[D].Product,
                        "ProductManufacturerNumber": aTableArr[D].ProductManufacturerNumber,
                        "description": aTableArr[D].description,
                        "ResvnItmRequiredQtyInEntryUnit": aTableArr[D].ResvnItmRequiredQtyInEntryUnit,
                        "BillOfMaterialItemUnit": aTableArr[D].BillOfMaterialItemUnit,
                        "FromLocation": aTableArr[D].FromLocation,
                        "ToLocation": aTableArr[D].ToLocation,
                      }
                      aTableArr1.push(obj)
                    }
                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr1)
                    //   this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                    oBusyDialog.close();

                  }.bind(this),


                })
              }
              else if (documentNo != "") {
                var oBusyDialog = new sap.m.BusyDialog({
                  text: "Please Wait"
                });
                oBusyDialog.open();
                var FromLocation1 = this.getView().byId("idFromLocation").getValue();
                var ToLocation1 = this.getView().byId("idToLocation").getValue();
                var Qty = Number(this.getView().byId("idQty").getValue());
                var documentNo = this.getView().byId("idDocNo").getValue();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
                var oFilter = new sap.ui.model.Filter("MaterialDocument", "EQ", documentNo);
                var aTableArr = [];
                var aTableArr1 = [];
                oModel.read("/document_number", {
                  filters: [oFilter],
                  urlParameters: {
                    "$top": "5000"
                  },
                  success: function (oresponse) {
                    oresponse.results.map(function (items) {
                      var obj = {
                        "Product": items.Material,
                        "ProductManufacturerNumber": items.ProductManufacturerNumber,
                        "description": items.ProductDescription,
                        "ResvnItmRequiredQtyInEntryUnit": items.QuantityInBaseUnit,
                        "BillOfMaterialItemUnit": items.MaterialBaseUnit,
                        "Batch": "",
                        "StockQty": "",
                        "FromLocation": FromLocation1,
                        "ToLocation": ToLocation1,
                      }
                      aTableArr.push(obj)
                    })
                    for (var D = 0; D < aTableArr.length; D++) {
                      var obj = {
                        "SerialNo": D + 1,
                        "Product": aTableArr[D].Product,
                        "ProductManufacturerNumber": aTableArr[D].ProductManufacturerNumber,
                        "description": aTableArr[D].description,
                        "ResvnItmRequiredQtyInEntryUnit": aTableArr[D].ResvnItmRequiredQtyInEntryUnit,
                        "BillOfMaterialItemUnit": aTableArr[D].BillOfMaterialItemUnit,
                        "FromLocation": aTableArr[D].FromLocation,
                        "ToLocation": aTableArr[D].ToLocation,
                      }
                      aTableArr1.push(obj)
                    }
                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr1)
                    //   this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                    oBusyDialog.close();

                  }.bind(this),


                })
              }
            }
          }
        //     }
      },

      backendDataReadFunction1: function (oFilter_Material) {
        return new Promise(function (resolve, reject) {
          var ServiceModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
          ServiceModel.read("/ZRES_MATERIAL", {
            filters: [oFilter_Material],
            success: function (data) {
              resolve(data.results[0].StockQty);
            },
            error: function (error) {
              oBusy.close();
              console.error("Error fetching data from :", error);
              reject(error); // Reject the Promise with the encountered error
            }
          });
        });
      },

      handleGet11: function () {
        var idToLocation = this.getView().byId("idToLocation").getValue();
        var idFromLocation = this.getView().byId("idFromLocation").getValue();
        var Material = this.getView().byId("Material").getValue();
        var ReservationNo = this.getView().byId("idReservationNo").getValue();
        var documentNo = this.getView().byId("idDocNo").getValue();

        var movementtype = this.getView().byId("PriceControl").getValue();
        var costcenter = this.getView().byId("Price").getValue();
        if (movementtype == "201" && idFromLocation == "") {
          MessageBox.error("Please Fill From Location");
        }
        else if (movementtype == "311" && idToLocation == "" || idFromLocation == "") {
          MessageBox.error("Please Fill From Location & To Location")
        }
        else
          if (movementtype == "201" && costcenter == "") {
            MessageBox.error("Fill Cost Center")
          } else {

            if (movementtype === "") {
              MessageBox.error("Mandatory to fill Movement Type")
            }


            else if (Material === "" && (ReservationNo != "" && documentNo != "")) {
              MessageBox.error("Fill only one out of Reservation No. or Document No.")
            }
            else if (ReservationNo === "" && (Material != "" && documentNo != "")) {
              MessageBox.error("Fill only one out of Document No. or Material")
            }
            else if (documentNo === "" && (Material != "" && ReservationNo != "")) {
              MessageBox.error("Fill only one out of Reservation No. or Material")
            }

            else if ((documentNo === "") && (Material === "") && (ReservationNo === "")) {
              MessageBox.error("Fill only one out of Reservation No. or Document No. or Material")
            }
            else if ((documentNo != "") && (Material != "") && (ReservationNo != "")) {
              MessageBox.error("Fill only one out of Reservation No. or Document No. or Material")
            }
            //  else if (idToLocation == "" || idFromLocation == "") {
            //     MessageBox.error("Please Fill From Location & To Location");
            //   }


            else {
              if (Material != "") {
                var oBusyDialog = new sap.m.BusyDialog({
                  text: "Please Wait"
                });
                oBusyDialog.open();
                var FromLocation1 = this.getView().byId("idFromLocation").getValue();
                var ToLocation1 = this.getView().byId("idToLocation").getValue();
                var Qty = Number(this.getView().byId("idQty").getValue());
                var Material = this.getView().byId("Material").getValue();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
                var oFilter = new sap.ui.model.Filter("Material", "EQ", Material);
                var oFilter1 = new sap.ui.model.Filter("toloacation", "EQ", ToLocation1);



                var aNewArr = [];
                var aTableArr = [];
                var aTableArr1 = [];
                oModel.read("/Bom_View", {
                  filters: [oFilter],
                  urlParameters: {
                    "$top": "5000"
                  },
                  success: function (ores) {
                    aNewArr.push(ores.results[0]);
                    var aNewArr1 = [];
                    var material = [];
                    for (var D = 0; D < ores.results.length; D++) {
                      material.push(ores.results[D].BillOfMaterialComponent)
                    }
                    var aFilters = material.map(function (value) {
                      return new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, value);
                    });

                    var oFilter2 = new sap.ui.model.Filter({
                      filters: aFilters,
                      and: false
                    });
                    oModel.read("/ZRES_MATERIAL", {
                      filters: [oFilter2],
                      success: function (ores1) {
                        //  var entityQty = parseFloat(((ores.results[0].BillOfMaterialItemQuantityTO) * Qty).toFixed(2));
                        //   var ent = aNewArr[0].BillOfMaterialItemQuantityTO;
                        //   console.log(ent)
                        //    console.log(entityQty)
                        // var aNewArr = [];
                        // ores1.results.map(function (res) {
                        //   if (res.toloacation == "" || res.toloacation == ToLocation1) {
                        //     aNewArr.push(res);
                        //   }
                        // })
                        // ores1.results = aNewArr;
                        if (ores1.results.length === 0) {
                          for (var D = 0; D < ores.results.length; D++)
                            var entityQty = parseFloat(((ores.results[D].BillOfMaterialItemQuantity) * Qty).toFixed(2));
                          //  var unit = String(ores.results[D].BillOfMaterialItemUnit);
                          {
                            var obj = {
                              "SerialNo": D + 1,
                              "Product": ores.results[D].Product,
                              "ProductManufacturerNumber": ores.results[D].ProductManufacturerNumber,
                              "description": ores.results[D].ProductDescription,
                              "ResvnItmRequiredQtyInEntryUnit": entityQty,
                              "BillOfMaterialItemUnit": ores.results[D].BillOfMaterialItemUnit,
                              "Batch": ores.results[D].Batch,
                              "StockQty": ores.results[D].StockQty,
                              "FromLocation": FromLocation1,
                              "ToLocation": ToLocation1,
                            }
                            aNewArr1.push(obj)
                          }
                        }

                        else {

                          for (var D = 0; D < ores1.results.length; D++) {
                            var entityQty = "";
                            var unit = "";
                            if (D < ores.results.length) {
                              var entityQty = parseFloat(((ores.results[D].BillOfMaterialItemQuantity) * Qty).toFixed(2));
                              var unit = String(ores.results[D].BillOfMaterialItemUnit);

                            }
                            var obj = {
                              "SerialNo": D + 1,
                              "Product": ores1.results[D].Product,
                              "ProductManufacturerNumber": ores1.results[D].ProductManufacturerNumber,
                              "description": ores1.results[D].ProductDescription,
                              "ResvnItmRequiredQtyInEntryUnit": entityQty,
                              //   "ResvnItmRequiredQtyInEntryUnit": ores.results[D].BillOfMaterialItemQuantity,
                              "BillOfMaterialItemUnit": unit,
                              "Batch": ores1.results[D].Batch,
                              "StockQty": ores1.results[D].StockQty,
                              "FromLocation": FromLocation1,
                              "ToLocation": ToLocation1,
                            }
                            aNewArr1.push(obj)
                          }
                        }

                        oBusyDialog.close();
                        this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr1);
                      }.bind(this),
                      error: function () {

                        oBusyDialog.close();
                        this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr1);
                      }
                    })


                  }.bind(this)
                })
              }



























              //       oresponse.results.map(function (items) {
              //         // console.log(" BILL  "+typeof(parseFloat(((items.BillOfMaterialItemQuantityTO) * Qty).toFixed(2))));
              //         var entityQty = parseFloat(((items.BillOfMaterialItemQuantityTO) * Qty).toFixed(2));
              //         var obj = {
              //           "Product": items.BillOfMaterialComponent,
              //           "ProductManufacturerNumber": items.ProductManufacturerNumber,
              //           "description": items.description,
              //           "ResvnItmRequiredQtyInEntryUnit": entityQty,
              //           "BillOfMaterialItemUnit": items.BaseUnit,
              //           "Batch": "",
              //           "AvailableStock": "",
              //           "FromLocation": FromLocation1,
              //           "ToLocation": ToLocation1,
              //         }
              //         aTableArr.push(obj)
              //       })
              //       for (var D = 0; D < aTableArr.length; D++) {
              //         //  var entityQty = parseFloat(((aTableArr.BillOfMaterialItemQuantityTO) * Qty).toFixed(2));
              //         var obj = {
              //           "SerialNo": D + 1,
              //           "Product": aTableArr[D].Product,
              //           "ProductManufacturerNumber": aTableArr[D].ProductManufacturerNumber,
              //           "description": aTableArr[D].description,
              //           "ResvnItmRequiredQtyInEntryUnit": aTableArr[D].ResvnItmRequiredQtyInEntryUnit,
              //           "BillOfMaterialItemUnit": aTableArr[D].BillOfMaterialItemUnit,
              //           "Batch": aTableArr[D].Batch,
              //           "AvailableStock": aTableArr[D].AvailableStock,
              //           "FromLocation": aTableArr[D].FromLocation,
              //           "ToLocation": aTableArr[D].ToLocation,
              //         }
              //         aTableArr1.push(obj)
              //       }
              //       this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr1)
              //       //   this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
              //       oBusyDialog.close();
              //     }.bind(this),
              //     error: function (error) {
              //       MessageBox.error("Data Is Not Available");
              //       oBusyDialog.close();
              //     }
              //   })
              // }
              else if (ReservationNo != "") {
                var oBusyDialog = new sap.m.BusyDialog({
                  text: "Please Wait"
                });
                oBusyDialog.open();
                var FromLocation1 = this.getView().byId("idFromLocation").getValue();
                var ToLocation1 = this.getView().byId("idToLocation").getValue();
                var Qty = Number(this.getView().byId("idQty").getValue());
                var Reservation = this.getView().byId("idReservationNo").getValue();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
                var oFilter = new sap.ui.model.Filter("Reservation", "EQ", Reservation);
                var aTableArr = [];
                var aTableArr1 = [];
                oModel.read("/res_copy", {
                  filters: [oFilter],
                  urlParameters: {
                    "$top": "5000"
                  },
                  success: function (oresponse) {
                    oresponse.results.map(function (items) {
                      var obj = {
                        "Product": items.Product,
                        "ProductManufacturerNumber": items.ProductManufacturerNumber,
                        "description": items.ProductDescription,
                        "ResvnItmRequiredQtyInEntryUnit": items.ResvnItmRequiredQtyInBaseUnit,
                        "BillOfMaterialItemUnit": items.BaseUnit,
                        "Batch": "",
                        "StockQty": "",
                        "FromLocation": FromLocation1,
                        "ToLocation": ToLocation1,
                      }
                      aTableArr.push(obj)
                    })
                    for (var D = 0; D < aTableArr.length; D++) {
                      var obj = {
                        "SerialNo": D + 1,
                        "Product": aTableArr[D].Product,
                        "ProductManufacturerNumber": aTableArr[D].ProductManufacturerNumber,
                        "description": aTableArr[D].description,
                        "ResvnItmRequiredQtyInEntryUnit": aTableArr[D].ResvnItmRequiredQtyInEntryUnit,
                        "BillOfMaterialItemUnit": aTableArr[D].BillOfMaterialItemUnit,
                        "FromLocation": aTableArr[D].FromLocation,
                        "ToLocation": aTableArr[D].ToLocation,
                      }
                      aTableArr1.push(obj)
                    }
                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr1)
                    //   this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                    oBusyDialog.close();

                  }.bind(this),


                })
              }
              else if (documentNo != "") {
                var oBusyDialog = new sap.m.BusyDialog({
                  text: "Please Wait"
                });
                oBusyDialog.open();
                var FromLocation1 = this.getView().byId("idFromLocation").getValue();
                var ToLocation1 = this.getView().byId("idToLocation").getValue();
                var Qty = Number(this.getView().byId("idQty").getValue());
                var documentNo = this.getView().byId("idDocNo").getValue();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES");
                var oFilter = new sap.ui.model.Filter("MaterialDocument", "EQ", documentNo);
                var aTableArr = [];
                var aTableArr1 = [];
                oModel.read("/document_number", {
                  filters: [oFilter],
                  urlParameters: {
                    "$top": "5000"
                  },
                  success: function (oresponse) {
                    oresponse.results.map(function (items) {
                      var obj = {
                        "Product": items.Material,
                        "ProductManufacturerNumber": items.ProductManufacturerNumber,
                        "description": items.ProductDescription,
                        "ResvnItmRequiredQtyInEntryUnit": items.QuantityInBaseUnit,
                        "BillOfMaterialItemUnit": items.MaterialBaseUnit,
                        "Batch": "",
                        "StockQty": "",
                        "FromLocation": FromLocation1,
                        "ToLocation": ToLocation1,
                      }
                      aTableArr.push(obj)
                    })
                    for (var D = 0; D < aTableArr.length; D++) {
                      var obj = {
                        "SerialNo": D + 1,
                        "Product": aTableArr[D].Product,
                        "ProductManufacturerNumber": aTableArr[D].ProductManufacturerNumber,
                        "description": aTableArr[D].description,
                        "ResvnItmRequiredQtyInEntryUnit": aTableArr[D].ResvnItmRequiredQtyInEntryUnit,
                        "BillOfMaterialItemUnit": aTableArr[D].BillOfMaterialItemUnit,
                        "FromLocation": aTableArr[D].FromLocation,
                        "ToLocation": aTableArr[D].ToLocation,
                      }
                      aTableArr1.push(obj)
                    }
                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr1)
                    //   this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                    oBusyDialog.close();

                  }.bind(this),


                })
              }
            }
          }
        //     }
      },






      onValueHelpSearch: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new Filter("Product", FilterOperator.Contains, sValue); // Entity property for live search

        oEvent.getSource().getBinding("items").filter([oFilter]);
      },

      onValueHelpClose: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }
        this.byId("idMaterial1").setValue(oSelectedItem.getTitle());  // Input Id
      },


      ChangeMaterialDescription: function (oEvent) {
        var oBusy = new sap.m.BusyDialog({
          text: "Please Wait"
        });
        // oBusy.open();
        var toloacation = this.getView().byId("idToLocation").getValue();
        var FromLocation = this.getView().byId("idFromLocation").getValue();
        var movementType = this.getView().byId("PriceControl").getValue();


        if (movementType === "311" && toloacation != "") {
          var oContext = oEvent.getSource().getBindingContext('oTableDataModel').getObject();
          var Product = oEvent.mParameters.value;
          var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES")
          var oFilter = new sap.ui.model.Filter("Product", "EQ", Product)
          var oFilter1 = new sap.ui.model.Filter("toloacation", "EQ", toloacation);

          var aTableArr = this.getView().getModel("oTableDataModel").getProperty("/aTableData");

          var aNewArr = [];
          var product = [];
          var toloc = [];
          for (var D = 0; D < aTableArr.length; D++) {
            product.push(aTableArr[D].Product);
            toloc.push(aTableArr[D].toloacation);
          }
          var aFilters = product.map(function (value) {
            return new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, value);
          });

          var oFilter2 = new sap.ui.model.Filter({
            filters: aFilters,
            and: false
          });
          oModel.read("/ZRES_MATERIAL", {
            //   filters: [oFilter, oFilter1],
            filters: [oFilter],

            success: function (ores) {
              aNewArr.push(ores.results[0]);
              aTableArr.map(function (items) {
                aNewArr.map(function (item) {
                  if (items.Product === item.Product) {
                    items.ProductManufacturerNumber = aNewArr[0].ProductManufacturerNumber;
                    items.description = aNewArr[0].ProductDescription;
                    items.BillOfMaterialItemUnit = aNewArr[0].BaseUnit;
                    items.StockQty = aNewArr[0].StockQty;
                  }
                })
              })
              oModel.read("/Bom_View", {
                filters: [oFilter2],
                success: function (ores1) {
                  if (ores1.results.length === 0) {
                    aTableArr.map(function (items) {
                      aNewArr.map(function (item) {
                        if (items.Product === item.Product) {
                          items.ProductManufacturerNumber = aNewArr[0].ProductManufacturerNumber;
                          items.description = aNewArr[0].ProductDescription;
                          items.BillOfMaterialItemUnit = aNewArr[0].BaseUnit;
                          //      items.StockQty = aNewArr[0].StockQty;
                        }
                      })
                    })
                  }
                  else {
                    aTableArr.map(function (items) {
                      aNewArr.map(function (item) {
                        if (items.Product === item.Product) {
                          items.ProductManufacturerNumber = aNewArr[0].ProductManufacturerNumber;
                          items.description = aNewArr[0].ProductDescription;
                          items.BillOfMaterialItemUnit = aNewArr[0].BaseUnit;
                          //     items.StockQty = ores1.results[0].StockQty;
                          // items.StockQty = ores1.results[0].StockQty;

                        }
                      })
                    })
                  }


                }.bind(this),
                error: function () {
                  aTableArr.map(function (items) {
                    aNewArr.map(function (item) {
                      if (items.Product === item.Product) {
                        items.ProductManufacturerNumber = aNewArr[0].ProductManufacturerNumber;
                        items.description = aNewArr[0].ProductDescription;
                        items.BillOfMaterialItemUnit = aNewArr[0].BaseUnit;
                        //      items.StockQty = aNewArr[0].StockQty;

                      }
                    })
                  })
                }
              })
              // oBusy.close();
              this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr);
            }.bind(this)
          })

        }
        else if (movementType === "201" && FromLocation != "") {
          var oContext = oEvent.getSource().getBindingContext('oTableDataModel').getObject();
          var Product = oEvent.mParameters.value;
          var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES")
          var oFilter = new sap.ui.model.Filter("Product", "EQ", Product)
          var oFilter1 = new sap.ui.model.Filter("toloacation", "EQ", FromLocation);

          var aTableArr = this.getView().getModel("oTableDataModel").getProperty("/aTableData");

          var aNewArr = [];
          var product = [];
          var toloc = [];
          for (var D = 0; D < aTableArr.length; D++) {
            product.push(aTableArr[D].Product);
            toloc.push(aTableArr[D].FromLocation);
          }
          var aFilters = product.map(function (value) {
            return new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, value);
          });

          var oFilter2 = new sap.ui.model.Filter({
            filters: aFilters,
            and: false
          });
          oModel.read("/ZRES_MATERIAL", {
            //    filters: [oFilter, oFilter1],
            filters: [oFilter],

            success: function (ores) {
              aNewArr.push(ores.results[0]);
              aTableArr.map(function (items) {
                aNewArr.map(function (item) {
                  if (items.Product === item.Product) {
                    items.ProductManufacturerNumber = aNewArr[0].ProductManufacturerNumber;
                    items.description = aNewArr[0].ProductDescription;
                    items.BillOfMaterialItemUnit = aNewArr[0].BaseUnit;
                    items.StockQty = aNewArr[0].StockQty;
                  }
                })
              })
              oModel.read("/Bom_View", {
                filters: [oFilter2],
                success: function (ores1) {
                  if (ores1.results.length === 0) {
                    aTableArr.map(function (items) {
                      aNewArr.map(function (item) {
                        if (items.Product === item.Product) {
                          items.ProductManufacturerNumber = aNewArr[0].ProductManufacturerNumber;
                          items.description = aNewArr[0].ProductDescription;
                          items.BillOfMaterialItemUnit = aNewArr[0].BaseUnit;
                          //      items.StockQty = aNewArr[0].StockQty;
                        }
                      })
                    })
                  }
                  else {
                    aTableArr.map(function (items) {
                      aNewArr.map(function (item) {
                        if (items.Product === item.Product) {
                          items.ProductManufacturerNumber = aNewArr[0].ProductManufacturerNumber;
                          items.description = aNewArr[0].ProductDescription;
                          items.BillOfMaterialItemUnit = aNewArr[0].BaseUnit;
                          //     items.StockQty = ores1.results[0].StockQty;
                          // items.StockQty = ores1.results[0].StockQty;

                        }
                      })
                    })
                  }


                }.bind(this),
                error: function () {
                  aTableArr.map(function (items) {
                    aNewArr.map(function (item) {
                      if (items.Product === item.Product) {
                        items.ProductManufacturerNumber = aNewArr[0].ProductManufacturerNumber;
                        items.description = aNewArr[0].ProductDescription;
                        items.BillOfMaterialItemUnit = aNewArr[0].BaseUnit;
                        //      items.StockQty = aNewArr[0].StockQty;

                      }
                    })
                  })
                }
              })
              // oBusy.close();
              this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr);
            }.bind(this)
          })

        }
      },






      ChangeMaterialDescription1: function (oEvent) {
        var oBusy = new sap.m.BusyDialog({
          text: "Please Wait"
        });
        // oBusy.open();
        var oContext = oEvent.getSource().getBindingContext('oTableDataModel').getObject();
        var Product = oEvent.mParameters.value;
        var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEVICE_BIND_RES")
        var oFilter = new sap.ui.model.Filter("Product", "EQ", Product)
        var aTableArr = this.getView().getModel("oTableDataModel").getProperty("/aTableData");

        var aNewArr = [];

        oModel.read("/ZRES_MATERIAL", {
          filters: [oFilter],
          success: function (ores) {
            aNewArr.push(ores.results[0]);
            aTableArr.map(function (items) {
              aNewArr.map(function (item) {
                if (items.Product === item.Product) {
                  items.ProductManufacturerNumber = aNewArr[0].ProductManufacturerNumber;
                  items.description = aNewArr[0].ProductDescription;
                  items.BillOfMaterialItemUnit = aNewArr[0].BaseUnit;
                }
              })
            })
            // oBusy.close();
            this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr);
          }.bind(this)
        })
      },





      handleValueHelpCostCenter: function (oEvent) {
        var oView = this.getView();
        this.oSource = oEvent.getSource();
        this.sPath = oEvent.getSource().getBindingContext('oTableDataModel');
        // var sKey = this.oSource.getCustomData()[0].getKey();
        if (!this._pValueHelpDialog12) {
          this._pValueHelpDialog12 = Fragment.load({
            id: oView.getId(),
            name: "zppreservation.fragments.costcenter",
            controller: this
          }).then(function (oValueHelpDialog12) {
            oView.addDependent(oValueHelpDialog12);
            return oValueHelpDialog12;
          });
        }
        this._pValueHelpDialog12.then(function (oValueHelpDialog12) {
          // this._configValueHelpDialog(this.oSource);
          var oTemplate = new sap.m.StandardListItem({
            title: "{CostCenter}",

            //    description: "{ProductDescription}",
            description: "{CostCenterName}",
            //    description: "{description}",


            type: "Active"
          });
          oValueHelpDialog12.bindAggregation("items", {
            path: '/COST_CENTER',
            length: 30,
            template: oTemplate,
          });
          oValueHelpDialog12.setTitle("Select Cost Center");
          oValueHelpDialog12.open();
        }.bind(this));
      },

      onSearch_cost: function (oEvent) {
        var sValue = oEvent.getParameter("value");

        if (sValue.length > 20) {
          var oFilter = new Filter([
            //   new Filter("Product", FilterOperator.Contains, sValue),
            new Filter("CostCenterName", FilterOperator.Contains, sValue),

          ])
        }
        else {
          var oFilter = new Filter([

            new Filter("CostCenter", FilterOperator.Contains, sValue),
            new Filter("CostCenterName", FilterOperator.Contains, sValue),

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
      onValueHelpDialogClose_cost: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sPath = oEvent.getParameter("selectedContexts")[0].getPath();
        var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
        this.getView().byId("Price").setValue(oObject.CostCenter)
        //   //this.oSource = this.byId("productInput");
        //   if (!oSelectedItem) {
        //     this.oSource.resetProperty("value");
        //     return;
        //   }
        //  // this.getView().getModel('oTableDataModel').getProperty(this.sPath).Product = oObject.Product;

        //   this.getView().getModel('oTableDataModel').setProperty(this.sPath, this.getView().getModel('oTableDataModel').getProperty(this.sPath));

        //   this.oSource.setValue(oSelectedItem.getTitle());

        // this.getView().getModel('oTableDataModel').setProperty(this.sPath, this.getView().getModel('oTableDataModel').getProperty(this.sPath));
        // this.oSource.setValue(oSelectedItem.getDescription());




      },





      // SingleRowAdd: function () {

      //   var myArr = [];
      //   var obj = {
      //     "Material": "",
      //     "MaterialLong": "",
      //     "MaterialDes": "",
      //     "Quality": "",
      //     "Location": "",
      //     "AvailStock": "",
      //     "FromPlant": "",
      //     "ToPlant": "",
      //     "FromLocation": "",
      //     "ToLocation": "",


      //   }
      //   myArr.push(obj)
      //   this.getView().getModel('oTableDataModel').setProperty("/aTableData", myArr);

      // },



      handleDelete: function (oEvent) {
        var oTable = oEvent.getSource().getParent().getParent();
        var aSelectedIndex = oTable.getSelectedIndices();
        var aTableArr = this.getView().getModel("oTableDataModel").getProperty("/aTableData")
        var aNewArr = []
        for (var i = 0; i < aTableArr.length; i++) {
          var ind = aSelectedIndex.indexOf(i)
          if (ind == -1) {
            aNewArr.push(aTableArr[i])
          }
        }
        this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr);




      },



      fetchToken1: function () {
        var ToLocation = this.getView().byId("idToLocation").getValue();
        var FromLocation = this.getView().byId("idFromLocation").getValue();

        if (ToLocation == "" || FromLocation) {
          MessageBox.error("Please Fill From Location & To Location");
        }
        else {
          var oBusyDialog = new sap.m.BusyDialog({
            text: "Please Wait"
          });
          oBusyDialog.open();


          var tableListitem = [];         // for using loop to send response  
          var Product = this.getView().byId("Material").getValue();
          console.log(Product);

          var ToLocation = this.getView().byId("idToLocation").getValue();
          //  console.log(ToLocation);
          var FromLocation = this.getView().byId("Table_Input8").getValue();
          var model = this.getView().byId("idModel").getValue();

          var CurrentDate = new Date();
          var dt1 = Number(CurrentDate.getDate());
          var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
          var mm1 = Number(CurrentDate.getMonth() + 1);
          var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
          var CurrentDate1 = CurrentDate.getFullYear() + '-' + MM1 + '-' + DT1;


          // var oFirst_TableData = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
          // var oTable = this.getView().byId("table1");
          // var aSelectedIndex = oTable.getSelectedIndices();
          //  var oFirst_TableData = [];
          // for (var D = 0; D < oFirst_TableData.length; D++) {
          //   let index = aSelectedIndex.indexOf(D);
          //   if (index == -1) {
          //     oBusyDialog.close();
          //     MessageBox.error("Error");

          //   }
          //   else{
          //     oBusyDialog.close();
          //     oFirst_TableData.push(oFirst_TableData[D]);
          //   }
          // }

          var oFirst_TableData = this.getView().getModel("oTableDataModel").getProperty("/aTableData");

          var MyFirst_Table = [];
          oFirst_TableData.map(function (element) {
            tableListitem.push({

              "Product": element.Product,
              "MatlCompRequirementDate": CurrentDate1,
              "Plant": "1001",
              "GoodsMovementIsAllowed": true,
              "StorageLocation": element.FromLocation,
              "Batch": "",
              "ValuationType": "",
              "DebitCreditCode": "H",
              "GLAccount": "",
              "ResvnAccountIsEnteredManually": false,
              "EntryUnit": element.BillOfMaterialItemUnit,
              "ReservationItemIsFinallyIssued": false,
              "ReservationItmIsMarkedForDeltn": false,
              //  "ResvnItmRequiredQtyInEntryUnit": 1,

              "ResvnItmRequiredQtyInEntryUnit": Number(element.ResvnItmRequiredQtyInEntryUnit),
              //   "EntryUnit": "",
              "GoodsRecipientName": element.OrderID,

            })
          });


          oFirst_TableData.map(function (items) {
            var obj = {
              "Product": items.Product,
              "ProductDescription": items.ProductDescription,
              "StockQty": items.StockQty,
              "BaseUnit": items.BillOfMaterialItemUnit,
              "ResvnItmRequiredQtyInBaseUnit": items.ResvnItmRequiredQtyInBaseUnit,
              "StorageLocation": items.StorageLocation,
              "Batch": items.Batch,
              "FromLocation": items.FromLocation,

            }
            MyFirst_Table.push(obj);
          })

          var url = "/sap/opu/odata4/sap/api_reservation_document/srvd_a2x/sap/apireservationdocument/0001/ReservationDocument";

          $.ajax({

            type: "GET",
            url: url,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
              xhr.setRequestHeader('X-CSRF-Token', 'fetch');
            },
            complete: function (response) {
              var token = response.getResponseHeader('X-CSRF-Token');
              $.ajax({
                type: "post",
                url: url,
                headers: {
                  "X-CSRF-TOKEN": token,
                  "Accept": "application/json",
                  "Authorization": "Basic UFAwMTpOREdrbGRXVm5oc3l5bFZUekF6WUdNdXJvcHlOVEUtYXhUNmNBUHFn",
                },



                data: JSON.stringify({

                  "GoodsMovementType": "311",
                  "IssuingOrReceivingPlant": "1001",
                  "IssuingOrReceivingStorageLoc": ToLocation,
                  "ReservationDate": CurrentDate1,
                  "IsCheckedAgainstFactoryCal": true,
                  "WBSElement": "",
                  "OrderID": "",
                  "model": model,
                  "_ReservationDocumentItem": tableListitem

                }),
                contentType: "application/json; charset=utf-8",
                traditional: true,
                success: function (data) {
                  oBusyDialog.close();
                  let Reservation = data.Reservation;
                  MessageBox.success("Reservation Number: " + Reservation + " Generated Successfully", {
                    onClose: function (oAction) {
                      if (oAction === MessageBox.Action.OK) {
                        window.history.go(-1);

                      }
                    }.bind(this)

                  });


                }.bind(this),

                error: function (error) {
                  let message1 = error.responseJSON.error.message;
                  // MessageBox.error(message1);
                  MessageBox.error(message1, {
                    onClose: function (oAction) {
                      if (oAction === MessageBox.Action.CLOSE) {
                        //     window.location.reload();
                      }
                    }
                  });
                  oBusyDialog.close();
                }
              });
            }
          });
        }

      },




      fetchToken: function () {
        var model = this.getView().byId("idModel").getValue();
        var ToLocation = this.getView().byId("idToLocation").getValue();
        var FromLocation = this.getView().byId("idFromLocation").getValue();
        var RequiredDate = this.getView().byId("idDate1").getValue();
        var Supplier = this.getView().byId("idSupplier").getValue();
        var reservationNo = this.getView().byId("idReservationNo").getValue();
        var docNo = this.getView().byId("idDocNo").getValue();
        var costcenter = this.getView().byId("Price").getValue();
        var movementType = this.getView().byId("PriceControl").getValue();
        var plant = this.getView().byId("idFromPlant").getValue();
        if( plant ==""){
          MessageBox.error("Mandatory to select Plant")
        }
        else if (movementType == "201" && costcenter == "") {
          MessageBox.error("Fill Cost Center")
        } else {

          // if (movementType === "") {
          //   MessageBox.error("Mandatory to fill Movement Type")
          // }
          if (movementType == "201" && FromLocation == "" || RequiredDate == "") {
            MessageBox.error("Please Fill Required Date, From Location ");
          }
          else if (movementType == "311" && ToLocation == "" || FromLocation == "" || RequiredDate == "") {
            MessageBox.error("Please Fill Required Date, From Location & To Location")
          }
          else {




            var tableListitem = [];         // for using loop to send response  
            var Product = this.getView().byId("Material").getValue();
            console.log(Product);

            var ToLocation = this.getView().byId("idToLocation").getValue();
            //  console.log(ToLocation);
            var FromLocation1 = this.getView().byId("idFromLocation").getValue();

            var FromLocation = this.getView().byId("Table_Input8").getValue();

            var CurrentDate = new Date();
            var dt1 = Number(CurrentDate.getDate());
            var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
            var mm1 = Number(CurrentDate.getMonth() + 1);
            var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
            var CurrentDate1 = CurrentDate.getFullYear() + '-' + MM1 + '-' + DT1;


            // var oFirst_TableData = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
            // var oTable = this.getView().byId("table1");
            // var aSelectedIndex = oTable.getSelectedIndices();
            //  var oFirst_TableData = [];
            // for (var D = 0; D < oFirst_TableData.length; D++) {
            //   let index = aSelectedIndex.indexOf(D);
            //   if (index == -1) {
            //     oBusyDialog.close();
            //     MessageBox.error("Error");

            //   }
            //   else{
            //     oBusyDialog.close();
            //     oFirst_TableData.push(oFirst_TableData[D]);
            //   }
            // }

            var oFirst_TableData = this.getView().getModel("oTableDataModel").getProperty("/aTableData");

            var UoM_Error = [];
            var MyFirst_Table = [];
            for (var D = 0; D < oFirst_TableData.length; D++) {
              if (oFirst_TableData[D].BillOfMaterialItemUnit == "") {
                UoM_Error.push("Uom Error")
              }
            }
            if (UoM_Error.length != 0) {
              oBusyDialog.close();
              MessageBox.error("Unit Of Measure can't be Empty")
            } else {
              var aSameDataArr = [];
              var sameData = false;
              for (var D = 0; D < oFirst_TableData.length; D++) {
                if ((aSameDataArr.indexOf(oFirst_TableData[D].Product) != -1) && D != 0) {
                  sameData = true;
                  break;
                } else {
                  aSameDataArr.push(oFirst_TableData[D].Product)
                }

              }
              if (sameData == true) {
                MessageBox.error("Duplicate Material Number not allowed");
              }

              if (movementType === "") {
                MessageBox.error("Mandatory to fill Movement Type")
              }
               else {
                var oBusyDialog = new sap.m.BusyDialog({
                  text: "Please Wait..."
                });
                oBusyDialog.open();

                oFirst_TableData.map(function (element) {
                  tableListitem.push({

                    "Product": element.Product,
                    "MatlCompRequirementDate": RequiredDate,
                    "Plant": plant,
                    "GoodsMovementIsAllowed": true,
                    "StorageLocation": element.FromLocation,
                    "Batch": "",
                    "ValuationType": "",
                    "DebitCreditCode": "H",
                    "GLAccount": "",
                    "ResvnAccountIsEnteredManually": false,
                    "EntryUnit": element.BillOfMaterialItemUnit,
                    "ReservationItemIsFinallyIssued": false,
                    "ReservationItmIsMarkedForDeltn": false,
                    //  "ResvnItmRequiredQtyInEntryUnit": 1,

                    "ResvnItmRequiredQtyInEntryUnit": Number(element.ResvnItmRequiredQtyInEntryUnit),
                    //   "EntryUnit": "",
                    "GoodsRecipientName": element.OrderID,
                    "Remark": element.Remark,


                  })
                });


                oFirst_TableData.map(function (items) {
                  var obj = {
                    "Product": items.Product,
                    "ProductDescription": items.ProductDescription,
                    "StockQty": items.StockQty,
                    "BaseUnit": items.BillOfMaterialItemUnit,
                    "ResvnItmRequiredQtyInBaseUnit": items.ResvnItmRequiredQtyInBaseUnit,
                    "StorageLocation": items.StorageLocation,
                    "Batch": items.Batch,
                    "FromLocation": items.FromLocation,
                    "Remark": items.Remark,

                  }
                  MyFirst_Table.push(obj);
                })

                $.ajax({
                  type: "post",
                  url: "/sap/bc/http/sap/ZRESERVATION_0224?",
                  data: JSON.stringify({

                    "GoodsMovementType": movementType,
                    "IssuingOrReceivingPlant": plant,
                    "IssuingOrReceivingStorageLoc": ToLocation,
                    //       "FromLoc": FromLocation1,
                    "ReservationDate": RequiredDate,
                    "IsCheckedAgainstFactoryCal": true,
                    "WBSElement": "",
                    "OrderID": "",
                    "model": model,
                    "Supplier": Supplier,
                    "ProductHeader": Product,
                    "ReservationNo": reservationNo,
                    "DocumentNo": docNo,
                    "CostCenter": costcenter,
                    "_ReservationDocumentItem": tableListitem

                  }),
                  contentType: "application/json; charset=utf-8",
                  traditional: true,
                  // success: function (oresponse) {
                  //     if (oresponse.slice(0, 5) === 'ERROR') {
                  //         // oBusy.close();
                  //         oBusyDialog.close();
                  //         MessageBox.error(oresponse);


                  //     }
                  //     else {

                  //         // oBusy.close()
                  //         oBusyDialog.close();
                  //         MessageBox.success(oresponse, {

                  //             onClose: function (oAction) {
                  //                 if (oAction === MessageBox.Action.OK) {
                  //                     history.go(-1);

                  //                 }
                  //             }.bind(this)

                  //         });
                  //     }
                  // }.bind(this),

                  // error:function(error)
                  // {
                  //     MessageBox.error(error);
                  // }
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
                    }


                  }.bind(this),

                  // error: function (error) {
                  //  // let message1 = error.responseJSON.error.message;
                  //   // MessageBox.error(message1);
                  //   MessageBox.error("Data Not Save"+ error , {
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
            }
          }
        }
      },
      //  }
      // var url = "/sap/opu/odata4/sap/api_reservation_document/srvd_a2x/sap/apireservationdocument/0001/ReservationDocument";

      // $.ajax({

      //   type: "GET",
      //   url: url,
      //   contentType: "application/json",
      //   dataType: 'json',
      //   beforeSend: function (xhr) {
      //     xhr.setRequestHeader('X-CSRF-Token', 'fetch');
      //   },
      //   complete: function (response) {
      //     var token = response.getResponseHeader('X-CSRF-Token');
      //     $.ajax({
      //       type: "post",
      //       url: url,
      //       headers: {
      //         "X-CSRF-TOKEN": token,
      //         "Accept": "application/json",
      //         "Authorization": "Basic UFAwMTpOREdrbGRXVm5oc3l5bFZUekF6WUdNdXJvcHlOVEUtYXhUNmNBUHFn",
      //       },



      //       data: JSON.stringify({

      //         "GoodsMovementType": "311",
      //         "IssuingOrReceivingPlant": "1001",
      //         "IssuingOrReceivingStorageLoc": ToLocation,
      //         "ReservationDate": CurrentDate1,
      //         "IsCheckedAgainstFactoryCal": true,
      //         "WBSElement": "",
      //         "OrderID": "",
      //         "_ReservationDocumentItem": tableListitem

      //       }),
      //       contentType: "application/json; charset=utf-8",
      //       traditional: true,
      //       success: function (data) {
      //         oBusyDialog.close();
      //         let Reservation = data.Reservation;
      //         // MessageBox.success("Reservation Number: " + Reservation + " Generated Succesfully", {
      //         //   onClose: function (oAction) {
      //         //     if (oAction === MessageBox.Action.OK) {
      //         //       window.history.go(-1);

      //         //     }
      //         //   }.bind(this)

      //         //   });
      //         MessageBox.success("Reservation Number: " + Reservation + " Generated Succesfully", {
      //           actions: ["Print", MessageBox.Action.CLOSE],
      //           emphasizedAction: "Print",
      //           onClose: function (sAction) {
      //             if (sAction == "Print") {
      //               var oBusyDialog = new sap.m.BusyDialog({
      //                 title: "Loading",
      //                 text: "Please wait"
      //               });
      //               oBusyDialog.open();


      //               // var RFQNo = oContext.RequestForQuotation;
      //               var Reservation = data.Reservation;

      //               var url1 = "/sap/bc/http/sap/ZRESERVATIONSLIP?sap-client=080";
      //               var url2 = "&reservation=";


      //               var url4 = url2 + Reservation;


      //               var url = url1 + url4;
      //               // var username = "nvlabap3";
      //               // var password = "Mike$1245";
      //               $.ajax({
      //                 url: url,
      //                 type: "GET",
      //                 beforeSend: function (xhr) {
      //                   xhr.withCredentials = true;
      //                   // xhr.username = username;
      //                   // xhr.password = password;
      //                 },
      //                 success: function (result) {
      //                   var decodedPdfContent = atob(result);
      //                   var byteArray = new Uint8Array(decodedPdfContent.length);
      //                   for (var i = 0; i < decodedPdfContent.length; i++) {
      //                     byteArray[i] = decodedPdfContent.charCodeAt(i);
      //                   }
      //                   var blob = new Blob([byteArray.buffer], {
      //                     type: 'application/pdf'
      //                   });
      //                   var _pdfurl = URL.createObjectURL(blob);

      //                   if (!this._PDFViewer) {
      //                     this._PDFViewer = new sap.m.PDFViewer({
      //                       width: "auto",
      //                       source: _pdfurl
      //                     });
      //                     jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
      //                   } else {
      //                     this._PDFViewer = new sap.m.PDFViewer({
      //                       width: "auto",
      //                       source: _pdfurl
      //                     });
      //                     jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
      //                   }
      //                   oBusyDialog.close();
      //                   this._PDFViewer.open();
      //                 }.bind(this)

      //               });
      //               window.history.go(-1);

      //             } else {
      //               window.history.go(-1);
      //             }
      //           }
      //         });

      //       }.bind(this),

      //       error: function (error) {
      //         let message1 = error.responseJSON.error.message;
      //         // MessageBox.error(message1);
      //         MessageBox.error(message1, {
      //           onClose: function (oAction) {
      //             if (oAction === MessageBox.Action.CLOSE) {
      //               //     window.location.reload();
      //             }
      //           }
      //         });
      //         oBusyDialog.close();
      //       }
      //     });
      //   }
      // });









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
            "StockQty": items.StockQty,
            "BaseUnit": items.BaseUnit,
            "ResvnItmRequiredQtyInBaseUnit": items.ResvnItmRequiredQtyInBaseUnit,
            "StorageLocation": items.StorageLocation,
            "Batch": items.Batch,
            "FromLocation": items.FromLocation,

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
            //  MessageBox.success("Data Save Successfully" + Reservation);
            MessageBox.success(data + "Data Save Successfully");
          }.bind(this),
          error: function (error) {
            MessageBox.error("Data Not Save");
            oBusyDialog.close();
          }

        });

      },


      //Table Component Field Fragment
      handleValueHelpMaterial: function (oEvent) {

        var oView = this.getView();
        this.oSource = oEvent.getSource();
        this.sPath = oEvent.getSource().getBindingContext('oTableDataModel').getPath();
        // var sKey = this.oSource.getCustomData()[0].getKey();
        if (!this._pValueHelpDialog1) {
          this._pValueHelpDialog1 = Fragment.load({
            id: oView.getId(),
            name: "zppreservation.fragments.materialvaluehelp",
            controller: this
          }).then(function (oValueHelpDialog1) {
            oView.addDependent(oValueHelpDialog1);
            return oValueHelpDialog1;
          });
        }
        this._pValueHelpDialog1.then(function (oValueHelpDialog1) {
          // this._configValueHelpDialog(this.oSource);
          var oTemplate = new sap.m.StandardListItem({
            title: "{Product}",

            //    description: "{ProductDescription}",
            description: "{ProductManufacturerNumber}",
            //    description: "{description}",


            type: "Active"
          });
          oValueHelpDialog1.bindAggregation("items", {
            path: '/ZRES_MATERIAL_F4',
            length: 30,
            template: oTemplate,
          });
          oValueHelpDialog1.setTitle("Select Component");
          oValueHelpDialog1.open();

        }.bind(this));
      },

      onSearch: function (oEvent) {
        var sValue = oEvent.getParameter("value");

        if (sValue.length > 20) {
          var oFilter = new Filter([
            new Filter("ProductManufacturerNumber", FilterOperator.Contains, sValue),

          ])
        }
        else {
          var oFilter = new Filter([

            new Filter("Product", FilterOperator.Contains, sValue),
            new Filter("ProductManufacturerNumber", FilterOperator.Contains, sValue),

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
      onValueHelpDialogClose_Component: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sPath = oEvent.getParameter("selectedContexts")[0].getPath();
        var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
        //this.oSource = this.byId("productInput");
        var aTableArr = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
        var len = aTableArr.length;
        var avlData = false;
        if (!oSelectedItem) {
          this.oSource.resetProperty("value");
          return;
        }
        for (var D = 0; D < len - 1; D++) {
          if (oObject.Product == aTableArr[D].Product) {
            avlData = true;

          }
        }

        if (avlData == false) {
          this.getView().getModel('oTableDataModel').getProperty(this.sPath).Product = oObject.Product;
          this.getView().getModel('oTableDataModel').getProperty(this.sPath).ProductManufacturerNumber = oObject.ProductManufacturerNumber;
          this.getView().getModel('oTableDataModel').getProperty(this.sPath).description = oObject.ProductDescription;
          this.getView().getModel('oTableDataModel').getProperty(this.sPath).BillOfMaterialItemUnit = oObject.BaseUnit;

          this.getView().getModel('oTableDataModel').setProperty(this.sPath, this.getView().getModel('oTableDataModel').getProperty(this.sPath));

          this.oSource.setValue(oSelectedItem.getTitle());

          // this.getView().getModel('oTableDataModel').setProperty(this.sPath, this.getView().getModel('oTableDataModel').getProperty(this.sPath));
          // this.oSource.setValue(oSelectedItem.getDescription());
          sap.m.BusyDialog.close();

          this.ChangeMaterialDescription();
        } else {
          MessageBox.error("Duplicate Material No. not allowed choose different one")
        }






      },


      onSubmit: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
        var component = oEvent.mParameters.value;
        var componentdata = this.getView().getModel("oMaterialCodeModel").getProperty("/aMaterialCodeData")
        var oTableModel = this.getView().getModel("oTableDataModel")
        var aTableArr = oTableModel.getProperty("/aTableData")
        var aNewArr = [];

        componentdata.map(function (items) {
          if (component === items.Product) {
            aNewArr.push(items)
          }
        })

        aTableArr.map(function (items) {
          componentdata.map(function (item) {
            if (component === item.Product) {
              items.ComponentDescription = aNewArr[0].ProductDescription;
            }
          })
        })

        oTableModel.setProperty("/aTableData", aTableArr)



        // oEvent.getSource().getBindingContext("oTableDataModel").getObject().ComponentDescription = aNewArr[0].ProductDescription;
        // oContext.ComponentLong = ""
        // oContext.Ict = ""
        // oContext.Item = ""
        // oContext.ProductDescription = ""
        // oContext.Quantity = ""
        // oContext.UoM = ""
      },


    });
  });

