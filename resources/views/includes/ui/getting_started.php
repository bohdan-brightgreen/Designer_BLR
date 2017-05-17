<!-- getting started dialog -->
<div id="getting_started_dialog" class='getting_started_dialog dialog_pad' style="display:none">
	<div class='get_started_options'>
		<div class="get_started_option">
			<div class="get_started_option_heading">
				Start from scratch
			</div>
			<div class="get_started_option_text">
				Begin a new project by 
				uploading a new floor 
				plan.
			</div>
			<div class="get_started_option_button">
				<button onclick='app.ui.new_project.show(true, true)'>Start New</button>
			</div>
		</div>
		<div class="get_started_option">
			<div class="get_started_option_heading">
				Load project
			</div>
			<div class="get_started_option_text">
				Load a saved project to 
				continue designing your 
				lighting solution or to edit 
				an existing design.
			</div>
			<div class="get_started_option_button">
				<button onclick='app.ui.open_project.show()'>Load</button>
			</div>
		</div>
		<div class="get_started_option">
			<div class="get_started_option_heading">
				Load sample project
			</div>
			<div class="get_started_option_text">
				Take a look at a sample 
				project to see what can be 
				achieved using LightPlan.
			</div>
			<div class="get_started_option_button">
				<button onclick='app.project_manager.get_projects_sample()'>View Sample</button>
			</div>
		</div>
	</div>
</div>
