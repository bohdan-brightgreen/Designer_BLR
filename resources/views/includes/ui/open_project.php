<div id='open_project_dialog' class='dialog' style="display:none;">
	<div id="project_list" style="display:none">

	</div>
	<div id="project_list_loading">
		<img src="img/loading.gif" />
		<div>Loading Projects...</div>
	</div>
</div>

<!--handlebars templates-->
<script id="project_list_template" type="text/template">
	{{#if .}}
		<div class="project_list_header">
			<div>
				Project name
			</div>
			<div>
				Details
			</div>
		</div>
		{{#.}}
			<div class="project_row" id="project_info_{{id}}">
				<div class="project_info">
					<div class="project_name" data-project-id="{{id}}">{{title}}</div>
                    <div>
                        <a href="javascript:void(0)" class="delete_project" data-project-id="{{id}}" title="Delete Project"><img src="img/icons/delete.png" alt="Delete Project" />Delete</a>
                    </div>
				</div>
				<div class="project_details">
                    <div>Designer: {{owner_name}}</div>
                    <div>Client: {{client_name}}</div>
                    <div>Date: {{date}}</div>
				</div>
			</div>
		{{/.}}
	{{else}}
		<div id="no_projects_message">
			You do not have any saved projects yet.
			<div>
				<button onclick='app.ui.open_project.hide()' rel="tooltip" title="Get Started" data-placement="right">Get Started</button>
			</div>
		</div>
	{{/if}}

</script>