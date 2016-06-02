function SettingDialog() {
    Dialog.call(this);
    this.title = "Setting Dialog";

    this.bind("click", function (event) {
        var node = Dom.findUpward(event.target, function (n) {
            return n.getAttribute && n.getAttribute("configName");
        });
        if (!node) return;
        var configName = node.getAttribute("configName");

        console.log("configName:", configName);
        if (node.type == "checkbox") {
            if (configName == "grid.enabled") {
                if (node.checked == false) {
                    this.textboxGridSize.disabled = true;
                } else {
                    this.textboxGridSize.disabled = false;
                }
                Config.set(configName, node.checked);
                CanvasImpl.setupGrid.apply(Pencil.controller.activePage.canvas);
            } else {
                Config.set(configName, node.checked);
            }
            this.setPreferenceItems();
        }
    }, this.settingTabPane);

    this.bind("change", function (event) {
        var node = Dom.findUpward(event.target, function (n) {
            return n.getAttribute && n.getAttribute("configName");
        });
        if (!node) return;
        var configName = node.getAttribute("configName");

        if (configName == "edit.gridSize") {
            if (this.checkboxEnableGrid.checked == true) {
                if (node.value == "" || parseInt(node.value) == 0) {
                    node.value = "5";
                }
            }
        }
        if (node.type == "number" || node.type == "text") {
            Config.set(configName, node.value);
            if (configName == "edit.gridSize") {
                CanvasImpl.setupGrid.apply(Pencil.controller.activePage.canvas);
            }
            this.setPreferenceItems();
        }
    }, this.settingTabPane);

    this.bind("click", function (event) {
        var checked = this.checkboxEnableGrid.checked;
        if (checked) {
            Dom.removeClass(this.textboxGridSize.parentNode, "Disabled");
        } else {
            Dom.addClass(this.textboxGridSize.parentNode, "Disabled");
        }
    }, this.checkboxEnableGrid);

    this.bind("click", function (event) {
        var checked = this.enableSnapping.checked;
        this.enableSnappingBackground.disabled = !this.enableSnapping.checked;
        if (checked) {
            Dom.removeClass(this.enableSnappingBackground.parentNode, "Disabled");
        } else {
            Dom.addClass(this.enableSnappingBackground.parentNode, "Disabled");
        }
    }, this.enableSnapping);

    this.bind("click", function (event) {
        var checked = this.undoEnabled.checked;
        if (checked) {
            Dom.removeClass(this.textboxUndoLevel.parentNode, "Disabled");
        } else {
            Dom.addClass(this.textboxUndoLevel.parentNode, "Disabled");
        }
    }, this.undoEnabled);

    this.bind("click", function (event) {
        var checked = this.checkboxScaleImage.checked;
        if (checked) {
            Dom.removeClass(this.textboxClipartBrowserScaleWidth.parentNode, "Disabled");
            Dom.removeClass(this.textboxClipartBrowserScaleHeight.parentNode, "Disabled");
        } else {
            Dom.addClass(this.textboxClipartBrowserScaleWidth.parentNode, "Disabled");
            Dom.addClass(this.textboxClipartBrowserScaleHeight.parentNode, "Disabled");
        }
    }, this.checkboxScaleImage);

    this.bind("input", function (event) {
        this.setPreferenceItems();
    }, this.preferenceNameInput);

}
__extend(Dialog, SettingDialog);

