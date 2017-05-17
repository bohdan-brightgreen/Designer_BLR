/**
 * app.designer
 * Helper for the <canvas> component of the system
 */
app.designer = {

	element: null,
	initial_width: null,
	initial_height: null,
	initial_zoom_factor: null,
	tools: {},
	rooms: {},
	circuits: {},
	light_groups: {},
	light_switches: {},
	room_scale: null,//number of pixels per metre
	active_tool: null,
	active_room: null,
	active_asset: null,
	background: null,
	background_img: null,
	zoom_factor: 1,
	zoom_amount: 0.2,
	drag_asset: null,
	drag_offset: {x: 0, y:0},
	selected: null,
	class_map: [],
	controls_hover: null,
	is_resizing: false,
	snap_lights: true,//controls whether lights snap to grid
	notes : [],
	note_paths : [],

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

	cancel_mouseup: false,
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
		'rotate': "url('img/rotate.png'), move"
	},

	init: function() {
		//create designer element...
		this.element = $('<canvas />').attr({ id: 'designer'});
		$('#designer_container').append(this.element);

		//surpress context menu
		this.element.get(0).oncontextmenu = function() { return false; } ;

		this.initial_width = this.element.width();
		this.initial_height = this.element.height();
		this.cancel_mouseup = false;

		//install paper..
		paper.setup(this.element.get(0));

		this.bind_events();
		this.init_mouse_events();
		this.init_stats_box();

		//resize - and on window resize
		this.resize_element();
		$(window).resize($.proxy(this.resize_element, this));
	},

	bind_events: function() {
		app.sub('area_data_loaded', this.on_area_data_loaded, this);
	},

	init_mouse_events: function() {
		//standard dom events...
		this.element.mouseover($.proxy(this.on_mouse_over, this));
		this.element.mouseup($.proxy(this.element_on_mouse_up, this));
		this.element.mouseout($.proxy(this.on_mouse_out, this));
		this.element.keydown($.proxy(this.on_key_down, this));

		//the "no_tool" tool...
		this.no_tool = new Tool();
		this.no_tool.name = 'no_tool';
		this.no_tool.onMouseMove = $.proxy(this.on_mouse_move, this);
		this.no_tool.onMouseUp = $.proxy(this.on_mouse_up, this);
		this.no_tool.onKeyDown = $.proxy(app.designer.on_key_down, this);
		this.no_tool.activate();

		this.element.mousewheel($.proxy(app.designer.on_mouse_wheel_scroll, this));
	},

	initialize_new_area: function() {
		this.reset_layers();

		//if previously intialised...
		if (this.layers.background !== null) {
			this.delete_circuits();
			this.delete_rooms();
			this.delete_light_groups();
			this.background_img = null;
			this.initial_zoom_factor = 1;
			this.zoom_factor = 1;
			this.room_scale = null;
			this.zoom_translate_x = 0;
			this.zoom_translate_y = 0;
			this.square_meters = 0;
			this.recommended_lux = 0;
			this.recommended_workplane_lux = '-';
			this.recommended_lumens = 0;
			this.recommended_wattage = 0;
			this.recommended_wattage_sqm = 5;
			this.reached_lux = 0;
			this.reached_workplane_lux = 0;
			this.reached_lumens = 0;
			this.reached_wattage = 0;
			this.reached_wattage_sqm = 0;

		} else {
			//remove initial layer from paper...
			project.layers[0].remove();
		}

		this.rooms = {};
		this.circuits = {};
		this.light_groups = {};
		paper.view.zoom = 1;
		app.ui.draw();

		this.fit_to_screen();
		this.reset_center();
		this.show_stats_box(true);
	},

	resize_element: function() {
		//if designer not init'd yet...
		var window_height = $(window).height(),
		    designer_height = (window_height - this.element.offset().top - 10);

		if (paper && paper.view) {
			paper.view.viewSize = [$(window).width(), designer_height];

			//if loaded...
			if (this.layers.background) {
				this.reset_center();
				app.ui.draw();
			}
		}
	},

	reset_layers: function() {
		for (var i in this.layers) {
			var layer = this.layers[i];
			if (layer) {
				layer.remove();
			}

			this.layers[i] = new Layer();
		}
	},

	import_background_image: function(data) {
		this.background_img = new Image();
		this.background_img.onload = $.proxy(function() {

			this.background = new Raster(this.background_img, new Rectangle(0,0,this.background_img.width,this.background_img.height));
			this.layers.background.addChild(this.background);

			this.reset_center();
			this.set_opacity(app.ui.menu_bar.opacity);
			this.background.bounds.x = 0;
			this.background.bounds.y = 0;
			app.ui.draw();

			this.zoom_to_fit();

		}, this);

		if (data.url) {
			this.background_img.src = data.url;

		} else if (data.img_data) {
			this.background_img.src = 'data:image/png;base64,' + data.img_data;
		}
	},

	on_area_data_loaded: function(e, area) {
		this.import(area.designer_data);
	},

	/*get_circuit: function() {
		for(var i in this.circuits) {
			var circuit = this.circuits[i];
			return circuit;
		}

		//fall thru...
		return this.get_new_circuit();
	},*/

	get_new_circuit: function() {
		var circuit = new app.Circuit();
		this.circuits[circuit.id] = circuit;

		return circuit;
	},

	reset_center: function() {
		if (this.background_img) {
			this.center = [(this.background_img.width) / 2, (this.background_img.height) / 2];

		} else {
			this.center = this.layers.background.bounds.getCenter();
		}

		this.set_center(this.center);
	},

	on_mouse_over: function(event) {
		$(document.body).addClass('hide_drag');
	},

	on_mouse_move: function(tool_event) {
		if (app.drag_type === null) {
			app.dragging = false;
			return;
		}

		this.on_mouse_drag(tool_event);
	},

	on_mouse_drag: function(tool_event) {
		app.dragging = true;

		var event = tool_event.event,
		    point = tool_event.getPoint();

		//if first drag - create...
		if (this.drag_asset === null) {
			var asset_class = this.get_asset_class(app.drag_type);

			if (asset_class) {
				this.drag_asset = new asset_class({x: point.x, y: point.y, type: app.drag_type});
				app.designer.drag_offset.x = (this.drag_asset.width / 2) + 6;
				app.designer.drag_offset.y = 0 - (this.drag_asset.height / 2);
			}

		} else if (!this.drag_asset.is_visible()) {
			this.drag_asset.show();
		}

		//if no button is pressed, this is a bug...
		if (event.which !== 1) {
			point = {
                x: event.offsetX,
                y: event.offsetY
            };
			console.log('Good golly! I just stopped a catostrophy!', point);
			console.log(this.controls_hover, app.is_dragging());

			if (this.active_asset) {
				this.active_asset.unselect();
			}

			app.drag_type = null;
			this.on_mouse_up(tool_event);
			this.drag_asset = null;
			return;
		}

		this.drag_asset.move(point.x, point.y);

		if (this.active_room) {
			if (this.drag_asset.is_light()) {
				app.designer.active_room.draw_snap_lines_for_light(this.drag_asset);
			}

			this.drag_asset.draw_wall_distance_lines(this.active_room);
		}
	},

	element_on_mouse_up: function(event) {
		//called when new asset dragged from dom...
		//only proxy on this occastion
		if (app.designer.dragging_new_asset) {
			app.designer.dragging_new_asset = false;
			this.on_mouse_up(event);
		}
	},

	on_mouse_up: function(event) {
		//if just finished resizing
		if (this.cancel_mouseup) {
			this.cancel_mouseup = false;
			return;
		}

		//if controls show...
		if (this.controls_hover) {
			return;
		}

		if (!app.is_dragging()) {
			if (this.selected && this.selected.group) {
				//not mousing-up on group - may be 'out of bounds',
				//refresh group outline...
				if (this.selected.group.has_resized) {
					this.selected.group.refresh_outline();
					this.selected.group.has_resized = false;
				}
			}

			if (this.active_asset !== null) {
				this.active_asset.set_selected(true, event);

			} else if (this.active_room !== null) {
				this.active_room.set_selected(true);

			} else {
				app.pub('designer_background_click');
				this.clear_selected();
			}

			app.dragging = false;
			return;
		}

		app.dragging = false;
		if (event.event) {
			event = event.event;
		}

		var point = {
            x: event.offsetX,
            y: event.offsetY
        };

		app.designer.drop_asset(app.drag_type, point);
		app.drag_type = null;
		app.designer.reset_cursor();
	},

	on_mouse_out: function(event) {
		$(document.body).removeClass('hide_drag');

		if (app.is_dragging()) {
			this.drag_asset.hide();
		}
	},

	on_key_down: function(event) {
		var tag_name = event.event.target.tagName;
		//console.log(tag_name);
		//var clicked_item =  (e.target.tagName === 'LI') ? $(e.target) : $(e.target).closest('LI');
		//if(!app.dialog_showing && (event.key == 'delete' || event.key == 'backspace')) {
		if (tag_name != 'INPUT' && tag_name != 'TEXTAREA' && (event.key == 'delete' || event.key == 'backspace')) {
			if (this.selected !== null) {

				//if it's a room, and handle is selected...
				if (app.designer.selected.class === 'room' && app.designer.selected.selected_handle) {
					app.designer.selected.delete_selected_handle();

				} else {
					//normal asset (room, furniture, light etc.)
					this.selected.delete_asset(event);
				}
			}

			//don't navigate back
			return false;
		}

		//if zoom key and + or -
		if (event.event.shiftKey) {
			var keyCode = event.event.keyCode;

			//zoom in on +
			if (keyCode === 43) {
				this.zoom_in();

			} else if (keyCode === 95) {
				//and out on -
				this.zoom_out();

			} else {
				//do we have a room selected?
				if (app.designer.selected && app.designer.selected.class === 'room') {
					//check if we are adding a segment...
					app.designer.selected.shift_press();
				}
			}
		}

		return true;
	},

	on_mouse_wheel_scroll: function(e, delta, deltaX, deltaY) {
		if (!app.project || !e.shiftKey) {
			return;
		}

		if (delta < 0) {
			this.zoom_out();

		} else {
			this.zoom_in();
		}

		return false;
	},

	drop_asset: function(type, position) {
		//if(!this.drag_asset.is_in_room()) {
		if (this.active_room === null) {
			if (this.drag_asset.is_light()) {
				app.ui.show_tooltip('Lights must be placed inside a room', 3000);
				this.drag_asset.cancel_move();

			} else {
				if (this.drag_asset.is_in_room()) {
					this.drag_asset.lock_to_room();

				} else {
					app.ui.show_tooltip('Furniture must be placed inside a room', 3000);
					this.drag_asset.cancel_move();
				}
			}

		} else {

			if (this.drag_asset.is_light() && this.drag_asset.in_group && !this.drag_asset.group.check_lights_are_in_room(this.active_room)) {
				//console.log("asset was a light group and not all lights are in the same room so cancel it");
				app.ui.show_tooltip('All lights in a light group must be within the same room', 3000);
				this.drag_asset.cancel_move();
				app.snap_manager.remove_lines();

			} else {
				if (this.drag_asset.is_light() && this.snap_lights) {
					//on drop - look for the snap light...
					var tolerance = (app.designer.room_scale * 0.2),
					    result = this.drag_asset.find_nearest_lights(tolerance, this.active_room),
					    snap_x = this.drag_asset.path.bounds.center.x,
					    snap_y = this.drag_asset.path.bounds.center.y;

					if (result.x_point !== null) {
						snap_x = result.x_point.x;
					}

					if (result.y_point !== null) {
						snap_y = result.y_point.y;
					}

					var delta = {
						x: (snap_x - this.drag_asset.path.bounds.center.x),
						y: (snap_y - this.drag_asset.path.bounds.center.y)
					};

					app.designer.drag_offset = {x:0, y:0};

					if (this.drag_asset.group) {
						this.drag_asset.group.move_by(delta);

					} else {
						this.drag_asset.move_by(delta);
					}

					app.snap_manager.remove_lines();
				}

				//add asset to room...
				this.active_room.add_asset(this.drag_asset);
				this.drag_asset.move_finish();
			}
		}

		this.drag_asset = null;
	},

	set_active: function(type, obj) {
		this[type] = obj;

		if (type == 'active_room') {
			app.set_status(obj.get_hover_status());
			this.update_stats_box(obj.recommended_lumens, obj.reached_lumens);
		}
	},

	clear_active: function(type) {
		this[type] = null;

		if (!this.active_room && !this.active_asset) {
			app.clear_status();
		}
	},

	/*get_selected_light_type: function() {
		var light = $('#lights_container .drag_asset_selected');
		if (light.length) {
			return light.data('type-selected');
		}

		//fall thru...
		return null;
	},*/

	/*get_selected_facscia_color: function() {
		return $('input:radio[name=facscia_color]:checked').val();
	},*/

	get_asset_class: function(type) {
		//check class exists...
		if (this.class_map[type]) {
			return this.class_map[type];
		}

		var class_name = type.toCamel();
		if (app.Asset[class_name]) {
			this.class_map[type] = app.Asset[class_name];
			return this.class_map[type];

		} else {
			console.error('Error: Could not load class type  "' + class_name + '"');
		}

		//fall thru...
		return null;
	},

	cancel_drop: function() {
		if (app.is_dragging() && this.drag_asset) {
			this.drag_asset.remove();
		}

		app.drag_type = null;
		this.drag_asset = null;
	},

	set_room_scale: function(room_scale) {
		this.room_scale = room_scale;
	},

	refresh_asset_scale: function(scale) {
		if (!scale) {
			scale = this.room_scale;
		}

		if (scale) {
			for (var r in this.rooms) {
				var room = this.rooms[r];
				for (var a in room.assets) {
					var asset = room.assets[a];
					if (asset.is_scalable()) {
						asset.rescale(scale);
					}
				}
			}

			app.ui.draw();
		}
	},

	reconnect_light_switches: function(scale) {
		for (var r in this.rooms) {
			var room = this.rooms[r];
			for (var a in room.light_switches) {
				var asset = room.assets[a];
				asset.redraw_connections();
			}
		}

		app.ui.draw();
	},

	/*is_room: function(id) {
		return (this.rooms[id] !== undefined);
	},*/

	export_image: function() {
		var img_src = this.get_image(10);

		if (img_src !== false) {
			window.open('data:image/png;base64,' + img_src, "export_image");

		} else {
			app.ui.show_tooltip('Error, empty project. Add rooms, furniture and lights before exporting image');
		}
	},

	unset_actives: function() {
		if (this.active_room !== null) {
			this.active_room.set_active(false);
		}

		if (this.active_asset !== null) {
			this.active_asset.set_active(false);
		}
	},

	get_image: function(padding, include_wiring, include_switches) {
		include_wiring = (typeof include_wiring === "undefined") ? true : include_wiring;
		include_switches = (typeof include_switches === "undefined") ? true : include_switches;
		this.unset_actives();

		//persist original values...
		var orig_zoom = paper.view.zoom,
		    orig_center = paper.view.center,
		    orig_view_width = paper.view.size.width * orig_zoom,
		    orig_view_height = paper.view.size.height * orig_zoom;
		//var orig_width = this.element.width();
		//var orig_height = this.element.height();

		//center content
		this.fit_to_screen();

		//get visible content bounds
		var project_bounds = this.get_project_bounds();

		//add some padding
		project_bounds.x -= (padding / 2);
		project_bounds.y -= (padding / 2);
		project_bounds.width += padding;
		project_bounds.height += padding;

		//update canvas & view to show onlt visible content bounds
		//this.element.css({ width: project_bounds.width, height: project_bounds.height });

		paper.view.setViewSize(project_bounds.width, project_bounds.height);
		paper.view.setCenter(project_bounds.center);

		//prepare for export
		if (include_wiring) {
			this.show_all_circuits();
		}

		if (!include_switches) {
			app.designer.hide_light_switches();
		}

		app.designer.draw_distance_lines();
		this.add_notes();

		app.ui.resume_rendering();
		app.ui.draw();

		//export image
		//NO TRIM!
		//var img_data = this.trim_canvas(this.element.get(0), padding);
		var img_data = this.element.get(0).toDataURL("image/png");

		if (!img_data) {
			return false;
		}

		//trim uri cruft
		img_data = img_data.replace(/^data:image\/(png|jpg);base64,/, "");

		//undo preparations
		app.ui.pause_rendering();
		app.designer.hide_distance_lines();
		this.hide_all_circuits();
		this.remove_notes();

		if (!include_switches) {
			app.designer.show_light_switches();
		}

		//reset element & canvas back to original values
		//this.element.css({ width: orig_width, height: orig_height});
		paper.view.setViewSize(orig_view_width, orig_view_height);
		this.set_center(orig_center);
		this.zoom(orig_zoom);

		app.ui.resume_rendering();
		app.ui.draw();

		return img_data;
	},

	//this function trims all the empty space in the canvas and returns a base64 string of the trimmed image
	/*trim_canvas: function(c, padding) {
		if(padding === undefined) {
			padding = 1;
		}

		if(c.width === 0 || c.height === 0) {
			return false;
		}

		var ctx = c.getContext('2d'),
			copy = document.createElement('canvas').getContext('2d'),
			pixels = ctx.getImageData(0, 0, c.width, c.height),
			l = pixels.data.length,
			i,
			bound = {
				top: null,
				left: null,
				right: null,
				bottom: null
			},
			x, y;

		for (i = 0; i < l; i += 4) {
			if (pixels.data[i+3] !== 0) {
				x = (i / 4) % c.width;
				y = ~~((i / 4) / c.width);

				if (bound.top === null) {
					bound.top = y;
				}

				if (bound.left === null) {
					bound.left = x;
				} else if (x < bound.left) {
					bound.left = x;
				}

				if (bound.right === null) {
					bound.right = x;
				} else if (bound.right < x) {
					bound.right = x;
				}

				if (bound.bottom === null) {
					bound.bottom = y;
				} else if (bound.bottom < y) {
					bound.bottom = y;
				}
			}
		}

		var trimHeight = (bound.bottom - bound.top),
			trimWidth = (bound.right - bound.left);

		//if empty...
		if(trimHeight === 0 || trimWidth === 0) {
			return false;
		}
		else {
			//add one...
			trimWidth += 1;
			trimHeight += 1;
		}

		var trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

		//apply padding...
		trimHeight += (padding * 2);
		trimWidth += (padding * 2);

		copy.canvas.width = trimWidth;
		copy.canvas.height = trimHeight;
		copy.putImageData(trimmed, padding, padding);

		return copy.canvas.toDataURL("image/png");
	},*/

	zoom_in: function() {
		app.designer.zoom(app.designer.zoom_factor + app.designer.zoom_amount);
	},

	zoom_out: function() {
		app.designer.zoom(app.designer.zoom_factor - app.designer.zoom_amount);
	},

	sanitize_zoom: function(to) {
		var closest_zoom = (3 * this.initial_zoom_factor),
		    farthest_zoom = (0.4 * this.initial_zoom_factor);

        if (to > closest_zoom) {
            return closest_zoom;

        } else if (to < farthest_zoom) {
            return farthest_zoom
        }

        return to;
	},

	zoom: function(to) {
		to = this.sanitize_zoom(to);
		app.designer.zoom_factor = to;
		paper.view.zoom = app.designer.zoom_factor;
		app.ui.draw();

		app.pub('designer_zoom_change');
	},

	fit_to_screen: function() {
		app.designer.zoom(this.initial_zoom_factor);
		this.set_center(this.center);
	},

	clear_selected: function() {
		if (this.selected !== null) {
			this.selected.set_selected(false);
		}
	},

	set_center: function(pos) {
		paper.view.setCenter(pos);
	},

	activate_tool: function(tool, params) {
		if (this.active_tool == tool) {
			return;
		}

		this.deactivate_tool(this.active_tool);

		if (this.tools[tool]) {
			this.active_tool = this.tools[tool];
			this.tools[tool].activate();

			if (this.active_tool.on_activate) {
				this.active_tool.on_activate(params);
			}
		}
	},

	deactivate_tool: function() {
		if (this.active_tool && this.active_tool.on_deactivate !== null) {
			this.active_tool.on_deactivate();
		}

		this.no_tool.activate();
		this.active_tool = null;
		app.pub('no_tool_activate');
	},

	toggle_tool: function(tool_name, params) {
		if (app.designer.active_tool && app.designer.active_tool.name == tool_name) {
			app.designer.deactivate_tool();

		} else {
			app.designer.activate_tool(tool_name, params);
		}
	},

	show_all_circuits: function() {
		for (var i in app.designer.circuits) {
			app.designer.circuits[i].show_connections();
		}
	},

	hide_all_circuits: function() {
		for (var i in app.designer.circuits) {
			app.designer.circuits[i].hide_connections();
		}
	},

	is_disconnect_active: function() {
		return (this.active_tool && this.active_tool.name == "light.disconnect");
	},

	is_connect_active: function() {
		return (this.active_tool && this.active_tool.name == "light.connect");
	},

	/*change_selected_light: function () {
		if(app.designer.selected && app.designer.selected.is_light && app.designer.selected.is_light()) {
			var light = app.designer.selected;
			var type_name = $('#lights_container .drag_asset_selected').data('type-selected');

			if(!type_name) {
				return;
			}

			var type_class = this.get_asset_class(type_name);

			if(!type_class) {
				return;
			}

			if(light.group) {
				light.group.change_type(type_name, type_class);
			}
			else {
				light.change_type(type_name, type_class);
			}
		}
	},*/

	export_background_img: function() {
		if (this.background_img) {
			var canvas = document.createElement("canvas");
			canvas.width = this.background_img.width;
			canvas.height = this.background_img.height;

			var ctx = canvas.getContext("2d");
			ctx.drawImage(this.background_img, 0, 0);

			// Add opacity
			var opacity = 255 / app.ui.menu_bar.opacity;
			var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var imageData = image.data,
				length = imageData.length;

			// set opacity for every fourth pixel
			for (var i=3; i<length; i+=4) {
				imageData[i] = opacity;
			}

			image.data = imageData;
			ctx.putImageData(image, 0, 0);

			var data_url = canvas.toDataURL("image/png");
			return data_url.replace(/^data:image\/(png|jpg);base64,/, "");
		}

		return null;
	},

	/*get_room_count: function() {
		var rooms = this.rooms;
		var count = 0;
		for (var k in rooms) {
			if (rooms.hasOwnProperty(k)) {
				count++;
			}
		}
		return count;
	},*/

	delete_circuits: function() {
		$.each(this.circuits, function(i, circuit) {
			circuit.remove();
			delete app.designer.circuits[i];
		});
	},

	delete_rooms: function() {
		$.each(this.rooms, function(i, room) {
			room.remove();
			delete app.designer.rooms[i];
		});
	},

	delete_light_groups: function() {
		$.each(this.light_groups, function(i, group) {
			group.remove();
			delete app.designer.light_groups[group];
		});
	},

	get_hover_status: function() {
		/*if (this.square_meters === 0) {
			this.recommended_wattage = 0;
			this.reached_wattage_sqm = 0;

		} else {
			this.recommended_wattage = (Math.round((this.recommended_wattage_sqm * this.square_meters) * 10) / 10);
			this.reached_wattage_sqm = (Math.round((this.reached_wattage / this.square_meters) * 10) / 10);
		}

		var str = '';
		str += 'Property /  ';
		str += 'Recommended ';
		str += 'Lumens: ' + commarize(this.recommended_lumens) + ' ';
		str += 'Floor lux: ' + this.recommended_lux + ' ';
		str += 'Workplane lux: ' + this.recommended_workplane_lux + ' ';
		str += 'Power:' + this.recommended_wattage + 'W';
		str += ' ('+ this.recommended_wattage_sqm + 'W p/sqm)';

		str += '. Reached ';
		str += 'Lumens: ' + commarize(this.reached_lumens) + ' ';
		str += 'Floor lux: ' + this.reached_lux + ' ';
		str += 'Workplane lux: ' + this.reached_workplane_lux + ' ';
		str += 'Power: ' + this.reached_wattage + 'W';
		str += ' ('+ this.reached_wattage_sqm + 'W p/sqm)';
		return str;*/
	},

	/*show_tooltip_at_cursor: function(e, text) {
		app.designer.hide_tooltips();

		var tooltip;
		var tooltip_inner;

		var existing = $('.designer_tooltip');
		if(existing.length > 0) {
			tooltip = $(existing.get(0));
			tooltip_inner = tooltip.find('.tooltip-inner');
		}
		else {
			//create
			tooltip = $('<div class="tooltip right in designer_tooltip"><div class="tooltip-arrow"></div></div>');
			tooltip_inner = $('<div class="tooltip-inner" />');
			tooltip.append(tooltip_inner);
		}

		tooltip_inner.html(text);
		tooltip.css({'top': (e.event.pageY - 15), 'left': (e.event.pageX + 10)});


		if(existing.length === 0) {
			$('body').append(tooltip);

			//if we move over the tooltip - hide active room and or asset....
			tooltip.hover(function(){
				if(app.designer.active_room) {
					app.designer.active_room.set_active(false);
				}
				if(app.designer.active_asset) {
					app.designer.active_asset.set_active(false);
				}
			});
		}

		tooltip.show();
	},*/

	/*hide_tooltips: function() {
		$('.designer_tooltip').hide();
	},*/

	export_rooms: function() {
		var rooms = [];
		$.each(this.rooms, function(i, room) {
			rooms.push(room.export());
		});

		return rooms;
	},

	export_circuits: function() {
		var circuits = [];
		$.each(this.circuits, function(i, circuit) {
			if (circuit.room) {
				circuits.push(circuit.export());
			}
		});

		return circuits;
	},

	export_light_groups: function() {
		var light_groups = [];
		$.each(this.light_groups, function(i, group) {
			light_groups.push(group.export());
		});

		return light_groups;
	},

	draw_circuits: function() {
		for (var c  in app.designer.circuits) {
			app.designer.circuits[c].redraw_connections();
		}
	},

	refresh_rooms_status: function() {
		this.square_meters = 0;
		this.recommended_lux = 0;
		this.recommended_lumens = 0;
		this.recommended_wattage = 0;
		this.reached_lux = 0;
		this.reached_lumens = 0;
		this.reached_wattage = 0;
		this.reached_workplane_lux = 0;

		for (var i in this.rooms) {
			var room = this.rooms[i];

			room.refresh_square_meters();
			room.refresh_recommended_lux();
			room.refresh_recommended_lumens();
			room.refresh_recommended_wattage();
			room.refresh_reached_lumens();
			room.refresh_reached_lux();

			this.square_meters += room.square_meters;
			this.recommended_lux += room.recommended_lux;
			this.recommended_lumens += room.recommended_lumens;
			this.recommended_wattage += room.recommended_wattage;
			this.reached_lux += room.reached_lux;
			this.reached_lumens += room.reached_lumens;
			this.reached_wattage += room.reached_wattage;
			this.reached_workplane_lux += room.reached_workplane_lux;
		}

		this.recommended_wattage = (Math.round(this.recommended_wattage * 10) / 10);
		this.reached_wattage = (Math.round(this.reached_wattage * 10) / 10);

		if (this.square_meters === 0) {
			this.recommended_wattage = 0;
			this.reached_wattage_sqm = 0;

		} else {
			this.recommended_wattage = (Math.round((this.recommended_wattage_sqm * this.square_meters) * 10) / 10);
			this.reached_wattage_sqm = (Math.round((this.reached_wattage / this.square_meters) * 10) / 10);
		}

		// /app.clear_status();
		this.update_stats_box(this.recommended_lumens, this.reached_lumens);
	},

	import: function(prj) {
		app.designer.is_loading = true;

		//this.initialize_new_project();
		this.initialize_new_area();
		this.room_scale = prj.room_scale;

		if (prj.background) {
			this.import_background_image({img_data: prj.background});

		} else {
			this.background = null;
			this.background_img = null;
		}

		if (prj.circuits.length > 0) {
			$.each(prj.circuits, function(i, data) {
				var circuit = new app.Circuit(data);

				if (typeof circuit.room === "number") {
					app.designer.circuits[circuit.id] = circuit;
				}
			});
		}

		if (prj.light_groups.length > 0) {
			$.each(prj.light_groups, function(i, data) {
				var group = new app.LightGroup(data);
				app.designer.light_groups[group.id] = group;
			});
		}

		if (prj.rooms.length > 0) {
			$.each(prj.rooms, function(i, data) {
				var room = new app.Room(data);
				app.designer.rooms[room.id] = room;
			});

		} else {
			app.has_lights = false;
			app.has_furniture = false;
		}

		//map circuit switches (primary & secondary) and room id's to the actual objects...
		for (var i in this.circuits) {
			var circuit = this.circuits[i],
			    switch_id;

			if (typeof circuit.room === "number") {
				circuit.room = this.rooms[circuit.room];
			}

			if (circuit.primary_switch && typeof circuit.primary_switch === "number") {
				switch_id = circuit.primary_switch;
				circuit.primary_switch = this.light_switches[switch_id];
			}

			var secondary_switches = circuit.secondary_switches;

			if (secondary_switches && secondary_switches.length > 0) {
				circuit.secondary_switches = {};

				for (var s in secondary_switches) {
					switch_id = secondary_switches[s];
					circuit.secondary_switches[switch_id] = this.light_switches[switch_id];
				}
			}
		}

		//refresh group outlines (as lights as now in there)..
		$.each(app.designer.light_groups, function(i, group) {
			var lights_count =  _.size(group.lights);
			if (lights_count > 0) {
				group.refresh_outline();

			} else {
				//erroneous group with no lights...
				group.remove();
			}
		});

		this.refresh_rooms_status();
		this.draw_circuits();
		app.ui.draw();
		this.show_stats_box(true);
		if (!prj.background) {
			this.zoom_to_fit();
		}

		app.designer.is_loading = false;
		app.pub('designer_area_loaded', '');

		paper.view.draw();
	},

	is_busy: function() {
		return (
			app.dialog_showing ||
			app.is_dragging() ||
			(app.designer.active_tool !== null && app.designer.active_tool.capture_mouse === true)
		);
	},

	get_total_wire_length: function() {
		var total = 0,
		    i,
            j;

		for (i in this.circuits) {
			var circuit = this.circuits[i];
			for (j in circuit.outline) {
				var outline = circuit.outline[j],
				    point1 = outline.segments[0].point,
				    point2 = (outline.segments[1] === undefined) ? 0 : outline.segments[1].point,
				    dist = (point2 == 0) ? 0 : point1.getDistance(point2) / app.designer.room_scale;

				total += dist;
			}
		}

		for (i in this.light_switches) {
			var light_switch = this.light_switches[i];
			for (j in light_switch.connections) {
				var connection = light_switch.connections[j],
				    point1_ls = connection.segments[0].point,
				    point2_ls = (connection.segments[1] === undefined) ? 0 : connection.segments[1].point,
				    dist_ls = (point2_ls == 0) ? 0 : point1_ls.getDistance(point2_ls) / app.designer.room_scale;

				total += dist_ls;
			}
		}

		return total;
	},

	draw_distance_lines: function() {
		for (var i in this.rooms) {
			this.rooms[i].draw_first_light_distance_lines();
		}
	},

	/*remove_distance_lines: function() {
		for (var i in this.rooms) {
			this.rooms[i].remove_first_light_distance_lines();
		}
	},*/

	hide_distance_lines: function() {
		for (var i in this.rooms) {
			this.rooms[i].hide_first_light_distance_lines();
		}
	},

	get_project_bounds: function() {
		//returns Rectangle of project (content) bounds
		var x1 = null,
		    y1 = null,
		    x2 = null,
		    y2 = null,
		    room,
		    path_x1,
		    path_y1,
		    path_x2,
		    path_y2;

		for (var i in this.rooms) {
			room = this.rooms[i];
			path_x1 = room.path.bounds.x - room.path.strokeWidth;
			path_y1 = room.path.bounds.y - room.path.strokeWidth;
			path_x2 = (path_x1 + room.path.strokeBounds.width + (room.path.strokeWidth * 2));
			path_y2 = (path_y1 + room.path.strokeBounds.height + (room.path.strokeWidth * 2));

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

		if (this.background !== null) {
			if (this.background.bounds.getTopLeft().x < x1) {
				x1 = this.background.bounds.getTopLeft().x;
			}

			if (this.background.bounds.getTopLeft().y < y1) {
				y1 = this.background.bounds.getTopLeft().y;
			}

			if (this.background.bounds.getBottomRight().x > x2) {
				x2 = this.background.bounds.getBottomRight().x;
			}

			if (this.background.bounds.getBottomRight().y > y2) {
				y2 = this.background.bounds.getBottomRight().y;
			}
		}

		return new Rectangle({
			from: [x1, y1],
			to: [x2, y2]
		});
	},

	init_stats_box: function() {
		this.stats_box = $('#stats_box');
		this.stats_box_recommended_lumens = $('#recommended_lumens_value');
		this.stats_box_reached_lumens = $('#reached_lumens_value');
	},

	show_stats_box: function(show) {
		if (show) {
			this.stats_box.show();

		} else {
			this.stats_box.hide();
		}
	},

	update_stats_box: function(recommended_lumens, reached_lumens) {
		this.stats_box_recommended_lumens.html(commarize(recommended_lumens));
		this.stats_box_reached_lumens.html(commarize(reached_lumens));
	},

	zoom_to_fit: function() {
		var project_bounds = this.get_project_bounds(),
		    c_width = this.element.width(),
		    c_height = this.element.height(),
		    zoom_factor_width = (c_width / project_bounds.width),
		    zoom_factor_height = (c_height / (project_bounds.height)),
		    room_zoom_factor = (zoom_factor_width < zoom_factor_height ? zoom_factor_width : zoom_factor_height);

		room_zoom_factor -= 0.1;

		this.set_center(project_bounds.center);
		this.zoom(this.sanitize_zoom(room_zoom_factor));
	},

	populate_notes: function () {
		//there is probably a better way to do this but it's late and
		//and i can't think of a better way right now
		this.notes = [];
		for (var i in this.rooms) {
			var room = this.rooms[i];
			for (var j in room.assets) {
				var asset = room.assets[j];
				if (asset.note.notetext !== '') {
					asset.note.id = this.notes.length + 1;
					this.notes.push(asset.note);
					//console.log("added note " + asset.note.id + "text = " + asset.note.notetext);
				}
			}
		}
	},

	add_notes: function() {
		this.remove_notes();
		this.populate_notes();
		for (var i in this.rooms) {
			var room = this.rooms[i];
			for (var j in room.assets) {
				var asset = room.assets[j];
				asset.draw_note();
			}
		}
		app.ui.draw();
	},

	remove_notes: function() {
		for (var i in this.note_paths) {
			this.note_paths[i].remove();
		}
		app.ui.draw();
	},

	set_cursor: function(cursor, persist) {
		//persist - keep until actively reset (passed into reset_cursor)
		if (this.CURSORS[cursor]) {
			cursor = this.CURSORS[cursor];
		}

		if (this.cursor_persist) {
			return false;
		}

		this.current_cursor = cursor;
		this.cursor_persist = persist;
		document.body.style.cursor = cursor;
	},

	reset_cursor: function(cursor) {
		if (this.cursor_persist) {
			if (this.CURSORS[cursor]) {
				cursor = this.CURSORS[cursor];
			}

			if (cursor !== this.current_cursor) {
				return false;
			}
		}

		document.body.style.cursor = 'auto';
		this.current_cursor = null;
		this.cursor_persist = false;
	},

	hide_light_switches: function() {
		for (var index in app.designer.light_switches) {
			app.designer.light_switches[index].hide();
		}
	},

	show_light_switches: function() {
		for (var index in app.designer.light_switches) {
			app.designer.light_switches[index].show();
		}
	},

	get_element_on_screen_position: function(paperjs_path) {
		var zoom = paper.view.zoom;

		return {
			top: this.element.position().top + ((paperjs_path.bounds.y * zoom) - (paper.view.bounds.y * zoom)),
			left: this.element.position().left + ((paperjs_path.bounds.x * zoom) - (paper.view.bounds.x * zoom))
		};
	},

	set_opacity: function(opacity) {
		if (!this.layers.background || this.background == null) {
            return;
        }

		if (opacity < 0) {
			opacity = 0;

		} else if (opacity > 1) {
			opacity = 1;
		}

		this.background.opacity = opacity;
	}
};