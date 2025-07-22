<div class="background-white">
	<section class="section--newsletter" fade up>
		<div class="container">
			<div class="section--newsletter--vertical">
				<div><?php
				if (get_field('nl_text_side', 'option') != '') :
					the_field('nl_text_side', 'option');
				endif;
				?></div>
			</div>

			<?php if (get_field('nl_title', 'option') != '') : ?>
				<div class="section--newsletter--title">
					<?php the_field('nl_title', 'option'); ?>
				</div>
			<?php endif; ?>

			<?php if (get_field('nl_text', 'option') != '') : ?>
				<div class="section--newsletter--subtitle">
					<?php the_field('nl_text', 'option'); ?>
				</div>
			<?php endif; ?>

			<div class="section--newsletter--form">
				<?php the_field('form_newsletter', 'option') ?>
			</div>
		</div>
	</section>
</div>
