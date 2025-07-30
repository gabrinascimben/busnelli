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

			<?php 
			$text_description = get_sub_field('text_description');
			$image_id = get_sub_field('image_block');
			if ($text_description || $image_id) : 
			?>
				<div class="description-image-container">
					<?php if ($text_description) : ?>
						<div class="text-description">
							<?php echo $text_description; ?>
						</div>
					<?php endif; ?>
			
					<?php if ($image_id) : ?>
						<div class="image-block">
							<?php echo wp_get_attachment_image($image_id, 'full'); ?>
						</div>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<?php if ($subdescription = get_sub_field('subdescription')) : ?>
				<div class="subdescription">
					<?php echo nl2br($subdescription); ?>
				</div>
			<?php endif; ?>


	<?php if ($layout == 'section-3' || $layout == 'section-4' || $layout == 'section-7' || $layout == 'section-10') : ?>
		</div>
	<?php else : ?>
			</div>
		</div>
	<?php endif; ?>
</section>
