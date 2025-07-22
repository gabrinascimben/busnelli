<section class="homepage--timeless">
	<div class="row">
		<div class="col-12 col-md-6">
			<div class="homepage--timeless--image">
				<?php
				$image = get_sub_field('image');
				if ( $image ) : ?>
					<div class="homepage--timeless--image--background">
						<?php echo wp_get_attachment_image( $image, 'full', false, array(
							'class' => 'h-auto'
						) ); ?>
					</div>
				<?php endif; ?>

				<?php
				$svg = get_sub_field('svg');
				if ( $svg ) : ?>
					<div class="homepage--timeless--image--foreground">
						<?php echo wp_get_attachment_image( $svg, 'full', false, array(
							'class' => 'h-auto'
						) ); ?>
					</div>
				<?php endif; ?>
			</div>
		</div>


		<div class="col-10 offset-2 col-md-6 offset-md-0" fade right>
			<div class="homepage--timeless--content">
				<div class="container-fluid">
					<?php if ( get_sub_field('text')  != '' ) : ?>
						<p><?php the_sub_field('text') ?></p>
					<?php endif; ?>

					<?php
					$link = get_sub_field('cta');
					if( $link ):
						$link_url = $link['url'];
						$link_title = $link['title'];
						$link_target = $link['target'] ? $link['target'] : '_self';
						if ($link_title != '') : ?>
							<a href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ); ?>">
								<div class="cta ">
									<div class="cta--wrapper">
										<div class="cta--content">
											<?php echo $link_title; ?>
										</div>
									</div>
								</div>
							</a>
						<?php endif;
					endif; ?>

				</div>
			</div>
		</div>
		<?php if ( get_sub_field('vertical')  != '' ) : ?>
			<div class="homepage--timeless--vertical" fade up fire>
				<div><?php the_sub_field('vertical') ?></div>
			</div>
		<?php endif; ?>
	</div>
</section>
