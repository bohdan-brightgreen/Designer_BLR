/**
 *	Snap Manager
 *	Helper for snap line drawing.
 *
 */
app.snap_manager = {
	snap_lines: null,

	find_nearest_asset_points: function(to_point, axis, assets, tolerance, compare_points, exclusions) {
		var result = {
			x_point: null,
			y_point: null
		};

		var find_x = (axis.indexOf('x') !== -1),
		    find_y = (axis.indexOf('y') !== -1),
		    shortest_x_dist = -1,
		    shortest_y_dist = -1;

		for (var i in assets) {
			var asset = assets[i];

			if (_.isArray(exclusions) && exclusions.length > 0) {
				//if we have exclusions - run against asset...
				var exclude = _.some(exclusions, function(ex_func){
                    return ex_func(asset);
                });

				if (exclude) {
					continue;
				}
			}

			for (var c in compare_points) {
				var compare_point = compare_points[c],
				    asset_point = asset.path.bounds[compare_point];

				if (find_x) {
					var asset_x = asset_point.x;

					if ((asset_x === to_point.x) || (asset_x > to_point.x - tolerance && asset_x < to_point.x + tolerance) ) {
						var dist_x = to_point.getDistance(asset_point);

						if (shortest_x_dist == -1 || dist_x < shortest_x_dist) {
							shortest_x_dist = dist_x;
							result.x_point = asset_point;
						}
					}
				}

				if (find_y) {
					var asset_y = asset_point.y;

					if ((asset_y == to_point.y) || (asset_y > to_point.y - tolerance && asset_y < to_point.y + tolerance)) {
						var dist_y = to_point.getDistance(asset_point);

						if (shortest_y_dist == -1 || dist_y < shortest_y_dist) {
							shortest_y_dist = dist_y;
							result.y_point = asset_point;
						}
					}
				}
			}
		}

		return result;
	},

	draw_lines: function(result, to_point) {
		this.remove_lines();
		this.snap_lines = [];

		if (result.x_point !== null) {

			var extra_length_x = (to_point.y < result.x_point.y) ? -10 : 10,
			    x_end_point = new Point(result.x_point.x, (to_point.y + extra_length_x)),
			    line_x = new Path.Line(result.x_point, x_end_point);

			this.snap_lines.push(line_x);
			line_x.strokeColor = app.colours.main;

			app.designer.layers.background.addChild(line_x);
		}

		if (result.y_point !== null) {
			var extra_length_y = (to_point.x < result.y_point.x) ? -10 : 10,
			    y_end_point = new Point((to_point.x + extra_length_y), result.y_point.y),
			    line_y = new Path.Line(y_end_point, result.y_point);

			line_y.strokeColor = app.colours.main;
			this.snap_lines.push(line_y);

			app.designer.layers.background.addChild(line_y);
		}
	},

	remove_lines: function() {
		for (var i in this.snap_lines) {
			this.snap_lines[i].remove();
		}

		app.ui.draw();
	}
};