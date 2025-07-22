<section class="composizione--hero">
	<div class="container-fluid">
		<div class="composizione--hero--designer" fade down fire>
			<?php
			if ( get_field('designer') != '' ) :
				$designer = get_post( get_field('designer') );
				echo $designer->post_title . ', ';
			endif;

			the_date('Y') ?></div>
		<div class="composizione--hero--top">
			<div class="composizione--hero--title">
				<span class="color-black" split><?php the_title() ?></span>
			</div>
			<?php if ( get_field('code_letter') != '' || get_field('code_number') != '' ) : ?>
				<div class="composizione--hero--code desktop">
					<div fade up>
						<?php if ( get_field('code_letter') != '') : ?>
								<span class="color-black"><?php the_field('code_letter') ?></span>
						<?php endif; ?>
						<?php if ( get_field('code_number') != '') : ?>
								<span class="color-black"><?php the_field('code_number') ?></span>
						<?php endif; ?>
					</div>
				</div>
			<?php endif; ?>
		</div>
		<?php
		$image = get_field('image');
		if( $image ) : ?>
			<div class="composizione--hero--image">
				<?php echo wp_get_attachment_image( $image, 'medium', false, array(
					'fade' => '',
					'up' => '',
					'fire' => '',
					'class' => 'h-auto'
				) ); ?>
			</div>
		<?php endif; ?>
    </div>
	<?php if ( get_field('code_letter') != '' || get_field('code_number') != '' ) : ?>
		<div class="composizione--hero--code mobile">
			<div fade up>
				<?php if ( get_field('code_letter') != '') : ?>
						<span class="color-black"><?php the_field('code_letter') ?></span>
				<?php endif; ?>
				<?php if ( get_field('code_number') != '') : ?>
						<span class="color-black"><?php the_field('code_number') ?></span>
				<?php endif; ?>
			</div>
		</div>
	<?php endif; ?>
    <div fade up fire>
		<div class="section--hero--plus--content">
			<div class="section--hero--plus--text">
				<?php if (get_field('excerpt') != '') : ?>
					<div class="excerpt">
						<?php the_field('excerpt') ?>
					</div>
				<?php endif; ?>
				<?php if (get_field('content') != '') : ?>
					<div class="full">
						<?php the_field('content') ?>
					</div>
				<?php endif; ?>
			</div>
			<?php if (get_field('content') != '') : ?>
				<div class="section--hero--plus--icon">
					<div class="icon--more">
						<?php websolute_svg('more') ?>
					</div>
				</div>
			<?php endif; ?>
		</div>
    </div>
</section>
