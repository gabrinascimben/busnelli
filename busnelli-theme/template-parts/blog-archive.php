<?php if ( have_posts() ) : ?>
	<section class="mosaic mosaic-news">
		<div class="container-fluid">
			<div class="row mosaic--row">
				<?php while ( have_posts() ) : the_post(); ?>

					<div class="col-6 col-sm-3 col-md-2 mosaic--column">
						<a href="<?php the_permalink(); ?>" class="mosaic--item">
							<?php if (has_post_thumbnail()) :
								the_post_thumbnail('mosaic', array(
									'class' => 'h-auto'
								));
							endif; ?>
							<div class="mosaic--text">
								<?php the_title() ?>
							</div>
							<div class="mosaic--icon">
								<div class="icon--arrow-next-nocircle">
									<?php websolute_svg('arrow_next_nocircle') ?>
								</div>
							</div>
						</a>
					</div>
				<?php endwhile; ?>
			</div>
		</div>
	</section>
<?php endif; ?>
