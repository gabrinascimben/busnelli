<?php
$images = get_sub_field('images');
if ($images) : ?>
	<section class="section--multiple-slider">
		<div class="container-fluid" fade>
			<div class="swiper--multiple">
				<div class="swiper-wrapper">
					<?php foreach ($images as $image) : ?>
						<div class="swiper-slide h-auto">
							<?php echo wp_get_attachment_image( $image, 'medium_large' ); ?>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
			<div class="swiper--default--nav" fade up fire>
				<div class="section--multiple-slider--prev">
					<div class="icon--arrow-prev">
						<?php websolute_svg('prev') ?>
					</div>
				</div>
				<div class="section--multiple-slider--next">
					<div class="icon--arrow-next">
						<?php websolute_svg('next') ?>
					</div>
				</div>
			</div>
		</div>
	</section>
<?php endif; ?>
