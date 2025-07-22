<section class="section-8 background-white">
	<div class="image-full">
		<?php
		$image = get_sub_field('image');
		if ( $image ) :
			echo wp_get_attachment_image( $image, 'full', false, array(
				'class' => 'h-auto'
			) );
		endif; ?>
	</div>
	<div class="container-fluid">
		<span></span>
		<span><?php the_sub_field('text_center') ?></span>
		<span><?php the_sub_field('text_right') ?></span>
	</div>
</section>
