<?php
if ( get_field('designer') != '' ) :
	$designer = get_post( get_field('designer') );
	$current_lang = apply_filters( 'wpml_current_language', NULL );

	$post_id = apply_filters( 'wpml_object_id', $designer->ID, 'designer', false, $current_lang ) ?>

	<section class="designer">
		<div class="container">
			<div class="designer--name" fade left><?php echo get_the_title($post_id) ?></div>
			<div class="designer--image" fade right>
				<?php echo get_the_post_thumbnail($post_id, 'medium') ?>
			</div>
			<?php
			if ( get_field('quote', $post_id) ) : ?>
				<div class="designer--quote" fade up>
					<section class="quote">
					<div class="quote--symbol">
						<?php websolute_svg('quote') ?>
					</div>
						<div class="quote--text">
							<?php the_field('quote', $post_id) ?>
						</div>
						<div class="quote--sign"><?php echo get_the_title($post_id) ?></div>
					</section>
				</div>
			<?php endif; ?>

			<?php
			if ( get_field('excerpt', $post_id) ) : ?>
				<div class="designer--text" fade left>
					<?php the_field('excerpt', $post_id) ?>
				</div>
			<?php endif; ?>

			<?php
			// Display CTA only if designer is set tot visible
			if (get_field('visibility', $post_id) !== false) : ?>
			<div class="designer--cta" fade left>
				<a class="cta" href="<?php echo esc_url(get_permalink($post_id))?>">
					<div class="cta--wrapper">
						<div class="cta--content"><?php _e('Discover more', 'busnelli') ?></div>
					</div>
				</a>
			</div>
			<?php endif; ?>
		</div>
	</section>
<?php endif; ?>
