<?php
// Secondary menu
$menu_id = get_term(get_nav_menu_locations()['secondary'], 'nav_menu')->term_id;
$menu_items = wp_get_nav_menu_items($menu_id);
// Build the menu with a custom HTML structure
if ( $menu_items) :
	$menu_list  = '<div class="menu--secondary">' ."\n";
	$count = 0;
	foreach ( $menu_items as $menu_item ) :

		$link = esc_url($menu_item->url);
		// Allow only inline HTML
		// @see https://developer.wordpress.org/reference/functions/wp_kses_allowed_html/#comment-3860
		$title = wp_kses($menu_item->title, 'data');

		// Parent item only
		if ( !$menu_item->menu_item_parent ) :

			$menu_list .= '<a href="'.$link.'" class="menu--secondary--item">'.$title.'</a>' ."\n";

		endif;


		$count++;
	endforeach;
	$menu_list .= '</div>' ."\n";

	echo $menu_list;
endif; ?>
