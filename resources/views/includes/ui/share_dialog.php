<div id="share_dialog" class="share_dialog dialog" style="display:none">
    <div class="list">
        <div id="shared_projects_list"></div>
    </div>

    <div class="add-share">
        <div class="project-row" id="shared_projects_add"></div>
    </div>

    <div class="loading">
        <img src="img/loading.gif" />
        <div>Loading...</div>
    </div>
</div>

<!--handlebars templates-->
<script id="shared_projects_template" type="text/template">
    {{#if .}}
        {{#.}}
        <div class="project-row">
            <div class="title">{{title}}</div>

            {{#if access}}
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th width="70" class="center">Can edit?</th>
                        <th width="40" class="center"></th>
                    </tr>
                </thead>
                <tbody>
                    {{#access}}
                    <tr id="share-row-{{../id}}-{{user.id}}">
                        <td>{{user.email}}</td>
                        <td class="center">
                            <div class="switch">
                                <input id="share-{{../id}}-{{user.id}}" name="share-edit" class="toggle share-edit-toggle" type="checkbox"
                                       data-project-id="{{../id}}" data-user-id="{{user.id}}" {{#if is_editable}}checked{{/if}}>
                                <label for="share-{{../id}}-{{user.id}}"></label>
                            </div>
                        </td>
                        <td class="center">
                            <a href="javascript:void(0)" class="delete_share" data-project-id="{{../id}}" data-user-id="{{user.id}}" title="Delete access to project">
                                <img src="img/icons/delete.png" alt="Delete access to project" />
                            </a>
                        </td>
                    </tr>
                    {{/access}}
                </tbody>
            </table>
            {{/if}}

        </div>
        {{/.}}
    {{else}}
        <div class="no_shared_projects_message">
            You do not have any shared projects yet.
        </div>
    {{/if}}
</script>

<script id="shared_projects_add_template" type="text/template">
    {{#if .}}
        <div class="field">
            <label>Project:</label>
            <select name="share-project" id="share-project-name">
            {{#.}}
                <option value="{{id}}">{{title}}</option>
            {{/.}}
            </select>
        </div>

        <div class="field">
            <label>Email:</label>
            <input name="share-email" id="share-email" class="share-email" type="email" placeholder="Email">
        </div>

        <div class="field">
            <label>Can edit?</label>
            <div class="switch">
                <input id="share-add" name="share-add" class="toggle" type="checkbox">
                <label for="share-add"></label>
            </div>
        </div>

        <div class="buttons">
            <div class="back">Back</div>
            <div class="add">Add</div>
        </div>

    {{else}}
        <div class="no_shared_projects_message">
            You do not have any projects yet to share.
        </div>
    {{/if}}
</script>