/**
 * app.ui.share_dialog
 * Opens the share dialog
 *
 */
app.ui.share_dialog = {
	dialog: null,
    initialised: false,
	element: null,
    elements: {
        list: null,
        add_share: null,
        loading: null
    },

	init: function() {
		this.element = $('#share_dialog');

        this.elements.list = this.element.find('.list');
        this.elements.add_share = this.element.find('.add-share');
        this.elements.loading = this.element.find('.loading');

        this.bind_events();
        this.initialised = true;
	},

	bind_events: function() {
        $(document.body).on('click', '.share-edit-toggle', $.proxy(this.on_share_edit_click, this));
        $(document.body).on('click', '.delete_share', $.proxy(this.on_share_delete_click, this));

        $(document.body).on('click', '#shared_projects_add .add', $.proxy(this.on_add_btn_click, this));
        $(document.body).on('click', '#shared_projects_add .back', $.proxy(this.on_back_btn_click, this));
        //app.sub('not_logged_in', this.on_not_logged_in, this);
	},

	init_dialog: function() {
        if (!this.initialised) {
            this.init();
        }

		var buttons = {
            'Add user': $.proxy(function() {
                this.on_add_user_btn_click();
            }, this),
            'Close': function() {
                $(this).dialog('close');
            }
        };

		this.dialog = this.element.dialog({
			title: 'Share projects',
			width: 500,
			height: 450,
			resizable: false,
			draggable: true,
			dialogClass: 'share-project-dialog',
			buttons: buttons
		});
	},

	show: function() {
		this.init_dialog();
        this.refresh();
        this.show_list();
        this.dialog.dialog('open');
	},

	hide: function() {
		if (this.dialog && this.dialog.is(':visible')) {
			$(this.dialog).dialog('close');
		}
	},

    refresh: function() {
        $('#shared_projects_list').hide();
        this.elements.loading.show();
        app.project_manager.get_shared_projects($.proxy(this.on_shared_projects_callback, this));
    },

    on_shared_projects_callback: function(data) {
        app.ui.render_template('shared_projects_template', data, '#shared_projects_list');
        app.ui.render_template('shared_projects_add_template', data, '#shared_projects_add');
        $('#shared_projects_list').show();
        this.elements.loading.hide();
    },

    on_share_edit_click: function(event) {
        app.project_manager.edit_shared_project({
            projectId: event.target.getAttribute('data-project-id'),
            userId: event.target.getAttribute('data-user-id'),
            state: $('#' + event.target.id).is(':checked')
        });
    },

    on_share_delete_click: function(event) {
        if (!confirm('Are you sure you want to remove access to this project?')) {
            return;
        }

        var el = (event.target.tagName === 'A') ? $(event.target) : $(event.target).closest('A');

        app.project_manager.delete_shared_project({
            projectId: el.data('project-id'),
            userId: el.data('user-id')
        }, $.proxy(this.on_delete_callback, this));
    },

    on_delete_callback: function(data) {
        if (!data.hasOwnProperty('projectId') || !data.hasOwnProperty('userId')) {
            return;
        }

        this.element.find('#share-row-' + data.projectId + '-' + data.userId).find('td').fadeOut(1000, function() {
            $(this).remove();
        });
    },

    on_add_user_btn_click: function() {
        this.hide_list();
    },

    on_back_btn_click: function() {
        this.show_list();
    },

    on_add_btn_click: function() {
        var email = this.element.find('#share-email').val();
        if (!app.ui.validate_email(email)) {
            alert('Please enter valid email address.');
            return;
        }

        this.elements.add_share.hide();
        this.elements.loading.show();

        app.project_manager.share_project({
            projectId: this.element.find('#share-project-name').val(),
            email: email,
            is_editable: this.element.find('#share-add').is(':checked')
        }, $.proxy(this.on_share_callback, this));
    },

    on_share_callback: function() {
        this.refresh();
        this.show_list();

        this.element.find('#share-email').val('');
    },

    show_list: function() {
        this.elements.list.show();
        this.elements.add_share.hide();
        this.element.parent().find('.ui-dialog-buttonset .ui-button:first').show();
    },

    hide_list: function() {
        this.elements.list.hide();
        this.elements.add_share.show();
        this.element.parent().find('.ui-dialog-buttonset .ui-button:first').hide();
    }
};