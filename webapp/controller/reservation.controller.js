sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent",

    ],
    function(BaseController, UIComponent) {
      "use strict";
  
      return BaseController.extend("zppreservation.controller.reservation", {
        onInit() {
            UIComponent.getRouterFor(this).getRoute('Routereservation').attachPatternMatched(this.firstScreenRefrash, this);
            
        },
        firstScreenRefrash: function(){
            this.getView().byId("docfr").setValue();

        },



       

        handlePrint: function () {
          // this.getOwnerComponent().getRouter().navTo("View1");
          var oBusyDialog = new sap.m.BusyDialog({
              title: "Loading...",
              text: "Please wait..."
          });
          oBusyDialog.open();
          var matdoc = this.getView().byId("docfr").getValue();
          //	this.getView().byId("docfr").setValue(data.Reservation);
  
  
          //  https://my406746.s4hana.cloud.sap:443/sap/bc/http/sap/ZRESERVATIONSLIP?sap-client=080
  
          var url1 = "/sap/bc/http/sap/ZRESERVATIONSLIP?sap-client=080";
          var url2 = "&reservation=";
  
  
          var url4 = url2 + matdoc;
  
  
          var url = url1 + url4;
  
          // var username = "nvlabap3";
          // var password = "Mike$1245";
          $.ajax({
              url: url,
              type: "GET",
              beforeSend: function (xhr) {
                  xhr.withCredentials = true;
                  // xhr.username = username;
                  // xhr.password = password;
              },
              success: function (result) {
                  var decodedPdfContent = atob(result);
                  var byteArray = new Uint8Array(decodedPdfContent.length);
                  for (var i = 0; i < decodedPdfContent.length; i++) {
                      byteArray[i] = decodedPdfContent.charCodeAt(i);
                  }
                  var blob = new Blob([byteArray.buffer], {
                      type: 'application/pdf'
                  });
                  var _pdfurl = URL.createObjectURL(blob);
  
                  if (!this._PDFViewer) {
                      this._PDFViewer = new sap.m.PDFViewer({
                          width: "auto",
                          source: _pdfurl
                      });
                      jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
                  } else {
                      this._PDFViewer = new sap.m.PDFViewer({
                          width: "auto",
                          source: _pdfurl
                      });
                      jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
                  }
                  oBusyDialog.close();
                  this._PDFViewer.open();
              }.bind(this)
          });
  
       },
  

        NextView: function () {
          var Radio = this.byId("idActionRadioBtnGroup").getSelectedButton().getText();
          if( Radio === "Production Order Reservation"){
            var oRefresh = {
                oRefresh:true, 
            }
            this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(oRefresh), "oCommonModel")
              UIComponent.getRouterFor(this).navTo("firstscreen");
          }
          else if( Radio === "Manual Reservation"){

              UIComponent.getRouterFor(this).navTo("manual");
          }
          }
        
      });
    });
  