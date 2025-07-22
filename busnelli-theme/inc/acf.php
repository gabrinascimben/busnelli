<?php
/**
 * ACF customizations and functions
 *
 * @package Websolute_Starter_Theme
 */

/**
 * Set the save point of ACF JSON files
 *
 * @see https://www.advancedcustomfields.com/resources/local-json/#saving-explained
 *
 * @param string $path Existing path
 * @return string New path
 */
function websolute_acf_json_save_point( $path ) {
	$path = get_stylesheet_directory() . '/acf-json';
	return $path;
}
add_filter('acf/settings/save_json', 'websolute_acf_json_save_point');

/**
 * Set the load points of ACF JSON files
 *
 * @see https://www.advancedcustomfields.com/resources/local-json/#loading-explained
 *
 * @param array $paths Existing paths
 * @return array New paths
 */
function websolute_acf_json_load_point( $paths ) {
	unset($paths[0]);
	$paths[] = get_stylesheet_directory() . '/acf-json';
	return $paths;
}
add_filter('acf/settings/load_json', 'websolute_acf_json_load_point');


/**
 * Add theme options page
 */
if ( function_exists('acf_add_options_page') ) {
    acf_add_options_page(array(
        'page_title' => 'Busnelli General Settings',
        'menu_title' => 'Busnelli Settings',
        'menu_slug' => 'theme-general-settings',
		'position' => 2,
		'icon_url' => 'dashicons-admin-settings',
    ));
}



/**
 *	Add admin columns to display designers in product dashboard
 *
 * @param array $columns Current columns array
 * @return array Updated columns array
 */
function websolute_add_acf_columns ( $columns ) {

	$new_columns = array (
		'designer' => __ ( 'Designer', 'websolute_dev' ),
	);
	$pos = 3;

	return array_slice($columns, 0, $pos) + $new_columns + array_slice($columns, $pos);
}
add_filter ( 'manage_product_posts_columns', 'websolute_add_acf_columns' );



/*
 * Display value in custom colums
 */
function websolute_display_acf_columns ( $column, $post_id ) {
	switch ( $column ) {
	  	case 'designer':
			echo get_post(get_field ( 'designer', $post_id ))->post_title;
			break;
	}
}
add_action ( 'manage_posts_custom_column', 'websolute_display_acf_columns', 10, 2 );


/**
 * Set designer as noindex/nofollow (Yoast Options) when visibility is hidden
 *
 * @param int $post_id The post id that has been saved
 * @return void
 */
function websolute_set_noindex( $post_id ) {
	if (get_post_type($post_id) == 'designer') {
		if (get_field('visibility') === false ) {
			add_action( 'wpseo_saved_postdata', function() use ( $post_id ) {
				update_post_meta( $post_id, '_yoast_wpseo_meta-robots-noindex', '1' );
				update_post_meta( $post_id, '_yoast_wpseo_meta-robots-nofollow', '1' );
			}, 999 );
		} else {
			add_action( 'wpseo_saved_postdata', function() use ( $post_id ) {
				update_post_meta( $post_id, '_yoast_wpseo_meta-robots-noindex', '0' );
				update_post_meta( $post_id, '_yoast_wpseo_meta-robots-nofollow', '0' );
			}, 999 );
		}
	}
}
add_action('acf/save_post', 'websolute_set_noindex');


/**
 * Add a custom and simplified WYSIWYG toolbar
 *
 * @param array $toolbars
 * @return arrat
 */
function websolute_wysiwyg_toolbars( $toolbars ) {
    $toolbars['Very Simple' ] = array();
    $toolbars['Very Simple' ][1] = array('bold' , 'italic' , 'underline', 'bullist', 'numlist', 'link');

    return $toolbars;
}
add_filter( 'acf/fields/wysiwyg/toolbars' , 'websolute_wysiwyg_toolbars'  );



/**
 * Add custom styles for ACF dashboard for better usability
 *
 * @return void
 */
function websolute_acf_admin_css() {
	?>
	<style type="text/css">
		.acf-postbox>.acf-fields>.acf-field>.acf-label>label {
			font-weight: 700;
			font-size: 15px;
		}
				.acf-flexible-content .layout .acf-fc-layout-handle {
			background-color: #202428;
			color: #eee;
		}

		.acf-postbox > .inside.acf-fields > .acf-field,
		.acf-repeater.-row > table > tbody > tr > td,
		.acf-repeater.-block > table > tbody > tr > td {
			border-top: 2px solid #202428;
		}

		.acf-repeater .acf-row-handle {
			vertical-align: top !important;
			padding-top: 16px;
		}

		.acf-repeater .acf-row-handle span {
			font-size: 20px;
			font-weight: bold;
			color: #202428;
		}

		.imageUpload img {
			width: 75px;
		}

		.acf-repeater .acf-row-handle .acf-icon.-minus {
			top: 25px;
		}
	</style>
	<?php
}
add_action('acf/input/admin_head', 'websolute_acf_admin_css');


