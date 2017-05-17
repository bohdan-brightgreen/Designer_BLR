<!-- project details dialog -->
<div id="project_details_panel" class='details_panel' style="display:none">
	<div class="collapsible expanded">
		<a href="javascript:void(0);" class="collapsible_header no_border">Options</a>
		<div class="collapsible_content small_pad">
			<div class='line_field'>
				<label class="field_label" for="project_name">Project Name</label>
				<div class="field_value">
					<input type="text" id="project_name" />
				</div>
			</div>

			<div class='line_field'>
				<label class="field_label" for="project_type">Project Type</label>
				<div class="field_value">
					<select id="project_type">
						<option>Residential</option>
						<option>Commercial</option>
					</select>
				</div>
			</div>
			<div class='line_field'>
				<label class="field_label" for="area_name">Space Name</label>
				<div class="field_value">
					<input class="field_value" type="text" id="area_name" required maxlength="40"  placeholder="Space name"/>
				</div>
			</div>
		</div>
	</div>
</div>