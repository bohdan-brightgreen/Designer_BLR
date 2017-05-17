app.ui.FloorplanUpload = Class.extend({
	element: null,
	checkbox: null,
	file_input: null,
	is_new_project: null,
	valid_floorplan_types: ['pdf', 'gif', 'tiff', 'png', 'jpg', 'jpeg'],

	init: function(parent_element_selector, is_new_project) {
		this.element = $(parent_element_selector);
		this.is_new_project = (typeof is_new_project === 'undefined') ? false : is_new_project;

		if (!this.element.length) {
			throw {message : 'The parent element was not found in the page'};
		}

		var id_suffix = new Date().getTime();
		app.ui.render_template("floorplan_upload_template", {
            id_suffix: id_suffix
        }, parent_element_selector);

		this.checkbox = this.element.find('.has_floorplan');
		this.checkbox.change($.proxy(function() {
			if (this.checkbox.is(':checked')) {
				this.element.find('.floorplan_upload_container').show();

			} else {
				this.element.find('.floorplan_upload_container').hide();
			}
		}, this));

		this.file_input = this.element.find('.floorplan_file');
		this.file_input.change($.proxy(function(){
			var filename = this.file_input.val();
			var is_pdf = false;

			if (filename !== "" && !this.is_valid_floorplan_file(filename)) {
				alert('Invalid file type (supported formats: (' + this.valid_floorplan_types.join(', ') + ')');
				$(this).val('');

			} else {
				if (this.is_pdf_floorplan_file(filename)) {
					is_pdf = true;
				}
			}

			if (is_pdf) {
				this.element.find('.floorplan_pdf_page_container').show();

			} else {
				this.element.find('.floorplan_pdf_page_container').hide();
			}
		}, this));
	},

	is_valid_floorplan_file: function(file) {
		if (file) {
			var get_ext = file.split('.');
			get_ext = get_ext.reverse();
			return ($.inArray(get_ext[0].toLowerCase(), this.valid_floorplan_types) > -1);
		}

		return false;
	},

	is_pdf_floorplan_file: function(file) {
		if (file) {
			var get_ext = file.split('.');
			get_ext = get_ext.reverse();
			return (get_ext[0].toLowerCase() === 'pdf');
		}

		return false;
	},

	is_floorplan_selected: function() {
		if (this.checkbox.is(':checked') && this.file_input.val().trim() !== '' && this.is_valid_floorplan_file(this.file_input.val().trim())) {
			return true;
		}
		return false;
	},

	upload_pdf: function(project_name, project_type, area_name) {
		this.element.find('.add_area_project_name').val(project_name + "_" + area_name);
		this.element.find('.add_area_project_type').val(project_type);
		this.element.find('.is_new_project').val(this.is_new_project);
		app.set_loading($(this.element), true);

		this.element.find('.floorplan_upload_form').submit();
		//$('#new_project_form input, #new_project_form select').attr('disabled', true);
	}
});

/*app.ui.floorplan_upload = {
	upload_floorplan_callback: function(response) {

	}
};*/