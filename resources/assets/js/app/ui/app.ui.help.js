/**
 * app.ui.open_project
 * Opens open project dialog
 *
 */
app.ui.help = {
	dialog: null,
	events_initialised: null,

	init: function() {

	},

	init_dialog: function() {
		//var tag = $("<div></div>");
		//var url = "includes/ui/help.php";

		this.health_check_button = $('<a href="javascript:void(0);" id="healthcheck_link">healthcheck</a>');
		this.health_check_button.click($.proxy(this.on_healthcheck_click, this));

        //var container = $("<div></div>").html(data);
        var container = $("#help_dialog");
        app.ui.help.dialog = container.dialog({
            title: 'Help',
            width: 700,
            //height: "auto",
            height: 550,
            //maxHeight: 400,
            modal: false,
            dialogClass: 'dialog_large',
            resizable: false,
            draggable: true,
            buttons: [],
            open: function() {
                app.ui.on_dialog_show();

                var close_button = $(this).parent().find(".ui-dialog-titlebar-close");
                app.ui.help.health_check_button.insertBefore(close_button);
            },
            beforeClose: $.proxy(function() {
                app.ui.on_dialog_hide();
            }, this)
        });

		/*$.ajax({
			url: url,
			success: function(data) {
				var container = $("<div></div>").html(data);
				app.ui.help.dialog = container.dialog({
					title: 'Help',
					width: 700,
					//height: "auto",
					height: 550,
					//maxHeight: 400,
					modal: false,
					dialogClass: 'dialog_large',
					resizable: false,
					draggable: true,
					buttons: [],
					open: function(){
						app.ui.on_dialog_show();

						var close_button = $(this).parent().find(".ui-dialog-titlebar-close");
						app.ui.help.health_check_button.insertBefore(close_button);
					},
					beforeClose: $.proxy(function(){
						app.ui.on_dialog_hide();
					}, this)
				});
			}
		});*/

	},

	show: function() {
		if (!this.dialog) {
			this.init_dialog();

		} else {
			this.dialog.dialog("open");
		}
	},

	hide: function() {
		if (this.dialog) {
			this.dialog.dialog("close");
		}
	},

	on_healthcheck_click: function() {
		this.dialog.dialog("close");
		app.health_check.show();
	}

	/*play: function(videoId) {
		$('.help-video').removeClass('visible');
		$('#help_video-'+ videoId).addClass('visible');
	}*/
};
