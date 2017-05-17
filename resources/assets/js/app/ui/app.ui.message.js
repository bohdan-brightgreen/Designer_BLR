/**
 * app.ui.message
 * Shows messages to user
 *
 */
app.ui.message = {

	element: null,

	message: {
		error: {
			unknown        : 'An unknown error has occured.',
			load_project   : 'Cannot load the project.',
			save_project   : 'Cannot save current project.',
			delete_project : 'Cannot delete the project.',
			export_project : 'Cannot export the project.',
			login          : 'Your session has expired. Please login again.',
			permission     : 'You do not have permission to edit this project.',
			locked         : 'Area is currently being edited by another user.',
            autosave       : 'Project has been automatically saved.',
            load_shared_project   : 'Cannot load shared projects.',
            delete_shared_project : 'Cannot delete user from shared projects.',
            create_shared_project : 'Cannot share project.'
		}
	},

	init: function() {
		this.element = $('#message'),
		this.bind_events();
	},

	bind_events: function() {
		app.sub('error', this.on_error, this);
		app.sub('message', this.on_message, this);
		app.sub('message_hide', this.hide, this);
		
		this.element.find('.dismiss').click($.proxy(this.hide, this));
	},

	show: function(title, text) {
		this.element.find('h3').html(title);
		this.element.find('.text').html(text);
		this.element.addClass('active');
	},

	hide: function() {
		this.element.removeClass('active');
		if ($('#loading-screen').length > 0) {
			$('#loading-screen').hide();
		}
	},
	
	on_error: function(event, scope) {
		var text = this.message.error.unknown;

		if (this.message.error.hasOwnProperty(scope)) {
			text = this.message.error[scope];
		}

		this.show('Error!', text);
	},
	
	on_message: function(event, scope) {
		if (!scope.hasOwnProperty(title)
			|| !scope.hasOwnProperty(text)
		) {
			return;
		}

		this.show(scope.title, scope.text);
	}
};
