/**
 *	Class app.LightGroup
 * Represents a collection of one or more lights. A group can be rotated, type changed,
 * deleted or individual lights removed.
 *
 */
 app.LightGroup = app.ResizableAsset.extend({
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
		strokeColor: '#cccccc',
		strokeAlpha: 1
	},

	active_style: {
		strokeColor: '#cccccc',
		strokeAlpha: 1
	},

	handle_color: 'black',
	handle_active_color: app.colours.main,
	
	temperature_colors: {
		'3K': '#faaf3a',
		'5K': '#3ea9f5'
	},

	rows: null,
	cols: null,
	spacingx: null,
	spacingy: null,

	init: function(data) {
        // IF data = paper.path
		if (data && data.id) {
			this.id = data.id;
			this.is_loaded = true;

		} else {
			//new id...
			this.id = generate_guid();
		}

		this.type = data.type;
		this.rows = (data.rows || null);
		this.cols = (data.cols || null);
		this.previous_rows = (data.rows || null);
		this.previous_cols = (data.cols || null);
		this.spacingx = (data.spacingx || null);
		this.spacingy = (data.spacingy || null);

		this.lights = {};
	},

	move: function(x, y, drag_light) {
        this.hide_outline();
		this.hide_handles();

		if (this.move_start_x === null && this.move_start_x === null) {
			this.move_start_x = drag_light.path.position.x;
			this.move_start_y = drag_light.path.position.y;
		}

		var delta = {
			x: (x - drag_light.path.position.x),
			y: (y - drag_light.path.position.y)
		};

		//if string of wall lights (stick to walls...)
		if (drag_light.is_wall_light && this.type === 'string') {
			//check result for stickyness (if obj returned - string has stuck)
			if (this.move_sticky_string(x, y, drag_light, delta)) {
				return;
			}
		}

		for (var i in this.lights) {
			var light = this.lights[i],
			    new_x = (light.path.position.x + delta.x),
			    new_y = (light.path.position.y + delta.y);

			light.move(new_x, new_y, true);
		}
	},

	move_sticky_string: function(x, y, drag_light, delta) {
        var sticky_xy = drag_light.get_stick_to_xy(app.designer.active_room, x, y),
		    sticky_x = sticky_xy[0],
		    sticky_y = sticky_xy[1],
		    sticky_rotate = sticky_xy[2],
		    stick_vertically = (x !== sticky_x),
		    stick_horizontally = (y !== sticky_y);

		//if not at a sticky point...
		if (!stick_vertically && !stick_horizontally) {
			return false;
		}

		//is this group more horiz, or vert?
		var orientation = this.get_best_orientation();

		//if in a horizontal position, but attempting to stick vertically
		if ((orientation === 'horizontal' && stick_vertically) || (orientation === 'vertical' && stick_horizontally)) {
			return false;
		}

		//line all lights up on the y axis
		for (var i in this.lights) {
			var light = this.lights[i],
			    light_x,
                light_y;

			//if horizontal...
			if (orientation === 'horizontal') {
				light_x = (delta.x + app.designer.drag_offset.x);
				light_y = (sticky_y - light.path.position.y);

			} else {
				//else vertical...
				light_x = (sticky_x - light.path.position.x);
				light_y = (delta.y + ((light.height / 2) + app.designer.drag_offset.y));
			}

			light.move_by({
				x: light_x,
				y: light_y
			});

			if (sticky_rotate != -1) {
				light.set_rotation(sticky_rotate, true);
			}
		}

		this.refresh_outline();
		return true;
	},

	get_best_orientation: function() {
        //is this string closer to vertical or horizontal?
		var start_point = this.path.segments[0].point,
		    end_point = this.path.segments[1].point,
		    diff = {
			    x: Math.abs(start_point.x - end_point.x),
			    y: Math.abs(start_point.y - end_point.y)
		    };

		return (diff.y > diff.x) ? 'vertical' : 'horizontal';
	},

	is_straight_line: function() {
        if (!this.path) {
			return false;
		}

		var start_point = this.path.segments[0].point,
		    end_point = this.path.segments[1].point;

		return (
			Math.round(start_point.x) === Math.round(end_point.x) ||
			Math.round(start_point.y) === Math.round(end_point.y)
		);
	},

	move_by: function(delta) {
        for (var i in this.lights) {
			this.lights[i].move_by(delta);
		}

		this.path.translate(delta);
	},

	move_finish: function(drag_light) {
        //set sticky wall to all...
		if (this.type === 'string') {
			for (var i in this.lights) {
				this.lights[i].sticky_wall = drag_light.sticky_wall;
			}
		}

		this.refresh_outline();
		this.move_start_x = null;
		this.move_start_y = null;
	},

	check_lights_are_in_room: function(room) {
        for (var i in this.lights) {
			if (room.path.hitTest(this.lights[i].path.bounds.center) === null) {
				return false;
			}
		}

		return true;
	},

	refresh_outline: function() {
        if (this.path) {
			this.path.remove();
		}
		
		if (this.path_strip_light) {
			this.path_strip_light.remove();
		}

		var bounds = this.get_light_bounds(),
		    first_light = null,
		    last_light = null;

		for (var i in this.lights) {
			if (!first_light) {
				first_light = this.lights[i];
			}
		}

		last_light = this.lights[i];

		if (this.type == 'grid') {
			this.path = new Path.Rectangle(bounds[0], bounds[1]);

		} else if (this.type === 'box') {
			this.path = new Path.Rectangle(bounds[0], bounds[1]);

		} else {
			this.path = new Path.Line(first_light.path.bounds.center, last_light.path.bounds.center);
			
			if (first_light.is_strip_light) {
				this.path_strip_light = new Path.Line(first_light.path.bounds.center, last_light.path.bounds.center);
				this.path_strip_light.ignore_events = true;
				this.path_strip_light.strokeColor = this.temperature_colors[first_light.color_temperature.code];
				this.path_strip_light.strokeWidth = 3;
				this.path_strip_light.dashArray = [3,3];
			}
		}

		this.hide_outline();

		this.path.onMouseEnter = $.proxy(this.on_mouse_enter, this);
		this.path.onMouseDown = $.proxy(this.on_mouse_down, this);
		this.path.onMouseDrag = $.proxy(this.on_mouse_drag, this);
		this.path.onMouseUp = $.proxy(this.on_mouse_up, this);
		this.path.onMouseMove = $.proxy(this.on_mouse_move, this);
		this.path.onMouseLeave = $.proxy(this.on_mouse_leave, this);

		this.path.ignore_events = true;
	},

	on_mouse_drag: function(event) {
        this._super(event);

		//attempt at dragging selected strings... delete if don't remember
		if (this.type == 'string' && !this.path.ignore_events && !this.is_resizing) {
			if (this.hover_light) {
				//swat event.target to pass to light drag...
				event.target = this.hover_light.path;
				this.hover_light.on_mouse_drag(event);
			}
		}
	},

	on_mouse_up: function(event) {
        var resized = this.user_resized;

		this._super(event);

		if (resized) {

			var light = this.get_light_at(1);
			if (!light) {
				return;
			}

			var light_width = light.width,
			    light_height = light.height;

			if (this.type === 'string') {
				//check if the string is too small to fit all the lights...
				var lights_count = this.get_lights_count(),
				    available_per_light = (this.path.length / lights_count);

				if (available_per_light <= light_width) {
					//lights do not fit.. bail out.
					//this.unselect();
					this.refresh_outline();
					return;
				}

			} else {
				//check if the bounding box is to small to fit all the lights...
				var rows = this.rows,
				    cols = this.cols;

				if (this.type === 'box') {
					rows = cols = 2;
				}

				var spacing = 0.5,
				    min_width = (light.width * (cols + spacing)),
				    min_height = (light.height * (rows + (spacing))),
                    width_scale = 1,
				    height_scale = 1;

				//check width...
				if (min_width >= this.path.bounds.width) {
					width_scale = ((min_width / this.path.bounds.width * 100) / 100);
				}

				//and height
				if (min_height >= this.path.bounds.height) {
					height_scale = ((min_height / this.path.bounds.height * 100) / 100);
				}

				if (width_scale !== 1 || height_scale !== 1) {
					this.path.scale(width_scale, height_scale, this.resize_anchor);
				}

				this.spacingx = (this.path.bounds.width - light_width) / (cols - 1);
				this.spacingy = (this.path.bounds.height - light_height) / (rows - 1);
				this.set_previous_cols(cols);
				this.set_previous_rows(rows);
			}

			this.refresh_lights();
			app.designer.selected = this.get_light_at(1);
			this.select();
		}
	},

	on_mouse_leave: function(event) {
        this._super(event);

		if (this.selected) {
			var light = this.get_light_at(1);
            light.set_active(false);
            //this.get_light_at(1).set_active(false);
			return;
		}

		if (this.path.contains(event.point)) {
			return;
		}

		for (var i in this.lights) {
			this.lights[i].set_active(false);
		}
	},

	resize: function(x, y, event) {
        if (this.type === 'grid' || this.type === 'box') {
			this.path.scale(x, y, this.resize_anchor);

		} else {
			this.path.getNearestLocation(event.point).segment.point = event.point;
		}
	},

	get_light_bounds: function() {
        var x1 = null,
		    y1 = null,
		    x2 = null,
		    y2 = null,
		    light,
		    path_x1,
		    path_y1,
		    path_x2,
		    path_y2;

		for (var i in this.lights) {
			light = this.lights[i];
			path_x1 = light.path.bounds.x;
			path_y1 = light.path.bounds.y;
			path_x2 = (path_x1 + light.path.bounds.width);
			path_y2 = (path_y1 + light.path.bounds.height);

			if (x1 === null || path_x1 < x1) {
				x1 = path_x1;
			}

			if (y1 === null || path_y1 < y1) {
				y1 = path_y1;
			}

			if (x2 === null || path_x2 > x2) {
				x2 = path_x2;
			}

			if (y2 === null || path_y2 > y2) {
				y2 = path_y2;
			}
		}

		return [new Point(x1,y1), new Point(x2, y2)];
	},

	/*get_index_by_light: function(light) {
		var index = 1;
		for (var i in this.lights) {
			if (this.lights[i].id == light.id) {
				return index;
			}
			index++;
		}

		return null;
	},*/

	show_outline: function() {
        if (!this.path) {
			this.refresh_outline();
		}

		app.designer.layers.light_groups.addChild(this.path);
	},

	hide_outline: function() {
        if (this.path !== null && this.path.layer) {
			this.path.remove();
		}
	},

	// keep track of the lights' width, height, original width and height
	set_light_width_height: function(light) {
        this.light_width = light.width;
		this.light_height = light.height;
		this.original_light_width = light.original_width;
		this.original_light_height = light.original_height;
	},

	refresh_lights: function() {
        //pause paper updates whilst preparing canvas...
		app.ui.pause_rendering();

		if (this.type == 'grid') {
			this.refresh_grid_lights();

		} else if (this.type == 'box') {
			this.refresh_box_lights();

		} else {
			this.refresh_string_lights();
		}

		//app.designer.draw_circuits();
		//app.designer.show_all_circuits();
		var light_info = this.get_light_info(),
		    light_circuit = light_info[1],
		    light_room = light_info[2];

		light_circuit.redraw_connections();

		app.ui.resume_rendering();
		light_room.show_circuits();

		app.ui.draw();
	},

	refresh_grid_lights: function() {
        var light_info = this.get_light_info(),
		    light_type = light_info[0],
		    light_circuit = light_info[1],
		    light_room = light_info[2],
		    is_custom = light_info[3],
		    custom_data,
            light;

		//remove but don't remove group...
		for (var i in this.lights) {
			light = this.lights[i];

			if (is_custom && !custom_data) {
				light_type = light.get_custom_light_data();
			}

			// keep track of the light_width and origial_light_width
			this.set_light_width_height(light);

			light.group = null;
			light.remove(false, true);
			this.remove_light(light, true);
		}

		if (!is_custom) {
			light_type = light_type.toUpperCase();
		}

		app.light_manager.draw_grid(light_room, this.path.bounds, this, light_circuit, light_type);

		light_circuit.show_connections(true);
		light_circuit.room.reconnect_light_switches();

		view.draw();
	},

	refresh_box_lights: function(count) {
        var light_info = this.get_light_info(),
		    light_type = light_info[0],
		    light_circuit = light_info[1],
		    light_room = light_info[2],
		    is_custom = light_info[3],
		    custom_data;

		if (!count) {
			count = this.get_lights_count();
		}

		var light_width = this.get_light_at(1).width,
		    original_width = this.get_light_at(1).original_width,
		    light_height = this.get_light_at(1).height,
		    original_height = this.get_light_at(1).original_height;

		//remove but don't remove group...
		for (var i in this.lights) {
			var light = this.lights[i];

			if (is_custom && !custom_data) {
				light_type = light.get_custom_light_data();
			}

			// keep track of the light_width and origial_light_width
			this.set_light_width_height(light);

			light.group = null;
			light.remove(false, true);
			this.remove_light(light, true);
		}

		var	bounds = {
			x: this.path.bounds.x + (light_width - original_width) / 2,
			y: this.path.bounds.y + (light_height - original_height) / 2,
			width: (this.path.bounds.width - light_width),
			height: (this.path.bounds.height - light_height)
		};

		if (!is_custom) {
			light_type = light_type.toUpperCase();
		}

		app.light_manager.draw_indirect_box(count, bounds, light_room, this, light_type);

		light_circuit.show_connections(true);
		light_circuit.room.reconnect_light_switches();

		this.hide_outline();
		view.draw();
		this.refresh_outline();
	},

	refresh_string_lights: function() {
        var light_info = this.get_light_info(),
		    light_type = light_info[0],
		    light_circuit = light_info[1],
		    light_room = light_info[2],
		    is_custom = light_info[3],
		    custom_data;

		//remove but don't remove group...
		for (var i in this.lights) {
			var light = this.lights[i];

			if (is_custom && !custom_data) {
				light_type = light.get_custom_light_data();
			}
			// keep track of the light_width and origial_light_width
			this.set_light_width_height(light);

			light.group = null;
			light.remove(false, true);
			this.remove_light(light, true);
		}

		if (!is_custom) {
			light_type = light_type.toUpperCase();
		}

		app.light_manager.draw_string(light_room, this.path, this, light_circuit, light_type);

		light_circuit.show_connections(true);
		light_circuit.room.reconnect_light_switches();

		view.draw();
	},

	add_click: function() {
        app.ui.pause_rendering();

		if (this.type == 'grid') {
			this.set_adding_lights(true);
			this.add_grid_lights();
			this.set_adding_lights(false);

		} else if (this.type == 'box') {
			this.add_box_lights();

		} else {
			this.add_string_lights();
		}

		this.select_first_light();

		app.ui.resume_rendering();
	},

	select_first_light: function() {
        /*var light = this.get_light_at(1);
		light.select();*/
        this.get_light_at(1).select();
	},

	set_previous_cols: function(cols) {
        this.previous_cols = cols;
	},

	set_previous_rows: function(rows) {
        this.previous_rows = rows;
	},

	/*set_previous_path_x1: function(x) {
		this.previous_path_x1 = x;
	},*/

	/*set_previous_path_y1: function(y) {
		this.previous_path_y1 = y;
	},*/

	set_adding_lights: function(adding) {
        this.adding_lights = adding;
	},

	set_removing_lights: function(removing) {
        this.removing_lights = removing;
	},

	add_grid_lights: function() {
        this.set_previous_cols(this.cols);
		this.set_previous_rows(this.rows);

		if (this.rows === 1) {
			this.path.bounds.height = this.light_height * 3;
			this.previous_rows += 1;
		}

		if (this.cols === 1) {
			this.path.bounds.width = this.light_width * 3;
			this.previous_cols += 1;
		}

		this.rows++;
		this.cols++;
		this.refresh_grid_lights();
	},

	add_box_lights: function() {
        var count = this.get_lights_count(),
		    room;

		for (var i in this.lights) {
			room = this.lights[i].room;
			break;
		}
		// if just two lights, scale the bounds to a square
		if ((count + 2) === 4) {
			this.refresh_box_lights(count);
			if (this.path.bounds.width > this.path.bounds.height) {
				this.path.bounds.height += this.light_height * 3;

			} else {
				this.path.bounds.width += this.light_width * 3;
			}
		}

		count += 2;
		this.refresh_box_lights(count);
	},

	add_string_lights: function() {
        this.rows++;
		this.refresh_string_lights();
	},

	remove_click: function() {
        app.ui.pause_rendering();

		if (this.type == 'grid') {
			this.set_removing_lights(true);
			this.remove_grid_lights();
			this.set_removing_lights(false);

		} else if (this.type == 'box') {
			this.remove_box_lights();

		} else {
			this.remove_string_lights();
		}

		this.select_first_light();
		app.ui.resume_rendering();
	},

	remove_grid_lights: function() {
        this.set_previous_cols(this.cols);
		this.set_previous_rows(this.rows);

		this.rows = (this.rows > 2) ? (this.rows - 1) : this.rows;
		this.cols = (this.cols > 2) ? (this.cols - 1) : this.cols;
		this.refresh_grid_lights();
	},

	remove_box_lights: function() {
        var count = this.get_lights_count(),
		    room;

		for(var i in this.lights) {
			room = this.lights[i].room;
			break;
		}

		if (count > 2) {
			if ((count - 2) === 2) {
				if (this.path.bounds.width > this.path.bounds.height) {
					this.path.bounds.height = this.light_height;
					// this.path.bounds.y = room.path.bounds.y + (room.height / 2 - this.path.bounds.height);

				} else {
					this.path.bounds.width = this.light_width;
					// this.path.bounds.x = room.path.bounds.x + (room.width / 2 - this.path.bounds.width);
				}
			}
			count -= 2;
		}

		this.refresh_box_lights(count);
	},

	remove_string_lights: function() {
        this.rows = (this.rows > 2) ? (this.rows - 1) : this.rows;
		this.refresh_string_lights();
	},

	add_light: function(light) {
        if (!this.contains_light(light)) {
			this.lights[light.id] = light;
			light.group = this;

			//grid lights can't be sticky
			if (this.type === 'grid') {
				light.sticky = false;
			}
		}
	},

	get_light_at: function(index) {
        var count = 1;

		for (var i in this.lights) {
			if (count == index) {
				return this.lights[i];
			}
			count++;
		}

		//fall thru...
		return null;
	},

	contains_light: function(light) {
        return (this.lights[light.id] !== undefined);
	},

	remove_light: function(light, from_group) {
        delete this.lights[light.id];

		//if no lights left...
		if (!from_group && this.get_lights_count() === 0) {
			this.remove();
		}
	},

	get_lights_count: function() {
        var lights = this.lights,
		    count = 0;

		for (var k in lights) {
			if (lights.hasOwnProperty(k)) {
				count++;
			}
		}
		return count;
	},

	rotate_by: function(rotation) {
        $.each(this.lights, function(i, light) {
			light.rotate(rotation);
			light.rotation += rotation;
		});

		this.path.rotate(rotation);
	},

	on_finish_rotate: function() {
        this.refresh_outline();

		// After roatation, use the new bounds to recalculate spacing
		this.spacingx = (this.path.bounds.width - this.light_width) / (this.cols - 1);
		this.spacingy = (this.path.bounds.height - this.light_height) / (this.rows - 1);

		var light_info = this.get_light_info(),
		    light_circuit = light_info[1];

		light_circuit.show_connections(true);
		light_circuit.room.reconnect_light_switches();
	},

	set_wall_light_height: function(height) {
        for (var i in this.lights) {
			this.lights[i].set_wall_light_height(height);
		}
	},

	set_custom_light_data: function(code, color_temperature, lumens, wattage) {
        for (var i in this.lights) {
			var light = this.lights[i];
			light.code = code;
			light.color_temperature = color_temperature;
			light.lumens = lumens;
			light.wattage = wattage;
		}
	},

	change_type: function(change_data) {
        var room;

		for (var i in this.lights) {
			var light = this.lights[i];

			change_data['centerX'] = light.x;
			change_data['centerY'] = light.y;
			change_data['boundsCenterX'] = light.path.bounds.centerX;
			change_data['boundsCenterY'] = light.path.bounds.centerY;

			light.change_type(change_data);
			room = light.room;

			// save the new light's width and height
			this.set_light_width_height(light);
		}

		if (room) {
			room.refresh_reached(true);
			room.refresh_status();
		}

		// refresh the outline
		this.previous_cols = this.cols;
		this.previous_rows = this.rows;
		this.refresh_lights();
		this.select_first_light();
	},

	select: function() {
        this._super();

		var light;
		for (var i in this.lights) {
			light = this.lights[i];
			light.selected = true;
		}

		this.show_outline();
		this.selected = true;
		this.path.ignore_events = false;

		app.designer.selected = light;
		app.pub('designer_group_selected_after_resize', [light]);
	},

	unselect: function(style) {
        for (var i in this.lights) {
			var light = this.lights[i];
			light.selected = false;
			light.hide_wall_distance_lines();
		}

		if (!this.active) {
			this.hide_outline();
		}

		this.selected = false;
		if (this.path) {
			this.path.ignore_events = true;
		}

		this._super();
	},

	set_active: function(active, light) {
        this.active = active;

		if (!light) {
			return;
		}

		if (active) {
			this.show_outline();
			this.set_style(this.active_style);

		} else {
			if (!this.selected) {
				this.set_style(this.base_style);
				this.hide_outline();
			}
		}
	},

	invoke_on_lights: function(function_name) {
        for (var i in this.lights) {
			this.lights[i][function_name]();
		}
	},

	disconnect: function() {
        var light_info = this.get_light_info(),
		    old_circuit = light_info[1],
		    new_circuit = app.designer.get_new_circuit();

		for (var i in this.lights) {
			this.lights[i].disconnect(new_circuit);
		}

		this.refresh_room_circuits();
		old_circuit.redraw_connections();

		if (old_circuit.room) {
			old_circuit.room.reconnect_light_switches();
		}

		new_circuit.room.reconnect_light_switches();
		new_circuit.show_connections(true);

		old_circuit.hide_connections();
	},

	refresh_room_circuits: function() {
        var light = this.get_light_at(1);
		if (light) {
			light.room.refresh_circuits();
		}
	},

	get_light_info: function() {
		for(var i in this.lights) {
			return [this.lights[i].type, this.lights[i].circuit, this.lights[i].room, this.lights[i].is_custom];
		}
	},

	export: function() {
		var group = {
			id: this.id,
			type: this.type,
			rows: this.rows,
			cols: this.cols,
			spacingx: this.spacingx,
			spacingy: this.spacingy
		};

		group.lights = [];
		$.each(this.lights, function(i, light) {
			group.lights.push(light.id);
		});

		return group;
	},

	remove_lights: function() {
		var light_info = this.get_light_info();
		if (light_info) {

			$.each(this.lights, function(i, light) {
				light.remove(true);
			});
		}
	},

	remove: function() {
		app.ui.pause_rendering();
		//hmm if we call super it freaks stuff.
		//i have removed this - but not it does not get called in resizable anymore
		//this._super();
		
		this.remove_lights();

		if (this.path) {
			this.path.remove();
		}

		if (this.path_strip_light) {
			this.path_strip_light.remove();
		}

		delete app.designer.light_groups[this.id];
		this.remove_handles();

		app.ui.resume_rendering();
	}
});