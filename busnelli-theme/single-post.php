<?php
/**
 * Single Post template
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Websolute_Starter_Theme
 */

get_header();
?>

<main class="page">
	<?php
	// Post hero
	get_template_part('template-parts/post', 'hero'); ?>


	<?php
	// Post content
	if (have_rows('modules_modules')) : ?>
		<div class="background-white">
			<?php while (have_rows('modules_modules')) :
				the_row();
				get_template_part('template-parts/page-builder/' . get_row_layout());
			endwhile; ?>
		</div>
	<?php endif;

	// Newsletter subscription form
	get_template_part('template-parts/newsletter'); ?>
</main>

<?php
get_footer();
