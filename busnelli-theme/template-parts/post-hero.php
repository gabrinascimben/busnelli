
<section class="articolo--hero">
	<?php
	$image = get_field('image');
	if ( $image ) : ?>
		<div class="articolo--hero--backdrop" fade fire>
			<?php echo wp_get_attachment_image( $image, 'full' ); ?>
		</div>
	<?php endif; ?>


	<?php
	// Title
	$blog_id = get_option( 'page_for_posts' );
	if (have_rows('title', $blog_id)) : ?>
		<div class="container-fluid">
			<div class="articolo--hero--top">
				<div class="articolo--hero--title">
					<?php while (have_rows('title', $blog_id)) : the_row(); ?>
						<span class="<?php the_sub_field('color') ?>" split><?php the_sub_field('segment') ?></span>
						<?php if (get_sub_field('new_line')) echo '<span><br></span>'; ?>
					<?php endwhile; ?>
				</div>
			</div>
		</div>
	<?php endif; ?>
</section>
<div class="articolo--floating" fade left>
	<div class="row">
		<div class="col-12 col-sm-8 col-md-6 col-xl-4">
			<h1><?php the_title() ?></h1>
		</div>
	</div>
</div>
