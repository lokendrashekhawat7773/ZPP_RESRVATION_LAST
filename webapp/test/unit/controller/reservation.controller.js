/*global QUnit*/

sap.ui.define([
	"zpp_reservation/controller/reservation.controller"
], function (Controller) {
	"use strict";

	QUnit.module("reservation Controller");

	QUnit.test("I should test the reservation controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
