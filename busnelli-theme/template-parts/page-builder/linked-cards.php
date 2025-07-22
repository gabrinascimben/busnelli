<?php
if ( have_rows('cards') ) : ?>
	<section class="mosaic mosaic-news mosaic-storia background-oil section-11">
		<div class="container-fluid">
			<div class="row mosaic--row">
				<?php while ( have_rows('cards') ) : the_row(); ?>
					<div class="col-6 col-sm-3 col-md-2 mosaic--column">
						<a href="<?php echo esc_url( get_sub_field('link') ); ?>" class="mosaic--item">

							<?php
							$image = get_sub_field('image');
							if ( $image ) :
								echo wp_get_attachment_image( $image, 'medium', false, array(
									'class' => 'h-auto'
								) );
							endif; ?>

							<div class="mosaic--info dark">
								<div class="mosaic--text">
									<?php the_sub_field('text') ?>
								</div>
									<div class="mosaic--icon">
										<div class="icon--arrow-next">
											<?php websolute_svg('arrow_next') ?>
										</div>
									</div>
							</div>
						</a>
					</div>
				<?php endwhile; ?>
			</div>
		</div>
	</section>
<?php endif; ?>
