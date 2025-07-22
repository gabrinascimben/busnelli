<?php
/**
 * The Blog template
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Websolute_Starter_Theme
 */

get_header();
?>

<main class="page">
	<?php
	// The blog hero
	get_template_part('template-parts/blog', 'hero');
	// The posts archive
	get_template_part('template-parts/blog', 'archive');
	// Category filters
	get_template_part('template-parts/blog', 'filters');
	// Newsletter subscription form
	get_template_part('template-parts/newsletter');
	?>
</main>

<?php
get_footer();
