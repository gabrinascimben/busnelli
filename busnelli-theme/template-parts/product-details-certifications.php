<?php
$count = 0;
if (have_rows('certifications_groups') && get_field('cert_enable', 'option')) : ?>
	<div class="tab--certificazioni">
		<div class="accordion">
			<div class="accordion--items">
				<?php
				while (have_rows('certifications_groups')) : the_row();
				$count++;
				?>
					<div class="accordion--item">
						<div class="accordion--heading" accordion-toggle="cert-<?php echo $count ?>"><?php the_sub_field('title')?></div>
						<div class="accordion--content" accordion-content="cert-<?php echo $count ?>">
							<?php if (have_rows('certifications')) :
								while (have_rows('certifications')) : the_row(); ?>
									<div class="row">
										<div class="col-12">
										<strong><?php the_sub_field('title') ?></strong>
										<?php the_sub_field('description') ?>
										</div>
									</div>
								<?php endwhile;
							endif;?>
						</div>
					</div>
				<?php endwhile; ?>
			</div>
		</div>
	</div>
<?php else : ?>
	<div class="accordion--empty"><?php _e('Available soon', 'busnelli') ?></div>
<?php endif; ?>
