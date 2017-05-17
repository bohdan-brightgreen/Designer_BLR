

<?php $__env->startSection('content'); ?>
    <h3>404 Not Found</h3>
    <p>Page is not exists.</p>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('error', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>