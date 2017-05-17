<div id="lighting_details_panel" class='details_panel' style="display:none">
	<div id="light_summary_list"></div>

	<div class="collapsible expanded">
		<a href="javascript:void(0);" class="collapsible_header">Light Indicator</a>
		<div id="light_indicator_list" class="collapsible_content small_pad"></div>
	</div>
	<div class="light_indicator_holder">
		<div class="light_indicator no_lights">
			No Lights
		</div>
		<div class="light_indicator too_dim">
			Too Dim
		</div>
		<div class="light_indicator about_right">
			About Right
		</div>
		<div class="light_indicator too_bright">
			Too Bright
		</div>
		<div class="light_indicator_disclaimer">
			Disclaimer: This is an approximate calculation.
		</div>
	</div>
</div>

<script id="light_summary_list_template" type="text/template">
	{{#if .}}
	<div class="collapsible expanded">
		<a href="javascript:void(0);" class="collapsible_header">Product List</a>
		<div class="collapsible_content small_pad">
			{{#.}}
				<div class="line_field">
                    <i class="colour" style="background: {{colour}}"></i>
					<label class="field_label" for="project_type">{{code}}</label>
					<div class="field_value">{{count}}</div>
				</div>
			{{/.}}
		</div>
	</div>
	{{/if}}
</script>
<script id="light_indicator_list_template" type="text/template">
	{{#.}}
		<div class='line_field'>
			<label class="field_label" for="project_type">{{name}}</label>
			<div class="field_value">{{value}}</div>
		</div>
	{{/.}}
</script>