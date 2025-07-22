<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package Websolute_Starter_Theme
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function websolute_starter_theme_body_classes( $classes ) {
	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	return $classes;
}
add_filter( 'body_class', 'websolute_starter_theme_body_classes' );

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function websolute_starter_theme_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}
add_action( 'wp_head', 'websolute_starter_theme_pingback_header' );


/**
 * Fix titles
 *
 * @param string $title
 * @return string
 */
function websolute_fix_titles ($title) {
    if (is_category()) {
        $title = single_cat_title('', false);
    } elseif (is_tag()) {
        $title = single_tag_title('', false);
    } elseif (is_author()) {
        $title = '<span class="vcard">' . get_the_author() . '</span>';
    } elseif (is_tax()) { //for custom post types
        $title = sprintf(__('%1$s'), single_term_title('', false));
    } elseif (is_post_type_archive()) {
        $title = post_type_archive_title('', false);
    }
    return $title;
}
add_filter('get_the_archive_title', 'websolute_fix_titles');


/**
 * Use the attachment title as alt attribute
 *
 * @param array $attr The attributes
 * @param WP_Post $attachment The attachment object
 * @return array
 */
function websolute_img_alt( $attr, $attachment = null ) {

	$img_title = trim( strip_tags( $attachment->post_title ) );

	$attr['alt'] = $img_title;

	return $attr;
}
add_filter( 'wp_get_attachment_image_attributes','websolute_img_alt', 10, 2);

/**
 * Use coming soon template if user is not logged in and the coming soon option is enabled
 *
 * @param string $template Template file name
 * @return string
 */
function websolute_coming_soon( $template ) {
	if (!is_user_logged_in() && get_field('coming_soon', 'option') ) {
    	return locate_template( array( 'coming-soon.php' ) );
	} else {
		return $template;
	}
}
add_filter( 'template_include', 'websolute_coming_soon', 99 );
