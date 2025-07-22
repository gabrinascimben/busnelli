<?php
$items = get_sub_field('words');
// How many items per row?
$total = count($items);
$per_row = 2;
$count = 0;

?>

<section class="caleidoscopio--clients">
	<div class="container">
		<?php
		if ( have_rows('words') ) :
			while (have_rows('words') ) : the_row();
				$count ++;
				if ($count % $per_row == 1) :
					// Open row
					echo '<div class="caleidoscopio--clients--line">';
				endif; ?>
				<div class="caleidoscopio--clients--item">
					<div><?php the_sub_field('line') ?></div>
				</div>
			<?php if ($count % $per_row == 0 || $count == $total) :
				// Close row
				echo '</div>';
			endif;  ?>
			<?php endwhile;
		endif; ?>
	</div>
</section>
