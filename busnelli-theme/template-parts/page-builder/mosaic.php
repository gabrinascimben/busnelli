<?php
$mosaic = get_sub_field('mosaic');
$images = get_field('mosaic', $mosaic);
if ( $images ) :
	?>
	<section class="mosaic background-white <?php the_sub_field('padding') ?>">
		<div class="container-fluid">
			<div class="row mosaic--row">
				<?php foreach ($images as $image) :
					?><div class="col-6 col-sm-3 col-md-2 mosaic--column">
						<div class="mosaic--item">
							<?php echo wp_get_attachment_image( $image, 'medium', false, array(
								'class' => 'h-auto'
							) ); ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
<?php endif; ?>
