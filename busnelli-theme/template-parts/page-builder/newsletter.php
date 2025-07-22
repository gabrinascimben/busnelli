<section class="section--newsletter" fade up>
	<div class="container">
		<?php if (get_sub_field('vertical') != '' ) : ?>
			<div class="section--newsletter--vertical">
				<div><?php the_sub_field('vertical') ?></div>
			</div>
		<?php endif; ?>
		<?php if (get_sub_field('title') != '' ) : ?>
			<div class="section--newsletter--title"><?php the_sub_field('title') ?></div>
		<?php endif; ?>
		<?php if (get_sub_field('text') != '' ) : ?>
			<div class="section--newsletter--subtitle"><?php the_sub_field('text') ?></div>
		<?php endif; ?>
		<div class="section--newsletter--form">
			<?php the_field('form_newsletter', 'option') ?>
		</div>
	</div>
</section>
