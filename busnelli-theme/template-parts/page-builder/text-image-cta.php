<section class="brand-platform--text-image-cta <?php the_sub_field('style') ?>" fade>
	<div class="container">
		<div class="row">
			<?php if (get_sub_field('text') != '' ) : ?>
				<div class="col-12 col-sm-6" fade left>
					<div class="text">
						<?php the_sub_field('text') ?>
					</div>
				</div>
			<?php endif; ?>

			<?php
			$image = get_sub_field('image');
			if( $image ) : ?>

				<div class="col-12 col-sm-6" fade right>
					<div class="image">
						<div>
							<?php echo wp_get_attachment_image( $image, 'medium', false, array(
								'class' => 'h-auto'
							) ); ?>
						</div>
					</div>
				</div>
			<?php endif; ?>


			<?php
			$link = get_sub_field('cta');
			if( $link ):
				$link_url = $link['url'];
				$link_title = $link['title'];
				$link_target = $link['target'] ? $link['target'] : '_self';
				if ($link_title != '') : ?>
					<div class="col-12">
						<div class="cta" fade>
							<div>
								<div class="cta <?php if (get_sub_field('style') == 'background-oil') echo 'dark'; ?>">
									<a href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ); ?>">
										<div class="cta--wrapper">
											<div class="cta--content">
												<?php echo $link_title; ?>
											</div>
										</div>
									</a>
								</div>
							</div>
						</div>
					</div>
				<?php endif;
			endif; ?>

		</div>
	</div>
</section>
