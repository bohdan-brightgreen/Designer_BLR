/**
 *	Class app.ResizableAsset
 *	An asset that can be restructured / segments altered.
 *
 */
app.RestructurableAsset = app.BaseAsset.extend({

	bounds_hash: null,
	handles_group: null,
	handles: null,

	handle_size: 10,
	handle_color: 'black',
	handle_active_color: app.colours.main,
	handle_selected_color: 'red',
	handle_mouse_down: false,

	active_handle: null,
	selected_handle: null,

	resize_direction: null,
	resize_anchor: null,
	drag_direction: null,

	is_resizing: null,
	user_resized: null,
	user_restructured: null,

	CURSOR : {
		top: 'n-resize',
		left: 'w-resize',
		bottom: 's-resize',
		right: 'e-resize',
		topleft: 'nw-resize',
		topright: 'ne-resize',
		bottomleft: 'sw-resize',
		bottomright: 'se-resize'
	},

	SNAP_TOLERANCE: 4,

	init: function(data) {
		this.handles = [];
		this._super(data);
	},

	is_rectangle: function() {
		return (
			this.path.segments.length === 4 &&
			(this.path.segments[0].point.x === this.path.segments[1].point.x) &&
			(this.path.segments[2].point.x === this.path.segments[3].point.x) &&
			(this.path.segments[0].point.y === this.path.segments[3].point.y) &&
			(this.path.segments[1].point.y === this.path.segments[2].point.y)
		);
	},

	/**
	 * Handles...
	 */

	show_handles: function() {
		var check_bounds_hash = this.get_bounds_hash();

		//has the item moved since last we created the handles?
		if (this.bounds_hash !== check_bounds_hash) {

			//if segments count changes - recreate handles...
			if (this.path.segments.length !== this.handles.length) {
				this.create_handles();

			} else {
				//otherwise just reposition the existing...
				this.reposition_handles();
			}

			this.bounds_hash = check_bounds_hash;
		}

		app.designer.layers.handles.addChild(this.handles_group);
	},

	create_handles: function() {
		if (this.handles_group) {
			_.invoke(this.handles, 'remove');
			this.handles_group.remove();
		}

		this.handles = [];
		for (var i in this.path.segments) {
			var segment = this.path.segments[i],
			    size = this.handle_size;

			var handle = new Path.Rectangle({
				point: [segment.point.x - (size / 2), segment.point.y - (size / 2)],
				size: [size, size],
				fillColor: this.handle_color
			});

			handle.onMouseEnter = $.proxy(this.on_handle_mouse_enter, this);
			handle.onMouseDown = $.proxy(this.on_handle_mouse_down, this);
			handle.onMouseDrag = $.proxy(this.on_handle_mouse_drag, this);
			handle.onMouseUp = $.proxy(this.on_handle_mouse_up, this);
			handle.onMouseLeave = $.proxy(this.on_handle_mouse_leave, this);

			handle.segment = segment;
			this.handles[i] = handle;
		}

		this.handles_group = new Group(this.handles);
	},

	reposition_handles: function() {
		for (var i in this.path.segments) {
			var segment = this.path.segments[i],
			    handle = this.handles[i];

			handle.position = new Point(segment.point.x, segment.point.y);
			handle.segment = segment;
		}
	},

	hide_handles: function() {
		if (this.handles_group && this.handles_group.layer) {
			if (this.active_handle) {
				this.set_handle_active(false, this.active_handle);
			}

			this.handles_group.remove();
		}
	},

	on_handle_mouse_enter: function(event) {
		if (!app.designer.is_busy()) {
			this.set_handle_cursor(event.point);
			this.set_handle_active(true, event.target);
		}

		this.on_mouse_enter(event);
	},

	set_handle_cursor: function(point) {
		app.designer.reset_cursor();
		this.resize_direction = this.get_resize_direction(point, true);
		this.set_resize_cursor(this.resize_direction);
	},

	on_handle_mouse_down: function(event) {
		this.set_handle_cursor(event.point);
		this.handle_mouse_down = true;
		this.on_mouse_down(event);
	},

	on_handle_mouse_drag: function(event) {
		if (!this.active_handle) {
			this.set_handle_active(true, event.target);
		}

		this.on_mouse_drag(event, true);
	},

	on_handle_mouse_up: function(event) {
		app.designer.cancel_mouseup = true;

		if (!this.user_resized) {
			//select or unselect handle..
            var selected = !(this.selected_handle);
            this.set_handle_selected(selected, this.active_handle);

		} else {
			this.on_mouse_up(event);
			this.show_handles();
			app.designer.reset_cursor();
		}
	},

	set_handle_active: function(is_active, handle) {
		if (handle === this.selected_handle) {
			return;
		}

		if (is_active) {
			handle.style.fillColor = this.handle_active_color;
			this.active_handle = handle;

		} else {
			this.active_handle.style.fillColor = this.handle_color;
			this.active_handle = null;
		}
	},

	set_handle_selected: function(is_selected, handle) {
		if (is_selected) {
			handle.style.fillColor = this.handle_selected_color;
			this.selected_handle = handle;

		} else {
            handle.style.fillColor = (this.selected_handle === this.active_handle) ? this.handle_active_color : this.handle_color;
			this.selected_handle = null;
		}
	},

	on_handle_mouse_leave: function(event) {
		if (!app.designer.is_busy()) {

			app.designer.reset_cursor();

			if (this.active_handle) {
				this.set_handle_active(false, this.active_handle);
			}

			if (this.selected_handle) {
				this.active_handle = null;
				this.set_handle_selected(false, this.selected_handle);
			}

			if (!this.path.contains(event.point)) {
				this.set_active(false);
			}

		}
	},

	delete_selected_handle: function() {
		if (confirm('Are you sure you wish to remove this segment?')) {
			this.selected_handle.segment.remove();
			this.show_handles();
		}
	},

	/**
	 *  Path
	 */

	select: function() {
		this.show_handles();
		this._super();
	},

	unselect: function() {
		if (this.ghost_handle && this.ghost_handle.layer) {
			return;
		}

		this.hide_handles();
		this._super();
	},

	move_by: function(delta) {
		this._super(delta);

		if (this.selected) {
			this.hide_handles();
		}
	},

	on_mouse_move: function(event) {
		if (this.selected) {
			var hitOptions = {
				segments: false,
				handles: false,
				stroke: this.path.closed,
				fill: false,
				tolerance: 2
			};

			var hitResult = paper.project.hitTest(event.point, hitOptions);

			if (hitResult && hitResult.item.id == this.path.id) {
				if (hitResult.type == 'stroke') {
					//shift key? show ghost handle...
					if (event.event.shiftKey) {
						if (!this.active_handle) {
							this.show_ghost_handle(event.point);
						}

					} else {
						//show resize cursor...
						this.resize_direction = this.get_resize_direction(event.point);
						this.set_resize_cursor(this.resize_direction);
						this.clear_ghost_handle();

						this.last_move_point = event.point;
					}
				}

			} else {
				// not on stroke - cancel any resize...
				if (this.resize_direction) {
					this.cancel_resize();
				}

				if (this.ghost_handle && this.ghost_handle.layer) {
					this.clear_ghost_handle();
				}
			}

		}

		this._super(event);
	},

	show_ghost_handle: function(point) {
		if (!this.ghost_handle) {
			var size = this.handle_size;

			this.ghost_handle = new Path.Rectangle({
				point: [point.x - (size / 2), point.y - (size / 2)],
				size: [size, size],
				fillColor: this.handle_color
			});

			this.ghost_handle.fillColor.alpha = 0.4;
			this.ghost_handle.ignore_events = true;

		} else {
			this.ghost_handle.position = point;
		}

		app.designer.layers.handles.addChild(this.ghost_handle);
	},

	clear_ghost_handle: function(point) {
		if (this.ghost_handle) {
			this.ghost_handle.remove();
		}
	},

	shift_press: function() {
		if (this.resize_direction && !this.active_handle) {
			app.designer.reset_cursor();
			this.show_ghost_handle(this.last_move_point);
		}
	},

	move_finish: function() {
		this._super();

		if (this.selected) {
			this.show_handles();
		}
	},

	get_resize_direction: function(point, diagonal) {
		var tolerance;

		if (!diagonal) {
			tolerance = 3;
			if (point.x < this.path.bounds.x + tolerance) {
				return 'left';

			} else if (point.x > (this.path.bounds.x + this.path.bounds.width - tolerance)) {
				return 'right';

			} else if (point.y < this.path.bounds.y + tolerance) {
				return 'top';

			} else if(point.y > (this.path.bounds.y + this.path.bounds.height - tolerance)) {
				return 'bottom';
			}

		} else {
			tolerance = 5;
			var py = point.y,
			    px = point.x,
			    rby = this.path.bounds.y,
			    rbx = this.path.bounds.x;

			if (this.is_close_too(py, rby, tolerance) && this.is_close_too(px, rbx, tolerance)) {
				return 'topleft';

			} else if (this.is_close_too(py, rby, tolerance) && this.is_close_too(px, (rbx + this.path.bounds.width), tolerance)) {
				return 'topright';

			} else if (this.is_close_too(px, rbx, tolerance) && this.is_close_too(py, (rby + this.path.bounds.height), tolerance)) {
				return 'bottomleft';

			} else if (this.is_close_too(px, (rbx + this.path.bounds.width), tolerance) && this.is_close_too(py, (rby + this.path.bounds.height), tolerance)) {
				return 'bottomright';
			}
		}

		return "any";
	},

	is_close_too: function(number1, number2, tolerance) {
		return ((number1 - tolerance) <= number2 && (number1 + tolerance) >= number2);
	},

	set_resize_cursor: function(side) {
		if (side === "any") {
			app.designer.set_cursor('pointer');
			return;
		}

		if (side !== undefined) {
			var cursor = (this.CURSOR[side]) ? this.CURSOR[side] : side;
			app.designer.set_cursor(cursor);
		}
	},

	on_mouse_down: function(event) {
		if (!app.designer.is_busy() && this.resize_direction && this.selected) {
			this.is_resizing = true;
			this.resize_anchor = this.get_resize_anchor(this.resize_direction);
			this.downpoint_x = event.point.x;
			this.downpoint_y = event.point.y;

			//if dragging wall, cache direction...
            this.drag_direction = (!this.handle_mouse_down) ? this.get_closest_side(event.point) : this.get_closest_corner(event.point);

			//publish event...
			this.pub_with_type('restructure_start');
		}

		this.handle_mouse_down = false;
		this._super(event);
	},

	on_mouse_drag: function(event, from_handle) {
		this._is_rectangle = this.is_rectangle();

		if (this.is_resizing) {
			this.draw_snap_lines(event.point);

			//if is rectangle, and if no SHIFT key - resize...
			if (this._is_rectangle && !event.event.shiftKey) {
				var x = event.delta.x,
				    y = event.delta.y,
				    direction = this.drag_direction.toLowerCase();

				//if dragging top or bottom...
				if (direction.indexOf('top') !== -1) {
					this.resize_bounds({
                        top: (this.path.bounds.top + y)
                    });
				}

				if (direction.indexOf('right') !== -1) {
					this.resize_bounds({
                        right: (this.path.bounds.right + x)
                    });
				}

				if (direction.indexOf('bottom') !== -1) {
					this.resize_bounds({
                        bottom: (this.path.bounds.bottom + y)
                    });
				}

				if (direction.indexOf('left') !== -1) {
					this.resize_bounds({
                        left: (this.path.bounds.left + x)
                    });
				}

				this.reposition_handles();

			} else {
				//else, restructure...
				if (this.active_handle) {
					this.active_handle.position = event.point;
					this.active_handle.segment.point = event.point;
					this.user_restructured = true;
				}
			}

			this.user_resized = true;
		}

		this._super(event);
	},

	draw_snap_lines: function(to_point) {
		var result = this.find_nearest_rooms(to_point);

		this.snap_to_x = result.x_point ? result.x_point.x : null;
		this.snap_to_y = result.y_point ? result.y_point.y : null;

		app.snap_manager.draw_lines(result, to_point);
	},

	find_nearest_rooms: function(from_point) {
		var to_point = new Point(from_point.x, from_point.y),
		    assets = app.designer.rooms,
		    tolerance = this.SNAP_TOLERANCE,
            axis = '',
            direction = this.drag_direction.toLowerCase(),
		    compare_points = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'],
		    exclusions = [];

		exclusions.push($.proxy(function(asset){
            return (asset.id === this.id);
        }, this));

		if (direction.indexOf('top') !== -1 || direction.indexOf('bottom') !== -1) {
			axis += 'y';
		}

		if (direction.indexOf('left') !== -1 || direction.indexOf('right') !== -1) {
			axis += 'x';
		}

		return app.snap_manager.find_nearest_asset_points(to_point, axis, assets, tolerance, compare_points, exclusions);
	},

	on_mouse_up: function(event) {
		//if light group, don't bubble event to designer...
		if (this.user_resized) {
			//do snap lines...
			app.snap_manager.remove_lines();

			//if restructured...
			if (this.user_restructured) {

				//snap segment if applicable...
				if (this.snap_to_x) {
					this.active_handle.segment.point.x = this.snap_to_x;
				}

				if (this.snap_to_y) {
					this.active_handle.segment.point.y = this.snap_to_y;
				}

			} else {
				//else snap whole side if applicable...
				var closest,
				    bounds;

				if (this.snap_to_x) {
					closest = this.get_closest_side_by_axis(event.point.x, 'x');
					var x_side = closest.side;
					bounds = {};
					bounds[x_side] = this.snap_to_x;
					this.resize_bounds(bounds);
					this.reposition_handles();
				}

				if (this.snap_to_y) {
					closest = this.get_closest_side_by_axis(event.point.y, 'y');
					var y_side = closest.side;
					bounds = {};
					bounds[y_side] = this.snap_to_y;
					this.resize_bounds(bounds);

					this.reposition_handles();
				}
			}

			this.cancel_resize();
			this.is_resizing = false;
			app.designer.is_resizing = false;
		}

		//if we have a ghost handle - add segment...
		if (this.ghost_handle && this.ghost_handle.layer) {

			var hitOptions = {
				segments: false,
				handles: false,
				stroke: true,
				fill: false,
				tolerance: 3
			};

			var hitResult = paper.project.hitTest(event.point, hitOptions);

			if (!hitResult || hitResult.item.id !== this.path.id) {
				return;
			}

			this.selected_segment = null;

			if (this.selected) {
				var location = hitResult.location;
				this.selected_segment = this.path.insert(location.index + 1, event.point);
				this.create_handles();
			}

			return;
		}

		this._super(event);

		if (this.user_resized) {
			if (this.after_resizable_resize) {
				this.after_resizable_resize();
			}

			this.user_resized = false;
			this.user_restructured = false;
			app.designer.cancel_mouseup = true;

			//publish event...
			this.pub_with_type('restructure_end');
		}

		this._is_rectangle = false;
	},

	on_mouse_leave: function(event) {
		if (!app.designer.is_busy()) {
			//if not rotating, clear cursor...
			app.designer.reset_cursor();
		}

		if (this.ghost_handle) {
			this.clear_ghost_handle();
		}

		this._super(event);
	},

	cancel_resize: function() {
		app.designer.reset_cursor();

		this.resize_direction = null;
		this.is_resizing = false;
		this.resize_anchor = null;
		this._is_rectangle = false;
	},

	get_resize_anchor: function(direction) {
		//find the opposite side to anchor...
		switch (direction) {
			case 'left':
				return new Point((this.path.bounds.x + this.path.bounds.width), this.path.bounds.y);
			case 'right':
				return new Point(this.path.bounds.x, this.path.bounds.y);
			case 'top':
				return new Point(this.path.bounds.x, (this.path.bounds.y + this.path.bounds.height));
			case 'bottom':
				return new Point(this.path.bounds.x, this.path.bounds.y);
			case 'topleft':
				return new Point((this.path.bounds.x + this.path.bounds.width), (this.path.bounds.y + this.path.bounds.height));
			case 'topright':
				return new Point(this.path.bounds.x, (this.path.bounds.y + this.path.bounds.height));
			case 'bottomleft':
				return new Point((this.path.bounds.x + this.path.bounds.width), this.path.bounds.y);
			case 'bottomright':
				return new Point(this.path.bounds.x, this.path.bounds.y);
		}
	},

	get_closest_corner: function(point) {
		var closest_x = this.get_closest_side_by_axis(point.x, 'x'),
		    closest_y = this.get_closest_side_by_axis(point.y, 'y');

        return (closest_y.side + closest_x.side.toCamel());
	},

	get_closest_side: function(point) {
		var closest_x = this.get_closest_side_by_axis(point.x, 'x'),
		    difference_x = Math.abs(point.x - closest_x.number),

		    closest_y = this.get_closest_side_by_axis(point.y, 'y'),
		    difference_y = Math.abs(point.y - closest_y.number);

		return (difference_x < difference_y ?  closest_x.side : closest_y.side);
	},

	get_closest_side_by_axis: function(target, axis) {
		var sides = {},
		    find_x = (axis === 'x'),
		    find_y = (axis === 'y');

		if (find_x) {
			sides.left = this.path.bounds.left;
			sides.right = this.path.bounds.right;
		}

		if (find_y) {
			sides.top = this.path.bounds.top;
			sides.bottom = this.path.bounds.bottom;
		}


		var closest_number = this.get_closest_number(sides, target),
		    side = _.invert(sides)[closest_number];

		return {
			side: side,
			number: closest_number
		};
	},

	get_closest_number: function(object, target) {
		//find closest number in hash
		//taken from http://stackoverflow.com/questions/4811536/find-the-number-in-an-array-that-is-closest-to-a-given-number
		var tuples = _.map(object, function(val) {
			return [val, Math.abs(val - target)];
		});

		return _.reduce(tuples, function(memo, val) {
			return (memo[1] < val[1]) ? memo : val;
		}, [-1, 999])[0];
	},

	get_bounds_hash: function() {
		//unique hash of this thisects exact position....
		return _.map(this.path.segments, function(segment){
            return (segment.point.x + "||" +segment.point.y);
        }).join('');
	},

	remove_handles: function() {
		if (this.handles_group) {
			_.invoke(this.handles, 'remove');
			this.handles_group.remove();
		}
	},

	remove: function() {
		this.remove_handles();
	}
});