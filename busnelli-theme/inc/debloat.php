<?php
/**
 * Remove unnecessary stuff and add various optimizations
 *
 * @package Websolute_Starter_Theme
 */

/**
 * Disable various unnecessay theme features.
 */
function websolute_disable_features()
{
	// Remvoe feed links
	remove_action('wp_head', 'feed_links_extra', 3);
	remove_action('wp_head', 'feed_links', 2);
	// Remove RDS link
	remove_action('wp_head', 'rsd_link') ;
	// Disable XML-RPC
	add_filter('xmlrpc_enabled', '__return_false');
	// Hide WP version
	remove_action('wp_head', 'wp_generator');
	// Remove WLManifest link
	remove_action('wp_head', 'wlwmanifest_link') ;
	// Disable Emojis
	remove_action('wp_head', 'print_emoji_detection_script', 7);
	remove_action('admin_print_scripts', 'print_emoji_detection_script');
	remove_action('wp_print_styles', 'print_emoji_styles');
	remove_action('admin_print_styles', 'print_emoji_styles');
	remove_filter('the_content_feed', 'wp_staticize_emoji');
	remove_filter('comment_text_rss', 'wp_staticize_emoji');
	remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
	add_filter('tiny_mce_plugins', 'websolute_disable_emojis_tinymce');
	add_filter('wp_resource_hints', 'websolute_disable_emojis_remove_dns_prefetch', 10, 2);
}
add_action('init', 'websolute_disable_features');



/**
 * Remove unnecessary scripts and styles
 */
function websolute_remove_scripts()
{
	// Remove unnecessary scripts & styles
	wp_dequeue_style('wp-block-library');
	wp_dequeue_style('wp-block-library-theme');
	wp_dequeue_style('wc-blocks-style');
	wp_dequeue_style('global-styles');

	// jQuery is already in main.js
    wp_dequeue_script( 'jquery');
    wp_deregister_script( 'jquery');
}
add_action('wp_enqueue_scripts', 'websolute_remove_scripts');



/**
 * Remove jQuery Migrate.
 */
function websolute_remove_jquery_migrate($scripts)
{
	if (! is_admin() && isset($scripts->registered['jquery'])) {
		$script = $scripts->registered['jquery'];
		if ($script->deps) {
			$script->deps = array_diff($script->deps, [ 'jquery-migrate' ]);
		}
	}
}
add_action('wp_default_scripts', 'websolute_remove_jquery_migrate');


/**
 * Remove the srcset attribute from post thumbnails
 * It messes up with proper image sizes in the layout in certain situations
 * Each image field has a "recommended size" label
 *
 * @param array $ources One or more arrays of source data to include in the 'srcset'.
 * @return boolean
 */
function websolute_disable_srcset( $sources ) {
    return false;
}
add_filter( 'wp_calculate_image_srcset', 'websolute_disable_srcset' );



/**
 * ************************ *
 *          HELPERS         *
 * ************************ *
 */


/**
 * Filter function used to remove the tinymce emoji plugin.
 *
 * @param array $plugins
 * @return array Difference betwen the two arrays
 */
function websolute_disable_emojis_tinymce($plugins)
{
	if (is_array($plugins)) {
		return array_diff($plugins, [ 'wpemoji' ]);
	} else {
		return [];
	}
}


/**
* Remove emoji CDN hostname from DNS prefetching hints.
*
* @param array $urls URLs to print for resource hints.
* @param string $relation_type The relation type the URLs are printed for.
* @return array Difference betwen the two arrays.
*/
function websolute_disable_emojis_remove_dns_prefetch($urls, $relation_type)
{
	if ('dns-prefetch' == $relation_type) {
		/** This filter is documented in wp-includes/formatting.php */
		$emoji_svg_url = apply_filters('emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/');
		$urls = array_diff($urls, [ $emoji_svg_url ]);
	}
	return $urls;
}
