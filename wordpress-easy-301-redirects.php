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

class Easy301RedirectsPlugin {

    public function __construct()
    {
        add_action('init', array($this,'redirect'), 1);
        add_action('admin_enqueue_scripts', [ $this, 'loadReactRedirectManager' ]);
        add_action( 'admin_menu', [ $this, 'initAdminSettings' ] );
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
     * getRedirects function
     * return the current list of redirects as json
     * 
     * @param string $keyword
     * @return string json
     */
    public function getRedirects(string $keyword = null) : string
    {
        return '';
    }

    /**
     * saveRedirects function
     * save the redirects from the options page to the database
     * 
     * @param json $data
     * @return void
     */
    public function saveRedirects($data) : void
    {
        return;
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
}

$easy301RedirectsP = new Easy301RedirectsPlugin();