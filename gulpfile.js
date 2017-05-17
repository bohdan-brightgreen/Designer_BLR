var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix
        //.sass('app.scss')
        .styles([
            'vendors/custom-theme/jquery-ui-1.8.16.custom.css',
            'vendors/cropper.css',
            'vendors/jquery.maxlength.css',
            'vendors/bootstrap.css'
        ], 'public/css/vendors.css')
        .less('app.less')
        .less('error.less')
        //.copy('resources/assets/fonts', 'public/fonts')
        //.copy('resources/assets/img', 'public/img')
        //.copy('resources/assets/js/jquery.js', 'public/js/jquery.js')
        //.copy('resources/assets/js/app/sample.lights.json', 'public/js/sample.lights.json')
        //.scriptsIn('resources/assets/js/vendors', 'public/js/vendors.js')
        .scripts([
            //'vendors/jquery-ui-1.8.21.custom.min.js',
            'vendors/jquery-ui-1.9.2.custom.min.js',
            'vendors/jquery.ui.touch-punch.min.js',
            'vendors/jquery.class.js',
            'vendors/paper.brightgreen.js',
            'vendors/cropper.min.js',
            'vendors/jquery.maxlength.min.js',
            'vendors/jquery.mousewheel.js',
            'vendors/lodash.min.js',
            'vendors/bootstrap.tooltip.min.js',
            'vendors/handlebars.js'
        ], 'public/js/vendors.js')
        .scripts([
            'app/helpers.js',
            'app/app.js',

            // UI
            'app/ui/app.ui.js',
            'app/ui/app.ui.menu_bar.js',
            'app/ui/app.ui.open_project.js',
            'app/ui/app.ui.new_project.js',
            'app/ui/app.ui.add_design.js',
            'app/ui/app.ui.add_area.js',
            'app/ui/app.ui.image_crop.js',
            'app/ui/app.ui.create_panel.js',
            'app/ui/app.ui.create_panel_rooms.js',
            'app/ui/app.ui.create_panel_furniture.js',
            'app/ui/app.ui.create_panel_lights.js',
            'app/ui/app.ui.details_panel.js',
            'app/ui/app.ui.details_panel_project.js',
            'app/ui/app.ui.details_panel_rooms.js',
            'app/ui/app.ui.details_panel_lights.js',
            'app/ui/app.ui.room_controls.js',
            'app/ui/app.ui.light_controls.js',
            'app/ui/app.ui.asset_controls.js',
            'app/ui/app.ui.getting_started.js',
            //'app/ui/app.ui.log_in.js',
            'app/ui/app.ui.designer_overlay.js',
            'app/ui/app.ui.floorplan_upload.js',
            'app/ui/app.ui.export_dialog.js',
            'app/ui/app.ui.share_dialog.js',
            'app/ui/app.ui.help.js',
            'app/ui/app.ui.message.js',

            // Other
            'app/designer.js',
            'app/product.manager.js',
            'app/project.manager.js',
            'app/base.asset.js',
            'app/asset.js',
            'app/resizable.asset.js',
            'app/restructurable.asset.js',
            'app/asset.types.js',
            'app/door.js',
            'app/light.js',
            'app/light.manager.js',
            'app/light.group.js',
            'app/light.switch.js',
            'app/light.colours.js',
            //'app/solar.js',
            //'app/solar.group.js',
            //'app/solar.panel.js',
            'app/room.js',
            'app/room.types.js',
            'app/snap.manager.js',
            'app/circuit.js',
            'app/distance.line.js',
            'app/tools/tool.room-draw.js',
            'app/tools/tool.light-draw-point.js',
            'app/tools/tool.light-draw-grid.js',
            'app/tools/tool.light-draw-string.js',
            'app/tools/tool.light-connect.js',
            'app/tools/tool.light-disconnect.js',
            'app/tools/tool.pan.js',
            'app/tools/tool.asset-rotate.js',
            'app/tools/tool.asset-erase.js',
            'app/sample.js',
            'app/designer.data_manager.js',
            'app/health.check.js'
        ], 'public/js/app.js')
        .version(['css/vendors.css', 'css/app.css', 'css/error.css', 'js/vendors.js', 'js/app.js']);
});

