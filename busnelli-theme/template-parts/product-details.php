<!-- start tech-specs.html-->
<section class="tabs " fade>
	<div class="container">
		<div class="tabs--headings">
			<div class="tabs--heading active" tabs-toggle="1"><?php _e('Product sheet', 'busnelli') ?></div>
			<div class="tabs--heading" tabs-toggle="2"><?php _e('Downloads', 'busnelli') ?></div>
			<div class="tabs--heading" tabs-toggle="3"><?php _e('Certifications', 'busnelli') ?></div>
		</div>
		<div class="tabs--contents">
			<div class="tabs--content active" tabs-content="1">
				<?php get_template_part('template-parts/product-details', 'sheet'); ?>
			</div>
			<div class="tabs--content" tabs-content="2">
				<?php get_template_part('template-parts/product-details', 'downloads'); ?>
			</div>
			<div class="tabs--content" tabs-content="3">
				<?php get_template_part('template-parts/product-details', 'certifications'); ?>
			</div>
		</div>
	</div>
</section>
