<?php
if (get_field('products_visibility') !== false) :

	// Get products by designer
	$args =  array(
		'posts_per_page' => -1,
		'post_type' => 'product',
		'post_status' => 'publish',
		'meta_key' => 'designer',
		'meta_value' => get_the_ID(),
		'orderby' => array( 'menu_order' => 'ASC', 'date' => 'DESC' ),
	);

	// Products loop
	$products = new WP_Query( $args );
	if ( $products->have_posts() ) : ?>
		<section class="section--preview-products" fade up>
			<div class="swiper-wrapper">
				<?php while ( $products->have_posts() ) : $products->the_post(); ?>
					<div class="swiper-slide">
						<div class="collection--products--item" onclick="window.location.href='<?php the_permalink()?>'">
							<div>
								<?php
								// Poltrone & Chaise Longue in all languages
								if ( has_term( array(
										25, 26, // IT
										47, 42, // FR
										48, 43, // ES
										49, 44, // EN
								), 'product-categories', get_the_ID()) ) :
									$img_size = 'thumbnail';
									$img_class = 'rounded';
								else :
									$img_size = 'medium';
									$img_class = 'square';
								endif;
								?>
								<div class="collection--products--image <?php echo $img_class ?>">
									<?php the_post_thumbnail( $img_size) ?>
								</div>
								<div class="collection--products--info">
									<div class="collection--products--name">
										<?php echo get_the_product_title(get_the_ID()) ?>
									</div>
									<div class="collection--products--category">
										<?php
										echo yoast_get_primary_term( 'product-categories' );
										?>
									</div>
									<?php
									$techsheets = get_field('downloads_techsheet', get_the_ID());
									if ($techsheets && get_field('download_enable', 'option') ) : ?>
										<div class="collection--products--download">
											<a href="#download" modal-toggle="download"
										data-product="<?php echo $techsheets[0]['salesforce_product'] ?>"
										data-file="<?php echo $techsheets[0]['salesforce_file']?>">
												<div class="icon--download">
													<div class="icon--download--text"></div>
													<?php websolute_svg('download') ?>
												</div>
											</a>
										</div>
									<?php endif ?>
								</div>
							</div>
						</div>
					</div>
				<?php endwhile; ?>
			</div>
			<?php if ( $products->found_posts > 3 ) : ?>
				<div class="container">
					<div class="swiper--default--nav">
						<div class="swiper--default--prev">
							<div class="icon--arrow-prev">
								<?php websolute_svg('prev') ?>
							</div>
						</div>
						<div class="swiper--default--next">
							<div class="icon--arrow-next">
								<?php websolute_svg('next') ?>
							</div>
						</div>
					</div>
				</div>
			<?php endif; ?>
		</section>
	<?php endif;
	wp_reset_postdata();
endif;
