<section class="text-image <?php the_sub_field('style') ?> section-19">
	<div class="text-only <?php the_sub_field('style') ?>" fade>
		<?php the_sub_field('title') ?>
		<?php
		if (get_sub_field('style') == 'background-oil')
			websolute_svg('wedo_light');
		else
			websolute_svg('wedo_dark');
		?>
	</div>
	<div class="container">
		<?php if (get_sub_field('text_1') != '') : ?>
			<div class="text-image--text">
				<div fade left>
					<?php the_sub_field('text_1') ?>
				</div>
			</div>
		<?php endif; ?>
		<?php if (get_sub_field('text_2') != '') : ?>
			<div class="text-image--text">
				<div fade up>
					<?php the_sub_field('text_2') ?>
				</div>
			</div>
		<?php endif; ?>
	</div>
	<?php
	$link = get_sub_field('cta');
	if( $link ):
		$link_url = $link['url'];
		$link_title = $link['title'];
		$link_target = $link['target'] ? $link['target'] : '_self';
		if ($link_title != '') : ?>
			<div class="container text-cta" fade>
				<div class="cta <?php if (get_sub_field('style') == 'background-oil') echo 'dark' ?>">
					<a href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ); ?>">
						<div class="cta--wrapper">
							<div class="cta--content">
								<?php echo $link_title; ?>
							</div>
						</div>
					</a>
				</div>
			</div>
		<?php endif;
	endif; ?>
</section>
