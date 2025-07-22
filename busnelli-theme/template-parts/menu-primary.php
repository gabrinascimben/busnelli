<?php
// Primary menu
$menu_id = get_term(get_nav_menu_locations()['primary'], 'nav_menu')->term_id;
$menu_items = wp_get_nav_menu_items($menu_id);
// Build the menu with a custom HTML structure
if ( $menu_items) :
	$menu_list  = '<div class="menu--primary">' ."\n";

	$count = 0;
	$submenu = false;
	$submenu_count = 0;
	$parent_id = null;
	foreach ( $menu_items as $menu_item ) :

		$link = esc_url($menu_item->url);
		// Allow only inline HTML
		// @see https://developer.wordpress.org/reference/functions/wp_kses_allowed_html/#comment-3860
		$title = wp_kses($menu_item->title, 'data');

		// Parent item
		if ( !$menu_item->menu_item_parent ) :
			$parent_id = $menu_item->ID;

			$data_toggle = '';

			// Check if it has children
			foreach ( $menu_items as $menu_item ) :
				if ( $parent_id == $menu_item->menu_item_parent ) :
					$data_toggle = 'data-toggle="data-content-'.$submenu_count.'"';
					break;
				endif;
			endforeach;


			$menu_list .= '<div class="menu--primary--item">' ."\n";
			$menu_list .= '<a href="'.$link.'" class="menu--primary--item--title" ' . $data_toggle . '>'.$title.'</a>' ."\n";


		// Submenu item
		elseif ( $parent_id == $menu_item->menu_item_parent ) :

			// Open submenu
			if ( !$submenu ) :
				$submenu = true;
				$menu_list .= '<div class="menu--primary--item--content" data-content="data-content-'.$submenu_count.'">' ."\n";
				$submenu_count++;
			endif;

			$menu_list .= '<a href="'.$link.'" class="menu--secondary--item">'.$title.'</a>' ."\n";

			// Close submenu
			if ( isset($menu_items[ $count + 1 ]) && $menu_items[ $count + 1 ]->menu_item_parent != $parent_id && $submenu ) :
				$menu_list .= '</div>' ."\n";
				$submenu = false;
			endif;

		endif;

		// Close item
		if ( isset($menu_items[ $count + 1 ]) && $menu_items[ $count + 1 ]->menu_item_parent != $parent_id ) :
			$menu_list .= '</div>' ."\n";
			$submenu = false;
		endif;

		$count++;
	endforeach;
	$menu_list .= '</div>' ."\n";
	$menu_list .= '</div>' ."\n";

	echo $menu_list;
endif;
?>
