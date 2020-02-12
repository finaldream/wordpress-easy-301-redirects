<?php
/*
Plugin Name: Wordpress Easy 301 Redirects
Plugin URI: https://github.com/finaldream/wordpress-easy-301-redirects
Description: Create a list of URLs that you would like to 301 redirect to another page or site. Wildcard support is always enabled.
Version: 1.0.2
Author: Finaldream.de
Author URI: https://www.finaldream.de
*/

namespace WordpressEasy301Redirects;

require_once(__DIR__.'/Easy301Redirection.php');
use WordpressEasy301Redirects\Easy301Redirection;
use DateTime;


class Easy301RedirectsPlugin {

    public function __construct()
    {
        add_action('init', array($this,'redirect'), 1);
        add_action('admin_menu', [ $this, 'initAdminSettings' ] );
        add_action('wp_ajax_saveRedirects', [$this,'saveRedirects'] );
    }

    public function initAdminSettings() {
        $settingsPage = add_options_page('Easy 301 Redirects', 'Easy 301 Redirects', 'manage_options', 'easy301options', [$this,'displaySettingsPage']);

        add_action('admin_enqueue_scripts', function ($hook) use ($settingsPage){
            if($hook !== $settingsPage){
                return;
            }
            $this->loadReactRedirectManager();
        });
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
        if (empty($redirects)) {
            $redirects = $this->importFromSimple301();
        }
        return json_encode(['redirects' => $redirects]);
    }

    /**
     * redirect
     * 
     * Read the list of redirects and if the current page 
     * is found in the list, send the visitor on her way
     * 
     * @return void
     */
    public function redirect()
    {
        $userrequest = str_ireplace(get_option('home'),'',$this->getAddress());
        $userrequest = rtrim($userrequest,'/');
        $redirects = $this->getRedirects();
        if (!empty($redirects)) { 
            $do_redirect = '';
            foreach ($redirects as $easyRedirection) {
                $storedrequest = $easyRedirection->getRequest();
                $destination = $easyRedirection->getDestination();
                if (strpos($storedrequest,'*') !== false) {
                    if ( strpos($userrequest, '/wp-login') !== 0 && strpos($userrequest, '/wp-admin') !== 0 ) {
                        $storedrequest = str_replace('*','(.*)',$storedrequest);
                        $pattern = '/^' . str_replace( '/', '\/', rtrim( $storedrequest, '/' ) ) . '/';
                        $destination = str_replace('*','$1',$destination);
                        $output = preg_replace($pattern, $destination, $userrequest);
                        if ($output !== $userrequest) {
                            $do_redirect = $output;
                        }
                    }
                }
                elseif(urldecode($userrequest) == rtrim($storedrequest,'/')) {
                    $do_redirect = $destination;
                }
                
                if ($do_redirect !== '' && trim($do_redirect,'/') !== trim($userrequest,'/')) {
                    if (strpos($do_redirect,'/') === 0){
                        $do_redirect = home_url().$do_redirect;
                    }
                    header ('HTTP/1.1 301 Moved Permanently');
                    header ('Location: ' . $do_redirect);
                    exit();
                }
                else { unset($redirects); }
              
            }
        }
    }

    /**
     * saveRedirects
     * 
     * Save the redirects received in the ajax endpoint to the database
     * 
     * @return void
     */
    public function saveRedirects()
    {
        if ( !current_user_can('manage_options') )  { wp_send_json_error( 'You do not have sufficient permissions to access this page.', 403 ); }

        $input = json_decode(file_get_contents('php://input'));
        $data = $input->redirects;
        $redirects = $this->getRedirects();
        $result = [];
        $added = 0;
        $modified = 0;
        try {
            $deleted = sizeof(array_udiff($redirects, $data, function($a, $b){ return strcmp($a->id, $b->id); } ));
            $transcationTime = new DateTime();
            foreach ($data as $redirection) {
                $found = array_filter($redirects, function($el) use ($redirection) { return $el->id === $redirection->id;} );
                if($found) {
                    $current = array_pop($found);
                    $updatedRequest = $current->setRequest($redirection->request);
                    $updatedDestination = $current->setDestination($redirection->destination);
                    if ($updatedRequest || $updatedDestination) $modified++;
                    $result[] = json_encode($current);
                } else {
                    if ($redirection->request && $redirection->destination && $redirection->id) {
                        $new = new Easy301Redirection($redirection->request, $redirection->destination, $redirection->id, sizeof($result), $transcationTime );
                        $result[] = json_encode($new);
                        $added++;
                    }
                }
            }
            update_option('easy_301_redirects', $result);

            // Backup and delete SimpleRedirects options on first save
            if (get_option('301_redirects')) {
                update_option('301_redirects_backup', get_option('301_redirects'));
                update_option('301_redirects_wildcard_backup', get_option('301_redirects_wildcard'));
                delete_option('301_redirects');
                delete_option('301_redirects_wildcard');
            }

        } catch (\Throwable $th) {
            wp_send_json_error( $th->getMessage(), 500 );
        }

        wp_send_json_success([
            'redirects_added' => $added,
            'redirects_modified' => $modified,
            'redirects_deleted' => $deleted,
            'redirects' => $this->getRedirects()
            ]);
    }

    /**
     * getAddress
     * 
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
     * getProtocol
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
     * getRedirects
     * 
     * return the current array of redirects
     * 
     * @return array
     */
    private function getRedirects() : array
    {
        $result = [];
        $redirects = get_option('easy_301_redirects');
        if (!empty($redirects)) {
            foreach ($redirects as $key => $redirection) {
                $result[$key] = (new Easy301Redirection())->jsonDecode($redirection);
            }
        }
        return $result;
    }

    /**
     * importFromSimple301
     * 
     * Check if previous SimpleRedirects option exists and load it
     * Transform them into Easy301Redirection objects and returns a normalized array 
     * containing only Easy301Redirection objects
     *
     * @return array
     */
    private function importFromSimple301() : array
    {
        $result = [];
        $redirects = get_option('301_redirects');
        if (!empty($redirects)) {
            $i = 0;
            foreach ($redirects as $request => $destination) {
                $redirection = new Easy301Redirection($request, $destination, '', $i);
                $result[] = $redirection;
                $i++;
            }
        }
        return $result;
    }
}

$easy301RedirectsP = new Easy301RedirectsPlugin();
