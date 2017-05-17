<div id="lights_container">
	<div id="series_list">

	</div>
	<div id="light_list">

	</div>
	<div id="light_options">

	</div>
</div>

<!--handlebars templates-->
<script id="series_list_template" type="text/template">
	<ul class="series_btn_list">
		{{#.}}
			<li type="button" data-name="{{name}}" class="series_btn">{{name}}</li>			
		{{/.}}
	</ul>
</script>

<script id="light_list_template" type="text/template">
	<ul>
		{{#.}}
			<li data-code="{{code}}" id="light_btn_{{id}}" data-id="{{id}}" data-series="{{series}}" class="drag_asset light_type_btn">				
				<div class="img">
					<img src="img/assets/lights/{{#tolower}}{{code}}{{series_code}}{{/tolower}}.png" />
				</div>
				<div class="txt">{{name}}</div>
			</li>
		{{/.}}
	</ul>
</script>

<script id="light_options_template" type="text/template">
	<select id="beam_angle" class="light_option_select product_code_field">
		{{#beam_angle}}
			<option value="{{code}}">
				{{value}}
			</option>
		{{/beam_angle}}
	</select>

	<select id="colour_temp" class="light_option_select product_code_field">
		{{#color_temperature}}
			<option value="{{code}}">
				{{value}}
			</option>
		{{/color_temperature}}
	</select>

	<select id="fascia_colour" class="light_option_select product_code_field">
		{{#fascia_color}}
			<option value="{{code}}">
				{{value}}
			</option>
		{{/fascia_color}}
	</select>
	<div id="product_code"></div>
</script>

<script id="product_code_template" type="text/template">
	{{code}}-{{series_code}}-{{colour_temp}}-{{beam_angle}}-{{fascia_colour}}
</script>