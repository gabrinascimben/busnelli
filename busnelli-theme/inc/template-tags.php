<?php
/**
 * Custom template tags for this theme
 *
 * @package Websolute_Starter_Theme
 */


/**
 * Echo a custom WPML language switcher
 *
 * @return void
 */
function websolute_custom_language_switcher() {
	$current_language = apply_filters( 'wpml_current_language', NULL );
    $languages = apply_filters( 'wpml_active_languages', NULL, array( 'skip_missing' => 0, 'link_empty_to' => '/' ) );
	echo '<div class="dropdown "><div class="dropdown--wrapper">';

	// Is it a filtered listing?
	$filter = get_query_var('busnelli_filter');
	$is_filter = false;
	if ($filter) {
		if ( $filter_obj = get_term_by ('slug', $filter, 'product-categories')) :
			// Filter by category
			$is_filter = true;
			$element_type = 'product-categories';
			$element_id = $filter_obj->term_id;
		elseif ( $filter_obj = get_page_by_path( $filter, OBJECT, 'designer') ) :
			// Filter by designer
			$is_filter = true;
			$element_type = 'designer';
			$element_id = $filter_obj->ID;
		endif;
	}


	if ( $current_language) {
		echo '<div class="dropdown--active">' . strtoupper($current_language) . '</div>';
	}
    if ( !empty( $languages ) ) {
		echo '<div class="dropdown--items">';
        foreach( $languages as $language ){
            if( !$language['active'] ) {

				$path = '';
				if ($is_filter) {
					global $sitepress;
					$current_lang = apply_filters( 'wpml_current_language', NULL );
					$sitepress->switch_lang( $language['language_code'] );
					$translated_id = apply_filters( 'wpml_object_id', $element_id, $element_type, false, $language['language_code'] );
					if ( $element_type == 'product-categories') {
						$term = get_term($translated_id, 'product-categories');
						$path = $term->slug . '/';
					} elseif ( $element_type == 'designer') {
						if($translated_id) {
							$designer = get_post($translated_id);
							$path = $designer->post_name . '/';
						}
					}
					$sitepress->switch_lang( $current_lang );
				}

				echo '<div class="dropdown--item"><a href="' . esc_url( $language['url'] ) . $path . '">' . strtoupper($language['language_code']) . '</a></div>';
			}
        }
		echo '</div>';
    }
	echo '</div></div>';
}

/**
 * Echo a custom WPML language switcher - alternate version for overlay menu
 *
 * @return void
 */
function websolute_custom_language_switcher_alt() {
    $languages = apply_filters( 'wpml_active_languages', NULL, array( 'skip_missing' => 0, 'link_empty_to' => '/' ) );
	echo '<div class="menu--language">';


	// Is it a filtered listing?
	$filter = get_query_var('busnelli_filter');
	$is_filter = false;
	if ($filter) {
		if ( $filter_obj = get_term_by ('slug', $filter, 'product-categories')) :
			// Filter by category
			$is_filter = true;
			$element_type = 'product-categories';
			$element_id = $filter_obj->term_id;
		elseif ( $filter_obj = get_page_by_path( $filter, OBJECT, 'designer') ) :
			// Filter by designer
			$is_filter = true;
			$element_type = 'designer';
			$element_id = $filter_obj->ID;
		endif;
	}

    if( !empty( $languages ) ) {
        foreach( $languages as $language ){
			$active = '';
            if( $language['active'] ) {
				$active = 'active';
			}

			$path = '';
			if ($is_filter) {
				global $sitepress;
				$current_lang = apply_filters( 'wpml_current_language', NULL );
				$sitepress->switch_lang( $language['language_code'] );
				$translated_id = apply_filters( 'wpml_object_id', $element_id, $element_type, false, $language['language_code'] );
				if ( $element_type == 'product-categories') {
					$term = get_term($translated_id, 'product-categories');
					$path = $term->slug . '/';
				} elseif ( $element_type == 'designer') {
					if($translated_id) {
						$designer = get_post($translated_id);
						$path = $designer->post_name . '/';
					}
				}
				$sitepress->switch_lang( $current_lang );
			}

			echo '<a href="' . esc_url( $language['url'] ) . $path . '" class="menu--language--item ' . $active . '">' . strtoupper($language['language_code']) . '</a>';
        }
    }
	echo '</div>';
}

/**
 * Echo the breadcrumb link
 *
 * @return void
 */
function websolute_breadcrumb() {
	if (is_singular('post') || is_home() || is_category()) {
		// Blog
		$post_id = get_option( 'page_for_posts' );
	} elseif ( is_singular('product') || is_tax('product-categories') || is_tax('product-designer')) {
		// Products
		$post_id = get_field('collections_page', 'option');
	} elseif ( is_singular('designer')) {
		// Designer
		$post_id = get_field('designers_page', 'option');
	} else {
		// The rest
		$post_id = get_the_ID();
	}

	// Don't display it on search, 404, the front page and on single product pages
	if (
		!is_search()
		&& !is_404()
		&& !is_front_page()
		&& !is_singular('product')
		&& !is_page( get_field('collections_page', 'option') )
	) {
		echo '<div class="header--left--breadcrumb">';
		echo '<a href="' . esc_url(get_permalink($post_id)) . '">';
		echo get_the_title($post_id);
		echo '</a>';
		echo '</div>';
	}

	// Exception for single product pages
	if (is_singular('product')) {
		echo '<div class="header--left--breadcrumb">';
		echo '<a href="' . esc_url(get_permalink($post_id)) . '">';
		echo get_the_title($post_id);
		echo '</a> / <h1>';
		echo get_the_product_title( get_the_ID());
		echo '</h1>';
		echo '</div>';
	}

	// Exception for Products archive
	if ( is_page( get_field('collections_page', 'option') ) ) {
		echo '<h1 class="header--left--breadcrumb">';
		echo get_the_title($post_id);
		echo '</h1>';
	}
}

/**
 * Echo the main page class
 *
 * @return void
 */
function websolute_page_class() {
	if (get_field('custom_class') != '') {
		// Custom class
		$class = get_field('custom_class');
	} elseif ( is_home() || is_category()) {
		// Blog home
		$class = 'page--caleidoscopio';
	} elseif (is_singular('post')) {
		// Single article
		$class = 'page--articolo';
	} elseif (get_the_id() == get_field('collections_page', 'option')) {
		// Collections page
		$class = 'page--collection';
	} elseif ( is_singular('product')) {
		// Single collection
		$class = 'page--composizione';
	} elseif (get_the_id() == get_field('designers_page', 'option')) {
		// Busnelli Crew page
		$class = 'page--crew';
	} elseif ( is_singular('designer')) {
		// Single designer
		$class = 'page--designer';
	} elseif ( is_front_page()) {
		// Homepage
		$class = 'page--homepage';
	} elseif ( is_404()) {
		// Error 404
		$class = 'page--404';
	} elseif ( is_search()) {
		// Search results
		$class = 'page--search';
	} else {
		// Default class
		$class = 'page';
	}

	echo $class;
}

/**
 * Return the product name with the code
 *
 * @param int $id Product id
 * @return void
 */
function get_the_product_title($id) {

	$title = get_the_title($id);
	$separator = ' ';

	if ( get_field('code_letter') != '') {
		$title .= $separator . get_field('code_letter');
		$separator = '_';
	}
	if ( get_field('code_number') != '')  {
		$title .= $separator . get_field('code_number');
	}

	return $title;
}



/**
 * Echo various SVG icons and logos
 *
 * @param string $id The identifier of the logo
 *
 * @return void
 */
