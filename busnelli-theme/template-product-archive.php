<?php
/**
 * Template Name: Archivio Prodotti
 *
 * Products archive page
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Websolute_Starter_Theme
 */

get_header();
?>
<?php get_template_part('template-parts/products', 'filters') ?>
<main class="page">
	<?php get_template_part('template-parts/products', 'archive') ?>
</main>
<?php
get_footer();
