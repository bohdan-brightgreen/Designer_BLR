/**
 *	Class app.Asset
 *	Represents a piece of furniture (inherited by light)
 *
 */
app.Asset = app.BaseAsset.extend({
	class: "asset",
	type: null,
	name: null,
	raster: null,
	width: 0,
	height: 0,
	width_meters: null,
	height_meters: null,
	rotation: 0,
	sticky: false,
	dragging: null,
	note: null,
	flipped : false,
	allow_flip : false,
	sticky_wall: null,
	room: null,
	active: false,
	move_start_x: null, //keeps the starting position when move starts so we can cancel it.
	move_start_y: null,
	is_dragging: null,

	wall_distance_line_x: null,
	wall_distance_line_y: null,

	base_style: {
		fillColor: 'white',
		fillAlpha: 0.01,
		strokeColor: 'white',
		strokeAlpha: 0.01,
		strokeWidth: 2,
		rasterOpacity: 0.7
	},

	active_style: {
		fillColor: 'white',
		fillAlpha: 0.01,
		strokeColor: 'white',
		strokeAlpha: 0.01,
		strokeWidth: 2,
		rasterOpacity: 1
	},

	init: function(data) {
		this.create_path(data);

        this.id = (data.id) ? data.id : this.path.id;

		this.type = data.type;
		this.set_style(this.base_style);

		this._super(data);

		if (data.rotation !== undefined && data.rotation !== 0) {
			this.rotate_by(data.rotation);
		}

        this.note = (data.note) ? data.note : {notetext: "", id: ""};
		this.flipped = (data.flipped) ? data.flipped : false;
		this.sticky_wall = (data.sticky_wall) ? data.sticky_wall : null;

		//derive name if doesn't exist...
		if (!this.name) {
			this.name = this.type.toTitle();
		}

		this.is_dragging = false;
	},

	create_path: function(data) {
		this._super(data);

		if (!data.original_width) {
			this.original_width = this.width;
			this.original_height = this.height;

		} else {
			this.original_width = data.original_width;
			this.original_height = data.original_height;
		}

		if (data.width) {
			this.width = data.width;
		}

		if (data.height) {
			this.height = data.height;
		}

		if (!data.original_width_meters) {
			this.original_width_meters = this.width_meters;

			//calculate height meters...
			var meters_ratio = (this.width / this.width_meters);
			this.height_meters =  (this.height / meters_ratio);
			this.original_height_meters = this.height_meters;

		} else {
			this.original_width_meters = data.original_width_meters;
			this.original_height_meters = data.original_height_meters;
		}

		//if fancy resize, calculate & persist step_size_meters...
		if (this.fancy_resize_data) {
			var meters_ratio_fancy = (this.original_width / this.original_width_meters);
			for (var i in this.fancy_resize_data.steps) {
				var step = this.fancy_resize_data.steps[i];
				step.step_size_meters = (step.step_size / meters_ratio_fancy);
			}
		}

		if (data.width_meters) {
			this.width_meters = data.width_meters;
		}

		if (data.height_meters) {
			this.height_meters = data.height_meters;
		}

        var original_raster_width = this.original_width,
            original_raster_height = this.original_height;

        if (this.is_light()) {
            this.raster = new Path.Circle({
                center: [-1000, -1000],
                radius: this.width / 2,
                fillColor: this.display_colour,
                strokeColor: this.display_colour
            });

        } else {
            var raster_name = this.type.toLowerCase() + '-icon';

            if ($('img#' + raster_name).length == 0) {
                console.error('Error: Could not load raster image  with id "' + raster_name + '". Reverting to unknown-icon');
                raster_name = 'unknown-icon';
            }

            this.raster = new Raster(raster_name, new Rectangle(-1000, -1000, original_raster_width, original_raster_height));
        }

        //this.raster = new Raster(raster_name, new Rectangle(-1000, -1000, original_raster_width, original_raster_height));
		this.raster.insertBelow(this.path);
		this.raster.ignore_events = true;

		if (!this.is_light()) {
			this.raster.opacity = this.base_style.rasterOpacity;
		}

		//set path size back to original (if resized) to get correct center...
		this.path.bounds.width = original_raster_width;
		this.path.bounds.height = original_raster_height;
		this.raster.bounds.setCenter(this.path.bounds.getCenter());

		//adjust asset size based on room scale...
		if (!this.has_resized() && app.designer.room_scale !== null && this.is_scalable()) {
			this.rescale();

		} else {
			//no room scale - base size...
			this.set_size(this.width, this.height);
		}

		if (this.fancy_resize_data) {
			this.fancy_resize();
		}

		this.flipped = (data.flipped) ? data.flipped : false;

		if (this.flipped) {
			this.flip(null);
		}
	},

	move: function(x, y) {
		if (this.move_start_x === null && this.move_start_x === null) {
			this.move_start_x = this.path.position.x;
			this.move_start_y = this.path.position.y;
		}

		if (this.move_start_x !== x && this.move_start_y !== y) {
			y += (this.path.bounds.height / 2) + app.designer.drag_offset.y;
			x += app.designer.drag_offset.x;
		}

		//if sticky asset, not in a group, and an active room - attempt to stick to wall...
		if (this.sticky && !this.group && app.designer.active_room) {
			var sticky_xy = this.get_stick_to_xy(app.designer.active_room, x, y);
			x = sticky_xy[0];
			y = sticky_xy[1];
			var rotate = sticky_xy[2];

			if (rotate != -1) {
				this.set_rotation(rotate);
			}
		}

		//get position changes...
		var delta = {
			x: (x - this.path.position.x),
			y: (y - this.path.position.y)
		};

		this.move_by(delta);
	},

	move_by: function(delta) {
		this.path.translate(delta);

		if (this.raster) {
			this.raster.translate(delta);
		}
	},

	cancel_move: function() {
		//this.move(this.move_start_x, this.move_start_y);

		var delta = {
			x: (this.move_start_x - this.path.bounds.center.x),
			y: (this.move_start_y - this.path.bounds.center.y)
		};

		if (this.is_light() && this.group) {
			this.group.move_by(delta);
			//this.group.hide_outline();
			this.group.refresh_outline();

		} else {
			this.move_by(delta);
		}

		this.hide_wall_distance_lines();

		this.is_dragging = false;
		this.path.ignore_events = false;
		this.raster.ignore_events = false;

		this.move_start_x = null;
		this.move_start_y = null;

		//if even after cancelling the move there is still no room just remove the asset
		if (this.room === null) {
			this.remove();
		}
	},

	get_stick_to_xy: function(room, x, y) {
		var rx = room.path.bounds.x,
		    rx2 = (rx + room.path.bounds.width),
		    ry = room.path.bounds.y,
		    ry2 = (ry + room.path.bounds.height),
		    range = this.sticky_range || 50,
		    overlap = -1;

		//find closest wall...
		var distances = [
			{wall: 'x', distance: (x - rx)},
			{wall: 'y', distance: (y - ry)},
			{wall: 'x2', distance: (rx2 - x)},
			{wall: 'y2', distance: (ry2 - y)}
		];

		distances.sort(function(a, b) {
			return a.distance - b.distance;
		});

		var closest = distances[0].wall,
		    distance = distances[0].distance,
		    rotate = -1;

		//if within range...
		if (distance <= range) {
			if (closest == 'y') {
				y = ry + ((this.path.bounds.height / 2) - overlap);
				rotate = 90;

			} else if (closest == 'x') {
				x = rx + ((this.path.bounds.width / 2) - overlap);
				rotate = 0;

			} else if (closest == 'x2') {
				x = rx2 - ((this.path.bounds.width / 2) - overlap);
				rotate = 180;

			} else if (closest == 'y2') {
				y = ry2 - ((this.path.bounds.height / 2) - overlap);
				rotate = 270;
			}
		}

		return [x, y, rotate];
	},

	get_sticky_wall: function() {
		var rx = this.room.path.bounds.x,
		    rx2 = (rx + this.room.path.bounds.width),
		    ry = this.room.path.bounds.y,
		    ry2 = (ry + this.room.path.bounds.height),
		    range = this.sticky_range || 50;

		//find closest wall...
		var distances = [
			{wall: 'x', distance: (this.path.position.x - rx)},
			{wall: 'y', distance: (this.path.position.y - ry)},
			{wall: 'x2', distance: (rx2 - this.path.position.x)},
			{wall: 'y2', distance: (ry2 - this.path.position.y)}
		];

		distances.sort(function(a, b) {
			return a.distance > b.distance;
		});

		var closest = distances[0].wall,
		    distance = distances[0].distance;

		//if within range...
		return (distance <= range) ? closest : false;
	},

	rotate: function(rotation) {
		this.path.rotate(rotation);
		this.raster.rotate(rotation);
	},

	rotate_by: function(rotation) {
		this.rotate(rotation);
		this.rotation += rotation;

		if (this.rotation >= 360) {
			this.rotation = (this.rotation - 360);
		}
	},

	set_rotation: function(rotation) {
		//remove current rotation, then rotate...
		this.rotate((0-this.rotation) + rotation);
		this.rotation = rotation;

		if (this.rotation >= 360) {
			this.rotation = (this.rotation - 360);
		}
	},

	flip: function(event) {
		var raster_pos = this.raster._position,
		    x = raster_pos.x,
		    y = raster_pos.y,
		    mx = new Matrix(-1, 0, 0, 1, 0, 0),
		    pos = new Point(x, y),
		    rotation = this.rotation,
		    rotation_step = this.rotation_step;

		//if asset is rotated vertically, set matrix to translateY instead of translateX
		if (rotation === 90 || rotation === -90 || rotation === 270 || rotation === -270) {
			if (rotation_step !== 90) {
				mx = new Matrix(1, 0, 0, -1, 0, 0);
			}
		}

		//if rotation === 0, the door is on left hand wall
		//if rotation === 180, the door is on right hand wall
		if ((rotation === 0 || rotation === 180)  && rotation_step  === 90) {
			mx = new Matrix(1, 0, 0, -1, 0, 0);
		}

		this.raster.transform(mx);
		this.raster.position = pos;
		this.flipped = !(this.flipped);
		app.ui.draw();
	},

	set_active: function(active, event) {
		if (active && !app.designer.active_room) {
			if (this.room) {
				this.room.set_active(true);
			}
		}

		if (!active) {
			//if also leaving room...
			if (event && !this.room.path.contains(event.point)) {
				this.room.on_mouse_leave(event);
				//app.clear_status();
			}
		}

        this.raster.opacity = (active) ? this.active_style.rasterOpacity : this.base_style.rasterOpacity;

		this._super(active);

		if (active) {
			app.designer.set_cursor('pointer');

		} else {
			app.designer.reset_cursor();
		}
	},

	move_finish: function() {
		if (this.sticky) {
			this.sticky_wall = this.get_sticky_wall();
		}

		this.is_dragging = false;
		this.move_start_x = null;
		this.move_start_y = null;

		this.path.ignore_events = false;
		this.raster.ignore_events = false;

		if (!this.selected) {
			this.hide_wall_distance_lines();
		}

		this.lock_to_room();
		this.room.show_circuits();
	},

	on_mouse_enter: function(event) {
		if (!app.designer.is_busy()) {
			this.set_active(true);
			this.refresh_status();
		}
	},

	on_mouse_down: function(event) {
		/* note - mouse down events for asset are handled in designer */
		if (event.event.button == 2) {
			console.log(this);
			window.asset = this;
		}
	},

	on_mouse_drag:function(event) {
		if (!this.is_resizing && !app.designer.is_busy()) {

			if (!app.dragging && this.room) {
				this.room.hide_circuits();
			}

			this.is_dragging = true;
			app.dragging = true;

			app.drag_type = this.type;
			app.designer.drag_asset = this;
			app.designer.drag_offset.x = (this.path.bounds.width / 2) + (event.target.bounds.x - event.point.x);
			app.designer.drag_offset.y = (event.target.bounds.y - event.point.y);

			this.path.ignore_events = true;
			if (this.raster) {
				this.raster.ignore_events = true;
			}

			this.set_active(true);
			//this.hide_controls();

			//unselect anything thats selected...
			if (app.designer.selected && app.designer.selected !== this && app.designer.selected.unselect) {
				app.designer.selected.unselect();
			}
		}

		if (this.is_dragging) {
			this.draw_wall_distance_lines(app.designer.active_room);
		}
	},

	fancy_resize: function(x, y, enforce_min) {
		var active_image = this.type,
		    img_height = this.original_height,
		    img_width = this.original_width;

		//undo rotation...
		if (this.rotation !== 0) {
			this.path.rotate((0 - this.rotation));
		}

		var step = this.get_fancy_resize_image();

		if (step) {
			active_image = step.image;

			if (this.fancy_resize_data.axis === 'y') {
				img_height = step.step_size;

			} else {
				img_width = step.step_size;
			}
		}

		var icon_name = (active_image + '-icon');

		if (this.raster.image.id !== icon_name) {
			var old_raster = this.raster;
			this.raster = new Raster(icon_name, new Rectangle(this.path.bounds.x, this.path.bounds.y, img_width, img_height));
			this.raster.ignore_events = true;
			this.raster.insertBelow(this.path);
			this.raster.opacity = this.base_style.rasterOpacity;

			this.raster.bounds.width = this.path.bounds.width;
			this.raster.bounds.height = this.path.bounds.height;
			this.raster.bounds.setCenter(old_raster.bounds.getCenter());
			old_raster.remove();

			//rotate new raster...
			if (this.rotation !== 0) {
				this.raster.rotate(this.rotation);
			}
		}

		//redo rotation...
		if (this.rotation !== 0) {
			this.path.rotate(this.rotation);
		}
	},

	get_fancy_resize_image: function(axis) {
		var size,
		    active_size;

		if (!axis) {
			axis = this.fancy_resize_data.axis;
		}

		if (axis === 'y') {
			//dynamic height meters
			size = (this.path.bounds.height / app.designer.room_scale);

		} else {
			//dynamic width meters
			size = (this.path.bounds.width / app.designer.room_scale);
		}

		for (var i in this.fancy_resize_data.steps) {
			var step = this.fancy_resize_data.steps[i];
			if (size >= step.step_size_meters) {
				active_size = step;
			}
		}

		return active_size;
	},

	resize: function(x, y, enforce_min) {
		this.path.scale(x, y, this.resize_anchor);
		this.raster.scale(x, y, this.resize_anchor);

		if (enforce_min) {
			var min_size = 3;

			if (this.path.bounds.width < min_size) {
				this.path.bounds.width = min_size;
				this.raster.bounds.width = min_size;
			}

			if (this.path.bounds.height < min_size) {
				this.path.bounds.height = min_size;
				this.raster.bounds.height = min_size;
			}
		}

		this.width = this.path.bounds.width;
		this.height = this.path.bounds.height;

		this.refresh_status();
	},

	after_resizable_resize: function() {
		//if this asset has a width_meters - re-set it...
		if (this.width_meters !== null) {
			//unrotate...
			var has_rotation = (this.rotation !== undefined && this.rotation !== 0);

			//undo rotation of path to get scale...
			if (has_rotation) {
				this.path.rotate(0 - this.rotation);
			}

			this.width_meters = (this.path.bounds.width / app.designer.room_scale);
			this.height_meters = (this.path.bounds.height / app.designer.room_scale);

			if (has_rotation) {
				//redo rotation...
				this.path.rotate(this.rotation);
			}
		}
	},

	rescale: function(scale) {
		if (!scale) {
			scale = app.designer.room_scale;
		}

		//bail if no scale yo...
		if (!scale) {
			return;
		}

		//remember stickiness (to reattach after scale...)
		var sticky_anchor;
		if (this.sticky_wall) {
			switch(this.sticky_wall) {
				case 'x':
					sticky_anchor = this.path.bounds.bottomLeft;
					break;
				case 'x2':
					sticky_anchor = this.path.bounds.bottomRight;
					break;
				case 'y':
					sticky_anchor = this.path.bounds.topLeft;
					break;
				case 'y2':
					sticky_anchor = this.path.bounds.bottomLeft;
					break;
			}
		}

		var has_rotation = (this.rotation !== undefined && this.rotation !== 0);

		//undo rotation of path to get scale...
		if (has_rotation) {
			this.path.rotate(0 - this.rotation);
		}

		var real_width = (this.width_meters * scale);

		if (!this.height_meters) {
			var height_to_width_ratio = (this.original_height / this.original_width);
			//derive height meters...
			this.height_meters = (real_width * height_to_width_ratio) / app.designer.room_scale;
		}

		var real_height = (this.height_meters * scale),
		    scale_x = (real_width / this.path.bounds.width),
		    scale_y = (real_height / this.path.bounds.height);

		this.resize_anchor = (sticky_anchor) ? sticky_anchor : this.path.bounds.center;
		this.resize(scale_x, scale_y);

		if (has_rotation) {
			//redo rotation...
			this.path.rotate(this.rotation);
			this.width = this.path.bounds.width;
			this.height = this.path.bounds.height;
		}
	},

	is_scalable: function() {
		return (this.width_meters !== null);
	},

	set_size: function(width, height) {
		this.width = width;
		this.height = height;
		this.raster.bounds.width = this.width;
		this.raster.bounds.height = this.height;
		this.path.bounds.width = this.width;
		this.path.bounds.height = this.height;
	},

	has_resized: function() {
		return (this.width !== this.original_width && this.height !== this.original_height);
	},

	on_mouse_up: function(event) {
		//Note - not called after move (as drag events for moving assets are handled in designer)
		//you want this.move_finish

		//if we moused up on this asset - but another was dragging...
		if (app.is_dragging() && !this.is_dragging && app.designer.drag_asset.path.isBelow(this.path)) {
			app.designer.drag_asset.set_active(false);
		}
	},

	on_mouse_leave: function(event) {
		if (this.is_resizing || this.is_dragging) {
			return;
		}

		if (app.is_dragging() && app.designer.active_room) {
			//if also leaving room...
			if (!app.designer.active_room.path.contains(event.point)) {
				app.designer.active_room.set_active(false, event);
			}
		}

		if (!app.designer.is_busy()) {
			this.set_active(false, event);
		}
	},

	draw_wall_distance_lines: function(room) {
		if (!room) {
			this.hide_wall_distance_lines();
			return;
		}

		var wall_point_x = room.get_closest_point_on_wall_by_axis(this.path.bounds.center, "x"),
		    wall_point_y = room.get_closest_point_on_wall_by_axis(this.path.bounds.center, "y"),
		    asset_point_x,
		    asset_point_y;

		if (!this.wall_distance_from_center) {
			//depending on wall, draw lines from left or right side of asset, and top or bottom sides.
			asset_point_x = (wall_point_x.x > this.path.bounds.center.x ? this.path.bounds.rightCenter : this.path.bounds.leftCenter);
			asset_point_y = (wall_point_y.y > this.path.bounds.center.y ? this.path.bounds.bottomCenter : this.path.bounds.topCenter);

		} else {
			//always just draw from center (e.g for a light)
			asset_point_x = asset_point_y = this.path.bounds.center;
		}

		this.wall_distance_line_x = (this.wall_distance_line_x || new app.DistanceLine());
		this.wall_distance_line_x.refresh_points(wall_point_x, asset_point_x);

		this.wall_distance_line_y = (this.wall_distance_line_y || new app.DistanceLine());
		this.wall_distance_line_y.refresh_points(wall_point_y, asset_point_y);
	},

	hide_wall_distance_lines: function() {
		if (this.wall_distance_line_x) {
			this.wall_distance_line_x.hide();
		}

		if (this.wall_distance_line_x) {
			this.wall_distance_line_y.hide();
		}
	},

	remove_wall_distance_lines: function() {
		if (this.wall_distance_line_x) {
			this.wall_distance_line_x.remove();
		}

		if (this.wall_distance_line_x) {
			this.wall_distance_line_y.remove();
		}
	},

	show_note_dialog : function(position) {
		var dialog_height_expanded = 250,
		    dialog_height_collapsed = 180;

		if (!app.Room._asset_note_dialog) {
			app.Room._asset_note_dialog = $('.asset_note_dialog').dialog({
				title: 'Note for ' + this.name,
				width: 275,
				height: dialog_height_collapsed,
				resizable: false,
				draggable: true,
				autoOpen: false,
				dialogClass: 'small_dialog_heading',
				open: function() {
                    app.dialog_showing = true;
                }
			});
		}

		$("#note_text").val("");
		$("#note_text").maxlength('destroy');

		app.Room._asset_note_dialog.dialog('option', 'title', 'Note for ' + this.name);
		app.Room._asset_note_dialog.dialog('option', 'height', dialog_height_expanded);

		app.Room._asset_note_dialog.dialog('option', 'buttons', {
			"Save": $.proxy(this.save_asset_note, this),
			"Cancel": function() {
                $(this).dialog("close");
            }
		});

		app.Room._asset_note_dialog.dialog('option', 'beforeClose', $.proxy(function() {
			app.dialog_showing = false;
		}, this));

		//refresh position...
		var pos_x = position.x,
		    pos_y = (position.y - app.Room._asset_note_dialog.height());

		$("#note_text").val(this.note.notetext).maxlength({max: 100});

		//open dialog...
		app.Room._asset_note_dialog.dialog('option', 'position', [pos_x, pos_y]);
		app.Room._asset_note_dialog.dialog('open');
	},

	save_asset_note : function() {
		this.note.notetext = $("#note_text").val();
		app.Room._asset_note_dialog.dialog('close');
	},

	select: function() {
		this._super();
		this.draw_wall_distance_lines(this.room);
	},

	unselect: function() {
		if (this.is_dragging) {
			return false;
		}

		this.hide_wall_distance_lines();
		this._super();
	},

	/*is_active: function() {
		return this.active;
	},*/

	/*get_drag_offset_x: function(event) {
		var left_diff = event.point.x - event.target.bounds.x;
		var right_diff = (event.target.bounds.x + event.target.bounds.width) - event.point.x;

		if(left_diff < right_diff) {
			return (this.path.bounds.width / 2) + 3;
		}
		else {
			return (0 - ((this.path.bounds.width / 2) + 3));
		}
	},*/

	show_controls: function(leave_existing) {
		//this._super(true);
	},

	hide_controls: function() {
		//app.designer.controls_hover = false;
		//this._super();
	},

	hide: function() {
		this.path.visible = false;
	},

	show: function() {
		this.path.visible = true;
	},

	is_visible: function() {
		return this.path.visible;
	},

	is_light: function() {
		return (this instanceof app.Light);
	},

	is_light_switch: function() {
		return (
			this instanceof app.Asset.LightSwitch ||
			this instanceof app.Asset.LightSwitchDimmer ||
			this instanceof app.Asset.LightSwitchTouch
		);
	},

	get_dimensions: function() {
		var room_scale = app.designer.room_scale;

		return {
			width: Math.round(this.path.bounds.width / room_scale * 10) / 10,
			height: Math.round(this.path.bounds.height / room_scale * 10) / 10
		};
	},

	get_hover_status: function() {
		if (app.designer.is_busy()) {
			return '';
		}

		var str = this.name,
		    dimensions = this.get_dimensions();

		if (dimensions) {
			str += ' - ' + dimensions.width + 'x' + dimensions.height + ' (meters)';

			if (this.note && this.note.notetext && this.note.notetext !== '') {
				str += ' Notes: ' + this.note.notetext;
			}
		}

		return str;
	},

	refresh_status: function() {
		app.set_status(this.get_hover_status());
	},

	export: function() {
		var _rotation = this.rotation,
		    has_rotation = (this.rotation !== undefined && this.rotation !== 0),
            toFixedValue = 4;

		//undo rotation before save...
		if (has_rotation) {
			this.path.rotate(0 - this.rotation);
		}

		/*var asset = {
			id: this.id,
			type: this.type,
			x: this.path.bounds.x,
			y: this.path.bounds.y,
			width: this.path.bounds.width,
			height: this.path.bounds.height,
			original_width: this.original_width,
			original_height: this.original_height,
			stroke_width: this.base_style.strokeWidth,
			rotation: _rotation,
			segments: this.export_segments(),
			note : this.note,
			flipped : this.flipped
		};

		if (this.is_scalable) {
			asset.width_meters = this.width_meters;
			asset.height_meters = this.height_meters;
			asset.original_width_meters = this.original_width_meters;
			asset.original_height_meters = this.original_height_meters;
		}*/

        var asset = {
            id: this.id,
            type: this.type,
            x: parseFloat(this.path.bounds.x).toFixed(toFixedValue),
            y: parseFloat(this.path.bounds.y).toFixed(toFixedValue),
            width: parseFloat(this.path.bounds.width).toFixed(toFixedValue),
            height: parseFloat(this.path.bounds.height).toFixed(toFixedValue),
            original_width: parseFloat(this.original_width).toFixed(toFixedValue),
            original_height: parseFloat(this.original_height).toFixed(toFixedValue),
            stroke_width: this.base_style.strokeWidth,
            rotation: _rotation,
            segments: this.export_segments(),
            note : this.note,
            flipped : this.flipped
        };

        if (this.is_scalable) {
            asset.width_meters = parseFloat(this.width_meters).toFixed(toFixedValue);
            asset.height_meters = parseFloat(this.height_meters).toFixed(toFixedValue);
            asset.original_width_meters = parseFloat(this.original_width_meters).toFixed(toFixedValue);
            asset.original_height_meters = parseFloat(this.original_height_meters).toFixed(toFixedValue);
        }

		if (this.sticky_wall) {
			asset.sticky_wall = this.sticky_wall;
		}

		if (has_rotation) {
			//redo rotation...
			this.path.rotate(this.rotation);
		}

		return asset;
	},

	remove: function() {
		this.path.remove();

		if (this.room) {
            this.unselect();
			this.room.remove_asset(this);
		}

		if (this.raster) {
			this.raster.remove();
		}

		this.remove_wall_distance_lines();
		app.ui.draw();
	},

	draw_note: function() {
		if (this.note.id !== '') {
			var center = this.path.bounds.getCenter(),
			    radius = (app.designer.room_scale * 0.25) / 2;

			if ((radius * 2) > (this.path.bounds.width - (this.path.bounds.width / 2))) {
				center = this.path.bounds.getTopRight();
				center = new Point(center.x + radius, center.y - radius);
			}

			var circle = new Path.Circle(new Point(center.x, center.y), radius);

			circle.fillColor = 'white';
			circle.strokeColor = 'black';

			var text = new PointText(new Point(center.x, center.y + (radius / 3)));
			text.justification = 'center';
			text.fillColor = '#5252F7';
			text.fontSize = radius;
			text.content = this.note.id;
			app.designer.note_paths.push(text);
			app.designer.note_paths.push(circle);
		}
	},

	lock_to_room: function() {
		if (this.room !== null) {
			if (this.room.path.bounds.height < this.path.bounds.height) {
				this.set_size(this.path.bounds.width, this.room.path.bounds.height - (this.room.path.strokeWidth * 2));
			}

			if (this.room.path.bounds.width < this.path.bounds.width) {
				this.set_size(this.room.path.bounds.width - (this.room.path.strokeWidth * 2), this.path.bounds.height);
			}

			for (var i=0; i<2; i++) {
				if (!this.room.path.contains(this.path.bounds.topLeft) && this.room.path.contains(this.path.bounds.topRight)) {
					this.move_by({
						x: ((this.room.path.bounds.left - this.path.bounds.topLeft.x) + this.room.path.strokeWidth),
						y: 0
					});
				}

				if (this.room.path.contains(this.path.bounds.topLeft) && !this.room.path.contains(this.path.bounds.topRight)) {
					this.move_by({
						x: ((this.room.path.bounds.right - this.path.bounds.topRight.x) - this.room.path.strokeWidth),
						y: 0
					});
				}

				if (!this.room.path.contains(this.path.bounds.topLeft) && !this.room.path.contains(this.path.bounds.topRight)) {
					this.move_by({
						x: 0,
						y: (this.room.path.bounds.top - this.path.bounds.topLeft.y  + this.room.path.strokeWidth)
					});
				}

				if (!this.room.path.contains(this.path.bounds.bottomLeft) && !this.room.path.contains(this.path.bounds.bottomRight)) {
					this.move_by({
						x: 0,
						y: ((this.room.path.bounds.bottomRight.y - this.path.bounds.bottomRight.y) - this.room.path.strokeWidth)
					});
				}
			}
		}

		this.is_dragging = false;
		this.path.ignore_events = false;

		if (this.raster) {
			this.raster.ignore_events = false;
		}
	},

	is_in_room: function () {
        if (this.room === null) {
            return false;
        }

        return (
            this.room.path.bounds.contains(this.path.bounds.getTopLeft()) ||
            this.room.path.bounds.contains(this.path.bounds.getTopRight()) ||
            this.room.path.bounds.contains(this.path.bounds.getBottomRight()) ||
            this.room.path.bounds.contains(this.path.bounds.getBottomLeft())
        );
    }
});