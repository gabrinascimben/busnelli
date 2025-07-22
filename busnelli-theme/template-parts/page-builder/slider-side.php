<?php
// Get these 2 variables from outside the "have_rows" below
$style = get_sub_field('style');
$alignment = get_sub_field('alignment');

if (have_rows('slides')) : ?>
	<section class="slider-side <?php echo $style ?> <?php echo $alignment ?>">
		<div class="swiper-wrapper">
			<?php while (have_rows('slides')) : the_row(); ?>
				<div class="swiper-slide">
					<div class="container">
						<div class="swiper-slide--left" fade left>
							<div class="swiper-slide--image">
								<?php
								$image = get_sub_field('image');
								if( $image ) :
									echo wp_get_attachment_image( $image, 'medium' );
								endif; ?>
							</div>
						</div>
						<div class="swiper-slide--right" fade right>
							<div class="swiper-slide--text">
								<?php the_sub_field('text'); ?>
							</div>
						</div>
					</div>
				</div>
			<?php endwhile; ?>
		</div>
		<?php if ( count(get_sub_field('slides')) > 1) : ?>
			<div class="swiper--default--nav slider-side--nav" fade up fire>
				<div class="slider-side--prev">
					<div class="icon--arrow-prev">
						<?php websolute_svg('arrow_prev') ?>
					</div>
						</div>
						<div class="slider-side--next">
					<div class="icon--arrow-next">
						<?php websolute_svg('arrow_next') ?>
					</div>
				</div>
			</div>
		<?php endif; ?>
	</section>
<?php endif; ?>
