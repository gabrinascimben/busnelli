<?php
$layout = get_sub_field('layout');

if ($layout != 'homepage' && $layout != 'brand-platform') $layout_class = '';
else $layout_class = $layout . '--';
?>


<section class="<?php echo $layout_class ?>text-image <?php the_sub_field('style') ?> <?php
				if ($layout == 'brand-platform') the_sub_field('alignment'); ?> <?php
				if ($layout == 'section-2' || $layout == 'section-6' || $layout == 'section-12') echo $layout; ?>" <?php
				if ($layout == 'brand-platform') echo 'fade' ?>>

	<?php
	if ( $layout == 'brand-platform') :
		// Brand platform style

		$image = get_sub_field('image');
		if( $image ) : ?>
			<div class="brand-platform--text-image--backdrop">
				<?php echo wp_get_attachment_image( $image, 'full', false, array(
					'fade' => '',
					'left' => '',
					'class' => 'h-auto'
				) ); ?>
				<div class="foreground<?php if (get_sub_field('alignment') == 'right') echo '-invert'; ?>"></div>
			</div>
		<?php endif; ?>

		<div class="container">
			<?php if (get_sub_field('text_1') != '') : ?>
				<div class="brand-platform--text-image--text">
					<div fade left>
						<?php the_sub_field('text_1'); ?>
					</div>
				</div>
			<?php endif; ?>

			<?php if (get_sub_field('text_2') != '') : ?>
				<div class="brand-platform--text-image--text">
					<div fade up>
						<?php the_sub_field('text_2'); ?>
					</div>
				</div>
			<?php endif; ?>
		</div>


	<?php elseif ( $layout == 'section-2') :
		// Triple image layout ?>
		<?php
		$image = get_sub_field('image_1');
		if( $image ) : ?>
			<div class="container-fluid">
				<?php echo wp_get_attachment_image( $image, 'medium', false, array(
					'fade' => '',
					'class' => 'h-auto'
				) ); ?>
			</div>
		<?php endif; ?>

		<div class="container">
			<?php if (get_sub_field('text_1') != '') : ?>
				<div class="text-image--text">
					<div fade left>
						<?php the_sub_field('text_1'); ?>
					</div>
				</div>
			<?php endif; ?>

			<?php if (get_sub_field('text_2') != '') : ?>
				<div class="text-image--text">
					<div fade left>
						<?php the_sub_field('text_2'); ?>
					</div>
				</div>
			<?php endif; ?>

			<?php
			$image = get_sub_field('image_2');
			if( $image ) : ?>
				<div class="text-image--image large">
					<?php echo wp_get_attachment_image( $image, 'medium', false, array(
						'fade' => '',
						'class' => 'h-auto'
					) ); ?>
				</div>
			<?php endif; ?>
		</div>

		<?php
		$image = get_sub_field('image_3');
		if( $image ) : ?>
			<div class="bottom">
				<?php echo wp_get_attachment_image( $image, 'medium', false, array(
					'fade' => '',
					'class' => 'h-auto'
				) ); ?>
			</div>
		<?php endif; ?>


	<?php elseif ( $layout == 'section-6') :
		// Two image alternative layout ?>


		<div class="container">
			<?php if (get_sub_field('text_1') != '') : ?>
				<div class="text-image--text">
					<div fade left>
						<?php the_sub_field('text_1'); ?>
					</div>
				</div>
			<?php endif; ?>

			<?php if (get_sub_field('text_2') != '') : ?>
				<div class="text-image--text">
					<div fade left>
						<?php the_sub_field('text_2'); ?>
					</div>
				</div>
			<?php endif; ?>
		</div>

		<?php
		$image = get_sub_field('image_1');
		if( $image ) : ?>
			<div class="bottom-left">
				<?php echo wp_get_attachment_image( $image, 'medium', false, array(
					'fade' => '',
					'class' => 'h-auto'
				) ); ?>
			</div>
		<?php endif; ?>
		<?php
		$image = get_sub_field('image_2');
		if( $image ) : ?>
			<div class="bottom">
				<?php echo wp_get_attachment_image( $image, 'medium', false, array(
					'fade' => '',
					'class' => 'h-auto'
				) ); ?>
			</div>
		<?php endif; ?>


	<?php else :
		// Default and Homepage layout ?>
		<div class="container">
			<?php if ( get_sub_field('text_1') != '' || get_sub_field('title') != '' ) : ?>
				<div class="text-image--text">
					<div fade left>
						<?php if ( get_sub_field('title') != '' ) : ?>
							<h2 class="txt-underline-uppercase">
								<?php the_sub_field('title') ?>
							</h2>
						<?php endif; ?>
						<?php the_sub_field('text_1'); ?>
					</div>
				</div>
			<?php endif; ?>

			<?php if (get_sub_field('text_2') != '' || get_sub_field('cta')) : ?>
				<div class="text-image--text">
					<div fade up>
						<?php the_sub_field('text_2'); ?>
					</div>
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
			<?php endif; ?>

			<?php
			$image = get_sub_field('image_1');
			if( $image ) : ?>
				<div class="text-image--image">
					<?php echo wp_get_attachment_image( $image, 'medium', false, array(
						'fade' => '',
						'left' => '',
						'class' => 'h-auto'
					) ); ?>
				</div>
			<?php endif; ?>


			<?php
			$image = get_sub_field('image_2');
			if( $image ) : ?>
				<div class="text-image--image">
					<?php echo wp_get_attachment_image( $image, 'medium', false, array(
						'fade' => '',
						'right' => '',
						'class' => 'h-auto'
					) ); ?>
				</div>
			<?php endif; ?>
		</div>


		<?php if ( get_sub_field('vertical')  != '' ) : ?>
			<div class="homepage--text-image--vertical">
				<div fade><?php the_sub_field('vertical') ?></div>
			</div>
		<?php endif; ?>
	<?php endif ?>
</section>
