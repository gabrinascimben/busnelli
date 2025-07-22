<section class="homepage--parallax">
	<?php
	$image = get_sub_field('image');
	if ( $image ) : ?>
		<div class="homepage--parallax--backdrop">
			<?php echo wp_get_attachment_image( $image, 'full', false, array(
				'class' => 'h-auto homepage--parallax--backdrop--image'
			) ); ?>
		</div>
	<?php endif; ?>

	<?php if ( get_sub_field('vertical')  != '' ) : ?>
		<div class="homepage--parallax--vertical">
			<div><?php the_sub_field('vertical') ?></div>
		</div>
	<?php endif; ?>
</section>
