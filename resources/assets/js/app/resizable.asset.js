/**
 *	Class app.ResizableAsset
 *	An asset that can be resized by it's bounds or handles
 *
 */
app.ResizableAsset = app.Asset.extend({

	bounds_hash: null,
	handles_group: null,
	handles: null,

	handle_size: 10,
	handle_color: 'black',
	handle_active_color: app.colours.main,
	active_handle: null,

	resize_direction: null,
	resize_downpoint: null,
	resize_anchor: null,
	is_resizing: null,
	first_resize_drag: null,

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

	init: function(data) {
		this._super(data);
	},

	show_handles: function() {
		if (!this.handles) {
			this.handles = [];
		}

		if (!this.is_flush()) {
			return;
		}

		var check_bounds_hash = this.get_bounds_hash();

		//has the item moved since last we created the handles?
		if (this.bounds_hash !== check_bounds_hash) {

			//if segments count changes - recreate handles...
			if (this.path.segments.length !== this.handles.length) {
				this.create_handles();

            //otherwise just reposition the existing...
			} else {
				this.reposition_handles();
			}

			this.bounds_hash = check_bounds_hash;
		}

		app.designer.layers.handles.addChild(this.handles_group);
	},

	is_flush: function(){
		return (Math.abs(this.rotation % 90) === 0);
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

			this.handles[i] = handle;
		}

		this.handles_group = new Group(this.handles);
	},

	reposition_handles: function() {
		for (var i in this.path.segments) {
			var segment = this.path.segments[i];
            this.handles[i].position = new Point(segment.point.x, segment.point.y);
		}
	},

	hide_handles: function() {
		if (this.handles_group && this.handles_group.layer) {

			if (this.active_handle) {
				this.unset_active_handle();
			}

			this.handles_group.remove();
		}
	},

	on_handle_mouse_enter: function(event) {
		if (this.is_resizing) {
			return;
		}

		this.set_handle_cursor(event.point);
		this.set_active_handle(event.target);
	},

	set_handle_cursor: function(point) {
		this.resize_direction = this.get_resize_direction(point, true);
		this.set_resize_cursor(this.resize_direction);
	},

	on_handle_mouse_down: function(event) {
		this.set_handle_cursor(event.point);
		this.on_mouse_down(event);
	},

	on_handle_mouse_drag: function(event) {
		this.on_mouse_drag(event);
	},

	on_handle_mouse_up: function(event) {
		app.designer.cancel_mouseup = true;

		this.on_mouse_up(event);
		this.set_handle_cursor(event.point);
		this.resize_direction = null;
	},

	set_active_handle: function(handle) {
		handle.style.fillColor = this.handle_active_color;
		this.active_handle = handle;
	},

	unset_active_handle: function() {
		if (this.active_handle) {
			this.active_handle.style.fillColor = this.handle_color;
			this.active_handle = null;
		}
	},

	on_handle_mouse_leave: function(event) {
		if (!app.designer.is_busy()) {
			//if not rotating, clear cursor...
			app.designer.reset_cursor();
		}

		if (this.is_resizing) {
			return;
		}

		this.unset_active_handle();
	},

	get_bounds_hash: function() {
		//unique hash of this thisects exact position....
		return _.map(this.path.segments, function(segment) {
            return (segment.point.x + "||" + segment.point.y);
        }).join('');
	},

	select: function() {
		this.show_handles();
		this._super();
	},

	unselect: function() {
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

			var hitResult = paper.project.hitTest(event.point, hitOptions),
			    prev_resize_direction = this.resize_direction;

			if (hitResult && hitResult.item.id == this.path.id) {
				if (hitResult.type == 'stroke') {
					//what side are we closest too?
					this.resize_direction = this.get_resize_direction(event.point);
					this.set_resize_cursor(this.resize_direction);
				}

			} else {
				this.resize_direction = null;
			}

			if (!this.resize_direction && (prev_resize_direction !== this.resize_direction)) {
				this.cancel_resize();
			}
		}

		this._super(event);
	},

	move_finish: function() {
		this._super();

		if (this.selected) {
			this.show_handles();
		}
	},

	get_resize_direction: function(point, diagonal) {
		var tolerance;

		if (!this.is_flush()) {
			return null;
		}

		if (!diagonal) {
			tolerance = 3;

			if (point.x < this.path.bounds.x + tolerance) {
				return 'left';

			} else if (point.x > (this.path.bounds.x + this.path.bounds.width - tolerance)) {
				return 'right';

			} else if (point.y < this.path.bounds.y + tolerance) {
				return 'top';

			} else if (point.y > (this.path.bounds.y + this.path.bounds.height - tolerance)) {
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
	},

	is_close_too: function(number1, number2, tolerance) {
		return ((number1 - tolerance) <= number2 &&  (number1 + tolerance) >= number2);
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
			this.hide_controls();
			this.is_resizing = true;
			this.resize_anchor = this.get_resize_anchor(this.resize_direction);
			this.resize_downpoint = event.point;
			this.resize_x = 0;
			this.resize_y = 0;
		}

		this.first_resize_drag = false;
		this._super(event);
	},

	on_mouse_drag: function(event) {
		if (this.is_resizing) {

			if (!this.first_resize_drag) {
				//publish event...
				this.pub_with_type('resize_start');
				this.first_resize_drag = true;
			}

			var w = event.delta.x,
			    h = event.delta.y;

			if (this.resize_direction.indexOf('left') !== -1) {
				w = (0 - w);
			}

			if (this.resize_direction.indexOf('top') !== -1) {
				h = (0 - h);
			}

			this.resize_x += w;
			this.resize_y += h;

			var path_width = (this.path.bounds.width > 0) ? this.path.bounds.width : 1,
			    path_height = (this.path.bounds.height > 0) ? this.path.bounds.height : 1,
			    scale_x = 1 + (w / path_width),
			    scale_y = 1 + (h / path_height);

			//normal resize
			//if giant drags... ignore.
			if (scale_x >= 0.4 && scale_y >= 0.4 && scale_x < 2 && scale_y < 2) {
				this.resize(scale_x, scale_y, event);
			}

			//if fancy resize asset...
			if (this.fancy_resize_data) {
				this.fancy_resize(this.resize_x, this.resize_y, event);
			}

			this.draw_wall_distance_lines(this.room);
			this.lock_to_room();
			this.reposition_handles();

			this.user_resized = true;
		}

		this._super(event);
	},

	on_mouse_up: function(event) {
		//if light group, don't bubble event to designer...
		if (this.group) {
			app.designer.cancel_mouseup = true;
		}

		if (this.user_resized) {
			this.cancel_resize();
			this.pub_with_type('resize_end');
		}

		this.first_resize_drag = false;
		this.is_resizing = false;
		app.designer.is_resizing = false;

		this._super(event, this.user_resized);

		if (this.user_resized) {
			if (this.after_resizable_resize) {
				this.after_resizable_resize();
			}

			app.designer.cancel_mouseup = true;
		}

		this.user_resized = false;
	},

	cancel_resize: function() {
		app.designer.reset_cursor();
		this.resize_direction = null;
		this.is_resizing = false;
		this.resize_downpoint = null;
	},

	get_resize_anchor: function(direction) {
		//find the opposite side to anchor...
		switch(direction) {
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

	on_mouse_leave: function(event) {
		if (!app.designer.is_busy()) {
			//if not rotating, clear cursor...
			app.designer.reset_cursor();
		}

		this._super(event);
	},

	remove_handles: function() {
		if (this.handles_group) {
			_.invoke(this.handles, 'remove');
			this.handles_group.remove();
		}
	},

	remove: function() {
		this.remove_handles();
		this._super();
	},

	rotate_by: function(rotation) {
		//This is to hide the resize handles when rotating
		this.hide_handles();
		this._super(rotation);
		//this makes sure that if the user was rotating the item with their mouse
		//over it then it will still have the resize handles visible when the rotation is
		//finished and the item is "flush"
		if (this.selected && this.is_flush()) {
			this.show_handles();
		}
	}
});