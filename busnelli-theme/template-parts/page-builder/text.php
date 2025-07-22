<?php
$layout = get_sub_field('layout');

if ($layout == 'section-3' || $layout == 'section-4' || $layout == 'section-7' || $layout == 'section-10') $layout_class = 'text-only';
else $layout_class = 'section--text';
?>

<section class="<?php echo $layout_class ?>
				<?php the_sub_field('style') ?>
				<?php the_sub_field('text_size') ?>
				<?php the_sub_field('alignment') ?>
				<?php echo $layout ?>"
				<?php if ($layout == 'section-3' || $layout == 'section-4' || $layout == 'section-7' || $layout == 'section-10') echo 'fade' ?>>
	<?php if ($layout == 'section-3' || $layout == 'section-4' || $layout == 'section-7' || $layout == 'section-10') : ?>
    	<div class="container">
	<?php else : ?>
		<div class="container-fluid" fade up>
			<div class="section--text--content">
	<?php endif; ?>

			<?php if (get_sub_field('text_red') != '') : ?>
				<span class='color-red'><?php the_sub_field('text_red') ?></span>
			<?php endif; ?>

			<?php the_sub_field('text') ?>

	<?php if ($layout == 'section-3' || $layout == 'section-4' || $layout == 'section-7' || $layout == 'section-10') : ?>
		</div>
	<?php else : ?>
			</div>
		</div>
	<?php endif; ?>
</section>
