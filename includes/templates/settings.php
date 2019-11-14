<?php
/**
 * Wordpress Easy 301 Settings Page
 */

?>

<div class="wrap wordpress-easy-301-redirects">
    <h1>Wordpress Easy 301 Redirects Settings</h1>
    <hr class="wp-header-end">
    <div id="redirects_manager">
        <script type="application/json" data-name="initial-state">
        <?= $this->getRedirectsJson() ?>
        </script> 
    </div>
</div>