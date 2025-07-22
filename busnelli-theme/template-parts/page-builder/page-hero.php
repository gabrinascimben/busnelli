<?php
$layout = get_sub_field('layout');
$type = get_sub_field('type');
?>

<section class="<?php echo $layout ?>--hero">
	<?php
	// Layout Storia
	if ($layout == 'storia' || $layout == 'articolo') :

		// Background
		$image = get_sub_field('image');
		if ( $image ) : ?>
			<div class="<?php echo $layout?>--hero--backdrop" fade fire>
				<?php echo wp_get_attachment_image( $image, 'full', false, array(
					'class' => 'h-auto'
				) ); ?>
			</div>
		<?php endif; ?>

		<?php
		// Title
		if (have_rows('title')) : ?>
			<div class="container-fluid">
				<div class="<?php echo $layout?>--hero--top">
					<div class="<?php echo $layout?>--hero--title">
						<?php while (have_rows('title')) : the_row(); ?>
							<span class="<?php the_sub_field('color') ?>" split><?php the_sub_field('segment') ?></span>
							<?php if (get_sub_field('new_line')) echo '<span><br></span>'; ?>
						<?php endwhile; ?>
					</div>
				</div>
			</div>
		<?php endif; ?>

	<?php elseif ($layout == 'homepage') :
		// Homepage layout

		// Title
		if (have_rows('title')) : ?>
				<div class="container">
					<h2 class="homepage--hero--title">
						<?php while (have_rows('title')) : the_row(); ?>
							<span class="<?php the_sub_field('color') ?>" split><?php the_sub_field('segment') ?></span>
							<?php if (get_sub_field('new_line')) echo '<span><br></span>'; ?>
						<?php endwhile; ?>
					</h2>
				</div>
			</section>
		<?php endif; ?>

		<section class="homepage--dots--white">
			<div class="homepage--dots--white--wrapper">
				<div class="homepage--dots--white--background">
					<div class="homepage--dots--white--embed" fade up>
						<?php if ($type == 'image') : ?>
							<?php echo wp_get_attachment_image( $image, 'full', false, array(
								'class' => 'h-auto'
							) ); ?>
							<?php
							// Homepage style: CTA
							$link = get_sub_field('cta');
							if( $link ) :
								$link_url = $link['url'];
								$link_title = $link['title'];
								$link_target = $link['target'] ? $link['target'] : '_self';
								if ($link_title != '') : ?>
									<div class="container">
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
						<?php else : ?>
							<iframe class="homepage--dots--white--iframe" src="https://player.vimeo.com/video/<?php the_sub_field('id_video') ?>?background=1" frameborder="0" allow="autoplay" allowfullscreen playsinline muted></iframe>
							<script src="https://player.vimeo.com/api/player.js"></script>
							<div class="controls">
								<div class="pause">
									<?php websolute_svg('stop'); ?>
								</div>
								<div class="play">
									<?php websolute_svg('play'); ?>
								</div>
							</div>
						<?php endif; ?>

					</div>
				</div>
				<div class="homepage--dots--white--exclusion">
					<div class="homepage--dots--white--exclusion--image">
						<img src="<?php echo get_stylesheet_directory_uri() ?>/images/dots-white.svg" />
					</div>
				</div>
				<div class="homepage--dots--white--foreground"></div>
			</div>
		</section>


	<?php else :
		// Other layouts

		// Title
		if (have_rows('title')) : ?>
			<div class="container">
				<div class="<?php echo $layout ?>--hero--title">
					<?php while (have_rows('title')) : the_row(); ?>
						<span class="<?php the_sub_field('color') ?>" split><?php the_sub_field('segment') ?></span>
						<?php if (get_sub_field('new_line')) echo '<span><br></span>'; ?>
					<?php endwhile; ?>
				</div>
			</div>
		<?php endif; ?>

		<div class="<?php echo $layout ?>--hero--content" fade up>

			<?php
			// Background
			$image = get_sub_field('image');
			if ( $image ) : ?>
				<div class="<?php echo $layout ?>--hero--image">
					<?php echo wp_get_attachment_image( $image, 'full', false, array(
						'class' => 'h-auto'
					) ); ?>
				</div>
			<?php endif; ?>



		</div>
	<?php endif; ?>
</section>


<?php
// Floating text
if ( ( $layout == 'storia' || $layout == 'articolo' ) && get_sub_field('floating_text') != '' ) : ?>
<div class="storia--floating" fade left>
	<div class="row">
		<div class="col-12 col-sm-8 col-md-6 col-xl-4">
			<h1><?php the_sub_field('floating_text') ?></h1>
		</div>
	</div>
</div>
<?php endif; ?>
