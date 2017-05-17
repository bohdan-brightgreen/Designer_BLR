app.project_manager = {
	projects  : null,
	areas : null,
	initialised: null,

	//for the currently active project objects
	selected_project : null,
	selected_design : null,
	selected_area : null,

	//when creating a new project
	new_project: null,
	new_design: null,
	new_area: null,

    autosave: {
        enabled: true,
        timerId: null,
        inProgress: false,
        //interval: (30 * 1000),
        interval: (5 * 60 * 1000),   // autosave interval in milliseconds (thousandths of a second)

        stop: function() {
            window.clearTimeout(this.timerId);
        },

        start: function() {
            this.inProgress = true;
        },

        end: function() {
            this.inProgress = false;
        },

        reset: function() {
            this.stop();
            this.end();

            if (this.enabled) {
                this.timerId = setTimeout(function() {
                    //console.log('autosave');
                    app.project_manager.autosave.start();
                    app.project_manager.save_project();
                }, this.interval);
            }
        }
    },

	init: function() {
		if (!this.initialised) {
			this.areas = [];
			this.initialised = true;
		}

        // Local events
        app.sub('project_manager.project.ready', this.on_project_ready, this);
        app.sub('project_manager.save.started', this.on_save_started, this);
        app.sub('project_manager.save.finished', this.on_save_finished, this);
	},

    on_project_ready: function() {
        //console.log('project ready');
        this.autosave.stop();
        this.autosave.reset();
    },

    on_save_started: function() {
        this.autosave.stop();
    },

    on_save_finished: function() {
        this.autosave.reset();
    },

	get_projects_sample: function(success, error) {
	  
		app.project_manager.projects = [$.parseJSON(app.sample_project)];
		this.selected_project = $.parseJSON(app.sample_project);
		this.selected_design = this.selected_project.designs[0];
		this.selected_area = this.selected_design.areas[0];

		//this.select_area(this.selected_area);

		app.pub('design_selected', [this.selected_project, this.selected_design]);
	},

	get_projects: function(success, error) {
		if (!this.initialised) {
			this.init();
		}

		$.ajax({
			context: this,
			url: app.api.get.projects,
			data: {
                structure: true
            },
			type: "GET",
			xhrFields: {
				withCredentials: true
			},
			success: function(data) {
				try {
					this.check_returned_data(data);
					this.projects = data;
				}
				catch(ex) {
					if (ex.message == 'No data exist') {
						this.projects = [];

					} else {
						console.log(ex);
						app.pub('error', 'load_project');
						app.pub('projects_load_error', [data, ex.message]);
						if (typeof error !== "undefined") {
							error(area, ex.message, ex);
						}
						return;
					}
				}

				if (typeof success !== "undefined") {
					success(this.projects);
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {
				if (typeof error !== "undefined") {
					error(jqXHR, textStatus, errorThrown);

				} else {
					console.log(errorThrown);
				}
			}
		});
	},

    select_project: function(projectId) {

        $.ajax({
            context: this,
            url: app.api.get.project + '/' + projectId,
            data: {},
            type: "GET",
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                try {
                    this.check_returned_data(data);

                    this.selected_project = data;
                    this.selected_design = this.selected_project.designs[0];
                    this.selected_area = this.selected_design.areas[0];
                    this.areas = this.selected_design.areas;

                    app.pub('design_selected', [this.selected_project, this.selected_design]);
                    app.pub('project_manager.project.ready');

                    //this.select_area(this.selected_design.areas[0]);

                }
                catch(ex) {
                    console.log(ex);
                    app.pub('error', 'load_project');
                    app.pub('projects_load_error', [data, ex.message]);
                    return;
                }

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    },

	/*select_design: function(project_id, design_index) {
		//var p_id = (app.use_local_storage) ? project_id : String(project_id);
        //var p_id = project_id;
		this.selected_project = _.find(this.projects, {id: project_id});
		this.selected_design = this.selected_project.designs[design_index];
		this.selected_area = this.selected_design.areas[0];
		this.areas = this.selected_design.areas;

		app.pub('design_selected', [this.selected_project, this.selected_design]);
        app.pub('project_manager.project.ready');

		this.select_area(this.selected_design.areas[0]);
	},*/

	select_new_project: function() {
		this.selected_project = this.new_project;
		this.selected_design = this.new_design;
		this.selected_area = this.new_area;
		this.areas = this.selected_design.areas;
		this.select_area(this.selected_area);

		app.pub('design_selected', [this.selected_project, this.selected_design]);
	},

	get_area: function(area_id, force_refresh, success, error, suppress_finished_event) {
		force_refresh = (typeof force_refresh === 'undefined') ? false : force_refresh;
		suppress_finished_event = (typeof suppress_finished_event === 'undefined') ? false : suppress_finished_event;
		var area = _.find(this.selected_design.areas, {id : area_id});

		//if((typeof area === 'undefined' || typeof area['designer_data'] === 'undefined' || force_refresh) && (typeof area.id === 'string') && area.id.indexOf('temp-') !== 0) {
        if((typeof area === 'undefined' || typeof area['designer_data'] === 'undefined' || force_refresh) && typeof area.id === 'number') {
			app.pub('area_load_started', area);

			$.ajax({
				context: this,
				url: app.api.get.area + '/' + area_id,
				data: {},
				type: "GET",
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					try {
						this.check_returned_data(data);
						area['designer_data'] = $.parseJSON(data.value);
					}
					catch(ex) {
						console.log(ex);
						app.pub('error', 'load_project');
						app.pub('area_load_error', [area, ex.message]);
						if (typeof error !== "undefined") {
							error(area, ex.message, ex);
						}
						return;
					}

					if (!suppress_finished_event) {
						app.pub('area_load_finished', area);
					}

					if (typeof success !== "undefined") {
						success(area);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					app.pub('area_load_error', [area, textStatus]);
					if (typeof error !== "undefined") {
						error(area, textStatus, errorThrown);

					} else {
						console.log(errorThrown);
					}
				}
			});

		} else {
			success(area);
		}

	},

	load_area: function(area) {
		this.get_area(area.id, false, function(area) {
			if (typeof area.designer_data !== 'undefined') {
				app.pub('area_data_loaded', area);
			}
		});
	},

	select_area: function(area) {
		if (this.selected_area !== null && this.selected_area.id != area.id) {
			this.selected_area['designer_data'] = app.designer.data_manager.export();
		}

		this.selected_area = area;
		this.load_area(this.selected_area);
		app.pub('area_selected', this.selected_area);
	},

	save_project: function(success, error) {
		if (!this.initialised) {
			this.init();
		}

        app.pub('project_manager.save.started');
		this.save_project_remote($.proxy(this.save_success, this));
	},

	save_success: function(data) {
		this.save_design(this.selected_design, $.proxy(this.save_design_success, this));
	},

	save_design_success: function(data) {
		this.save_all_areas($.proxy(this.save_area_success, this));
	},

	save_area_success: function(area) {
		app.pub("area-save-finished", area);
        app.pub('project_manager.save.finished');
	},

	save_project_remote: function(success, error) {
		app.pub("project_save_started", this.selected_project);
		var new_project = (this.selected_project.id === null);

		var project_data = {
			title: this.selected_project.title,
			property_type: this.selected_project.property_type,
			client_email: this.selected_project.client_email,
			client_name: this.selected_project.client_name
		};


		if (!new_project) {
			project_data.id = this.selected_project.id;
		}
		var method = (new_project) ? 'post' : 'put';

		//create (or update) project...
		$.ajax({
			context: this,
			url: app.api[method].project,
			data: project_data,
			type: method.toUpperCase(),
			xhrFields: {
                withCredentials: true
            },
			success: function(data) {
				try {
					this.check_returned_data(data);

					if (new_project) {
						this.selected_project.id = data.id;
					}

					app.pub("project_save_finisehd", this.selected_project);
				}
				catch(ex) {
					console.log(ex);
					app.pub('error', 'save_project');
					app.pub('project_save_error', [this.selected_project, ex.message]);
					if (typeof error !== "undefined") {
						error(area, ex.message, ex);
					}
					return;
				}

				if (typeof success !== "undefined") {
					success(data);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				app.pub("project_save_error", this.selected_project);
				if (typeof error !== "undefined") {
					error(jqXHR, textStatus, errorThrown);

				} else {
					console.log(errorThrown);
				}

                app.pub('project_manager.save.finished');
			}
		});
	},

	save_design: function(design, success, error) {
		app.pub("design_save_started", design);
		if (design.id === null) {
			design.project_id = this.selected_project.id;

			$.ajax({
				context: this,
				url: app.api.post.design,
				data: {
                    title: design.title,
                    project_id: design.project_id,
                    description: design.description
                },
				type: "POST",
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					try {
						this.check_returned_data(data);
						design.id = data.id;
						app.pub("design_save_finisehd", design);
					}
					catch(ex) {
						console.log(ex);
						app.pub('error', 'save_project');
						app.pub('design_save_error', [design, ex.message]);
						if (typeof error !== "undefined") {
							error(area, ex.message, ex);
						}
						return;
					}

					if (typeof success !== "undefined") {
						success(data);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					app.pub("design_save_error", design);
					if (typeof error !== "undefined") {
						error(jqXHR, textStatus, errorThrown);

					} else {
						console.log(errorThrown);
					}

                    app.pub('project_manager.save.finished');
				}
			});

		} else {

			$.ajax({
				context: this,
				url: app.api.put.design,
				data: {
                    id : design.id,
                    title: design.title,
                    description: design.description
                },
				type: "PUT",
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					try {
						this.check_returned_data(data);
						app.pub("design_save_finisehd", design);
					}
					catch(ex) {
						console.log(ex);
						app.pub('design_save_error', [design, ex.message]);
						if (typeof error !== "undefined") {
							error(area, ex.message, ex);
						}
						return;
					}

					if (typeof success !== "undefined") {
						success(data);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					app.pub('error', 'save_project');
					app.pub("design_save_error", design);
					if (typeof error !== "undefined") {
						error(jqXHR, textStatus, errorThrown);

					} else {
						console.log(errorThrown);
					}

                    app.pub('project_manager.save.finished');
				}
			});
		}
	},

	save_area: function(area, success, error) {
		app.pub("area-save-started", area);

		if (area.id == this.selected_area.id) {
			area['designer_data'] = app.designer.data_manager.export();
		}

		var area_val = JSON.stringify(area.designer_data);

		//if (typeof area.id === 'number' || area.id.indexOf('temp-') === 0) {
        if (typeof area.id !== 'number') {
            //console.log('area create');
			area.design_id = this.selected_design.id;

			$.ajax({
				context: this,
				url: app.api.post.area,
				data: {
                    title: area.title,
                    design_id: area.design_id,
                    value: area_val
                },
				type: "POST",
				xhrFields: {
					withCredentials: true
				},
				xhr: function() {
					var xhr = jQuery.ajaxSettings.xhr();
					if (xhr instanceof window.XMLHttpRequest) {
						xhr.upload.addEventListener('progress', app.project_manager.on_progress, false);
					}
					return xhr;
				},
				success: function(data) {
					try {
						this.check_returned_data(data);
						area.id = data.id;
					}
					catch(ex) {
						console.log(ex);
						app.pub('area_save_error', [area, ex.message]);
						if (typeof error !== "undefined") {
							error(area, ex.message, ex);
						}
						return;
					}
					if (typeof success !== "undefined") {
						success(area);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					app.pub('area_save_error', [area, textStatus]);
					if (typeof error !== "undefined") {
						error(jqXHR, textStatus, errorThrown);

					} else {
						console.log(errorThrown);
					}

                    app.pub('project_manager.save.finished');
				}
			});

		} else {
            //console.log('area update');
			$.ajax({
				context: this,
				url: app.api.put.area,
				data: {
                    id: area.id,
                    title: area.title,
                    value: area_val
                },
				type: "PUT",
				xhrFields: {
					withCredentials: true
				},
				xhr: function() {
					var xhr = jQuery.ajaxSettings.xhr();
					if (xhr instanceof window.XMLHttpRequest) {
						xhr.upload.addEventListener('progress', app.project_manager.on_progress, false);
					}
					return xhr;
				},
				success: function(data) {
					try {
						this.check_returned_data(data);
					}
					catch(ex) {
						console.log(ex);
						app.pub('error', 'save_project');
						app.pub('area_save_error', [area, ex.message]);
						if (typeof error !== "undefined") {
							error(area, ex.message, ex);
						}
						return;
					}
					if (typeof success !== "undefined") {
						success(area);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					app.pub('area_save_error', [area, textStatus]);
					if (typeof error !== "undefined") {
						error(jqXHR, textStatus, errorThrown);

					} else {
						console.log(errorThrown);
					}

                    app.pub('project_manager.save.finished');
				}
			});
		}
	},

	on_progress: function(e) {
        app.pub('area_save_progress', [e.total, e.loaded]);
	},

	create_new_project: function(name, property_type, client_name, client_email) {
		this.new_project = {
			id: null,
			title: name,
			property_type: property_type,
			client_name: client_name,
			client_email: client_email,
			designs: []
		};

        app.pub('project_manager.project.ready');

		return this.new_project;
	},

	create_new_design: function(name, description, is_new_project) {
		is_new_project = (typeof is_new_project === 'undefined') ? false : is_new_project;
		var project_id = null;

		var design = {
			id: null,
			title: name,
			descrption: description,
			//project_id: this.project.id,
			areas: []
		};
		this.new_design = design;
		if (!is_new_project) {
			this.new_design['project_id'] = this.project.id;
			this.project.designs.push(this.new_design);

		} else {
			this.new_design['project_id'] = null;
			this.new_project.designs.push(this.new_design);
		}

		return this.new_design;
	},

	create_new_area: function(name, description, is_new_project) {
		is_new_project = (typeof is_new_project === 'undefined') ? false : is_new_project;
		var area = {
			id: null,
			title: name,
			description: description,
			value: null
		};
		this.new_area = area;
		this.new_area.id = 'temp-' + (new Date().getTime());
		if (!is_new_project) {
			this.new_area['design_id'] = this.selected_design.id;
			this.selected_design.areas.push(this.new_area);
			this.select_area(this.new_area);

		} else {
			this.new_area['design_id'] = null;
			this.new_design.areas.push(this.new_area);
			this.selected_area = this.new_area;
		}

		//this.select_area(this.new_area);
		//this.selected_area = this.new_area;
		app.pub('area_created', this.new_area);
		return this.new_area;
	},

	find_area_by_id : function(area_id) {
		//area_id = (app.use_local_storage) ? area_id : String(area_id);
        area_id = isNaN(area_id) ? String(area_id) : parseInt(area_id);
		return _.find(app.project_manager.selected_design.areas, {id: area_id});
	},

	delete_project: function(project_id, success, error) {
		$.ajax({
			context: this,
			url: app.api.delete.project + '/' + project_id,
			data: {},
			type: "DELETE",
			xhrFields: {
				withCredentials: true
			},
			success: function(data) {
				console.log(data);
				if (typeof success !== "undefined") {
					success(data);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				app.pub('error', 'delete_project');
				if (typeof error !== "undefined") {
					error(jqXHR, textStatus, errorThrown);

				} else {
					console.log(errorThrown);
				}
			}
		});
	},

	//checks if the returned data has errors
	check_returned_data: function(data) {
		if (typeof data.Errors !== 'undefined') {
			var error_message = data.Errors[0].Error;
			if (error_message.indexOf('User not logged in') === 0) {
				app.pub("not_logged_in", data);
				throw {
					name: "Login Error",
					message: error_message
				};
			}
			throw {
				name: "System Error",
				message: error_message
			};
		}
	},

	get_all_areas: function(callback) {
		this.load_all_areas(this.selected_design.areas[0], 0, $.proxy(function() {
			callback(this.selected_project);
		}, this));
	},

	load_all_areas: function(area, count, callback) {
		if (count == this.selected_design.areas.length) {
			callback();
			return;
		}
		//console.log(count, area.id);
		if (!area.designer_data) {
			this.get_area(area.id, false, $.proxy(function(area) {
				count = count + 1;
				this.load_all_areas(this.selected_design.areas[count], count, callback);
			}, this), undefined, true);

		} else {
			count = count + 1;
			this.load_all_areas(this.selected_design.areas[count], count, callback);
		}
	},

	save_all_areas: function(callback) {
		this.selected_area['designer_data'] = app.designer.data_manager.export();
		this.save_areas(this.selected_design.areas[0], 0, $.proxy(function(area) {
			callback(area);
		}, this));
	},

	save_areas: function(area, count, callback) {
		if (count == this.selected_design.areas.length) {
			callback(this.selected_area);
			return;
		}
		//console.log(count, area.id);
		if (!area.designer_data) {
			count = count + 1;
			this.save_areas(this.selected_design.areas[count], count, callback);

		} else {
			//console.log(area);
			this.save_area(area, $.proxy(function(area) {
				count = count + 1;
				this.save_areas(this.selected_design.areas[count], count, callback);
			}, this));
		}
	},

    get_shared_projects: function(success) {
        if (!this.initialised) {
            this.init();
        }

        $.ajax({
            context: this,
            url: app.api.get.share,
            type: "GET",
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                try {
                    this.check_returned_data(data);
                    success(data);
                }
                catch(ex) {
                    if (ex.message == 'No data exist') {
                        success([]);

                    } else {
                        app.pub('error', 'load_shared_project');
                        return;
                    }
                }
            },
            error: function() {
                app.pub('error', 'load_shared_project');
            }
        });
    },

    edit_shared_project: function(data) {
        if (!this.initialised) {
            this.init();
        }

        $.ajax({
            context: this,
            url: app.api.put.share,
            type: 'PUT',
            data: {
                project_id: data.projectId,
                user_id: data.userId,
                is_editable: data.state
            },
            xhrFields: {
                withCredentials: true
            }
        });
    },

    delete_shared_project: function(data, success) {
        if (!this.initialised) {
            this.init();
        }

        $.ajax({
            context: this,
            url: app.api.delete.share + '/' + data.projectId + '/' + data.userId,
            type: 'DELETE',
            data: {},
            xhrFields: {
                withCredentials: true
            },
            success: function() {
                success(data);
            },
            error: function() {
                app.pub('error', 'delete_shared_project');
            }
        });
    },

    share_project: function(data, callback) {
        if (!this.initialised) {
            this.init();
        }

        $.ajax({
            context: this,
            url: app.api.post.share,
            type: 'POST',
            data: {
                project_id: data.projectId,
                email: data.email,
                is_editable: data.is_editable
            },
            xhrFields: {
                withCredentials: true
            },
            success: function() {
                callback();
            },
            error: function() {
                app.pub('error', 'create_shared_project');
                callback();
            }
        });
    },

    export_image: function(data) {
        if (!this.initialised) {
            this.init();
        }
        
        var id = '';

        $.ajax({
            context: this,
            url: app.api.post.export_image,
            type: 'POST',
            async: false,
            data: {
                data: data
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(response) {
                id = response;
            }
        });

        return id;
    }
};