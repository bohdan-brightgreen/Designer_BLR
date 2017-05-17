app.Asset.Window = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'window';
		this.width = 10;
		this.height = 44;
		this.rotation_step = 45;
		this.sticky = true;

		//http://www.ausdesign.com.au/articles/dream/article27.html
		//based on asset height (1.8 for two panes - 0.9 for one)
		this.width_meters = 0.2;

		this.fancy_resize_data = {
			axis: 'y',
			steps: [{
                step_size: 88,
                image: 'window-step2'
            }]
		};

		this._super(data);
	}
});

app.Asset.Bed = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'bed';
		this.width = 109;
		this.height = 59;
		this.rotation_step = 10;

		//http://www.fortywinks.com.au/beds-mattresses/bed.html
		this.width_meters = 1.87;

		this._super(data);
	}
});

app.Asset.DoubleBed = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'double-bed';
		this.width = 109;
		this.height = 94;
		this.rotation_step = 10;

		//http://www.fortywinks.com.au/beds-mattresses/bed.html
		this.width_meters = 1.87;

		this._super(data);
	}
});

app.Asset.Table = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'table';
		this.width = 94;
		this.height = 77;
		this.rotation_step = 10;

		//guess
		this.width_meters = 1.50;

		this.fancy_resize_data = {
			axis: 'y',
			steps: [{
                step_size: 123,
                image: 'table-step2'
            }]
		};

		this._super(data);
	}
});

app.Asset.RoundTable = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'round-table';
		this.width = 70;
		this.height = 67;
		this.rotation_step = 10;

		//guess
		this.width_meters = 1.30;

		this._super(data);
	}
});

app.Asset.SmallTable = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'small-table';
		this.width = 35;
		this.height = 33;
		this.rotation_step = 10;

		//guess
		this.width_meters = 0.9;

		this._super(data);
	}
});

app.Asset.Chair = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'chair';
		this.width = 26;
		this.height = 21;
		this.rotation_step = 10;

		//self measured
		this.width_meters = 0.7;

		this._super(data);
	}
});

app.Asset.Couch = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'couch';
		this.width = 46;
		this.height = 83;
		this.rotation_step = 10;

		this.fancy_resize_data = {
			axis: 'y',
			steps: [{
                step_size: 125,
                image: 'couch-step2'
            }]
		};

		//self measured
		this.width_meters = 0.75;

		this._super(data);
	}
});

app.Asset.Recliner = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'recliner';
		this.width = 67;
		this.height = 34;
		this.rotation_step = 10;

		//self measured
		this.width_meters = 1.4;

		this._super(data);
	}
});

app.Asset.Tv = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'tv';
		this.width = 22;
		this.height = 118;
		this.rotation_step = 45;
		this.sticky = true;

		//self measured (52 cm)
		this.width_meters = 0.11;

		this._super(data);
	}
});

app.Asset.CinemaScreen = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'cinema-screen';
		this.width = 7;
		this.height = 160;
		this.rotation_step = 45;
		this.sticky = true;

		//guess
		this.width_meters = 0.08;

		this._super(data);
	}
});

app.Asset.Bench = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'bench';
		this.width = 140;
		this.height = 42;
		this.rotation_step = 10;

		//self measured
		this.width_meters = 1.8;

		this._super(data);
	}
});

app.Asset.Computer = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'computer';
		this.width = 71;
		this.height = 32;
		this.rotation_step = 10;

		//guess
		this.width_meters = 0.6;

		this._super(data);
	}
});

app.Asset.OfficeDesk = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'office-desk';
		this.width = 141;
		this.height = 43;
		this.rotation_step = 10;

		//self measured
		this.width_meters = 1.8;

		this._super(data);
	}
});

app.Asset.PrintStation = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'print-station';
		this.width = 35;
		this.height = 33;
		this.rotation_step = 10;
		this.width_meters = 1.00;

		//guess
		this.width_meters = 0.6;

		this._super(data);
	}
});

app.Asset.Fridge = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'fridge';
		this.width = 40;
		this.height = 46;
		this.rotation_step = 45;
		this.sticky = true;

		//self measured
		this.width_meters = 0.85;

		this._super(data);
	}
});

app.Asset.KitchenSink = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'kitchen-sink';
		this.width = 42;
		this.height = 46;
		this.rotation_step = 45;
		this.sticky = true;

		//guess
		this.width_meters = 0.5;

		this._super(data);
	}
});

