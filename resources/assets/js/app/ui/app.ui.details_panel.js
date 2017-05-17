/**
 * app.ui.details_panel
 * Details panel widget (right hand side)
 *
 */
app.ui.details_panel = {
	dialog: null,
	is_dialog_collapsed: null,
	dialog_collapse_button: null,
	element: null,
	current_mode: null,
	current_base_asset: null,

	init: function() {
		this.element = $('#details_panel');
		this.is_dialog_collapsed = false;

		app.ui.details_panel_project.init();
		app.ui.details_panel_rooms.init();
		app.ui.details_panel_lights.init();

		this.bind_events();
	},

	bind_events: function() {
		app.sub('design_selected', this.show, this);
		app.sub('add_mode_change', this.on_add_mode_change, this);
		app.sub('designer_base_asset_selected', this.on_base_asset_selected, this);
		app.sub('designer_base_asset_unselected', this.on_base_asset_unselected, this);
		app.sub('designer_room_created', this.on_room_created, this);
		app.sub('tool_room.draw_deactivate', this.on_room_draw_deactivate, this);

		app.sub('room_details_click', this.on_room_details_click, this);
	},

	init_dialog: function() {
		//this.dialog_collapse_button = $('<a href="javascript:void(0);" class="ui-dialog-button-collapse"><span class="ui-icon"></span></a>');
        this.dialog_collapse_button = $('<a href="javascript:void(0);" class="ui-dialog-button-collapse"></a>');
		this.dialog_collapse_button.click($.proxy(this.on_dialog_collapse_click, this));

		this.dialog = this.element.dialog({
			title: 'Details',
			width: 330,
			height: "auto",
			maxHeight: 400,
			modal: false,
			dialogClass: 'dialog_grey dialog_details',
			resizable: false,
			draggable: true,
			position: this.get_dialog_position(),
			buttons: [],
			open: function() {
				var max_height = ($(window).height() - $(this).offset().top - 20);
				$(this).css("maxHeight", max_height);
				var close_button = $(this).parent().find(".ui-dialog-titlebar-close");
				app.ui.details_panel.dialog_collapse_button.insertBefore(close_button);
				close_button.hide();
			}
		});

		//stick to screen on window resize...
		$(window).resize($.proxy(this.stick_to_screen, this));
	},

	on_dialog_collapse_click: function() {
		this.element.toggle();
		this.is_dialog_collapsed = !this.is_dialog_collapsed;

		var dialog_parent = this.dialog.parents('.ui-dialog');
		if (this.is_dialog_collapsed) {
			dialog_parent.addClass('ui-dialog-collapsed');

		} else {
			dialog_parent.removeClass('ui-dialog-collapsed');
		}
	},

	on_add_mode_change: function(e, mode) {
		this.current_mode = mode;

		if (this.current_base_asset) {
			this.show_for_asset(this.current_base_asset);

		} else if (this.dialog) {
			this.show_project();
		}
	},

	show: function() {
		if (!this.dialog) {
			this.init_dialog();
		}

		this.dialog.dialog("open");
		this.show_project();
	},

	set_title: function(title) {
		this.dialog.parent().find('.ui-dialog-title').html(title);
	},

	show_panel: function() {
		this.element.find(".details_panel").hide();

		if (this.current_mode == 'project') {
			app.ui.details_panel_project.show();

		} else if (this.current_mode == 'room') {
			app.ui.details_panel_rooms.show();

		} else if (this.current_mode == 'lights') {
			app.ui.details_panel_lights.show();
		}
	},

	show_project: function() {
		if (this.current_mode === 'lights') {
			this.show_lighting();

		} else {
			this.set_title('Project Details');
			this.current_mode = 'project';
			this.show_panel();
		}
	},

	show_room: function(force_details) {
		if (this.current_mode === 'lights' && !force_details) {
			this.show_lighting();

		} else {
			this.set_title('Room Details');
			this.current_mode = 'room';
			this.show_panel();
		}
	},

	show_lighting: function(from_click) {
		this.set_title('Lighting Details');
		this.current_mode = 'lights';
		this.show_panel();
	},

	show_for_asset: function(asset) {
		//if light group, return (as light gets selected also)
		if (asset instanceof app.LightGroup) {
			return;
		}

		if (asset instanceof app.Room) {
			//if it is a room...
			this.set_room(asset);

		} else if (asset.room) {
			//if it has a room...
			this.set_room(asset.room);
		}

		if (asset instanceof app.Light) {
			this.show_lighting();

		} else {
			//not light (asset or room)
			this.show_room();
		}
	},

	on_base_asset_selected: function(e, base_asset) {
		this.current_base_asset = base_asset;
		this.show_for_asset(base_asset);
	},

	on_base_asset_unselected: function() {
		this.current_base_asset = null;
		this.set_room(null);
		this.show_project();
	},

	set_room: function(room) {
		app.ui.details_panel_rooms.room = room;
		app.ui.details_panel_lights.room = room;
	},

	on_room_created: function(e, room) {
		this.current_base_asset = room;
		this.show_for_asset(room);

        app.ui.show_tooltip('Please fill in room details', 5000);

        if (_.size(app.designer.rooms) == 1) {
            app.pub('first_room_created');
        }
	},

	on_room_draw_deactivate: function() {
		this.current_base_asset = null;
		this.set_room(null);
		this.show_project();
	},

	on_room_details_click: function() {
		//from the right room controls panel in light mode
		this.show_room( !this.element.find('#room_details_panel').is(':visible') );

		//rever back to light mode
		this.current_mode = 'lights';
	},

	get_dialog_position: function() {
		var designer_pos = app.designer.element.offset();
		var designer_width = app.designer.element.width();
		return [
			designer_width - 310,
            //designer_pos.top + 8
            designer_pos.top
		];
	},

	stick_to_screen: function() {
		if ($(this.dialog.parents('.ui-dialog')).is(':visible')) {
			var position = this.get_dialog_position();
			$(this.dialog).dialog( "option", "position", position);
		}
	}
};