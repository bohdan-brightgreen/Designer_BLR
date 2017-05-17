/**
 * app.ui.getting_started
 * Opens the add "Getting Started" dialog
 *
 */
app.ui.designer_overlay = {
	dialog: null,
	initialised : null,
	init: function() {
		if (!this.initialised) {
			//events for showing the loading screen
			app.sub('area-save-started', this.on_area_save_started, this);
			app.sub('area-save-finished', this.on_area_save_finished, this);
			app.sub('project_save_started', this.on_project_save_started, this);
			app.sub('design_save_started', this.on_design_save_started, this);
			app.sub('area_load_started', this.on_area_load_started, this);
			app.sub('area_load_finished', this.on_area_load_finished, this);
			app.sub('area_load_error', this.on_area_load_error, this);
			app.sub('area_save_progress', this.on_area_save_progress, this);
		}

		this.initialised = true;
	},

	show_loading: function(message) {
		$('#loading-screen').slideDown();
		$('#loading-screen-text').html(message);
		$('#loading-screen-progress').hide();
		$('#loading-screen-spinner').show();
	},

	hide_loading: function() {
		$('#loading-screen').slideUp();
	},

	show_progress: function(message, total, progress) {
		$('#loading-screen-text').html(message);
		if (total > 0) {
			var percent = Math.round((progress / total) * 100);
			$('#loading-screen-progress').show().progressbar({
                value: percent
            });
			$('#loading-screen-spinner').hide();
		}
	},

	show_error: function(message, detail) {
		if ($('#loading-screen').is(':visible')) {
			this.hide_loading();
		}
		$('#error-screen').slideDown();
		$('#error-screen-text').html(message);
		$('#error-screen-detail').html(detail);
	},

	hide_error: function() {
		$('#error-screen').slideUp();
	},

	on_project_save_started: function(e, project) {
        if (this.isOverlayAllowed()) {
            this.show_loading('Saving project ' + project.title + '...');
        }
	},

	on_design_save_started: function(e, design) {
        if (this.isOverlayAllowed()) {
            this.show_loading('Saving design ' + design.title + '...');
        }
	},

	on_area_save_started: function(e, area) {
        if (this.isOverlayAllowed()) {
            this.show_loading('Saving area ' + area.title + '...');
        }
	},

	on_area_save_finished: function(e, area) {
        if (this.isOverlayAllowed()) {
            this.hide_loading();
        }
	},

	on_area_load_started: function(e, area) {
		this.show_loading('Loading area ' + area.title + '...');
	},

	on_area_load_finished: function(e, area) {
		this.hide_loading();
	},

	on_area_load_error: function(e, area, err) {
		this.show_error('An error occurred while loading ' + area.title, err);
	},

	on_area_save_progress: function(e, total, progress) {
		if (this.isOverlayAllowed() && total > 0) {
			var percent = Math.round((progress / total) * 100);
			$('#loading-screen-progress').show().progressbar({
                value: percent
            });
			$('#loading-screen-spinner').hide();
		}
	},

    isOverlayAllowed: function() {
        return !app.project_manager.autosave.inProgress;
    }

};