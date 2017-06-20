define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "dojo/_base/lang",
    "dojo/on",
    "dojo/text!SpecialLink/widget/template/SpecialLink.html"

], function(declare, _WidgetBase, _TemplatedMixin, lang, on, template) {
    "use strict";

    return declare("SpecialLink.widget.SpecialLink", [_WidgetBase, _TemplatedMixin], {
        templateString: template,

        // inputargs
        titleAttr: "",
        deeplinkAttr: "",
        onClickMicroflow: "",

        _contextObj: null,

        startup: function() {
            on(this.linkNode, "click", dojo.hitch(this, function(evt) {
                // Ctrl + left click is open in new tab, so do nothing
                if (!evt.ctrlKey && evt.button !== 1) {
                    evt.preventDefault();
                    this.execMf();
                }
            }));
        },

        update: function(obj, callback) {
            this._contextObj = obj;
            if (obj !== null) {
                this.linkNode.href = obj.get(this.deeplinkAttr);
                this.linkNode.innerText = obj.get(this.titleAttr);
            }
            this._executeCallback(callback, "update");
        },

        execMf: function() {
            if (this._contextObj && this.onClickMicroflow !== "") {
                var microflowParams = {
                    params: {
                        applyto: "selection",
                        actionname: this.onClickMicroflow,
                        guids: [this._contextObj.getGuid()]
                    },
                    error: lang.hitch(this, function(error) {
                        logger.error(this.id + ": An error occurred while executing microflow: " + error.description);
                    })
                };
                if (!mx.version || mx.version && parseInt(mx.version.split(".")[0]) < 7) {
                    // < Mendix 7
                    microflowParams.store = { caller: this.mxform };
                } else {
                    microflowParams.origin = this.mxform;
                }
                mx.data.action(microflowParams, this);
            }
        },

        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["SpecialLink/widget/SpecialLink"]);
