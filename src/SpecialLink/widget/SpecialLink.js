define([
	"dojo/_base/declare",
	"mxui/widget/_WidgetBase",
	"dijit/_TemplatedMixin",

	"mxui/dom",
	"dojo/dom",
	"dojo/dom-prop",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-construct",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/text",
	"dojo/html",
	"dojo/on",
	"dojo/_base/event",
	"dojo/text!SpecialLink/widget/template/SpecialLink.html"

], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, on, dojoEvent, template) {
	"use strict";

	return declare("SpecialLink.widget.SpecialLink", [_WidgetBase, _TemplatedMixin], {
		templateString: template,

		// inputargs
		titleAttr: '',
		deeplinkAttr: '',
		onClickMicroflow: '',

		_contextObj: null,

		startup: function () {
			on(this.linkNode, "click", dojo.hitch(this, function (evt) {
				// Ctrl + left click is open in new tab, so do nothing
				if (!evt.ctrlKey && !evt.button === 1) {
					evt.preventDefault();
					this.execMf();
				}
			}))
		},

		update: function (obj, callback) {
			this._contextObj = obj;
			if (obj != null) {
				this.linkNode.href = obj.get(this.deeplinkAttr);
				this.linkNode.innerText = obj.get(this.titleAttr);
			}
			mendix.lang.nullExec(callback);
		},

		execMf: function () {
			if (this._contextObj && this.onClickMicroflow != "") {
				mx.data.action({
					params: {
						applyto: "selection",
						actionname: this.onClickMicroflow,
						guids: [this._contextObj.getGuid()]
					},
					store: {
						caller: this.mxform
					},
					callback: function (obj) {
						//TODO what to do when all is ok!
					},
					error: dojoLang.hitch(this, function (error) {
						logger.error(this.id + ": An error occurred while executing microflow: " + error.description);
					})
				}, this);
			}
		}
	});
});

require(["SpecialLink/widget/SpecialLink"]);
