<?php
/*
Plugin Name: Wordpress Easy 301 Redirects
Plugin URI: https://github.com/finaldream/wordpress-easy-301-redirects
Description: Create a list of URLs that you would like to 301 redirect to another page or site. Now with wildcard support.
Version: 1.0.0
Author: Finaldream.de
Author URI: https://www.finaldream.de
*/

namespace WordpressEasy301Redirects;

require_once(__DIR__.'/Easy301Redirection.php');
use WordpressEasy301Redirects\EasyRedirection;


class Easy301RedirectsPlugin {

    public function __construct()
    {
        add_action('init', array($this,'redirect'), 1);
        add_action('admin_enqueue_scripts', [ $this, 'loadReactRedirectManager' ]);
        add_action('admin_menu', [ $this, 'initAdminSettings' ] );
        add_action('wp_ajax_saveRedirects', [$this,'saveRedirects'] );
    }

    public function initAdminSettings() {
        add_options_page('Easy 301 Redirects', 'Easy 301 Redirects', 'manage_options', 'easy301options', [$this,'displaySettingsPage']);
    }

    public function loadReactRedirectManager() {
        wp_enqueue_script('reactRedirectManager', plugin_dir_url( __FILE__ ) . 'includes/js/main.js', [], false, true );
    }

    public function displaySettingsPage() {
        include_once __DIR__ .'/includes/templates/settings.php';
    }

    public function getRedirectsJson() : string
    {
        $redirects = $this->getRedirects();
        return json_encode($redirects);
    }

    /**
     * redirect function
     * Read the list of redirects and if the current page 
     * is found in the list, send the visitor on her way
     * 
     * @return void
     */
    public function redirect() {
        return;
    }

    /**
     * saveRedirects function
     * save the redirects from the options page to the database
     * 
     * @return void
     */
    public function saveRedirects()
    {
        if ( !current_user_can('manage_options') )  { wp_send_json_error( 'You do not have sufficient permissions to access this page.', 403 ); }

        $data = json_decode(file_get_contents('php://input'));
        $redirects = $this->getRedirects();
        $result = [];
        $added = 0;
        $modified = 0;
        try {
            $deleted = sizeof(array_udiff($redirects, $data, function($a, $b){ return strcmp($a->id, $b->id); } ));
            foreach ($data as $redirection) {
                $found = array_filter($redirects, function($el) use ($redirection) { return $el->id === $redirection->id;} );
                if($found) {
                    $current = array_pop($found);
                    $updatedRequest = $current->setRequest($redirection->request);
                    $updatedDestination = $current->setDestination($redirection->destination);
                    if ($updatedRequest || $updatedDestination) $modified++;
                    $result[] = $current;
                } else {
                    if ($redirection->request && $redirection->destination && $redirection->id) {
                        $new = new EasyRedirection($redirection->request, $redirection->destination, $redirection->id, sizeof($result));
                        $result[] = $new;
                        $added++;
                    }
                }
            }
            update_option('easy_301_redirects', $result);
        } catch (\Throwable $th) {
            wp_send_json_error( $th->getMessage(), 500 );
        }

        wp_send_json_success(['redirects_added' => $added, 'redirects_modified' => $modified, 'redirects_deleted' => $deleted, 'store' => $result]);
    }

    /**
     * getAddress function
     * utility function to get the full address of the current request
     * credit: http://www.phpro.org/examples/Get-Full-URL.html
     *
     * @return string
     */
    private function getAddress() : string
    {
        return $this->getProtocol().'://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
    }

     /**
     * getProtocol function
     *
     * @return string
     */
    private function getProtocol() : string
    {
        // Set the base protocol to http
        $protocol = 'http';
        // check for https
        if ( isset( $_SERVER["HTTPS"] ) && strtolower( $_SERVER["HTTPS"] ) == "on" ) {
            $protocol .= "s";
        }
        
        return $protocol;
    } 

    /**
     * getRedirects function
     * return the current array of redirects
     * 
     * @return array
     */
    private function getRedirects() : array
    {
        $redirects = get_option('easy_301_redirects');
        if (empty($redirects)) {
            $redirects = $this->migrateRedirectsFormat();
        }
        return $redirects ?? [];
    }

    /**
     * migrateRedirectsFormat private function
     * Check if previous SimpleRedirects option exists and load it into new option
     * Transform them into Easy301Redirection objects and create the storage
     * returns a normalized array containing only Easy301Redirection objects
     *
     * @return array
     */
    private function migrateRedirectsFormat() : array
    {
        $result = [];
        $redirects = get_option('301_redirects');
        if (!empty($redirects)) {
            foreach ($redirects as $request => $destination) {
                $redirection = new EasyRedirection($request, $destination, '', -1);
                $result[] = $redirection;
            }
        }
        return $result;
    }
}

$easy301RedirectsP = new Easy301RedirectsPlugin();