function websolute_svg($id) {
	switch ($id) {
		case 'logo':
			echo '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="33.283" viewBox="0 0 200 33.283"><g><g><path d="M10.8,20.439a9.4,9.4,0,0,0-.031-18.747H.025V0H32.679V32.679H30.73c-.014,0-.021-.008-.016-.021a8.832,8.832,0,0,0-8.475-11.221H7.138a.462.462,0,0,1,0-.925c.285,0,3.369-.064,3.665-.074M.042,17.907c0,.021.023.026.032.006a7.454,7.454,0,0,1,5.875-4.382l3.8-.487c1.147-.208,1.945-.869,1.945-1.938A1.94,1.94,0,0,0,9.749,9.168H.042v8.739M.032,24.04A.016.016,0,0,0,0,24.046v8.639H21.153a2.081,2.081,0,1,0,0-4.162c-.05,0-.1,0-.15,0H6.915A7.519,7.519,0,0,1,.032,24.04m65.98-8.908c2.113-2.439,2.836-4.092,2.836-7.023,0-6.646-6-8.088-10.215-8.088H46.13V32.706H60.971c7.06,0,11.911-3.17,11.911-9.942a7.581,7.581,0,0,0-6.87-7.633m-13.738-9.8h4.58c3.183,0,5.153.758,5.153,3.638s-2.274,3.739-5.052,3.739H52.274Zm7.313,21.777H52.306V18.5h7.164c3.717,0,6.018.885,6.018,4.249s-2.655,4.366-5.9,4.366m15.2-19.829h6.183l.16,16.58c0,2.836,1.442,4.229,4.326,4.229s4.325-1.393,4.325-4.229V7.283h6.392V22.566c0,4.278-1.105,7.065-3.316,8.459a12.827,12.827,0,0,1-7.209,2.162,14.8,14.8,0,0,1-7.5-1.971c-2.259-1.393-3.364-4.277-3.364-8.651Zm44.136,12.831c-1.394-1.3-4.23-2.4-8.555-3.268-3.316-.625-4.95-1.634-4.95-2.932s1.249-1.971,3.749-1.971c1.786,0,2.993.443,3.579,1.252a4.423,4.423,0,0,1,.633,2.06H115.8l.048,0h4.037a8.079,8.079,0,0,0-3.028-6.2A12.686,12.686,0,0,0,109.067,6.9c-5.815.1-10.141,2.692-10.141,8.17.048,3.989,2.932,6.488,8.555,7.5,4.373.769,6.584,1.827,6.584,3.124,0,1.634-1.346,2.4-4.037,2.4-3.124,0-5.143-.961-5.286-3.748H98.205c0,2.931.961,5.142,2.883,6.584,1.73,1.49,4.421,2.258,7.978,2.258,6.728,0,11.63-2.307,11.63-8.555a6.315,6.315,0,0,0-1.778-4.518m19.534,12.592-.041-16.244c-.144-2.643-1.586-3.94-4.422-3.94s-4.277,1.3-4.325,3.94V32.706h-6.488V17.76c0-7.257,3.653-10.862,10.91-10.862S144.9,10.5,144.852,17.76V32.706Zm20.318.577c-7.69-.241-11.535-4.71-11.535-13.36S151.129,6.947,158.867,6.9c8.073,0,11.87,4.95,11.39,14.9H153.821c.241,3.892,1.923,5.863,5.046,5.863a5.885,5.885,0,0,0,4.249-1.582,7.33,7.33,0,0,0,.859-1.161l5.9,0c-1.394,5.382-4.854,8.362-11.1,8.362m-4.854-16.052h9.564c-.384-3.364-1.97-5.094-4.71-5.094s-4.374,1.73-4.854,5.094M179.407.026h-6.4V32.768h6.4Zm10.3,0h-6.4V32.768h6.4Zm10.3,0h-6.4v5H200Zm0,8.48h-6.4V32.768H200Z" fill="#fff"></path></g></g></svg>';
			break;
		case 'search':
			echo '<svg id="search" xmlns="http://www.w3.org/2000/svg" width="23.941" height="23.941" viewBox="0 0 23.941 23.941"><g id="Raggruppa_10247" data-name="Raggruppa 10247" transform="translate(-1208 -105)" style="mix-blend-mode: difference;isolation: isolate"><g id="Raggruppa_9717" data-name="Raggruppa 9717" transform="translate(1208 105)"><g id="Raggruppa_7" data-name="Raggruppa 7"><path id="Tracciato_3" data-name="Tracciato 3" d="M23.714,22.639l-6.181-6.083a9.777,9.777,0,0,0,2.613-6.644A9.994,9.994,0,0,0,10.073,0,9.993,9.993,0,0,0,0,9.912a9.993,9.993,0,0,0,10.073,9.912,10.128,10.128,0,0,0,6.34-2.214l6.205,6.106a.784.784,0,0,0,1.1,0,.754.754,0,0,0,0-1.079ZM10.073,18.3A8.456,8.456,0,0,1,1.55,9.913a8.456,8.456,0,0,1,8.523-8.388A8.456,8.456,0,0,1,18.6,9.913,8.455,8.455,0,0,1,10.073,18.3Zm0,0" fill="#fff"></path></g></g></g></svg><svg xmlns="http://www.w3.org/2000/svg" width="23.941" height="23.941" viewBox="0 0 23.941 23.941"><g id="Raggruppa_10629" data-name="Raggruppa 10629" transform="translate(-1208 -105)" style="mix-blend-mode: normal;isolation: isolate"><g id="Raggruppa_9717" data-name="Raggruppa 9717" transform="translate(1208 105)"><g id="Raggruppa_7" data-name="Raggruppa 7"><path id="Tracciato_3" data-name="Tracciato 3" d="M23.714,22.639l-6.181-6.083a9.777,9.777,0,0,0,2.613-6.644A9.994,9.994,0,0,0,10.073,0,9.993,9.993,0,0,0,0,9.912a9.993,9.993,0,0,0,10.073,9.912,10.128,10.128,0,0,0,6.34-2.214l6.205,6.106a.784.784,0,0,0,1.1,0,.754.754,0,0,0,0-1.079ZM10.073,18.3A8.456,8.456,0,0,1,1.55,9.913a8.456,8.456,0,0,1,8.523-8.388A8.456,8.456,0,0,1,18.6,9.913,8.455,8.455,0,0,1,10.073,18.3Zm0,0" fill="#d50037"></path></g></g></g></svg>';
			break;
		case 'pinterest' :
			echo '<svg xmlns="http://www.w3.org/2000/svg" width="13.741" height="17.745" viewBox="0 0 13.741 17.745"><path id="Tracciato_11377" data-name="Tracciato 11377" d="M161.666,12.048c-.015.051-.029.094-.04.137-.652,2.554-.724,3.121-1.394,4.307a13.22,13.22,0,0,1-1.077,1.608c-.045.058-.087.133-.177.115s-.106-.11-.117-.188a13.751,13.751,0,0,1-.14-2.338c.034-1.02.16-1.371,1.476-6.9a.386.386,0,0,0-.031-.23,3.889,3.889,0,0,1-.1-2.585c.6-1.887,2.734-2.032,3.109-.475.23.963-.38,2.223-.848,4.086-.387,1.537,1.422,2.629,2.968,1.507,1.426-1.034,1.98-3.514,1.874-5.271-.207-3.5-4.049-4.261-6.487-3.133-2.794,1.292-3.429,4.756-2.168,6.339.161.2.284.324.231.529-.081.317-.153.636-.241.951a.337.337,0,0,1-.5.224,2.859,2.859,0,0,1-1.167-.875,5.529,5.529,0,0,1,.038-6.172A7.417,7.417,0,0,1,164.03.525,6.062,6.062,0,0,1,169.6,5.53a8.337,8.337,0,0,1-1.53,5.856c-1.816,2.251-4.759,2.4-6.116,1.019a4.537,4.537,0,0,1-.291-.357" transform="translate(-155.92 -0.473)" fill="#fff" fill-rule="evenodd"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="13.741" height="17.745" viewBox="0 0 13.741 17.745"><path id="Tracciato_11467" data-name="Tracciato 11467" d="M161.666,12.048c-.015.051-.029.094-.04.137-.652,2.554-.724,3.121-1.394,4.307a13.22,13.22,0,0,1-1.077,1.608c-.045.058-.087.133-.177.115s-.106-.11-.117-.188a13.751,13.751,0,0,1-.14-2.338c.034-1.02.16-1.371,1.476-6.9a.386.386,0,0,0-.031-.23,3.889,3.889,0,0,1-.1-2.585c.6-1.887,2.734-2.032,3.109-.475.23.963-.38,2.223-.848,4.086-.387,1.537,1.422,2.629,2.968,1.507,1.426-1.034,1.98-3.514,1.874-5.271-.207-3.5-4.049-4.261-6.487-3.133-2.794,1.292-3.429,4.756-2.168,6.339.161.2.284.324.231.529-.081.317-.153.636-.241.951a.337.337,0,0,1-.5.224,2.859,2.859,0,0,1-1.167-.875,5.529,5.529,0,0,1,.038-6.172A7.417,7.417,0,0,1,164.03.525,6.062,6.062,0,0,1,169.6,5.53a8.337,8.337,0,0,1-1.53,5.856c-1.816,2.251-4.759,2.4-6.116,1.019a4.537,4.537,0,0,1-.291-.357" transform="translate(-155.92 -0.473)" fill="#d50037" fill-rule="evenodd"/></svg>';
			break;
		case 'linkedin' :
			echo '<svg xmlns="http://www.w3.org/2000/svg" width="13.65" height="13.617" viewBox="0 0 13.65 13.617"><g id="Raggruppa_10519" data-name="Raggruppa 10519" transform="translate(-228.404 -6872)"><path id="Tracciato_11375" data-name="Tracciato 11375" d="M116.63,4.52h2.832v9.1H116.63ZM118.046,0A1.64,1.64,0,1,1,116.4,1.638,1.639,1.639,0,0,1,118.046,0" transform="translate(112 6872)" fill="#fff"/><path id="Tracciato_11376" data-name="Tracciato 11376" d="M121.236,4.52h2.712V5.764h.037A2.974,2.974,0,0,1,126.663,4.3c2.863,0,3.391,1.883,3.391,4.333v4.989h-2.826V9.194c0-1.056-.021-2.412-1.469-2.412-1.472,0-1.7,1.149-1.7,2.335v4.5h-2.826Z" transform="translate(112 6872)" fill="#fff"/></g></svg><svg xmlns="http://www.w3.org/2000/svg" width="13.65" height="13.617" viewBox="0 0 13.65 13.617"><g id="Raggruppa_10630" data-name="Raggruppa 10630" transform="translate(-228.404 -6872)"><path id="Tracciato_11375" data-name="Tracciato 11375" d="M116.63,4.52h2.832v9.1H116.63ZM118.046,0A1.64,1.64,0,1,1,116.4,1.638,1.639,1.639,0,0,1,118.046,0" transform="translate(112 6872)" fill="#d50037"/><path id="Tracciato_11376" data-name="Tracciato 11376" d="M121.236,4.52h2.712V5.764h.037A2.974,2.974,0,0,1,126.663,4.3c2.863,0,3.391,1.883,3.391,4.333v4.989h-2.826V9.194c0-1.056-.021-2.412-1.469-2.412-1.472,0-1.7,1.149-1.7,2.335v4.5h-2.826Z" transform="translate(112 6872)" fill="#d50037"/></g></svg>';
			break;
		case 'youtube' :
			echo '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="11.2" viewBox="0 0 16 11.2"><path id="Tracciato_11370" data-name="Tracciato 11370" d="M91.667,6.809A3.511,3.511,0,0,0,88.156,3.3H79.178a3.511,3.511,0,0,0-3.511,3.511v4.178A3.511,3.511,0,0,0,79.178,14.5h8.978a3.511,3.511,0,0,0,3.511-3.511Zm-5.28,2.4L82.361,11.2c-.158.085-.694-.029-.694-.209V6.906c0-.182.541-.3.7-.206l3.853,2.1c.162.092.331.325.168.414" transform="translate(-75.667 -3.298)" fill="#fff"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="16" height="11.2" viewBox="0 0 16 11.2"><path id="Tracciato_11468" data-name="Tracciato 11468" d="M91.667,6.809A3.511,3.511,0,0,0,88.156,3.3H79.178a3.511,3.511,0,0,0-3.511,3.511v4.178A3.511,3.511,0,0,0,79.178,14.5h8.978a3.511,3.511,0,0,0,3.511-3.511Zm-5.28,2.4L82.361,11.2c-.158.085-.694-.029-.694-.209V6.906c0-.182.541-.3.7-.206l3.853,2.1c.162.092.331.325.168.414" transform="translate(-75.667 -3.298)" fill="#d50037"/></svg>';
			break;
		case 'instagram' :
			echo '<svg xmlns="http://www.w3.org/2000/svg" width="17.143" height="17.144" viewBox="0 0 17.143 17.144"><g id="Raggruppa_10518" data-name="Raggruppa 10518" transform="translate(-147.534 -6872.679)"><path id="Tracciato_11371" data-name="Tracciato 11371" d="M48.644,3.74a1,1,0,1,0,1,1,1.005,1.005,0,0,0-1-1" transform="translate(112 6872)" fill="#fff"/><path id="Tracciato_11372" data-name="Tracciato 11372" d="M44.176,5.03A4.222,4.222,0,1,0,48.4,9.252,4.227,4.227,0,0,0,44.176,5.03m0,6.926a2.7,2.7,0,1,1,2.7-2.7,2.707,2.707,0,0,1-2.7,2.7" transform="translate(112 6872)" fill="#fff"/><path id="Tracciato_11373" data-name="Tracciato 11373" d="M47.527,17.823H40.683a5.155,5.155,0,0,1-5.149-5.15V5.828A5.155,5.155,0,0,1,40.683.679h6.844a5.155,5.155,0,0,1,5.15,5.149v6.845a5.155,5.155,0,0,1-5.15,5.15M40.683,2.292a3.541,3.541,0,0,0-3.537,3.536v6.845a3.541,3.541,0,0,0,3.537,3.537h6.844a3.541,3.541,0,0,0,3.537-3.537V5.828a3.54,3.54,0,0,0-3.537-3.536Z" transform="translate(112 6872)" fill="#fff"/></g></svg><svg xmlns="http://www.w3.org/2000/svg" width="17.143" height="17.144" viewBox="0 0 17.143 17.144"><g id="Raggruppa_10631" data-name="Raggruppa 10631" transform="translate(-147.534 -6872.679)"><path id="Tracciato_11371" data-name="Tracciato 11371" d="M48.644,3.74a1,1,0,1,0,1,1,1.005,1.005,0,0,0-1-1" transform="translate(112 6872)" fill="#d50037"/><path id="Tracciato_11372" data-name="Tracciato 11372" d="M44.176,5.03A4.222,4.222,0,1,0,48.4,9.252,4.227,4.227,0,0,0,44.176,5.03m0,6.926a2.7,2.7,0,1,1,2.7-2.7,2.707,2.707,0,0,1-2.7,2.7" transform="translate(112 6872)" fill="#d50037"/><path id="Tracciato_11373" data-name="Tracciato 11373" d="M47.527,17.823H40.683a5.155,5.155,0,0,1-5.149-5.15V5.828A5.155,5.155,0,0,1,40.683.679h6.844a5.155,5.155,0,0,1,5.15,5.149v6.845a5.155,5.155,0,0,1-5.15,5.15M40.683,2.292a3.541,3.541,0,0,0-3.537,3.536v6.845a3.541,3.541,0,0,0,3.537,3.537h6.844a3.541,3.541,0,0,0,3.537-3.537V5.828a3.54,3.54,0,0,0-3.537-3.536Z" transform="translate(112 6872)" fill="#d50037"/></g></svg>';
			break;
		case 'facebook' :
			echo '<svg xmlns="http://www.w3.org/2000/svg" width="9.086" height="17.094" viewBox="0 0 9.086 17.094"><path id="Tracciato_11374" data-name="Tracciato 11374" d="M8.491,9.885l.471-3.07H6.016V4.822A1.536,1.536,0,0,1,7.747,3.163H9.086V.549A16.356,16.356,0,0,0,6.709.342C4.282.342,2.7,1.812,2.7,4.474V6.815H0v3.07H2.7v7.422a10.739,10.739,0,0,0,3.319,0V9.885Z" transform="translate(0 -0.342)" fill="#fff"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="9.086" height="17.094" viewBox="0 0 9.086 17.094"><path id="Tracciato_11469" data-name="Tracciato 11469" d="M8.491,9.885l.471-3.07H6.016V4.822A1.536,1.536,0,0,1,7.747,3.163H9.086V.549A16.356,16.356,0,0,0,6.709.342C4.282.342,2.7,1.812,2.7,4.474V6.815H0v3.07H2.7v7.422a10.739,10.739,0,0,0,3.319,0V9.885Z" transform="translate(0 -0.342)" fill="#d50037"/></svg>';
			break;
		case 'claim_logo':
			echo '<svg id="Raggruppa_9952" data-name="Raggruppa 9952" xmlns="http://www.w3.org/2000/svg" width="137.654" height="12.811" viewBox="0 0 137.654 12.811"><g id="Raggruppa_9804" data-name="Raggruppa 9804" transform="translate(0 2.642)"><path id="Tracciato_11135" data-name="Tracciato 11135" d="M5.185,11.537a1.019,1.019,0,0,0-.32-.711,1.045,1.045,0,0,0-.725-.248c-1.1,0-1.265.958-1.265,1.875s.16,1.859,1.265,1.859a1.157,1.157,0,0,0,1.118-1.1H8A3.527,3.527,0,0,1,6.7,15.577,4.2,4.2,0,0,1,4.08,16.4,3.887,3.887,0,0,1,0,12.454,3.9,3.9,0,0,1,4.08,8.487c1.976,0,3.662.974,3.835,3.05Z" transform="translate(0 -8.487)" fill="#fff"/></g><rect id="Rettangolo_674" data-name="Rettangolo 674" width="2.876" height="10.369" transform="translate(8.521 0)" fill="#fff"/><g id="Raggruppa_9805" data-name="Raggruppa 9805" transform="translate(11.861 2.642)"><path id="Tracciato_11136" data-name="Tracciato 11136" d="M43.139,12.831a5,5,0,0,1-1.134.364c-.638.143-.973.3-.973.812a.829.829,0,0,0,.9.7,1.142,1.142,0,0,0,1.206-1.176Zm2.759,1.7a3.05,3.05,0,0,0,.349,1.685H43.313a2.011,2.011,0,0,1-.1-.711h-.028a3.066,3.066,0,0,1-2.427.9c-1.453,0-2.657-.7-2.657-2.28,0-2.383,2.788-2.3,4.255-2.571.393-.073.785-.188.785-.669,0-.507-.479-.7-.944-.7-.887,0-1.061.45-1.075.77H38.447a2.179,2.179,0,0,1,1.307-2.033,6.185,6.185,0,0,1,2.572-.437c3.6,0,3.573,1.5,3.573,2.949Z" transform="translate(-38.099 -8.486)" fill="#fff"/></g><path id="Tracciato_11137" data-name="Tracciato 11137" d="M65.895,10.37h2.876V2.832H65.895Zm0-8.352h2.876V0H65.895Z" transform="translate(-45.38 0)" fill="#fff"/><g id="Raggruppa_9806" data-name="Raggruppa 9806" transform="translate(24.289 2.643)"><path id="Tracciato_11138" data-name="Tracciato 11138" d="M78.018,8.678h2.774v1h.03a2.726,2.726,0,0,1,2.47-1.191,2.238,2.238,0,0,1,2.032,1.177,2.937,2.937,0,0,1,2.571-1.177,2.382,2.382,0,0,1,2.585,2.557v5.171H87.6V12.134c0-.711-.073-1.35-.946-1.35-.725,0-.972.566-.972,1.35v4.082H82.811V12.134c0-.711-.072-1.35-.944-1.35-.725,0-.972.566-.972,1.35v4.082H78.018Z" transform="translate(-78.018 -8.488)" fill="#fff"/></g><rect id="Rettangolo_675" data-name="Rettangolo 675" width="3.021" height="2.876" transform="translate(37.689 7.494)" fill="#fff"/><g id="Raggruppa_9807" data-name="Raggruppa 9807" transform="translate(41.682)"><path id="Tracciato_11139" data-name="Tracciato 11139" d="M137.922,4.735c-1.031,0-1.263.972-1.263,1.859s.232,1.875,1.263,1.875,1.263-.974,1.263-1.875-.233-1.859-1.263-1.859M133.884,0h2.876V3.66h.028a2.464,2.464,0,0,1,2.064-1.017c2.526,0,3.209,2.15,3.209,3.922,0,1.889-1.031,3.995-3.167,3.995a2.316,2.316,0,0,1-2.207-1.017h-.028v.828h-2.775Z" transform="translate(-133.884)" fill="#fff"/><path id="Tracciato_11140" data-name="Tracciato 11140" d="M161.773,8.678h2.759V9.883h.03a2.205,2.205,0,0,1,2.12-1.4,3.326,3.326,0,0,1,.843.116v2.542a2.922,2.922,0,0,0-1.134-.188c-1.132,0-1.742.667-1.742,2.279v2.979h-2.876Z" transform="translate(-153.09 -5.845)" fill="#fff"/><path id="Tracciato_11141" data-name="Tracciato 11141" d="M183.741,12.831a5,5,0,0,1-1.134.364c-.638.143-.972.3-.972.812a.829.829,0,0,0,.9.7,1.142,1.142,0,0,0,1.205-1.176Zm2.76,1.7a3.049,3.049,0,0,0,.348,1.685h-2.934a2,2,0,0,1-.1-.711h-.028a3.065,3.065,0,0,1-2.426.9c-1.453,0-2.657-.7-2.657-2.28,0-2.383,2.788-2.3,4.255-2.571.394-.073.785-.188.785-.669,0-.507-.479-.7-.944-.7-.887,0-1.061.45-1.075.77H179.05a2.178,2.178,0,0,1,1.307-2.033,6.182,6.182,0,0,1,2.571-.437c3.6,0,3.573,1.5,3.573,2.949Z" transform="translate(-164.748 -5.844)" fill="#fff"/><path id="Tracciato_11142" data-name="Tracciato 11142" d="M206.307,8.678h2.775v.958h.028a2.764,2.764,0,0,1,2.455-1.148,2.427,2.427,0,0,1,2.585,2.557v5.171h-2.875V12.265c0-.871-.1-1.481-.946-1.481-.493,0-1.147.246-1.147,1.453v3.979h-2.876Z" transform="translate(-183.76 -5.845)" fill="#fff"/><path id="Tracciato_11143" data-name="Tracciato 11143" d="M237.261,4.736c-1.031,0-1.263.972-1.263,1.859s.232,1.875,1.263,1.875,1.263-.975,1.263-1.875-.232-1.859-1.263-1.859M241.3,10.37h-2.775V9.543H238.5a2.316,2.316,0,0,1-2.207,1.017c-2.136,0-3.167-2.106-3.167-3.995,0-1.773.683-3.923,3.21-3.923A2.468,2.468,0,0,1,238.4,3.66h.028V0H241.3Z" transform="translate(-202.226 -0.001)" fill="#fff"/></g><path id="Tracciato_11144" data-name="Tracciato 11144" d="M262.271,10.37h2.876V2.832h-2.876Zm0-8.352h2.876V0h-2.876Z" transform="translate(-180.618 0)" fill="#fff"/><g id="Raggruppa_9808" data-name="Raggruppa 9808" transform="translate(85.441 0)"><path id="Tracciato_11145" data-name="Tracciato 11145" d="M274.44,8.678h2.775v.958h.028A2.765,2.765,0,0,1,279.7,8.488a2.428,2.428,0,0,1,2.586,2.557v5.171h-2.875V12.265c0-.871-.1-1.481-.946-1.481-.493,0-1.146.246-1.146,1.453v3.979H274.44Z" transform="translate(-274.44 -5.846)" fill="#fff"/><path id="Tracciato_11146" data-name="Tracciato 11146" d="M305.392,4.736c-1.031,0-1.263.972-1.263,1.859s.232,1.875,1.263,1.875,1.263-.975,1.263-1.875-.232-1.859-1.263-1.859m4.038,5.634h-2.775V9.543h-.028a2.316,2.316,0,0,1-2.207,1.017c-2.136,0-3.167-2.106-3.167-3.995,0-1.773.683-3.923,3.209-3.923a2.469,2.469,0,0,1,2.064,1.017h.028V0h2.876Z" transform="translate(-292.905 -0.001)" fill="#fff"/><path id="Tracciato_11147" data-name="Tracciato 11147" d="M338.059,16.633h-2.775v-.958h-.028a2.765,2.765,0,0,1-2.455,1.148,2.427,2.427,0,0,1-2.585-2.557V9.1h2.875v3.951c0,.872.1,1.482.945,1.482.493,0,1.147-.247,1.147-1.453V9.1h2.876Z" transform="translate(-312.851 -6.264)" fill="#fff"/><path id="Tracciato_11148" data-name="Tracciato 11148" d="M361.529,10.871a.722.722,0,0,0-.335-.565.993.993,0,0,0-.639-.219c-.406,0-.87.087-.87.582,0,.218.173.319.333.392.479.2,1.569.262,2.528.582a2.17,2.17,0,0,1,1.8,2.1c0,2.092-2.005,2.658-3.834,2.658-1.773,0-3.719-.712-3.763-2.658H359.5a.927.927,0,0,0,.348.669,1.189,1.189,0,0,0,.77.218c.378,0,.974-.146.974-.582s-.247-.566-1.583-.8c-2.193-.378-3.08-1.075-3.08-2.367,0-1.9,2.049-2.4,3.559-2.4,1.627,0,3.587.451,3.66,2.382Z" transform="translate(-331.124 -5.846)" fill="#fff"/><path id="Tracciato_11149" data-name="Tracciato 11149" d="M384.454,4.022h1.54V5.793h-1.54V8.422c0,.7.159,1,.887,1a4.846,4.846,0,0,0,.653-.044V11.56c-.582,0-1.235.087-1.845.087-1.22,0-2.571-.188-2.571-2.252v-3.6H380.3V4.022h1.279V1.727h2.876Z" transform="translate(-347.342 -1.19)" fill="#fff"/><path id="Tracciato_11150" data-name="Tracciato 11150" d="M399.188,8.678h2.76V9.883h.03a2.205,2.205,0,0,1,2.12-1.4,3.328,3.328,0,0,1,.843.116v2.542a2.923,2.923,0,0,0-1.134-.188c-1.133,0-1.742.667-1.742,2.279v2.979h-2.876Z" transform="translate(-360.35 -5.846)" fill="#fff"/><path id="Tracciato_11151" data-name="Tracciato 11151" d="M420.82,16.053a7.292,7.292,0,0,1-.944,2.091c-.756.944-1.917.93-3.035.93h-1.308V16.779h.669a2.375,2.375,0,0,0,.871-.073c.174-.087.276-.232.276-.566a37.816,37.816,0,0,0-1.263-3.573L414.806,9.1h3.08l1.206,4.329h.028L420.341,9.1h2.977Z" transform="translate(-371.106 -6.264)" fill="#fff"/></</svg>';
		  	break;
		case 'more' :
			echo '<svg id="More_normal" data-name="More normal" xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><g id="Raggruppa_10249" data-name="Raggruppa 10249" transform="translate(-692 -518)"><g id="Ellisse_38" data-name="Ellisse 38" transform="translate(692 518)" fill="none" stroke="#121212" stroke-width="1"><circle cx="28" cy="28" r="28" stroke="none"/><circle cx="28" cy="28" r="27.5" fill="none"/></g></g><text id="_" data-name="+" transform="translate(32 34)" font-size="16" font-family="NiveauGroteskBold, Niveau Grotesk"><tspan x="-8" y="0">+</tspan></text></svg><svg id="More_hover" data-name="More hover" xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><g id="Raggruppa_10249" data-name="Raggruppa 10249" transform="translate(-692 -518)"><g id="Ellisse_38" data-name="Ellisse 38" transform="translate(692 518)" fill="none" stroke="#121212" stroke-width="1"><circle cx="28" cy="28" r="28" stroke="none"/><circle cx="28" cy="28" r="27.5" fill="none"/></g></g><text id="_" data-name="+" transform="translate(32 34)" fill="#d50037" font-size="16" font-family="NiveauGroteskBold, Niveau Grotesk"><tspan x="-8" y="0">+</tspan></text></svg>';
			break;
		case 'filters' :
			echo '<svg xmlns="http://www.w3.org/2000/svg" width="84.719" height="19" viewBox="0 0 84.719 19"><g id="Raggruppa_10637" data-name="Raggruppa 10637" transform="translate(-1065 -109.941)" style="mix-blend-mode: difference;isolation: isolate"><text id="FILTRI" transform="translate(1065 124.941)" fill="#000000" font-size="16" font-family="Niveau Grotesk Bold"><tspan x="0" y="0">' . __('FILTERS', 'busnelli') . '</tspan></text><g id="Raggruppa_10245" data-name="Raggruppa 10245" transform="translate(571 -2.059)"><path id="Tracciato_11327" data-name="Tracciato 11327" d="M-12009.377-2228.4h23.6" transform="translate(12564 2345.904)" fill="none" stroke="#000000" stroke-linecap="round" stroke-width="1"/><path id="Tracciato_11328" data-name="Tracciato 11328" d="M-11985.781-2228.4h-23.6" transform="translate(12564 2353.904)" fill="none" stroke="#000000" stroke-linecap="round" stroke-width="1"/><circle id="Ellisse_55" data-name="Ellisse 55" cx="2.5" cy="2.5" r="2.5" transform="translate(557 115)" fill="#000000"/><circle id="Ellisse_56" data-name="Ellisse 56" cx="2.5" cy="2.5" r="2.5" transform="translate(570.842 123)" fill="#000000"/></g></g></svg>';
			break;
		case 'download':
			echo '<svg xmlns="http://www.w3.org/2000/svg" width="13.381" height="17.126" viewBox="0 0 13.381 17.126"><g id="download" transform="translate(0.5)"><path id="Tracciato_11283" data-name="Tracciato 11283" d="M7.731.169a.551.551,0,0,0-.794,0,.566.566,0,0,0,0,.788l3.4,2.776H.556A.545.545,0,0,0,0,4.283a.559.559,0,0,0,.556.563h9.782l-3.4,2.764a.574.574,0,0,0,0,.794.551.551,0,0,0,.794,0l4.352-3.727a.537.537,0,0,0,0-.782Zm0,0" transform="translate(10.476) rotate(90)" fill="#121212"/><path id="Tracciato_11330" data-name="Tracciato 11330" d="M-12136.564-1424h12.381" transform="translate(12136.564 1440.626)" fill="none" stroke="#121212" stroke-linecap="round" stroke-width="1"/></g></svg>';
			break;
		case 'arrow_prev':
		case 'prev':
			echo '<svg id="Arrow_prev" data-name="Arrow prev" xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58"><g id="Ellisse_28" data-name="Ellisse 28" fill="none" stroke="#1b1b1a" stroke-width="1"><circle cx="29" cy="29" r="29" stroke="none"/><circle cx="29" cy="29" r="28.5" fill="none"/></g><path id="Tracciato_11283" data-name="Tracciato 11283" d="M3.772.141a.46.46,0,0,1,.663,0,.473.473,0,0,1,0,.657L1.6,3.115H17.9a.454.454,0,0,1,.464.459.467.467,0,0,1-.464.47H1.6L4.435,6.35a.479.479,0,0,1,0,.663.46.46,0,0,1-.663,0L.141,3.9a.448.448,0,0,1,0-.652Zm0,0" transform="translate(19.77 25.287)"/></svg><svg id="Arrow_prev_Hover" data-name="Arrow prev Hover" xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58"><g id="Ellisse_363" data-name="Ellisse 363" fill="none" stroke="#1b1b1a" stroke-width="1"><circle cx="29" cy="29" r="29" stroke="none"/><circle cx="29" cy="29" r="28.5" fill="none"/></g><path id="Tracciato_11471" data-name="Tracciato 11471" d="M3.772.141a.46.46,0,0,1,.663,0,.473.473,0,0,1,0,.657L1.6,3.115H17.9a.454.454,0,0,1,.464.459.467.467,0,0,1-.464.47H1.6L4.435,6.35a.479.479,0,0,1,0,.663.46.46,0,0,1-.663,0L.141,3.9a.448.448,0,0,1,0-.652Zm0,0" transform="translate(19.77 25.287)" fill="#d50037"/></svg>';
			break;
		case 'arrow_next':
		case 'next':
			echo '<svg id="Arrow_next" data-name="Arrow next" xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58"><g id="Ellisse_28" data-name="Ellisse 28" fill="none" stroke="#000" stroke-width="1"><circle cx="29" cy="29" r="29" stroke="none"/><circle cx="29" cy="29" r="28.5" fill="none"/></g><path id="Tracciato_11283" data-name="Tracciato 11283" d="M14.589.141a.46.46,0,0,0-.663,0,.473.473,0,0,0,0,.657l2.838,2.317H.464A.454.454,0,0,0,0,3.574a.467.467,0,0,0,.464.47h16.3L13.926,6.35a.479.479,0,0,0,0,.663.46.46,0,0,0,.663,0L18.22,3.9a.448.448,0,0,0,0-.652Zm0,0" transform="translate(19.871 25.287)"/></svg><svg id="Arrow_next_Hover" data-name="Arrow next Hover" xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58"><g id="Ellisse_362" data-name="Ellisse 362" fill="none" stroke="#000" stroke-width="1"><circle cx="29" cy="29" r="29" stroke="none"/><circle cx="29" cy="29" r="28.5" fill="none"/></g><path id="Tracciato_11470" data-name="Tracciato 11470" d="M14.589.141a.46.46,0,0,0-.663,0,.473.473,0,0,0,0,.657l2.838,2.317H.464A.454.454,0,0,0,0,3.574a.467.467,0,0,0,.464.47h16.3L13.926,6.35a.479.479,0,0,0,0,.663.46.46,0,0,0,.663,0L18.22,3.9a.448.448,0,0,0,0-.652Zm0,0" transform="translate(19.871 25.287)" fill="#d50037"/></svg>';
			break;
		case 'arrow_next_nocircle':
			echo '<svg id="Arrow_next" data-name="Arrow next" xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58"><path id="Tracciato_11283" data-name="Tracciato 11283" d="M14.589.141a.46.46,0,0,0-.663,0,.473.473,0,0,0,0,.657l2.838,2.317H.464A.454.454,0,0,0,0,3.574a.467.467,0,0,0,.464.47h16.3L13.926,6.35a.479.479,0,0,0,0,.663.46.46,0,0,0,.663,0L18.22,3.9a.448.448,0,0,0,0-.652Zm0,0" transform="translate(19.871 25.287)"/></svg><svg id="Arrow_next_Hover" data-name="Arrow next Hover" xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58"><path id="Tracciato_11470" data-name="Tracciato 11470" d="M14.589.141a.46.46,0,0,0-.663,0,.473.473,0,0,0,0,.657l2.838,2.317H.464A.454.454,0,0,0,0,3.574a.467.467,0,0,0,.464.47h16.3L13.926,6.35a.479.479,0,0,0,0,.663.46.46,0,0,0,.663,0L18.22,3.9a.448.448,0,0,0,0-.652Zm0,0" transform="translate(19.871 25.287)" fill="#d50037"/></svg>';
			break;
		case 'quote':
			echo '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="61.697" height="41.227" viewBox="0 0 61.697 41.227"><defs><clipPath id="clip-path"><path id="Tracciato_11504" data-name="Tracciato 11504" d="M0,0H61.7V-41.227H0Z"/></clipPath></defs><g id="Raggruppa_10702" data-name="Raggruppa 10702" transform="translate(0 41.227)"><g id="Raggruppa_10698" data-name="Raggruppa 10698" clip-path="url(#clip-path)"><g id="Raggruppa_10697" data-name="Raggruppa 10697" transform="translate(57.617 -36.36)">	<path id="Tracciato_11503" data-name="Tracciato 11503" d="M0,0A13.721,13.721,0,0,0-11.094-4.867,13.338,13.338,0,0,0-20.041-2a9.47,9.47,0,0,0-3.364,7.587A8.991,8.991,0,0,0-20.9,12.239a8.806,8.806,0,0,0,6.514,2.505q7.011,0,7.014-8.016,5.583,3.294,5.583,11.166,0,12.882-16.319,16.748c-.765.192-1.145.525-1.145,1s.333.716,1,.716q5.581,0,12.167-3.865Q4.079,26.482,4.08,13.17,4.08,4.869,0,0M-34.212,0A13.722,13.722,0,0,0-45.306-4.867,13.338,13.338,0,0,0-54.253-2a9.467,9.467,0,0,0-3.364,7.587,9.05,9.05,0,0,0,2.505,6.585A8.678,8.678,0,0,0-48.6,14.744q7.012,0,7.014-8.016Q-36,10.022-36,17.894q0,12.882-16.319,16.748c-.765.192-1.145.525-1.145,1s.333.716,1,.716q5.583,0,12.168-3.865,10.163-6.013,10.163-19.325,0-8.3-4.079-13.17"/></g></g></g></svg>';
			break;
		case 'exclusion':
			echo '<svg xmlns="http://www.w3.org/2000/svg" width="1439.998" height="790.001" viewBox="0 0 1439.998 790.001"><path id="Esclusione_3" data-name="Esclusione 3" d="M17089,3135H15649V2345h1440v790h0v0Zm-278.5-155a41.368,41.368,0,1,0,16.156,3.261A41.219,41.219,0,0,0,16810.5,2980Zm-97.994,0a41.358,41.358,0,1,0,16.152,3.261A41.247,41.247,0,0,0,16712.5,2980Zm-98,0a41.367,41.367,0,1,0,16.154,3.261A41.245,41.245,0,0,0,16614.5,2980Zm-294,0a41.354,41.354,0,1,0,16.151,3.261A41.247,41.247,0,0,0,16320.5,2980Zm-294,0a41.367,41.367,0,1,0,16.155,3.261A41.234,41.234,0,0,0,16026.5,2980Zm882-92a41.382,41.382,0,1,0,16.156,3.261A41.251,41.251,0,0,0,16908.5,2888Zm-98,0a41.373,41.373,0,1,0,16.156,3.261A41.227,41.227,0,0,0,16810.5,2888Zm-97.994,0a41.364,41.364,0,1,0,16.152,3.261A41.256,41.256,0,0,0,16712.5,2888Zm-196,0a41.373,41.373,0,1,0,16.154,3.261A41.253,41.253,0,0,0,16516.5,2888Zm-294,0a41.373,41.373,0,1,0,16.154,3.261A41.263,41.263,0,0,0,16222.5,2888Zm686-94a41.379,41.379,0,1,0,16.156,3.261A41.235,41.235,0,0,0,16908.5,2794Zm-98,0a41.37,41.37,0,1,0,16.156,3.261A41.219,41.219,0,0,0,16810.5,2794Zm-97.994,0a41.361,41.361,0,1,0,16.152,3.261A41.247,41.247,0,0,0,16712.5,2794Zm-196,0a41.37,41.37,0,1,0,16.154,3.261A41.245,41.245,0,0,0,16516.5,2794Zm-98,0a41.37,41.37,0,1,0,16.156,3.261A41.221,41.221,0,0,0,16418.5,2794Zm-97.994,0a41.356,41.356,0,1,0,16.151,3.261A41.247,41.247,0,0,0,16320.5,2794Zm-98,0a41.37,41.37,0,1,0,16.154,3.261A41.247,41.247,0,0,0,16222.5,2794Zm-196,0a41.37,41.37,0,1,0,16.155,3.261A41.238,41.238,0,0,0,16026.5,2794Zm980-94a41.367,41.367,0,1,0,16.154,3.261A41.249,41.249,0,0,0,17006.5,2700Zm-98,0a41.386,41.386,0,1,0,16.156,3.261A41.247,41.247,0,0,0,16908.5,2700Zm-196,0a41.367,41.367,0,1,0,16.152,3.261A41.252,41.252,0,0,0,16712.5,2700Zm-98,0a41.377,41.377,0,1,0,16.154,3.261A41.249,41.249,0,0,0,16614.5,2700Zm-196,0a41.377,41.377,0,1,0,16.156,3.261A41.232,41.232,0,0,0,16418.5,2700Zm-97.994,0a41.363,41.363,0,1,0,16.151,3.261A41.255,41.255,0,0,0,16320.5,2700Zm-98,0a41.377,41.377,0,1,0,16.154,3.261A41.255,41.255,0,0,0,16222.5,2700Zm-98,0a41.377,41.377,0,1,0,16.154,3.261A41.238,41.238,0,0,0,16124.5,2700Zm882-94a41.362,41.362,0,1,0,16.154,3.261A41.253,41.253,0,0,0,17006.5,2606Zm-294,0a41.362,41.362,0,1,0,16.152,3.261A41.256,41.256,0,0,0,16712.5,2606Zm-98,0a41.372,41.372,0,1,0,16.154,3.261A41.253,41.253,0,0,0,16614.5,2606Zm-196,0a41.372,41.372,0,1,0,16.156,3.261A41.237,41.237,0,0,0,16418.5,2606Zm-97.994,0a41.358,41.358,0,1,0,16.151,3.261A41.263,41.263,0,0,0,16320.5,2606Zm-196.006,0a41.372,41.372,0,1,0,16.154,3.261A41.235,41.235,0,0,0,16124.5,2606Zm686-94a41.369,41.369,0,1,0,16.156,3.261A41.219,41.219,0,0,0,16810.5,2512Zm-392,0a41.369,41.369,0,1,0,16.156,3.261A41.221,41.221,0,0,0,16418.5,2512Zm-97.994,0a41.355,41.355,0,1,0,16.151,3.261A41.247,41.247,0,0,0,16320.5,2512Zm-196.006,0a41.369,41.369,0,1,0,16.154,3.261A41.227,41.227,0,0,0,16124.5,2512Zm882-94a41.364,41.364,0,1,0,16.154,3.261A41.253,41.253,0,0,0,17006.5,2418Zm-392,0a41.374,41.374,0,1,0,16.154,3.261A41.253,41.253,0,0,0,16614.5,2418Zm-98,0a41.374,41.374,0,1,0,16.154,3.261A41.253,41.253,0,0,0,16516.5,2418Z" transform="translate(-15649.002 -2344.999)" fill="#fff"/></svg>';
			break;
		case 'exclusion-dots':
			echo '<svg xmlns="http://www.w3.org/2000/svg" width="1439.998" height="790.001" viewBox="0 0 1439.998 790.001"><path id="Esclusione_3" data-name="Esclusione 3" d="M17089,3135H15649V2345h1440v790h0v0Zm-278.5-155a41.368,41.368,0,1,0,16.156,3.261A41.219,41.219,0,0,0,16810.5,2980Zm-97.994,0a41.358,41.358,0,1,0,16.152,3.261A41.247,41.247,0,0,0,16712.5,2980Zm-98,0a41.367,41.367,0,1,0,16.154,3.261A41.245,41.245,0,0,0,16614.5,2980Zm-294,0a41.354,41.354,0,1,0,16.151,3.261A41.247,41.247,0,0,0,16320.5,2980Zm-294,0a41.367,41.367,0,1,0,16.155,3.261A41.234,41.234,0,0,0,16026.5,2980Zm882-92a41.382,41.382,0,1,0,16.156,3.261A41.251,41.251,0,0,0,16908.5,2888Zm-98,0a41.373,41.373,0,1,0,16.156,3.261A41.227,41.227,0,0,0,16810.5,2888Zm-97.994,0a41.364,41.364,0,1,0,16.152,3.261A41.256,41.256,0,0,0,16712.5,2888Zm-196,0a41.373,41.373,0,1,0,16.154,3.261A41.253,41.253,0,0,0,16516.5,2888Zm-294,0a41.373,41.373,0,1,0,16.154,3.261A41.263,41.263,0,0,0,16222.5,2888Zm686-94a41.379,41.379,0,1,0,16.156,3.261A41.235,41.235,0,0,0,16908.5,2794Zm-98,0a41.37,41.37,0,1,0,16.156,3.261A41.219,41.219,0,0,0,16810.5,2794Zm-97.994,0a41.361,41.361,0,1,0,16.152,3.261A41.247,41.247,0,0,0,16712.5,2794Zm-196,0a41.37,41.37,0,1,0,16.154,3.261A41.245,41.245,0,0,0,16516.5,2794Zm-98,0a41.37,41.37,0,1,0,16.156,3.261A41.221,41.221,0,0,0,16418.5,2794Zm-97.994,0a41.356,41.356,0,1,0,16.151,3.261A41.247,41.247,0,0,0,16320.5,2794Zm-98,0a41.37,41.37,0,1,0,16.154,3.261A41.247,41.247,0,0,0,16222.5,2794Zm-196,0a41.37,41.37,0,1,0,16.155,3.261A41.238,41.238,0,0,0,16026.5,2794Zm980-94a41.367,41.367,0,1,0,16.154,3.261A41.249,41.249,0,0,0,17006.5,2700Zm-98,0a41.386,41.386,0,1,0,16.156,3.261A41.247,41.247,0,0,0,16908.5,2700Zm-196,0a41.367,41.367,0,1,0,16.152,3.261A41.252,41.252,0,0,0,16712.5,2700Zm-98,0a41.377,41.377,0,1,0,16.154,3.261A41.249,41.249,0,0,0,16614.5,2700Zm-196,0a41.377,41.377,0,1,0,16.156,3.261A41.232,41.232,0,0,0,16418.5,2700Zm-97.994,0a41.363,41.363,0,1,0,16.151,3.261A41.255,41.255,0,0,0,16320.5,2700Zm-98,0a41.377,41.377,0,1,0,16.154,3.261A41.255,41.255,0,0,0,16222.5,2700Zm-98,0a41.377,41.377,0,1,0,16.154,3.261A41.238,41.238,0,0,0,16124.5,2700Zm882-94a41.362,41.362,0,1,0,16.154,3.261A41.253,41.253,0,0,0,17006.5,2606Zm-294,0a41.362,41.362,0,1,0,16.152,3.261A41.256,41.256,0,0,0,16712.5,2606Zm-98,0a41.372,41.372,0,1,0,16.154,3.261A41.253,41.253,0,0,0,16614.5,2606Zm-196,0a41.372,41.372,0,1,0,16.156,3.261A41.237,41.237,0,0,0,16418.5,2606Zm-97.994,0a41.358,41.358,0,1,0,16.151,3.261A41.263,41.263,0,0,0,16320.5,2606Zm-196.006,0a41.372,41.372,0,1,0,16.154,3.261A41.235,41.235,0,0,0,16124.5,2606Zm686-94a41.369,41.369,0,1,0,16.156,3.261A41.219,41.219,0,0,0,16810.5,2512Zm-392,0a41.369,41.369,0,1,0,16.156,3.261A41.221,41.221,0,0,0,16418.5,2512Zm-97.994,0a41.355,41.355,0,1,0,16.151,3.261A41.247,41.247,0,0,0,16320.5,2512Zm-196.006,0a41.369,41.369,0,1,0,16.154,3.261A41.227,41.227,0,0,0,16124.5,2512Zm882-94a41.364,41.364,0,1,0,16.154,3.261A41.253,41.253,0,0,0,17006.5,2418Zm-392,0a41.374,41.374,0,1,0,16.154,3.261A41.253,41.253,0,0,0,16614.5,2418Zm-98,0a41.374,41.374,0,1,0,16.154,3.261A41.253,41.253,0,0,0,16516.5,2418Z" transform="translate(-15649.002 -2344.999)" fill="#D50037"/></svg>';
			break;
		case 'wedo_light':
			echo '<svg id="Raggruppa_10401" data-name="Raggruppa 10401" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="137.852" height="163.039" viewBox="0 0 137.852 163.039"><defs><clipPath id="clip-path"><rect id="Rettangolo_953" data-name="Rettangolo 953" width="137.852" height="163.039" fill="#fff"/></clipPath></defs><path id="Tracciato_11378" data-name="Tracciato 11378" d="M8.611,129.146V8.611H129.24V129.146ZM0,0V137.757H137.852V0Z" fill="#fff"/><path id="Tracciato_11379" data-name="Tracciato 11379" d="M175.976,213.06l-6.568-22.992h-6.68l-6.52,22.992-7.335-22.992H140.35l12.239,38.588h5.559l7.9-24.814,7.941,24.814h5.559l12.24-38.588H183.31Z" transform="translate(-121.282 -164.244)" fill="#fff"/><path id="Tracciato_11380" data-name="Tracciato 11380" d="M595.77,198.429v-8.361H560.131v38.588H595.77V220.3H568.545v-6.753h21.92v-8.361h-21.92v-6.753Z" transform="translate(-484.028 -164.244)" fill="#fff"/><g id="Raggruppa_10400" data-name="Raggruppa 10400"><g id="Raggruppa_10399" data-name="Raggruppa 10399" clip-path="url(#clip-path)"><path id="Tracciato_11381" data-name="Tracciato 11381" d="M220.725,540.888h-30.6v38.588h30.6a7.727,7.727,0,0,0,5.627-2.331,7.593,7.593,0,0,0,2.358-5.6V548.819a7.594,7.594,0,0,0-2.358-5.6,7.726,7.726,0,0,0-5.627-2.331m-.429,10.129v20.1H198.43V549.249H220.3Z" transform="translate(-164.292 -467.4)" fill="#fff"/><path id="Tracciato_11382" data-name="Tracciato 11382" d="M569.084,540.888H546.36a7.961,7.961,0,0,0-7.932,7.931v22.724a7.961,7.961,0,0,0,7.932,7.932h22.724a8.007,8.007,0,0,0,7.932-7.932V548.819a8.007,8.007,0,0,0-7.932-7.931m-.482,10.129v20.1H546.736V549.249H568.6Z" transform="translate(-465.274 -467.4)" fill="#fff"/><path id="Tracciato_11383" data-name="Tracciato 11383" d="M68.823,1092.9v-12.527H70.58v3.092h5.727a2.124,2.124,0,0,1,2.115,2.115v7.321H76.665v-7.077a.484.484,0,0,0-.6-.6H71.182a.484.484,0,0,0-.6.6v7.077Z" transform="translate(-59.472 -933.584)" fill="#fff"/><path id="Tracciato_11384" data-name="Tracciato 11384" d="M220.025,1112.561a2.11,2.11,0,0,1-2.115-2.115v-5.206a2.11,2.11,0,0,1,2.115-2.115h5.369a2.11,2.11,0,0,1,2.115,2.115v5.206a2.11,2.11,0,0,1-2.115,2.115Zm.244-1.757h4.881a.658.658,0,0,0,.471-.121.727.727,0,0,0,.114-.48v-4.718a.726.726,0,0,0-.114-.48.656.656,0,0,0-.471-.122h-4.881a.484.484,0,0,0-.6.6v4.718a.484.484,0,0,0,.6.6" transform="translate(-188.303 -953.248)" fill="#fff"/><path id="Tracciato_11385" data-name="Tracciato 11385" d="M369.706,1092.9a2.11,2.11,0,0,1-2.115-2.115v-10.412h1.757v10.169a.484.484,0,0,0,.6.6h1.513v1.757Z" transform="translate(-317.648 -933.584)" fill="#fff"/><path id="Tracciato_11386" data-name="Tracciato 11386" d="M475.086,1092.9a2.11,2.11,0,0,1-2.115-2.115v-5.206a2.11,2.11,0,0,1,2.115-2.115h5.727v-3.092h1.757V1092.9Zm.26-1.757h4.881a.658.658,0,0,0,.471-.121.73.73,0,0,0,.114-.48v-4.718a.729.729,0,0,0-.114-.48.656.656,0,0,0-.471-.122h-4.881a.484.484,0,0,0-.6.6v4.718a.484.484,0,0,0,.6.6" transform="translate(-408.71 -933.585)" fill="#fff"/><path id="Tracciato_11387" data-name="Tracciato 11387" d="M625.766,1080.369h1.758v1.757h-1.758Zm0,3.092h1.758v9.436h-1.758Z" transform="translate(-540.746 -933.584)" fill="#fff"/><path id="Tracciato_11388" data-name="Tracciato 11388" d="M721.919,1112.561v-9.436H729.4a2.111,2.111,0,0,1,2.115,2.115v7.321h-1.757v-7.077a.484.484,0,0,0-.6-.6h-4.882a.484.484,0,0,0-.6.6v7.077Z" transform="translate(-623.835 -953.248)" fill="#fff"/><path id="Tracciato_11389" data-name="Tracciato 11389" d="M874.344,1116.287v-1.774h5.581a.484.484,0,0,0,.6-.6v-1.351H874.8a2.111,2.111,0,0,1-2.116-2.115v-5.206a2.111,2.111,0,0,1,2.116-2.115h5.368a2.109,2.109,0,0,1,2.115,2.115v8.932a2.111,2.111,0,0,1-2.115,2.115Zm.7-5.483h4.881a.484.484,0,0,0,.6-.6v-4.718a.484.484,0,0,0-.6-.6h-4.881a.484.484,0,0,0-.6.6v4.718a.484.484,0,0,0,.6.6" transform="translate(-754.116 -953.248)" fill="#fff"/></g></g></svg>';
		  	break;
		case 'wedo_dark':
			  echo '<svg id="Raggruppa_10401" data-name="Raggruppa 10401" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="137.852" height="163.039" viewBox="0 0 137.852 163.039"><defs><clipPath id="clip-path"><rect id="Rettangolo_953" data-name="Rettangolo 953" width="137.852" height="163.039" fill="#000"/></clipPath></defs><path id="Tracciato_11378" data-name="Tracciato 11378" d="M8.611,129.146V8.611H129.24V129.146ZM0,0V137.757H137.852V0Z" fill="#000"/><path id="Tracciato_11379" data-name="Tracciato 11379" d="M175.976,213.06l-6.568-22.992h-6.68l-6.52,22.992-7.335-22.992H140.35l12.239,38.588h5.559l7.9-24.814,7.941,24.814h5.559l12.24-38.588H183.31Z" transform="translate(-121.282 -164.244)" fill="#000"/><path id="Tracciato_11380" data-name="Tracciato 11380" d="M595.77,198.429v-8.361H560.131v38.588H595.77V220.3H568.545v-6.753h21.92v-8.361h-21.92v-6.753Z" transform="translate(-484.028 -164.244)" fill="#000"/><g id="Raggruppa_10400" data-name="Raggruppa 10400"><g id="Raggruppa_10399" data-name="Raggruppa 10399" clip-path="url(#clip-path)"><path id="Tracciato_11381" data-name="Tracciato 11381" d="M220.725,540.888h-30.6v38.588h30.6a7.727,7.727,0,0,0,5.627-2.331,7.593,7.593,0,0,0,2.358-5.6V548.819a7.594,7.594,0,0,0-2.358-5.6,7.726,7.726,0,0,0-5.627-2.331m-.429,10.129v20.1H198.43V549.249H220.3Z" transform="translate(-164.292 -467.4)" fill="#000"/><path id="Tracciato_11382" data-name="Tracciato 11382" d="M569.084,540.888H546.36a7.961,7.961,0,0,0-7.932,7.931v22.724a7.961,7.961,0,0,0,7.932,7.932h22.724a8.007,8.007,0,0,0,7.932-7.932V548.819a8.007,8.007,0,0,0-7.932-7.931m-.482,10.129v20.1H546.736V549.249H568.6Z" transform="translate(-465.274 -467.4)" fill="#000"/><path id="Tracciato_11383" data-name="Tracciato 11383" d="M68.823,1092.9v-12.527H70.58v3.092h5.727a2.124,2.124,0,0,1,2.115,2.115v7.321H76.665v-7.077a.484.484,0,0,0-.6-.6H71.182a.484.484,0,0,0-.6.6v7.077Z" transform="translate(-59.472 -933.584)" fill="#000"/><path id="Tracciato_11384" data-name="Tracciato 11384" d="M220.025,1112.561a2.11,2.11,0,0,1-2.115-2.115v-5.206a2.11,2.11,0,0,1,2.115-2.115h5.369a2.11,2.11,0,0,1,2.115,2.115v5.206a2.11,2.11,0,0,1-2.115,2.115Zm.244-1.757h4.881a.658.658,0,0,0,.471-.121.727.727,0,0,0,.114-.48v-4.718a.726.726,0,0,0-.114-.48.656.656,0,0,0-.471-.122h-4.881a.484.484,0,0,0-.6.6v4.718a.484.484,0,0,0,.6.6" transform="translate(-188.303 -953.248)" fill="#000"/><path id="Tracciato_11385" data-name="Tracciato 11385" d="M369.706,1092.9a2.11,2.11,0,0,1-2.115-2.115v-10.412h1.757v10.169a.484.484,0,0,0,.6.6h1.513v1.757Z" transform="translate(-317.648 -933.584)" fill="#000"/><path id="Tracciato_11386" data-name="Tracciato 11386" d="M475.086,1092.9a2.11,2.11,0,0,1-2.115-2.115v-5.206a2.11,2.11,0,0,1,2.115-2.115h5.727v-3.092h1.757V1092.9Zm.26-1.757h4.881a.658.658,0,0,0,.471-.121.73.73,0,0,0,.114-.48v-4.718a.729.729,0,0,0-.114-.48.656.656,0,0,0-.471-.122h-4.881a.484.484,0,0,0-.6.6v4.718a.484.484,0,0,0,.6.6" transform="translate(-408.71 -933.585)" fill="#000"/><path id="Tracciato_11387" data-name="Tracciato 11387" d="M625.766,1080.369h1.758v1.757h-1.758Zm0,3.092h1.758v9.436h-1.758Z" transform="translate(-540.746 -933.584)" fill="#000"/><path id="Tracciato_11388" data-name="Tracciato 11388" d="M721.919,1112.561v-9.436H729.4a2.111,2.111,0,0,1,2.115,2.115v7.321h-1.757v-7.077a.484.484,0,0,0-.6-.6h-4.882a.484.484,0,0,0-.6.6v7.077Z" transform="translate(-623.835 -953.248)" fill="#000"/><path id="Tracciato_11389" data-name="Tracciato 11389" d="M874.344,1116.287v-1.774h5.581a.484.484,0,0,0,.6-.6v-1.351H874.8a2.111,2.111,0,0,1-2.116-2.115v-5.206a2.111,2.111,0,0,1,2.116-2.115h5.368a2.109,2.109,0,0,1,2.115,2.115v8.932a2.111,2.111,0,0,1-2.115,2.115Zm.7-5.483h4.881a.484.484,0,0,0,.6-.6v-4.718a.484.484,0,0,0-.6-.6h-4.881a.484.484,0,0,0-.6.6v4.718a.484.484,0,0,0,.6.6" transform="translate(-754.116 -953.248)" fill="#000"/></g></g></svg>';
			break;
		case 'stop':
			echo '<svg id="Componente_28_1" data-name="Componente 28 – 1" xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58"><g id="Raggruppa_10212" data-name="Raggruppa 10212" transform="translate(-1034.074 -6332.506)"><path id="Tracciato_11284" data-name="Tracciato 11284" d="M-14514.427,4003.369v9.011" transform="translate(15574 2353.631)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="4"/><path id="Tracciato_11285" data-name="Tracciato 11285" d="M-14514.427,4003.369v9.011" transform="translate(15581.501 2353.631)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="4"/></g><g id="Ellisse_44" data-name="Ellisse 44" fill="none" stroke="#fff" stroke-width="1"><circle cx="29" cy="29" r="29" stroke="none"/><circle cx="29" cy="29" r="28.5" fill="none"/></g></svg>';
		  	break;
		case 'play':
			echo '<svg id="Componente_29_1" data-name="Componente 29 – 1" xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58"><g id="Ellisse_45" data-name="Ellisse 45" fill="none" stroke="#fff" stroke-width="1"><circle cx="29" cy="29" r="29" stroke="none"/><circle cx="29" cy="29" r="28.5" fill="none"/></g><path id="Tracciato_11581" data-name="Tracciato 11581" d="M0,0,7.608,10.873,15.339,0Z" transform="translate(24 36.669) rotate(-90)" fill="#fff"/></svg>';
		  	break;

	}
}
