<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Lightplan by Brightgreen</title>

    <link href="favicon.ico" rel="shortcut icon">

    <link href="{{ elixir('css/vendors.css') }}" rel="stylesheet">
    <link href="{{ elixir('css/app.css') }}" rel="stylesheet">

    <!-- Scripts -->
    <!--script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script-->
    <!--script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script-->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" type="text/javascript"></script>

    <script src="{{ elixir('js/vendors.js') }}"></script>
    <script type="text/javascript">
        var user = {!! $user or '' !!};
        paper.install(window);
    </script>
    <script src="{{ elixir('js/app.js') }}"></script>
    <script type="text/javascript">
        $(function() {
            app.init();
        });
    </script>
</head>
<body>
    <div id='lighting_designer'>
        @include('includes.header')

        <div id='tooltip' style='display:none' class='ui-state-highlight ui-corner-all'>
            <span id="tooltip_text"></span>
            <a href="javascript:void(0);" onclick="app.hide_tooltip();" class="ui-dialog-titlebar-close ui-corner-all" style="float: right" role="button"><span class="ui-icon ui-icon-closethick">close</span></a>
            <a href='javascript:void(0);' id='tooltip_disable' onclick="app.disable_tooltips();">turn off</a>
        </div>

        @include('includes.ui.create_panel')

        <!-- designer -->
        <div id="designer_container">
            <div id="loading-screen">
                <div id="loading-screen-message">
                    <div id="loading-screen-text">Please wait...</div>
                    <img id="loading-screen-spinner" src="img/loading-white.gif" />
                    <div id="loading-screen-progress"></div>
                </div>
            </div>
            <div id="error-screen">
                <div id="error-screen-message">
                    <div id="error-screen-text">An error occurred</div>
                    <div id="error-screen-detail">An error occurred</div>
                </div>
            </div>
        </div>
    </div>

    <!-- dialogs -->
    <?php /* ?>@include('includes.dialogs')<?php */ ?>
    @include('includes.ui.open_project')
    @include('includes.ui.new_project')
    @include('includes.ui.add_design')
    @include('includes.ui.add_area')
    @include('includes.ui.image_crop')
    @include('includes.ui.details_panel')
    @include('includes.ui.room_controls')
    @include('includes.ui.light_controls')
    @include('includes.ui.asset_controls')
    @include('includes.ui.getting_started')
    <?php /* ?>@include('includes.ui.log_in')<?php */ ?>
    @include('includes.ui.floorplan_upload')
    @include('includes.ui.export_dialog')
    @include('includes.ui.share_dialog')
    @include('includes.ui.help')
    @include('includes.healthcheck')

    <!-- preload icons -->
    @include('includes.icons')

    <!-- this is for the PDF download as we can't do it from AJAX -->
    <iframe name="pdf_download" style="display:none;"></iframe>
    <form method="POST" action="/pdf" id="pdf_form" target="pdf_download">
        <input type="hidden" name="data" id="pdf_data" />
        <input type="hidden" name="pdf_token_cookie" id="pdf_token_cookie" />
        <input type="hidden" name="_token" value="{{ csrf_token() }}">
    </form>

    <div id="message">
        <h3></h3>
        <div class="text selectable_text"></div>
        <a href="javascript:void(0);" class="dismiss">Dismiss</a>
    </div>
</body>
</html>