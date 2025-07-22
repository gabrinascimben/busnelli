<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Websolute_Starter_Theme
 */

get_header();
?>

<main class="page">
	<?php if (have_rows('modules')) :
		while (have_rows('modules')) :
			the_row();
			get_template_part('template-parts/page-builder/' . get_row_layout());
		endwhile;
	endif; ?>
</main>
<?php
get_footer();
