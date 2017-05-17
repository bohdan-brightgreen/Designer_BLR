/**
 *	Class app.BaseAsset
 *	Provides base functinality for Rooms, Assets (Furniture), and Lights
 *
 */
app.BaseAsset = Class.extend({
	id: null,
	class: null,
	path: null,
	selected: null,
	current_style: null,

	selected_style: {
		fillColor: '#ffffff',
		fillAlpha: 0.01,
		strokeColor: '#009933',
		strokeWidth: 2
	},

	init: function() {

	},

	create_path: function(data) {
		this.path = new paper.Path();
		this.path.closed = true;

		if (data.width) {
			this.width = data.width;
		}

		if (data.height) {
			this.height = data.height;
		}

		if (data.segments) {
			this.import(data.segments);

		} else {
			this.path = new Path.Rectangle(data.x, data.y, this.width, this.height);
		}

		this.get_layer().addChild(this.path);
		this.init_events();
	},

	init_events: function() {
		this.path.onMouseEnter = $.proxy(this.on_mouse_enter, this);
		this.path.onMouseDown = $.proxy(this.on_mouse_down, this);
		this.path.onMouseDrag = $.proxy(this.on_mouse_drag, this);
		this.path.onMouseUp = $.proxy(this.on_mouse_up, this);
		this.path.onMouseMove = $.proxy(this.on_mouse_move, this);
		this.path.onMouseLeave = $.proxy(this.on_mouse_leave, this);
	},

	//stub events
	on_mouse_enter: function(event) {},
	on_mouse_down: function(event) {},
	on_mouse_drag: function(event) {},
	on_mouse_up: function(event) {},
	on_mouse_move: function(event) {},
	on_mouse_leave: function(event) {},

	set_active: function(active) {
		//make sure app not bust (rotating etc..)
		//but allow dragging assets (for placing into rooms)
		if (app.designer.is_busy() && !app.is_dragging()) {
			return false;
		}

		var active_var_name = ('active_' + this.class);

		if (active) {
			if (app.designer[active_var_name] !== null && app.designer[active_var_name] !== undefined) {
				app.designer[active_var_name].set_active(false);
			}

			app.designer.set_active(active_var_name, this);
			this.set_style(this.active_style);

		} else {
			app.designer.clear_active(active_var_name);
			this.set_style(this.base_style);
		}

		this.active = active;
	},

	set_style: function(style, force) {
		if (this.selected === true) {
			this.path.style.strokeColor = this.selected_style.strokeColor;
			this.path.style.strokeWidth = this.selected_style.strokeWidth;
			return;
		}

		if (this.current_style != style || force === true) {

			this.current_style = style;
			this.path.style = style;

			if (style.strokeAlpha) {
				this.path.strokeColor.alpha = style.strokeAlpha;
			}

			if (style.fillAlpha) {
				this.path.fillColor.alpha = style.fillAlpha;
			}
		}
	},

	set_selected: function(selected, event) {
		if (this.selected === true) {
			selected = false;
		}

		if (selected) {
			if (app.designer.selected !== null && app.designer.selected !== undefined) {
				app.designer.selected.unselect();
			}

			this.select(event);

		} else {
			this.unselect(event);
		}
	},

	select: function() {
		//this.path.style.strokeColor = this.selected_style.strokeColor;
		//this.path.style.strokeWidth = this.selected_style.strokeWidth;

		this.set_style(this.selected_style, true);

		this.selected = true;
		app.designer.selected = this;

		//publish event...
		this.pub_with_type('selected');
		app.pub('designer_base_asset_selected', [this]);
	},

	unselect: function() {
		this.selected = false;

		if (this.current_style) {
			this.set_style(this.base_style, true);
		}

		app.designer.selected = null;

		//publish event...
		this.pub_with_type('unselected');
		app.pub('designer_base_asset_unselected', [this]);
	},

	export_segments: function() {
		var segments = [],
            segment;

		if (this.path.segments) {
			for (var s=0; s<this.path.segments.length; s++) {
				segment = this.path.segments[s];
				segments.push([
                    segment.point.x - app.designer.zoom_translate_x,
                    segment.point.y - app.designer.zoom_translate_y,
					segment.handleIn.x,
					segment.handleIn.y,
					segment.handleOut.x,
					segment.handleOut.y
				]);
			}
		}

		return segments;
	},

	import: function(segments) {
		for (var s=0; s<segments.length; s++) {
			var coords = segments[s];
			segment = new paper.Segment(new paper.Point(coords[0], coords[1]), new paper.Point(coords[2], coords[3]), new paper.Point(coords[4], coords[5]));
			this.path.add(segment);
		}
	},

	get_width: function() {
		return this.path.bounds.width;
	},

	get_height: function() {
		return this.path.strokeBounds.height;
	},

	delete_asset: function() {
		if (confirm('Are you sure you wish to permentantly delete this ' + this.class + '?')) {
			this.remove();
			return true;
		}

		return false;
	},

	get_layer: function() {
		return app.designer.layers.assets;
	},

	/*get_relative_position: function(asset) {
		var this_center = this.path.bounds.getCenter();
		console.log(this_center);
	},*/

	pub_with_type: function(event, args) {
		app.pub('designer_' + this.get_class_type() + '_' + event, (args || [this]));
	},

	get_class_type: function() {
		if (this instanceof app.Room) {
			return "room";

		} else if (this instanceof app.Light) {
			return "light";

		} else if (this instanceof app.LightGroup) {
			return "lightgroup";

		} else if (this instanceof app.Asset) {
			return "asset";
		}
	}
});