<?php

$var_names = array (
	'2d' => __('2D', 'busnelli'),
	'3d' => __('3D', 'busnelli'),
	'techsheet' => __('Tech Sheet', 'busnelli'),
);


if ( get_field('download_enable', 'option') ) : ?>
	<div class="accordion">
		<div class="accordion--items">
			<?php
			foreach ($var_names as $var_name => $display_name ) :
				if (have_rows('downloads_' . $var_name)) : ?>
					<div class="accordion--item">
						<div class="accordion--heading" accordion-toggle="<?php echo $var_name ?>"><?php echo $display_name ?></div>
						<div class="accordion--content" accordion-content="<?php echo $var_name ?>">
							<?php while (have_rows('downloads_' . $var_name)) : the_row(); ?>
								<div class="download-item" modal-toggle="download"
									data-product="<?php the_sub_field('salesforce_product')?>"
									data-file="<?php the_sub_field('salesforce_file')?>">
									<img src="<?php echo get_stylesheet_directory_uri() ?>/images/file-icons-svg/<?php the_sub_field('format') ?>.svg" />
									<div class="icon--download">
										<div class="icon--download--text"><?php _e('Download', 'busnelli' ) ?></div>
										<?php websolute_svg('download') ?>
									</div>
								</div>
							<?php endwhile; ?>
						</div>
					</div>
				<?php endif;
			endforeach; ?>
		</div>
	</div>
<?php else: ?>
	<div class="accordion--empty"><?php _e('Available soon', 'busnelli') ?></div>

<?php endif; ?>
