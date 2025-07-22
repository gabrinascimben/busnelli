<?php
/**
 * Create custom post types and taxonomies
 *
 * @package Websolute_Starter_Theme
 */

// Products CPT
websolute_create_custom_post_type(
	'product',
	__('Product', 'websolute_dev'),
	__('Products', 'websolute_dev'),
	array(
		'menu_position' => 6,
		'has_archive' => false,
		'menu_icon' => 'dashicons-products',
		'supports' => array('title', 'thumbnail'),
		'rewrite' => array('slug' => 'products', 'with_front' => false ),
	)
);

// Designers CPT
websolute_create_custom_post_type(
	'designer',
	__('Designer', 'websolute_dev'),
	__('Designers', 'websolute_dev'),
	array(
		'menu_position' => 7,
		'has_archive' => false,
		'exclude_from_search' => true,
		'menu_icon' => 'dashicons-groups',
		'supports' => array('title', 'thumbnail'),
		'rewrite' => array('slug' => 'busnelli-crew', 'with_front' => false ),
	)
);

// Mosaico CPT
websolute_create_custom_post_type(
	'mosaic',
	__('Mosaic', 'websolute_dev'),
	__('Mosaics', 'websolute_dev'),
	array(
		'menu_position' => 8,
		'public' => false,
		'show_ui' => true,
		'menu_icon' => 'dashicons-layout',
		'supports' => array('title'),
	)
);


// Product category taxonomy
websolute_create_custom_taxonomy(
	'product-categories',
	__('Category', 'websolute_dev'),
	__('Categories', 'websolute_dev'),
	'product',
);



/**
 * ************************ *
 *          HELPERS         *
 * ************************ *
 */


/**
 * Create a custom post type
 *
 * @param string $post_type_name The name of the custom post type
 * @param string $singular_label The singular label of the custom post type
 * @param string $plural_label The plural label of the custom post type
 * @param array $args Additional arguments to customize the custom post type
 */
function websolute_create_custom_post_type($post_type_name, $singular_label, $plural_label, $args = array()) {
	$labels = array(
		'name' => $plural_label,
		'singular_name' => $singular_label,
		'menu_name' => $plural_label,
		'all_items' => sprintf(__('All %s', 'websolute_dev'), $plural_label),
		'add_new' => __('Add New', 'websolute_dev'),
		'add_new_item' => sprintf(__('Add New %s', 'websolute_dev'), $singular_label),
		'edit_item' => sprintf(__('Edit %s', 'websolute_dev'), $singular_label),
		'new_item' => sprintf(__('New %s', 'websolute_dev'), $singular_label),
		'view_item' => sprintf(__('View %s', 'websolute_dev'), $singular_label),
		'search_items' => sprintf(__('Search %s', 'websolute_dev'), $plural_label),
		'not_found' => sprintf(__('No %s found', 'websolute_dev'), $plural_label),
		'not_found_in_trash' => sprintf(__('No %s found in trash', 'websolute_dev'), $plural_label),
		'parent_item_colon' => '',
	);

	$defaults = array(
		'labels' => $labels,
		'description' => '',
		'public' => true,
		'menu_position' => 5,
		'menu_icon' => 'dashicons-admin-post',
		'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
		'has_archive' => true,
		'rewrite' => array('slug' => $post_type_name),
	);

	$args = wp_parse_args($args, $defaults);

	register_post_type($post_type_name, $args);
}


/**
 * Create a custom taxonomy
 *
 * @param string $taxonomy_name The name of the custom taxonomy
 * @param string $singular_label The singular label of the custom taxonomy
 * @param string $plural_label The plural label of the custom taxonomy
 * @param string $post_type The name of the post type to which the taxonomy should be registered
 * @param array $args Additional arguments to customize the custom taxonomy
 */
function websolute_create_custom_taxonomy($taxonomy_name, $singular_label, $plural_label, $post_type, $args = array()) {
	$labels = array(
		'name' => $plural_label,
		'singular_name' => $singular_label,
		'search_items' => sprintf(__('Search %s', 'websolute_dev'), $plural_label),
		'all_items' => sprintf(__('All %s', 'websolute_dev'), $plural_label),
		'parent_item' => sprintf(__('Parent %s', 'websolute_dev'), $singular_label),
		'parent_item_colon' => sprintf(__('Parent %s:', 'websolute_dev'), $singular_label),
		'edit_item' => sprintf(__('Edit %s', 'websolute_dev'), $singular_label),
		'update_item' => sprintf(__('Update %s', 'websolute_dev'), $singular_label),
		'add_new_item' => sprintf(__('Add New %s', 'websolute_dev'), $singular_label),
		'new_item_name' => sprintf(__('New %s Name', 'websolute_dev'), $singular_label),
		'menu_name' => $plural_label,
	);

	$defaults = array(
		'labels' => $labels,
		'public' => true,
		'show_in_rest' => true,
		'hierarchical' => true,
		'show_admin_column' => true,
	);

	$args = wp_parse_args($args, $defaults);

	register_taxonomy($taxonomy_name, $post_type, $args);
}