app.Asset.Stove = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'stove';
		this.width = 43;
		this.height = 48;
		this.rotation_step = 45;
		this.sticky = true;

		//guess
		this.width_meters = 0.5;

		this._super(data);
	}
});

app.Asset.BathroomSink = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'bathroom-sink';
		this.width = 18;
		this.height = 34;
		this.rotation_step = 45;
		this.sticky = true;

		//guess
		this.width_meters = 0.4;

		this._super(data);
	}
});

app.Asset.Toilet = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'toilet';
		this.width = 41;
		this.height = 23;
		this.rotation_step = 45;
		this.sticky = true;

		//guess
		this.width_meters = 0.8;

		this._super(data);
	}
});

app.Asset.Painting = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'painting';
		this.width = 4;
		this.height = 44;
		this.rotation_step = 45;
		this.sticky = true;

		//guess
		this.width_meters = 0.1;

		this._super(data);
	}
});

app.Asset.Projector = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'projector';
		this.width = 38;
		this.height = 35;
		this.rotation_step = 10;
		this.sticky = true;

		//guess
		this.width_meters = 0.5;

		this._super(data);
	}
});

app.Asset.Point = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'point';
		this.width = 20;
		this.height = 12;
		this.rotation_step = 45;
		this.sticky = false;

		//guess
		this.width_meters = 0.3;

		this._super(data);
	}
});

app.Asset.Extractor = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'extractor';
		this.width = 32;
		this.height = 32;
		this.rotation_step = 45;
		this.sticky = false;

		//guess
		this.width_meters = 0.7;

		this._super(data);
	}
});

app.Asset.Fan = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'fan';
		this.width = 92;
		this.height = 80;
		this.rotation_step = 45;
		this.sticky = false;

		//guess
		this.width_meters = 1.2;

		this._super(data);
	}
});

app.Asset.LightDetector = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'light-detector';
		this.width = 20;
		this.height = 25;
		this.rotation_step = 45;
		this.sticky = false;

		//guess
		this.width_meters = 0.3;

		this._super(data);
	}
});

app.Asset.MotionDetector = app.ResizableAsset.extend({
	create_path: function(data) {
		this.type = 'motion-detector';
		this.width = 20;
		this.height = 25;
		this.rotation_step = 45;
		this.sticky = false;

		//guess
		this.width_meters = 0.3;

		this._super(data);
	}
});

app.Asset.SmokeDetector = app.ResizableAsset.extend({
    create_path: function(data) {
        this.type = 'smoke-detector';
        this.width = 19;
        this.height = 19;
        this.rotation_step = 45;
        this.sticky = false;

        //guess
        this.width_meters = 0.3;

        this._super(data);
    }
});

app.Asset.SolarPanel = app.Asset.extend({
    create_path: function(data) {
        this.type = 'solar-panel';
        this.name = 'Solar panel (Tindo Solar)';
        this.width = 63;
        this.height = 104;
        this.rotation_step = 10;
        this.width_meters = 1;
        this.height_meters = 1.667;

        this._super(data);
    },

    export: function() {
        var asset = this._super();

        asset.name = this.name;

        return asset;
    },
});

app.Asset.RedbackInverter = app.Asset.extend({
    create_path: function(data) {
        this.type = 'redback-inverter';
        this.width = 63;
        this.height = 104;
        this.rotation_step = 10;
        this.width_meters = 1;
        this.height_meters = 1.667;

        this._super(data);
    },

    export: function() {
        var asset = this._super();

        asset.name = this.name;

        return asset;
    },
});

app.Asset.WaterSolenoid = app.ResizableAsset.extend({
    create_path: function(data) {
        this.type = 'water-solenoid';
        this.width = 32;
        this.height = 32;
        this.rotation_step = 45;
        this.sticky = false;

        //guess
        this.width_meters = 0.7;

        this._super(data);
    }
});

app.Asset.ThermalOptimiser = app.ResizableAsset.extend({
    create_path: function(data) {
        this.type = 'thermal-optimiser';
        this.width = 20;
        this.height = 25;
        this.rotation_step = 45;
        this.sticky = false;

        //guess
        this.width_meters = 0.3;

        this._super(data);
    }
});