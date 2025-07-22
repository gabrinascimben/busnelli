<?php
$page_id =  get_field('collections_page', 'option');
?>
<div class="collection--filters--content">
	<div class="container">
		<div class="row">
			<div class="col-12 col-md-4 col-lg-2 collection--filters--block">
				<div class="collection--filters--title">
					<?php _e('Categories', 'busnelli') ?>
				</div>
				<?php
				$cats = get_terms( array(
					'taxonomy' => 'product-categories',
					'hide_empty' => false,
					'orderby' => 'menu_order',
					'order' => 'ASC'
				));
				$count = 1;
				foreach ( $cats as $cat) : ?>
					<a class="collection--filters--item" href="<?php the_permalink($page_id ) ?><?php echo $cat->slug ?>/">
						<?php echo $cat->name; ?>
					</a>
				<?php
				if ( $count == 2 ) : // "All products" in 3rd position ?>
					<a class="collection--filters--item" href="<?php the_permalink($page_id ) ?>">
						<?php _e('All Products', 'busnelli'); ?>
					</a>
				<?php endif;
				$count++;
				endforeach; ?>
			</div>
			<div class="col-12 col-md-4 col-lg-2 collection--filters--block">
				<div class="collection--filters--title">
					<?php _e('Designer', 'busnelli') ?>
				</div>
				<?php
				$args = array(
					'posts_per_page' => -1,
					'post_type' => 'designer',
					'post_status' => 'publish',
					'orderby' => 'menu_order',
					'order' => 'ASC'
				);
				$designers = new WP_Query( $args );
				if ( $designers->have_posts() ) :
					while ( $designers->have_posts() ) : $designers->the_post(); ?>
						<a class="collection--filters--item" href="<?php the_permalink($page_id ) ?><?php echo get_post_field('post_name'); ?>/">
							<?php the_title(); ?>
						</a>
					<?php endwhile;
				endif;
				wp_reset_postdata(); ?>
			</div>
			<div class="col-12 col-md-4 col-lg-2 collection--filters--block">
				<div class="collection--filters--title">
					<?php _e('Sort by', 'busnelli') ?>
				</div>
				<a class="collection--filters--item js-sort-by by-new" href="">
					<?php _e('New', 'busnelli') ?>
				</a>
				<a class="collection--filters--item js-sort-by by-az" href="?sort=az">
					<?php _e('A-Z', 'busnelli') ?>
				</a>
			</div>
		</div>
	</div>
</div>
