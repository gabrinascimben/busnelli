<?php
$blog_id = get_option( 'page_for_posts' );
?>
<section class="caleidoscopio--hero">
	<?php
	// Title
	if (have_rows('title', $blog_id)) : ?>
		<div class="container-fluid">
			<h1 class="caleidoscopio--hero--title">
				<?php while (have_rows('title', $blog_id)) : the_row(); ?>
					<span class="<?php the_sub_field('color') ?>" split><?php the_sub_field('segment') ?></span>
					<?php if (get_sub_field('new_line')) echo '<span><br></span>'; ?>
				<?php endwhile; ?>
			</h1>
		</div>
	<?php endif; ?>
	<?php if ( get_field('text', $blog_id) != '' ) : ?>
		<div class="caleidoscopio--hero--content" fade fire>
			<div class="container">
				<?php the_field('text', $blog_id) ?>
			</div>
		</div>
	<?php endif; ?>
</section>
