/**
 * app.ui.menu_bar
 * Menubar widget (new, load, save etc)
 *
 */
app.ui.menu_bar = {
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
	opacity: 0.5,

	init: function() {
		this.element = $('#menu_bar');
		this.new_button = this.element.find('#menu_new');
		this.load_button = this.element.find('#menu_load');
		this.save_button = this.element.find('#menu_save');
		this.export_button = this.element.find('#menu_export');
		this.share_button = this.element.find('#menu_share');
		this.select_button = this.element.find('#menu_select');
		this.zoomin_button = this.element.find('#menu_zoomin');
		this.zoomout_button = this.element.find('#menu_zoomout');
		this.pan_button = this.element.find('#menu_pan');
		this.fit_button = this.element.find('#menu_fit');
		this.eraser_button = this.element.find('#menu_eraser');
		this.help_button = this.element.find('#menu_help');
		this.spaces_select_container = $('#space_selector_container');
		this.spaces_select = $('#space_selector');
		this.opacity_button = this.element.find('#menu_opacity');

		this.opacity_button.find('#opacity_slider').slider({
			min: 0,
			max: 1,
			step: 0.05,
			value: this.opacity,
			disabled: true,
			create: function() {
				$(this).find('a').html('<span />').find('span').html((app.ui.menu_bar.opacity * 100) + '%');
			},
			slide: function(e, ui) {
				app.ui.menu_bar.opacity = ui.value;
				app.pub('opacity_slider_changed');
			}
		});

		this.bind_events();
	},

	bind_events: function() {
		app.sub('design_selected', this.on_design_selected, this);
		app.sub('area_created', this.on_area_created, this);
		app.sub('area_name_updated', this.on_area_name_updated, this);
		app.sub('opacity_slider_changed', this.on_opacity_slider_change, this);

		app.sub('tool_activate', this.on_tool_activate, this);
		app.sub('tool_deactivate', this.on_tool_deactivate, this);

		this.new_button.click($.proxy(this.on_new_click, this));
		this.load_button.click($.proxy(this.on_load_click, this));
		this.save_button.click($.proxy(this.on_save_click, this));
		this.export_button.click($.proxy(this.on_export_click, this));
		this.share_button.click($.proxy(this.on_share_click, this));

		this.select_button.click($.proxy(this.on_select_click, this));
		this.zoomin_button.click($.proxy(this.on_zoomin_click, this));
		this.zoomout_button.click($.proxy(this.on_zoomout_click, this));
		this.pan_button.click($.proxy(this.on_pan_click, this));
		this.fit_button.click($.proxy(this.on_fit_click, this));
		this.eraser_button.click($.proxy(this.on_eraser_click, this));

		this.help_button.click($.proxy(this.on_help_click, this));

		this.spaces_select.focus($.proxy(this.on_spaces_select_click, this));
		//console.log(this.spaces_select);
	},

	enable: function() {
		this.save_button.removeClass('disabled');
		this.export_button.removeClass('disabled');
		this.select_button.removeClass('disabled');
		this.zoomin_button.removeClass('disabled');
		this.zoomout_button.removeClass('disabled');
		this.pan_button.removeClass('disabled');
		this.fit_button.removeClass('disabled');
		this.eraser_button.removeClass('disabled');
		this.opacity_button.removeClass('disabled').find('#opacity_slider').slider({
            disabled: false
        });

		this.select_button.click();
	},

	on_tool_activate: function() {
		this.select_button.removeClass('active');
	},

	on_tool_deactivate: function() {
		this.select_button.addClass('active');
	},

	on_new_click: function() {
		app.designer.deactivate_tool();
		app.ui.new_project.show(false, true);
	},

	on_load_click: function() {
		app.designer.deactivate_tool();
		app.ui.open_project.show();
	},

	on_save_click: function() {
		app.designer.deactivate_tool();
		app.project_manager.save_project();
	},

	on_export_click: function() {
		app.designer.deactivate_tool();
		app.ui.export_dialog.show();
	},

	on_share_click: function() {
        app.designer.deactivate_tool();
        app.ui.share_dialog.show();
	},

	on_select_click: function() {
		app.designer.deactivate_tool();
	},

	on_zoomin_click: function() {
		app.designer.zoom_in();
	},

	on_zoomout_click: function() {
		app.designer.zoom_out();
	},

	on_pan_click: function() {
		app.designer.toggle_tool('view.pan');
	},

	on_fit_click: function() {
		app.designer.zoom_to_fit();
	},

	on_eraser_click: function() {
		app.designer.toggle_tool('asset.erase');
	},

	on_help_click: function() {
		app.ui.help.show();
	},

	on_design_selected: function(e, project, design) {
		app.designer.deactivate_tool();
		this.enable();
		this.spaces_select_container.show();
		this.refresh_space_selector(design);
		this.spaces_select.change($.proxy(this.on_space_selector_change, this));

		app.project_manager.select_area(design.areas[0]);
	},

	//Added by Chris Rickard
	on_spaces_select_click: function() {
		if (app.designer.active_tool && app.designer.active_tool.cancel_free_draw) {
			app.designer.active_tool.cancel_free_draw();
			app.ui.draw();
		}

	},

	//this is a little helper function to perfomr any actions that need
	//to be performed on the click of any of the toolbar buttons
	/*on_before_item_clicked: function() {
		app.designer.deactivate_tool();
	},*/


	/**
	 * Spaces selector
	 */

	refresh_space_selector: function(design) {
		this.spaces_select.find('option').remove();
		for (var i = 0; i < design.areas.length; i++) {
			var area = design.areas[i];
			this.spaces_select.append(new Option(area.title, area.id, true, true));
		}

		this.spaces_select.append(new Option('Add new space...', 'new', true, true));

		if (app.project_manager.selected_area) {
			this.spaces_select.prop("value", app.project_manager.selected_area.id);
		}
	},

	on_space_selector_change: function() {
		app.designer.deactivate_tool();
		var area_id = this.spaces_select.val();

		if (area_id !== 'new') {
			var area = app.project_manager.find_area_by_id(area_id);
			app.project_manager.select_area(area);

		} else {
			app.ui.add_area.show(false, false);

			if (app.project_manager.selected_area) {
				this.spaces_select.prop("value", app.project_manager.selected_area.id);
			}
		}
	},

	on_area_created: function(e, area) {
		app.designer.deactivate_tool();
		if (app.project_manager.selected_design) {
			this.refresh_space_selector(app.project_manager.selected_design);
		}
	},

	on_area_name_updated: function() {
		this.refresh_space_selector(app.project_manager.selected_design);
	},
	
	on_opacity_slider_change: function() {
		this.opacity_button.find('a span').html( Math.round(app.ui.menu_bar.opacity * 100) + '%');
		app.designer.set_opacity(app.ui.menu_bar.opacity);
	}
};