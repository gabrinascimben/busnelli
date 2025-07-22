<?php
// Products loop
$products = get_sub_field('products');
if ( $products ) : ?>
	<section class="section--preview-products" fade up>
		<div class="swiper-wrapper">
			<?php foreach ( $products as $product ) : ?>
				<div class="swiper-slide">
					<div class="collection--products--item" onclick="window.location.href='<?php the_permalink( $product )?>'">
						<div>
							<?php
							// Poltrone & Chaise Longue in all languages
							if ( has_term( array(
									25, 26, // IT
									47, 42, // FR
									48, 43, // ES
									49, 44, // EN
							), 'product-categories', $product) ) :
								$img_size = 'thumbnail';
								$img_class = 'rounded';
							else :
								$img_size = 'medium';
								$img_class = 'square';
							endif;
							?>
							<div class="collection--products--image <?php echo $img_class ?>">
								<?php echo get_the_post_thumbnail($product, $img_size) ?>
							</div>
							<div class="collection--products--info">
								<div class="collection--products--name">
									<?php echo get_the_product_title($product) ?>
								</div>
								<div class="collection--products--category">
									<?php
									echo yoast_get_primary_term( 'product-categories', $product );
									?>
								</div>
								<?php
								$techsheets = get_field('downloads_techsheet', $product);
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
			<?php endforeach; ?>
    	</div>
		<?php if ( count($products) > 3 ) : ?>
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
wp_reset_postdata(); ?>
