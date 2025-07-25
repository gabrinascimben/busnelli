<?php
$page_id =  get_field('collections_page', 'option');


// Base query params
$args =  array(
	'posts_per_page' => -1,
	'post_type' => 'product',
	'post_status' => 'publish',
);

// Sorting
if (!isset($_GET['sort']) || $_GET['sort'] == 'new') {
	$args['orderby'] = array( 'menu_order' => 'ASC', 'date' => 'DESC' );
} elseif (isset($_GET['sort']) && $_GET['sort'] == 'az') {
	$args['orderby'] = 'title';
	$args['order'] = 'ASC';
}
$filter = get_query_var('busnelli_filter');
$is_filter = false;
if ($filter) {
	if ( $filter_obj = get_term_by ('slug', $filter, 'product-categories')) :
		// Filter by category
		$args['product-categories'] = $filter;
		$is_filter = 'category';

	elseif ( $filter_obj = get_page_by_path( $filter, OBJECT, 'designer') ) :
		// Filter by designer
		$args['meta_key'] = 'designer';
		$args['meta_value'] = $filter_obj->ID;
		$is_filter = 'designer';
	endif;
}
?>

<section class="collection--hero">
	<?php
	// Title
	if (have_rows('title', $page_id )) : ?>
		<div class="container-fluid">
			<div class="collection--hero--title">
				<?php while (have_rows('title', $page_id )) : the_row(); ?>
					<span class="<?php the_sub_field('color') ?>" split><?php the_sub_field('segment') ?></span>
					<?php if (get_sub_field('new_line')) echo '<span><br></span>'; ?>
				<?php endwhile; ?>
			</div>
		</div>
	<?php endif; ?>

	<?php // Content ?>
	<div class="collection--hero--content" fade>
		<div class="section--hero--plus--content">
			<div class="section--hero--plus--text">
				<?php if (
					$is_filter == 'category'
					&& get_field('excerpt', 'product-categories_' . $filter_obj->term_id ) != ''
				) : ?>
					<?php if (get_field('excerpt', 'product-categories_' . $filter_obj->term_id ) != '') : ?>
						<div class="excerpt">
							<?php the_field('excerpt', 'product-categories_' . $filter_obj->term_id ) ?>
						</div>
					<?php endif; ?>
					<?php if (get_field('content', 'product-categories_' . $filter_obj->term_id ) != '') : ?>
						<div class="full">
							<?php the_field('content', 'product-categories_' . $filter_obj->term_id ) ?>
						</div>
					<?php endif; ?>

				<?php elseif (
					$is_filter == 'designer'
					&& get_field('filter_excerpt', $filter_obj->ID ) != ''
				) : ?>

					<?php if (get_field('filter_excerpt', $filter_obj->ID ) != '') : ?>
						<div class="excerpt">
							<?php the_field('filter_excerpt', $filter_obj->ID ) ?>
						</div>
					<?php endif; ?>
					<?php if (get_field('filter_content', $filter_obj->ID ) != '') : ?>
						<div class="full">
							<?php the_field('filter_content', $filter_obj->ID ) ?>
						</div>
					<?php endif; ?>
				<?php else : ?>
					<?php if (get_field('excerpt', $page_id  ) != '') : ?>
						<div class="excerpt">
							<?php the_field('excerpt', $page_id ) ?>
						</div>
					<?php endif; ?>
					<?php if (get_field('content', $page_id  ) != '') : ?>
						<div class="full">
							<?php the_field('content', $page_id  ) ?>
						</div>
					<?php endif; ?>
				<?php endif; ?>
			</div>
			<?php if (
					get_field('content', $page_id ) != ''
					|| (
						$is_filter == 'category'
						&& get_field('excerpt', 'product-categories_' . $filter_obj->term_id )
					) || (
						$is_filter == 'designer'
						&& get_field('filter_excerpt', $filter_obj->ID ) != ''
					)
				) : ?>
				<!-- <div class="section--hero--plus--icon">
					<div class="icon--more">
						<?php websolute_svg('more') ?>
					</div>
				</div> -->
			<?php endif; ?>
		</div>
	</div>
</section>


<section class="section--products">

	<?php // Filters toggle ?>
	<div class="collection--filters" fade up>
		<div class="container">
			<div class="collection--filters--icon">
				<div class="icon--filtri">
					<?php websolute_svg('filters') ?>
				</div>
			</div>
		</div>
	</div>
    <div class="container">
        <div class="row">
			<?php

			// Products loop
			$products = new WP_Query( $args );
			$direction = 'right';
			if ( $products->have_posts() ) :
				while ( $products->have_posts() ) : $products->the_post();
					if ($direction == 'left') $direction = 'right';
					else $direction = 'left';
					?>
					<div class="col-12 col-sm-6 collection--products--item" onclick="window.location.href='<?php the_permalink()?>'">
						<div fade <?php echo $direction ?>>
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
								$techsheets = get_field('downloads_techsheet');
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
				<?php
				endwhile;
			endif;
			wp_reset_postdata();
			?>
		</div>
	</div>
</section>
