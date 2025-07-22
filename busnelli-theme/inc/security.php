<?php
/**
 * Security improvements
 *
 * @package Websolute_Starter_Theme
 */

// Disable XML-RPC
add_filter( 'xmlrpc_enabled', '__return_false' );

/**
* Remove /wp/v2/users REST API endpoint to prevent user enumeration via API.
*
* @param array $endpoints the existing registered endpoints.
* @return array
*/
add_filter( 'rest_endpoints', 'websolute_remove_users_rest_endpoint' );
function websolute_remove_users_rest_endpoint( $endpoints ) {
	if( isset( $endpoints['/wp/v2/users'] ) ) {
		unset( $endpoints['/wp/v2/users'] );
	}
	return $endpoints;
}

/**
 * Sanitize the value of certain ACF fields
 *
 * @see https://www.advancedcustomfields.com/resources/html-escaping/
 * @see https://developer.wordpress.org/reference/functions/wp_kses_post/
 * @see https://developer.wordpress.org/reference/functions/wp_kses_allowed_html/#comment-3860
 *
 * @param mixed $value The field value
 * @param int|string $post_id The post ID
 * @param array $field The field array containing all settings
 * @return void
 */
function websolute_acf_sanitize( $value, $post_id, $field ) {
	// Textarea and wysiwyg fields can contain all tags normally allowed in post content
	// `acf_esc_html` emulates wp_kses_post() with a context of "acf" for extensibility.
	if ( $field['type'] == 'text' || $field['type'] == 'textarea' || $field['type'] == 'wysiwyg' ) {
		return acf_esc_html($value);
	}

	// For all other cases, return the value as it is
	return $value;

}
add_filter('acf/format_value', 'websolute_acf_sanitize', 10, 3);

/**
 * Allow iframes and other tags in sanitized ACF fields
 *
 * @param array $tags Allowed tags
 * @param string $context
 * @return array The updated tags array
 */
function websolute_acf_add_allowed_iframe_tag( $tags, $context ) {
    if ( $context === 'acf' ) {
        $tags['iframe'] = array(
            'src'               => true,
            'type'              => true,
            'height'            => true,
            'width'             => true,
            'frameborder'       => true,
            'allowfullscreen'   => true,
            'allowTransparency' => true,
			'style'             => true,
        );
    }

    return $tags;
}
add_filter( 'wp_kses_allowed_html', 'websolute_acf_add_allowed_iframe_tag', 10, 2 );
