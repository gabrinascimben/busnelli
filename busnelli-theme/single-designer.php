<?php
/**
 * Single Designer template
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Websolute_Starter_Theme
 */

get_header();
?>

<main class="page">
	<?php
	// Designer hero
	get_template_part('template-parts/designer', 'hero');

	// Designer content
	if (have_rows('modules_modules')) :
		while (have_rows('modules_modules')) :
			the_row();
			get_template_part('template-parts/page-builder/' . get_row_layout());
		endwhile;
	endif;

	// Products by the Designer
	get_template_part('template-parts/designer', 'products'); ?>
</main>
<?php
get_footer();
