/**
 * app.product_manager
 * Class for interactiing with the Brightgreen product API
 */
app.product_manager = {
	api_url : null,
	curve_data : null,
	cube_data : null,
	retrofit_data : null,
	is_local_dev : null, //specifies if we're developing locally which controls whether or not the JSON calls are proxied
	//local_proxy: null, //the url of the page that proxies requests when developing locally
	data: null,
	products: null,

	//these are for light image caching
	//loaded_light_icons_count: null,
	//loaded_light_icons_errors: null,

	init: function() {
		//this.local_proxy = 'dev.proxy.php';
		//this.api_url = 'https://brightgreen.com/api/get/lights.json';
        //this.api_url = 'https://api.brightgreen.com/brightgreen/v2/lights/details';
        if (document.domain == "designer.bg.dev") {
            this.api_url = 'https://api.bg.dev';
        } else {
            this.api_url = 'https://api.brightgreen.com';
        }

        this.api_url += '/brightgreen/v2/lights/details';
		if (app.use_local_storage) {
			this.api_url = document.location.protocol + '//' + document.domain + document.location.pathname + '/js/sample.lights.json';
		}
	},

	/**
	 * Retrieves the requested product data from the server
	 * @param {String} type The type of product to be returned, either "curve", "cube" or "retrofit"
	 * @param {Function} success Called on success, takes 2 params, (data,  textStatus)
	 * @param {Function} success Called on error, takes 4 params, (jqXHR, textStatus, errorThrown)
	 * @param {Boolean} force_refresh Forces the data to be refreshed from the server
	 */
	get_products: function(type, success, error, force_refresh) {
		force_refresh = (typeof force_refresh === "undefined") ? false : force_refresh;
		var field_name = "data";
		if (type) {
			field_name = type + "_data";
		}
		if (app.product_manager[field_name] === null || force_refresh) {
			$.ajax ({
				type: 'GET',
				//url: this.get_api_url(this.api_url),
                url: this.api_url,
				data: {
                    series : type
                },
				dataType: "json",
				success: function(data, textStatus, jqXHR) {
					if (data.error.code != 200) {
						console.log('Unable to recieve product information.');
						return;
					}

					series = [];
					for (var index in data.result) {
						series.push({
                            name: index,
                            data: data.result[index]
                        });
					}
					app.product_manager[field_name] = series;
					app.product_manager.post_process_data();

					if (typeof success !== "undefined") {
						success(series, textStatus);
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

		} else {
			if (typeof success !== "undefined") {
				success(this[field_name], "from_cache");
			}
		}
	},

	/**
	 * This is a helper function that handles proxying of urls if we are developing locally
	 * @param {String} url_to_call The url that data should be retrieved from
	 * @returns {String} the url to retrieve the product data from
	 */
	/*get_api_url: function(url_to_call) {
		if (this.is_local_dev) {
			return this.local_proxy + '?url=' + encodeURIComponent(url_to_call);
		}
		else {
			return url_to_call;
		}
	},*/

	get_light_type_by_id: function(light_id) {
		for (var i in app.product_manager.data) {
			var series = app.product_manager.data[i].data,
			    light = _.find(series, {'id': light_id});

			if (light) {
				return light;
			}
		}
		return null;
	},

	get_product_by_code: function(product_code) {
		return _.find(app.product_manager.products, {'code': product_code});
	},

	/**
	* Returns all products concatenated into a single array,
	* the series code is also added to each product
	* @returns {Array} currently selected product code
	*/
	get_all_products: function() {
		var products = [];
		for (var i in app.product_manager.data) {
			var series = app.product_manager.data[i].data;
			for (var j in series) {
				var light_info = series[j];
				//products = products.concat(light_info.products);
				$.each(light_info.products, function(key, value) {
					//we need to add the series code to the product info to use later
					//value["series_code"] = light_info.series_code;
					products.push(value);
				});
			}
		}
		return products;
	},

	/**
	* Does some post processing on the returned data,
	* this is needed to add more detailed info to products
	* @returns {Array} post processed API data
	*/
	post_process_data: function() {
		var products = [];
		for (var i in this.data) {
			var series = this.data[i].data;
			for (var j in series) {
				var light_info = series[j];
				$.each(light_info.products, function(key, product) {
					//we need to add this data to the product info to use later for mixins etc
					product.product_id = product.id;
					delete product.id;

					product.series = {
                        value: light_info.series,
                        code: light_info.series_code
                    };
					product.family = light_info.family;
					product.model = {
                        name: light_info.name,
                        code: light_info.code
                    };
					product.fascia_color = _.find(light_info.fascia_color, {
                        'code': product.fascia_color
                    });
					product.beam_angle = _.find(light_info.beam_angle, {
                        'code': product.beam_angle
                    });
					product.color_temperature = _.find(light_info.color_temperature, {
                        'code': product.color_temperature
                    });
					product.light_type = _.find(light_info.light_type, {
                        'code': product.light_type
                    });
					product.is_wall_light = light_info.is_wall_light;

					products.push(product);
				});
			}
		}
		this.products = products;
	}
};