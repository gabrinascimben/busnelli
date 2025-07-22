<section class="half-image">
	<div class="half-image--backdrop" fade left>
		<?php
		$image = get_sub_field('image');
		if( $image ) :
			echo wp_get_attachment_image( $image, 'full' );
		endif; ?>
	</div>
	<div class="half-image--container" fade right>
		<div class="half-image--text">
			<?php the_sub_field('text') ?>

			<?php $link = get_sub_field('cta');
			if( $link ):
				$link_url = $link['url'];
				$link_title = $link['title'];
				$link_target = $link['target'] ? $link['target'] : '_self';
				if ($link_title != '') : ?>
					<div class="half-image--cta">
						<a href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ); ?>">
							<div class="cta ">
								<div class="cta--wrapper">
									<div class="cta--content">
										<?php echo $link_title; ?>
									</div>
								</div>
							</div>
						</a>
					</div>
				<?php endif;
			endif; ?>
		</div>
	</div>
</section>
