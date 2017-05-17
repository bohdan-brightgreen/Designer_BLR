/**
 *	Class app.Asset.Door
 *	Represents a door
 *
 */
app.Asset.Door = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'door';
		this.width = 42;
		this.height = 38;
		this.rotation_step = 90;
		this.sticky = true;
		this.allow_flip = true;

		//self measured
		this.width_meters = 0.91;

		this._super(data);
	},

	get_light_position: function(switch_width, switch_height) {
		var x,
		    y,
		    xoffset = 3,
		    yoffset = 9;

		if (this.rotation === 90) {
			//top wall
			if (!this.flipped) {
				x = (this.path.bounds.topLeft.x - (switch_height / 2) - xoffset);

			} else {
				x = (this.path.bounds.topRight.x + (switch_height / 2) + xoffset);
			}

			y = (this.path.bounds.topLeft.y + (switch_width / 2) + xoffset);

		} else if (this.rotation === -90 || this.rotation === 270) {
			//bottom wall
			if (!this.flipped) {
				x = (this.path.bounds.bottomRight.x + (switch_height / 2) + xoffset);

			} else {
				x = (this.path.bounds.bottomLeft.x - (switch_height / 2) - xoffset);
			}

			y = (this.path.bounds.bottomRight.y - (switch_width / 2));

		} else if (this.rotation === 180) {
			//right wall
			x = (this.path.bounds.topRight.x - (switch_width / 2));

			if (!this.flipped) {
				y = (this.path.bounds.topRight.y - (switch_height / 2) - xoffset);

			} else {
				y = (this.path.bounds.bottomRight.y + (switch_height / 2) + xoffset);
			}

		} else {
			//left wall
			x = (this.path.bounds.bottomLeft.x + (switch_width / 2));

			if (!this.flipped) {
				y = (this.path.bounds.bottomLeft.y + (switch_height / 2) + xoffset);

			} else {
				y = (this.path.bounds.topLeft.y - (switch_height / 2) - xoffset);
			}
		}

		return {
			x: x,
			y: y
		};
	}
});