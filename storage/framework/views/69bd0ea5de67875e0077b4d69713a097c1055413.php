<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Lightplan by Brightgreen</title>

    <link href="favicon.ico" rel="shortcut icon">

    <link href="<?php echo e(elixir('css/vendors.css')); ?>" rel="stylesheet">
    <link href="<?php echo e(elixir('css/app.css')); ?>" rel="stylesheet">

    <!-- Scripts -->
    <!--script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script-->
    <!--script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script-->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" type="text/javascript"></script>

    <script src="<?php echo e(elixir('js/vendors.js')); ?>"></script>
    <script type="text/javascript">
        var user = <?php echo isset($user) ? $user : ''; ?>;
        paper.install(window);
    </script>
    <script src="<?php echo e(elixir('js/app.js')); ?>"></script>
    <script type="text/javascript">
        $(function() {
            app.init();
        });
    </script>
</head>
<body>
    <div id='lighting_designer'>
        <?php echo $__env->make('includes.header', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>

        <div id='tooltip' style='display:none' class='ui-state-highlight ui-corner-all'>
            <span id="tooltip_text"></span>
            <a href="javascript:void(0);" onclick="app.hide_tooltip();" class="ui-dialog-titlebar-close ui-corner-all" style="float: right" role="button"><span class="ui-icon ui-icon-closethick">close</span></a>
            <a href='javascript:void(0);' id='tooltip_disable' onclick="app.disable_tooltips();">turn off</a>
        </div>

        <?php echo $__env->make('includes.ui.create_panel', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>

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
    <?php echo $__env->make('includes.ui.open_project', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php echo $__env->make('includes.ui.new_project', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php echo $__env->make('includes.ui.add_design', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php echo $__env->make('includes.ui.add_area', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php echo $__env->make('includes.ui.image_crop', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php echo $__env->make('includes.ui.details_panel', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php echo $__env->make('includes.ui.room_controls', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php echo $__env->make('includes.ui.light_controls', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php echo $__env->make('includes.ui.asset_controls', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php echo $__env->make('includes.ui.getting_started', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php /* ?>@include('includes.ui.log_in')<?php */ ?>
    <?php echo $__env->make('includes.ui.floorplan_upload', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php echo $__env->make('includes.ui.export_dialog', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php echo $__env->make('includes.ui.share_dialog', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php echo $__env->make('includes.ui.help', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <?php echo $__env->make('includes.healthcheck', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>

    <!-- preload icons -->
    <?php echo $__env->make('includes.icons', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>

    <!-- this is for the PDF download as we can't do it from AJAX -->
    <iframe name="pdf_download" style="display:none;"></iframe>
    <form method="POST" action="/pdf" id="pdf_form" target="pdf_download">
        <input type="hidden" name="data" id="pdf_data" />
        <input type="hidden" name="pdf_token_cookie" id="pdf_token_cookie" />
        <input type="hidden" name="_token" value="<?php echo e(csrf_token()); ?>">
    </form>

    <div id="message">
        <h3></h3>
        <div class="text selectable_text"></div>
        <a href="javascript:void(0);" class="dismiss">Dismiss</a>
    </div>
</body>
</html>