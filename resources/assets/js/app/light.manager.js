/**
 *	LightManager
 *	Helper for multi-light functions.
 *
 */
app.light_manager = {
	spacing_meters: 1.5,
	default_spacing_pixels: 40,
	light_width: 36,
	//DEFAULT_LIGHT_TYPE: "D900-CR-3K-45-S",
	refresh_grid_count: 0, // keep track of how many time the grid gets refreshed


	/*get_default_light: function() {
		return app.product_manager.get_product_by_code(this.DEFAULT_LIGHT_TYPE);
	},*/

	get_spacing: function() {
		return ((app.designer.room_scale || this.default_spacing_pixels) * this.spacing_meters);
	},
	
	set_spacing: function(light) {
		this.spacing_meters = 1.5;
		// Strip light
		if (light.hasOwnProperty('model')
			&& light.model.hasOwnProperty('code')
			//&& light.model.code == 'STRIP'
            && light.model.code == '120S'
		) {
			this.spacing_meters = 1;
		}
	},

	draw_string: function(room, path, light_group, circuit, light_type) {

		var light_count = 0,
		    length = path.length,
		    amount,
		    spacingy,
		    center_offset,
		    default_light;

		//light_type is a string (if BG light)
		//or data is custom light
		if (light_type) {
            default_light = (typeof light_type === "string") ? app.product_manager.get_product_by_code(light_type) : light_type;

		} else {
			default_light = app.ui.create_panel_lights.selected_product;
		}
		
		this.set_spacing(default_light);

		if (light_group) {
			amount = light_group.rows;
			light_group.spacingy = (path.length / (amount - 1));
			spacingy = light_group.spacingy;
			center_offset = 0;

		} else {
			spacingy = this.get_spacing();

			//create light group...
			light_group = new app.LightGroup({
				type: 'string',
				spacingy: spacingy
			});

			amount = Math.floor(length / spacingy) + 1;
			app.designer.light_groups[light_group.id] = light_group;
			circuit = room.circuit;
			center_offset = ((length - ((amount - 1) * spacingy)) / 2);
		}

		var first_light;
		for (var i=0; i<amount; i++) {

			var offset = (i * spacingy) + center_offset;
			var point = path.getPointAt(offset);

			if (point) {
				var light_data = $.extend({
					x: point.x - light_group.original_light_width / 2,
					y: point.y - light_group.original_light_height / 2,
					group: light_group.id,
					circuit: circuit.id
				}, default_light);

				var light = new app.Light(light_data);

				if (!first_light) {
					first_light = light;
				}

				light_count++;

			} else {
				break;
			}
		}

		light_group.rows = amount;

		if (light_count > 0) {
			//add one light from group to room (as the rest are magically added)
			room.add_asset(first_light, true);
			light_group.refresh_outline();
			circuit.show_connections(true);

		} else {
			//remove light group...
			light_group.remove();
		}
	},

	draw_grid: function(room, bounds, light_group, circuit, light_type) {
		var xfrom = null,
		    yfrom = null,
		    default_light;

		//light_type is a string (if BG light)
		//or data is custom light
		if (light_type) {
            default_light = (typeof light_type === "string") ? app.product_manager.get_product_by_code(light_type) : light_type;

		} else {
			default_light = app.ui.create_panel_lights.selected_product;
		}
		
		this.set_spacing(default_light);

		//if light_group is not null, start from the same position
		if (light_group) {
			xfrom = (bounds.x + (light_group.light_width - light_group.original_light_width) / 2);
			yfrom = (bounds.y + (light_group.light_height - light_group.original_light_height) / 2);

		} else {
			xfrom = bounds.x;
			yfrom = bounds.y;
		}

		var rows,
		    cols,
		    spacingx,
		    spacingy;

		if (light_group) {

			//derive spacing based on groups rows & cols
			previous_cols = light_group.previous_cols;
			previous_rows = light_group.previous_rows;
			rows = light_group.rows;
			cols = light_group.cols;

			if (cols > 1) {
                var total_spacingx = (light_group.spacingx) ? (light_group.spacingx * (previous_cols - 1)) : (bounds.width - this.light_width);
                light_group.spacingx = total_spacingx / (cols - 1);

			} else {
				light_group.spacingx = 0;
				xfrom = (room.path.bounds.center.x - (light_group.light_width - light_group.original_light_width) / 2);
			}

			if (rows > 1) {
                var total_spacingy = (light_group.spacingy) ? (light_group.spacingy * (previous_rows - 1)) : (bounds.height - this.light_width);
                light_group.spacingy = total_spacingy / (rows - 1);

			} else {
				light_group.spacingy = 0;
				yfrom = (room.path.bounds.center.y - (light_group.light_height - light_group.original_light_height) / 2);
			}

			spacingx = light_group.spacingx;
			spacingy = light_group.spacingy;

		} else {
			//derive rows & cols based on spacing...
			spacingx = this.get_spacing();
			spacingy = this.get_spacing();

			cols = Math.ceil(bounds.width / this.get_spacing());
			rows = Math.ceil(bounds.height / this.get_spacing());

			//create light group...
			light_group = new app.LightGroup({
				type: 'grid',
				rows: rows,
				cols: cols,
				spacingx: spacingx,
				spacingy: spacingy
			});

			light_group.set_previous_cols(cols);
			light_group.set_previous_rows(rows);

			app.designer.light_groups[light_group.id] = light_group;
			circuit = room.circuit;
		}

		var light_count = 0,
		    first_light,
		    x = 0,
		    y = 0;

		//create lights in grid....
		while (x < cols) {
			y = 0;

			while (y < rows) {
				var light_data = $.extend({
					x: (xfrom + (x * spacingx)),
					y: (yfrom + (y * spacingy)),
					group: light_group.id,
					circuit: circuit.id
				}, default_light);

				var light = new app.Light(light_data);

				if (!first_light) {
					first_light = light;
				}

				y++;
				light_count++;
			}
			x++;
		}

		if (light_count > 0) {
			//add one light from group to room (as the rest are magically added)
			room.add_asset(first_light, true);
			light_group.refresh_outline();
			circuit.show_connections(true);

		} else {
			//remove light group...
			light_group.remove();
		}
	},

	best_fit: function(room) {
		var room_type = room.get_room_type();

		if (!room_type) {
			alert('Error, room type not found (' + room.type + ') in property type ' + 'app.property_type');
		}

		// get the selected_light_type lumens
		var selected_light_type = app.ui.create_panel_lights.selected_product,
		    main_light_count = Math.ceil(room.recommended_lumens / selected_light_type.lumens),
		    main_light_bounds = room.get_floating_light_bounds();

		//if drawing a grid...
		if (main_light_count > 1) {

			//direct or indirect layout...
			if (room_type.light_layout === 'indirect') {
				//var light_group = this.draw_indirect_box(main_light_count, main_light_bounds, room);
                this.draw_indirect_box(main_light_count, main_light_bounds, room);

			} else {
                /*var light_group = this.get_direct_grid(main_light_count, main_light_bounds);
                    bounds_width = (room.path.bounds.width / 2),
				    bounds_height = (room.path.bounds.height / 2);

                main_light_bounds = {
                    x: (room.path.bounds.x + (bounds_width / 2)),
                    y: (room.path.bounds.y + (bounds_height / 2)),
                    width: bounds_width,
                    height: bounds_height
                };*/

                var bounds = {
                    x: (main_light_bounds.x + (main_light_bounds.width * 0.15)),
                    y: (main_light_bounds.y + (main_light_bounds.height * 0.15)),
                    width: (room.path.bounds.width * 0.7), // 70% of the width
                    height: (room.path.bounds.height * 0.7)
                };

                var light_group = this.get_direct_grid(main_light_count, bounds);

				app.designer.light_groups[light_group.id] = light_group;
				// get the selected light_type when estimate room
				this.draw_grid(room, bounds, light_group, room.circuit, selected_light_type);
			}

		} else {
			//main_light_count <= 1
			//create single light, centered...

			// fix bug: if there is only one light in the room, estimate does not work with selected type
			app.ui.pause_rendering();

			var light_data = $.extend({
				x: room.path.bounds.center.x,
				y: room.path.bounds.center.y
			}, selected_light_type);

			var light = new app.Light(light_data);
            //light.x -= (light.width / 2);
            light.y -= (light.height / 2);
            light.move(light.x, light.y, true);

			room.add_asset(light);
		}

		room.refresh_circuits();
		room.reconnect_light_switches();
		room.circuit.redraw_connections(true);

		//hide connections - as not over room in best fit
		room.circuit.hide_connections();
		app.ui.draw();
		room.select();
	},

	draw_indirect_box: function(main_light_count, main_light_bounds, room, existing_group, light_type) {
		//round up if odd
		if ((main_light_count % 2) === 1) {
			main_light_count++;
		}

		var light_data;

		if (light_type) {
            light_data = (typeof light_type === "string") ? app.product_manager.get_product_by_code(light_type) : light_type;

		} else {
			light_data = app.ui.create_panel_lights.selected_product;
		}

		var light_group;

		if (existing_group) {
			light_group = existing_group;

		} else {
			light_group = new app.LightGroup({
				type: 'box'
			});
		}

		app.designer.light_groups[light_group.id] = light_group;

		var box_width = main_light_bounds.width,
		    box_height = main_light_bounds.height,
		    total_length = ((box_height * 2) + (box_width * 2)),
		    total_spacing = (total_length / main_light_count),
            total_x = Math.round(box_width / total_spacing),
		    total_y = Math.round(box_height / total_spacing);

		//if just two lights - place them on the opposite of the longest axis...
		if (box_width > box_height && (total_y === 0 && total_x === 1)) {
			total_y = 1;
			total_x = 0;

		} else if (box_height > box_width  && (total_x === 0 && total_y === 1)) {
			total_x = 1;
			total_y = 0;
		}

		main_light_bounds = new Rectangle(main_light_bounds);

		var result;

		//if y > x
		if (box_height > box_width) {
			result = this.draw_box_axis('y', total_y, total_x, light_data, main_light_bounds, light_group, room, false);
			this.draw_box_axis('x', result.other_total, result.total, light_data, main_light_bounds, light_group, room, result.is_corners_added);

		} else {
			result = this.draw_box_axis('x', total_x, total_y, light_data, main_light_bounds, light_group, room, false);
			this.draw_box_axis('y', result.other_total, result.total, light_data, main_light_bounds, light_group, room, result.is_corners_added);
		}

		return light_group;
	},

	draw_box_axis: function(axis, total, other_total, light_data, main_light_bounds, light_group, room, is_corners_added) {
		var x = (axis === 'x'),
		    circuit = room.circuit,
		    light1_pos,
            light2_pos,
		    light_1_data,
            light_2_data,
		    light_1,
            light_2;

		if (total > 1) {
			var distance,
			    spacing,
			    start_offset,
			    offset,
                offset_x,
			    offset_y;

			if (total >= other_total && !is_corners_added) {
				//draw corner lights
				//var corner_lights = this.add_to_corners(axis, light_data, main_light_bounds, light_group, room);
                this.add_to_corners(axis, light_data, main_light_bounds, light_group, room);
				is_corners_added = true;

				total -= 1;

				if (other_total === 0) {
					total -= 1;

				} else {
					other_total -= 1;
				}
			}

            distance   = (x) ? main_light_bounds.width : main_light_bounds.height;
            light1_pos = (x) ? main_light_bounds.topLeft : main_light_bounds.topLeft;
            light2_pos = (x) ? main_light_bounds.bottomLeft : main_light_bounds.topRight;

			spacing = (distance / (total + 1));
			start_offset = spacing;

			//place any remaining lights (between corners)
			for (var i=0; i<total; i++) {
				offset = ((i * spacing) + start_offset);

				offset_x = (x) ? offset : 0;
				offset_y = (!x) ? offset : 0;

				light_1_data = $.extend({
					x: light1_pos.x + offset_x,
					y: light1_pos.y + offset_y,
					group: light_group.id,
					circuit: circuit.id
				}, light_data);

				light_1 = new app.Light(light_1_data);

				light_2_data = $.extend({
					x: light2_pos.x + offset_x,
					y: light2_pos.y + offset_y ,
					group: light_group.id,
					circuit: circuit.id
				}, light_data);

				light_2 = new app.Light(light_2_data);
			}

		} else if (total === 1) {
			//place lights in direct center of axis
            light1_pos = (x) ? main_light_bounds.topCenter : main_light_bounds.leftCenter;
            light2_pos = (x) ? main_light_bounds.bottomCenter : main_light_bounds.rightCenter;

			light_1_data = $.extend({
				x: light1_pos.x,
				y: light1_pos.y,
				group: light_group.id,
				circuit: circuit.id
			}, light_data);

			light_1 = new app.Light(light_1_data);

			light_2_data = $.extend({
				x: light2_pos.x,
				y: light2_pos.y,
				group: light_group.id,
				circuit: circuit.id
			}, light_data);

			light_2 = new app.Light(light_2_data);
		}

		if (light_1) {
			//add one light from group to room (as the rest are magically added)
			room.add_asset(light_1, true);
		}

		return { total: total, other_total: other_total, is_corners_added: is_corners_added };
	},

	add_to_corners: function(axis, light_data, main_light_bounds, light_group, room) {
		var x = (axis === 'x'),
		    point = main_light_bounds.topLeft;

		var light_1_data = $.extend({
			x: point.x,
			y: point.y,
			group: light_group.id,
			circuit: room.circuit.id
		}, light_data);

		var light_1 = new app.Light(light_1_data);

		point = (x) ? main_light_bounds.topRight : main_light_bounds.bottomLeft;

		var light_2_data = $.extend({
			x: point.x,
			y: point.y,
			group: light_group.id,
			circuit: room.circuit.id
		}, light_data);

		var light_2 = new app.Light(light_2_data);

		point = (x) ? main_light_bounds.bottomLeft : main_light_bounds.topRight;

		var light_3_data = $.extend({
			x: point.x,
			y: point.y,
			group: light_group.id,
			circuit: room.circuit.id
		}, light_data);

		var light_3 = new app.Light(light_3_data);

		point = main_light_bounds.bottomRight;

		var light_4_data = $.extend({
			x: point.x,
			y: point.y,
			group: light_group.id,
			circuit: room.circuit.id
		}, light_data);

		var light_4 = new app.Light(light_4_data);

		if (light_1) {
			//add one light from group to room (as the rest are magically added)
			room.add_asset(light_1, true);
		}

		return [light_1, light_2, light_3, light_4];
	},

	get_direct_grid: function(main_light_count, main_light_bounds) {
		var rows,
		    cols;

		//if odd...
		if ((main_light_count % 2) == 1) {
			//arbitury statement - if more than 5 lights add another...
			if (main_light_count > 5) {
				main_light_count++;
			}
		}

		//work out possible rows or columns....
		var posible_count = main_light_count,
		    possible = Math.floor(Math.sqrt(posible_count));

		while ((posible_count % possible) !== 0) {
            possible--;
		}

		var possible2 = (posible_count / possible);

		//we have two possibles - workout whether they should be rows or columns...
		if (main_light_bounds.width > main_light_bounds.height) {
			rows = (possible > possible2) ? possible2 : possible;
			cols = (possible > possible2) ? possible : possible2;

		} else {
			rows = (possible > possible2) ? possible : possible2;
			cols = (possible > possible2) ? possible2 : possible;
		}

		//account for small rooms...
		//just line them up in all rows or cols
		if (rows === 0) {
			rows = 1;
			cols = main_light_count;

		} else if (cols === 0) {
			rows = main_light_count;
			cols = 1;
		}

		//make sure we got all the lights...
		if ((rows * cols) < main_light_count) {
			var remaining_lights = (main_light_count - (rows * cols));
			//if width larger, add to rows...
			if (main_light_bounds.width > main_light_bounds.height) {
				cols += remaining_lights;

			} else {
				rows += remaining_lights;
			}
		}

		return new app.LightGroup({
			type: 'grid',
			rows: rows,
			cols: cols
		});
	}
};