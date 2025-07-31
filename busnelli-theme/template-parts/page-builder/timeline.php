<?php
$current_lang = apply_filters( 'wpml_current_language', NULL );

if (get_sub_field('slides') || get_sub_field('products') ) : ?>
	<section class="timeline <?php the_sub_field('content') ?> <?php the_sub_field('style') ?>" fade>
		<div class="timeline--content">
			<div class="timeline--content--slides">
				<?php
				if (get_sub_field('content') == 'slides' || get_sub_field('content') == '') :
					while (have_rows('slides')) : the_row(); ?>
						<div class="timeline--content--slide">
							<div class="timeline--content--image <?php the_sub_field('style') ?>">
								<?php echo wp_get_attachment_image( get_sub_field('image'), 'medium' ); ?>
							</div>
						</div>
					<?php endwhile;
				elseif (get_sub_field('content') == 'hero') :
					foreach ( get_sub_field('products') as $product ) :
						$product = apply_filters( 'wpml_object_id', $product, 'product', false, $current_lang ); ?>
						<div class="timeline--content--slide">
							<div class="hero-block">
								<div class="container-fluid">
									<div class="hero-block--top">
										<h2 class="hero-block--title">
											<span class="color-black" split><?php echo get_the_title($product) ?></span>
										</h2>
									</div>
									<?php
									$image = get_field('image', $product);
									if( $image ) : ?>
										<div class="hero-block--image">
											<?php echo wp_get_attachment_image( $image, 'medium', false, array(
												'fade' => '',
												'up' => '',
												'fire' => '',
												'class' => 'h-auto'
											) ); ?>
										</div>
									<?php endif; ?>
									<div class="hero-block--side">
										<div class="hero-block--designer">
											<?php
											if ( get_field('designer', $product ) != '' ) :
												$designer = get_post( get_field('designer', $product) );
												echo $designer->post_title . ', ';
											endif;

											echo get_the_date('Y', $product) ?>
										</div>
									</div>
								</div>
							</div>
						</div>
					<?php endforeach;
				endif; ?>
			</div>
		</div>
		<div class="timeline--navigation">
			<div class="timeline--navigation--slides">
				<?php
				$count = 0;
				if (get_sub_field('content') == 'slides' || get_sub_field('content') == '') :
					while (have_rows('slides')) : the_row();
						$count++;

						$link = get_sub_field('link');
						$data_attributes = '';
						if ($link) {
							$link_url = $link['url'];
							$link_title = $link['title'];
							$link_target = $link['target'] ? $link['target'] : '_self';
							$data_attributes = 'data-link-url="' . esc_url($link_url) . '" data-link-title="' . esc_attr($link_title) . '" data-link-target="' . esc_attr($link_target) . '"';
						}
						?>
						<div class="timeline--navigation--slide" <?php echo $data_attributes; ?>>
							<div class="timeline--navigation--name">
								<?php if (get_sub_field('title') ) :
									the_sub_field('title');
								else :
									echo 'Slide ' . $count;
								endif; ?>
							</div>
						</div>
						
					<?php endwhile;
				elseif (get_sub_field('content') == 'hero') :
					foreach ( get_sub_field('products') as $product ) : ?>
						<div class="timeline--navigation--slide">
							<div class="timeline--navigation--name"></div>
							<a href="<?php
								$product = apply_filters( 'wpml_object_id', $product, 'product', false, $current_lang );
								echo get_permalink($product)
								?>">
								<div class="cta ">
									<div class="cta--wrapper">
										<div class="cta--content"><?php _e('Scopri di più', 'busnelli') ?></div>
									</div>
								</div>
							</a>
						</div>
					<?php endforeach;
				endif; ?>
			</div>
		</div>
		<?php if ( get_sub_field('vertical')  != '' ) : ?>
  			<div class="timeline--vertical">
				<div><?php the_sub_field('vertical') ?></div>
			</div>
		<?php endif; ?>
	</section>
<?php endif; ?>
