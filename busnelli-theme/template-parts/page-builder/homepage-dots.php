<section class="homepage--dots">
	<div class="homepage--dots--wrapper">
		<div class="homepage--dots--background">
			<?php if ( get_sub_field('line_1') != '' ) : ?>
				<h1><?php the_sub_field('line_1') ?></h1>
			<?php endif; ?>
			<?php if ( get_sub_field('line_2') != '' ) : ?>
				<div><?php the_sub_field('line_2') ?></div>
			<?php endif; ?>
		</div>

		<div class="homepage--dots--exclusion">
			<div class="homepage--dots--exclusion--image">
						<img src="<?php echo get_stylesheet_directory_uri() ?>/images/dots-red.svg" />
			</div>
		</div>

		<div class="homepage--dots--foreground"></div>
	</div>
</section>
