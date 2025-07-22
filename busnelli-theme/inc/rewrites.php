<?php
/**
 * Custom rewrite rules
 *
 * @package Websolute_Starter_Theme
 */

// Setup rewrite rules
add_action( 'init',  function() {

	// Set language to default language

	global $sitepress;
	$current_lang = apply_filters( 'wpml_current_language', NULL );
	$default_lang = apply_filters( 'wpml_default_language', NULL );
	$sitepress->switch_lang( $default_lang );

	// Get Collections page ID in the default language
	$page_id =  get_field('collections_page', 'option');

	// Get all translations of that page
	// https://wpml.org/it/faq/how-to-get-other-languages-of-current-post/
	$type = apply_filters( 'wpml_element_type', get_post_type( $page_id ) );
	$trid = apply_filters( 'wpml_element_trid', false, $page_id, $type );

	// Rewrite rules for filters in collection page for each language
	// Remember: the language slug like `/en/` should not be included in the rewrite rule
	$translations = apply_filters( 'wpml_get_element_translations', array(), $trid, $type );
	foreach ( $translations as $lang => $translation ) {
		$page = get_post($translation->element_id);
		// add_rewrite_rule( $page->post_name . '/([a-z0-9-]+)[/]?$', 'index.php?pagename=' . $page->post_name . '&busnelli_filter=$matches[1]', 'top' );

		$terms = get_terms( array(
			'taxonomy' => 'product-categories',
			'hide_emtpy' => false
		));
		foreach ($terms as $term) {
			$term_id = apply_filters( 'wpml_object_id', $term->term_id, 'product-categories', FALSE, $lang  );
			$term_lang = get_term($term_id);
			if (!is_wp_error($term_lang))
				add_rewrite_rule( $page->post_name . '/'.$term_lang->slug.'[/]?$', 'index.php?pagename=' . $page->post_name . '&busnelli_filter='.$term_lang->slug, 'top' );
		}
		$designers = get_posts( array(
			'posts_per_page' => -1,
			'post_type' => 'designer',
			'post_status' => 'publish',
			'orderby' => 'menu_order',
			'order' => 'ASC'
		));
		foreach ($designers as $designer) {
			add_rewrite_rule( $page->post_name . '/'.$designer->post_name.'[/]?$', 'index.php?pagename=' . $page->post_name . '&busnelli_filter='.$designer->post_name, 'top' );
		}
	}

	// Reset to original language
	$sitepress->switch_lang($current_lang);
} );

//  Whitelist the query param
add_filter( 'query_vars', function( $query_vars ) {
    $query_vars[] = 'busnelli_filter'; // filter
    return $query_vars;
} );
