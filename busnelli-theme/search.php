<?php
/**
 * The search result template file
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Websolute_Starter_Theme
 */

get_header();
?>
<main class="page">
	<section class="section--hero" fade>
		<div class="container-fluid">
			<div class="section--hero--top">
			<?php _e('You are searching for', 'busnelli') ?>
			"<?php echo get_search_query() ?>"
			</div>
		</div>
	</section>
	<section class="section--results" fade>
		<div class="container">
			<div class="row">
				<div class="col-12">
					<?php if (have_posts()) : ?>
						<?php while (have_posts()) : the_post(); ?>
							<a class="block" href="<?php the_permalink() ?>">
								<div class="section--results--item">
									<div class="name"><?php the_title() ?></div>
									<div class="category">
										<?php if( get_post_type() == 'post') :
											echo strip_tags(get_the_category_list());
										else :
											echo yoast_get_primary_term( 'product-categories' );
										endif;
										?>
									</div>
								</div>
							</a>
						<?php endwhile; ?>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</section>
</main>
<?php
get_footer();
