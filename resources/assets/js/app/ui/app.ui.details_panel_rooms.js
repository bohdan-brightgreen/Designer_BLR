/**
 * app.ui.room_settings
 * Opens the room settings dialog
 *
 */
app.ui.details_panel_rooms = {
	element: null,
	dialog: null,
	room: null,
	should_display: false,
	element_wall_length: null,
	element_wall_slider: null,
	element_room_type: null,
	element_room_name: null,
	element_color_temp: null,
	element_reflectivity: null,

	init: function() {
		this.element = $('#room_details_panel');
		this.bind_events();
	},

	bind_events: function() {
        app.sub('first_room_created', this.first_room_created, this);

		$(document.body).on('change', '#room_type', $.proxy(this.room_settings_type_change, this));
		$(document.body).on('keyup', '#room_name', $.proxy(this.room_settings_name_change, this));
		$(document.body).on('change', '#color_temp', $.proxy(this.room_settings_colour_temp_change, this));
		$(document.body).on('change', '#reflectivity', $.proxy(this.room_settings_reflectivity_change, this));
		$(document.body).on('change', '#wall_length', $.proxy(this.room_settings_wall_length_change, this));

		$(document.body).on('mouseover', '#wall_length_slider_container', $.proxy(this.show_wall_line, this));
		$(document.body).on('mouseout', '#wall_length_slider_container', $.proxy(this.hide_wall_line, this));

        $(document.body).on('webkitAnimationEnd mozAnimationEnd', '#wall_length_slider', $.proxy(this.reset_slider_animation, this));
	},

	on_add_mode_change: function(e, mode) {
		//don't show if in light mode
		if (mode !== 'lights') {
			this.should_display = true;

			if (this.room) {
				this.show();
			}

		} else {
			this.should_display = false;
			this.hide();
		}
	},

	/*on_room_created: function(e, room) {
		this.room = room;

		if (this.should_display) {
			this.show();
			this.set_room_values();
		}
	},*/

	init_panel: function() {
		this.element.show();
		this.element_wall_length = $('#wall_length');
		this.element_wall_slider = $('#wall_length_slider');
		this.element_room_type = $('#room_type');
		this.element_room_name = $('#room_name');
		this.element_color_temp = $('#color_temp');
		this.element_reflectivity = $('#reflectivity');

		this.element_wall_slider.slider({
			min: parseInt(this.element_wall_length.attr('min'), 10),
			max: 15,
			step: 0.1,
			range: "min",
			value: this.element_wall_length.val(),
			slide: $.proxy(function(event, ui) {
				this.element_wall_length.val(ui.value);
				this.element_wall_length.change();
			}, this)
		});

		//var buttons = { };
		this.element.hide();
	},

	refresh: function() {
		this.element_room_type.empty();

		var room_types = (app.project_manager.selected_project.property_type == "Residential") ? app.RoomTypes.Residential : app.RoomTypes.Commercial;
		for (var prop in room_types) {
			this.element_room_type.append('<option>' + prop + '</prop>');
		}

		if (this.room.type !== null) {
			this.element_room_type.val(this.room.type);
		}

		if (this.room.display_name !== null) {
			this.element_room_name.val(this.room.display_name);
		}

		if (this.room.color_temp !== null) {
			this.element_color_temp.val(this.room.color_temp);
		}

		if (this.room.reflectivity !== null) {
			this.element_reflectivity.val(this.room.reflectivity);
		}

		if (app.designer.room_scale !== null) {
			this.element_wall_length.val(this.room.get_room_length() + '');

		} else {
			this.element_wall_length.val("3.0");
			this.element_wall_length.change();
		}

		this.element_wall_slider.slider('value', this.element_wall_length.val());
	},

	show: function() {
		if (this.room) {
			if (!this._has_initted_panel) {
				this.init_panel();
				this._has_initted_panel = true;
			}

			this.refresh();
			this.element.show();
		}
	},

	hide: function() {
		if (this.dialog && this.dialog.is(':visible')) {
			this.element.hide();
		}
	},

	room_settings_type_change: function(e) {
		var room_type_value = $('#room_type').val();
		this.room.type = room_type_value;

        $('#room_name').val(room_type_value);
        this.room_settings_name_change(e);

		this.room.refresh_recommended();
	},

	room_settings_name_change: function(e) {
		this.room.display_name = $('#room_name').val();
	},

	room_settings_colour_temp_change: function(e) {
		this.room.color_temp = $('#color_temp').val();
		this.room.refresh_recommended();
	},

	room_settings_reflectivity_change: function(e) {
		this.room.reflectivity = $('#reflectivity').val();
		this.room.refresh_recommended();
	},

	show_wall_line: function() {
		this.room.show_wall_line();
	},

	hide_wall_line: function() {
		this.room.hide_wall_line();
	},

	room_settings_wall_length_change: function(e) {
		var wall_length = $('#wall_length').val();

		this.room.wall_length = wall_length;
		$('#wall_length_slider').slider('value', wall_length);
		this.room.preview_scale();
		if (wall_length) {
			//if the current room scale doesn't match the global..
			var room_scale = Math.round((this.room.path.bounds.height / this.room.wall_length) * 100) / 100;

			app.designer.set_room_scale(room_scale);
			app.designer.refresh_asset_scale();
			this.room.refresh_recommended();
		}
	},

    first_room_created: function() {
        this.element_wall_slider.css({
            'webkitAnimationPlayState': 'running',
            'mozAnimationPlayState': 'running'
        });
    },

    reset_slider_animation: function() {
        this.element_wall_slider.css({
            'webkitAnimationPlayState': 'paused',
            'mozAnimationPlayState': 'paused'
        });
    }

	/*validate_room: function() {
		if(!this.room.display_name) {
			alert('The room name is required');
			return false;
		}
		if(!this.room.type) {
			alert('The room type is required');
			return false;
		}
		if(!this.room.color_temp) {
			alert('The colour temperature is required');
			return false;
		}
		if(!this.room.reflectivity) {
			alert('The colour reflectivity is required');
			return false;
		}

		return true;
	},*/

	//this sets the values when a room is newly created
	/*set_room_values: function() {
		this.room.display_name = this.element_room_name.val();
		this.room.type = this.element_room_type.val();
		this.room.color_temp = this.element_color_temp.val();
		this.room.reflectivity = this.element_reflectivity.val();
		this.room.wall_length = this.element_wall_length.val();
	}*/
};