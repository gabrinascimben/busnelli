<?php
/**
 * Single Product template
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Websolute_Starter_Theme
 */

get_header();
?>

<main class="page">
	<?php
	// Product hero
	get_template_part('template-parts/product', 'hero');

	// Product content
	if (have_rows('modules_modules')) :
		while (have_rows('modules_modules')) :
			the_row();
			get_template_part('template-parts/page-builder/' . get_row_layout());
		endwhile;
	endif;

	// Product Designer
	get_template_part('template-parts/product', 'designer');

	// Product Details
	get_template_part('template-parts/product', 'details');

	// Product Catalogue
	get_template_part('template-parts/product', 'catalogue'); ?>
</main>

<?php
get_footer();
