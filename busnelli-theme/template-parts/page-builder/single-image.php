<?php $link = get_sub_field('cta'); ?>
<section class="single-image <?php the_sub_field('style') ?> <?php the_sub_field('alignment') ?> <?php the_sub_field('padding') ?> <?php the_sub_field('image_style') ?> <?php if ( $link ) echo 'has-cta'; ?>" fade>
	<div class="single-image--wrapper">
		<?php
		$image = get_sub_field('image');
		if ( $image ) :
			echo wp_get_attachment_image( $image, 'full' );
		endif;
		$description = get_sub_field('descrizione_img');
		if ( $description ) : ?>
			<div class="single-image--description"><?php echo esc_html( $description ); ?></div>
		<?php endif; ?>
	</div>
	<?php
	if ( $link ) :
		$link_url = $link['url'];
		$link_title = $link['title'];
		$link_target = $link['target'] ? $link['target'] : '_self';
		if ($link_title != '') : ?>
			<div class="single-image--cta">
				<a class="cta" href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ); ?>">
					<div class="cta--wrapper">
    					<div class="cta--content">
							<?php echo $link_title; ?>
						</div>
					</div>
				</a>
			</div>
		<?php endif;
	endif; ?>
</section>
