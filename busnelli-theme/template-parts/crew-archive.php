<?php


$args = array(
	'posts_per_page' => -1,
	'post_type' => 'designer',
	'post_status' => 'publish',
	'orderby' => 'menu_order',
	'order' => 'ASC'
);
$designers = new WP_Query( $args );
if ( $designers->have_posts() ) : ?>
	<section class="crew--designers" fade up>
		<div class="container">
			<div class="crew--designers--slider">
				<div class="swiper-wrapper">
					<?php while ( $designers->have_posts() ) : $designers->the_post();
						if (get_field('visibility') !== false) : ?>
							<a href="<?php the_permalink() ?>" class="swiper-slide crew--designers--slide">
								<div class="crew--designers--wrapper">
									<div class="crew--designers--single">
										<?php if (has_post_thumbnail()) :
											the_post_thumbnail('thumbnail', array(
												'class' => 'h-auto'
											));
										endif; ?>
									</div>
									<div class="crew--designers--name"><?php the_title() ?></div>
								</div>
							</a>
						<?php endif;
					endwhile; ?>
				</div>
			</div>
			<div class="swiper--default--nav">
				<div class="crew--designers--prev">
					<div class="icon--arrow-prev">
						<?php websolute_svg('prev') ?>
					</div>
				</div>
				<div class="crew--designers--next">
					<div class="icon--arrow-next">
						<?php websolute_svg('next') ?>
					</div>
				</div>
			</div>
		</div>
	</section>
<?php
endif;
wp_reset_postdata();
?>
