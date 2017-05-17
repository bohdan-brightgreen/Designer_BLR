/**
 * app.ui.add_area
 * Opens the add area dialog
 *
 */
app.ui.image_crop = {
	dialog: null,
	uploaded_floorplan_data: null,
	is_new_project: null,
	initialised: null,
    img: null,

	init: function() {
		this.bind_events();
		this.initialised = true;
	},

	bind_events: function() {
		app.sub('floorplan_upload_complete', this.on_floorplan_upload_complete, this);
        app.sub('image_crop.rotated', this.on_crop_rotate, this);
	},

	init_dialog: function(with_back) {
		//this.uploaded_floorplan_data = uploaded_floorplan_data;

		if (!this.initialised) {
			//first time - initialize...
			this.init();
		}

		this.dialog = $('#image_crop_dialog').dialog({
			title: 'Crop Floorplan PDF...',
			width: 600,
			height: 520,
			resizable: false,
			draggable: true,
			//position: pos,
			buttons: {
				"Continue...": function() {
					app.ui.image_crop.crop_image();
				},
				"Back": function() {
					//app._crop_dialog.dialog("close");
					app.ui.image_crop.hide();
					app.ui.new_project.show();
				}
			},
			open: function() {
                app.ui.add_area.hide();
                app.ui.on_dialog_show();
                $(this).parent().find(".ui-dialog-titlebar-close").hide();
            },
			beforeClose: function() {
                app.ui.on_dialog_hide();
            }
		});
	},

	show: function(with_back) {
		this.init_dialog(with_back);

		$('#crop_image_path').val(this.uploaded_floorplan_data.thumbnail);
		$('#full_image_path').val(this.uploaded_floorplan_data.image);

		this.img = $('<img src="' + this.uploaded_floorplan_data.thumbnail + '"/>');
		$('#image_cropper').html(this.img);

		//initialize image cropper
        this.img.cropper({
            viewMode: 1,
            minCropBoxWidth: 20,
            minCropBoxHeight: 20,
            guides: false,
            background: false,
            dragMode: 'none',
            zoomable: false,
            zoomOnTouch: false,
            zoomOnWheel: false,
            toggleDragModeOnDblclick: false
        });

        $('#crop_rotate_slider').slider({
            min: -180,
            max: 180,
            step: 0.5,
            value: 0,
            create: function() {
                $(this).find('a').html('<span />').find('span').html('0&deg;');
            },
            slide: function(event, ui) {
                app.pub('image_crop.rotated', ui.value);
            }
        });
	},

	hide: function() {
		if (this.dialog) {
			$(this.dialog).dialog("close");
		}
	},

    on_crop_rotate: function(event, scope) {
        this.img.cropper('rotateTo', scope);
        $('#crop_rotate_slider a span').html( scope + '&deg;');
    },

	crop_image: function() {
		var data = this.img.cropper('getData');

        $('#crop_data').val(JSON.stringify(data));
		app.set_loading($('.crop_dialog'), true);
		$('#crop_form').submit();
	},

	crop_image_callback: function(response) {
		app.set_loading($('.crop_dialog'), false);
		if (!response.success) {
			var error_msg = (response.result || 'An error has occured, please check the information and try again');
			alert(error_msg);

		} else {
			//success
			app.ui.image_crop.hide();
            $('#crop_rotate_slider a span').html('0&deg;');

			if (this.is_new_project == 'true') {
				app.project_manager.select_new_project();

			} else {
				app.project_manager.select_area(app.project_manager.new_area);
			}

            app.designer.initialize_new_area();

			if (response.result) {
				app.designer.import_background_image({
                    url: response.result
                });
			}
		}
	},

	/*on_project_save_callback: function(project) {
		console.log("saved", project);
	},*/

	on_floorplan_upload_complete: function(e, data) {
		this.uploaded_floorplan_data = data.result;
		this.is_new_project = data.is_new_project;
		this.show();
	}
};