
<section class="crew--hero">
	<?php
	$image = get_field('image');
	if ( $image ) : ?>
		<div class="crew--hero--backdrop" fade fire>
			<?php echo wp_get_attachment_image( $image, 'full' ); ?>
		</div>
	<?php endif; ?>
	<?php
	// Title
	if (have_rows('title')) : ?>
		<div class="container-fluid">
			<div class="crew--hero--top">
				<p class="crew--hero--title">
					<?php while (have_rows('title')) : the_row(); ?>
						<span class="<?php the_sub_field('color') ?>" split><?php the_sub_field('segment') ?></span>
						<?php if (get_sub_field('new_line')) echo '<span><br></span>'; ?>
					<?php endwhile; ?>
				</p>
			</div>
		</div>
	<?php endif; ?>
</section>
<?php if ( get_field('floating_text') != '' ) : ?>
	<div class="crew--floating" fade left>
		<div class="row">
			<div class="col-12 col-sm-8 col-md-6 col-xl-4">
				<h2><?php the_field('floating_text') ?></h2>
			</div>
		</div>
	</div>
<?php endif; ?>

<?php if( have_rows('steps') ) : ?>
	<section class="crew--half">
		<div class="container-fluid">
			<div class="row">
				<div class="col-12 col-md-6 offset-md-6">

    				<?php
					$count = 0;
					while( have_rows('steps') ) : the_row();
						$count++; ?>
						<div class="crew--half--item">
							<div class="crew--half--top">
								<div class="crew--half--title">
									<h3><?php the_sub_field('title') ?></h3>
								</div>
								<div class="crew--half--number">
									<?php if ( $count < 10) echo '0'; ?><?php echo $count; ?>
								</div>
							</div>
							<div class="crew--half--content">
								<?php the_sub_field('text') ?>
							</div>
						</div>
					<?php endwhile; ?>
				</div>
			</div>
		</div>
	</section>
<?php endif; ?>

<?php
$images = get_field('images');
if ($images) : ?>
	<section class="section--multiple-slider">
		<div class="container-fluid" fade>
			<div class="swiper--multiple">
				<div class="swiper-wrapper">
					<?php foreach ($images as $image) : ?>
						<div class="swiper-slide h-auto">
							<?php echo wp_get_attachment_image( $image, 'medium_large', false); ?>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
			<div class="swiper--default--nav">
				<div class="section--multiple-slider--prev">
					<div class="icon--arrow-prev">
						<?php websolute_svg('prev') ?>
					</div>
				</div>
				<div class="section--multiple-slider--next">
					<div class="icon--arrow-next">
						<?php websolute_svg('next') ?>
					</div>
				</div>
			</div>
		</div>
	</section>
<?php endif; ?>
