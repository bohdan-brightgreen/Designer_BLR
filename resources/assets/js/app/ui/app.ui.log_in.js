/**
 * app.ui.log_in
 * Opens the login screen dialog
 *
 */
app.ui.log_in = {
	dialog: null,
	init: function() {
		app.sub('not_logged_in', this.on_not_logged_in, this);
	},

	init_dialog: function(with_back) {
		$('#login_error_message').hide();
		var container = $('#log_in_dialog');
		var buttons = {};
		buttons["Log In"] = $.proxy(function() {
			$('#login_error_message').hide();
			var email = $('#log_in_email').val();
			var password = $('#log_in_password').val();
			var posta_data = 'data[Login][username]=' + encodeURIComponent(email) + '&data[Login][password]=' + encodeURIComponent(password);
			//var url = 'http://designer.brightgreen.com/';
			var url = 'https://account.brightgreen.com/account/login/brightgreen';
			$.ajax({
				context: this,
				url: url,
				data: posta_data,
				type: "POST",
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					//this is such a hack, need to talk to andrew about an API method
					var login_page = $(data);
					var type = login_page.find('.flash_type');
					if (type.html() == 'ERROR!') {
						console.log('login failed');
						$('#login_error_message').show();
					} else {
						console.log('login success');
						app.ui.log_in.hide();
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(errorThrown);
				}
			});
		}, this);

		this.dialog = container.dialog({
			title: 'Log In',
			width: 500,
			height: 270,
			modal: false,
			dialogClass: 'log_in_dialog',
			resizable: false,
			draggable: true,
			buttons: buttons,
			open: function() {
				app.ui.on_dialog_show();
				app.ui.designer_overlay.hide_loading();
				$(this).parent().find(".ui-dialog-titlebar-close").hide();
			},
			beforeClose: function() {
				app.ui.on_dialog_hide();
				if (!app.project_manager.selected_project) {
					app.ui.getting_started.show();
				}
			}
		});
	},

	show: function() {
		this.init_dialog();
		this.dialog.dialog("open");
	},

	hide: function() {
		if (this.dialog) {
			$(this.dialog).dialog("close");
		}
	},

	on_not_logged_in: function(e, data) {
		//console.log("show the login dialog");
		this.show();
	}
};