SettingDialog.prototype.setup = function () {
    this.checkboxEnableGrid.checked = Config.get("grid.enabled");
    this.snapToGrid.checked = Config.get("edit.snap.grid");
    this.enableSnapping.checked = Config.get("object.snapping.enabled");
    this.enableSnappingBackground.checked = Config.get("object.snapping.background");
    // this.embedImages.checked = Config.get("document.EmbedImages");
    this.quickEditting.checked = Config.get("quick.editting");
    this.cutAndPasteAtTheSamePlace.checked = Config.get("edit.cutAndPasteAtTheSamePlace");
    this.undoEnabled.checked = Config.get("view.undo.enabled");
    // this.checkboxScaleImage.checked = Config.get("clipartbrowser.scale");

    var gridSize = Config.get("edit.gridSize");
    if (gridSize == null) {
        Config.set("edit.gridSize", 8);
    }
    this.textboxGridSize.value = Config.get("edit.gridSize");

    // var w = Config.get("clipartbrowser.scale.width");
    // var h = Config.get("clipartbrowser.scale.height");
    // if (w == null) {
    //     Config.set("clipartbrowser.scale.width", 200);
    // }
    // if (h == null) {
    //     Config.set("clipartbrowser.scale.height", 200);
    // }

    // this.textboxClipartBrowserScaleWidth.value  = Config.get("clipartbrowser.scale.width");
    // this.textboxClipartBrowserScaleHeight.value = Config.get("clipartbrowser.scale.height");

    var level = Config.get("view.undoLevel");
    if (level == null) {
        Config.set("view.undoLevel", 20);
    }
    this.textboxUndoLevel.value = Config.get("view.undoLevel");

    var svgurl = Config.get("external.editor.vector.path", "/usr/bin/inkscape");
    var bitmapurl = Config.get("external.editor.bitmap.path", "/usr/bin/gimp");

    this.svgEditorUrl.value = svgurl;
    this.bitmapEditorUrl.value = bitmapurl;

    if (this.checkboxEnableGrid.checked) {
        Dom.removeClass(this.textboxGridSize.parentNode, "Disabled");
    } else {
        Dom.addClass(this.textboxGridSize.parentNode, "Disabled");
    }

    if (this.undoEnabled.checked) {
        Dom.removeClass(this.textboxUndoLevel.parentNode, "Disabled");
    } else {
        Dom.addClass(this.textboxUndoLevel.parentNode, "Disabled");
    }

    this.enableSnappingBackground.disabled = !this.enableSnapping.checked;
    if (this.enableSnapping.checked) {
        Dom.removeClass(this.enableSnappingBackground.parentNode, "Disabled");
    } else {
        Dom.addClass(this.enableSnappingBackground.parentNode, "Disabled");
    }

    // if (this.checkboxScaleImage.checked) {
    //     Dom.removeClass(this.textboxClipartBrowserScaleWidth.parentNode, "Disabled");
    //     Dom.removeClass(this.textboxClipartBrowserScaleHeight.parentNode, "Disabled");
    // } else {
    //     Dom.addClass(this.textboxClipartBrowserScaleWidth.parentNode, "Disabled");
    //     Dom.addClass(this.textboxClipartBrowserScaleHeight.parentNode, "Disabled");
    // }
    this.initializePreferenceTable();
};

SettingDialog.prototype.initializePreferenceTable = function () {
    this.preferenceTable.column(new DataTable.PlainTextColumn("Preference Name", function (data) {
        return data.name;
    }).width("1*"));
    this.preferenceTable.column(new DataTable.PlainTextColumn("Status", function (data) {
        return data.status;
    }).width("7em"));
    this.preferenceTable.column(new DataTable.PlainTextColumn("Type", function (data) {
        return data.type;
    }).width("7em"));
    this.preferenceTable.column(new DataTable.PlainTextColumn("Value", function (data) {
        return data.value;
    }).width("15em"));

    this.preferenceTable.selector(false);
    var thiz = this;
    window.setTimeout(function () {
        thiz.preferenceTable.setup();
        thiz.preferenceTable.setDefaultSelectionHandler({
            run: function (data) {
                if (data.type == "boolean") {
                    Config.set(data.name, !data.value);
                    if (data.name == "grid.enabled") {
                        thiz.checkboxEnableGrid.checked = !data.value;
                        if (!data.value == false) {
                            thiz.textboxGridSize.disabled = true;
                        } else {
                            thiz.textboxGridSize.disabled = false;
                        }
                        CanvasImpl.setupGrid.apply(Pencil.controller.activePage.canvas);
                    }
                    thiz.setPreferenceItems();
                } else {
                    Dialog.prompt(data.name, data.value, "OK", function (value) {
                        data.value = value;
                        var result = value;
                        if (data.type != "string") {
                            result = parseInt(value);
                        }
                        if (data.name == "edit.gridSize") {
                            if (parseInt(result) == 0 ) {
                                result = 5;
                                data.value = "5";
                            }
                            Config.set(data.name, result);
                            thiz.textboxGridSize.value = result;
                            CanvasImpl.setupGrid.apply(Pencil.controller.activePage.canvas);
                        } else {
                            Config.set(data.name, result);
                        }

                        thiz.setPreferenceItems();
                    }, "Cancel");
                }

            }
        });
        thiz.setPreferenceItems();
    }, 200);
};

SettingDialog.prototype.setPreferenceItems = function () {
    var items = [];
    Config._load();
    var query = this.preferenceNameInput.value;
    for (var configName in Config.data) {
        if (configName.indexOf(query) < 0) continue;
        var value = Config.data[configName];
        if (typeof(value)=="object") continue;
        items.push({
            name: configName,
            status: "user set",
            value: value,
            type: typeof(value)
        });
    };
    this.preferenceTable.setItems(items);
};

SettingDialog.prototype.getDialogActions = function () {
    return [
        Dialog.ACTION_CLOSE
    ];
};
