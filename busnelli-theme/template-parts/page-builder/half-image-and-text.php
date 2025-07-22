<section class="half-image-and-text <?php the_sub_field('style') ?>">
	<div class="container">
		<?php if (get_sub_field('title') != '') : ?>
			<h2 class="half-image-and-text--name" fade left>
				<?php the_sub_field('title') ?>
			</h2>
		<?php endif; ?>

		<?php
		$image = get_sub_field('image');
		if( $image ) : ?>
			<div class="half-image-and-text--image" fade right>
				<?php echo wp_get_attachment_image( $image, 'medium', false, array(
					'class' => 'h-auto'
				) ); ?>
			</div>
		<?php endif; ?>

		<?php if (get_sub_field('text') != '') : ?>
			<div class="half-image-and-text--text" fade left>
				<?php the_sub_field('text') ?>
			</div>
		<?php endif; ?>

		<?php $link = get_sub_field('cta');
		if( $link ):
			$link_url = $link['url'];
			$link_title = $link['title'];
			$link_target = $link['target'] ? $link['target'] : '_self';
			if ($link_title != '') : ?>
				<div class="half-image-and-text--cta">
					<a href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ); ?>">
						<div class="cta <?php the_sub_field('style') ?>">
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
</section>
