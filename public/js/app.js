function generate_guid() {
    return "xxxxxx".replace(/[xy]/g, function(e) {
        var t = 16 * Math.random() | 0,
            i = "x" == e ? t : 3 & t | 8;
        return i.toString(16)
    })
}

function commarize(e) {
    e += "", x = e.split("."), x1 = x[0], x2 = x.length > 1 ? "." + x[1] : "";
    for (var t = /(\d+)(\d{3})/; t.test(x1);) x1 = x1.replace(t, "$1,$2");
    return x1 + x2
}

function cookie_set(e, t, i) {
    var s, n = "";
    i && (s = new Date, s.setTime(s.getTime() + 864e5 * i), n = "; expires=" + s.toGMTString()), document.cookie = e + "=" + t + n + "; path=/"
}

function cookie_get(e) {
    var t, i = e + "=",
        s = "",
        n = document.cookie.split(";");
    for (t = 0; t < n.length, s = n[t]; t++)
        if (s = s.trim(), 0 === s.indexOf(i)) return s.substring(i.length, s.length);
    return null
}

function cookie_delete(e) {
    cookie_set(e, "", -1)
}

function goodbye(e) {
    return app.show_leaving_confirm ? "You are about to leave Designer, you will lose any unsaved data if you continue." : void 0
}
String.prototype.toCamel = function() {
    var e = this.replace(/(?:^\w|[A-Z]|\b\w)/g, function(e, t) {
        return 0 === t ? e.toLowerCase() : e.toUpperCase()
    }).replace(/\s+/g, "");
    return e = e.substr(0, 1).toUpperCase() + e.substr(1), e.replace(/-/g, "")
}, String.prototype.toDash = function() {
    return this.toLowerCase().replace(/([A-Z])/g, function(e) {
        return "-" + e.toLowerCase()
    })
}, String.prototype.toTitle = function() {
    return this.replace(/-/g, " ").replace(/\w\S*/g, function(e) {
        return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase()
    })
};
var app = {

    element: null,
    menubar: null,
    assets_accordion: null,
    designer: null,
    product_manager: null,
    status_bar: null,
    status_bar_content: null,
    drag_type: null,
    project_notes: null,
    json_version: 3,
    storage_key: "ld_prj_03",
    current_facscia_color: null,
    has_lights: !1,
    has_furniture: !1,
    _menubar_height: 0,
    _sidebar_width: 0,
    _status_bar_height: 0,
    show_leaving_confirm: null,
    api_url: "https://designer.kiko.com/api/",
    api: null,
    colours: {
        main: "#00a950"
    },
    init: function() {
        this.show_leaving_confirm = !0, "designer.bg.dev" == document.domain && (this.show_leaving_confirm = !1, this.api_url = "https://designer.bg.dev/api/"), this.api = {
            get: {
                projects: this.api_url + "projects",
                project: this.api_url + "project",
                designs: this.api_url + "designs",
                design: this.api_url + "design",
                areas: this.api_url + "areas",
                area: this.api_url + "area",
                share: this.api_url + "share"
            },
            post: {
                project: this.api_url + "project",
                design: this.api_url + "design",
                area: this.api_url + "area",
                share: this.api_url + "share",
                export_image: this.api_url + "export_image"
            },
            put: {
                project: this.api_url + "project",
                design: this.api_url + "design",
                area: this.api_url + "area",
                share: this.api_url + "share"
            },
            "delete": {
                project: this.api_url + "project",
                design: this.api_url + "design",
                area: this.api_url + "area",
                share: this.api_url + "share"
            }
        }, app.body = $(document.body), this.element = $("#lighting_designer"), $("button").button(), this.designer.init(), this.product_manager.init(), app.project_manager.init(), $("#note_text").maxlength({
            max: 100
        }), this.project_notes = "", app.ui.getting_started.show(), app.ui.init()
    },
    pub: function(e, t) {
        $(document).trigger(e, t)
    },
    sub: function(e, t, i) {
        $(document).on(e, $.proxy(t, i || this))
    },
    set_loading: function(e, t) {
        t ? e.append($('<div class="loading" />')) : e.find(".loading").remove()
    },
    is_dragging: function() {
        return app.dragging === !0
    },
    show_loading: function(e) {
        $("#loading-screen").slideDown(), $("#loading-screen-text").html(e)
    },
    hide_loading: function() {
        $("#loading-screen").slideUp()
    },
    set_status: function(e) {},
    clear_status: function() {}
};
app.debug = {
    export_as_sample: function() {
        var e = JSON.stringify(app.project_manager.selected_project),
            t = "app.sample_project = '" + e + "';",
            i = $("<textarea/>").css({
                width: 450,
                height: 420
            }).val(t),
            s = $("<div/>").append(i);
        s.dialog({
            width: 500,
            height: 500
        })
    },
    import_project: function() {
        var e = $('<input type="file" value="Open Project JSON File..." />'),
            t = $("<div/>").append(e);
        t.dialog({
            title: "Import from JSON file",
            modal: !0,
            buttons: {
                Import: function() {
                    var t = e.get(0).files[0],
                        i = new FileReader;
                    i.onload = function(e) {
                        var t = e.target.result,
                            i = $.parseJSON(t);
                        app.project_manager.projects = [i], app.project_manager.selected_project = i, app.project_manager.selected_design = app.project_manager.selected_project.designs[0], app.project_manager.selected_area = app.project_manager.selected_design.areas[0], app.pub("design_selected", [app.project_manager.selected_project, app.project_manager.selected_design])
                    }, i.readAsText(t, "UTF-8"), $(this).dialog("close")
                },
                Cancel: function() {
                    $(this).dialog("close")
                }
            }
        })
    },
    outlines: function() {
        $.each(project.layers, function(e, t) {
            $.each(t.children, function(e, t) {
                t.style.strokeColor = "red", t.style.strokeWidth = 1
            })
        }), view.draw()
    }
}, window.onbeforeunload = goodbye, app.ui = {
    tooltip: null,
    tooltip_shown: [],
    display_tooltips: null,
    compiled_templates: null,
    _pause_render: null,
    init: function() {
        this.pause_render = !1, this.compiled_templates = [], app.ui.menu_bar.init(), app.ui.create_panel.init(), app.ui.details_panel.init(), app.ui.room_controls.init(), app.ui.light_controls.init(), app.ui.asset_controls.init(), app.ui.designer_overlay.init(), app.ui.image_crop.init(), app.ui.message.init(), this.init_collapsibles(), this.init_togglables(), this.init_helper_tooltip(), this.init_tooltips(), this.init_no_backspace(), this.init_light_icon_images()
    },
    init_no_backspace: function() {
        $(document).on("keydown", function(e) {
            8 !== e.which || $(e.target).is("input, textarea") || e.preventDefault()
        })
    },
    init_light_icon_images: function() {
        app.product_manager.get_products("", $.proxy(function(e) {}, this))
    },
    validate_email: function(e) {
        var t = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return t.test(e)
    },
    init_collapsibles: function() {
        $(".collapsible .collapsible_header").click(function() {
            app.ui.toggle_collapsible($(this).parent())
        })
    },
    toggle_collapsible: function(e, t) {
        $(e).find(".collapsible_content")[t ? "slideDown" : "slideToggle"](100, function() {
            var e = $(this).is(":visible"),
                t = e ? "addClass" : "removeClass",
                i = $(this).parent();
            i[t]("expanded")
        })
    },
    init_togglables: function() {
        $(document.body).on("click", ".togglable:not(.manual)", function() {
            var e = $(this);
            e.hasClass("offable") && e.hasClass("active") ? e.removeClass("active") : (e.parent().find(".togglable.active").removeClass("active"), e.addClass("active"))
        })
    },
    render_template: function(e, t, i) {
        var s, n = "_tmpl_comp" + e;
        if (this.compiled_templates[n]) s = this.compiled_templates[n];
        else {
            var o = $("#" + e).html();
            s = Handlebars.compile(o)
        }
        var r = s(t);
        $(i).html(r)
    },
    on_dialog_hide: function() {
        $("body").removeClass("dialog_show"), app.dialog_showing = !1
    },
    on_dialog_show: function() {
        $("body").addClass("dialog_show"), app.dialog_showing = !0
    },
    draw: function() {
        app.designer.is_loading || this._pause_render || paper.view.draw()
    },
    is_paused: function() {
        return this._pause_render
    },
    pause_rendering: function() {
        this._pause_render = !0
    },
    resume_rendering: function() {
        this._pause_render = !1
    },
    show_tooltip: function(e, t, i) {
        if (this.display_tooltips && (!i || void 0 === this.tooltip_shown[e])) {
            $("#tooltip_text").html(e), this.tooltip.slideDown("fast");
            var s = t || 3e3;
            app._tooltip_timeout && window.clearTimeout(app.ui._tooltip_timeout), i && (this.tooltip_shown[e] = !0), app.ui._tooltip_timeout = window.setTimeout($.proxy(function() {
                this.hide_tooltip()
            }, this), s)
        }
    },
    hide_tooltip: function() {
        this.tooltip.slideUp("fast")
    },
    disable_tooltips: function() {
        window.cookie_set("disable_tooltips", !0, 30), this.display_tooltips = !1, this.hide_tooltip()
    },
    enable_tooltips: function() {
        window.cookie_delete("disable_tooltips"), this.display_tooltips = !0
    },
    refresh_tooltip_menu_item: function() {
        var e = this.display_tooltips ? "Hide" : "Show";
        $("#toggle_tooltips span").html(e + " Tooltips")
    },
    toggle_tooltips: function() {
        this.display_tooltips ? this.disable_tooltips() : this.enable_tooltips()
    },
    is_tooltips_enabled: function() {
        return !("true" === window.cookie_get("disable_tooltips"))
    },
    init_helper_tooltip: function() {
        this.tooltip = $("#tooltip"), this.tooltip.css("left", app.designer.element.position().left + app.designer.element.width() / 2 - this.tooltip.width() / 2), this.display_tooltips = this.is_tooltips_enabled(), this.refresh_tooltip_menu_item()
    },
    init_tooltips: function() {
        $("#furniture_container li").each(function(e, t) {
            t = $(t);
            var i = t.find(".txt").html();
            t.attr("rel", "tooltip"), t.attr("title", "Drag & drop " + i)
        }), $("#furniture_container").on("scroll", function() {
            $("div.tooltip").hide()
        }), $(".light_category li").each(function(e, t) {
            t = $(t);
            t.find(".txt").text();
            t.attr("rel", "tooltip"), t.attr("title", "Drag & drop light or select and draw")
        }), $(".light_category").on("scroll", function() {
            $("div.tooltip").hide()
        }), $("[rel=tooltip]").tooltip({
            container: "body",
            trigger: "hover"
        })
    },
    get_dialog_position: function() {
        var e = app.designer.element.offset(),
            t = app.designer.element.width();
        return [e.left + t / 2 - 250, e.top + 50]
    }
}, app.ui.menu_bar = {
    element: null,
    new_button: null,
    load_button: null,
    save_button: null,
    export_button: null,
    share_button: null,
    select_button: null,
    zoomin_button: null,
    zoomout_button: null,
    pan_button: null,
    fit_button: null,
    eraser_button: null,
    opacity_button: null,
    help_button: null,
    spaces_select_container: null,
    spaces_select: null,
    opacity: .5,
    init: function() {
        this.element = $("#menu_bar"), this.new_button = this.element.find("#menu_new"), this.load_button = this.element.find("#menu_load"), this.save_button = this.element.find("#menu_save"), this.export_button = this.element.find("#menu_export"), this.share_button = this.element.find("#menu_share"), this.select_button = this.element.find("#menu_select"), this.zoomin_button = this.element.find("#menu_zoomin"), this.zoomout_button = this.element.find("#menu_zoomout"), this.pan_button = this.element.find("#menu_pan"), this.fit_button = this.element.find("#menu_fit"), this.eraser_button = this.element.find("#menu_eraser"), this.help_button = this.element.find("#menu_help"), this.spaces_select_container = $("#space_selector_container"), this.spaces_select = $("#space_selector"), this.opacity_button = this.element.find("#menu_opacity"), this.opacity_button.find("#opacity_slider").slider({
            min: 0,
            max: 1,
            step: .05,
            value: this.opacity,
            disabled: !0,
            create: function() {
                $(this).find("a").html("<span />").find("span").html(100 * app.ui.menu_bar.opacity + "%")
            },
            slide: function(e, t) {
                app.ui.menu_bar.opacity = t.value, app.pub("opacity_slider_changed")
            }
        }), this.bind_events()
    },
    bind_events: function() {
        app.sub("design_selected", this.on_design_selected, this), app.sub("area_created", this.on_area_created, this), app.sub("area_name_updated", this.on_area_name_updated, this), app.sub("opacity_slider_changed", this.on_opacity_slider_change, this), app.sub("tool_activate", this.on_tool_activate, this), app.sub("tool_deactivate", this.on_tool_deactivate, this), this.new_button.click($.proxy(this.on_new_click, this)), this.load_button.click($.proxy(this.on_load_click, this)), this.save_button.click($.proxy(this.on_save_click, this)), this.export_button.click($.proxy(this.on_export_click, this)), this.share_button.click($.proxy(this.on_share_click, this)), this.select_button.click($.proxy(this.on_select_click, this)), this.zoomin_button.click($.proxy(this.on_zoomin_click, this)), this.zoomout_button.click($.proxy(this.on_zoomout_click, this)), this.pan_button.click($.proxy(this.on_pan_click, this)), this.fit_button.click($.proxy(this.on_fit_click, this)), this.eraser_button.click($.proxy(this.on_eraser_click, this)), this.help_button.click($.proxy(this.on_help_click, this)), this.spaces_select.focus($.proxy(this.on_spaces_select_click, this))
    },
    enable: function() {
        this.save_button.removeClass("disabled"), this.export_button.removeClass("disabled"), this.select_button.removeClass("disabled"), this.zoomin_button.removeClass("disabled"), this.zoomout_button.removeClass("disabled"), this.pan_button.removeClass("disabled"), this.fit_button.removeClass("disabled"), this.eraser_button.removeClass("disabled"), this.opacity_button.removeClass("disabled").find("#opacity_slider").slider({
            disabled: !1
        }), this.select_button.click()
    },
    on_tool_activate: function() {
        this.select_button.removeClass("active")
    },
    on_tool_deactivate: function() {
        this.select_button.addClass("active")
    },
    on_new_click: function() {
        app.designer.deactivate_tool(), app.ui.new_project.show(!1, !0)
    },
    on_load_click: function() {
        app.designer.deactivate_tool(), app.ui.open_project.show()
    },
    on_save_click: function() {
        app.designer.deactivate_tool(), app.project_manager.save_project()
    },
    on_export_click: function() {
        app.designer.deactivate_tool(), app.ui.export_dialog.show()
    },
    on_share_click: function() {
        app.designer.deactivate_tool(), app.ui.share_dialog.show()
    },
    on_select_click: function() {
        app.designer.deactivate_tool()
    },
    on_zoomin_click: function() {
        app.designer.zoom_in()
    },
    on_zoomout_click: function() {
        app.designer.zoom_out()
    },
    on_pan_click: function() {
        app.designer.toggle_tool("view.pan")
    },
    on_fit_click: function() {
        app.designer.zoom_to_fit()
    },
    on_eraser_click: function() {
        app.designer.toggle_tool("asset.erase")
    },
    on_help_click: function() {
        app.ui.help.show()
    },
    on_design_selected: function(e, t, i) {
        app.designer.deactivate_tool(), this.enable(), this.spaces_select_container.show(), this.refresh_space_selector(i), this.spaces_select.change($.proxy(this.on_space_selector_change, this)), app.project_manager.select_area(i.areas[0])
    },
    on_spaces_select_click: function() {
        app.designer.active_tool && app.designer.active_tool.cancel_free_draw && (app.designer.active_tool.cancel_free_draw(), app.ui.draw())
    },
    refresh_space_selector: function(e) {
        this.spaces_select.find("option").remove();
        for (var t = 0; t < e.areas.length; t++) {
            var i = e.areas[t];
            this.spaces_select.append(new Option(i.title, i.id, !0, !0))
        }
        this.spaces_select.append(new Option("Add new space...", "new", !0, !0)), app.project_manager.selected_area && this.spaces_select.prop("value", app.project_manager.selected_area.id)
    },
    on_space_selector_change: function() {
        app.designer.deactivate_tool();
        var e = this.spaces_select.val();
        if ("new" !== e) {
            var t = app.project_manager.find_area_by_id(e);
            app.project_manager.select_area(t)
        } else app.ui.add_area.show(!1, !1), app.project_manager.selected_area && this.spaces_select.prop("value", app.project_manager.selected_area.id)
    },
    on_area_created: function(e, t) {
        app.designer.deactivate_tool(), app.project_manager.selected_design && this.refresh_space_selector(app.project_manager.selected_design)
    },
    on_area_name_updated: function() {
        this.refresh_space_selector(app.project_manager.selected_design)
    },
    on_opacity_slider_change: function() {
        this.opacity_button.find("a span").html(Math.round(100 * app.ui.menu_bar.opacity) + "%"), app.designer.set_opacity(app.ui.menu_bar.opacity)
    }
}, app.ui.open_project = {
    dialog: null,
    events_initialised: null,
    not_logged_in: null,
    init: function() {},
    init_dialog: function() {
        this.not_logged_in = !1;
        var e = $("#open_project_dialog");
        this.dialog = e.dialog({
            title: "Load Project",
            width: 500,
            height: 450,
            modal: !1,
            dialogClass: "dialog_large",
            resizable: !1,
            draggable: !0,
            buttons: [],
            open: function() {
                app.ui.getting_started.hide(), app.ui.on_dialog_show()
            },
            beforeClose: $.proxy(function() {
                app.ui.on_dialog_hide(), app.project_manager.selected_project || this.not_logged_in || app.ui.getting_started.show()
            }, this)
        }), this.events_initialised || ($(document.body).on("click", ".project_name", $.proxy(this.on_project_click, this)), $(document.body).on("click", ".delete_design", $.proxy(this.on_delete_click, this)), $(document.body).on("click", ".delete_project", $.proxy(this.on_delete_project_click, this)), app.sub("not_logged_in", this.on_not_logged_in, this), app.sub("project_manager.project.ready", this.on_project_ready, this), this.events_initialised = !0)
    },
    show: function() {
        this.init_dialog(), $("#project_list").hide(), $("#project_list_loading").show(), app.project_manager.get_projects($.proxy(this.on_get_projects_callback, this)), this.dialog.dialog("open")
    },
    hide: function() {
        this.dialog && this.dialog.dialog("close")
    },
    on_get_projects_callback: function(e) {
        app.ui.render_template("project_list_template", e, "#project_list"), $("#project_list").show(), $("#project_list_loading").hide(), $("#no_projects_message button").button()
    },
    on_project_click: function(e) {
        var t = $(e.target).data("project-id");
        app.project_manager.select_project(t), $("#project_list").hide(), $("#project_list_loading").show()
    },
    on_project_ready: function() {
        this.hide()
    },
    on_delete_click: function(e) {},
    on_not_logged_in: function(e, t) {
        this.not_logged_in = !0, this.hide()
    },
    on_delete_project_click: function(e) {
        var t = "A" === e.target.tagName ? $(e.target) : $(e.target).closest("A");
        if (confirm("Are you sure you want to delete this project")) {
            var i = t.data("project-id");
            app.project_manager.delete_project(i, function(e) {
                $("#project_info_" + i).slideUp()
            })
        }
    }
}, app.ui.new_project = {
    dialog: null,
    is_new_project: null,
    floorplan_uploader: null,
    init: function() {
        this.bind_events()
    },
    bind_events: function() {
        app.sub("floorplan_upload_complete", this.on_floorplan_upload_complete, this)
    },
    init_dialog: function(e) {
        this.dialog || this.init(), this.floorplan_uploader = new app.ui.FloorplanUpload("#new_project_floorplan", !0), app.project_manager.init();
        var t = {};
        t["Continue..."] = $.proxy(function() {
            var e = $("#new_project_name").val(),
                t = $("#new_project_type").val(),
                i = $("#new_project_client").val(),
                s = $("#new_project_client_email").val();
            if ("" === e) return alert("The project name is required."), void $("#new_project_name").focus();
            if ("Choose..." === t) return alert("The project type is required."), void $("#new_project_type").focus();
            var n = "object" == typeof user ? user.name : "Retailer";
            this.floorplan_uploader.is_floorplan_selected() ? (app.project_manager.create_new_project(e, t, i, s), app.project_manager.create_new_design(n, "", !0), app.project_manager.create_new_area("Area 1", "", !0), this.floorplan_uploader.upload_pdf(e, t, "Area 1")) : (app.project_manager.create_new_project(e, t, i, s), app.project_manager.create_new_design(n, "", !0), app.project_manager.create_new_area("Area 1", "", !0), app.project_manager.select_new_project(), app.designer.initialize_new_area(), this.hide())
        }, this), e && (t.Back = $.proxy(function() {
            this.hide(), app.project_manager.selected_project || app.ui.getting_started.show()
        }, this)), e || (t.Cancel = $.proxy(function() {
            this.hide(), app.project_manager.selected_project || app.ui.getting_started.show()
        }, this));
        var i = $("#new_project_dialog");
        this.dialog = i.dialog({
            title: "Start From Scratch",
            width: 665,
            resizable: !1,
            draggable: !0,
            dialogClass: "dialog_large",
            buttons: t,
            open: function() {
                app.ui.getting_started.hide(), app.ui.on_dialog_show(), $(this).parent().find(".ui-dialog-titlebar-close").hide()
            },
            beforeClose: function() {
                app.ui.on_dialog_hide()
            }
        })
    },
    show: function(e, t) {
        t = "undefined" == typeof t ? !1 : t, this.is_new_project = t, this.init_dialog(e), app.project_manager.new_project || ($("#new_project_name").val(""), $("#new_project_type").val(""), $("#floorplan_file").val(""), $("#floorplan_pdf_page").val("1"))
    },
    hide: function() {
        this.dialog && this.dialog.dialog("close")
    },
    on_floorplan_upload_complete: function(e, t) {
        this.hide()
    }
}, app.ui.add_design = {
    dialog: null,
    is_new_project: null,
    init: function() {},
    init_dialog: function(e) {
        app.project_manager.init();
        var t = {};
        t["Continue..."] = $.proxy(function() {
            var e = $("#add_design_name").val();
            if ("" == e) return alert("The design name is required."), void $("#add_design_name").focus();
            app.project_manager.create_new_design(e, "", this.is_new_project);
            app.ui.add_area.show(!0, this.is_new_project)
        }, this), e && (t.Back = function() {
            app.ui.add_design.hide(), app.ui.new_project.show()
        }), e || (t.Cancel = function() {
            $(this).dialog("close")
        });
        var i = $("#add_design_dialog");
        this.dialog = i.dialog({
            title: "New Design...",
            width: 500,
            resizable: !1,
            draggable: !0,
            buttons: t,
            open: function() {
                app.ui.new_project.hide(), app.ui.on_dialog_show(), $(this).parent().find(".ui-dialog-titlebar-close").hide()
            },
            beforeClose: function() {
                app.ui.on_dialog_hide()
            }
        })
    },
    show: function(e, t) {
        t = "undefined" == typeof t ? !1 : t, this.is_new_project = t, this.dialog ? $(this.dialog).dialog("open") : this.init_dialog(e), $("#add_design_name").val("")
    },
    hide: function() {
        this.dialog && $(this.dialog).dialog("close")
    }
}, app.ui.add_area = {
    dialog: null,
    uploaded_floorplan_data: null,
    floorplan_uploader: null,
    init: function() {
        this.bind_events()
    },
    bind_events: function() {
        app.sub("floorplan_upload_complete", this.on_floorplan_upload_complete, this)
    },
    init_dialog: function(e) {
        this.dialog || this.init();
        var t = {};
        t["Continue..."] = $.proxy(function() {
            var e = $("#add_area_name").val();
            if ("" === e) return alert("The area name is required."), void $("#add_area_name").focus();
            if (this.floorplan_uploader.is_floorplan_selected()) {
                app.project_manager.create_new_area(e, "");
                this.floorplan_uploader.upload_pdf(app.project_manager.selected_project.title, app.project_manager.selected_project.type, e)
            } else {
                var t = app.project_manager.create_new_area(e, "");
                app.project_manager.select_area(t), app.designer.initialize_new_area(), this.hide()
            }
        }, this), e && (t.Back = function() {
            app.ui.add_design.dialog.show(), app.ui.add_area.dialog.hide()
        }), e || (t.Cancel = function() {
            $(this).dialog("close")
        });
        var i = $("#add_area_dialog");
        this.dialog = i.dialog({
            title: "New Area...",
            width: 500,
            resizable: !1,
            draggable: !0,
            buttons: t,
            open: function() {
                app.ui.add_design.hide(), app.ui.on_dialog_show(), $(this).parent().find(".ui-dialog-titlebar-close").hide()
            },
            beforeClose: function() {
                app.ui.on_dialog_hide()
            }
        })
    },
    show: function(e) {
        this.init_dialog(e), this.floorplan_uploader = new app.ui.FloorplanUpload("#new_area_floorplan"), $("#add_area_name").val("Area " + parseInt(app.project_manager.selected_design.areas.length + 1))
    },
    hide: function() {
        this.dialog && $(this.dialog).dialog("close")
    },
    on_floorplan_upload_complete: function(e, t) {
        this.hide()
    }
}, app.ui.image_crop = {
    dialog: null,
    uploaded_floorplan_data: null,
    is_new_project: null,
    initialised: null,
    img: null,
    init: function() {
        this.bind_events(), this.initialised = !0
    },
    bind_events: function() {
        app.sub("floorplan_upload_complete", this.on_floorplan_upload_complete, this), app.sub("image_crop.rotated", this.on_crop_rotate, this)
    },
    init_dialog: function(e) {
        this.initialised || this.init(), this.dialog = $("#image_crop_dialog").dialog({
            title: "Crop Floorplan PDF...",
            width: 600,
            height: 520,
            resizable: !1,
            draggable: !0,
            buttons: {
                "Continue...": function() {
                    app.ui.image_crop.crop_image()
                },
                Back: function() {
                    app.ui.image_crop.hide(), app.ui.new_project.show()
                }
            },
            open: function() {
                app.ui.add_area.hide(), app.ui.on_dialog_show(), $(this).parent().find(".ui-dialog-titlebar-close").hide()
            },
            beforeClose: function() {
                app.ui.on_dialog_hide()
            }
        })
    },
    show: function(e) {
        this.init_dialog(e), $("#crop_image_path").val(this.uploaded_floorplan_data.thumbnail), $("#full_image_path").val(this.uploaded_floorplan_data.image), this.img = $('<img src="' + this.uploaded_floorplan_data.thumbnail + '"/>'), $("#image_cropper").html(this.img), this.img.cropper({
            viewMode: 1,
            minCropBoxWidth: 20,
            minCropBoxHeight: 20,
            guides: !1,
            background: !1,
            dragMode: "none",
            zoomable: !1,
            zoomOnTouch: !1,
            zoomOnWheel: !1,
            toggleDragModeOnDblclick: !1
        }), $("#crop_rotate_slider").slider({
            min: -180,
            max: 180,
            step: .5,
            value: 0,
            create: function() {
                $(this).find("a").html("<span />").find("span").html("0&deg;")
            },
            slide: function(e, t) {
                app.pub("image_crop.rotated", t.value)
            }
        })
    },
    hide: function() {
        this.dialog && $(this.dialog).dialog("close")
    },
    on_crop_rotate: function(e, t) {
        this.img.cropper("rotateTo", t), $("#crop_rotate_slider a span").html(t + "&deg;")
    },
    crop_image: function() {
        var e = this.img.cropper("getData");
        $("#crop_data").val(JSON.stringify(e)), app.set_loading($(".crop_dialog"), !0), $("#crop_form").submit()
    },
    crop_image_callback: function(e) {
        if (app.set_loading($(".crop_dialog"), !1), e.success) app.ui.image_crop.hide(), $("#crop_rotate_slider a span").html("0&deg;"), "true" == this.is_new_project ? app.project_manager.select_new_project() : app.project_manager.select_area(app.project_manager.new_area), app.designer.initialize_new_area(), e.result && app.designer.import_background_image({
            url: e.result
        });
        else {
            var t = e.result || "An error has occured, please check the information and try again";
            alert(t)
        }
    },
    on_floorplan_upload_complete: function(e, t) {
        this.uploaded_floorplan_data = t.result, this.is_new_project = t.is_new_project, this.show()
    }
}, app.ui.create_panel = {
    current_mode: null,
    dialog: null,
    is_dialog_collapsed: null,
    dialog_collapse_button: null,
    element: null,
    tabs_element: null,
    rooms_tab: null,
    furniture_tab: null,
    lights_tab: null,
    rooms_panel: null,
    furniture_panel: null,
    lights_panel: null,
    init: function() {
        this.element = $("#create_panel"), this.tabs_element = $("#create_panel_tabs"), this.rooms_tab = this.tabs_element.find("#add_rooms"), this.furniture_tab = this.tabs_element.find("#add_furniture"), this.lights_tab = this.tabs_element.find("#add_lights"), this.rooms_panel = $("#add_rooms_panel"), this.furniture_panel = $("#add_furniture_panel"), this.lights_panel = $("#add_lights_panel"), this.bind_events(), app.ui.create_panel_rooms.init(), app.ui.create_panel_furniture.init(), app.ui.create_panel_lights.init()
    },
    bind_events: function() {
        app.sub("design_selected", this.show, this), app.sub("designer_light_selected", this.on_designer_light_selected, this), this.element.find("#add_rooms").click($.proxy(this.on_add_room_click, this)), this.element.find("#add_furniture").click($.proxy(this.on_add_furniture_click, this)), this.element.find("#add_lights").click($.proxy(this.on_add_lights, this))
    },
    init_dialog: function() {
        this.dialog_collapse_button = $('<a href="javascript:void(0);" class="ui-dialog-button-collapse"></a>'), this.dialog_collapse_button.click($.proxy(this.on_dialog_collapse_click, this)), this.dialog = this.element.dialog({
            title: "Create",
            width: 330,
            height: "auto",
            maxHeight: 400,
            modal: !1,
            dialogClass: "dialog_grey dialog_create",
            resizable: !1,
            draggable: !0,
            position: this.get_dialog_position(),
            buttons: [],
            open: function() {
                var e = $(window).height() - $(this).offset().top - 20;
                $(this).css("maxHeight", e);
                var t = $(this).parent().find(".ui-dialog-titlebar-close");
                app.ui.create_panel.dialog_collapse_button.insertBefore(t), t.hide()
            }
        }), this.dialog.parents(".ui-dialog").prepend(this.tabs_element), $(window).resize($.proxy(this.stick_to_screen, this))
    },
    on_dialog_collapse_click: function() {
        this.element.toggle(), this.is_dialog_collapsed = !this.is_dialog_collapsed;
        var e = this.dialog.parents(".ui-dialog");
        this.is_dialog_collapsed ? e.addClass("ui-dialog-collapsed") : e.removeClass("ui-dialog-collapsed")
    },
    show: function() {
        this.dialog || this.init_dialog(), this.dialog.dialog("open"), this.show_rooms()
    },
    set_title: function(e) {
        this.dialog.parent().find(".ui-dialog-title").html(e)
    },
    show_panel: function() {
        this.element.find(".create_panel").hide(), "rooms" == this.current_mode ? app.ui.create_panel_rooms.show() : "furniture" == this.current_mode ? app.ui.create_panel_furniture.show() : "lights" == this.current_mode && app.ui.create_panel_lights.show(), app.pub("add_mode_change", [this.current_mode])
    },
    show_rooms: function(e) {
        e ? (this.set_title("Step 1. Add Rooms"), this.current_mode = "rooms", this.show_panel()) : this.rooms_tab.click()
    },
    show_furniture: function(e) {
        e ? (this.set_title("Step 2. Add Furniture"), this.current_mode = "furniture", this.show_panel()) : this.furniture_tab.click()
    },
    show_lights: function(e) {
        e ? (this.set_title("Step 3. Lighting Design"), this.current_mode = "lights", this.show_panel()) : this.lights_tab.click()
    },
    on_add_room_click: function() {
        this.show_rooms(!0)
    },
    on_add_furniture_click: function() {
        this.show_furniture(!0)
    },
    on_add_lights: function() {
        this.show_lights(!0)
    },
    on_designer_light_selected: function() {
        this.show_lights()
    },
    get_dialog_position: function() {
        return [0, 140]
    },
    stick_to_screen: function() {
        if ($(this.dialog.parents(".ui-dialog")).is(":visible")) {
            var e = this.get_dialog_position();
            $(this.dialog).dialog("option", "position", e)
        }
    }
}, app.ui.create_panel_rooms = {
    element: null,
    draw_rect_button: null,
    draw_free_button: null,
    init: function() {
        this.element = $("#add_rooms_panel"), this.draw_rect_button = $("#room_draw_rect"), this.bind_events()
    },
    bind_events: function() {
        app.sub("add_mode_change", this.on_add_mode_change, this), app.sub("tool_room.draw_activate", this.on_room_draw_rect_activate, this), app.sub("tool_room.draw_deactivate", this.on_room_draw_rect_deactivate, this), this.draw_rect_button.click($.proxy(this.on_room_draw_rect_click, this))
    },
    show: function() {
        this.element.show()
    },
    on_room_draw_rect_activate: function() {
        this.element.find(".togglable.active").removeClass("active"), this.draw_rect_button.addClass("active")
    },
    on_room_draw_rect_deactivate: function() {
        this.draw_rect_button.removeClass("active")
    },
    on_room_draw_rect_click: function() {
        app.designer.toggle_tool("room.draw"), $.isEmptyObject(app.designer.rooms) && app.ui.show_tooltip("Draw your first room...")
    }
}, app.ui.create_panel_furniture = {
    element: null,
    init: function() {
        this.element = $("#add_furniture_panel"), this.element.find("ul.selectable li").draggable({
            opacity: .7,
            scroll: !1,
            appendTo: "body",
            helper: "clone",
            cursorAt: {
                left: -5
            },
            start: function(e, t) {
                app.drag_type = $(e.target).data("type-selected") || $(e.target).data("type"), app.dragging = !0, app.designer.dragging_new_asset = !0
            },
            stop: function(e, t) {
                app.designer.reset_cursor(), e.srcElement != app.designer.element[0] && app.designer.cancel_drop()
            }
        })
    },
    show: function() {
        this.element.show()
    }
}, app.ui.create_panel_lights = {
    element: null,
    selected_series: null,
    selected_product_type: null,
    selected_product: null,
    selected_designer_light: null,
    product_code_field: null,
    init: function() {
        this.element = $("#add_lights_panel"), this.bind_events(), this.element.find("ul.selectable li").draggable({
            opacity: .7,
            scroll: !1,
            appendTo: "body",
            helper: "clone",
            cursorAt: {
                left: -5
            },
            start: function(e, t) {
                app.drag_type = $(e.target).data("type-selected") || $(e.target).data("type"), app.dragging = !0, app.designer.dragging_new_asset = !0
            },
            stop: function(e, t) {
                app.designer.reset_cursor(), e.srcElement != app.designer.element[0] && app.designer.cancel_drop()
            }
        })
    },
    bind_events: function() {
        app.sub("designer_light_selected", this.on_designer_light_selected, this), app.sub("designer_light_unselected", this.on_designer_light_unselected, this), app.sub("designer_group_selected_after_resize", this.on_designer_group_selected_after_resize, this), $(document.body).on("click", ".series_btn", $.proxy(this.on_series_click, this)), $(document.body).on("mousedown", ".product_type_btn", $.proxy(this.on_product_type_mousedown, this)), $(document.body).on("change", ".light_option_field", $.proxy(this.on_product_field_change, this)), $(document.body).on("keyup", ".custom_light_option_field", $.proxy(this.on_product_custom_field_change, this)), $(document.body).on("click", "#generate_button", $.proxy(this.on_generate_click, this)), Handlebars.registerHelper("tolower", function(e) {
            return e.fn(this).toLowerCase()
        })
    },
    show: function() {
        this.rendered_products || app.product_manager.get_products("", $.proxy(this.on_get_products_callback, this)), this.element.show()
    },
    on_get_products_callback: function(e, t) {
        this.rendered_products = !0, this.render_series_list(e), $("#series_btn_list li:first a").click()
    },
    render_series_list: function(e) {
        app.ui.render_template("series_list_template", e, "#series_list")
    },
    on_series_click: function(e) {
        var t = $(e.target),
            i = t.data("name");
        this.selected_series = i, this.show_series_by_name(i)
    },
    show_series_by_name: function(e) {
        var t = _.find(app.product_manager.data, {
            name: e
        }).data;
        this.render_product_list(t), $("#product_list li:first").click(), this.on_select_product_type(t[0], !0)
    },
    render_product_list: function(e) {
        app.ui.render_template("product_list_template", e, "#product_list"), $("#product_list .drag_asset").draggable({
            opacity: .7,
            scroll: !1,
            appendTo: "body",
            helper: "clone",
            cursorAt: {
                left: -5
            },
            start: $.proxy(this.start_drag, this),
            stop: $.proxy(this.stop_drag, this)
        })
    },
    on_product_type_mousedown: function(e) {
        var t = "LI" === e.target.tagName ? $(e.target) : $(e.target).closest("LI"),
            i = t.data("id"),
            s = "CUSTOM" !== i ? app.product_manager.get_light_type_by_id(i) : this.get_custom_light_type();
        this.on_select_product_type(s), this.selected_designer_light && window.setTimeout($.proxy(this.check_light_change, this), 200)
    },
    get_custom_light_type: function() {
        return {
            is_custom: !0,
            code: "custom",
            series_name: this.selected_series.toLowerCase()
        }
    },
    check_light_change: function() {
        this.selected_designer_light && this.selected_designer_light.code !== this.selected_product.code && this.change_selected_designer_light()
    },
    on_select_product_type: function(e, t) {
        this.selected_product_type && this.selected_product_type.code === e.code && this.selected_product_type.series === e.series || (this.selected_product_type = e, this.render_light_options(e), this.update_selected_product())
    },
    render_light_options: function(e) {
        e.is_custom ? app.ui.render_template("custom_light_options_template", {}, "#light_options") : (app.ui.render_template("light_options_template", e, "#light_options"), $(".light_option").each(function(e, t) {
            var i = $(this),
                s = i.find("select"),
                n = s.find("option");
            0 === n.length ? i.hide() : 1 === n.length ? (s.hide(), i.find(".single_value").html(n.get(0).text)) : i.show()
        })), this.product_code_field = $("#product_code_field")
    },
    on_product_field_change: function() {
        this.update_selected_product(), this.check_light_change()
    },
    on_product_custom_field_change: function() {
        if (this.selected_designer_light && this.selected_designer_light.is_custom) {
            var e = this.get_custom_light_data();
            this.selected_designer_light.set_custom_light_data(e.code, e.color_temperature, e.lumens, e.wattage), app.pub("custom_light_field_change")
        }
        this.update_selected_product()
    },
    get_selected_product: function() {
        if (this.selected_product_type.is_custom !== !0) {
            var e = this.get_selected_code();
            return app.product_manager.get_product_by_code(e)
        }
        return this.get_custom_light()
    },
    get_selected_code: function() {
        var e = $("#colour_temp").val(),
            t = $("#beam_angle").val(),
            i = $("#fascia_colour").val(),
            s = $("#light_type").val(),
            n = this.selected_product_type.code;
        return s && (n += "." + s), n += "-" + this.selected_product_type.series_code + "-" + e + "-" + t + "-" + i
    },
    get_custom_light_data: function() {
        var e = $("#light_options"),
            t = e.find(".custom_name").val(),
            i = parseFloat(e.find(".custom_color_temp").val(), 10),
            s = parseFloat(e.find(".custom_lumens").val(), 10),
            n = parseFloat(e.find(".custom_wattage").val(), 10);
        return {
            code: t,
            color_temperature: i || 0,
            lumens: s || 0,
            wattage: n || 0
        }
    },
    get_custom_light: function() {
        var e = this.get_custom_light_data();
        return {
            is_custom: !0,
            type: "custom",
            code: e.code,
            lumens: e.lumens,
            wattage: e.wattage,
            color_temperature: e.color_temperature
        }
    },
    update_selected_product: function() {
        this.selected_product = this.get_selected_product(), this.render_product_code()
    },
    render_product_code: function() {
        this.product_code_field.html(this.selected_product.code)
    },
    change_selected_designer_light: function() {
        var e = $.extend({}, this.selected_product);
        e.type || (e.type = e.code.toLowerCase()), this.selected_designer_light.group ? this.selected_designer_light.group.change_type(e) : this.selected_designer_light = this.selected_designer_light.change_type(e), app.ui.draw()
    },
    start_drag: function(e, t) {
        var i = $.extend({}, this.selected_product);
        i.type || (i.type = i.code.toLowerCase()), i.x = -1e4, i.y = -1e4;
        var s = new app.Light(i);
        app.designer.drag_asset = s, app.designer.drag_offset.x = s.width / 2 + 6, app.designer.drag_offset.y = 0 - s.height / 2, app.drag_type = i.code.toLowerCase(), app.dragging = !0, app.designer.dragging_new_asset = !0
    },
    stop_drag: function(e, t) {
        app.designer.reset_cursor(), e.srcElement != app.designer.element[0] && app.designer.cancel_drop()
    },
    show_selected_designer_light: function() {
        if (this.element && this.element.is(":visible")) {
            if (this.selected_designer_light.is_custom !== !0) {
                var e = app.product_manager.get_product_by_code(this.selected_designer_light.code);
                this.select_light(e)
            } else this.select_custom_light(this.selected_designer_light);
            this.update_selected_product()
        }
    },
    select_light: function(e) {
        var t = $('.series_btn [data-name="' + e.series.value + '"]');
        t.click();
        var i = $('.drag_asset[data-code="' + e.model.code + '"] a');
        i.click(), this.on_product_type_mousedown({
            target: i.parent().get(0)
        }), $("#beam_angle").val(e.beam_angle.code), $("#colour_temp").val(e.color_temperature.code), $("#fascia_colour").val(e.fascia_color.code), e.light_type && $("#light_type").val(e.light_type.code)
    },
    select_custom_light: function(e) {
        var t = $(".custom_product_type_btn:visible");
        t.click(), this.on_product_type_mousedown({
            target: t.parent().get(0)
        });
        var i = $("#light_options");
        i.find(".custom_name").val(e.code), i.find(".custom_color_temp").val(e.color_temperature), i.find(".custom_lumens").val(e.lumens), i.find(".custom_wattage").val(e.wattage)
    },
    on_designer_light_selected: function(e, t) {
        this.selected_designer_light = t, app.ui.is_paused() || this.element && this.element.is(":visible") && this.show_selected_designer_light()
    },
    on_designer_light_unselected: function() {
        this.selected_designer_light = null
    },
    on_designer_group_selected_after_resize: function(e, t) {
        this.selected_designer_light = t, this.element && this.element.is(":visible") && this.show_selected_designer_light()
    },
    on_generate_click: function() {
        if (app.designer.selected && app.designer.selected instanceof app.Room) {
            var e = app.designer.selected;
            if (e.get_lights_count() > 0 && !confirm("This will replace all the lights in the selected room with our best estimate - are you sure this is ok?")) return;
            e.calculate_best_guess()
        } else alert("Please select a room before using the Estimator. Simply click on a room to select it.")
    }
}, app.ui.details_panel = {
    dialog: null,
    is_dialog_collapsed: null,
    dialog_collapse_button: null,
    element: null,
    current_mode: null,
    current_base_asset: null,
    init: function() {
        this.element = $("#details_panel"), this.is_dialog_collapsed = !1, app.ui.details_panel_project.init(), app.ui.details_panel_rooms.init(), app.ui.details_panel_lights.init(), this.bind_events()
    },
    bind_events: function() {
        app.sub("design_selected", this.show, this), app.sub("add_mode_change", this.on_add_mode_change, this), app.sub("designer_base_asset_selected", this.on_base_asset_selected, this), app.sub("designer_base_asset_unselected", this.on_base_asset_unselected, this), app.sub("designer_room_created", this.on_room_created, this), app.sub("tool_room.draw_deactivate", this.on_room_draw_deactivate, this), app.sub("room_details_click", this.on_room_details_click, this)
    },
    init_dialog: function() {
        this.dialog_collapse_button = $('<a href="javascript:void(0);" class="ui-dialog-button-collapse"></a>'), this.dialog_collapse_button.click($.proxy(this.on_dialog_collapse_click, this)), this.dialog = this.element.dialog({
            title: "Details",
            width: 330,
            height: "auto",
            maxHeight: 400,
            modal: !1,
            dialogClass: "dialog_grey dialog_details",
            resizable: !1,
            draggable: !0,
            position: this.get_dialog_position(),
            buttons: [],
            open: function() {
                var e = $(window).height() - $(this).offset().top - 20;
                $(this).css("maxHeight", e);
                var t = $(this).parent().find(".ui-dialog-titlebar-close");
                app.ui.details_panel.dialog_collapse_button.insertBefore(t), t.hide()
            }
        }), $(window).resize($.proxy(this.stick_to_screen, this))
    },
    on_dialog_collapse_click: function() {
        this.element.toggle(), this.is_dialog_collapsed = !this.is_dialog_collapsed;
        var e = this.dialog.parents(".ui-dialog");
        this.is_dialog_collapsed ? e.addClass("ui-dialog-collapsed") : e.removeClass("ui-dialog-collapsed")
    },
    on_add_mode_change: function(e, t) {
        this.current_mode = t, this.current_base_asset ? this.show_for_asset(this.current_base_asset) : this.dialog && this.show_project()
    },
    show: function() {
        this.dialog || this.init_dialog(), this.dialog.dialog("open"), this.show_project()
    },
    set_title: function(e) {
        this.dialog.parent().find(".ui-dialog-title").html(e)
    },
    show_panel: function() {
        this.element.find(".details_panel").hide(), "project" == this.current_mode ? app.ui.details_panel_project.show() : "room" == this.current_mode ? app.ui.details_panel_rooms.show() : "lights" == this.current_mode && app.ui.details_panel_lights.show()
    },
    show_project: function() {
        "lights" === this.current_mode ? this.show_lighting() : (this.set_title("Project Details"), this.current_mode = "project", this.show_panel())
    },
    show_room: function(e) {
        "lights" !== this.current_mode || e ? (this.set_title("Room Details"), this.current_mode = "room", this.show_panel()) : this.show_lighting()
    },
    show_lighting: function(e) {
        this.set_title("Lighting Details"), this.current_mode = "lights", this.show_panel()
    },
    show_for_asset: function(e) {
        e instanceof app.LightGroup || (e instanceof app.Room ? this.set_room(e) : e.room && this.set_room(e.room), e instanceof app.Light ? this.show_lighting() : this.show_room())
    },
    on_base_asset_selected: function(e, t) {
        this.current_base_asset = t, this.show_for_asset(t)
    },
    on_base_asset_unselected: function() {
        this.current_base_asset = null, this.set_room(null), this.show_project()
    },
    set_room: function(e) {
        app.ui.details_panel_rooms.room = e, app.ui.details_panel_lights.room = e
    },
    on_room_created: function(e, t) {
        this.current_base_asset = t, this.show_for_asset(t), app.ui.show_tooltip("Please fill in room details", 5e3), 1 == _.size(app.designer.rooms) && app.pub("first_room_created")
    },
    on_room_draw_deactivate: function() {
        this.current_base_asset = null, this.set_room(null), this.show_project()
    },
    on_room_details_click: function() {
        this.show_room(!this.element.find("#room_details_panel").is(":visible")), this.current_mode = "lights"
    },
    get_dialog_position: function() {
        var e = app.designer.element.offset(),
            t = app.designer.element.width();
        return [t - 310, e.top]
    },
    stick_to_screen: function() {
        if ($(this.dialog.parents(".ui-dialog")).is(":visible")) {
            var e = this.get_dialog_position();
            $(this.dialog).dialog("option", "position", e)
        }
    }
}, app.ui.details_panel_project = {
    element: null,
    should_display: !1,
    init: function() {
        this.element = $("#project_details_panel"), this.bind_events()
    },
    bind_events: function() {
        app.sub("area_selected", this.on_area_selected, this), app.sub("design_selected", this.init_panel, this), $(document.body).on("keyup", "#area_name", $.proxy(this.on_area_name_change, this)), $(document.body).on("keyup", "#project_name", $.proxy(this.on_project_name_change, this)), $(document.body).on("change", "#project_type", $.proxy(this.on_project_type_change, this))
    },
    on_add_mode_change: function(e, t) {
        "lights" !== t ? (this.should_display = !0, app.designer.selected || this.show()) : (this.should_display = !1, this.hide())
    },
    on_area_selected: function(e, t, i) {
        $("#area_name").val(app.project_manager.selected_area.title)
    },
    on_area_name_change: function(e) {
        app.project_manager.selected_area.title = $("#area_name").val(), app.pub("area_name_updated", app.project_manager.selected_area)
    },
    on_project_name_change: function(e) {
        app.project_manager.selected_project.title = $("#project_name").val()
    },
    on_project_type_change: function(e) {
        app.project_manager.selected_project.property_type = $("#project_type").val()
    },
    init_panel: function() {
        $("#project_name").val(app.project_manager.selected_project.title), $("#project_type").val(app.project_manager.selected_project.property_type), app.project_manager.selected_area && $("#area_name").val(app.project_manager.selected_area.title)
    },
    show: function() {
        this._has_initted_panel || (this.init_panel(), this._has_initted_panel = !0), this.element.show()
    },
    hide: function() {
        this.element.hide()
    },
    get_dialog_position: function() {
        var e = app.designer.element.offset(),
            t = app.designer.element.width();
        return [t - 310, e.top]
    }
}, app.ui.details_panel_rooms = {
    element: null,
    dialog: null,
    room: null,
    should_display: !1,
    element_wall_length: null,
    element_wall_slider: null,
    element_room_type: null,
    element_room_name: null,
    element_color_temp: null,
    element_reflectivity: null,
    init: function() {
        this.element = $("#room_details_panel"), this.bind_events()
    },
    bind_events: function() {
        app.sub("first_room_created", this.first_room_created, this), $(document.body).on("change", "#room_type", $.proxy(this.room_settings_type_change, this)), $(document.body).on("keyup", "#room_name", $.proxy(this.room_settings_name_change, this)), $(document.body).on("change", "#color_temp", $.proxy(this.room_settings_colour_temp_change, this)), $(document.body).on("change", "#reflectivity", $.proxy(this.room_settings_reflectivity_change, this)), $(document.body).on("change", "#wall_length", $.proxy(this.room_settings_wall_length_change, this)), $(document.body).on("mouseover", "#wall_length_slider_container", $.proxy(this.show_wall_line, this)), $(document.body).on("mouseout", "#wall_length_slider_container", $.proxy(this.hide_wall_line, this)), $(document.body).on("webkitAnimationEnd mozAnimationEnd", "#wall_length_slider", $.proxy(this.reset_slider_animation, this))
    },
    on_add_mode_change: function(e, t) {
        "lights" !== t ? (this.should_display = !0, this.room && this.show()) : (this.should_display = !1, this.hide())
    },
    init_panel: function() {
        this.element.show(), this.element_wall_length = $("#wall_length"), this.element_wall_slider = $("#wall_length_slider"), this.element_room_type = $("#room_type"), this.element_room_name = $("#room_name"), this.element_color_temp = $("#color_temp"), this.element_reflectivity = $("#reflectivity"), this.element_wall_slider.slider({
            min: parseInt(this.element_wall_length.attr("min"), 10),
            max: 15,
            step: .1,
            range: "min",
            value: this.element_wall_length.val(),
            slide: $.proxy(function(e, t) {
                this.element_wall_length.val(t.value), this.element_wall_length.change()
            }, this)
        }), this.element.hide()
    },
    refresh: function() {
        this.element_room_type.empty();
        var e = "Residential" == app.project_manager.selected_project.property_type ? app.RoomTypes.Residential : app.RoomTypes.Commercial;
        for (var t in e) this.element_room_type.append("<option>" + t + "</prop>");
        null !== this.room.type && this.element_room_type.val(this.room.type), null !== this.room.display_name && this.element_room_name.val(this.room.display_name), null !== this.room.color_temp && this.element_color_temp.val(this.room.color_temp), null !== this.room.reflectivity && this.element_reflectivity.val(this.room.reflectivity), null !== app.designer.room_scale ? this.element_wall_length.val(this.room.get_room_length() + "") : (this.element_wall_length.val("3.0"), this.element_wall_length.change()), this.element_wall_slider.slider("value", this.element_wall_length.val())
    },
    show: function() {
        this.room && (this._has_initted_panel || (this.init_panel(), this._has_initted_panel = !0), this.refresh(), this.element.show())
    },
    hide: function() {
        this.dialog && this.dialog.is(":visible") && this.element.hide()
    },
    room_settings_type_change: function(e) {
        var t = $("#room_type").val();
        this.room.type = t, $("#room_name").val(t), this.room_settings_name_change(e), this.room.refresh_recommended()
    },
    room_settings_name_change: function(e) {
        this.room.display_name = $("#room_name").val()
    },
    room_settings_colour_temp_change: function(e) {
        this.room.color_temp = $("#color_temp").val(), this.room.refresh_recommended()
    },
    room_settings_reflectivity_change: function(e) {
        this.room.reflectivity = $("#reflectivity").val(), this.room.refresh_recommended()
    },
    show_wall_line: function() {
        this.room.show_wall_line()
    },
    hide_wall_line: function() {
        this.room.hide_wall_line()
    },
    room_settings_wall_length_change: function(e) {
        var t = $("#wall_length").val();
        if (this.room.wall_length = t, $("#wall_length_slider").slider("value", t), this.room.preview_scale(), t) {
            var i = Math.round(this.room.path.bounds.height / this.room.wall_length * 100) / 100;
            app.designer.set_room_scale(i), app.designer.refresh_asset_scale(), this.room.refresh_recommended()
        }
    },
    first_room_created: function() {
        this.element_wall_slider.css({
            webkitAnimationPlayState: "running",
            mozAnimationPlayState: "running"
        })
    },
    reset_slider_animation: function() {
        this.element_wall_slider.css({
            webkitAnimationPlayState: "paused",
            mozAnimationPlayState: "paused"
        })
    }
}, app.ui.details_panel_lights = {
    room: null,
    should_display: !1,
    element: null,
    init: function() {
        this.element = $("#lighting_details_panel"), this.bind_events()
    },
    bind_events: function() {
        app.sub("designer_room_light_add", this.on_room_light_add, this), app.sub("designer_room_light_remove", this.on_room_light_removed, this), app.sub("designer_area_loaded", this.on_designer_area_loaded, this), app.sub("room_light_group_added", this.on_room_light_group_added, this), app.sub("room_light_group_removed", this.on_room_light_group_removed, this), app.sub("custom_light_field_change", this.on_custom_light_field_change, this)
    },
    init_panel: function() {},
    refresh_project_details: function() {
        this.renderLightDetails(!1)
    },
    refresh_room_details: function() {
        this.renderLightDetails(!0)
    },
    renderLightDetails: function(e) {
        var t = {},
            i = [];
        if (e) t = this.room, i = t.lights;
        else {
            t = app.designer;
            for (var s in t.rooms) i = i.concat(_.toArray(t.rooms[s].lights))
        }
        var n = _.countBy(i, "code");
        n = _.map(n, function(e, t, s) {
            var n = _.find(i, {
                code: t
            });
            return {
                code: t,
                colour: n.display_colour,
                count: e + " Units"
            }
        }), app.ui.render_template("light_summary_list_template", n, "#light_summary_list"), $("#light_summary_list .collapsible_header:first").addClass("no_border"), app.designer.refresh_rooms_status(), this.show_light_indicator(t.recommended_lumens, t.reached_lumens);
        var o = [{
            name: "Floor Plane Lux",
            value: Math.round(t.reached_lux) + "lux"
        }, {
            name: "Work Plane Lux",
            value: Math.round(t.reached_workplane_lux) + "lux"
        }, {
            name: "Current Wattage",
            value: Math.round(t.reached_wattage) + "W [" + Math.round(t.reached_wattage_sqm) + "W/sqm]"
        }, {
            name: "Recommended Wattage",
            value: Math.round(t.recommended_wattage) + "W [" + Math.round(t.recommended_wattage_sqm) + "W/sqm]"
        }, {
            name: "Current Lumen Output",
            value: Math.round(t.reached_lumens) + "lm"
        }, {
            name: "Recommended Lumen Output",
            value: Math.round(t.recommended_lumens) + "lm"
        }];
        app.ui.render_template("light_indicator_list_template", o, "#light_indicator_list")
    },
    on_room_light_add: function(e, t, i) {
        app.ui.is_paused() || (this.room && this.room == t ? this.refresh_room_details() : this.refresh_project_details())
    },
    on_room_light_removed: function(e, t) {
        app.ui.is_paused() || (this.room && this.room == t ? this.refresh_room_details() : this.refresh_project_details())
    },
    on_designer_area_loaded: function() {
        this.refresh_project_details()
    },
    on_room_light_group_added: function(e, t, i) {
        this.room && this.room == t ? this.refresh_room_details() : this.refresh_project_details()
    },
    on_room_light_group_removed: function(e, t) {
        this.room && this.room == t ? this.refresh_room_details() : this.refresh_project_details()
    },
    on_custom_light_field_change: function() {
        this.refresh_room_details()
    },
    show_light_indicator: function(e, t) {
        if (this.element.find(".light_indicator").hide(), 0 === t) this.element.find(".no_lights").show();
        else {
            var i = t / e * 100;
            70 > i ? this.element.find(".too_dim").show() : i > 130 ? this.element.find(".too_bright").show() : this.element.find(".about_right").show()
        }
    },
    show: function() {
        this._has_initted_panel || (this.init_panel(), this._has_initted_panel = !0), this.room ? this.refresh_room_details() : this.refresh_project_details(), this.element.show()
    },
    hide: function() {
        this.element.hide()
    }
}, app.ui.room_controls = {
    light_tools_panel: null,
    room_tools_panel: null,
    should_display_light_tools: !1,
    room: null,
    init: function() {
        this.light_tools_panel = $("#room_light_controls"), this.room_tools_panel = $("#room_controls"), this.bind_events()
    },
    bind_events: function() {
        app.sub("add_mode_change", this.on_add_mode_change, this), app.sub("designer_room_selected", this.on_room_selected, this), app.sub("designer_room_unselected", this.on_room_unselected, this), app.sub("designer_room_restructure_start", this.on_event_hide, this), app.sub("designer_room_restructure_end", this.on_event_show, this), app.sub("designer_zoom_change", this.on_event_zoom_change, this), app.sub("tool_view.pan_activate", this.on_event_hide, this), app.sub("tool_view.pan_deactivate", this.on_event_show, this), app.sub("area_selected", this.on_area_selected, this), app.sub("designer_room_remove", this.on_room_remove, this), app.sub("tool_light.draw.point_deactivate", this.on_light_draw_point_deactivate, this), app.sub("tool_light.draw.string_deactivate", this.on_light_draw_string_deactivate, this), app.sub("tool_light.draw.grid_deactivate", this.on_light_draw_grid_deactivate, this), this.light_tools_panel.find("#light_tool_point").click($.proxy(this.on_point_click, this)), this.light_tools_panel.find("#light_tool_line").click($.proxy(this.on_line_click, this)), this.light_tools_panel.find("#light_tool_grid").click($.proxy(this.on_grid_click, this)), this.light_tools_panel.find("#light_tool_round").click($.proxy(this.on_round_click, this)), this.room_tools_panel.find("#room_tool_settings").click($.proxy(this.on_settings_click, this)), this.room_tools_panel.find("#room_tool_zoom").click($.proxy(this.on_zoom_click, this)), $(window).resize($.proxy(function() {
            this.room_tools_panel.is(":visible") && this.reposition_panels()
        }, this))
    },
    on_light_draw_point_deactivate: function() {
        _.delay($.proxy(function() {
            this.light_tools_panel.find("#light_tool_point").removeClass("active")
        }, this), 10)
    },
    on_light_draw_string_deactivate: function() {
        _.delay($.proxy(function() {
            this.light_tools_panel.find("#light_tool_line").removeClass("active")
        }, this), 10)
    },
    on_light_draw_grid_deactivate: function() {
        _.delay($.proxy(function() {
            this.light_tools_panel.find("#light_tool_grid").removeClass("active")
        }, this), 10)
    },
    on_add_mode_change: function(e, t) {
        "lights" === t ? (this.should_display_light_tools = !0, this.room && this.show()) : (this.should_display_light_tools = !1, this.is_visible() && this.hide_light_tools())
    },
    on_room_selected: function(e, t) {
        this.room = t, this.on_event_show(e, t)
    },
    on_room_unselected: function(e, t) {
        this.room = null, this.on_event_unselect_rooms(e, t)
    },
    on_point_click: function() {
        app.designer.toggle_tool("light.draw.point")
    },
    on_line_click: function() {
        app.designer.toggle_tool("light.draw.string")
    },
    on_grid_click: function() {
        app.designer.toggle_tool("light.draw.grid")
    },
    on_round_click: function() {
        app.designer.toggle_tool("light.draw.grid")
    },
    on_zoom_click: function() {
        this.room.zoom_to()
    },
    on_settings_click: function(e) {
        app.pub("room_details_click")
    },
    on_event_show: function(e, t) {
        this.show(t)
    },
    on_event_unselect_rooms: function(e, t) {
        this.room = null, this.hide()
    },
    on_event_hide: function(e, t) {
        this.hide()
    },
    on_event_zoom_change: function() {
        this.room && _.delay($.proxy(function() {
            this.reposition_panels()
        }, this), 10)
    },
    on_area_selected: function() {
        this.hide()
    },
    on_room_remove: function() {
        this.room = null, this.hide()
    },
    reposition_panels: function() {
        var e = app.designer.get_element_on_screen_position(this.room.path),
            t = this.room.path.bounds.width * paper.view.zoom,
            i = this.room.path.bounds.height * paper.view.zoom;
        this.should_display_light_tools && this.light_tools_panel.css({
            top: e.top - (this.light_tools_panel.height() + 10),
            left: e.left + (t - this.light_tools_panel.width()) / 2
        }), this.room_tools_panel.css({
            top: e.top + (i - this.light_tools_panel.height()) / 2,
            left: e.left + t + 10
        })
    },
    is_visible: function() {
        return this.light_tools_panel.is(":visible")
    },
    show: function() {
        this.room && (this.reposition_panels(this.room), this.should_display_light_tools ? (this.light_tools_panel.stop().fadeIn("fast"), this.room_tools_panel.find(".light_tool").show()) : this.room_tools_panel.find(".light_tool").hide(), this.room_tools_panel.stop().fadeIn("fast"))
    },
    hide: function() {
        this.light_tools_panel.stop().fadeOut("fast"), this.room_tools_panel.stop().fadeOut("fast"), this.deactivate_active_tools()
    },
    hide_light_tools: function() {
        this.light_tools_panel.stop().fadeOut("fast"), this.room_tools_panel.find(".light_tool").hide(), this.deactivate_active_tools()
    },
    deactivate_active_tools: function() {
        this.light_tools_panel.find("li.active a").click(), this.room_tools_panel.find("li.active a").click()
    }
}, app.ui.light_controls = {
    element: null,
    selected_light: null,
    should_display: null,
    init: function() {
        this.element = $("#light_controls"), this.bind_events()
    },
    bind_events: function() {
        app.sub("add_mode_change", this.on_add_mode_change, this), app.sub("designer_light_selected", this.on_designer_light_selected, this), app.sub("designer_light_unselected", this.on_designer_light_unselected, this), app.sub("area_selected", this.on_area_selected, this), app.sub("designer_room_light_remove", this.on_designer_room_light_remove, this), app.sub("tool_light.connect_deactivate", this.on_light_connect_deactivate, this), app.sub("tool_light.disconnect_deactivate", this.on_light_disconnect_deactivate, this), app.sub("designer_lightgroup_selected", this.on_designer_lightgroup_selected, this), this.element.find("#light_tool_link").click($.proxy(this.on_link_click, this)), this.element.find("#light_tool_unlink").click($.proxy(this.on_unlink_click, this)), this.element.find("#light_tool_add").click($.proxy(this.on_add_click, this)), this.element.find("#light_tool_remove").click($.proxy(this.on_remove_click, this)), this.element.find("#light_tool_rotate").click($.proxy(this.on_rotate_click, this)), $(window).resize($.proxy(function() {
            this.element.is(":visible") && this.selected_light && this.reposition(this.selected_light)
        }, this))
    },
    on_add_mode_change: function(e, t) {
        "lights" === t ? (this.should_display = !0, this.selected_light && this.show()) : (this.should_display = !1, this.element.is(":visible") && this.hide())
    },
    on_light_connect_deactivate: function() {
        _.delay($.proxy(function() {
            this.element.find("#light_tool_link").removeClass("active")
        }, this), 10)
    },
    on_light_disconnect_deactivate: function() {
        _.delay($.proxy(function() {
            this.element.find("#light_tool_unlink").removeClass("active")
        }, this), 10)
    },
    on_link_click: function() {
        app.designer.toggle_tool("light.connect")
    },
    on_unlink_click: function() {
        app.designer.toggle_tool("light.disconnect")
    },
    on_add_click: function() {
        this.selected_light.group.add_click(), app.ui.draw()
    },
    on_remove_click: function() {
        this.selected_light.group.remove_click(), app.ui.draw()
    },
    on_rotate_click: function(e) {
        app.designer.activate_tool("asset.rotate", {
            asset: this.selected_light,
            point: {
                x: e.clientX,
                y: e.clientY
            }
        })
    },
    on_designer_light_selected: function(e, t) {
        this.selected_light = t, this.should_display && this.show()
    },
    on_designer_lightgroup_selected: function(e, t) {
        (null === this.selected_light || this.selected_light.group !== t) && (this.selected_light = t.get_light_at(1))
    },
    on_designer_light_unselected: function(e, t) {
        this.selected_light = null, this.should_display && this.hide()
    },
    on_area_selected: function() {
        this.hide()
    },
    on_designer_room_light_remove: function() {
        this.hide()
    },
    reposition: function(e) {
        var t = app.designer.get_element_on_screen_position(e.room.path);
        t.top -= this.element.height() + 10, t.left += (e.room.path.bounds.width * paper.view.zoom - this.element.width()) / 2, this.element.css({
            top: t.top,
            left: t.left
        })
    },
    show: function() {
        this.should_display && (this.element.find(".group_tool")[this.selected_light.group ? "show" : "hide"](), this.reposition(this.selected_light), this.element.stop().fadeIn("fast"))
    },
    hide: function() {
        this.element.stop().fadeOut("fast")
    }
}, app.ui.asset_controls = {
    element: null,
    control_buttons: null,
    selected_asset: null,
    init: function() {
        this.element = $("#asset_controls"), this.control_buttons = this.element.find("li"), this.bind_events()
    },
    bind_events: function() {
        this.element.find("#asset_tool_link").click($.proxy(this.on_link_click, this)), this.element.find("#asset_tool_unlink").click($.proxy(this.on_unlink_click, this)), this.element.find("#asset_tool_rotate").click($.proxy(this.on_rotate_click, this)), this.element.find("#asset_tool_note").click($.proxy(this.on_note_click, this)), this.element.find("#asset_tool_flip").click($.proxy(this.on_flip_click, this)), app.sub("tool_light.connect_deactivate", this.on_light_connect_deactivate, this), app.sub("tool_light.disconnect_deactivate", this.on_light_disconnect_deactivate, this), app.sub("designer_asset_selected", this.on_designer_asset_selected, this), app.sub("designer_asset_unselected", this.on_designer_asset_unselected, this), app.sub("area_selected", this.on_area_selected, this), app.sub("designer_room_asset_remove", this.on_designer_room_asset_remove, this), $(window).resize($.proxy(function() {
            this.element.is(":visible") && this.selected_asset && this.reposition(this.selected_asset)
        }, this))
    },
    on_light_connect_deactivate: function() {
        _.delay($.proxy(function() {
            this.element.find("#asset_tool_link").removeClass("active")
        }, this), 10)
    },
    on_light_disconnect_deactivate: function() {
        _.delay($.proxy(function() {
            this.element.find("#asset_tool_unlink").removeClass("active")
        }, this), 10)
    },
    on_link_click: function() {
        app.designer.toggle_tool("light.connect")
    },
    on_unlink_click: function() {
        app.designer.toggle_tool("light.disconnect")
    },
    on_rotate_click: function(e) {
        app.designer.activate_tool("asset.rotate", {
            asset: this.selected_asset,
            point: {
                x: e.clientX,
                y: e.clientY
            }
        })
    },
    on_note_click: function(e) {
        this.selected_asset.show_note_dialog({
            x: e.clientX,
            y: e.clientY
        })
    },
    on_flip_click: function() {
        this.selected_asset.flip(event)
    },
    on_designer_asset_selected: function(e, t) {
        this.selected_asset = t, this.show_element()
    },
    on_designer_asset_unselected: function() {
        this.selected_asset = null, this.hide_element()
    },
    reposition: function(e) {
        var t = app.designer.get_element_on_screen_position(e.room.path);
        t.top -= this.element.height() + 10, t.left += (e.room.path.bounds.width * paper.view.zoom - this.element.width()) / 2, this.element.css({
            top: t.top,
            left: t.left
        })
    },
    on_area_selected: function() {
        this.hide_element()
    },
    on_designer_room_asset_remove: function() {
        this.hide_element()
    },
    show_element: function() {
        this.control_buttons.show(), this.selected_asset.is_light_switch() || this.control_buttons.filter(".switch_only").hide(), "door" !== this.selected_asset.type && this.control_buttons.filter(".door_only").hide(), this.reposition(this.selected_asset), this.element.stop().fadeIn("fast")
    },
    hide_element: function() {
        this.element.stop().fadeOut("fast")
    }
}, app.ui.getting_started = {
    dialog: null,
    initialised: null,
    init: function() {
        this.initialised = !0, this.bind_events()
    },
    bind_events: function() {
        app.sub("not_logged_in", this.on_not_logged_in, this), app.sub("design_selected", this.on_design_selected, this)
    },
    init_dialog: function(e) {
        this.initialised || this.init();
        var t = $("#getting_started_dialog");
        this.dialog = t.dialog({
            title: "Project Options",
            width: 665,
            resizable: !1,
            draggable: !0,
            dialogClass: "dialog_large",
            open: function() {
                app.ui.add_design.hide(), app.ui.on_dialog_show(), $(this).parent().find(".ui-dialog-titlebar-close").hide()
            },
            beforeClose: function() {
                app.ui.on_dialog_hide()
            }
        })
    },
    on_design_selected: function() {
        this.hide()
    },
    show: function(e) {
        is_new_project = "undefined" == typeof is_new_project ? !1 : is_new_project, this.is_new_project = "undefined" == typeof is_new_project ? !1 : is_new_project, this.init_dialog(e)
    },
    hide: function() {
        this.dialog && $(this.dialog).dialog("close")
    },
    on_not_logged_in: function(e, t) {
        this.hide()
    }
}, app.ui.designer_overlay = {
    dialog: null,
    initialised: null,
    init: function() {
        this.initialised || (app.sub("area-save-started", this.on_area_save_started, this), app.sub("area-save-finished", this.on_area_save_finished, this), app.sub("project_save_started", this.on_project_save_started, this), app.sub("design_save_started", this.on_design_save_started, this), app.sub("area_load_started", this.on_area_load_started, this), app.sub("area_load_finished", this.on_area_load_finished, this), app.sub("area_load_error", this.on_area_load_error, this), app.sub("area_save_progress", this.on_area_save_progress, this)), this.initialised = !0
    },
    show_loading: function(e) {
        $("#loading-screen").slideDown(), $("#loading-screen-text").html(e), $("#loading-screen-progress").hide(), $("#loading-screen-spinner").show()
    },
    hide_loading: function() {
        $("#loading-screen").slideUp()
    },
    show_progress: function(e, t, i) {
        if ($("#loading-screen-text").html(e), t > 0) {
            var s = Math.round(i / t * 100);
            $("#loading-screen-progress").show().progressbar({
                value: s
            }), $("#loading-screen-spinner").hide()
        }
    },
    show_error: function(e, t) {
        $("#loading-screen").is(":visible") && this.hide_loading(), $("#error-screen").slideDown(), $("#error-screen-text").html(e), $("#error-screen-detail").html(t)
    },
    hide_error: function() {
        $("#error-screen").slideUp()
    },
    on_project_save_started: function(e, t) {
        this.isOverlayAllowed() && this.show_loading("Saving project " + t.title + "...")
    },
    on_design_save_started: function(e, t) {
        this.isOverlayAllowed() && this.show_loading("Saving design " + t.title + "...")
    },
    on_area_save_started: function(e, t) {
        this.isOverlayAllowed() && this.show_loading("Saving area " + t.title + "...")
    },
    on_area_save_finished: function(e, t) {
        this.isOverlayAllowed() && this.hide_loading()
    },
    on_area_load_started: function(e, t) {
        this.show_loading("Loading area " + t.title + "...")
    },
    on_area_load_finished: function(e, t) {
        this.hide_loading()
    },
    on_area_load_error: function(e, t, i) {
        this.show_error("An error occurred while loading " + t.title, i)
    },
    on_area_save_progress: function(e, t, i) {
        if (this.isOverlayAllowed() && t > 0) {
            var s = Math.round(i / t * 100);
            $("#loading-screen-progress").show().progressbar({
                value: s
            }), $("#loading-screen-spinner").hide()
        }
    },
    isOverlayAllowed: function() {
        return !app.project_manager.autosave.inProgress
    }
}, app.ui.FloorplanUpload = Class.extend({
    element: null,
    checkbox: null,
    file_input: null,
    is_new_project: null,
    valid_floorplan_types: ["pdf", "gif", "tiff", "png", "jpg", "jpeg"],
    init: function(e, t) {
        if (this.element = $(e), this.is_new_project = "undefined" == typeof t ? !1 : t, !this.element.length) throw {
            message: "The parent element was not found in the page"
        };
        var i = (new Date).getTime();
        app.ui.render_template("floorplan_upload_template", {
            id_suffix: i
        }, e), this.checkbox = this.element.find(".has_floorplan"), this.checkbox.change($.proxy(function() {
            this.checkbox.is(":checked") ? this.element.find(".floorplan_upload_container").show() : this.element.find(".floorplan_upload_container").hide()
        }, this)), this.file_input = this.element.find(".floorplan_file"), this.file_input.change($.proxy(function() {
            var e = this.file_input.val(),
                t = !1;
            "" === e || this.is_valid_floorplan_file(e) ? this.is_pdf_floorplan_file(e) && (t = !0) : (alert("Invalid file type (supported formats: (" + this.valid_floorplan_types.join(", ") + ")"), $(this).val("")), t ? this.element.find(".floorplan_pdf_page_container").show() : this.element.find(".floorplan_pdf_page_container").hide()
        }, this))
    },
    is_valid_floorplan_file: function(e) {
        if (e) {
            var t = e.split(".");
            return t = t.reverse(), $.inArray(t[0].toLowerCase(), this.valid_floorplan_types) > -1
        }
        return !1
    },
    is_pdf_floorplan_file: function(e) {
        if (e) {
            var t = e.split(".");
            return t = t.reverse(), "pdf" === t[0].toLowerCase()
        }
        return !1
    },
    is_floorplan_selected: function() {
        return this.checkbox.is(":checked") && "" !== this.file_input.val().trim() && this.is_valid_floorplan_file(this.file_input.val().trim()) ? !0 : !1
    },
    upload_pdf: function(e, t, i) {
        this.element.find(".add_area_project_name").val(e + "_" + i), this.element.find(".add_area_project_type").val(t), this.element.find(".is_new_project").val(this.is_new_project), app.set_loading($(this.element), !0), this.element.find(".floorplan_upload_form").submit();
    }
}), app.ui.export_dialog = {
    dialog: null,
    pdf_generate_counter: null,
    pdf_generate_timer: null,
    element: null,
    export_wiring_element: null,
    export_switches_element: null,
    export_furniture_element: null,
    export_format_element: null,
    export_datasheets_element: null,
    note_text_element: null,
    init: function() {
        this.element = $("#room_settings_dialog"), this.bind_events(), this.pdf_generate_counter = 0
    },
    bind_events: function() {},
    init_dialog: function() {
        var e = {
            "Generate PDF": $.proxy(function() {
                app.project_manager.selected_design.description = this.note_text_element.val(), this.download_pdf(), this.hide()
            }, this),
            Cancel: function() {
                $(this).dialog("close")
            }
        };
        this.element = $("#export_dialog"), this.export_wiring_element = this.element.find(".export_wiring_chkbox"), this.export_switches_element = this.element.find(".export_switches_chkbox"), this.export_furniture_element = this.element.find(".export_furniture_chkbox"), this.export_format_element = this.element.find(".export_format_chkbox"), this.export_datasheets_element = this.element.find(".export_datasheets_chkbox"), this.note_text_element = this.element.find(".pdf_note_text"), this.dialog = this.element.dialog({
            title: "Additional Notes",
            width: 500,
            height: 330,
            resizable: !1,
            draggable: !0,
            dialogClass: "dialog_grey",
            buttons: e,
            open: function() {
                $(this).parent().find(".ui-dialog-titlebar-close").hide()
            }
        }), this.refresh()
    },
    refresh: function() {
        var e = app.project_manager.selected_design.description;
        e = "null" === e || null === e || void 0 === e ? "" : e, this.note_text_element.val(e)
    },
    show: function() {
        this.dialog || this.init_dialog(), this.refresh(), this.dialog.dialog("open")
    },
    hide: function() {
        this.dialog && this.dialog.is(":visible") && $(this.dialog).dialog("close")
    },
    download_pdf: function() {
        app.project_manager.selected_area.designer_data = app.designer.data_manager["export"](), app.project_manager.get_all_areas($.proxy(function(e) {
            var t = app.project_manager.selected_area;
            app.ui.designer_overlay.show_loading("Generating PDF..."), this.pdf_token_value = "" + (new Date).getTime(), cookie_delete("pdf_token_cookie");
            for (var i in e.designs) {
                var s = e.designs[i];
                for (var n in s.areas) {
                    var o = s.areas[n].designer_data;
                    o.has_background = null !== o.background
                }
            }
            this.load_all_area_images(app.project_manager.selected_design, 0, $.proxy(function() {
                app.ui.designer_overlay.show_loading("Uploading Data..."), app.project_manager.select_area(t), $("#pdf_token_cookie").val(this.pdf_token_value);
                var i = JSON.parse(JSON.stringify(e));
                i.include_furniture = this.export_furniture_element.is(":checked"), i.pdf_format = this.export_format_element.is(":checked") ? "A3" : "A4", i.datasheets = this.export_datasheets_element.is(":checked");
                for (var s in i.designs) {
                    var n = i.designs[s];
                    for (var o in n.areas) {
                        var r = n.areas[o];
                        r.designer_data.background = null, r.value = null, r.export_image_id = app.project_manager.export_image(r.image), r.image = null
                    }
                }
                var a = JSON.stringify(i);
                $("#pdf_data").val(a), $("#pdf_form").submit(), this.pdf_generate_counter = 0, this.pdf_generate_timer = window.setInterval($.proxy(this.check_pdf_generated, this), 500)
            }, this))
        }, this))
    },
    load_all_area_images: function(e, t, i) {
        return t == e.areas.length ? void i() : (app.ui.designer_overlay.show_progress("Generating Images...", e.areas.length, t + 1), app.project_manager.select_area(e.areas[t]), void window.setTimeout($.proxy(function() {
            app.designer.populate_notes(), e.areas[t].notes = app.designer.notes;
            var s = !1;
            e.areas[t].designer_data.rooms.length > 0 && (s = app.designer.data_manager.get_image(e.areas[t], this.export_wiring_element.is(":checked"), this.export_switches_element.is(":checked"))), e.areas[t].image = s, t += 1, this.load_all_area_images(e, t, i)
        }, this), 1e3))
    },
    check_pdf_generated: function() {
        var e = cookie_get("pdf_token_cookie");
        if (e >= this.pdf_token_value || 100 === this.pdf_generate_counter) return app.ui.designer_overlay.hide_loading(), void window.clearInterval(this.pdf_generate_timer);
        var t = {
            2: "Drawing Rooms",
            7: "Calculating Distances",
            12: "Creating Summaries",
            17: "Preparing Download"
        };
        t[this.pdf_generate_counter] && app.ui.designer_overlay.show_loading(t[this.pdf_generate_counter]), this.pdf_generate_counter++
    }
}, app.ui.share_dialog = {
    dialog: null,
    initialised: !1,
    element: null,
    elements: {
        list: null,
        add_share: null,
        loading: null
    },
    init: function() {
        this.element = $("#share_dialog"), this.elements.list = this.element.find(".list"), this.elements.add_share = this.element.find(".add-share"), this.elements.loading = this.element.find(".loading"), this.bind_events(), this.initialised = !0
    },
    bind_events: function() {
        $(document.body).on("click", ".share-edit-toggle", $.proxy(this.on_share_edit_click, this)), $(document.body).on("click", ".delete_share", $.proxy(this.on_share_delete_click, this)), $(document.body).on("click", "#shared_projects_add .add", $.proxy(this.on_add_btn_click, this)), $(document.body).on("click", "#shared_projects_add .back", $.proxy(this.on_back_btn_click, this))
    },
    init_dialog: function() {
        this.initialised || this.init();
        var e = {
            "Add user": $.proxy(function() {
                this.on_add_user_btn_click()
            }, this),
            Close: function() {
                $(this).dialog("close")
            }
        };
        this.dialog = this.element.dialog({
            title: "Share projects",
            width: 500,
            height: 450,
            resizable: !1,
            draggable: !0,
            dialogClass: "share-project-dialog",
            buttons: e
        })
    },
    show: function() {
        this.init_dialog(), this.refresh(), this.show_list(), this.dialog.dialog("open")
    },
    hide: function() {
        this.dialog && this.dialog.is(":visible") && $(this.dialog).dialog("close")
    },
    refresh: function() {
        $("#shared_projects_list").hide(), this.elements.loading.show(), app.project_manager.get_shared_projects($.proxy(this.on_shared_projects_callback, this))
    },
    on_shared_projects_callback: function(e) {
        app.ui.render_template("shared_projects_template", e, "#shared_projects_list"), app.ui.render_template("shared_projects_add_template", e, "#shared_projects_add"), $("#shared_projects_list").show(), this.elements.loading.hide()
    },
    on_share_edit_click: function(e) {
        app.project_manager.edit_shared_project({
            projectId: e.target.getAttribute("data-project-id"),
            userId: e.target.getAttribute("data-user-id"),
            state: $("#" + e.target.id).is(":checked")
        })
    },
    on_share_delete_click: function(e) {
        if (confirm("Are you sure you want to remove access to this project?")) {
            var t = "A" === e.target.tagName ? $(e.target) : $(e.target).closest("A");
            app.project_manager.delete_shared_project({
                projectId: t.data("project-id"),
                userId: t.data("user-id")
            }, $.proxy(this.on_delete_callback, this))
        }
    },
    on_delete_callback: function(e) {
        e.hasOwnProperty("projectId") && e.hasOwnProperty("userId") && this.element.find("#share-row-" + e.projectId + "-" + e.userId).find("td").fadeOut(1e3, function() {
            $(this).remove()
        })
    },
    on_add_user_btn_click: function() {
        this.hide_list()
    },
    on_back_btn_click: function() {
        this.show_list()
    },
    on_add_btn_click: function() {
        var e = this.element.find("#share-email").val();
        return app.ui.validate_email(e) ? (this.elements.add_share.hide(), this.elements.loading.show(), void app.project_manager.share_project({
            projectId: this.element.find("#share-project-name").val(),
            email: e,
            is_editable: this.element.find("#share-add").is(":checked")
        }, $.proxy(this.on_share_callback, this))) : void alert("Please enter valid email address.")
    },
    on_share_callback: function() {
        this.refresh(), this.show_list(), this.element.find("#share-email").val("")
    },
    show_list: function() {
        this.elements.list.show(), this.elements.add_share.hide(), this.element.parent().find(".ui-dialog-buttonset .ui-button:first").show()
    },
    hide_list: function() {
        this.elements.list.hide(), this.elements.add_share.show(), this.element.parent().find(".ui-dialog-buttonset .ui-button:first").hide()
    }
}, app.ui.help = {
    dialog: null,
    events_initialised: null,
    init: function() {},
    init_dialog: function() {
        this.health_check_button = $('<a href="javascript:void(0);" id="healthcheck_link">healthcheck</a>'), this.health_check_button.click($.proxy(this.on_healthcheck_click, this));
        var e = $("#help_dialog");
        app.ui.help.dialog = e.dialog({
            title: "Help",
            width: 700,
            height: 550,
            modal: !1,
            dialogClass: "dialog_large",
            resizable: !1,
            draggable: !0,
            buttons: [],
            open: function() {
                app.ui.on_dialog_show();
                var e = $(this).parent().find(".ui-dialog-titlebar-close");
                app.ui.help.health_check_button.insertBefore(e)
            },
            beforeClose: $.proxy(function() {
                app.ui.on_dialog_hide()
            }, this)
        })
    },
    show: function() {
        this.dialog ? this.dialog.dialog("open") : this.init_dialog()
    },
    hide: function() {
        this.dialog && this.dialog.dialog("close")
    },
    on_healthcheck_click: function() {
        this.dialog.dialog("close"), app.health_check.show()
    }
}, app.ui.message = {
    element: null,
    message: {
        error: {
            unknown: "An unknown error has occured.",
            load_project: "Cannot load the project.",
            save_project: "Cannot save current project.",
            delete_project: "Cannot delete the project.",
            export_project: "Cannot export the project.",
            login: "Your session has expired. Please login again.",
            permission: "You do not have permission to edit this project.",
            locked: "Area is currently being edited by another user.",
            autosave: "Project has been automatically saved.",
            load_shared_project: "Cannot load shared projects.",
            delete_shared_project: "Cannot delete user from shared projects.",
            create_shared_project: "Cannot share project."
        }
    },
    init: function() {
        this.element = $("#message"), this.bind_events()
    },
    bind_events: function() {
        app.sub("error", this.on_error, this), app.sub("message", this.on_message, this), app.sub("message_hide", this.hide, this), this.element.find(".dismiss").click($.proxy(this.hide, this))
    },
    show: function(e, t) {
        this.element.find("h3").html(e), this.element.find(".text").html(t), this.element.addClass("active")
    },
    hide: function() {
        this.element.removeClass("active"), $("#loading-screen").length > 0 && $("#loading-screen").hide()
    },
    on_error: function(e, t) {
        var i = this.message.error.unknown;
        this.message.error.hasOwnProperty(t) && (i = this.message.error[t]), this.show("Error!", i)
    },
    on_message: function(e, t) {
        t.hasOwnProperty(title) && t.hasOwnProperty(text) && this.show(t.title, t.text)
    }
}, app.designer = {
    element: null,
    initial_width: null,
    initial_height: null,
    initial_zoom_factor: null,
    tools: {},
    rooms: {},
    circuits: {},
    light_groups: {},
    light_switches: {},
    room_scale: null,
    active_tool: null,
    active_room: null,
    active_asset: null,
    background: null,
    background_img: null,
    zoom_factor: 1,
    zoom_amount: .2,
    drag_asset: null,
    drag_offset: {
        x: 0,
        y: 0
    },
    selected: null,
    class_map: [],
    controls_hover: null,
    is_resizing: !1,
    snap_lights: !0,
    notes: [],
    note_paths: [],
    zoom_translate_x: null,
    zoom_translate_y: null,
    center: null,
    square_meters: null,
    recommended_lux: null,
    recommended_workplane_lux: null,
    recommended_lumens: null,
    recommended_wattage: null,
    recommended_wattage_sqm: null,
    reached_lux: null,
    reached_workplane_lux: null,
    reached_lumens: null,
    reached_wattage: null,
    reached_wattage_sqm: null,
    cancel_mouseup: !1,
    stats_box: null,
    stats_box_recommended_lumens: null,
    stats_box_reached_lumens: null,
    layers: {
        background: null,
        rooms: null,
        assets: null,
        circuits: null,
        light_groups: null,
        lights: null,
        handles: null
    },
    CURSORS: {
        rotate: "url('img/rotate.png'), move"
    },
    init: function() {
        this.element = $("<canvas />").attr({
            id: "designer"
        }), $("#designer_container").append(this.element), this.element.get(0).oncontextmenu = function() {
            return !1
        }, this.initial_width = this.element.width(), this.initial_height = this.element.height(), this.cancel_mouseup = !1, paper.setup(this.element.get(0)), this.bind_events(), this.init_mouse_events(), this.init_stats_box(), this.resize_element(), $(window).resize($.proxy(this.resize_element, this))
    },
    bind_events: function() {
        app.sub("area_data_loaded", this.on_area_data_loaded, this)
    },
    init_mouse_events: function() {
        this.element.mouseover($.proxy(this.on_mouse_over, this)), this.element.mouseup($.proxy(this.element_on_mouse_up, this)), this.element.mouseout($.proxy(this.on_mouse_out, this)), this.element.keydown($.proxy(this.on_key_down, this)), this.no_tool = new Tool, this.no_tool.name = "no_tool", this.no_tool.onMouseMove = $.proxy(this.on_mouse_move, this), this.no_tool.onMouseUp = $.proxy(this.on_mouse_up, this), this.no_tool.onKeyDown = $.proxy(app.designer.on_key_down, this), this.no_tool.activate(), this.element.mousewheel($.proxy(app.designer.on_mouse_wheel_scroll, this))
    },
    initialize_new_area: function() {
        this.reset_layers(), null !== this.layers.background ? (this.delete_circuits(), this.delete_rooms(), this.delete_light_groups(), this.background_img = null, this.initial_zoom_factor = 1, this.zoom_factor = 1, this.room_scale = null, this.zoom_translate_x = 0, this.zoom_translate_y = 0, this.square_meters = 0, this.recommended_lux = 0, this.recommended_workplane_lux = "-", this.recommended_lumens = 0, this.recommended_wattage = 0, this.recommended_wattage_sqm = 5, this.reached_lux = 0, this.reached_workplane_lux = 0, this.reached_lumens = 0, this.reached_wattage = 0, this.reached_wattage_sqm = 0) : project.layers[0].remove(), this.rooms = {}, this.circuits = {}, this.light_groups = {}, paper.view.zoom = 1, app.ui.draw(), this.fit_to_screen(), this.reset_center(), this.show_stats_box(!0)
    },
    resize_element: function() {
        var e = $(window).height(),
            t = e - this.element.offset().top - 10;
        paper && paper.view && (paper.view.viewSize = [$(window).width(), t], this.layers.background && (this.reset_center(), app.ui.draw()))
    },
    reset_layers: function() {
        for (var e in this.layers) {
            var t = this.layers[e];
            t && t.remove(), this.layers[e] = new Layer
        }
    },
    import_background_image: function(e) {
        this.background_img = new Image, this.background_img.onload = $.proxy(function() {
            this.background = new Raster(this.background_img, new Rectangle(0, 0, this.background_img.width, this.background_img.height)), this.layers.background.addChild(this.background), this.reset_center(), this.set_opacity(app.ui.menu_bar.opacity), this.background.bounds.x = 0, this.background.bounds.y = 0, app.ui.draw(), this.zoom_to_fit()
        }, this), e.url ? this.background_img.src = e.url : e.img_data && (this.background_img.src = "data:image/png;base64," + e.img_data)
    },
    on_area_data_loaded: function(e, t) {
        this["import"](t.designer_data)
    },
    get_new_circuit: function() {
        var e = new app.Circuit;
        return this.circuits[e.id] = e, e
    },
    reset_center: function() {
        this.background_img ? this.center = [this.background_img.width / 2, this.background_img.height / 2] : this.center = this.layers.background.bounds.getCenter(), this.set_center(this.center)
    },
    on_mouse_over: function(e) {
        $(document.body).addClass("hide_drag")
    },
    on_mouse_move: function(e) {
        return null === app.drag_type ? void(app.dragging = !1) : void this.on_mouse_drag(e)
    },
    on_mouse_drag: function(e) {
        app.dragging = !0;
        var t = e.event,
            i = e.getPoint();
        if (null === this.drag_asset) {
            var s = this.get_asset_class(app.drag_type);
            s && (this.drag_asset = new s({
                x: i.x,
                y: i.y,
                type: app.drag_type
            }), app.designer.drag_offset.x = this.drag_asset.width / 2 + 6, app.designer.drag_offset.y = 0 - this.drag_asset.height / 2)
        } else this.drag_asset.is_visible() || this.drag_asset.show();
        return 1 !== t.which ? (i = {
            x: t.offsetX,
            y: t.offsetY
        }, this.active_asset && this.active_asset.unselect(), app.drag_type = null, this.on_mouse_up(e), void(this.drag_asset = null)) : (this.drag_asset.move(i.x, i.y), void(this.active_room && (this.drag_asset.is_light() && app.designer.active_room.draw_snap_lines_for_light(this.drag_asset), this.drag_asset.draw_wall_distance_lines(this.active_room))))
    },
    element_on_mouse_up: function(e) {
        app.designer.dragging_new_asset && (app.designer.dragging_new_asset = !1, this.on_mouse_up(e))
    },
    on_mouse_up: function(e) {
        if (this.cancel_mouseup) return void(this.cancel_mouseup = !1);
        if (!this.controls_hover) {
            if (!app.is_dragging()) return this.selected && this.selected.group && this.selected.group.has_resized && (this.selected.group.refresh_outline(), this.selected.group.has_resized = !1), null !== this.active_asset ? this.active_asset.set_selected(!0, e) : null !== this.active_room ? this.active_room.set_selected(!0) : (app.pub("designer_background_click"), this.clear_selected()), void(app.dragging = !1);
            app.dragging = !1, e.event && (e = e.event);
            var t = {
                x: e.offsetX,
                y: e.offsetY
            };
            app.designer.drop_asset(app.drag_type, t), app.drag_type = null, app.designer.reset_cursor()
        }
    },
    on_mouse_out: function(e) {
        $(document.body).removeClass("hide_drag"), app.is_dragging() && this.drag_asset.hide()
    },
    on_key_down: function(e) {
        var t = e.event.target.tagName;
        if ("INPUT" != t && "TEXTAREA" != t && ("delete" == e.key || "backspace" == e.key)) return null !== this.selected && ("room" === app.designer.selected["class"] && app.designer.selected.selected_handle ? app.designer.selected.delete_selected_handle() : this.selected.delete_asset(e)), !1;
        if (e.event.shiftKey) {
            var i = e.event.keyCode;
            43 === i ? this.zoom_in() : 95 === i ? this.zoom_out() : app.designer.selected && "room" === app.designer.selected["class"] && app.designer.selected.shift_press()
        }
        return !0
    },
    on_mouse_wheel_scroll: function(e, t, i, s) {
        return app.project && e.shiftKey ? (0 > t ? this.zoom_out() : this.zoom_in(), !1) : void 0
    },
    drop_asset: function(e, t) {
        if (null === this.active_room) this.drag_asset.is_light() ? (app.ui.show_tooltip("Lights must be placed inside a room", 3e3), this.drag_asset.cancel_move()) : this.drag_asset.is_in_room() ? this.drag_asset.lock_to_room() : (app.ui.show_tooltip("Furniture must be placed inside a room", 3e3), this.drag_asset.cancel_move());
        else if (this.drag_asset.is_light() && this.drag_asset.in_group && !this.drag_asset.group.check_lights_are_in_room(this.active_room)) app.ui.show_tooltip("All lights in a light group must be within the same room", 3e3), this.drag_asset.cancel_move(), app.snap_manager.remove_lines();
        else {
            if (this.drag_asset.is_light() && this.snap_lights) {
                var i = .2 * app.designer.room_scale,
                    s = this.drag_asset.find_nearest_lights(i, this.active_room),
                    n = this.drag_asset.path.bounds.center.x,
                    o = this.drag_asset.path.bounds.center.y;
                null !== s.x_point && (n = s.x_point.x), null !== s.y_point && (o = s.y_point.y);
                var r = {
                    x: n - this.drag_asset.path.bounds.center.x,
                    y: o - this.drag_asset.path.bounds.center.y
                };
                app.designer.drag_offset = {
                    x: 0,
                    y: 0
                }, this.drag_asset.group ? this.drag_asset.group.move_by(r) : this.drag_asset.move_by(r), app.snap_manager.remove_lines()
            }
            this.active_room.add_asset(this.drag_asset), this.drag_asset.move_finish()
        }
        this.drag_asset = null
    },
    set_active: function(e, t) {
        this[e] = t, "active_room" == e && (app.set_status(t.get_hover_status()), this.update_stats_box(t.recommended_lumens, t.reached_lumens))
    },
    clear_active: function(e) {
        this[e] = null, this.active_room || this.active_asset || app.clear_status()
    },
    get_asset_class: function(e) {
        if (this.class_map[e]) return this.class_map[e];
        var t = e.toCamel();
        return app.Asset[t] ? (this.class_map[e] = app.Asset[t], this.class_map[e]) : null
    },
    cancel_drop: function() {
        app.is_dragging() && this.drag_asset && this.drag_asset.remove(), app.drag_type = null, this.drag_asset = null
    },
    set_room_scale: function(e) {
        this.room_scale = e
    },
    refresh_asset_scale: function(e) {
        if (e || (e = this.room_scale), e) {
            for (var t in this.rooms) {
                var i = this.rooms[t];
                for (var s in i.assets) {
                    var n = i.assets[s];
                    n.is_scalable() && n.rescale(e)
                }
            }
            app.ui.draw()
        }
    },
    reconnect_light_switches: function(e) {
        for (var t in this.rooms) {
            var i = this.rooms[t];
            for (var s in i.light_switches) {
                var n = i.assets[s];
                n.redraw_connections()
            }
        }
        app.ui.draw()
    },
    export_image: function() {
        var e = this.get_image(10);
        e !== !1 ? window.open("data:image/png;base64," + e, "export_image") : app.ui.show_tooltip("Error, empty project. Add rooms, furniture and lights before exporting image")
    },
    unset_actives: function() {
        null !== this.active_room && this.active_room.set_active(!1), null !== this.active_asset && this.active_asset.set_active(!1)
    },
    get_image: function(e, t, i) {
        t = "undefined" == typeof t ? !0 : t, i = "undefined" == typeof i ? !0 : i, this.unset_actives();
        var s = paper.view.zoom,
            n = paper.view.center,
            o = paper.view.size.width * s,
            r = paper.view.size.height * s;
        this.fit_to_screen();
        var a = this.get_project_bounds();
        a.x -= e / 2, a.y -= e / 2, a.width += e, a.height += e, paper.view.setViewSize(a.width, a.height), paper.view.setCenter(a.center), t && this.show_all_circuits(), i || app.designer.hide_light_switches(), app.designer.draw_distance_lines(), this.add_notes(), app.ui.resume_rendering(), app.ui.draw();
        var h = this.element.get(0).toDataURL("image/png");
        return h ? (h = h.replace(/^data:image\/(png|jpg);base64,/, ""), app.ui.pause_rendering(), app.designer.hide_distance_lines(), this.hide_all_circuits(), this.remove_notes(), i || app.designer.show_light_switches(), paper.view.setViewSize(o, r), this.set_center(n), this.zoom(s), app.ui.resume_rendering(), app.ui.draw(), h) : !1
    },
    zoom_in: function() {
        app.designer.zoom(app.designer.zoom_factor + app.designer.zoom_amount)
    },
    zoom_out: function() {
        app.designer.zoom(app.designer.zoom_factor - app.designer.zoom_amount)
    },
    sanitize_zoom: function(e) {
        var t = 3 * this.initial_zoom_factor,
            i = .4 * this.initial_zoom_factor;
        return e > t ? t : i > e ? i : e
    },
    zoom: function(e) {
        e = this.sanitize_zoom(e), app.designer.zoom_factor = e, paper.view.zoom = app.designer.zoom_factor, app.ui.draw(), app.pub("designer_zoom_change")
    },
    fit_to_screen: function() {
        app.designer.zoom(this.initial_zoom_factor), this.set_center(this.center)
    },
    clear_selected: function() {
        null !== this.selected && this.selected.set_selected(!1)
    },
    set_center: function(e) {
        paper.view.setCenter(e)
    },
    activate_tool: function(e, t) {
        this.active_tool != e && (this.deactivate_tool(this.active_tool), this.tools[e] && (this.active_tool = this.tools[e], this.tools[e].activate(), this.active_tool.on_activate && this.active_tool.on_activate(t)))
    },
    deactivate_tool: function() {
        this.active_tool && null !== this.active_tool.on_deactivate && this.active_tool.on_deactivate(), this.no_tool.activate(), this.active_tool = null, app.pub("no_tool_activate")
    },
    toggle_tool: function(e, t) {
        app.designer.active_tool && app.designer.active_tool.name == e ? app.designer.deactivate_tool() : app.designer.activate_tool(e, t)
    },
    show_all_circuits: function() {
        for (var e in app.designer.circuits) app.designer.circuits[e].show_connections()
    },
    hide_all_circuits: function() {
        for (var e in app.designer.circuits) app.designer.circuits[e].hide_connections()
    },
    is_disconnect_active: function() {
        return this.active_tool && "light.disconnect" == this.active_tool.name
    },
    is_connect_active: function() {
        return this.active_tool && "light.connect" == this.active_tool.name
    },
    export_background_img: function() {
        if (this.background_img) {
            var e = document.createElement("canvas");
            e.width = this.background_img.width, e.height = this.background_img.height;
            var t = e.getContext("2d");
            t.drawImage(this.background_img, 0, 0);
            for (var i = 255 / app.ui.menu_bar.opacity, s = t.getImageData(0, 0, e.width, e.height), n = s.data, o = n.length, r = 3; o > r; r += 4) n[r] = i;
            s.data = n, t.putImageData(s, 0, 0);
            var a = e.toDataURL("image/png");
            return a.replace(/^data:image\/(png|jpg);base64,/, "")
        }
        return null
    },
    delete_circuits: function() {
        $.each(this.circuits, function(e, t) {
            t.remove(), delete app.designer.circuits[e]
        })
    },
    delete_rooms: function() {
        $.each(this.rooms, function(e, t) {
            t.remove(), delete app.designer.rooms[e]
        })
    },
    delete_light_groups: function() {
        $.each(this.light_groups, function(e, t) {
            t.remove(), delete app.designer.light_groups[t]
        })
    },
    get_hover_status: function() {},
    export_rooms: function() {
        var e = [];
        return $.each(this.rooms, function(t, i) {
            e.push(i["export"]())
        }), e
    },
    export_circuits: function() {
        var e = [];
        return $.each(this.circuits, function(t, i) {
            i.room && e.push(i["export"]())
        }), e
    },
    export_light_groups: function() {
        var e = [];
        return $.each(this.light_groups, function(t, i) {
            e.push(i["export"]())
        }), e
    },
    draw_circuits: function() {
        for (var e in app.designer.circuits) app.designer.circuits[e].redraw_connections()
    },
    refresh_rooms_status: function() {
        this.square_meters = 0, this.recommended_lux = 0, this.recommended_lumens = 0, this.recommended_wattage = 0, this.reached_lux = 0, this.reached_lumens = 0, this.reached_wattage = 0, this.reached_workplane_lux = 0;
        for (var e in this.rooms) {
            var t = this.rooms[e];
            t.refresh_square_meters(), t.refresh_recommended_lux(), t.refresh_recommended_lumens(), t.refresh_recommended_wattage(), t.refresh_reached_lumens(), t.refresh_reached_lux(), this.square_meters += t.square_meters, this.recommended_lux += t.recommended_lux, this.recommended_lumens += t.recommended_lumens, this.recommended_wattage += t.recommended_wattage, this.reached_lux += t.reached_lux, this.reached_lumens += t.reached_lumens, this.reached_wattage += t.reached_wattage, this.reached_workplane_lux += t.reached_workplane_lux
        }
        this.recommended_wattage = Math.round(10 * this.recommended_wattage) / 10, this.reached_wattage = Math.round(10 * this.reached_wattage) / 10, 0 === this.square_meters ? (this.recommended_wattage = 0, this.reached_wattage_sqm = 0) : (this.recommended_wattage = Math.round(this.recommended_wattage_sqm * this.square_meters * 10) / 10, this.reached_wattage_sqm = Math.round(this.reached_wattage / this.square_meters * 10) / 10), this.update_stats_box(this.recommended_lumens, this.reached_lumens)
    },
    "import": function(e) {
        app.designer.is_loading = !0, this.initialize_new_area(), this.room_scale = e.room_scale, e.background ? this.import_background_image({
            img_data: e.background
        }) : (this.background = null, this.background_img = null), e.circuits.length > 0 && $.each(e.circuits, function(e, t) {
            var i = new app.Circuit(t);
            "number" == typeof i.room && (app.designer.circuits[i.id] = i)
        }), e.light_groups.length > 0 && $.each(e.light_groups, function(e, t) {
            var i = new app.LightGroup(t);
            app.designer.light_groups[i.id] = i
        }), e.rooms.length > 0 ? $.each(e.rooms, function(e, t) {
            var i = new app.Room(t);
            app.designer.rooms[i.id] = i
        }) : (app.has_lights = !1, app.has_furniture = !1);
        for (var t in this.circuits) {
            var i, s = this.circuits[t];
            "number" == typeof s.room && (s.room = this.rooms[s.room]), s.primary_switch && "number" == typeof s.primary_switch && (i = s.primary_switch, s.primary_switch = this.light_switches[i]);
            var n = s.secondary_switches;
            if (n && n.length > 0) {
                s.secondary_switches = {};
                for (var o in n) i = n[o], s.secondary_switches[i] = this.light_switches[i]
            }
        }
        $.each(app.designer.light_groups, function(e, t) {
            var i = _.size(t.lights);
            i > 0 ? t.refresh_outline() : t.remove()
        }), this.refresh_rooms_status(), this.draw_circuits(), app.ui.draw(), this.show_stats_box(!0), e.background || this.zoom_to_fit(), app.designer.is_loading = !1, app.pub("designer_area_loaded", ""), paper.view.draw()
    },
    is_busy: function() {
        return app.dialog_showing || app.is_dragging() || null !== app.designer.active_tool && app.designer.active_tool.capture_mouse === !0
    },
    get_total_wire_length: function() {
        var e, t, i = 0;
        for (e in this.circuits) {
            var s = this.circuits[e];
            for (t in s.outline) {
                var n = s.outline[t],
                    o = n.segments[0].point,
                    r = void 0 === n.segments[1] ? 0 : n.segments[1].point,
                    a = 0 == r ? 0 : o.getDistance(r) / app.designer.room_scale;
                i += a
            }
        }
        for (e in this.light_switches) {
            var h = this.light_switches[e];
            for (t in h.connections) {
                var l = h.connections[t],
                    d = l.segments[0].point,
                    c = void 0 === l.segments[1] ? 0 : l.segments[1].point,
                    g = 0 == c ? 0 : d.getDistance(c) / app.designer.room_scale;
                i += g
            }
        }
        return i
    },
    draw_distance_lines: function() {
        for (var e in this.rooms) this.rooms[e].draw_first_light_distance_lines()
    },
    hide_distance_lines: function() {
        for (var e in this.rooms) this.rooms[e].hide_first_light_distance_lines()
    },
    get_project_bounds: function() {
        var e, t, i, s, n, o = null,
            r = null,
            a = null,
            h = null;
        for (var l in this.rooms) e = this.rooms[l], t = e.path.bounds.x - e.path.strokeWidth, i = e.path.bounds.y - e.path.strokeWidth, s = t + e.path.strokeBounds.width + 2 * e.path.strokeWidth, n = i + e.path.strokeBounds.height + 2 * e.path.strokeWidth, (null === o || o > t) && (o = t), (null === r || r > i) && (r = i), (null === a || s > a) && (a = s), (null === h || n > h) && (h = n);
        return null !== this.background && (this.background.bounds.getTopLeft().x < o && (o = this.background.bounds.getTopLeft().x), this.background.bounds.getTopLeft().y < r && (r = this.background.bounds.getTopLeft().y), this.background.bounds.getBottomRight().x > a && (a = this.background.bounds.getBottomRight().x), this.background.bounds.getBottomRight().y > h && (h = this.background.bounds.getBottomRight().y)), new Rectangle({
            from: [o, r],
            to: [a, h]
        })
    },
    init_stats_box: function() {
        this.stats_box = $("#stats_box"), this.stats_box_recommended_lumens = $("#recommended_lumens_value"), this.stats_box_reached_lumens = $("#reached_lumens_value")
    },
    show_stats_box: function(e) {
        e ? this.stats_box.show() : this.stats_box.hide()
    },
    update_stats_box: function(e, t) {
        this.stats_box_recommended_lumens.html(commarize(e)), this.stats_box_reached_lumens.html(commarize(t))
    },
    zoom_to_fit: function() {
        var e = this.get_project_bounds(),
            t = this.element.width(),
            i = this.element.height(),
            s = t / e.width,
            n = i / e.height,
            o = n > s ? s : n;
        o -= .1, this.set_center(e.center), this.zoom(this.sanitize_zoom(o))
    },
    populate_notes: function() {
        this.notes = [];
        for (var e in this.rooms) {
            var t = this.rooms[e];
            for (var i in t.assets) {
                var s = t.assets[i];
                "" !== s.note.notetext && (s.note.id = this.notes.length + 1, this.notes.push(s.note))
            }
        }
    },
    add_notes: function() {
        this.remove_notes(), this.populate_notes();
        for (var e in this.rooms) {
            var t = this.rooms[e];
            for (var i in t.assets) {
                var s = t.assets[i];
                s.draw_note()
            }
        }
        app.ui.draw()
    },
    remove_notes: function() {
        for (var e in this.note_paths) this.note_paths[e].remove();
        app.ui.draw()
    },
    set_cursor: function(e, t) {
        return this.CURSORS[e] && (e = this.CURSORS[e]), this.cursor_persist ? !1 : (this.current_cursor = e, this.cursor_persist = t, void(document.body.style.cursor = e))
    },
    reset_cursor: function(e) {
        return this.cursor_persist && (this.CURSORS[e] && (e = this.CURSORS[e]), e !== this.current_cursor) ? !1 : (document.body.style.cursor = "auto", this.current_cursor = null, void(this.cursor_persist = !1))
    },
    hide_light_switches: function() {
        for (var e in app.designer.light_switches) app.designer.light_switches[e].hide()
    },
    show_light_switches: function() {
        for (var e in app.designer.light_switches) app.designer.light_switches[e].show()
    },
    get_element_on_screen_position: function(e) {
        var t = paper.view.zoom;
        return {
            top: this.element.position().top + (e.bounds.y * t - paper.view.bounds.y * t),
            left: this.element.position().left + (e.bounds.x * t - paper.view.bounds.x * t)
        }
    },
    set_opacity: function(e) {
        this.layers.background && null != this.background && (0 > e ? e = 0 : e > 1 && (e = 1), this.background.opacity = e)
    }
}, app.product_manager = {
    api_url: null,
    curve_data: null,
    cube_data: null,
    retrofit_data: null,
    is_local_dev: null,
    data: null,
    products: null,
    init: function() {
        "designer.bg.dev" == document.domain ? this.api_url = "https://api.bg.dev" : this.api_url = "https://api.brightgreen.com", this.api_url += "/brightgreen/v2/lights/details", app.use_local_storage && (this.api_url = document.location.protocol + "//" + document.domain + document.location.pathname + "/js/sample.lights.json")
    },
    get_products: function(e, t, i, s) {
        s = "undefined" == typeof s ? !1 : s;
        var n = "data";
        e && (n = e + "_data"), null === app.product_manager[n] || s ? $.ajax({
            type: "GET",
            url: this.api_url,
            data: {
                series: e
            },
            dataType: "json",
            success: function(e, i, s) {
                if (200 == e.error.code) {
                    series = [];
                    for (var o in e.result) series.push({
                        name: o,
                        data: e.result[o]
                    });
                    app.product_manager[n] = series, app.product_manager.post_process_data(), "undefined" != typeof t && t(series, i)
                }
            },
            error: function(e, t, s) {
                "undefined" != typeof i && i(e, t, s)
            }
        }) : "undefined" != typeof t && t(this[n], "from_cache")
    },
    get_light_type_by_id: function(e) {
        for (var t in app.product_manager.data) {
            var i = app.product_manager.data[t].data,
                s = _.find(i, {
                    id: e
                });
            if (s) return s
        }
        return null
    },
    get_product_by_code: function(e) {
        return _.find(app.product_manager.products, {
            code: e
        })
    },
    get_all_products: function() {
        var e = [];
        for (var t in app.product_manager.data) {
            var i = app.product_manager.data[t].data;
            for (var s in i) {
                var n = i[s];
                $.each(n.products, function(t, i) {
                    e.push(i)
                })
            }
        }
        return e
    },
    post_process_data: function() {
        var e = [];
        for (var t in this.data) {
            var i = this.data[t].data;
            for (var s in i) {
                var n = i[s];
                $.each(n.products, function(t, i) {
                    i.product_id = i.id, delete i.id, i.series = {
                        value: n.series,
                        code: n.series_code
                    }, i.family = n.family, i.model = {
                        name: n.name,
                        code: n.code
                    }, i.fascia_color = _.find(n.fascia_color, {
                        code: i.fascia_color
                    }), i.beam_angle = _.find(n.beam_angle, {
                        code: i.beam_angle
                    }), i.color_temperature = _.find(n.color_temperature, {
                        code: i.color_temperature
                    }), i.light_type = _.find(n.light_type, {
                        code: i.light_type
                    }), i.is_wall_light = n.is_wall_light, e.push(i)
                })
            }
        }
        this.products = e
    }
}, app.project_manager = {
    projects: null,
    areas: null,
    initialised: null,
    selected_project: null,
    selected_design: null,
    selected_area: null,
    new_project: null,
    new_design: null,
    new_area: null,
    autosave: {
        enabled: !0,
        timerId: null,
        inProgress: !1,
        interval: 3e5,
        stop: function() {
            window.clearTimeout(this.timerId)
        },
        start: function() {
            this.inProgress = !0
        },
        end: function() {
            this.inProgress = !1
        },
        reset: function() {
            this.stop(), this.end(), this.enabled && (this.timerId = setTimeout(function() {
                app.project_manager.autosave.start(), app.project_manager.save_project()
            }, this.interval))
        }
    },
    init: function() {
        this.initialised || (this.areas = [], this.initialised = !0), app.sub("project_manager.project.ready", this.on_project_ready, this), app.sub("project_manager.save.started", this.on_save_started, this), app.sub("project_manager.save.finished", this.on_save_finished, this)
    },
    on_project_ready: function() {
        this.autosave.stop(), this.autosave.reset()
    },
    on_save_started: function() {
        this.autosave.stop()
    },
    on_save_finished: function() {
        this.autosave.reset()
    },
    get_projects_sample: function(e, t) {
        app.project_manager.projects = [$.parseJSON(app.sample_project)], this.selected_project = $.parseJSON(app.sample_project), this.selected_design = this.selected_project.designs[0], this.selected_area = this.selected_design.areas[0], app.pub("design_selected", [this.selected_project, this.selected_design])
    },
    get_projects: function(e, t) {
        this.initialised || this.init(), $.ajax({
            context: this,
            url: app.api.get.projects,
            data: {
                structure: !0
            },
            type: "GET",
            xhrFields: {
                withCredentials: !0
            },
            success: function(i) {
                try {
                    this.check_returned_data(i), this.projects = i
                } catch (s) {
                    if ("No data exist" != s.message) return app.pub("error", "load_project"), app.pub("projects_load_error", [i, s.message]), void("undefined" != typeof t && t(area, s.message, s));
                    this.projects = []
                }
                "undefined" != typeof e && e(this.projects)
            },
            error: function(e, i, s) {
                "undefined" != typeof t && t(e, i, s)
            }
        })
    },
    select_project: function(e) {
        $.ajax({
            context: this,
            url: app.api.get.project + "/" + e,
            data: {},
            type: "GET",
            xhrFields: {
                withCredentials: !0
            },
            success: function(e) {
                try {
                    this.check_returned_data(e), this.selected_project = e, this.selected_design = this.selected_project.designs[0], this.selected_area = this.selected_design.areas[0], this.areas = this.selected_design.areas, app.pub("design_selected", [this.selected_project, this.selected_design]), app.pub("project_manager.project.ready")
                } catch (t) {
                    return app.pub("error", "load_project"), void app.pub("projects_load_error", [e, t.message])
                }
            },
            error: function(e, t, i) {}
        })
    },
    select_new_project: function() {
        this.selected_project = this.new_project, this.selected_design = this.new_design, this.selected_area = this.new_area, this.areas = this.selected_design.areas, this.select_area(this.selected_area), app.pub("design_selected", [this.selected_project, this.selected_design])
    },
    get_area: function(e, t, i, s, n) {
        t = "undefined" == typeof t ? !1 : t, n = "undefined" == typeof n ? !1 : n;
        var o = _.find(this.selected_design.areas, {
            id: e
        });
        "undefined" != typeof o && "undefined" != typeof o.designer_data && !t || "number" != typeof o.id ? i(o) : (app.pub("area_load_started", o), $.ajax({
            context: this,
            url: app.api.get.area + "/" + e,
            data: {},
            type: "GET",
            xhrFields: {
                withCredentials: !0
            },
            success: function(e) {
                try {
                    this.check_returned_data(e), o.designer_data = $.parseJSON(e.value)
                } catch (t) {
                    return app.pub("error", "load_project"), app.pub("area_load_error", [o, t.message]), void("undefined" != typeof s && s(o, t.message, t))
                }
                n || app.pub("area_load_finished", o), "undefined" != typeof i && i(o)
            },
            error: function(e, t, i) {
                app.pub("area_load_error", [o, t]), "undefined" != typeof s && s(o, t, i)
            }
        }))
    },
    load_area: function(e) {
        this.get_area(e.id, !1, function(e) {
            "undefined" != typeof e.designer_data && app.pub("area_data_loaded", e)
        })
    },
    select_area: function(e) {
        null !== this.selected_area && this.selected_area.id != e.id && (this.selected_area.designer_data = app.designer.data_manager["export"]()), this.selected_area = e, this.load_area(this.selected_area), app.pub("area_selected", this.selected_area)
    },
    save_project: function(e, t) {
        this.initialised || this.init(), app.pub("project_manager.save.started"), this.save_project_remote($.proxy(this.save_success, this))
    },
    save_success: function(e) {
        this.save_design(this.selected_design, $.proxy(this.save_design_success, this))
    },
    save_design_success: function(e) {
        this.save_all_areas($.proxy(this.save_area_success, this))
    },
    save_area_success: function(e) {
        app.pub("area-save-finished", e), app.pub("project_manager.save.finished")
    },
    save_project_remote: function(e, t) {
        app.pub("project_save_started", this.selected_project);
        var i = null === this.selected_project.id,
            s = {
                title: this.selected_project.title,
                property_type: this.selected_project.property_type,
                client_email: this.selected_project.client_email,
                client_name: this.selected_project.client_name
            };
        i || (s.id = this.selected_project.id);
        var n = i ? "post" : "put";
        $.ajax({
            context: this,
            url: app.api[n].project,
            data: s,
            type: n.toUpperCase(),
            xhrFields: {
                withCredentials: !0
            },
            success: function(s) {
                try {
                    this.check_returned_data(s), i && (this.selected_project.id = s.id), app.pub("project_save_finisehd", this.selected_project)
                } catch (n) {
                    return app.pub("error", "save_project"), app.pub("project_save_error", [this.selected_project, n.message]), void("undefined" != typeof t && t(area, n.message, n))
                }
                "undefined" != typeof e && e(s)
            },
            error: function(e, i, s) {
                app.pub("project_save_error", this.selected_project), "undefined" != typeof t && t(e, i, s), app.pub("project_manager.save.finished")
            }
        })
    },
    save_design: function(e, t, i) {
        app.pub("design_save_started", e), null === e.id ? (e.project_id = this.selected_project.id, $.ajax({
            context: this,
            url: app.api.post.design,
            data: {
                title: e.title,
                project_id: e.project_id,
                description: e.description
            },
            type: "POST",
            xhrFields: {
                withCredentials: !0
            },
            success: function(s) {
                try {
                    this.check_returned_data(s), e.id = s.id, app.pub("design_save_finisehd", e)
                } catch (n) {
                    return app.pub("error", "save_project"), app.pub("design_save_error", [e, n.message]), void("undefined" != typeof i && i(area, n.message, n))
                }
                "undefined" != typeof t && t(s)
            },
            error: function(t, s, n) {
                app.pub("design_save_error", e), "undefined" != typeof i && i(t, s, n), app.pub("project_manager.save.finished")
            }
        })) : $.ajax({
            context: this,
            url: app.api.put.design,
            data: {
                id: e.id,
                title: e.title,
                description: e.description
            },
            type: "PUT",
            xhrFields: {
                withCredentials: !0
            },
            success: function(s) {
                try {
                    this.check_returned_data(s), app.pub("design_save_finisehd", e)
                } catch (n) {
                    return app.pub("design_save_error", [e, n.message]), void("undefined" != typeof i && i(area, n.message, n))
                }
                "undefined" != typeof t && t(s)
            },
            error: function(t, s, n) {
                app.pub("error", "save_project"), app.pub("design_save_error", e), "undefined" != typeof i && i(t, s, n), app.pub("project_manager.save.finished")
            }
        })
    },
    save_area: function(e, t, i) {
        app.pub("area-save-started", e), e.id == this.selected_area.id && (e.designer_data = app.designer.data_manager["export"]());
        var s = JSON.stringify(e.designer_data);
        "number" != typeof e.id ? (e.design_id = this.selected_design.id, $.ajax({
            context: this,
            url: app.api.post.area,
            data: {
                title: e.title,
                design_id: e.design_id,
                value: s
            },
            type: "POST",
            xhrFields: {
                withCredentials: !0
            },
            xhr: function() {
                var e = jQuery.ajaxSettings.xhr();
                return e instanceof window.XMLHttpRequest && e.upload.addEventListener("progress", app.project_manager.on_progress, !1), e
            },
            success: function(s) {
                try {
                    this.check_returned_data(s), e.id = s.id
                } catch (n) {
                    return app.pub("area_save_error", [e, n.message]), void("undefined" != typeof i && i(e, n.message, n))
                }
                "undefined" != typeof t && t(e)
            },
            error: function(t, s, n) {
                app.pub("area_save_error", [e, s]), "undefined" != typeof i && i(t, s, n), app.pub("project_manager.save.finished")
            }
        })) : $.ajax({
            context: this,
            url: app.api.put.area,
            data: {
                id: e.id,
                title: e.title,
                value: s
            },
            type: "PUT",
            xhrFields: {
                withCredentials: !0
            },
            xhr: function() {
                var e = jQuery.ajaxSettings.xhr();
                return e instanceof window.XMLHttpRequest && e.upload.addEventListener("progress", app.project_manager.on_progress, !1), e
            },
            success: function(s) {
                try {
                    this.check_returned_data(s)
                } catch (n) {
                    return app.pub("error", "save_project"), app.pub("area_save_error", [e, n.message]), void("undefined" != typeof i && i(e, n.message, n))
                }
                "undefined" != typeof t && t(e)
            },
            error: function(t, s, n) {
                app.pub("area_save_error", [e, s]), "undefined" != typeof i && i(t, s, n), app.pub("project_manager.save.finished")
            }
        })
    },
    on_progress: function(e) {
        app.pub("area_save_progress", [e.total, e.loaded])
    },
    create_new_project: function(e, t, i, s) {
        return this.new_project = {
            id: null,
            title: e,
            property_type: t,
            client_name: i,
            client_email: s,
            designs: []
        }, app.pub("project_manager.project.ready"), this.new_project
    },
    create_new_design: function(e, t, i) {
        i = "undefined" == typeof i ? !1 : i;
        var s = {
            id: null,
            title: e,
            descrption: t,
            areas: []
        };
        return this.new_design = s, i ? (this.new_design.project_id = null, this.new_project.designs.push(this.new_design)) : (this.new_design.project_id = this.project.id, this.project.designs.push(this.new_design)), this.new_design
    },
    create_new_area: function(e, t, i) {
        i = "undefined" == typeof i ? !1 : i;
        var s = {
            id: null,
            title: e,
            description: t,
            value: null
        };
        return this.new_area = s, this.new_area.id = "temp-" + (new Date).getTime(), i ? (this.new_area.design_id = null, this.new_design.areas.push(this.new_area), this.selected_area = this.new_area) : (this.new_area.design_id = this.selected_design.id, this.selected_design.areas.push(this.new_area), this.select_area(this.new_area)), app.pub("area_created", this.new_area), this.new_area
    },
    find_area_by_id: function(e) {
        return e = isNaN(e) ? String(e) : parseInt(e), _.find(app.project_manager.selected_design.areas, {
            id: e
        })
    },
    delete_project: function(e, t, i) {
        $.ajax({
            context: this,
            url: app.api["delete"].project + "/" + e,
            data: {},
            type: "DELETE",
            xhrFields: {
                withCredentials: !0
            },
            success: function(e) {
                "undefined" != typeof t && t(e)
            },
            error: function(e, t, s) {
                app.pub("error", "delete_project"), "undefined" != typeof i && i(e, t, s)
            }
        })
    },
    check_returned_data: function(e) {
        if ("undefined" != typeof e.Errors) {
            var t = e.Errors[0].Error;
            if (0 === t.indexOf("User not logged in")) throw app.pub("not_logged_in", e), {
                name: "Login Error",
                message: t
            };
            throw {
                name: "System Error",
                message: t
            }
        }
    },
    get_all_areas: function(e) {
        this.load_all_areas(this.selected_design.areas[0], 0, $.proxy(function() {
            e(this.selected_project)
        }, this))
    },
    load_all_areas: function(e, t, i) {
        return t == this.selected_design.areas.length ? void i() : void(e.designer_data ? (t += 1, this.load_all_areas(this.selected_design.areas[t], t, i)) : this.get_area(e.id, !1, $.proxy(function(e) {
            t += 1, this.load_all_areas(this.selected_design.areas[t], t, i)
        }, this), void 0, !0))
    },
    save_all_areas: function(e) {
        this.selected_area.designer_data = app.designer.data_manager["export"](), this.save_areas(this.selected_design.areas[0], 0, $.proxy(function(t) {
            e(t)
        }, this))
    },
    save_areas: function(e, t, i) {
        return t == this.selected_design.areas.length ? void i(this.selected_area) : void(e.designer_data ? this.save_area(e, $.proxy(function(e) {
            t += 1, this.save_areas(this.selected_design.areas[t], t, i)
        }, this)) : (t += 1, this.save_areas(this.selected_design.areas[t], t, i)))
    },
    get_shared_projects: function(e) {
        this.initialised || this.init(), $.ajax({
            context: this,
            url: app.api.get.share,
            type: "GET",
            xhrFields: {
                withCredentials: !0
            },
            success: function(t) {
                try {
                    this.check_returned_data(t), e(t)
                } catch (i) {
                    if ("No data exist" != i.message) return void app.pub("error", "load_shared_project");
                    e([])
                }
            },
            error: function() {
                app.pub("error", "load_shared_project")
            }
        })
    },
    edit_shared_project: function(e) {
        this.initialised || this.init(), $.ajax({
            context: this,
            url: app.api.put.share,
            type: "PUT",
            data: {
                project_id: e.projectId,
                user_id: e.userId,
                is_editable: e.state
            },
            xhrFields: {
                withCredentials: !0
            }
        })
    },
    delete_shared_project: function(e, t) {
        this.initialised || this.init(), $.ajax({
            context: this,
            url: app.api["delete"].share + "/" + e.projectId + "/" + e.userId,
            type: "DELETE",
            data: {},
            xhrFields: {
                withCredentials: !0
            },
            success: function() {
                t(e)
            },
            error: function() {
                app.pub("error", "delete_shared_project")
            }
        })
    },
    share_project: function(e, t) {
        this.initialised || this.init(), $.ajax({
            context: this,
            url: app.api.post.share,
            type: "POST",
            data: {
                project_id: e.projectId,
                email: e.email,
                is_editable: e.is_editable
            },
            xhrFields: {
                withCredentials: !0
            },
            success: function() {
                t()
            },
            error: function() {
                app.pub("error", "create_shared_project"), t()
            }
        })
    },
    export_image: function(e) {
        this.initialised || this.init();
        var t = "";
        return $.ajax({
            context: this,
            url: app.api.post.export_image,
            type: "POST",
            async: !1,
            data: {
                data: e
            },
            xhrFields: {
                withCredentials: !0
            },
            success: function(e) {
                t = e
            }
        }), t
    }
}, app.BaseAsset = Class.extend({
    id: null,
    "class": null,
    path: null,
    selected: null,
    current_style: null,
    selected_style: {
        fillColor: "#ffffff",
        fillAlpha: .01,
        strokeColor: "#009933",
        strokeWidth: 2
    },
    init: function() {},
    create_path: function(e) {
        this.path = new paper.Path, this.path.closed = !0, e.width && (this.width = e.width), e.height && (this.height = e.height), e.segments ? this["import"](e.segments) : this.path = new Path.Rectangle(e.x, e.y, this.width, this.height), this.get_layer().addChild(this.path), this.init_events()
    },
    init_events: function() {
        this.path.onMouseEnter = $.proxy(this.on_mouse_enter, this), this.path.onMouseDown = $.proxy(this.on_mouse_down, this), this.path.onMouseDrag = $.proxy(this.on_mouse_drag, this), this.path.onMouseUp = $.proxy(this.on_mouse_up, this), this.path.onMouseMove = $.proxy(this.on_mouse_move, this), this.path.onMouseLeave = $.proxy(this.on_mouse_leave, this)
    },
    on_mouse_enter: function(e) {},
    on_mouse_down: function(e) {},
    on_mouse_drag: function(e) {},
    on_mouse_up: function(e) {},
    on_mouse_move: function(e) {},
    on_mouse_leave: function(e) {},
    set_active: function(e) {
        if (app.designer.is_busy() && !app.is_dragging()) return !1;
        var t = "active_" + this["class"];
        e ? (null !== app.designer[t] && void 0 !== app.designer[t] && app.designer[t].set_active(!1), app.designer.set_active(t, this), this.set_style(this.active_style)) : (app.designer.clear_active(t), this.set_style(this.base_style)), this.active = e
    },
    set_style: function(e, t) {
        return this.selected === !0 ? (this.path.style.strokeColor = this.selected_style.strokeColor, void(this.path.style.strokeWidth = this.selected_style.strokeWidth)) : void((this.current_style != e || t === !0) && (this.current_style = e, this.path.style = e, e.strokeAlpha && (this.path.strokeColor.alpha = e.strokeAlpha), e.fillAlpha && (this.path.fillColor.alpha = e.fillAlpha)))
    },
    set_selected: function(e, t) {
        this.selected === !0 && (e = !1), e ? (null !== app.designer.selected && void 0 !== app.designer.selected && app.designer.selected.unselect(), this.select(t)) : this.unselect(t)
    },
    select: function() {
        this.set_style(this.selected_style, !0), this.selected = !0, app.designer.selected = this, this.pub_with_type("selected"), app.pub("designer_base_asset_selected", [this])
    },
    unselect: function() {
        this.selected = !1, this.current_style && this.set_style(this.base_style, !0), app.designer.selected = null, this.pub_with_type("unselected"), app.pub("designer_base_asset_unselected", [this])
    },
    export_segments: function() {
        var e, t = [];
        if (this.path.segments)
            for (var i = 0; i < this.path.segments.length; i++) e = this.path.segments[i], t.push([e.point.x - app.designer.zoom_translate_x, e.point.y - app.designer.zoom_translate_y, e.handleIn.x, e.handleIn.y, e.handleOut.x, e.handleOut.y]);
        return t
    },
    "import": function(e) {
        for (var t = 0; t < e.length; t++) {
            var i = e[t];
            segment = new paper.Segment(new paper.Point(i[0], i[1]), new paper.Point(i[2], i[3]), new paper.Point(i[4], i[5])), this.path.add(segment)
        }
    },
    get_width: function() {
        return this.path.bounds.width
    },
    get_height: function() {
        return this.path.strokeBounds.height
    },
    delete_asset: function() {
        return confirm("Are you sure you wish to permentantly delete this " + this["class"] + "?") ? (this.remove(), !0) : !1
    },
    get_layer: function() {
        return app.designer.layers.assets
    },
    pub_with_type: function(e, t) {
        app.pub("designer_" + this.get_class_type() + "_" + e, t || [this])
    },
    get_class_type: function() {
        return this instanceof app.Room ? "room" : this instanceof app.Light ? "light" : this instanceof app.LightGroup ? "lightgroup" : this instanceof app.Asset ? "asset" : void 0
    }
}), app.Asset = app.BaseAsset.extend({
    "class": "asset",
    type: null,
    name: null,
    raster: null,
    width: 0,
    height: 0,
    width_meters: null,
    height_meters: null,
    rotation: 0,
    sticky: !1,
    dragging: null,
    note: null,
    flipped: !1,
    allow_flip: !1,
    sticky_wall: null,
    room: null,
    active: !1,
    move_start_x: null,
    move_start_y: null,
    is_dragging: null,
    wall_distance_line_x: null,
    wall_distance_line_y: null,
    base_style: {
        fillColor: "white",
        fillAlpha: .01,
        strokeColor: "white",
        strokeAlpha: .01,
        strokeWidth: 2,
        rasterOpacity: .7
    },
    active_style: {
        fillColor: "white",
        fillAlpha: .01,
        strokeColor: "white",
        strokeAlpha: .01,
        strokeWidth: 2,
        rasterOpacity: 1
    },
    init: function(e) {
        this.create_path(e), this.id = e.id ? e.id : this.path.id, this.type = e.type, this.set_style(this.base_style), this._super(e), void 0 !== e.rotation && 0 !== e.rotation && this.rotate_by(e.rotation), this.note = e.note ? e.note : {
            notetext: "",
            id: ""
        }, this.flipped = e.flipped ? e.flipped : !1, this.sticky_wall = e.sticky_wall ? e.sticky_wall : null, this.name || (this.name = this.type.toTitle()), this.is_dragging = !1
    },
    create_path: function(e) {
        if (this._super(e), e.original_width ? (this.original_width = e.original_width, this.original_height = e.original_height) : (this.original_width = this.width, this.original_height = this.height), e.width && (this.width = e.width), e.height && (this.height = e.height), e.original_width_meters) this.original_width_meters = e.original_width_meters, this.original_height_meters = e.original_height_meters;
        else {
            this.original_width_meters = this.width_meters;
            var t = this.width / this.width_meters;
            this.height_meters = this.height / t, this.original_height_meters = this.height_meters
        }
        if (this.fancy_resize_data) {
            var i = this.original_width / this.original_width_meters;
            for (var s in this.fancy_resize_data.steps) {
                var n = this.fancy_resize_data.steps[s];
                n.step_size_meters = n.step_size / i
            }
        }
        e.width_meters && (this.width_meters = e.width_meters), e.height_meters && (this.height_meters = e.height_meters);
        var o = this.original_width,
            r = this.original_height;
        if (this.is_light()) this.raster = new Path.Circle({
            center: [-1e3, -1e3],
            radius: this.width / 2,
            fillColor: this.display_colour,
            strokeColor: this.display_colour
        });
        else {
            var a = this.type.toLowerCase() + "-icon";
            0 == $("img#" + a).length && (a = "unknown-icon"), this.raster = new Raster(a, new Rectangle(-1e3, -1e3, o, r))
        }
        this.raster.insertBelow(this.path), this.raster.ignore_events = !0, this.is_light() || (this.raster.opacity = this.base_style.rasterOpacity), this.path.bounds.width = o, this.path.bounds.height = r, this.raster.bounds.setCenter(this.path.bounds.getCenter()), !this.has_resized() && null !== app.designer.room_scale && this.is_scalable() ? this.rescale() : this.set_size(this.width, this.height), this.fancy_resize_data && this.fancy_resize(), this.flipped = e.flipped ? e.flipped : !1, this.flipped && this.flip(null)
    },
    move: function(e, t) {
        if (null === this.move_start_x && null === this.move_start_x && (this.move_start_x = this.path.position.x, this.move_start_y = this.path.position.y), this.move_start_x !== e && this.move_start_y !== t && (t += this.path.bounds.height / 2 + app.designer.drag_offset.y, e += app.designer.drag_offset.x), this.sticky && !this.group && app.designer.active_room) {
            var i = this.get_stick_to_xy(app.designer.active_room, e, t);
            e = i[0], t = i[1];
            var s = i[2]; - 1 != s && this.set_rotation(s)
        }
        var n = {
            x: e - this.path.position.x,
            y: t - this.path.position.y
        };
        this.move_by(n)
    },
    move_by: function(e) {
        this.path.translate(e), this.raster && this.raster.translate(e)
    },
    cancel_move: function() {
        var e = {
            x: this.move_start_x - this.path.bounds.center.x,
            y: this.move_start_y - this.path.bounds.center.y
        };
        this.is_light() && this.group ? (this.group.move_by(e), this.group.refresh_outline()) : this.move_by(e), this.hide_wall_distance_lines(), this.is_dragging = !1, this.path.ignore_events = !1, this.raster.ignore_events = !1, this.move_start_x = null, this.move_start_y = null, null === this.room && this.remove()
    },
    get_stick_to_xy: function(e, t, i) {
        var s = e.path.bounds.x,
            n = s + e.path.bounds.width,
            o = e.path.bounds.y,
            r = o + e.path.bounds.height,
            a = this.sticky_range || 50,
            h = -1,
            l = [{
                wall: "x",
                distance: t - s
            }, {
                wall: "y",
                distance: i - o
            }, {
                wall: "x2",
                distance: n - t
            }, {
                wall: "y2",
                distance: r - i
            }];
        l.sort(function(e, t) {
            return e.distance - t.distance
        });
        var d = l[0].wall,
            c = l[0].distance,
            g = -1;
        return a >= c && ("y" == d ? (i = o + (this.path.bounds.height / 2 - h), g = 90) : "x" == d ? (t = s + (this.path.bounds.width / 2 - h), g = 0) : "x2" == d ? (t = n - (this.path.bounds.width / 2 - h), g = 180) : "y2" == d && (i = r - (this.path.bounds.height / 2 - h), g = 270)), [t, i, g]
    },
    get_sticky_wall: function() {
        var e = this.room.path.bounds.x,
            t = e + this.room.path.bounds.width,
            i = this.room.path.bounds.y,
            s = i + this.room.path.bounds.height,
            n = this.sticky_range || 50,
            o = [{
                wall: "x",
                distance: this.path.position.x - e
            }, {
                wall: "y",
                distance: this.path.position.y - i
            }, {
                wall: "x2",
                distance: t - this.path.position.x
            }, {
                wall: "y2",
                distance: s - this.path.position.y
            }];
        o.sort(function(e, t) {
            return e.distance > t.distance
        });
        var r = o[0].wall,
            a = o[0].distance;
        return n >= a ? r : !1
    },
    rotate: function(e) {
        this.path.rotate(e), this.raster.rotate(e)
    },
    rotate_by: function(e) {
        this.rotate(e), this.rotation += e, this.rotation >= 360 && (this.rotation = this.rotation - 360)
    },
    set_rotation: function(e) {
        this.rotate(0 - this.rotation + e), this.rotation = e, this.rotation >= 360 && (this.rotation = this.rotation - 360)
    },
    flip: function(e) {
        var t = this.raster._position,
            i = t.x,
            s = t.y,
            n = new Matrix(-1, 0, 0, 1, 0, 0),
            o = new Point(i, s),
            r = this.rotation,
            a = this.rotation_step;
        (90 === r || -90 === r || 270 === r || -270 === r) && 90 !== a && (n = new Matrix(1, 0, 0, -1, 0, 0)), 0 !== r && 180 !== r || 90 !== a || (n = new Matrix(1, 0, 0, -1, 0, 0)), this.raster.transform(n), this.raster.position = o, this.flipped = !this.flipped, app.ui.draw()
    },
    set_active: function(e, t) {
        e && !app.designer.active_room && this.room && this.room.set_active(!0), e || t && !this.room.path.contains(t.point) && this.room.on_mouse_leave(t), this.raster.opacity = e ? this.active_style.rasterOpacity : this.base_style.rasterOpacity, this._super(e), e ? app.designer.set_cursor("pointer") : app.designer.reset_cursor()
    },
    move_finish: function() {
        this.sticky && (this.sticky_wall = this.get_sticky_wall()), this.is_dragging = !1, this.move_start_x = null, this.move_start_y = null, this.path.ignore_events = !1, this.raster.ignore_events = !1, this.selected || this.hide_wall_distance_lines(), this.lock_to_room(), this.room.show_circuits()
    },
    on_mouse_enter: function(e) {
        app.designer.is_busy() || (this.set_active(!0), this.refresh_status())
    },
    on_mouse_down: function(e) {
        2 == e.event.button && (window.asset = this)
    },
    on_mouse_drag: function(e) {
        this.is_resizing || app.designer.is_busy() || (!app.dragging && this.room && this.room.hide_circuits(), this.is_dragging = !0, app.dragging = !0, app.drag_type = this.type, app.designer.drag_asset = this, app.designer.drag_offset.x = this.path.bounds.width / 2 + (e.target.bounds.x - e.point.x), app.designer.drag_offset.y = e.target.bounds.y - e.point.y, this.path.ignore_events = !0, this.raster && (this.raster.ignore_events = !0), this.set_active(!0), app.designer.selected && app.designer.selected !== this && app.designer.selected.unselect && app.designer.selected.unselect()), this.is_dragging && this.draw_wall_distance_lines(app.designer.active_room)
    },
    fancy_resize: function(e, t, i) {
        var s = this.type,
            n = this.original_height,
            o = this.original_width;
        0 !== this.rotation && this.path.rotate(0 - this.rotation);
        var r = this.get_fancy_resize_image();
        r && (s = r.image, "y" === this.fancy_resize_data.axis ? n = r.step_size : o = r.step_size);
        var a = s + "-icon";
        if (this.raster.image.id !== a) {
            var h = this.raster;
            this.raster = new Raster(a, new Rectangle(this.path.bounds.x, this.path.bounds.y, o, n)), this.raster.ignore_events = !0, this.raster.insertBelow(this.path), this.raster.opacity = this.base_style.rasterOpacity, this.raster.bounds.width = this.path.bounds.width, this.raster.bounds.height = this.path.bounds.height, this.raster.bounds.setCenter(h.bounds.getCenter()), h.remove(), 0 !== this.rotation && this.raster.rotate(this.rotation)
        }
        0 !== this.rotation && this.path.rotate(this.rotation)
    },
    get_fancy_resize_image: function(e) {
        var t, i;
        e || (e = this.fancy_resize_data.axis), t = "y" === e ? this.path.bounds.height / app.designer.room_scale : this.path.bounds.width / app.designer.room_scale;
        for (var s in this.fancy_resize_data.steps) {
            var n = this.fancy_resize_data.steps[s];
            t >= n.step_size_meters && (i = n)
        }
        return i
    },
    resize: function(e, t, i) {
        if (this.path.scale(e, t, this.resize_anchor), this.raster.scale(e, t, this.resize_anchor), i) {
            var s = 3;
            this.path.bounds.width < s && (this.path.bounds.width = s, this.raster.bounds.width = s), this.path.bounds.height < s && (this.path.bounds.height = s, this.raster.bounds.height = s)
        }
        this.width = this.path.bounds.width, this.height = this.path.bounds.height, this.refresh_status()
    },
    after_resizable_resize: function() {
        if (null !== this.width_meters) {
            var e = void 0 !== this.rotation && 0 !== this.rotation;
            e && this.path.rotate(0 - this.rotation), this.width_meters = this.path.bounds.width / app.designer.room_scale, this.height_meters = this.path.bounds.height / app.designer.room_scale, e && this.path.rotate(this.rotation)
        }
    },
    rescale: function(e) {
        if (e || (e = app.designer.room_scale), e) {
            var t;
            if (this.sticky_wall) switch (this.sticky_wall) {
                case "x":
                    t = this.path.bounds.bottomLeft;
                    break;
                case "x2":
                    t = this.path.bounds.bottomRight;
                    break;
                case "y":
                    t = this.path.bounds.topLeft;
                    break;
                case "y2":
                    t = this.path.bounds.bottomLeft
            }
            var i = void 0 !== this.rotation && 0 !== this.rotation;
            i && this.path.rotate(0 - this.rotation);
            var s = this.width_meters * e;
            if (!this.height_meters) {
                var n = this.original_height / this.original_width;
                this.height_meters = s * n / app.designer.room_scale
            }
            var o = this.height_meters * e,
                r = s / this.path.bounds.width,
                a = o / this.path.bounds.height;
            this.resize_anchor = t ? t : this.path.bounds.center, this.resize(r, a), i && (this.path.rotate(this.rotation), this.width = this.path.bounds.width, this.height = this.path.bounds.height)
        }
    },
    is_scalable: function() {
        return null !== this.width_meters
    },
    set_size: function(e, t) {
        this.width = e, this.height = t, this.raster.bounds.width = this.width, this.raster.bounds.height = this.height, this.path.bounds.width = this.width, this.path.bounds.height = this.height
    },
    has_resized: function() {
        return this.width !== this.original_width && this.height !== this.original_height
    },
    on_mouse_up: function(e) {
        app.is_dragging() && !this.is_dragging && app.designer.drag_asset.path.isBelow(this.path) && app.designer.drag_asset.set_active(!1)
    },
    on_mouse_leave: function(e) {
        this.is_resizing || this.is_dragging || (app.is_dragging() && app.designer.active_room && (app.designer.active_room.path.contains(e.point) || app.designer.active_room.set_active(!1, e)), app.designer.is_busy() || this.set_active(!1, e))
    },
    draw_wall_distance_lines: function(e) {
        if (!e) return void this.hide_wall_distance_lines();
        var t, i, s = e.get_closest_point_on_wall_by_axis(this.path.bounds.center, "x"),
            n = e.get_closest_point_on_wall_by_axis(this.path.bounds.center, "y");
        this.wall_distance_from_center ? t = i = this.path.bounds.center : (t = s.x > this.path.bounds.center.x ? this.path.bounds.rightCenter : this.path.bounds.leftCenter, i = n.y > this.path.bounds.center.y ? this.path.bounds.bottomCenter : this.path.bounds.topCenter), this.wall_distance_line_x = this.wall_distance_line_x || new app.DistanceLine, this.wall_distance_line_x.refresh_points(s, t), this.wall_distance_line_y = this.wall_distance_line_y || new app.DistanceLine, this.wall_distance_line_y.refresh_points(n, i)
    },
    hide_wall_distance_lines: function() {
        this.wall_distance_line_x && this.wall_distance_line_x.hide(), this.wall_distance_line_x && this.wall_distance_line_y.hide()
    },
    remove_wall_distance_lines: function() {
        this.wall_distance_line_x && this.wall_distance_line_x.remove(), this.wall_distance_line_x && this.wall_distance_line_y.remove()
    },
    show_note_dialog: function(e) {
        var t = 250,
            i = 180;
        app.Room._asset_note_dialog || (app.Room._asset_note_dialog = $(".asset_note_dialog").dialog({
            title: "Note for " + this.name,
            width: 275,
            height: i,
            resizable: !1,
            draggable: !0,
            autoOpen: !1,
            dialogClass: "small_dialog_heading",
            open: function() {
                app.dialog_showing = !0
            }
        })), $("#note_text").val(""), $("#note_text").maxlength("destroy"), app.Room._asset_note_dialog.dialog("option", "title", "Note for " + this.name), app.Room._asset_note_dialog.dialog("option", "height", t), app.Room._asset_note_dialog.dialog("option", "buttons", {
            Save: $.proxy(this.save_asset_note, this),
            Cancel: function() {
                $(this).dialog("close")
            }
        }), app.Room._asset_note_dialog.dialog("option", "beforeClose", $.proxy(function() {
            app.dialog_showing = !1
        }, this));
        var s = e.x,
            n = e.y - app.Room._asset_note_dialog.height();
        $("#note_text").val(this.note.notetext).maxlength({
            max: 100
        }), app.Room._asset_note_dialog.dialog("option", "position", [s, n]), app.Room._asset_note_dialog.dialog("open")
    },
    save_asset_note: function() {
        this.note.notetext = $("#note_text").val(), app.Room._asset_note_dialog.dialog("close")
    },
    select: function() {
        this._super(), this.draw_wall_distance_lines(this.room)
    },
    unselect: function() {
        return this.is_dragging ? !1 : (this.hide_wall_distance_lines(), void this._super())
    },
    show_controls: function(e) {},
    hide_controls: function() {},
    hide: function() {
        this.path.visible = !1
    },
    show: function() {
        this.path.visible = !0
    },
    is_visible: function() {
        return this.path.visible
    },
    is_light: function() {
        return this instanceof app.Light
    },
    is_light_switch: function() {
        return this instanceof app.Asset.LightSwitch || this instanceof app.Asset.LightSwitchDimmer || this instanceof app.Asset.LightSwitchTouch
    },
    get_dimensions: function() {
        var e = app.designer.room_scale;
        return {
            width: Math.round(this.path.bounds.width / e * 10) / 10,
            height: Math.round(this.path.bounds.height / e * 10) / 10
        }
    },
    get_hover_status: function() {
        if (app.designer.is_busy()) return "";
        var e = this.name,
            t = this.get_dimensions();
        return t && (e += " - " + t.width + "x" + t.height + " (meters)", this.note && this.note.notetext && "" !== this.note.notetext && (e += " Notes: " + this.note.notetext)), e
    },
    refresh_status: function() {
        app.set_status(this.get_hover_status())
    },
    "export": function() {
        var e = this.rotation,
            t = void 0 !== this.rotation && 0 !== this.rotation,
            i = 4;
        t && this.path.rotate(0 - this.rotation);
        var s = {
            id: this.id,
            type: this.type,
            x: parseFloat(this.path.bounds.x).toFixed(i),
            y: parseFloat(this.path.bounds.y).toFixed(i),
            width: parseFloat(this.path.bounds.width).toFixed(i),
            height: parseFloat(this.path.bounds.height).toFixed(i),
            original_width: parseFloat(this.original_width).toFixed(i),
            original_height: parseFloat(this.original_height).toFixed(i),
            stroke_width: this.base_style.strokeWidth,
            rotation: e,
            segments: this.export_segments(),
            note: this.note,
            flipped: this.flipped
        };
        return this.is_scalable && (s.width_meters = parseFloat(this.width_meters).toFixed(i), s.height_meters = parseFloat(this.height_meters).toFixed(i), s.original_width_meters = parseFloat(this.original_width_meters).toFixed(i), s.original_height_meters = parseFloat(this.original_height_meters).toFixed(i)), this.sticky_wall && (s.sticky_wall = this.sticky_wall), t && this.path.rotate(this.rotation), s
    },
    remove: function() {
        this.path.remove(), this.room && (this.unselect(), this.room.remove_asset(this)), this.raster && this.raster.remove(), this.remove_wall_distance_lines(), app.ui.draw()
    },
    draw_note: function() {
        if ("" !== this.note.id) {
            var e = this.path.bounds.getCenter(),
                t = .25 * app.designer.room_scale / 2;
            2 * t > this.path.bounds.width - this.path.bounds.width / 2 && (e = this.path.bounds.getTopRight(), e = new Point(e.x + t, e.y - t));
            var i = new Path.Circle(new Point(e.x, e.y), t);
            i.fillColor = "white", i.strokeColor = "black";
            var s = new PointText(new Point(e.x, e.y + t / 3));
            s.justification = "center", s.fillColor = "#5252F7", s.fontSize = t, s.content = this.note.id, app.designer.note_paths.push(s), app.designer.note_paths.push(i)
        }
    },
    lock_to_room: function() {
        if (null !== this.room) {
            this.room.path.bounds.height < this.path.bounds.height && this.set_size(this.path.bounds.width, this.room.path.bounds.height - 2 * this.room.path.strokeWidth), this.room.path.bounds.width < this.path.bounds.width && this.set_size(this.room.path.bounds.width - 2 * this.room.path.strokeWidth, this.path.bounds.height);
            for (var e = 0; 2 > e; e++) !this.room.path.contains(this.path.bounds.topLeft) && this.room.path.contains(this.path.bounds.topRight) && this.move_by({
                x: this.room.path.bounds.left - this.path.bounds.topLeft.x + this.room.path.strokeWidth,
                y: 0
            }), this.room.path.contains(this.path.bounds.topLeft) && !this.room.path.contains(this.path.bounds.topRight) && this.move_by({
                x: this.room.path.bounds.right - this.path.bounds.topRight.x - this.room.path.strokeWidth,
                y: 0
            }), this.room.path.contains(this.path.bounds.topLeft) || this.room.path.contains(this.path.bounds.topRight) || this.move_by({
                x: 0,
                y: this.room.path.bounds.top - this.path.bounds.topLeft.y + this.room.path.strokeWidth
            }), this.room.path.contains(this.path.bounds.bottomLeft) || this.room.path.contains(this.path.bounds.bottomRight) || this.move_by({
                x: 0,
                y: this.room.path.bounds.bottomRight.y - this.path.bounds.bottomRight.y - this.room.path.strokeWidth
            })
        }
        this.is_dragging = !1, this.path.ignore_events = !1, this.raster && (this.raster.ignore_events = !1)
    },
    is_in_room: function() {
        return null === this.room ? !1 : this.room.path.bounds.contains(this.path.bounds.getTopLeft()) || this.room.path.bounds.contains(this.path.bounds.getTopRight()) || this.room.path.bounds.contains(this.path.bounds.getBottomRight()) || this.room.path.bounds.contains(this.path.bounds.getBottomLeft())
    }
}), app.ResizableAsset = app.Asset.extend({
    bounds_hash: null,
    handles_group: null,
    handles: null,
    handle_size: 10,
    handle_color: "black",
    handle_active_color: app.colours.main,
    active_handle: null,
    resize_direction: null,
    resize_downpoint: null,
    resize_anchor: null,
    is_resizing: null,
    first_resize_drag: null,
    CURSOR: {
        top: "n-resize",
        left: "w-resize",
        bottom: "s-resize",
        right: "e-resize",
        topleft: "nw-resize",
        topright: "ne-resize",
        bottomleft: "sw-resize",
        bottomright: "se-resize"
    },
    init: function(e) {
        this._super(e)
    },
    show_handles: function() {
        if (this.handles || (this.handles = []), this.is_flush()) {
            var e = this.get_bounds_hash();
            this.bounds_hash !== e && (this.path.segments.length !== this.handles.length ? this.create_handles() : this.reposition_handles(), this.bounds_hash = e), app.designer.layers.handles.addChild(this.handles_group)
        }
    },
    is_flush: function() {
        return 0 === Math.abs(this.rotation % 90)
    },
    create_handles: function() {
        this.handles_group && (_.invoke(this.handles, "remove"), this.handles_group.remove()), this.handles = [];
        for (var e in this.path.segments) {
            var t = this.path.segments[e],
                i = this.handle_size,
                s = new Path.Rectangle({
                    point: [t.point.x - i / 2, t.point.y - i / 2],
                    size: [i, i],
                    fillColor: this.handle_color
                });
            s.onMouseEnter = $.proxy(this.on_handle_mouse_enter, this), s.onMouseDown = $.proxy(this.on_handle_mouse_down, this), s.onMouseDrag = $.proxy(this.on_handle_mouse_drag, this), s.onMouseUp = $.proxy(this.on_handle_mouse_up, this), s.onMouseLeave = $.proxy(this.on_handle_mouse_leave, this), this.handles[e] = s
        }
        this.handles_group = new Group(this.handles)
    },
    reposition_handles: function() {
        for (var e in this.path.segments) {
            var t = this.path.segments[e];
            this.handles[e].position = new Point(t.point.x, t.point.y)
        }
    },
    hide_handles: function() {
        this.handles_group && this.handles_group.layer && (this.active_handle && this.unset_active_handle(), this.handles_group.remove())
    },
    on_handle_mouse_enter: function(e) {
        this.is_resizing || (this.set_handle_cursor(e.point),
            this.set_active_handle(e.target))
    },
    set_handle_cursor: function(e) {
        this.resize_direction = this.get_resize_direction(e, !0), this.set_resize_cursor(this.resize_direction)
    },
    on_handle_mouse_down: function(e) {
        this.set_handle_cursor(e.point), this.on_mouse_down(e)
    },
    on_handle_mouse_drag: function(e) {
        this.on_mouse_drag(e)
    },
    on_handle_mouse_up: function(e) {
        app.designer.cancel_mouseup = !0, this.on_mouse_up(e), this.set_handle_cursor(e.point), this.resize_direction = null
    },
    set_active_handle: function(e) {
        e.style.fillColor = this.handle_active_color, this.active_handle = e
    },
    unset_active_handle: function() {
        this.active_handle && (this.active_handle.style.fillColor = this.handle_color, this.active_handle = null)
    },
    on_handle_mouse_leave: function(e) {
        app.designer.is_busy() || app.designer.reset_cursor(), this.is_resizing || this.unset_active_handle()
    },
    get_bounds_hash: function() {
        return _.map(this.path.segments, function(e) {
            return e.point.x + "||" + e.point.y
        }).join("")
    },
    select: function() {
        this.show_handles(), this._super()
    },
    unselect: function() {
        this.hide_handles(), this._super()
    },
    move_by: function(e) {
        this._super(e), this.selected && this.hide_handles()
    },
    on_mouse_move: function(e) {
        if (this.selected) {
            var t = {
                    segments: !1,
                    handles: !1,
                    stroke: this.path.closed,
                    fill: !1,
                    tolerance: 2
                },
                i = paper.project.hitTest(e.point, t),
                s = this.resize_direction;
            i && i.item.id == this.path.id ? "stroke" == i.type && (this.resize_direction = this.get_resize_direction(e.point), this.set_resize_cursor(this.resize_direction)) : this.resize_direction = null, this.resize_direction || s === this.resize_direction || this.cancel_resize()
        }
        this._super(e)
    },
    move_finish: function() {
        this._super(), this.selected && this.show_handles()
    },
    get_resize_direction: function(e, t) {
        var i;
        if (!this.is_flush()) return null;
        if (t) {
            i = 5;
            var s = e.y,
                n = e.x,
                o = this.path.bounds.y,
                r = this.path.bounds.x;
            if (this.is_close_too(s, o, i) && this.is_close_too(n, r, i)) return "topleft";
            if (this.is_close_too(s, o, i) && this.is_close_too(n, r + this.path.bounds.width, i)) return "topright";
            if (this.is_close_too(n, r, i) && this.is_close_too(s, o + this.path.bounds.height, i)) return "bottomleft";
            if (this.is_close_too(n, r + this.path.bounds.width, i) && this.is_close_too(s, o + this.path.bounds.height, i)) return "bottomright"
        } else {
            if (i = 3, e.x < this.path.bounds.x + i) return "left";
            if (e.x > this.path.bounds.x + this.path.bounds.width - i) return "right";
            if (e.y < this.path.bounds.y + i) return "top";
            if (e.y > this.path.bounds.y + this.path.bounds.height - i) return "bottom"
        }
    },
    is_close_too: function(e, t, i) {
        return t >= e - i && e + i >= t
    },
    set_resize_cursor: function(e) {
        if ("any" === e) return void app.designer.set_cursor("pointer");
        if (void 0 !== e) {
            var t = this.CURSOR[e] ? this.CURSOR[e] : e;
            app.designer.set_cursor(t)
        }
    },
    on_mouse_down: function(e) {
        !app.designer.is_busy() && this.resize_direction && this.selected && (this.hide_controls(), this.is_resizing = !0, this.resize_anchor = this.get_resize_anchor(this.resize_direction), this.resize_downpoint = e.point, this.resize_x = 0, this.resize_y = 0), this.first_resize_drag = !1, this._super(e)
    },
    on_mouse_drag: function(e) {
        if (this.is_resizing) {
            this.first_resize_drag || (this.pub_with_type("resize_start"), this.first_resize_drag = !0);
            var t = e.delta.x,
                i = e.delta.y; - 1 !== this.resize_direction.indexOf("left") && (t = 0 - t), -1 !== this.resize_direction.indexOf("top") && (i = 0 - i), this.resize_x += t, this.resize_y += i;
            var s = this.path.bounds.width > 0 ? this.path.bounds.width : 1,
                n = this.path.bounds.height > 0 ? this.path.bounds.height : 1,
                o = 1 + t / s,
                r = 1 + i / n;
            o >= .4 && r >= .4 && 2 > o && 2 > r && this.resize(o, r, e), this.fancy_resize_data && this.fancy_resize(this.resize_x, this.resize_y, e), this.draw_wall_distance_lines(this.room), this.lock_to_room(), this.reposition_handles(), this.user_resized = !0
        }
        this._super(e)
    },
    on_mouse_up: function(e) {
        this.group && (app.designer.cancel_mouseup = !0), this.user_resized && (this.cancel_resize(), this.pub_with_type("resize_end")), this.first_resize_drag = !1, this.is_resizing = !1, app.designer.is_resizing = !1, this._super(e, this.user_resized), this.user_resized && (this.after_resizable_resize && this.after_resizable_resize(), app.designer.cancel_mouseup = !0), this.user_resized = !1
    },
    cancel_resize: function() {
        app.designer.reset_cursor(), this.resize_direction = null, this.is_resizing = !1, this.resize_downpoint = null
    },
    get_resize_anchor: function(e) {
        switch (e) {
            case "left":
                return new Point(this.path.bounds.x + this.path.bounds.width, this.path.bounds.y);
            case "right":
                return new Point(this.path.bounds.x, this.path.bounds.y);
            case "top":
                return new Point(this.path.bounds.x, this.path.bounds.y + this.path.bounds.height);
            case "bottom":
                return new Point(this.path.bounds.x, this.path.bounds.y);
            case "topleft":
                return new Point(this.path.bounds.x + this.path.bounds.width, this.path.bounds.y + this.path.bounds.height);
            case "topright":
                return new Point(this.path.bounds.x, this.path.bounds.y + this.path.bounds.height);
            case "bottomleft":
                return new Point(this.path.bounds.x + this.path.bounds.width, this.path.bounds.y);
            case "bottomright":
                return new Point(this.path.bounds.x, this.path.bounds.y)
        }
    },
    on_mouse_leave: function(e) {
        app.designer.is_busy() || app.designer.reset_cursor(), this._super(e)
    },
    remove_handles: function() {
        this.handles_group && (_.invoke(this.handles, "remove"), this.handles_group.remove())
    },
    remove: function() {
        this.remove_handles(), this._super()
    },
    rotate_by: function(e) {
        this.hide_handles(), this._super(e), this.selected && this.is_flush() && this.show_handles()
    }
}), app.RestructurableAsset = app.BaseAsset.extend({
    bounds_hash: null,
    handles_group: null,
    handles: null,
    handle_size: 10,
    handle_color: "black",
    handle_active_color: app.colours.main,
    handle_selected_color: "red",
    handle_mouse_down: !1,
    active_handle: null,
    selected_handle: null,
    resize_direction: null,
    resize_anchor: null,
    drag_direction: null,
    is_resizing: null,
    user_resized: null,
    user_restructured: null,
    CURSOR: {
        top: "n-resize",
        left: "w-resize",
        bottom: "s-resize",
        right: "e-resize",
        topleft: "nw-resize",
        topright: "ne-resize",
        bottomleft: "sw-resize",
        bottomright: "se-resize"
    },
    SNAP_TOLERANCE: 4,
    init: function(e) {
        this.handles = [], this._super(e)
    },
    is_rectangle: function() {
        return 4 === this.path.segments.length && this.path.segments[0].point.x === this.path.segments[1].point.x && this.path.segments[2].point.x === this.path.segments[3].point.x && this.path.segments[0].point.y === this.path.segments[3].point.y && this.path.segments[1].point.y === this.path.segments[2].point.y
    },
    show_handles: function() {
        var e = this.get_bounds_hash();
        this.bounds_hash !== e && (this.path.segments.length !== this.handles.length ? this.create_handles() : this.reposition_handles(), this.bounds_hash = e), app.designer.layers.handles.addChild(this.handles_group)
    },
    create_handles: function() {
        this.handles_group && (_.invoke(this.handles, "remove"), this.handles_group.remove()), this.handles = [];
        for (var e in this.path.segments) {
            var t = this.path.segments[e],
                i = this.handle_size,
                s = new Path.Rectangle({
                    point: [t.point.x - i / 2, t.point.y - i / 2],
                    size: [i, i],
                    fillColor: this.handle_color
                });
            s.onMouseEnter = $.proxy(this.on_handle_mouse_enter, this), s.onMouseDown = $.proxy(this.on_handle_mouse_down, this), s.onMouseDrag = $.proxy(this.on_handle_mouse_drag, this), s.onMouseUp = $.proxy(this.on_handle_mouse_up, this), s.onMouseLeave = $.proxy(this.on_handle_mouse_leave, this), s.segment = t, this.handles[e] = s
        }
        this.handles_group = new Group(this.handles)
    },
    reposition_handles: function() {
        for (var e in this.path.segments) {
            var t = this.path.segments[e],
                i = this.handles[e];
            i.position = new Point(t.point.x, t.point.y), i.segment = t
        }
    },
    hide_handles: function() {
        this.handles_group && this.handles_group.layer && (this.active_handle && this.set_handle_active(!1, this.active_handle), this.handles_group.remove())
    },
    on_handle_mouse_enter: function(e) {
        app.designer.is_busy() || (this.set_handle_cursor(e.point), this.set_handle_active(!0, e.target)), this.on_mouse_enter(e)
    },
    set_handle_cursor: function(e) {
        app.designer.reset_cursor(), this.resize_direction = this.get_resize_direction(e, !0), this.set_resize_cursor(this.resize_direction)
    },
    on_handle_mouse_down: function(e) {
        this.set_handle_cursor(e.point), this.handle_mouse_down = !0, this.on_mouse_down(e)
    },
    on_handle_mouse_drag: function(e) {
        this.active_handle || this.set_handle_active(!0, e.target), this.on_mouse_drag(e, !0)
    },
    on_handle_mouse_up: function(e) {
        if (app.designer.cancel_mouseup = !0, this.user_resized) this.on_mouse_up(e), this.show_handles(), app.designer.reset_cursor();
        else {
            var t = !this.selected_handle;
            this.set_handle_selected(t, this.active_handle)
        }
    },
    set_handle_active: function(e, t) {
        t !== this.selected_handle && (e ? (t.style.fillColor = this.handle_active_color, this.active_handle = t) : (this.active_handle.style.fillColor = this.handle_color, this.active_handle = null))
    },
    set_handle_selected: function(e, t) {
        e ? (t.style.fillColor = this.handle_selected_color, this.selected_handle = t) : (t.style.fillColor = this.selected_handle === this.active_handle ? this.handle_active_color : this.handle_color, this.selected_handle = null)
    },
    on_handle_mouse_leave: function(e) {
        app.designer.is_busy() || (app.designer.reset_cursor(), this.active_handle && this.set_handle_active(!1, this.active_handle), this.selected_handle && (this.active_handle = null, this.set_handle_selected(!1, this.selected_handle)), this.path.contains(e.point) || this.set_active(!1))
    },
    delete_selected_handle: function() {
        confirm("Are you sure you wish to remove this segment?") && (this.selected_handle.segment.remove(), this.show_handles())
    },
    select: function() {
        this.show_handles(), this._super()
    },
    unselect: function() {
        this.ghost_handle && this.ghost_handle.layer || (this.hide_handles(), this._super())
    },
    move_by: function(e) {
        this._super(e), this.selected && this.hide_handles()
    },
    on_mouse_move: function(e) {
        if (this.selected) {
            var t = {
                    segments: !1,
                    handles: !1,
                    stroke: this.path.closed,
                    fill: !1,
                    tolerance: 2
                },
                i = paper.project.hitTest(e.point, t);
            i && i.item.id == this.path.id ? "stroke" == i.type && (e.event.shiftKey ? this.active_handle || this.show_ghost_handle(e.point) : (this.resize_direction = this.get_resize_direction(e.point), this.set_resize_cursor(this.resize_direction), this.clear_ghost_handle(), this.last_move_point = e.point)) : (this.resize_direction && this.cancel_resize(), this.ghost_handle && this.ghost_handle.layer && this.clear_ghost_handle())
        }
        this._super(e)
    },
    show_ghost_handle: function(e) {
        if (this.ghost_handle) this.ghost_handle.position = e;
        else {
            var t = this.handle_size;
            this.ghost_handle = new Path.Rectangle({
                point: [e.x - t / 2, e.y - t / 2],
                size: [t, t],
                fillColor: this.handle_color
            }), this.ghost_handle.fillColor.alpha = .4, this.ghost_handle.ignore_events = !0
        }
        app.designer.layers.handles.addChild(this.ghost_handle)
    },
    clear_ghost_handle: function(e) {
        this.ghost_handle && this.ghost_handle.remove()
    },
    shift_press: function() {
        this.resize_direction && !this.active_handle && (app.designer.reset_cursor(), this.show_ghost_handle(this.last_move_point))
    },
    move_finish: function() {
        this._super(), this.selected && this.show_handles()
    },
    get_resize_direction: function(e, t) {
        var i;
        if (t) {
            i = 5;
            var s = e.y,
                n = e.x,
                o = this.path.bounds.y,
                r = this.path.bounds.x;
            if (this.is_close_too(s, o, i) && this.is_close_too(n, r, i)) return "topleft";
            if (this.is_close_too(s, o, i) && this.is_close_too(n, r + this.path.bounds.width, i)) return "topright";
            if (this.is_close_too(n, r, i) && this.is_close_too(s, o + this.path.bounds.height, i)) return "bottomleft";
            if (this.is_close_too(n, r + this.path.bounds.width, i) && this.is_close_too(s, o + this.path.bounds.height, i)) return "bottomright"
        } else {
            if (i = 3, e.x < this.path.bounds.x + i) return "left";
            if (e.x > this.path.bounds.x + this.path.bounds.width - i) return "right";
            if (e.y < this.path.bounds.y + i) return "top";
            if (e.y > this.path.bounds.y + this.path.bounds.height - i) return "bottom"
        }
        return "any"
    },
    is_close_too: function(e, t, i) {
        return t >= e - i && e + i >= t
    },
    set_resize_cursor: function(e) {
        if ("any" === e) return void app.designer.set_cursor("pointer");
        if (void 0 !== e) {
            var t = this.CURSOR[e] ? this.CURSOR[e] : e;
            app.designer.set_cursor(t)
        }
    },
    on_mouse_down: function(e) {
        !app.designer.is_busy() && this.resize_direction && this.selected && (this.is_resizing = !0, this.resize_anchor = this.get_resize_anchor(this.resize_direction), this.downpoint_x = e.point.x, this.downpoint_y = e.point.y, this.drag_direction = this.handle_mouse_down ? this.get_closest_corner(e.point) : this.get_closest_side(e.point), this.pub_with_type("restructure_start")), this.handle_mouse_down = !1, this._super(e)
    },
    on_mouse_drag: function(e, t) {
        if (this._is_rectangle = this.is_rectangle(), this.is_resizing) {
            if (this.draw_snap_lines(e.point), this._is_rectangle && !e.event.shiftKey) {
                var i = e.delta.x,
                    s = e.delta.y,
                    n = this.drag_direction.toLowerCase(); - 1 !== n.indexOf("top") && this.resize_bounds({
                    top: this.path.bounds.top + s
                }), -1 !== n.indexOf("right") && this.resize_bounds({
                    right: this.path.bounds.right + i
                }), -1 !== n.indexOf("bottom") && this.resize_bounds({
                    bottom: this.path.bounds.bottom + s
                }), -1 !== n.indexOf("left") && this.resize_bounds({
                    left: this.path.bounds.left + i
                }), this.reposition_handles()
            } else this.active_handle && (this.active_handle.position = e.point, this.active_handle.segment.point = e.point, this.user_restructured = !0);
            this.user_resized = !0
        }
        this._super(e)
    },
    draw_snap_lines: function(e) {
        var t = this.find_nearest_rooms(e);
        this.snap_to_x = t.x_point ? t.x_point.x : null, this.snap_to_y = t.y_point ? t.y_point.y : null, app.snap_manager.draw_lines(t, e)
    },
    find_nearest_rooms: function(e) {
        var t = new Point(e.x, e.y),
            i = app.designer.rooms,
            s = this.SNAP_TOLERANCE,
            n = "",
            o = this.drag_direction.toLowerCase(),
            r = ["topLeft", "topRight", "bottomLeft", "bottomRight", "center"],
            a = [];
        return a.push($.proxy(function(e) {
            return e.id === this.id
        }, this)), (-1 !== o.indexOf("top") || -1 !== o.indexOf("bottom")) && (n += "y"), (-1 !== o.indexOf("left") || -1 !== o.indexOf("right")) && (n += "x"), app.snap_manager.find_nearest_asset_points(t, n, i, s, r, a)
    },
    on_mouse_up: function(e) {
        if (this.user_resized) {
            if (app.snap_manager.remove_lines(), this.user_restructured) this.snap_to_x && (this.active_handle.segment.point.x = this.snap_to_x), this.snap_to_y && (this.active_handle.segment.point.y = this.snap_to_y);
            else {
                var t, i;
                if (this.snap_to_x) {
                    t = this.get_closest_side_by_axis(e.point.x, "x");
                    var s = t.side;
                    i = {}, i[s] = this.snap_to_x, this.resize_bounds(i), this.reposition_handles()
                }
                if (this.snap_to_y) {
                    t = this.get_closest_side_by_axis(e.point.y, "y");
                    var n = t.side;
                    i = {}, i[n] = this.snap_to_y, this.resize_bounds(i), this.reposition_handles()
                }
            }
            this.cancel_resize(), this.is_resizing = !1, app.designer.is_resizing = !1
        }
        if (this.ghost_handle && this.ghost_handle.layer) {
            var o = {
                    segments: !1,
                    handles: !1,
                    stroke: !0,
                    fill: !1,
                    tolerance: 3
                },
                r = paper.project.hitTest(e.point, o);
            if (!r || r.item.id !== this.path.id) return;
            if (this.selected_segment = null, this.selected) {
                var a = r.location;
                this.selected_segment = this.path.insert(a.index + 1, e.point), this.create_handles()
            }
        } else this._super(e), this.user_resized && (this.after_resizable_resize && this.after_resizable_resize(), this.user_resized = !1, this.user_restructured = !1, app.designer.cancel_mouseup = !0, this.pub_with_type("restructure_end")), this._is_rectangle = !1
    },
    on_mouse_leave: function(e) {
        app.designer.is_busy() || app.designer.reset_cursor(), this.ghost_handle && this.clear_ghost_handle(), this._super(e)
    },
    cancel_resize: function() {
        app.designer.reset_cursor(), this.resize_direction = null, this.is_resizing = !1, this.resize_anchor = null, this._is_rectangle = !1
    },
    get_resize_anchor: function(e) {
        switch (e) {
            case "left":
                return new Point(this.path.bounds.x + this.path.bounds.width, this.path.bounds.y);
            case "right":
                return new Point(this.path.bounds.x, this.path.bounds.y);
            case "top":
                return new Point(this.path.bounds.x, this.path.bounds.y + this.path.bounds.height);
            case "bottom":
                return new Point(this.path.bounds.x, this.path.bounds.y);
            case "topleft":
                return new Point(this.path.bounds.x + this.path.bounds.width, this.path.bounds.y + this.path.bounds.height);
            case "topright":
                return new Point(this.path.bounds.x, this.path.bounds.y + this.path.bounds.height);
            case "bottomleft":
                return new Point(this.path.bounds.x + this.path.bounds.width, this.path.bounds.y);
            case "bottomright":
                return new Point(this.path.bounds.x, this.path.bounds.y)
        }
    },
    get_closest_corner: function(e) {
        var t = this.get_closest_side_by_axis(e.x, "x"),
            i = this.get_closest_side_by_axis(e.y, "y");
        return i.side + t.side.toCamel()
    },
    get_closest_side: function(e) {
        var t = this.get_closest_side_by_axis(e.x, "x"),
            i = Math.abs(e.x - t.number),
            s = this.get_closest_side_by_axis(e.y, "y"),
            n = Math.abs(e.y - s.number);
        return n > i ? t.side : s.side
    },
    get_closest_side_by_axis: function(e, t) {
        var i = {},
            s = "x" === t,
            n = "y" === t;
        s && (i.left = this.path.bounds.left, i.right = this.path.bounds.right), n && (i.top = this.path.bounds.top, i.bottom = this.path.bounds.bottom);
        var o = this.get_closest_number(i, e),
            r = _.invert(i)[o];
        return {
            side: r,
            number: o
        }
    },
    get_closest_number: function(e, t) {
        var i = _.map(e, function(e) {
            return [e, Math.abs(e - t)]
        });
        return _.reduce(i, function(e, t) {
            return e[1] < t[1] ? e : t
        }, [-1, 999])[0]
    },
    get_bounds_hash: function() {
        return _.map(this.path.segments, function(e) {
            return e.point.x + "||" + e.point.y
        }).join("")
    },
    remove_handles: function() {
        this.handles_group && (_.invoke(this.handles, "remove"), this.handles_group.remove())
    },
    remove: function() {
        this.remove_handles()
    }
}), app.Asset.Window = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "window", this.width = 10, this.height = 44, this.rotation_step = 45, this.sticky = !0, this.width_meters = .2, this.fancy_resize_data = {
            axis: "y",
            steps: [{
                step_size: 88,
                image: "window-step2"
            }]
        }, this._super(e)
    }
}), app.Asset.Bed = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "bed", this.width = 109, this.height = 59, this.rotation_step = 10, this.width_meters = 1.87, this._super(e)
    }
}), app.Asset.DoubleBed = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "double-bed", this.width = 109, this.height = 94, this.rotation_step = 10, this.width_meters = 1.87, this._super(e)
    }
}), app.Asset.Table = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "table", this.width = 94, this.height = 77, this.rotation_step = 10, this.width_meters = 1.5, this.fancy_resize_data = {
            axis: "y",
            steps: [{
                step_size: 123,
                image: "table-step2"
            }]
        }, this._super(e)
    }
}), app.Asset.RoundTable = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "round-table", this.width = 70, this.height = 67, this.rotation_step = 10, this.width_meters = 1.3, this._super(e)
    }
}), app.Asset.SmallTable = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "small-table", this.width = 35, this.height = 33, this.rotation_step = 10, this.width_meters = .9, this._super(e)
    }
}), app.Asset.Chair = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "chair", this.width = 26, this.height = 21, this.rotation_step = 10, this.width_meters = .7, this._super(e)
    }
}), app.Asset.Couch = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "couch", this.width = 46, this.height = 83, this.rotation_step = 10, this.fancy_resize_data = {
            axis: "y",
            steps: [{
                step_size: 125,
                image: "couch-step2"
            }]
        }, this.width_meters = .75, this._super(e)
    }
}), app.Asset.Recliner = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "recliner", this.width = 67, this.height = 34, this.rotation_step = 10, this.width_meters = 1.4, this._super(e)
    }
}), app.Asset.Tv = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "tv", this.width = 22, this.height = 118, this.rotation_step = 45, this.sticky = !0, this.width_meters = .11, this._super(e)
    }
}), app.Asset.CinemaScreen = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "cinema-screen", this.width = 7, this.height = 160, this.rotation_step = 45, this.sticky = !0, this.width_meters = .08, this._super(e)
    }
}), app.Asset.Bench = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "bench", this.width = 140, this.height = 42, this.rotation_step = 10, this.width_meters = 1.8, this._super(e)
    }
}), app.Asset.Computer = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "computer", this.width = 71, this.height = 32, this.rotation_step = 10, this.width_meters = .6, this._super(e)
    }
}), app.Asset.OfficeDesk = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "office-desk", this.width = 141, this.height = 43, this.rotation_step = 10, this.width_meters = 1.8, this._super(e)
    }
}), app.Asset.PrintStation = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "print-station", this.width = 35, this.height = 33, this.rotation_step = 10, this.width_meters = 1, this.width_meters = .6, this._super(e)
    }
}), app.Asset.Fridge = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "fridge", this.width = 40, this.height = 46, this.rotation_step = 45, this.sticky = !0, this.width_meters = .85, this._super(e)
    }
}), app.Asset.KitchenSink = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "kitchen-sink", this.width = 42, this.height = 46, this.rotation_step = 45, this.sticky = !0, this.width_meters = .5, this._super(e)
    }
}), app.Asset.Stove = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "stove", this.width = 43, this.height = 48, this.rotation_step = 45, this.sticky = !0, this.width_meters = .5, this._super(e)
    }
}), app.Asset.BathroomSink = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "bathroom-sink", this.width = 18, this.height = 34, this.rotation_step = 45, this.sticky = !0, this.width_meters = .4, this._super(e)
    }
}), app.Asset.Toilet = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "toilet", this.width = 41, this.height = 23, this.rotation_step = 45, this.sticky = !0, this.width_meters = .8, this._super(e)
    }
}), app.Asset.Painting = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "painting", this.width = 4, this.height = 44, this.rotation_step = 45, this.sticky = !0, this.width_meters = .1, this._super(e)
    }
}), app.Asset.Projector = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "projector", this.width = 38, this.height = 35, this.rotation_step = 10, this.sticky = !0, this.width_meters = .5, this._super(e)
    }
}), app.Asset.Point = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "point", this.width = 20, this.height = 12, this.rotation_step = 45, this.sticky = !1, this.width_meters = .3, this._super(e)
    }
}), app.Asset.Extractor = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "extractor", this.width = 32, this.height = 32, this.rotation_step = 45, this.sticky = !1, this.width_meters = .7, this._super(e)
    }
}), app.Asset.Fan = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "fan", this.width = 92, this.height = 80, this.rotation_step = 45, this.sticky = !1, this.width_meters = 1.2, this._super(e)
    }
}), app.Asset.LightDetector = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "light-detector", this.width = 20, this.height = 25, this.rotation_step = 45, this.sticky = !1, this.width_meters = .3, this._super(e)
    }
}), app.Asset.MotionDetector = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "motion-detector", this.width = 20, this.height = 25, this.rotation_step = 45, this.sticky = !1, this.width_meters = .3, this._super(e)
    }
}), app.Asset.SmokeDetector = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "smoke-detector", this.width = 19, this.height = 19, this.rotation_step = 45, this.sticky = !1, this.width_meters = .3, this._super(e)
    }
}), app.Asset.SolarPanel = app.Asset.extend({
    create_path: function(e) {
        this.type = "solar-panel", this.name = "Solar panel (Tindo Solar)", this.width = 63, this.height = 104, this.rotation_step = 10, this.width_meters = 1, this.height_meters = 1.667, this._super(e)
    },
    "export": function() {
        var e = this._super();
        return e.name = this.name, e
    }
}), app.Asset.RedbackInverter = app.Asset.extend({
    create_path: function(e) {
        this.type = "redback-inverter", this.width = 63, this.height = 104, this.rotation_step = 10, this.width_meters = 1, this.height_meters = 1.667, this._super(e)
    },
    "export": function() {
        var e = this._super();
        return e.name = this.name, e
    }
}), app.Asset.WaterSolenoid = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "water-solenoid", this.width = 32, this.height = 32, this.rotation_step = 45, this.sticky = !1, this.width_meters = .7, this._super(e)
    }
}), app.Asset.ThermalOptimiser = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "thermal-optimiser", this.width = 20, this.height = 25, this.rotation_step = 45, this.sticky = !1, this.width_meters = .3, this._super(e)
    }
}), app.Asset.Door = app.ResizableAsset.extend({
    create_path: function(e) {
        this.type = "door", this.width = 42, this.height = 38, this.rotation_step = 90, this.sticky = !0, this.allow_flip = !0, this.width_meters = .91, this._super(e)
    },
    get_light_position: function(e, t) {
        var i, s, n = 3;
        return 90 === this.rotation ? (i = this.flipped ? this.path.bounds.topRight.x + t / 2 + n : this.path.bounds.topLeft.x - t / 2 - n, s = this.path.bounds.topLeft.y + e / 2 + n) : -90 === this.rotation || 270 === this.rotation ? (i = this.flipped ? this.path.bounds.bottomLeft.x - t / 2 - n : this.path.bounds.bottomRight.x + t / 2 + n, s = this.path.bounds.bottomRight.y - e / 2) : 180 === this.rotation ? (i = this.path.bounds.topRight.x - e / 2, s = this.flipped ? this.path.bounds.bottomRight.y + t / 2 + n : this.path.bounds.topRight.y - t / 2 - n) : (i = this.path.bounds.bottomLeft.x + e / 2, s = this.flipped ? this.path.bounds.topLeft.y - t / 2 - n : this.path.bounds.bottomLeft.y + t / 2 + n), {
            x: i,
            y: s
        }
    }
}), app.Light = app.Asset.extend({
    beam: null,
    circuit: null,
    group: null,
    is_connecting: null,
    display_colour: null,
    beam_width: null,
    color: null,
    height_off_floor: null,
    default_height_off_floor: 2.7,
    wire_count: null,
    max_wires: 3,
    wires: null,
    product_info: null,
    is_wall_light: null,
    is_strip_light: null,
    width: 16,
    height: 16,
    init: function(e) {
        _.extend(this, e), this.is_strip_light = "120S-LM-3K-120-C" == e.code, e.type || (this.type = this.code.toLowerCase(), e.type = this.type), e.display_colour ? this.display_colour = app.lightColours.setLightColour(e.code, e.display_colour) : this.display_colour = app.lightColours.getLightColour(e.code), this.beam_width = 30, this.wall_distance_from_center = !0, this.in_group = void 0 !== e.group, this.initializing = !0, this._super(e), this.sticky = e.is_wall_light, e.product_info && (this.product_info = e.product_info), this.sticky && (this.height_off_floor = e.height_off_floor ? e.height_off_floor : this.default_height_off_floor), e.circuit && app.designer.circuits[e.circuit].add_item(this), e.group && app.designer.light_groups[e.group].add_light(this), this.is_connecting = !1, this.initializing = !1, this.wires = {}
    },
    create_path: function(e) {
        null === this.width_meters && (this.width_meters = .25), this.rotation_step = 45, this._super(e)
    },
    set_rotation: function(e, t) {
        this.rotate(0 - this.rotation + e, t), this.rotation = e, this.rotation >= 360 && (this.rotation = this.rotation - 360)
    },
    rotate: function(e, t) {
        if (this.group && !t) {
            var i = this.group.path.bounds.getCenter();
            this._rotate(e, i)
        } else this._super(e)
    },
    _rotate: function(e, t) {
        this.path.rotate(e, t), this.raster.rotate(e, t)
    },
    rotate_by: function(e) {
        this.group ? "string" != typeof this.group && this.group.rotate_by(e) : (this._rotate(e), this.rotation += e)
    },
    move: function(e, t, i) {
        return !this.group || i ? (!this.group && app.designer.active_room && app.designer.active_room.draw_snap_lines_for_light(this), this._super(e, t)) : void this.group.move(e, t, this)
    },
    move_by: function(e) {
        this._super(e)
    },
    move_finish: function() {
        this._super(), this.group && this.group.move_finish(this), this.circuit.show_connections(!0)
    },
    on_mouse_enter: function(e) {
        app.is_dragging() || (this._super(e), this.group && (this.group.hover_light = this), app.designer.is_disconnect_active() ? (this.circuit.show_connections(), this.group ? this.group.invoke_on_lights("disconnect_hover") : this.disconnect_hover()) : app.designer.is_connect_active() && (this.circuit.show_connections(), (app.designer.active_tool.from_light || app.designer.active_tool.from_switch) && (app.designer.active_tool.to_light = this)))
    },
    on_mouse_leave: function(e) {
        if (!app.is_dragging()) {
            if (this.group && "string" === this.group.type) {
                var t = {
                        segments: !0,
                        handles: !1,
                        stroke: !0,
                        fill: !1,
                        tolerance: 1.5
                    },
                    i = paper.project.hitTest(e.point, t);
                if (i && i.item.id === this.group.path.id) return
            }
            this._super(e), app.designer.is_disconnect_active() ? (this.circuit.hide_connections(), this.circuit.invoke_on_items("disconnect_unhover")) : app.designer.is_connect_active() && (app.designer.active_tool.from_light ? (app.designer.active_tool.from_light != this && (app.designer.active_tool.to_light = null), app.designer.active_tool.from_light.circuit && app.designer.active_tool.from_light.circuit === this.circuit || this.circuit.hide_connections()) : (app.designer.active_tool.to_light = null, this.circuit.hide_connections()))
        }
    },
    on_mouse_down: function(e) {
        if (2 == e.event.button && this._super(e), app.designer.is_disconnect_active()) {
            var t = this.circuit;
            this.group ? this.group.disconnect() : this.disconnect(), t.invoke_on_items("disconnect_unhover"), this.circuit.invoke_on_items("disconnect_hover")
        } else app.designer.is_connect_active() && (app.designer.active_tool.from_light = this, this.circuit.invoke_on_items("set_connecting"))
    },
    on_mouse_up: function(e) {
        app.designer.is_connect_active() || app.designer.is_disconnect_active() || (this._super(e), window.setTimeout($.proxy(function() {
            this.selected || (this.set_active(!0), view.draw())
        }, this), 50))
    },
    cancel_connection: function() {
        this.cancel_connecting(), this.connect_unhover()
    },
    set_connecting: function() {
        this.is_connecting = !0
    },
    cancel_connecting: function() {
        this.is_connecting = !1
    },
    disconnect: function(e) {
        var t = this.circuit;
        this.circuit.remove_item(this), e || (e = app.designer.get_new_circuit()), e.add_item(this);
        var i = this.room;
        e.room = i, this.group || (i.refresh_circuits(), t.redraw_connections(), t.room.reconnect_light_switches(), e.show_connections(!0), e.room.reconnect_light_switches())
    },
    disconnect_hover: function() {
        this.path.strokeColor = "red"
    },
    disconnect_unhover: function() {
        this.path.strokeColor = null
    },
    connect_hover: function() {},
    connect_unhover: function() {},
    select: function(e) {
        this._super();
        var t = e && e.event && e.event.ctrlKey;
        this.group && (t ? this.group.single_selected = !0 : (this.group.single_selected = !1, this.path.strokeColor = null, this.group.select()))
    },
    unselect: function() {
        this._super(), this.group && (this.path.strokeColor = null, this.group.unselect(this.current_style))
    },
    set_active: function(e) {
        this._super(e), this.raster.opacity = 1, this.group && (this.path.strokeColor = null, this.group.set_active(e, this))
    },
    remove: function(e, t) {
        return this.room || this.circuit ? (this.circuit && this.circuit.remove_item(this, t), !this.group || e || this.group.single_selected ? (this.group && this.group.single_selected && (this.group.remove_light(this), "string" == this.group.type && this.group.rows--), this._super(), void(this.group ? (this.group.single_selected = !1, this.group.refresh_outline()) : (this.circuit.show_connections(!0), this.circuit.room.reconnect_light_switches()))) : (this.group.unselect(), this.group.remove(), this.circuit.show_connections(!0), void this.circuit.room.reconnect_light_switches())) : void this._super()
    },
    set_custom_light_data: function(e, t, i, s) {
        this.group ? this.group.set_custom_light_data(e, t, i, s) : (this.code = e, this.color_temperature = t, this.lumens = i, this.wattage = s)
    },
    get_custom_light_data: function() {
        return {
            type: this.type,
            code: this.code,
            color_temperature: this.color_temperature,
            lumens: this.lumens,
            wattage: this.wattage,
            is_custom: this.is_custom
        }
    },
    change_type: function(e) {
        this.path.strokeWidth = .001, this.is_custom = !1;
        var t = this["export"]();
        _.extend(t, e), delete t.width, delete t.height, delete t.original_width, delete t.original_height, delete t.segments, delete t.stroke_width, delete t.width_meters, delete t.height_meters, delete t.original_width_meters, delete t.original_height_meters, delete t.display_colour;
        var i = this.room,
            s = this.circuit,
            n = new app.Light(t);
        return s && (n.circuit = this.circuit, this.circuit.items[this.id] = n), i.assets[this.id] = n, i.lights[this.id] = n, n.room = this.room, this.group ? (this.group.lights[this.id] = n, n.group = this.group) : n.select(), this.remove_wall_distance_lines(), this.path.remove(), this.raster.remove(), this.group || (n.room.refresh_reached(!0), n.room.refresh_status()), n.x = t.x, n.y = t.y, n
    },
    set_wall_light_height: function(e) {
        this.height_off_floor = e
    },
    find_nearest_lights: function(e, t, i, s) {
        var n = new Point(this.path.bounds.center.x, this.path.bounds.center.y),
            o = t ? t.lights : this.room.lights,
            r = ["center"],
            a = [$.proxy(function(e) {
                return e.id === this.id
            }, this)];
        return i || (i = "xy"), s !== !0 && a.push($.proxy(function(e) {
            return null !== this.group && e.group === this.group
        }, this)), app.snap_manager.find_nearest_asset_points(n, i, o, e, r, a)
    },
    get_hover_status: function() {},
    delete_asset: function(e) {
        this.group && !this.group.single_selected ? confirm("Are you sure you wish to permanently delete all these lights?") && this.remove() : (this._super(), this.circuit.show_connections(!0), this.circuit.room.reconnect_light_switches()), app.lightColours.removeUnusedLights()
    },
    "export": function() {
        var e = this._super();
        return e.code = this.code, e.is_custom = this.is_custom, e.fascia_color = this.fascia_color, e.color_temperature = this.color_temperature, e.beam_angle = this.beam_angle, e.family = this.family, e.name = this.name, e.lumens = this.lumens, e.wattage = this.wattage, e.is_wall_light = this.is_wall_light, e.display_colour = this.display_colour, this.height_off_floor && (e.height_off_floor = this.height_off_floor), this.circuit && (e.circuit = this.circuit.id), this.group && (e.group = this.group.id), e
    },
    get_layer: function() {
        return app.designer.layers.lights
    }
}), app.light_manager = {
    spacing_meters: 1.5,
    default_spacing_pixels: 40,
    light_width: 36,
    refresh_grid_count: 0,
    get_spacing: function() {
        return (app.designer.room_scale || this.default_spacing_pixels) * this.spacing_meters
    },
    set_spacing: function(e) {
        this.spacing_meters = 1.5, e.hasOwnProperty("model") && e.model.hasOwnProperty("code") && "120S" == e.model.code && (this.spacing_meters = 1);
    },
    draw_string: function(e, t, i, s, n) {
        var o, r, a, h, l = 0,
            d = t.length;
        h = n ? "string" == typeof n ? app.product_manager.get_product_by_code(n) : n : app.ui.create_panel_lights.selected_product, this.set_spacing(h), i ? (o = i.rows, i.spacingy = t.length / (o - 1), r = i.spacingy, a = 0) : (r = this.get_spacing(), i = new app.LightGroup({
            type: "string",
            spacingy: r
        }), o = Math.floor(d / r) + 1, app.designer.light_groups[i.id] = i, s = e.circuit, a = (d - (o - 1) * r) / 2);
        for (var c, g = 0; o > g; g++) {
            var p = g * r + a,
                u = t.getPointAt(p);
            if (!u) break;
            var f = $.extend({
                    x: u.x - i.original_light_width / 2,
                    y: u.y - i.original_light_height / 2,
                    group: i.id,
                    circuit: s.id
                }, h),
                A = new app.Light(f);
            c || (c = A), l++
        }
        i.rows = o, l > 0 ? (e.add_asset(c, !0), i.refresh_outline(), s.show_connections(!0)) : i.remove()
    },
    draw_grid: function(e, t, i, s, n) {
        var o, r = null,
            a = null;
        o = n ? "string" == typeof n ? app.product_manager.get_product_by_code(n) : n : app.ui.create_panel_lights.selected_product, this.set_spacing(o), i ? (r = t.x + (i.light_width - i.original_light_width) / 2, a = t.y + (i.light_height - i.original_light_height) / 2) : (r = t.x, a = t.y);
        var h, l, d, c;
        if (i) {
            if (previous_cols = i.previous_cols, previous_rows = i.previous_rows, h = i.rows, l = i.cols, l > 1) {
                var g = i.spacingx ? i.spacingx * (previous_cols - 1) : t.width - this.light_width;
                i.spacingx = g / (l - 1)
            } else i.spacingx = 0, r = e.path.bounds.center.x - (i.light_width - i.original_light_width) / 2;
            if (h > 1) {
                var p = i.spacingy ? i.spacingy * (previous_rows - 1) : t.height - this.light_width;
                i.spacingy = p / (h - 1)
            } else i.spacingy = 0, a = e.path.bounds.center.y - (i.light_height - i.original_light_height) / 2;
            d = i.spacingx, c = i.spacingy
        } else d = this.get_spacing(), c = this.get_spacing(), l = Math.ceil(t.width / this.get_spacing()), h = Math.ceil(t.height / this.get_spacing()), i = new app.LightGroup({
            type: "grid",
            rows: h,
            cols: l,
            spacingx: d,
            spacingy: c
        }), i.set_previous_cols(l), i.set_previous_rows(h), app.designer.light_groups[i.id] = i, s = e.circuit;
        for (var u, f = 0, A = 0, m = 0; l > A;) {
            for (m = 0; h > m;) {
                var v = $.extend({
                        x: r + A * d,
                        y: a + m * c,
                        group: i.id,
                        circuit: s.id
                    }, o),
                    w = new app.Light(v);
                u || (u = w), m++, f++
            }
            A++
        }
        f > 0 ? (e.add_asset(u, !0), i.refresh_outline(), s.show_connections(!0)) : i.remove()
    },
    best_fit: function(e) {
        var t = e.get_room_type();
        t || alert("Error, room type not found (" + e.type + ") in property type app.property_type");
        var i = app.ui.create_panel_lights.selected_product,
            s = Math.ceil(e.recommended_lumens / i.lumens),
            n = e.get_floating_light_bounds();
        if (s > 1)
            if ("indirect" === t.light_layout) this.draw_indirect_box(s, n, e);
            else {
                var o = {
                        x: n.x + .15 * n.width,
                        y: n.y + .15 * n.height,
                        width: .7 * e.path.bounds.width,
                        height: .7 * e.path.bounds.height
                    },
                    r = this.get_direct_grid(s, o);
                app.designer.light_groups[r.id] = r, this.draw_grid(e, o, r, e.circuit, i)
            }
        else {
            app.ui.pause_rendering();
            var a = $.extend({
                    x: e.path.bounds.center.x,
                    y: e.path.bounds.center.y
                }, i),
                h = new app.Light(a);
            h.y -= h.height / 2, h.move(h.x, h.y, !0), e.add_asset(h)
        }
        e.refresh_circuits(), e.reconnect_light_switches(), e.circuit.redraw_connections(!0), e.circuit.hide_connections(), app.ui.draw(), e.select()
    },
    draw_indirect_box: function(e, t, i, s, n) {
        e % 2 === 1 && e++;
        var o;
        o = n ? "string" == typeof n ? app.product_manager.get_product_by_code(n) : n : app.ui.create_panel_lights.selected_product;
        var r;
        r = s ? s : new app.LightGroup({
            type: "box"
        }), app.designer.light_groups[r.id] = r;
        var a = t.width,
            h = t.height,
            l = 2 * h + 2 * a,
            d = l / e,
            c = Math.round(a / d),
            g = Math.round(h / d);
        a > h && 0 === g && 1 === c ? (g = 1, c = 0) : h > a && 0 === c && 1 === g && (c = 1, g = 0), t = new Rectangle(t);
        var p;
        return h > a ? (p = this.draw_box_axis("y", g, c, o, t, r, i, !1), this.draw_box_axis("x", p.other_total, p.total, o, t, r, i, p.is_corners_added)) : (p = this.draw_box_axis("x", c, g, o, t, r, i, !1), this.draw_box_axis("y", p.other_total, p.total, o, t, r, i, p.is_corners_added)), r
    },
    draw_box_axis: function(e, t, i, s, n, o, r, a) {
        var h, l, d, c, g, p, u = "x" === e,
            f = r.circuit;
        if (t > 1) {
            var A, m, v, w, P, z;
            t >= i && !a && (this.add_to_corners(e, s, n, o, r), a = !0, t -= 1, 0 === i ? t -= 1 : i -= 1), A = u ? n.width : n.height, h = u ? n.topLeft : n.topLeft, l = u ? n.bottomLeft : n.topRight, m = A / (t + 1), v = m;
            for (var y = 0; t > y; y++) w = y * m + v, P = u ? w : 0, z = u ? 0 : w, d = $.extend({
                x: h.x + P,
                y: h.y + z,
                group: o.id,
                circuit: f.id
            }, s), g = new app.Light(d), c = $.extend({
                x: l.x + P,
                y: l.y + z,
                group: o.id,
                circuit: f.id
            }, s), p = new app.Light(c)
        } else 1 === t && (h = u ? n.topCenter : n.leftCenter, l = u ? n.bottomCenter : n.rightCenter, d = $.extend({
            x: h.x,
            y: h.y,
            group: o.id,
            circuit: f.id
        }, s), g = new app.Light(d), c = $.extend({
            x: l.x,
            y: l.y,
            group: o.id,
            circuit: f.id
        }, s), p = new app.Light(c));
        return g && r.add_asset(g, !0), {
            total: t,
            other_total: i,
            is_corners_added: a
        }
    },
    add_to_corners: function(e, t, i, s, n) {
        var o = "x" === e,
            r = i.topLeft,
            a = $.extend({
                x: r.x,
                y: r.y,
                group: s.id,
                circuit: n.circuit.id
            }, t),
            h = new app.Light(a);
        r = o ? i.topRight : i.bottomLeft;
        var l = $.extend({
                x: r.x,
                y: r.y,
                group: s.id,
                circuit: n.circuit.id
            }, t),
            d = new app.Light(l);
        r = o ? i.bottomLeft : i.topRight;
        var c = $.extend({
                x: r.x,
                y: r.y,
                group: s.id,
                circuit: n.circuit.id
            }, t),
            g = new app.Light(c);
        r = i.bottomRight;
        var p = $.extend({
                x: r.x,
                y: r.y,
                group: s.id,
                circuit: n.circuit.id
            }, t),
            u = new app.Light(p);
        return h && n.add_asset(h, !0), [h, d, g, u]
    },
    get_direct_grid: function(e, t) {
        var i, s;
        e % 2 == 1 && e > 5 && e++;
        for (var n = e, o = Math.floor(Math.sqrt(n)); n % o !== 0;) o--;
        var r = n / o;
        if (t.width > t.height ? (i = o > r ? r : o, s = o > r ? o : r) : (i = o > r ? o : r, s = o > r ? r : o), 0 === i ? (i = 1, s = e) : 0 === s && (i = e, s = 1), e > i * s) {
            var a = e - i * s;
            t.width > t.height ? s += a : i += a
        }
        return new app.LightGroup({
            type: "grid",
            rows: i,
            cols: s
        })
    }
}, app.LightGroup = app.ResizableAsset.extend({
    type: null,
    outline: null,
    lights: null,
    active: null,
    selected: null,
    previous_cols: null,
    previous_rows: null,
    previous_path_x1: null,
    previous_path_y1: null,
    adding_lights: null,
    removing_lights: null,
    is_loaded: null,
    light_width: null,
    light_height: null,
    original_light_width: null,
    original_light_height: null,
    base_style: {
        strokeColor: "#cccccc",
        strokeAlpha: 1
    },
    active_style: {
        strokeColor: "#cccccc",
        strokeAlpha: 1
    },
    handle_color: "black",
    handle_active_color: app.colours.main,
    temperature_colors: {
        "3K": "#faaf3a",
        "5K": "#3ea9f5"
    },
    rows: null,
    cols: null,
    spacingx: null,
    spacingy: null,
    init: function(e) {
        e && e.id ? (this.id = e.id, this.is_loaded = !0) : this.id = generate_guid(), this.type = e.type, this.rows = e.rows || null, this.cols = e.cols || null, this.previous_rows = e.rows || null, this.previous_cols = e.cols || null, this.spacingx = e.spacingx || null, this.spacingy = e.spacingy || null, this.lights = {}
    },
    move: function(e, t, i) {
        this.hide_outline(), this.hide_handles(), null === this.move_start_x && null === this.move_start_x && (this.move_start_x = i.path.position.x, this.move_start_y = i.path.position.y);
        var s = {
            x: e - i.path.position.x,
            y: t - i.path.position.y
        };
        if (!i.is_wall_light || "string" !== this.type || !this.move_sticky_string(e, t, i, s))
            for (var n in this.lights) {
                var o = this.lights[n],
                    r = o.path.position.x + s.x,
                    a = o.path.position.y + s.y;
                o.move(r, a, !0)
            }
    },
    move_sticky_string: function(e, t, i, s) {
        var n = i.get_stick_to_xy(app.designer.active_room, e, t),
            o = n[0],
            r = n[1],
            a = n[2],
            h = e !== o,
            l = t !== r;
        if (!h && !l) return !1;
        var d = this.get_best_orientation();
        if ("horizontal" === d && h || "vertical" === d && l) return !1;
        for (var c in this.lights) {
            var g, p, u = this.lights[c];
            "horizontal" === d ? (g = s.x + app.designer.drag_offset.x, p = r - u.path.position.y) : (g = o - u.path.position.x, p = s.y + (u.height / 2 + app.designer.drag_offset.y)), u.move_by({
                x: g,
                y: p
            }), -1 != a && u.set_rotation(a, !0)
        }
        return this.refresh_outline(), !0
    },
    get_best_orientation: function() {
        var e = this.path.segments[0].point,
            t = this.path.segments[1].point,
            i = {
                x: Math.abs(e.x - t.x),
                y: Math.abs(e.y - t.y)
            };
        return i.y > i.x ? "vertical" : "horizontal"
    },
    is_straight_line: function() {
        if (!this.path) return !1;
        var e = this.path.segments[0].point,
            t = this.path.segments[1].point;
        return Math.round(e.x) === Math.round(t.x) || Math.round(e.y) === Math.round(t.y)
    },
    move_by: function(e) {
        for (var t in this.lights) this.lights[t].move_by(e);
        this.path.translate(e)
    },
    move_finish: function(e) {
        if ("string" === this.type)
            for (var t in this.lights) this.lights[t].sticky_wall = e.sticky_wall;
        this.refresh_outline(), this.move_start_x = null, this.move_start_y = null
    },
    check_lights_are_in_room: function(e) {
        for (var t in this.lights)
            if (null === e.path.hitTest(this.lights[t].path.bounds.center)) return !1;
        return !0
    },
    refresh_outline: function() {
        this.path && this.path.remove(), this.path_strip_light && this.path_strip_light.remove();
        var e = this.get_light_bounds(),
            t = null,
            i = null;
        for (var s in this.lights) t || (t = this.lights[s]);
        i = this.lights[s], "grid" == this.type ? this.path = new Path.Rectangle(e[0], e[1]) : "box" === this.type ? this.path = new Path.Rectangle(e[0], e[1]) : (this.path = new Path.Line(t.path.bounds.center, i.path.bounds.center), t.is_strip_light && (this.path_strip_light = new Path.Line(t.path.bounds.center, i.path.bounds.center), this.path_strip_light.ignore_events = !0, this.path_strip_light.strokeColor = this.temperature_colors[t.color_temperature.code], this.path_strip_light.strokeWidth = 3, this.path_strip_light.dashArray = [3, 3])), this.hide_outline(), this.path.onMouseEnter = $.proxy(this.on_mouse_enter, this), this.path.onMouseDown = $.proxy(this.on_mouse_down, this), this.path.onMouseDrag = $.proxy(this.on_mouse_drag, this), this.path.onMouseUp = $.proxy(this.on_mouse_up, this), this.path.onMouseMove = $.proxy(this.on_mouse_move, this), this.path.onMouseLeave = $.proxy(this.on_mouse_leave, this), this.path.ignore_events = !0
    },
    on_mouse_drag: function(e) {
        this._super(e), "string" != this.type || this.path.ignore_events || this.is_resizing || this.hover_light && (e.target = this.hover_light.path, this.hover_light.on_mouse_drag(e))
    },
    on_mouse_up: function(e) {
        var t = this.user_resized;
        if (this._super(e), t) {
            var i = this.get_light_at(1);
            if (!i) return;
            var s = i.width,
                n = i.height;
            if ("string" === this.type) {
                var o = this.get_lights_count(),
                    r = this.path.length / o;
                if (s >= r) return void this.refresh_outline()
            } else {
                var a = this.rows,
                    h = this.cols;
                "box" === this.type && (a = h = 2);
                var l = .5,
                    d = i.width * (h + l),
                    c = i.height * (a + l),
                    g = 1,
                    p = 1;
                d >= this.path.bounds.width && (g = d / this.path.bounds.width * 100 / 100), c >= this.path.bounds.height && (p = c / this.path.bounds.height * 100 / 100), (1 !== g || 1 !== p) && this.path.scale(g, p, this.resize_anchor), this.spacingx = (this.path.bounds.width - s) / (h - 1), this.spacingy = (this.path.bounds.height - n) / (a - 1), this.set_previous_cols(h), this.set_previous_rows(a)
            }
            this.refresh_lights(), app.designer.selected = this.get_light_at(1), this.select()
        }
    },
    on_mouse_leave: function(e) {
        if (this._super(e), this.selected) {
            var t = this.get_light_at(1);
            return void t.set_active(!1)
        }
        if (!this.path.contains(e.point))
            for (var i in this.lights) this.lights[i].set_active(!1)
    },
    resize: function(e, t, i) {
        "grid" === this.type || "box" === this.type ? this.path.scale(e, t, this.resize_anchor) : this.path.getNearestLocation(i.point).segment.point = i.point
    },
    get_light_bounds: function() {
        var e, t, i, s, n, o = null,
            r = null,
            a = null,
            h = null;
        for (var l in this.lights) e = this.lights[l], t = e.path.bounds.x, i = e.path.bounds.y, s = t + e.path.bounds.width, n = i + e.path.bounds.height, (null === o || o > t) && (o = t), (null === r || r > i) && (r = i), (null === a || s > a) && (a = s), (null === h || n > h) && (h = n);
        return [new Point(o, r), new Point(a, h)]
    },
    show_outline: function() {
        this.path || this.refresh_outline(), app.designer.layers.light_groups.addChild(this.path)
    },
    hide_outline: function() {
        null !== this.path && this.path.layer && this.path.remove()
    },
    set_light_width_height: function(e) {
        this.light_width = e.width, this.light_height = e.height, this.original_light_width = e.original_width, this.original_light_height = e.original_height
    },
    refresh_lights: function() {
        app.ui.pause_rendering(), "grid" == this.type ? this.refresh_grid_lights() : "box" == this.type ? this.refresh_box_lights() : this.refresh_string_lights();
        var e = this.get_light_info(),
            t = e[1],
            i = e[2];
        t.redraw_connections(), app.ui.resume_rendering(), i.show_circuits(), app.ui.draw()
    },
    refresh_grid_lights: function() {
        var e, t, i = this.get_light_info(),
            s = i[0],
            n = i[1],
            o = i[2],
            r = i[3];
        for (var a in this.lights) t = this.lights[a], r && !e && (s = t.get_custom_light_data()), this.set_light_width_height(t), t.group = null, t.remove(!1, !0), this.remove_light(t, !0);
        r || (s = s.toUpperCase()), app.light_manager.draw_grid(o, this.path.bounds, this, n, s), n.show_connections(!0), n.room.reconnect_light_switches(), view.draw()
    },
    refresh_box_lights: function(e) {
        var t, i = this.get_light_info(),
            s = i[0],
            n = i[1],
            o = i[2],
            r = i[3];
        e || (e = this.get_lights_count());
        var a = this.get_light_at(1).width,
            h = this.get_light_at(1).original_width,
            l = this.get_light_at(1).height,
            d = this.get_light_at(1).original_height;
        for (var c in this.lights) {
            var g = this.lights[c];
            r && !t && (s = g.get_custom_light_data()), this.set_light_width_height(g), g.group = null, g.remove(!1, !0), this.remove_light(g, !0)
        }
        var p = {
            x: this.path.bounds.x + (a - h) / 2,
            y: this.path.bounds.y + (l - d) / 2,
            width: this.path.bounds.width - a,
            height: this.path.bounds.height - l
        };
        r || (s = s.toUpperCase()), app.light_manager.draw_indirect_box(e, p, o, this, s), n.show_connections(!0), n.room.reconnect_light_switches(), this.hide_outline(), view.draw(), this.refresh_outline()
    },
    refresh_string_lights: function() {
        var e, t = this.get_light_info(),
            i = t[0],
            s = t[1],
            n = t[2],
            o = t[3];
        for (var r in this.lights) {
            var a = this.lights[r];
            o && !e && (i = a.get_custom_light_data()), this.set_light_width_height(a), a.group = null, a.remove(!1, !0), this.remove_light(a, !0)
        }
        o || (i = i.toUpperCase()), app.light_manager.draw_string(n, this.path, this, s, i), s.show_connections(!0), s.room.reconnect_light_switches(), view.draw()
    },
    add_click: function() {
        app.ui.pause_rendering(), "grid" == this.type ? (this.set_adding_lights(!0), this.add_grid_lights(), this.set_adding_lights(!1)) : "box" == this.type ? this.add_box_lights() : this.add_string_lights(), this.select_first_light(), app.ui.resume_rendering()
    },
    select_first_light: function() {
        this.get_light_at(1).select()
    },
    set_previous_cols: function(e) {
        this.previous_cols = e
    },
    set_previous_rows: function(e) {
        this.previous_rows = e
    },
    set_adding_lights: function(e) {
        this.adding_lights = e
    },
    set_removing_lights: function(e) {
        this.removing_lights = e
    },
    add_grid_lights: function() {
        this.set_previous_cols(this.cols), this.set_previous_rows(this.rows), 1 === this.rows && (this.path.bounds.height = 3 * this.light_height, this.previous_rows += 1), 1 === this.cols && (this.path.bounds.width = 3 * this.light_width, this.previous_cols += 1), this.rows++, this.cols++, this.refresh_grid_lights()
    },
    add_box_lights: function() {
        var e, t = this.get_lights_count();
        for (var i in this.lights) {
            e = this.lights[i].room;
            break
        }
        t + 2 === 4 && (this.refresh_box_lights(t), this.path.bounds.width > this.path.bounds.height ? this.path.bounds.height += 3 * this.light_height : this.path.bounds.width += 3 * this.light_width), t += 2, this.refresh_box_lights(t)
    },
    add_string_lights: function() {
        this.rows++, this.refresh_string_lights()
    },
    remove_click: function() {
        app.ui.pause_rendering(), "grid" == this.type ? (this.set_removing_lights(!0), this.remove_grid_lights(), this.set_removing_lights(!1)) : "box" == this.type ? this.remove_box_lights() : this.remove_string_lights(), this.select_first_light(), app.ui.resume_rendering()
    },
    remove_grid_lights: function() {
        this.set_previous_cols(this.cols), this.set_previous_rows(this.rows), this.rows = this.rows > 2 ? this.rows - 1 : this.rows, this.cols = this.cols > 2 ? this.cols - 1 : this.cols, this.refresh_grid_lights()
    },
    remove_box_lights: function() {
        var e, t = this.get_lights_count();
        for (var i in this.lights) {
            e = this.lights[i].room;
            break
        }
        t > 2 && (t - 2 === 2 && (this.path.bounds.width > this.path.bounds.height ? this.path.bounds.height = this.light_height : this.path.bounds.width = this.light_width), t -= 2), this.refresh_box_lights(t)
    },
    remove_string_lights: function() {
        this.rows = this.rows > 2 ? this.rows - 1 : this.rows, this.refresh_string_lights()
    },
    add_light: function(e) {
        this.contains_light(e) || (this.lights[e.id] = e, e.group = this, "grid" === this.type && (e.sticky = !1))
    },
    get_light_at: function(e) {
        var t = 1;
        for (var i in this.lights) {
            if (t == e) return this.lights[i];
            t++
        }
        return null
    },
    contains_light: function(e) {
        return void 0 !== this.lights[e.id]
    },
    remove_light: function(e, t) {
        delete this.lights[e.id], t || 0 !== this.get_lights_count() || this.remove()
    },
    get_lights_count: function() {
        var e = this.lights,
            t = 0;
        for (var i in e) e.hasOwnProperty(i) && t++;
        return t
    },
    rotate_by: function(e) {
        $.each(this.lights, function(t, i) {
            i.rotate(e), i.rotation += e
        }), this.path.rotate(e)
    },
    on_finish_rotate: function() {
        this.refresh_outline(), this.spacingx = (this.path.bounds.width - this.light_width) / (this.cols - 1), this.spacingy = (this.path.bounds.height - this.light_height) / (this.rows - 1);
        var e = this.get_light_info(),
            t = e[1];
        t.show_connections(!0), t.room.reconnect_light_switches()
    },
    set_wall_light_height: function(e) {
        for (var t in this.lights) this.lights[t].set_wall_light_height(e)
    },
    set_custom_light_data: function(e, t, i, s) {
        for (var n in this.lights) {
            var o = this.lights[n];
            o.code = e, o.color_temperature = t, o.lumens = i, o.wattage = s
        }
    },
    change_type: function(e) {
        var t;
        for (var i in this.lights) {
            var s = this.lights[i];
            e.centerX = s.x, e.centerY = s.y, e.boundsCenterX = s.path.bounds.centerX, e.boundsCenterY = s.path.bounds.centerY, s.change_type(e), t = s.room, this.set_light_width_height(s)
        }
        t && (t.refresh_reached(!0), t.refresh_status()), this.previous_cols = this.cols, this.previous_rows = this.rows, this.refresh_lights(), this.select_first_light()
    },
    select: function() {
        this._super();
        var e;
        for (var t in this.lights) e = this.lights[t], e.selected = !0;
        this.show_outline(), this.selected = !0, this.path.ignore_events = !1, app.designer.selected = e, app.pub("designer_group_selected_after_resize", [e])
    },
    unselect: function(e) {
        for (var t in this.lights) {
            var i = this.lights[t];
            i.selected = !1, i.hide_wall_distance_lines()
        }
        this.active || this.hide_outline(), this.selected = !1, this.path && (this.path.ignore_events = !0), this._super()
    },
    set_active: function(e, t) {
        this.active = e, t && (e ? (this.show_outline(), this.set_style(this.active_style)) : this.selected || (this.set_style(this.base_style), this.hide_outline()))
    },
    invoke_on_lights: function(e) {
        for (var t in this.lights) this.lights[t][e]()
    },
    disconnect: function() {
        var e = this.get_light_info(),
            t = e[1],
            i = app.designer.get_new_circuit();
        for (var s in this.lights) this.lights[s].disconnect(i);
        this.refresh_room_circuits(), t.redraw_connections(), t.room && t.room.reconnect_light_switches(), i.room.reconnect_light_switches(), i.show_connections(!0), t.hide_connections()
    },
    refresh_room_circuits: function() {
        var e = this.get_light_at(1);
        e && e.room.refresh_circuits()
    },
    get_light_info: function() {
        for (var e in this.lights) return [this.lights[e].type, this.lights[e].circuit, this.lights[e].room, this.lights[e].is_custom]
    },
    "export": function() {
        var e = {
            id: this.id,
            type: this.type,
            rows: this.rows,
            cols: this.cols,
            spacingx: this.spacingx,
            spacingy: this.spacingy
        };
        return e.lights = [], $.each(this.lights, function(t, i) {
            e.lights.push(i.id)
        }), e
    },
    remove_lights: function() {
        var e = this.get_light_info();
        e && $.each(this.lights, function(e, t) {
            t.remove(!0)
        })
    },
    remove: function() {
        app.ui.pause_rendering(), this.remove_lights(), this.path && this.path.remove(), this.path_strip_light && this.path_strip_light.remove(), delete app.designer.light_groups[this.id], this.remove_handles(), app.ui.resume_rendering()
    }
}), app.Asset.LightSwitch = app.Asset.extend({
    circuits: null,
    connections: null,
    is_dragging: null,
    init: function(e) {
        if (this.circuits = {}, e.circuits)
            for (var t = 0; t < e.circuits.length; t++) {
                var i = app.designer.circuits[e.circuits[t]];
                i && (this.circuits[i.id] = i)
            }
        this.is_dragging = !1, this.connections = {}, this._super(e), e && e.id && (this.id = e.id), app.designer.light_switches[this.id] = this
    },
    create_path: function(e) {
        e.type ? this.type = e.type : this.type = this.switch_type ? "light-switch-" + this.switch_type : "light-switch", this.width = e.width ? e.width : 17, this.height = e.height ? e.height : 30, this.rotation_step = 45, this.sticky = !0, this.width_meters = .12, this._super(e)
    },
    add_circuit: function(e) {
        this.circuits[e.id] = e
    },
    redraw_connections: function() {
        this.hide_connections(), this.connections = {};
        for (var e in this.circuits) {
            var t = this.circuits[e];
            this.redraw_connection(t)
        }
        this.hide_connections()
    },
    redraw_connection: function(e) {
        this.hide_connection(e);
        var t = e.get_items_count();
        if (t > 0) {
            var i = this === e.primary_switch ? this.connect_to_closest_light(e) : this.connect_to_primary_switch(e);
            this.connections[e.id] = i, this.hide_connection(e)
        }
    },
    connect_to_closest_light: function(e) {
        var t = !1;
        e.flush_wall_light_count === e.get_items_count() && (t = !0);
        var i = e.get_closest_item_to_point(this.path.bounds.center, t),
            s = e.get_connection_through_point(this, i),
            n = new Path.Arc(i.path.bounds.center, s, this.path.bounds.center);
        return n.strokeColor = app.colours.main, n.dashArray = [6, 6], n.opacity = .8, n.ignore_events = !0, n.ld_type = "circuit-outline", i.wire_count++, n.onClick = $.proxy(function() {
            this.on_editable_connection_click(n, e)
        }, this), n
    },
    connect_to_primary_switch: function(e) {
        var t = e.primary_switch;
        if (!t) return null;
        var i = e.get_connection_through_point(this, t),
            s = new Path.Arc(e.primary_switch.path.bounds.center, i, this.path.bounds.center);
        return s.strokeColor = "blue", s.dashArray = [6, 6], s.opacity = .8, s.ignore_events = !0, s.ld_type = "circuit-outline", s.onClick = $.proxy(function() {
            this.on_editable_connection_click(s, e)
        }, this), s
    },
    show_connection: function(e, t) {
        if (!this.is_dragging) {
            var i = this.connections[e.id];
            i && (this.hide_connection(e), t && this.redraw_connection(e), null === i.layer && app.designer.layers.circuits.addChild(i))
        }
    },
    set_connection_editable: function(e, t) {
        var i = this.connections[e.id];
        i && (t ? (i.strokeWidth = 3, i.ignore_events = !1, i.onMouseEnter = function(e) {
            i.strokeColor = "red"
        }, i.onMouseLeave = function(e) {
            i.strokeColor = app.colours.main
        }) : (i.strokeWidth = 1, i.ignore_events = !0, i.onMouseEnter = null, i.onMouseLeave = null))
    },
    on_editable_connection_click: function(e, t) {
        confirm("Are you sure you wish to remove this switch connection?") && (this.remove_circuit(t), t.remove_item_switch(this))
    },
    show_connections: function(e) {
        if (!this.is_dragging) {
            e && this.redraw_connections();
            for (var t in this.connections) {
                var i = this.connections[t];
                i && null === i.layer && app.designer.layers.circuits.addChild(i)
            }
            app.ui.draw()
        }
    },
    hide_connection: function(e) {
        var t = this.connections[e.id];
        t && (t.remove(), app.ui.draw())
    },
    hide_connections: function() {
        for (var e in this.connections) this.connections[e].remove();
        app.ui.draw()
    },
    remove_circuit: function(e) {
        this.circuits[e.id] && (this.hide_connection(e), delete this.circuits[e.id], delete this.connections[e.id])
    },
    redraw_all_circuits: function() {
        for (var e in this.circuits) this.circuits[e].show_connections(!0)
    },
    is_a_primary: function() {
        for (var e in this.circuits)
            if (this.circuits[e].primary_switch === this) return !0;
        return !1
    },
    on_mouse_enter: function(e) {
        this._super(e), app.designer.is_connect_active() && (this.path.strokeColor = "blue", this.show_connections())
    },
    on_mouse_leave: function(e) {
        this._super(e), app.designer.is_connect_active() && (this.path.strokeColor = this.base_style.strokeColor, this.path.strokeColor.alpha = .01, this.hide_connections())
    },
    on_mouse_down: function(e) {
        this._super(e), app.designer.is_connect_active() && (app.designer.active_tool.from_switch = this)
    },
    on_mouse_up: function(e) {
        this._super(e), app.designer.is_connect_active() && app.designer.active_tool.from_switch && (app.designer.active_tool.to_switch = this)
    },
    on_mouse_drag: function(e) {
        this._super(e), this.is_resizing || app.designer.is_busy() || (this.hide_connections(), this.is_dragging = !0)
    },
    move_finish: function() {
        this._super(), this.is_dragging = !1, this.redraw_all_circuits()
    },
    reset: function() {
        this.hide_connections();
        for (var e in this.circuits) this.circuits[e].remove_item_switch(this);
        this.connections = {}, this.circuits = {}, delete this.room.light_switches[this.id], delete this.room.assets[this.id], this.room = null
    },
    remove_from_secondary_circuits: function() {
        for (var e in this.circuits) {
            var t = this.circuits[e];
            t.primary_switch !== this && (t.remove_item_switch(this), this.remove_circuit(t))
        }
    },
    "export": function() {
        var e = this._super();
        e.circuits = [];
        for (var t in this.circuits) {
            var i = this.circuits[t];
            e.circuits.push(i.id)
        }
        return e
    },
    delete_asset: function() {
        if (!confirm("Are you sure you wish to permentantly delete this " + this["class"] + "?")) return !1;
        var e = !0;
        for (var t in this.circuits) {
            var i = this.circuits[t];
            i.primary_switch === this && i.get_items_count() > 0 && (i.swap_primary_switch() || (e = !1))
        }
        return e ? (this.remove(), void this.redraw_all_circuits()) : (alert("Cannot delete light switch - you must have at least one switch for this circuit"), !1)
    },
    remove: function() {
        this.hide_connections(), delete app.designer.light_switches[this.id], delete this.room.light_switches[this.id], delete this.room.assets[this.id];
        for (var e in this.circuits) this.circuits[e].remove_item_switch(this);
        this._super()
    },
    hide: function() {
        this.path.visible = !1, this.raster.visible = !1, app.ui.draw()
    },
    show: function() {
        this.path.visible = !0, this.raster.visible = !0, app.ui.draw()
    }
}), app.Asset.LightSwitchDimmer = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.switch_type = "dimmer", this._super(e)
    }
}), app.Asset.LightSwitchTouch = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.switch_type = "touch", this._super(e)
    }
}), app.Asset.LightSwitchHpmSunshine = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.width = 30, this.height = 19, this._super(e)
    }
}), app.Asset.LightSwitchHpmPush4 = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.width = 19, this.height = 30, this._super(e)
    }
}), app.Asset.LightSwitchHpmMattSilver = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.width = 30, this.height = 19, this._super(e)
    }
}), app.Asset.LightSwitchHpmPush = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.width = 17, this.height = 30, this._super(e)
    }
}), app.Asset.DimmerHpmArchitectural = app.Asset.LightSwitchDimmer.extend({
    create_path: function(e) {
        this.width = 18, this.height = 30, this._super(e)
    }
}), app.Asset.DimmerHpmComo = app.Asset.LightSwitchDimmer.extend({
    create_path: function(e) {
        this.width = 18, this.height = 30, this._super(e)
    }
}), app.Asset.DimmerHpmLinea = app.Asset.LightSwitchDimmer.extend({
    create_path: function(e) {
        this.width = 30, this.height = 18, this._super(e)
    }
}), app.Asset.DimmerClipsal2000 = app.Asset.LightSwitchDimmer.extend({
    create_path: function(e) {
        this.width = 18, this.height = 30, this._super(e)
    }
}), app.Asset.LightSwitchClipsalClassicC2000 = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.width = 18, this.height = 30, this._super(e)
    }
}), app.Asset.LightSwitchClipsalEclipseSl2000 = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.width = 18, this.height = 30, this._super(e)
    }
}), app.Asset.LightSwitchClipsalModena8000 = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.width = 30, this.height = 18, this._super(e)
    }
}), app.Asset.LightSwitchClipsalSaturn = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.width = 18, this.height = 30, this._super(e)
    }
}), app.Asset.LightSwitchClipsalSlimlineSc2000 = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.width = 18, this.height = 30, this._super(e)
    }
}), app.Asset.LightSwitchClipsalStrato8000 = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.width = 30, this.height = 18, this._super(e)
    }
}), app.Asset.LucyTouch = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.width = 18, this.height = 30, this._super(e)
    }
}), app.Asset.LucyAct = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.width = 18, this.height = 30, this._super(e)
    }
}), app.Asset.LucyThink = app.Asset.LightSwitch.extend({
    create_path: function(e) {
        this.width = 30, this.height = 18, this._super(e)
    }
}), app.lightColours = {
    collection: ["#ffb400", "#f6511d", "#00a6ed", "#7fb800", "#0d2c54", "#610345", "#107e7d", "#044b7f", "#95190c", "#f95738", "#f4d35e", "#e83f6f", "#2274a5", "#f8f991", "#444b6e", "#e71d36", "#2ec4b6", "#ff4e00", "#8ea604", "#fe938c", "#50514f", "#ead2ac", "#ffe066", "#f0c808", "#2ab7ca", "#7e7f9a", "#725752", "#f39237", "#ff006e", "#19381f"],
    lights: {},
    getLightColour: function(e) {
        return this.lights.hasOwnProperty(e) ? this.lights[e] : this.setLightColour(e)
    },
    setLightColour: function(e, t) {
        var i = this.getAvailableColours();
        return void 0 === t ? t = i.length > 0 ? i[0] : this.addColourToCollection() : -1 === i.indexOf(t) && (t = this.getLightColour(e)), this.lights[e] = t, t
    },
    removeUnusedLights: function() {
        var e = {};
        $.each(app.designer.rooms, function(t, i) {
            $.each(i.lights, function(t, i) {
                e[i.code] = 1
            })
        });
        for (var t in this.lights) this.lights.hasOwnProperty(t) && !e.hasOwnProperty(t) && delete this.lights[t]
    },
    getAvailableColours: function() {
        var e = _.clone(this.collection);
        for (var t in this.lights)
            if (this.lights.hasOwnProperty(t)) {
                var i = e.indexOf(this.lights[t]);
                i > -1 && e.splice(i, 1)
            }
        return e
    },
    addColourToCollection: function(e) {
        for (void 0 === e && (e = this.generateRandomColour()); this.collection.indexOf(e) > -1;) e = this.generateRandomColour();
        return this.collection.push(e), e
    },
    generateRandomColour: function() {
        return "#" + (16777216 + 16777215 * Math.random()).toString(16).substr(1, 6)
    }
}, app.Room = app.RestructurableAsset.extend({
    "class": "room",
    type: null,
    color_temp: null,
    reflectivity: null,
    wall_length: null,
    circuit: null,
    all_circuits: null,
    assets: null,
    lights: null,
    light_switches: null,
    first_light_distance_lines: null,
    fixed_distance: 1,
    active: !1,
    square_meters: null,
    recommended_lux: null,
    recommended_workplane_lux: null,
    recommended_lumens: null,
    recommended_wattage: null,
    recommended_wattage_sqm: null,
    reached_lux: null,
    reached_workplane_lux: null,
    reached_lumens: null,
    reached_wattage: null,
    reached_wattage_sqm: null,
    display_name: null,
    default_reflectivity: "Light",
    default_color_temp: "Cool",
    default_room_type: "Other (Day Time Use)",
    LOSS_FROM_DIRECT_LIGHT: .62,
    REFLECTIVITY_LIGHT: .9,
    REFLECTIVITY_MEDIUM: .75,
    REFLECTIVITY_DARK: .55,
    FLOATING_LIGHT_MARGIN: .7,
    base_style: {
        fillColor: "white",
        fillAlpha: .1,
        strokeColor: "#72b7f6",
        strokeWidth: 2
    },
    active_style: {
        fillColor: "white",
        fillAlpha: .4,
        strokeColor: "#72b7f6",
        strokeWidth: 2
    },
    init: function(e) {
        this.create_path(e), this.id = this.path.id, this.type = e.type || this.default_room_type, this.display_name = e.display_name || "Room " + parseInt(_.size(app.designer.rooms), 10), this.color_temp = e.color_temp || this.default_color_temp, this.reflectivity = e.reflectivity || this.default_reflectivity, this.recommended_lux = e.recommended_lux || 0, this.recommended_workplane_lux = e.recommended_workplane_lux || 0, this.recommended_lumens = e.recommended_lumens || 0, this.recommended_wattage = e.recommended_wattage || 0, this.recommended_wattage_sqm = e.recommended_wattage_sqm || 0, this.reached_lux = e.reached_lux || 0, this.reached_workplane_lux = e.reached_workplane_lux || 0, this.reached_lumens = e.reached_lumens || 0, this.reached_wattage = e.reached_wattage || 0, this.reached_wattage_sqm = e.reached_wattage_sqm || 0, this.all_circuits = {}, e.circuit ? void 0 !== app.designer.circuits[e.circuit] && (this.circuit = app.designer.circuits[e.circuit], this.circuit.room = this) : (this.circuit = app.designer.get_new_circuit(), this.circuit.room = this), this.set_style(this.base_style), this.assets = {}, e.assets && this.import_assets(e.assets), this.lights = {}, e.lights && this.import_lights(e.lights), this.light_switches = {}, e.light_switches && this.import_light_switches(e.light_switches), this.first_light_distance_lines = [], this.snap_lines = [], this._super(), e && e.id && (this.id = e.id), this.refresh_square_meters(), this.refresh_recommended(), this.refresh_reached(!0), this.refresh_circuits(), this.get_lights_count() > 0 && this.reconnect_light_switches()
    },
    should_activate: function() {
        return !(app.dialog_showing || app.designer.active_tool && app.designer.active_tool.capture_mouse)
    },
    on_mouse_enter: function(e) {
        this._super(e), app.designer.is_disconnect_active() && this.set_switch_connections_editable(!0), this.should_activate() && this.set_active(!0)
    },
    set_switch_connections_editable: function(e) {
        for (var t in this.all_circuits) {
            var i = this.all_circuits[t],
                s = i.secondary_switches;
            for (var n in s) {
                var o = s[n];
                e && o.show_connection(i), o.set_connection_editable(i, e)
            }
        }
    },
    on_mouse_move: function(e) {
        if (this._super(e), this.should_activate()) {
            var t = {
                    segments: !0,
                    handles: !0,
                    stroke: !0,
                    fill: !1,
                    tolerance: 3
                },
                i = paper.project.hitTest(e.point, t);
            i && i.item.id == this.id || this.set_style(this.active_style)
        }
    },
    on_mouse_down: function(e) {
        2 == e.event.button && (window.asset = this), this._super(e), !this.should_activate()
    },
    on_mouse_drag: function(e) {
        this._super(e)
    },
    on_mouse_up: function(e, t) {
        this._super(e)
    },
    after_resizable_resize: function() {
        this.wall_length = null, this.refresh_square_meters(), this.refresh_recommended(), this.refresh_reached(!0)
    },
    on_mouse_leave: function(e) {
        this._super(e), app.designer.is_disconnect_active() && this.is_circuit_outline(e) || (app.designer.is_disconnect_active() && (this.set_switch_connections_editable(!1), this.hide_circuits()), this.path.contains(e.point) || app.dialog_showing || (this.set_active(!1), app.is_dragging() && app.designer.drag_asset && app.designer.drag_asset.hide_wall_distance_lines()))
    },
    resize_bounds: function(e) {
        var t, i = 3;
        e.top && (t = this.path.bounds.top, this.path.bounds.top = e.top, this.path.bounds.height < i && (this.path.bounds.top = t)), e.right && (t = this.path.bounds.right, this.path.bounds.right = e.right, this.path.bounds.width < i && (this.path.bounds.right = t)), e.bottom && (t = this.path.bounds.bottom, this.path.bounds.bottom = e.bottom, this.path.bounds.height < i && (this.path.bounds.bottom = t)), e.left && (t = this.path.bounds.left, this.path.bounds.left = e.left, this.path.bounds.width < i && (this.path.bounds.left = t)), this.width = this.path.bounds.width, this.height = this.path.bounds.height
    },
    is_circuit_outline: function(e) {
        var t = {
                segments: !0,
                handles: !1,
                stroke: !0,
                fill: !1,
                tolerance: 1.5
            },
            i = paper.project.hitTest(e.point, t);
        return i && i.item && i.item.ld_type && "circuit-outline" == i.item.ld_type
    },
    add_asset: function(e, t) {
        if (!this.contains_asset(e)) {
            var i = e.room;
            if (e.is_light()) {
                if (e.group) return void this.add_light_group(e.group, t);
                e.room = this, this.add_light(e, t)
            } else e.room = this, app.has_furniture = !0;
            i && i.remove_asset(e), e.is_light_switch() && this.add_light_switch(this.circuit, e), this.assets[e.id] = e
        }
        app.pub("designer_room_" + (e.is_light() ? "light" : "asset") + "_add", [this, e])
    },
    add_light: function(e, t) {
        if (this.lights[e.id] = e, e.circuit) {
            var i = e.circuit;
            this.circuit.add_item(e), i.room == this ? i.show_connections(!0) : i.redraw_connections()
        } else this.circuit.add_item(e);
        this.reconnect_light_switches(), this.refresh_reached(!0), app.has_lights = !0
    },
    get_all_light_switches: function() {
        return this.get_all_assets_of_type(["light-switch", "light-switch-dimmer", "light-switch-touch"])
    },
    add_light_switch: function(e, t) {
        if (!t) {
            var i = this.get_all_light_switches();
            if (i.length > 0) t = i[0];
            else {
                t = new app.Asset.LightSwitch({
                    x: 0,
                    y: 0,
                    type: "light-switch"
                });
                var s = this.get_all_assets_of_type("door");
                if (s.length > 0) {
                    var n = s[0],
                        o = n.get_light_position(t.width, t.height);
                    t.rotate_by(n.rotation);
                    var r = {
                        x: o.x - t.path.position.x,
                        y: o.y - t.path.position.y
                    };
                    t.move_by(r)
                } else {
                    var a = this.path.strokeBounds.topLeft;
                    app.designer.drag_offset = {
                        x: 0,
                        y: 0
                    }, t.move(a.x + t.width / 2, a.y)
                }
            }
        }
        t.room && t.reset(), t.room = this, this.refresh_circuits();
        for (var h in this.all_circuits) e = this.all_circuits[h], (!e.has_primary_switch() || e.has_primary_switch() && e.primary_switch.room == this) && (t.add_circuit(e), e.has_primary_switch() ? e.add_secondary_switch(t) : e.set_primary_switch(t));
        this.light_switches[t.id] = t, this.assets[t.id] = t, t.move_finish()
    },
    reconnect_light_switches: function() {
        for (var e in this.all_circuits) {
            var t = this.all_circuits[e];
            t.has_primary_switch() || (this.circuit.has_primary_switch() ? (this.circuit.primary_switch.add_circuit(t), t.primary_switch = this.circuit.primary_switch) : this.add_light_switch(t))
        }
    },
    show_circuits: function() {
        if (!app.is_dragging())
            for (var e in this.all_circuits) {
                var t = this.all_circuits[e];
                t.show_connections()
            }
    },
    hide_circuits: function() {
        if (!app.is_dragging())
            for (var e in this.all_circuits) {
                var t = this.all_circuits[e];
                t.hide_connections()
            }
    },
    refresh_circuits: function() {
        if (!app.is_dragging()) {
            this.all_circuits = {}, this.all_circuits[this.circuit.id] = this.circuit;
            for (var e in this.lights) {
                var t = this.lights[e];
                void 0 === this.all_circuits[t.circuit.id] && (this.all_circuits[t.circuit.id] = t.circuit)
            }
        }
    },
    contains_asset: function(e) {
        return void 0 !== this.assets[e.id]
    },
    remove_asset: function(e) {
        e.is_light() && (delete this.lights[e.id], this.refresh_reached(!0)), delete this.assets[e.id], app.pub("designer_room_" + (e.is_light() ? "light" : "asset") + "_remove", [this])
    },
    add_light_group: function(e, t) {
        var i = null;
        for (var s in e.lights) {
            var n = e.lights[s];
            this.assets[n.id] = n, this.lights[n.id] = n, null !== n.room && n.room.id !== this.id && n.room.remove_asset(n), n.room = this, t || (null === i && n.circuit && (i = n.circuit), this.circuit.add_item(n))
        }
        this.refresh_reached(!0), i && i.get_items_count() > 0 && (i.room == this ? i.show_connections(!0) : (i.redraw_connections(), i.room.reconnect_light_switches())), this.circuit.show_connections(!0), this.reconnect_light_switches(), app.pub("room_light_group_added", [this, e])
    },
    set_active: function(e) {
        if (this._super(e), this.active) this.show_circuits();
        else {
            this.hide_circuits();
            var t = app.designer.active_asset;
            t && !app.is_dragging() && t.set_active(!1)
        }
    },
    select: function() {
        this.path.moveAbove(this.path.layer.lastChild), this._super()
    },
    unselect: function() {
        this._super()
    },
    get_zoom_to_factor: function() {
        var e = app.designer.element.width() / (this.path.bounds.width + 20),
            t = app.designer.element.height() / (this.path.bounds.height + 20),
            i = t > e ? e : t;
        return i -= .1, app.designer.sanitize_zoom(i)
    },
    zoom_to: function() {
        app.designer.zoom(this.get_zoom_to_factor());
        var e = {
            x: this.path.position.x,
            y: this.path.position.y
        };
        app.designer.set_center(e)
    },
    preview_scale: function() {
        var e = Math.round(this.path.bounds.height / this.wall_length * 100) / 100;
        app.designer.refresh_asset_scale(e)
    },
    show_wall_line: function() {
        this.wall_line = new Path, this.wall_line.strokeColor = "red", this.wall_line.strokeWidth = 4, this.wall_line.dashArray = [15, 7];
        var e = this.path.bounds.height,
            t = this.path.strokeBounds.x,
            i = this.path.strokeBounds.y,
            s = this.path.strokeBounds.x,
            n = this.path.strokeBounds.y + e;
        this.wall_line_size = e, this.wall_line.add(new Point(t, i)), this.wall_line.add(new Point(s, n)), view.draw()
    },
    hide_wall_line: function() {
        this.wall_line && (this.wall_line.remove(), this.wall_line = null, view.draw())
    },
    get_room_length: function() {
        var e = app.designer.room_scale;
        return e ? Math.round(this.path.bounds.height / e * 100) / 100 : 0
    },
    get_room_width: function() {
        var e = app.designer.room_scale;
        return e ? Math.round(this.path.bounds.width / e * 100) / 100 : 0
    },
    get_room_height: function() {
        return 2.7
    },
    refresh_recommended: function() {
        app.designer.recommended_lux -= this.recommended_lux, this.refresh_recommended_lux(), app.designer.recommended_lux += this.recommended_lux, app.designer.recommended_lumens -= this.recommended_lumens, this.refresh_recommended_lumens(), app.designer.recommended_lumens += this.recommended_lumens, app.designer.recommended_wattage -= this.recommended_wattage, this.refresh_recommended_wattage(), app.designer.recommended_wattage += this.recommended_wattage
    },
    refresh_recommended_lux: function() {
        if (this.type) {
            var e = app.RoomTypes.Residential[this.type] || app.RoomTypes.Commercial[this.type];
            e && void 0 !== e.recommended_lux && (this.recommended_lux = e.recommended_lux)
        }
        this.recommended_lux || (this.recommended_lux = 40), this.recommended_workplane_lux = "-"
    },
    refresh_recommended_lumens: function() {
        var e = this.get_volume();
        if (0 === this.recommended_lux) return void(this.recommended_lumens = 0);
        var t = this.get_reflectivity_level();
        this.recommended_lumens = Math.ceil(this.recommended_lux * e * (this.LOSS_FROM_DIRECT_LIGHT / t))
    },
    refresh_recommended_wattage: function() {
        var e = this.get_room_type();
        this.recommended_wattage_sqm = e.recommended_wattage_sqm ? e.recommended_wattage_sqm : 5, this.recommended_wattage = this.recommended_wattage_sqm * this.square_meters
    },
    refresh_reached: function(e) {
        e && (app.designer.reached_lumens -= this.reached_lumens, app.designer.reached_wattage -= this.reached_wattage), this.refresh_reached_lumens(), app.designer.reached_lumens += this.reached_lumens, app.designer.reached_wattage += this.reached_wattage, e && (app.designer.reached_lux -= this.reached_lux, app.designer.reached_workplane_lux -= this.reached_workplane_lux), this.refresh_reached_lux(), app.designer.reached_lux += this.reached_lux, app.designer.reached_workplane_lux += this.reached_workplane_lux
    },
    refresh_reached_lumens: function() {
        var e = this.get_lights_count();
        if (e > 0) {
            var t = 0,
                i = 0;
            for (var s in this.lights) {
                var n = this.lights[s];
                t += n.lumens, i += n.wattage
            }
            this.reached_lumens = t, this.reached_wattage = i, this.reached_wattage_sqm = Math.round(this.reached_wattage / this.square_meters * 10) / 10
        } else this.reached_lumens = 0, this.reached_wattage = 0, this.reached_wattage_sqm = 0
    },
    refresh_reached_lux: function() {
        var e = this.get_volume();
        if (0 === e) return this.reached_lux = 0, void(this.reached_workplane_lux = 0);
        var t = this.get_reflectivity_level(),
            i = Math.round(this.get_room_length() * this.get_room_width() * 10) / 10;
        this.reached_lux = Math.round(this.reached_lumens / e / (this.LOSS_FROM_DIRECT_LIGHT / t)), this.reached_workplane_lux = Math.round(this.reached_lumens / i / (this.LOSS_FROM_DIRECT_LIGHT / t))
    },
    get_volume: function() {
        return Math.round(this.get_room_length() * this.get_room_width() * this.get_room_height() * 10) / 10
    },
    refresh_square_meters: function() {
        this.square_meters = Math.round(this.get_room_length() * this.get_room_width() * 10) / 10
    },
    get_floating_light_bounds: function() {
        var e = this.FLOATING_LIGHT_MARGIN * app.designer.room_scale;
        return {
            x: this.path.bounds.x + e,
            y: this.path.bounds.y + e,
            width: this.path.bounds.width - 2 * e,
            height: this.path.bounds.height - 2 * e
        }
    },
    get_hover_status: function() {},
    refresh_status: function() {
        this.is_resizing || app.designer.update_stats_box(this.recommended_lumens, this.reached_lumens)
    },
    get_lights_count: function() {
        var e = this.lights,
            t = 0;
        for (var i in e) e.hasOwnProperty(i) && t++;
        return t
    },
    get_reflectivity_level: function() {
        switch (this.reflectivity) {
            case "Light":
                return this.REFLECTIVITY_LIGHT;
            case "Medium":
                return this.REFLECTIVITY_MEDIUM;
            case "Dark":
                return this.REFLECTIVITY_DARK;
            default:
                return this.REFLECTIVITY_MEDIUM
        }
    },
    calculate_best_guess: function() {
        if (0 === this.get_reflectivity_level()) return void alert("Please choose a reflectivity level for this room in room settings.");
        for (var e in this.lights) this.lights[e].remove();
        app.light_manager.best_fit(this)
    },
    get_room_type: function() {
        var e = "Commercial" === app.project_manager.selected_project.property_type ? app.RoomTypes.Commercial : app.RoomTypes.Residential;
        return e[this.type] ? e[this.type] : e[this.default_room_type]
    },
    get_all_assets_of_type: function(e) {
        var t = [];
        for (var i in this.assets) {
            var s = this.assets[i];
            s.type === e && t.push(s)
        }
        return t
    },
    get_closest_light: function() {
        var e = null,
            t = -1,
            i = this.path.bounds.getTopLeft();
        for (var s in this.lights) {
            var n = this.lights[s],
                o = i.getDistance(n.path.bounds.center);
            (t > o || -1 == t) && (t = o, e = n)
        }
        return e
    },
    draw_first_light_distance_lines: function() {
        if (this.first_light = this.get_closest_light(), null !== this.first_light && (this.first_light.draw_wall_distance_lines(this), this.get_lights_count() > 1)) {
            var e, t = this.first_light.find_nearest_lights(10, this, "y", !0);
            if (null === t.y_point ? (t = this.first_light.find_nearest_lights(10, this, "x", !0), null !== t.x_point && (e = t.x_point)) : e = t.y_point, e) {
                var i = new app.DistanceLine(e, this.first_light.path.bounds.center);
                this.first_light_distance_lines.push(i), i.draw()
            }
        }
    },
    remove_first_light_distance_lines: function() {
        for (var e in this.first_light_distance_lines) this.first_light_distance_lines[e].remove();
        this.first_light && this.first_light.remove_wall_distance_lines()
    },
    hide_first_light_distance_lines: function() {
        for (var e in this.first_light_distance_lines) this.first_light_distance_lines[e].remove();
        this.first_light && this.first_light.hide_wall_distance_lines()
    },
    get_closest_point_on_wall_by_axis: function(e, t) {
        var i = "x" == t ? e.y : e.x,
            s = "x" == t ? this.path.bounds.x : this.path.bounds.y,
            n = "x" == t ? this.path.bounds.width + this.path.bounds.x : this.path.bounds.height + this.path.bounds.y,
            o = "x" == t ? new Point(s, i) : new Point(i, s),
            r = e.getDistance(o),
            a = "x" == t ? new Point(n, i) : new Point(i, n),
            h = e.getDistance(a);
        return h >= r - 1 ? o : a
    },
    draw_snap_lines_for_light: function(e) {
        app.snap_manager.remove_lines();
        var t = .2 * app.designer.room_scale,
            i = e.find_nearest_lights(t, this);
        app.snap_manager.draw_lines(i, e.path.bounds.center)
    },
    "export": function() {
        var e = {
            id: this.id,
            name: this.name,
            display_name: this.display_name,
            type: this.type,
            circuit: this.circuit.id,
            color_temp: this.color_temp,
            reflectivity: this.reflectivity,
            width: this.get_width(),
            height: this.get_height(),
            x: parseFloat(this.path.bounds.x).toFixed(4),
            y: parseFloat(this.path.bounds.y).toFixed(4),
            stroke_width: this.base_style.strokeWidth,
            segments: this.export_segments(),
            recommended_lux: this.recommended_lux,
            recommended_workplane_lux: this.recommended_workplane_lux,
            recommended_lumens: this.recommended_lumens,
            recommended_wattage: this.recommended_wattage,
            recommended_wattage_sqm: this.recommended_wattage_sqm,
            reached_lux: this.reached_lux,
            reached_workplane_lux: this.reached_workplane_lux,
            reached_lumens: this.reached_lumens,
            reached_wattage: this.reached_wattage,
            reached_wattage_sqm: this.reached_wattage_sqm
        };
        return e.assets = [], $.each(this.assets, function(t, i) {
            i.is_light() || i.is_light_switch() || e.assets.push(i["export"]())
        }), e.lights = [], $.each(this.lights, function(t, i) {
            e.lights.push(i["export"]())
        }), e.light_switches = [], $.each(this.light_switches, function(t, i) {
            e.light_switches.push(i["export"]())
        }), e
    },
    import_assets: function(e) {
        var t = this;
        $.each(e, function(e, i) {
            var s = app.designer.get_asset_class(i.type);
            if (s) {
                var n = new s(i);
                n.room = t, t.assets[n.id] = n
            }
            app.has_furniture === !1 && (app.has_furniture = !0)
        })
    },
    import_lights: function(e) {
        var t = this;
        $.each(e, function(e, i) {
            var s = app.Light,
                n = void 0 !== app.designer.circuits[i.circuit];
            if (s && n) {
                var o = new s(i);
                o.room = t, t.lights[o.id] = o, t.assets[o.id] = o, app.has_lights === !1 && (app.has_lights = !0)
            }
        })
    },
    import_light_switches: function(e) {
        var t = this;
        $.each(e, function(e, i) {
            var s = new app.Asset.LightSwitch(i);
            s.room = t, t.light_switches[s.id] = s, t.assets[s.id] = s
        })
    },
    remove: function() {
        app.ui.pause_rendering(), this._super(), app.designer.square_meters -= this.square_meters, app.designer.recommended_lumens -= this.recommended_lumens, app.designer.recommended_wattage -= this.recommended_wattage, app.designer.reached_lumens -= this.reached_lumens, app.designer.reached_lux -= this.reached_lux, app.designer.reached_workplane_lux -= this.reached_workplane_lux, app.designer.reached_wattage -= this.reached_wattage, app.clear_status(), this.path.remove(), $.each(this.assets, function(e, t) {
            t.remove()
        }), $.each(this.light_switches, function(e, t) {
            t.remove()
        }), this.remove_first_light_distance_lines(), delete app.designer.circuits[this.circuit.id], delete app.designer.rooms[this.id], this.pub_with_type("remove"), app.ui.resume_rendering(), app.ui.draw()
    },
    get_layer: function() {
        return app.designer.layers.rooms
    }
}), app.RoomTypes = {}, app.RoomTypes.Residential = {
    "Kitchen (working area)": {
        recommended_lux: 160,
        light_layout: "direct"
    },
    Toilet: {
        recommended_lux: 80,
        light_layout: "direct"
    },
    "Dining/Living (general)": {
        recommended_lux: 100,
        light_layout: "indirect"
    },
    "Dining (dining table)": {
        recommended_lux: 200,
        light_layout: "direct"
    },
    Laundry: {
        recommended_lux: 300,
        light_layout: "direct"
    },
    "W.I.R": {
        recommended_lux: 300,
        light_layout: "direct"
    },
    Bathroom: {
        recommended_lux: 150,
        light_layout: "direct"
    },
    "Bathroom (vanity basin)": {
        recommended_lux: 500,
        light_layout: "direct"
    },
    Bedroom: {
        recommended_lux: 150,
        light_layout: "indirect"
    },
    "Bedroom (special)": {
        recommended_lux: 500,
        light_layout: "indirect"
    },
    "Study (desk)": {
        recommended_lux: 400,
        light_layout: "direct"
    },
    Entertainment: {
        recommended_lux: 240,
        light_layout: "indirect"
    },
    "Garage (general)": {
        recommended_lux: 160,
        light_layout: "direct",
        recommended_wattage_sqm: 3
    },
    "Garage (repair bench)": {
        recommended_lux: 400,
        light_layout: "direct",
        recommended_wattage_sqm: 3
    },
    Patio: {
        recommended_lux: 160,
        light_layout: "indirect"
    },
    Hallway: {
        recommended_lux: 40,
        light_layout: "direct"
    },
    Stairway: {
        recommended_lux: 80,
        light_layout: "direct"
    },
    Foyer: {
        recommended_lux: 160,
        light_layout: "direct"
    },
    "Other (Day Time Use)": {
        recommended_lux: 40,
        light_layout: "indirect"
    },
    "Other (Night Time Use)": {
        recommended_lux: 80,
        light_layout: "indirect"
    },
    Roof: {
        recommended_lux: 0,
        light_layout: "direct"
    }
}, app.RoomTypes.Commercial = {
    "Retail (general)": {
        recommended_lux: 160,
        light_layout: "direct"
    },
    "Kitchen General": {
        recommended_lux: 160,
        light_layout: "direct"
    },
    "Kitchen working bench": {
        recommended_lux: 240,
        light_layout: "direct"
    },
    Toilet: {
        recommended_lux: 80,
        light_layout: "direct"
    },
    Entrance: {
        recommended_lux: 160,
        light_layout: "indirect"
    },
    "Waiting Room": {
        recommended_lux: 160,
        light_layout: "indirect"
    },
    "Enquiry Desk": {
        recommended_lux: 320,
        light_layout: "indirect"
    },
    Corridor: {
        recommended_lux: 40,
        light_layout: "indirect"
    },
    Stairs: {
        recommended_lux: 80,
        light_layout: "direct"
    },
    "Lift, esalator, moving walk": {
        recommended_lux: 160,
        light_layout: "direct"
    },
    "Carpark (indoor)": {
        recommended_lux: 40,
        light_layout: "direct"
    },
    "Inspection (rough work)": {
        recommended_lux: 160,
        light_layout: "indirect"
    },
    "Inspection (fine work)": {
        recommended_lux: 600,
        light_layout: "direct"
    },
    "Art Gallery, Museum": {
        recommended_lux: 150,
        light_layout: "direct"
    },
    "Art Gallery, Museum (special)": {
        recommended_lux: 300,
        light_layout: "direct"
    },
    "Concert Platform": {
        recommended_lux: 80,
        light_layout: "direct"
    },
    "Booking office (on desk)": {
        recommended_lux: 400,
        light_layout: "direct"
    },
    "Cinema Foyer": {
        recommended_lux: 80,
        light_layout: "indirect"
    },
    "Projection room": {
        recommended_lux: 160,
        light_layout: "indirect"
    },
    "School Assembly hall (general)": {
        recommended_lux: 80,
        light_layout: "direct"
    },
    "School Assembly hall (exam)": {
        recommended_lux: 140,
        light_layout: "indirect"
    },
    Classroom: {
        recommended_lux: 240,
        light_layout: "direct"
    },
    Laboratory: {
        recommended_lux: 400,
        light_layout: "direct"
    },
    "Library (general)": {
        recommended_lux: 240,
        light_layout: "direct"
    },
    "Library (desks)": {
        recommended_lux: 400,
        light_layout: "direct"
    },
    "Transport terminal (counter desk)": {
        recommended_lux: 400,
        light_layout: "direct"
    },
    "Transport terminal (hall)": {
        recommended_lux: 400,
        light_layout: "direct"
    },
    "Computer Room (general)": {
        recommended_lux: 320,
        light_layout: "direct"
    },
    "Conference Room": {
        recommended_lux: 240,
        light_layout: "indirect"
    },
    "Office counter": {
        recommended_lux: 320,
        light_layout: "direct"
    },
    "Office desk": {
        recommended_lux: 320,
        light_layout: "direct"
    },
    "Hospital (Patient Transit area)": {
        recommended_lux: 240,
        light_layout: "indirect"
    },
    "Hospital Ward (General)": {
        recommended_lux: 240,
        light_layout: "direct"
    },
    "Hospital Ward (examination)": {
        recommended_lux: 400,
        light_layout: "direct"
    },
    "Medical Centre (waiting room)": {
        recommended_lux: 160,
        light_layout: "indirect"
    },
    "Medical Centre (Dental chair / Special examiation)": {
        recommended_lux: 600,
        light_layout: "direct"
    },
    "Other (Day Time Use)": {
        recommended_lux: 40,
        light_layout: "indirect"
    },
    "Other (Night Time Use)": {
        recommended_lux: 80,
        light_layout: "indirect"
    },
    Roof: {
        recommended_lux: 0,
        light_layout: "direct"
    }
}, app.snap_manager = {
    snap_lines: null,
    find_nearest_asset_points: function(e, t, i, s, n, o) {
        var r = {
                x_point: null,
                y_point: null
            },
            a = -1 !== t.indexOf("x"),
            h = -1 !== t.indexOf("y"),
            l = -1,
            d = -1;
        for (var c in i) {
            var g = i[c];
            if (_.isArray(o) && o.length > 0) {
                var p = _.some(o, function(e) {
                    return e(g)
                });
                if (p) continue
            }
            for (var u in n) {
                var f = n[u],
                    A = g.path.bounds[f];
                if (a) {
                    var m = A.x;
                    if (m === e.x || m > e.x - s && m < e.x + s) {
                        var v = e.getDistance(A);
                        (-1 == l || l > v) && (l = v, r.x_point = A)
                    }
                }
                if (h) {
                    var w = A.y;
                    if (w == e.y || w > e.y - s && w < e.y + s) {
                        var P = e.getDistance(A);
                        (-1 == d || d > P) && (d = P, r.y_point = A)
                    }
                }
            }
        }
        return r
    },
    draw_lines: function(e, t) {
        if (this.remove_lines(), this.snap_lines = [], null !== e.x_point) {
            var i = t.y < e.x_point.y ? -10 : 10,
                s = new Point(e.x_point.x, t.y + i),
                n = new Path.Line(e.x_point, s);
            this.snap_lines.push(n), n.strokeColor = app.colours.main, app.designer.layers.background.addChild(n)
        }
        if (null !== e.y_point) {
            var o = t.x < e.y_point.x ? -10 : 10,
                r = new Point(t.x + o, e.y_point.y),
                a = new Path.Line(r, e.y_point);
            a.strokeColor = app.colours.main, this.snap_lines.push(a), app.designer.layers.background.addChild(a)
        }
    },
    remove_lines: function() {
        for (var e in this.snap_lines) this.snap_lines[e].remove();
        app.ui.draw()
    }
}, app.Circuit = Class.extend({
    items: null,
    room: null,
    connections: null,
    outline: null,
    primary_switch: null,
    secondary_switches: null,
    wire_color: app.colours.main,
    flush_wall_lights: null,
    flush_wall_light_count: null,
    init: function(e, t) {
        this.id = e && e.id ? e.id : generate_guid(), t ? this.room = t : e && e.room && (this.room = e.room), this.items = {}, this.connections = {}, e && e.primary_switch && (this.primary_switch = e.primary_switch), this.secondary_switches = {}, e && e.secondary_switches && (this.secondary_switches = e.secondary_switches)
    },
    merge: function(e) {
        this.hide_connections(), e.hide_connections();
        for (var t in this.items) e.add_item(this.items[t]);
        this.room.circuit.id != this.id && this.remove(), e.show_connections(!0), e.room.reconnect_light_switches();
        var i = e.get_first_item();
        i && (i.room.refresh_circuits(), this.room && this.room.refresh_circuits())
    },
    cancel_connection: function(e) {
        for (var t in this.items) this.items[t].cancel_connection()
    },
    invoke_on_items: function(e) {
        for (var t in this.items) this.items[t][e]()
    },
    add_item: function(e) {
        this.contains_item(e) || (this.items[e.id] = e, null !== e.circuit && "string" != typeof e.circuit && e.circuit.id !== this.id && e.circuit.remove_item(e), e.circuit = this)
    },
    contains_item: function(e) {
        return void 0 !== this.items[e.id]
    },
    remove_item: function(e, t) {
        delete this.items[e.id], 0 !== this.get_items_count() || t || this.remove()
    },
    get_items_count: function() {
        var e = 0;
        for (var t in this.items) this.items.hasOwnProperty(t) && e++;
        return e
    },
    get_first_item: function() {
        var e = this.get_closest_item_to_point(this.room.path.bounds.topLeft);
        return e ? e : null
    },
    show_connections: function(e) {
        if (!app.ui.is_paused()) {
            if (0 === this.get_items_count()) return void this.hide_connections();
            e && this.redraw_connections(), this.outline && this.outline.length > 0 && null === this.outline[0].layer && app.designer.layers.circuits.addChildren(this.outline), this.show_switches(), app.ui.draw()
        }
    },
    hide_connections: function() {
        if (this.outline && this.outline.length > 0 && this.outline[0].layer) {
            for (var e in this.outline) this.outline[e].remove();
            app.ui.draw()
        }
        this.hide_switches()
    },
    show_switches: function() {
        this.primary_switch && this.primary_switch.show_connection(this);
        for (var e in this.secondary_switches) {
            var t = this.secondary_switches[e];
            t && t.show_connection(this)
        }
    },
    hide_switches: function() {
        this.primary_switch && this.primary_switch.hide_connection(this);
        for (var e in this.secondary_switches) {
            var t = this.secondary_switches[e];
            t && t.hide_connection(this)
        }
    },
    redraw_connections: function() {
        this.reset_connections(), this.hide_connections();
        var e = this.prepare_wall_lights();
        this.simple_connection_path = [], this.derive_simple_connection_path(), this.outline = [];
        for (var t in this.simple_connection_path) {
            var i = this.simple_connection_path[t],
                s = i[0],
                n = i[1];
            t > 0 && (s = this.get_closest_item_to_item(n, "wired")), this.connect_items(s, n)
        }
        this.reconnect_switches(), e && this.connect_flush_wall_lights(), this.hide_connections(), app.ui.draw()
    },
    reconnect_switches: function() {
        this.primary_switch && this.primary_switch.redraw_connection(this);
        for (var e in this.secondary_switches) {
            var t = this.secondary_switches[e];
            t && t.redraw_connection(this)
        }
    },
    connect_items: function(e, t) {
        var i = this.get_connection_through_point(e, t),
            s = new Path.Arc(e.path.bounds.center, i, t.path.bounds.center);
        s.ignore_events = !0, s.strokeColor = this.wire_color, s.dashArray = [6, 6], s.opacity = .8, this.outline.push(s), e.wire_count++, t.wire_count++, e.wires[t.id] = !0, t.wires[e.id] = !0
    },
    prepare_wall_lights: function() {
        this.flush_wall_lights = {}, this.flush_wall_light_count = 0;
        var e = 0,
            t = [];
        for (var i in this.items) this.items[i].is_light() && (t[i] = this.items[i]);
        if (0 == t.length) return !1;
        for (var i in t) {
            var s = t[i];
            s.ignore_connection = !1, s.is_wall_light && (!s.group || "string" === s.group.type && s.group.is_straight_line()) && s.sticky_wall && (this.flush_wall_lights[s.sticky_wall] || (this.flush_wall_lights[s.sticky_wall] = [], e++), this.flush_wall_lights[s.sticky_wall].push(s), this.flush_wall_light_count++)
        }
        var n = t.length - this.flush_wall_light_count,
            o = !0;
        0 === n ? o = !1 : e - 1 > n && (o = !1);
        var r = function(e, t) {
            var i = "x" === l ? "y" : "x";
            return e.path.bounds[i] < t.path.bounds[i]
        };
        for (var a in this.flush_wall_lights) {
            var h = this.flush_wall_lights[a],
                l = a.substr(0, 1);
            if (h = h.sort(r), o)
                for (var d in h) h[d].ignore_connection = !0
        }
        return o || (this.flush_wall_lights = {}, this.flush_wall_light_count = 0), o
    },
    connect_flush_wall_lights: function() {
        var e;
        for (var t in this.flush_wall_lights) {
            var i, s, n = this.flush_wall_lights[t],
                o = 0;
            e = null;
            for (var r in n) {
                var a = n[r];
                e && this.connect_items(e, a);
                var h = this.get_closest_item_to_item(a, "wired");
                if (h) {
                    var l = a.path.bounds.center.getDistance(h.path.bounds.center);
                    (0 === o || o > l) && (i = a, s = h, o = l)
                } else 1 === n.length && (h = this.get_closest_item_to_item(a, "wired", !0), h && (i = a, s = h));
                e = a
            }
            i && s && this.connect_items(i, s)
        }
    },
    derive_simple_connection_path: function() {
        var e = this.get_items_count() - this.flush_wall_light_count;
        if (e > 1)
            for (var t, i = this.get_first_item(), s = !0; s;) {
                t = null;
                var n = this.get_closest_item_to_item(i);
                n ? (this.simple_connection_path.push([i, n]), this.connections.from[i.id] = !0, this.connections.to[n.id] = !0, i = n) : s = !1
            }
    },
    get_closest_item_to_item: function(e, t, i) {
        var s, n, o, r;
        t || (t = "unwired"), e.group && (r = e.group.cols > e.group.rows ? "horizontal" : "vertical");
        for (var a in this.items)
            if (s = this.items[a], s != e && ("unwired" !== t || !this.connections.from[s.id])) {
                if ("wired" === t) {
                    if (e.wires[s.id] || s.wires[e.id]) continue;
                    if (0 === s.wire_count || s.wire_count >= s.max_wires) continue
                }
                if (!s.ignore_connection || i) {
                    var h = e.path.bounds.center.getDistance(s.path.bounds.center);
                    !o || o > h ? (o = h, n = s) : r && h === o && ("horizontal" == r && e.path.bounds.center.y === s.path.bounds.center.y ? (o = h, n = s) : "vertical" == r && e.path.bounds.center.x === s.path.bounds.center.x && (o = h, n = s))
                }
            }
        return n
    },
    get_connection_through_point: function(e, t) {
        var i = e.path.bounds.center,
            s = t.path.bounds.center,
            n = (i.x + s.x) / 2,
            o = (i.y + s.y) / 2,
            r = new Point(n, o),
            a = {
                x: Math.abs(e.path.bounds.center.x - t.path.bounds.center.x),
                y: Math.abs(e.path.bounds.center.y - t.path.bounds.center.y)
            },
            h = 1.4,
            l = 0,
            d = 0;
        if (a.x < a.y) {
            var c = e.room.path.bounds.x,
                g = e.room.path.bounds.x + e.room.path.bounds.width,
                p = Math.abs(c - n),
                u = Math.abs(g - n);
            r.x = u > p ? c : g, l = Math.round(.1 * Math.abs(i.y - s.y)) * h
        } else {
            var f = e.room.path.bounds.y,
                A = e.room.path.bounds.y + e.room.path.bounds.height,
                m = Math.abs(f - o),
                v = Math.abs(A - o);
            r.y = v > m ? f : A, d = Math.round(.1 * Math.abs(i.x - s.x)) * h
        }
        var w = Math.round(n - r.x),
            P = Math.round(o - r.y),
            z = l,
            y = d;
        w > 0 && (z = 0 - l), P > 0 && (y = 0 - d);
        var B = new Point(n + z, o + y),
            E = 8,
            I = e.room.path.bounds,
            j = new paper.Rectangle({
                x: I.x + E / 2,
                y: I.y + E / 2,
                width: I.width - E,
                height: I.height - E
            });
        return j.contains(B) || (B = new Point(n - z, o - y)), B
    },
    get_closest_item_to_point: function(e, t) {
        var i, s, n, o;
        for (var r in this.items) i = this.items[r], n = i.path.bounds.center.getDistance(e), (!i.ignore_connection || t) && (i.wire_count >= i.max_wires || (!o || o > n) && (o = n, s = i));
        return s
    },
    reset_connections: function() {
        this.connections = {
            from: {},
            to: {},
            all: []
        };
        var e;
        for (var t in this.items) e = this.items[t], e.wire_count = 0, e.wires = {}
    },
    has_primary_switch: function() {
        return null !== this.primary_switch && void 0 !== this.primary_switch
    },
    set_primary_switch: function(e) {
        this.primary_switch = e
    },
    add_secondary_switch: function(e) {
        this.secondary_switches[e.id] = e
    },
    remove_item_switch: function(e) {
        this.primary_switch === e ? this.primary_switch = null : this.secondary_switches[e.id] && delete this.secondary_switches[e.id]
    },
    remove_secondary_switches: function() {
        var e;
        for (var t in this.secondary_switches) e = this.secondary_switches[t], e.remove_circuit(this), this.remove_item_switch(e)
    },
    swap_primary_switch: function(e) {
        if (!e) {
            var t;
            for (var i in this.secondary_switches) {
                t = this.secondary_switches[i], e = t, delete this.secondary_switches[i];
                break
            }
            if (!e) {
                var s = this.room.get_all_light_switches();
                if (s.length > 1)
                    for (var n in s)
                        if (s[n] !== this.primary_switch) {
                            e = s[n];
                            break
                        }
            }
        }
        return e ? (this.remove_item_switch(this.primary_switch), this.set_primary_switch(e), !0) : !1
    },
    "export": function() {
        var e = {
            id: this.id,
            room: this.room.id
        };
        e.items = [];
        for (var t in this.items) e.items.push(this.items[t].id);
        this.primary_switch && (e.primary_switch = this.primary_switch.id), e.secondary_switches = [];
        for (var i in this.secondary_switches) e.secondary_switches.push(this.secondary_switches[i].id);
        return e
    },
    remove: function() {
        if (!this.room) return void delete app.designer.circuits[this.id];
        if (this.room.circuit !== this) {
            var e = this.get_first_item();
            e && e.room.refresh_circuits();
            for (var t in this.items) this.items[t].remove();
            this.primary_switch && this.primary_switch.remove_circuit(this);
            for (var i in this.secondary_switches) this.secondary_switches[i].remove_circuit(this);
            delete this.room.all_circuits[this.id], delete app.designer.circuits[this.id], app.ui.draw()
        }
    }
}), app.DistanceLine = Class.extend({
    from_point: null,
    to_point: null,
    label_text: null,
    group: null,
    path: null,
    path_text: null,
    path_text_background: null,
    LINE_COLOR: "72b7f6",
    TEXT_COLOR: "black",
    TEXT_SIZE: 15,
    BG_COLOR: "white",
    BG_OPACITY: .6,
    init: function(e, t) {
        e && t && this.set_points(e, t), this.path = new Path.Line, this.path.strokeColor = this.LINE_COLOR, this.path_text = new PointText, this.path_text.justification = "center", this.path_text.fillColor = this.TEXT_COLOR, this.path_text.fontSize = this.TEXT_SIZE, this.path_text_background = Path.Rectangle(200, 200, 200, 200), this.path_text_background.fillColor = this.BG_COLOR, this.path_text_background.fillColor.alpha = this.BG_OPACITY, this.group = new Group([this.path, this.path_text, this.path_text_background]), this.path.ignore_events = !0, this.path_text.ignore_events = !0, this.path_text_background.ignore_events = !0, this.group.ignore_events = !0
    },
    set_points: function(e, t) {
        this.from_point = e, this.to_point = t
    },
    refresh_points: function(e, t) {
        this.set_points(e, t), this.draw()
    },
    draw: function() {
        this.path.segments[0].point = this.from_point, this.path.segments[1].point = this.to_point, this.label_text = (this.path.length / app.designer.room_scale).toFixed(1) + "m";
        var e = this.get_label_point();
        this.path_text.content = this.label_text, this.path_text.setPoint(e), paper.view.zoom < 1 ? (this.path_text.bounds.height = 10 + 10 / paper.view.zoom, this.path_text.bounds.width = 20 + 20 / paper.view.zoom) : (this.path_text.bounds.height = 20 / paper.view.zoom, this.path_text.bounds.width = 40 / paper.view.zoom), this.path_text_background.setBounds(this.path_text.bounds), this.path_text_background.moveBelow(this.path_text), this.group.visible || this.show()
    },
    get_label_point: function(e) {
        var t = new Point(this.path.bounds.center.x, this.path.bounds.center.y + 3);
        if (this.path.length < 20) {
            var i = this.path.segments[0].point,
                s = this.path.segments[1].point;
            i.x < s.x ? t = new Point(this.path.bounds.center.x - 20, this.path.bounds.center.y - 3) : i.x > s.x && (t = new Point(this.path.bounds.center.x + 20, this.path.bounds.center.y - 3)), i.y < s.y ? t = new Point(this.path.bounds.center.x, this.path.bounds.center.y - 10) : i.y > s.y && (t = new Point(this.path.bounds.center.x, this.path.bounds.center.y + 10))
        }
        return t
    },
    hide: function() {
        this.group.setVisible(!1)
    },
    show: function() {
        this.group.setVisible(!0)
    },
    remove: function() {
        this.group.remove()
    }
});
var room_draw = new(Tool.extend({
    name: "room.draw",
    capture_mouse: !0,
    previous_width: null,
    previous_height: null,
    room: null,
    is_drawing_room: null,
    snap_lines: null,
    downpoint_x: null,
    downpoint_y: null,
    SNAP_TOLERANCE: 4,
    mode: null,
    free_line: null,
    has_clicked: null,
    FREEHAND_SNAP_DISTANCE: 10,
    snap_indicator: null,
    click_count: null
}));
room_draw.on_activate = function(e) {
    this.is_drawing_room = !1, app.designer.set_cursor("crosshair", !0), app.designer.clear_selected(), app.pub("tool_activate"), app.pub("tool_" + this.name + "_activate"), this.mode = null, this.has_clicked = !1, this.click_count = 0
}, room_draw.onMouseMove = function(e) {
    "free" == this.mode && this.has_clicked && null !== this.room && (this.free_line && this.free_line.remove(), this.free_line = new Path, this.free_line.strokeColor = this.room.active_style.strokeColor, this.free_line.strokeWidth = this.room.active_style.strokeWidth, this.free_line.add(new Point(this.downpoint_x, this.downpoint_y)), this.free_line.add(e.point), e.point.getDistance(this.room.path.segments[0].point) < this.FREEHAND_SNAP_DISTANCE ? null === this.snap_indicator && (this.snap_indicator = new Path.Circle(this.room.path.segments[0].point, this.FREEHAND_SNAP_DISTANCE), this.snap_indicator.strokeColor = "black", this.snap_indicator.fillColor = "#009933", this.snap_indicator.fillColor.alpha = .5) : null !== this.snap_indicator && (this.snap_indicator.remove(), this.snap_indicator = null)), this.draw_snap_lines(e)
}, room_draw.onMouseDown = function(e) {
    this.previous_width = 1, this.previous_height = 1, this.downpoint_x = this.snap_to_x || e.point.x, this.downpoint_y = this.snap_to_y || e.point.y, "free" == this.mode || (this.room = new app.Room({
        x: this.downpoint_x,
        y: this.downpoint_y,
        width: 1,
        height: 1
    })), this.is_drawing_room = !0
}, room_draw.onKeyDown = function(e) {
    "escape" === e.key && this.cancel_free_draw()
}, room_draw.onMouseDrag = function(e) {
    if ("free" != this.mode && this.is_drawing_room) {
        var t = e.point.x - this.downpoint_x,
            i = e.point.y - this.downpoint_y,
            s = t / this.previous_width,
            n = i / this.previous_height;
        if (0 === s || 0 === n) return;
        this.room.path.scale(s, n, new Point(this.downpoint_x, this.downpoint_y)), this.draw_snap_lines(e), this.previous_width = t, this.previous_height = i
    }
}, room_draw.find_nearest_rooms = function(e) {
    var t = new Point(e.point.x, e.point.y),
        i = app.designer.rooms,
        s = this.SNAP_TOLERANCE,
        n = ["topLeft", "topRight", "bottomLeft", "bottomRight", "center"],
        o = [];
    return o.push($.proxy(function(e) {
        return this.room && e.id === this.room.id
    }, this)), app.snap_manager.find_nearest_asset_points(t, "xy", i, s, n, o)
}, room_draw.draw_snap_lines = function(e) {
    this.snap_lines = [];
    var t = this.find_nearest_rooms(e);
    this.snap_to_x = t.x_point ? t.x_point.x : null, this.snap_to_y = t.y_point ? t.y_point.y : null, app.snap_manager.draw_lines(t, e.point)
}, room_draw.onMouseUp = function(e) {
    if (e.point.getDistance(new Point(this.downpoint_x, this.downpoint_y)) < 10) return void this.onMouseClick(e);
    if ("free" == this.mode) return void this.cancel_free_draw();
    if (this.is_drawing_room) {
        app.snap_manager.remove_lines();
        var t, i;
        if (this.snap_to_x && (t = this.room.get_closest_side_by_axis(e.point.x, "x"), i = {}, i[t.side] = this.snap_to_x, this.room.resize_bounds(i)), this.snap_to_y && (t = this.room.get_closest_side_by_axis(e.point.y, "y"), i = {}, i[t.side] = this.snap_to_y, this.room.resize_bounds(i)), this.room.path.bounds.width < 5 || this.room.path.bounds.height < 5) return this.room.remove(), void(this.is_drawing_room = !1);
        app.designer.rooms[this.room.id] = this.room, app.pub("designer_room_created", [this.room])
    }
    this.room = null, this.is_drawing_room = !1
}, room_draw.onMouseClick = function(e) {
    if (this.click_count++, this.mode = "free", 2 == e.event.button) return void this.cancel_free_draw();
    var t = this.snap_to_x ? this.snap_to_x : e.point.x,
        i = this.snap_to_y ? this.snap_to_y : e.point.y,
        s = new Point(t, i);
    this.has_clicked ? e.point.getDistance(this.room.path.segments[0].point) < this.FREEHAND_SNAP_DISTANCE ? this.room.path.segments.length > 2 ? (this.room.path.closed = !0, this.has_clicked = !1, this.click_count = 0, this.free_line.remove(), null !== this.snap_indicator && (this.snap_indicator.remove(), this.snap_indicator = null), app.designer.rooms[this.room.id] = this.room, app.pub("designer_room_created", [this.room]), this.room = null, this.mode = null) : this.room.path.add(this.room.path.segments[0].point) : (this.free_line.remove(), 2 == this.click_count ? (this.room.path.insert(1, s), this.room.path.removeSegments(2, 6)) : this.room.path.add(s)) : (null !== this.room && (this.room.remove(), this.room = null), this.room = new app.Room({
        x: this.downpoint_x,
        y: this.downpoint_y,
        width: 1,
        height: 1
    }), this.room.path.insert(0, s), this.room.path.closed = !1, this.has_clicked = !0)
}, room_draw.cancel_free_draw = function() {
    null !== this.snap_indicator && (this.snap_indicator.remove(), this.snap_indicator = null), this.has_clicked = !1, this.click_count = 0, null !== this.room && this.room.remove(), this.free_line.remove(), this.room = null, this.mode = null
}, room_draw.on_deactivate = function(e) {
    "free" == this.mode && this.cancel_free_draw(), app.snap_manager.remove_lines(), this.is_drawing_room = !1, app.designer.reset_cursor("crosshair"), app.pub("tool_deactivate"), app.pub("tool_" + this.name + "_deactivate")
}, app.designer.tools[room_draw.name] = room_draw;
var lights_point = new(Tool.extend({
    name: "light.draw.point",
    capture_mouse: !1
}));
lights_point.on_activate = function(e) {
    app.designer.set_cursor("crosshair", !0), app.pub("tool_activate"), app.pub("tool_" + this.name + "_activate")
}, lights_point.onMouseUp = function(e) {
    if (!app.designer.active_room || !app.ui.create_panel_lights.selected_product) return void(app.designer.active_room || app.ui.show_tooltip("Lights must be placed inside a room", 3e3));
    var t = $.extend({}, app.ui.create_panel_lights.selected_product);
    t.x = e.point.x - 8, t.y = e.point.y - 8;
    var i = new app.Light(t);
    app.designer.active_room.add_asset(i), app.designer.active_room.circuit.show_connections(!0)
}, lights_point.on_deactivate = function(e) {
    app.designer.reset_cursor("crosshair"), app.pub("tool_deactivate"), app.pub("tool_" + this.name + "_deactivate")
}, app.designer.tools[lights_point.name] = lights_point;
var lights_grid = new(Tool.extend({
    name: "light.draw.grid",
    capture_mouse: !1,
    previous_width: null,
    previous_height: null,
    starting_room: null,
    guide: null,
    circuit: null,
    grid_color: "green"
}));
lights_grid.on_activate = function(e) {
    app.designer.set_cursor("crosshair", !0), app.pub("tool_activate"), app.pub("tool_" + this.name + "_activate")
}, lights_grid.onMouseDown = function(e) {
    return app.designer.active_room && app.ui.create_panel_lights.selected_product ? (this.previous_width = 1, this.previous_height = 1, this.guide = new Path.Rectangle(e.point.x, e.point.y, 1, 1), this.guide.strokeColor = this.grid_color, this.guide.strokeWidth = 2, this.starting_room = app.designer.active_room, void(this.capture_mouse = !0)) : void(app.designer.active_room || app.ui.show_tooltip("Lights must be placed inside a room", 3e3))
}, lights_grid.onMouseDrag = function(e) {
    if (this.guide && null !== this.previous_width) {
        var t = e.point.x - e.downPoint.x,
            i = e.point.y - e.downPoint.y,
            s = t / this.previous_width,
            n = i / this.previous_height;
        0 !== s && 0 !== n && (this.guide.scale(s, n, new Point(e.downPoint.x, e.downPoint.y)), this.previous_width = t, this.previous_height = i)
    }
}, lights_grid.onMouseUp = function(e) {
    this.guide && null !== this.previous_width && (this.guide.bounds.width < 10 || this.guide.bounds.height < 10 ? this.guide.remove() : this.starting_room.path.contains(e.point) ? (app.light_manager.draw_grid(this.starting_room, this.guide.getBounds()), this.guide.remove()) : (this.guide.remove(), this.starting_room.set_active(!1), app.ui.show_tooltip("Lights must be placed inside a room", 3e3)), this.previous_width = null, this.previous_height = null, this.starting_room = null, this.capture_mouse = !1)
}, lights_grid.on_deactivate = function(e) {
    app.designer.reset_cursor("crosshair"), app.pub("tool_deactivate"), app.pub("tool_" + this.name + "_deactivate")
}, app.designer.tools[lights_grid.name] = lights_grid;
var lights_string = new(Tool.extend({
    name: "light.draw.string",
    capture_mouse: !1,
    previous_width: null,
    previous_height: null,
    starting_room: null,
    guide: null,
    circuit: null
}));
lights_string.on_activate = function(e) {
    app.designer.set_cursor("crosshair", !0), app.pub("tool_activate"), app.pub("tool_" + this.name + "_activate")
}, lights_string.onMouseDown = function(e) {
    return app.designer.active_room && app.ui.create_panel_lights.selected_product ? (this.guide = new Path, this.guide.strokeColor = "009933", this.guide.strokeWidth = "3", this.guide.add(new Point(e.point.x, e.point.y)), this.guide.add(new Point(e.point.x, e.point.y)), this.starting_room = app.designer.active_room, void(this.capture_mouse = !0)) : void(app.designer.active_room || app.ui.show_tooltip("Lights must be placed inside a room", 3e3))
}, lights_string.onMouseDrag = function(e) {
    this.guide && (this.guide.lastSegment.point = e.point)
}, lights_string.onMouseUp = function(e) {
    this.guide && (this.starting_room ? this.starting_room.path.contains(e.point) ? (app.light_manager.draw_string(this.starting_room, this.guide), this.guide.remove()) : (this.guide.remove(), this.starting_room.set_active(!1), app.ui.show_tooltip("Lights must be placed inside a room", 3e3)) : this.guide.remove(), this.starting_room = null, this.capture_mouse = !1)
}, lights_string.on_deactivate = function(e) {
    app.designer.reset_cursor("crosshair"), app.pub("tool_deactivate"), app.pub("tool_" + this.name + "_deactivate")
}, app.designer.tools[lights_string.name] = lights_string;
var light_con = new(Tool.extend({
    name: "light.connect",
    guide: null,
    capture_mouse: !0,
    from_switch: null,
    to_switch: null,
    from_light: null,
    to_light: null,
    is_connecting_circuits: function() {
        return this.from_light && this.to_light && this.from_light.circuit !== this.to_light.circuit
    },
    is_connecting_primary_switch: function() {
        return this.from_switch && this.to_light
    },
    is_connecting_secondary_switch: function() {
        return this.from_switch && this.to_switch
    }
}));
light_con.on_activate = function(e) {
    app.designer.set_cursor("crosshair", !0), app.pub("tool_activate"), app.pub("tool_" + this.name + "_activate")
}, light_con.onMouseDown = function(e) {
    this.guide = new Path, this.guide.strokeColor = "009933", this.guide.strokeWidth = "3", this.guide.ignore_events = !0, this.guide.add(new Point(e.point.x, e.point.y)), this.guide.add(new Point(e.point.x, e.point.y))
}, light_con.onMouseDrag = function(e) {
    this.guide && (this.guide.lastSegment.point = {
        x: e.point.x - 4,
        y: e.point.y - 4
    })
}, light_con.onMouseUp = function(e) {
    if (this.guide) {
        if (this.guide.remove(), this.is_connecting_circuits()) this.from_light.circuit.merge(this.to_light.circuit);
        else if (this.is_connecting_primary_switch()) {
            var t = this.to_light.circuit.primary_switch;
            this.from_switch.remove_from_secondary_circuits(), this.to_light.circuit.remove_secondary_switches(), this.to_light.circuit.swap_primary_switch(this.from_switch), this.from_switch.add_circuit(this.to_light.circuit), t.remove_circuit(this.to_light.circuit), this.from_switch.redraw_all_circuits(), t.redraw_all_circuits()
        } else if (this.is_connecting_secondary_switch()) {
            if (this.from_switch.is_a_primary() && !this.to_switch.is_a_primary()) {
                var i = this.from_switch;
                this.from_switch = this.to_switch, this.to_switch = i
            }
            for (var s in this.to_switch.circuits) {
                var n = this.to_switch.circuits[s];
                n.primary_switch === this.to_switch && (this.from_switch.add_circuit(n), n.add_secondary_switch(this.from_switch))
            }
            this.to_switch.redraw_connections(), this.to_switch.redraw_all_circuits(), this.from_switch.redraw_all_circuits()
        }
        this.to_light && this.to_light.circuit.cancel_connection(), this.from_light && this.from_light.circuit.cancel_connection(), this.from_switch = null, this.to_switch = null, this.from_light = null, this.to_light = null
    }
}, light_con.on_deactivate = function(e) {
    app.designer.reset_cursor("crosshair"), app.pub("tool_deactivate"), app.pub("tool_" + this.name + "_deactivate")
}, app.designer.tools[light_con.name] = light_con;
var light_dis = new(Tool.extend({
    name: "light.disconnect",
    capture_mouse: !0
}));
light_dis.on_activate = function(e) {
    app.designer.set_cursor("no-drop", !0), app.pub("tool_activate"), app.pub("tool_" + this.name + "_activate")
}, light_dis.on_deactivate = function(e) {
    app.designer.reset_cursor("no-drop"), app.pub("tool_deactivate"), app.pub("tool_" + this.name + "_deactivate")
}, app.designer.tools[light_dis.name] = light_dis;
var view_pan = new(Tool.extend({
    name: "view.pan",
    capture_mouse: !0,
    previous_width: null,
    previous_height: null,
    room: null
}));
view_pan.on_activate = function() {
    app.designer.set_cursor("move"), app.pub("tool_activate"), app.pub("tool_" + this.name + "_activate")
}, view_pan.onMouseDrag = function(e) {
    var t = e.delta;
    t.x = 0 - t.x / 2, t.y = 0 - t.y / 2, paper.view.scrollBy(t)
}, view_pan.on_deactivate = function() {
    app.designer.reset_cursor(), app.pub("tool_deactivate"), app.pub("tool_" + this.name + "_deactivate")
}, app.designer.tools[view_pan.name] = view_pan;
var asset_rotate = new(Tool.extend({
    name: "asset.rotate",
    capture_mouse: !0,
    asset: null,
    step: 0,
    default_step: 5
}));
asset_rotate.on_activate = function(e) {
    this.asset = e.asset, this.last_degree = 0, this.asset.hide_controls(), this.center_x = this.asset.path.bounds.getCenterX(), this.center_y = this.asset.path.bounds.getCenterY(), this.step = void 0 !== this.asset.rotation_step ? this.asset.rotation_step : this.default_step, app.designer.set_cursor("rotate"), app.pub("tool_activate"), app.pub("tool_" + this.name + "_activate")
}, asset_rotate.onMouseDrag = function(e) {
    var t = Math.atan2(e.point.x - this.center_x, e.point.y - this.center_y);
    if (this.degree = t * (180 / Math.PI) * -1 + 90, this.degree = Math.round(this.degree / this.step) * this.step, this.degree != this.last_degree) {
        var i = this.degree - this.last_degree;
        this.asset.rotate_by(i), this.last_degree = this.degree
    }
}, asset_rotate.onMouseUp = function(e) {
    app.designer.reset_cursor(), app.designer.deactivate_tool("asset.rotate"), this.asset.group && this.asset.group.on_finish_rotate(), this.asset.path.contains(e.point) ? this.asset.show_controls() : (this.asset.unselect(), this.asset.set_active(!1)), this.asset.lock_to_room(), this.asset = null, app.designer.ignore_tool_mouseup = !0
}, asset_rotate.on_deactivate = function(e) {
    app.pub("tool_deactivate"), app.pub("tool_" + this.name + "_deactivate")
}, app.designer.tools[asset_rotate.name] = asset_rotate;
var asset_erase = new(Tool.extend({
    name: "asset.erase",
    capture_mouse: !1,
    previous_width: null,
    previous_height: null,
    room: null
}));
asset_erase.on_activate = function() {
        app.designer.set_cursor("crosshair", !0), app.pub("tool_activate"), app.pub("tool_" + this.name + "_activate")
    }, asset_erase.onMouseMove = function(e) {
        app.designer.active_asset && (app.designer.active_asset.path.style.strokeColor = "red", app.designer.active_asset.path.style.strokeWidth = 2)
    }, asset_erase.onMouseUp = function(e) {
        app.designer.active_asset && (app.designer.active_asset.group ? (app.designer.active_asset.remove(!0, !0), app.designer.active_asset.circuit.redraw_connections()) : app.designer.active_asset.remove())
    }, asset_erase.on_deactivate = function() {
        app.designer.reset_cursor("crosshair"), app.pub("tool_deactivate"), app.pub("tool_" + this.name + "_deactivate")
    app.designer.data_manager = {
        "export": function(e, t, i) {
            t = "undefined" == typeof t ? !0 : t, i = "undefined" == typeof i ? !0 : i;
            var s;
            if (e) {
                var n = app.designer.selected;
                if (null !== app.designer.selected && app.designer.clear_selected(), s = app.designer.get_image(10, t, i), s === !1) return app.show_tooltip("Error, empty project. Add rooms, furniture and lights before exporting image"), !1;
                null !== n && n.set_selected(!0)
            }
            var o = app.designer.get_total_wire_length(),
                r = o + o / 100 * 10,
                a = {
                    background: app.designer.export_background_img(),
                    recommended_lumens: app.designer.recommended_lumens,
                    recommended_lux: app.designer.recommended_lux,
                    recommended_workplane_lux: app.designer.recommended_workplane_lux,
                    recommended_wattage_sqm: app.designer.recommended_wattage_sqm,
                    reached_lumens: app.designer.reached_lumens,
                    reached_lux: app.designer.reached_lux,
                    reached_workplane_lux: app.designer.reached_workplane_lux,
                    reached_wattage: app.designer.reached_wattage,
                    reached_wattage_sqm: app.designer.reached_wattage_sqm,
                    circuits: app.designer.export_circuits(),
                    light_groups: app.designer.export_light_groups(),
                    rooms: app.designer.export_rooms(),
                    room_scale: app.designer.room_scale,
                    wire_length: o,
                    wire_length_adjusted: r,
                    square_metres: app.designer.square_meters,
                    json_version: app.json_version,
                    project_notes: app.project_notes
                };
            return e && (a.image = s, app.designer.populate_notes(), a.notes = app.designer.notes), a
        },
        get_image: function(e, t, i) {
            t = "undefined" == typeof t ? !0 : t, i = "undefined" == typeof i ? !0 : i;
            var s = app.designer.get_image(10, t, i);
            return s === !1 ? (app.ui.show_tooltip("Error, empty project. Add rooms, furniture and lights before exporting image"), !1) : s
        }
    }, app.health_check = {
        element: null,
        dialog: null,
        results: null,
        mode: null,
        show: function() {
            this.element = $("#healthcheck"), this.dialog = this.element.dialog({
                title: "Designer Health Check",
                width: 500,
                height: 500,
                modal: !0,
                buttons: {
                    "Run check": function() {
                        app.health_check.check()
                    },
                    "Attempt to fix issues": function() {
                        app.health_check.fix()
                    },
                    Close: function() {
                        $(this).dialog("close")
                    }
                }
            }), this.element.find("textarea").val("Press 'Run check' below to look for potential issues...")
        },
        check: function() {
            this.mode = "check", this.results = [], this.check_rooms(), this.show_results()
        },
        fix: function() {
            app.designer.active_room.set_active(!1), this.mode = "fix", this.results = [], this.check_rooms(), app.designer.draw_circuits(), this.show_results()
        },
        show_results: function() {
            var e = "";
            if (e += "check" === this.mode ? "Health Check Results:\n" : "Health Check Fix Results:\n", e += "---------------------------------------------------------\n", this.results.length > 0) {
                var t = _.map(this.results, function(e) {
                    return "- " + e
                });
                e += t.join("\n"), e += "\n\n", "check" === this.mode ? e += this.results.length + " possible issues found\n" : (e += this.results.length / 2 + " possible issues fixed\n", e += "Please confirm issues are resolved and save the Project.\n")
            } else e += "No issues detected.\n";
            this.element.find("textarea").val(e)
        },
        check_rooms: function() {
            for (var e in app.designer.rooms) {
                var t = app.designer.rooms[e];
                for (var i in t.assets) this.check_within_room_bounds(t, t.assets[i])
            }
        },
        check_within_room_bounds: function(e, t) {
            t.is_in_room() || (this.results.push("Asset type " + t.type + " with id " + t.id + " is outside of room bounds"), "fix" === this.mode && (t.move(e.path.bounds.center.x, e.path.bounds.center.y), this.results.push("Fixed - moved to center of containing room")))
        }
    };