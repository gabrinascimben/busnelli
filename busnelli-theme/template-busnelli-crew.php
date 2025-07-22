<?php
/**
 * Template Name: Busnelli Crew
 *
 * Designers archive page
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Websolute_Starter_Theme
 */

get_header();
?>

<main class="page">
	<?php
	get_template_part('template-parts/crew', 'hero');
	get_template_part('template-parts/crew', 'archive');
	?>
</main>
<?php
get_footer();
