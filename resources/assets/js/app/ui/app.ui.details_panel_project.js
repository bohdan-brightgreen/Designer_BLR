/**
 * app.ui.details_panel_project
 * Opens the project details panel
 *
 */
app.ui.details_panel_project = {
	element: null,
	should_display: false,

	init: function() {
		this.element = $('#project_details_panel');

		this.bind_events();
	},

	bind_events: function() {
		// app.sub('add_mode_change', this.on_add_mode_change, this);
		// app.sub('designer_room_unselected', this.on_room_unselected, this);
		// app.sub('designer_room_selected', this.on_room_selected, this);
		// app.sub('designer_base_asset_selected', this.on_base_asset_selected, this);
		// app.sub('designer_base_asset_unselected', this.on_base_asset_unselected, this);
		app.sub('area_selected', this.on_area_selected, this);
		app.sub('design_selected', this.init_panel, this);

		$(document.body).on('keyup', '#area_name', $.proxy(this.on_area_name_change, this));
		$(document.body).on('keyup', '#project_name', $.proxy(this.on_project_name_change, this));
		$(document.body).on('change', '#project_type', $.proxy(this.on_project_type_change, this));
	},

	on_add_mode_change: function(e, mode) {
		//don't show if in light mode
		if (mode !== 'lights') {
			this.should_display = true;

			if (!app.designer.selected) {
				this.show();
			}

		} else {
			this.should_display = false;
			this.hide();
		}
	},

	on_area_selected: function(e, area, area_index) {
		$('#area_name').val(app.project_manager.selected_area.title);
	},

	on_area_name_change: function(e) {
		app.project_manager.selected_area.title = $('#area_name').val();
		app.pub('area_name_updated', app.project_manager.selected_area);
	},

	on_project_name_change: function(e) {
		app.project_manager.selected_project.title = $('#project_name').val();
	},

	on_project_type_change: function(e) {
		app.project_manager.selected_project.property_type = $('#project_type').val();
	},

	/*on_room_unselected: function(e, room) {
		this.room = null;
		this.show();
	},*/

	/*on_room_selected: function(e, room) {
		this.room = room;
		this.hide();
	},*/

	/*on_base_asset_selected: function(e, base_asset) {
		this.hide();
	},*/

	/*on_base_asset_unselected: function(e, base_asset) {
		this.show();
	},*/

	init_panel: function() {
        $('#project_name').val(app.project_manager.selected_project.title);
        $('#project_type').val(app.project_manager.selected_project.property_type);

		if (app.project_manager.selected_area) {
            $('#area_name').val(app.project_manager.selected_area.title);
		}
	},

	/*on_dialog_collapse_click: function() {
		this.dialog.parent().find('.ui-dialog-content').toggle();
	},*/

	show: function() {
		if (!this._has_initted_panel) {
			this.init_panel();
			this._has_initted_panel = true;
		}

		this.element.show();
	},

	hide: function() {
		this.element.hide();
	},

	get_dialog_position: function() {
		var designer_pos = app.designer.element.offset(),
		    designer_width = app.designer.element.width();

		return [
			designer_width - 310,
			//designer_pos.top + 8
            designer_pos.top
		];
	}
};