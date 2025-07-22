<?php
$image = get_field('catalogue_image', 'option');
if ($image) : ?>
	<section class="composizione--catalog " fade up>
		<a href="#download" modal-toggle="catalogue" data-file="<?php the_field('catalogue_salesforce_file', 'option')?>">
			<?php echo wp_get_attachment_image( $image, 'medium', false, array(
				'class' => 'h-auto'
			))  ?>
			<?php the_field('catalogue_title', 'option') ?>
			<div class="icon--download">
				<div class="icon--download--text"></div>
				<?php websolute_svg('download') ?>
			</div>
		</a>
	</section>
<?php endif; ?>
