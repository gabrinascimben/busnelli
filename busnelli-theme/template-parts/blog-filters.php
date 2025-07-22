<?php
$blog_id = get_option( 'page_for_posts' );


if ( get_field('filters', $blog_id) ) :
	$categories = get_field('filters', $blog_id);
else :
	$categories = get_categories( array(
		'fields' => 'ids',
		'orderby' => 'term_id',
		'order' => 'ASC',
		'hide_empty' => false,
	) );
endif;

// How many categories per row?
$total = count($categories);
$per_row = round( $total / 2);
$count = 0; ?>

<section class="caleidoscopio--clients">
	<div class="container">
		<?php foreach ($categories as $category) :
			$count ++;
			$cat_obj = get_category($category);
			if ($count % $per_row == 1) :
				// Open row
				echo '<div class="caleidoscopio--clients--line">';
			endif; ?>
				<div class="caleidoscopio--clients--item">
					<a href="<?php echo esc_url(get_category_link($cat_obj))?>"><?php echo $cat_obj->name ?></a>
				</div>
			<?php if ($count % $per_row == 0 || $count == $total) :
				// Close row
				echo '</div>';
			endif;  ?>
		<?php endforeach; ?>
	</div>
</section>
