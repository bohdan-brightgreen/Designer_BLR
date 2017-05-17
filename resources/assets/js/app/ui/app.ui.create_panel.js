/**
 * app.ui.create_panel
 * Create panel widget (create room, add furniture, lighting design)
 *
 */
app.ui.create_panel = {
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
		this.element = $('#create_panel');
		this.tabs_element = $('#create_panel_tabs');
		this.rooms_tab = this.tabs_element.find('#add_rooms');
		this.furniture_tab = this.tabs_element.find('#add_furniture');
		this.lights_tab = this.tabs_element.find('#add_lights');
		this.rooms_panel = $('#add_rooms_panel');
		this.furniture_panel = $('#add_furniture_panel');
		this.lights_panel = $('#add_lights_panel');

		this.bind_events();

		app.ui.create_panel_rooms.init();
		app.ui.create_panel_furniture.init();
		app.ui.create_panel_lights.init();
	},

	bind_events: function() {
		app.sub('design_selected', this.show, this);
		app.sub('designer_light_selected', this.on_designer_light_selected, this);

		this.element.find('#add_rooms').click($.proxy(this.on_add_room_click, this));
		this.element.find('#add_furniture').click($.proxy(this.on_add_furniture_click, this));
		this.element.find('#add_lights').click($.proxy(this.on_add_lights, this));
	},

	init_dialog: function() {
		//this.dialog_collapse_button = $('<a href="javascript:void(0);" class="ui-dialog-button-collapse"><span class="ui-icon"></span></a>');
        this.dialog_collapse_button = $('<a href="javascript:void(0);" class="ui-dialog-button-collapse"></a>');
		this.dialog_collapse_button.click($.proxy(this.on_dialog_collapse_click, this));

		this.dialog = this.element.dialog({
			title: 'Create',
			width: 330,
			height: "auto",
			maxHeight: 400,
			modal: false,
			dialogClass: 'dialog_grey dialog_create',
			resizable: false,
			draggable: true,
			position: this.get_dialog_position(),
			buttons: [],
			open: function() {
				var max_height = ($(window).height() - $(this).offset().top - 20);
				$(this).css("maxHeight", max_height);
				var close_button = $(this).parent().find(".ui-dialog-titlebar-close");
				app.ui.create_panel.dialog_collapse_button.insertBefore(close_button);
				close_button.hide();
			}
		});

		//move tabs out...
		this.dialog.parents('.ui-dialog').prepend(this.tabs_element);

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

	show: function() {
		if (!this.dialog) {
			this.init_dialog();
		}

		this.dialog.dialog("open");
		this.show_rooms();
	},

	set_title: function(title) {
		this.dialog.parent().find('.ui-dialog-title').html(title);
	},

	show_panel: function() {
		this.element.find(".create_panel").hide();

		if (this.current_mode == 'rooms') {
			app.ui.create_panel_rooms.show();

		} else if (this.current_mode == 'furniture') {
			app.ui.create_panel_furniture.show();

		} else if (this.current_mode == 'lights') {
			app.ui.create_panel_lights.show();
		}

		app.pub('add_mode_change', [this.current_mode]);
	},

	show_rooms: function(from_click) {
		if (!from_click)  {
			this.rooms_tab.click();

		} else {
			this.set_title('Step 1. Add Rooms');
			this.current_mode = 'rooms';
			this.show_panel();
		}
	},

	show_furniture: function(from_click) {
		if (!from_click)  {
			this.furniture_tab.click();

		} else {
			this.set_title('Step 2. Add Furniture');
			this.current_mode = 'furniture';
			this.show_panel();
		}
	},

	show_lights: function(from_click) {
		if (!from_click)  {
			this.lights_tab.click();

		} else {
			this.set_title('Step 3. Lighting Design');
			this.current_mode = 'lights';
			this.show_panel();
		}
	},

	on_add_room_click: function() {
		this.show_rooms(true);
	},

	on_add_furniture_click: function() {
		this.show_furniture(true);
	},

	on_add_lights: function() {
		this.show_lights(true);
	},

	on_designer_light_selected: function() {
		this.show_lights();
	},

	get_dialog_position: function() {
		return [0, 140];
	},

	stick_to_screen: function() {
		if ($(this.dialog.parents('.ui-dialog')).is(':visible')) {
			var position = this.get_dialog_position();
			$(this.dialog).dialog("option", "position", position);
		}
	}
};