<?php
$count = 0;

if (have_rows('year')) :?>
	<section class="section--accordion" fade>
		<div class="container">
			<div class="accordion">
				<div class="accordion--items">
					<?php while ( have_rows('year') ): the_row();
						$count++; ?>
						<div class="accordion--item">
							<div class="accordion--heading" accordion-toggle="cert-<?php echo $count ?>">
								<?php the_sub_field('year') ?>
							</div>
							<div class="accordion--content" accordion-content="cert-<?php echo $count ?>">
								<div class="row">
									<?php if (have_rows('elementi')) :
										while (have_rows('elementi')) : the_row(); ?>

											<?php if (get_sub_field('type') == 'download') : ?>
												<div class="col-12 col-md-6 text-center">
													<a href="#download" class="download-item" modal-toggle="press" data-file="<?php the_sub_field('salesforce_file')?>">
														<div>
															<?php
															$image = get_sub_field('image');
															if( $image ) :
																echo wp_get_attachment_image( $image, 'medium', false, array(
																	'class' => 'h-auto'
																) );
															endif; ?>
														</div>
														<p>
															<?php the_sub_field('title') ?>
														</p>
														<span>
															<div class="icon--download">
																<div class="icon--download--text"></div>
																<?php websolute_svg('download') ?>
															</div>
														</span>
													</a>
												</div>
											<?php else : ?>
												<div class="col-12">
													<strong><?php the_sub_field('title') ?></strong>
													<?php the_sub_field('text') ?>
												</div>
											<?php endif; ?>

										<?php endwhile;
									endif; ?>
								</div>
							</div>
						</div>
					<?php endwhile; ?>
				</div>
			</div>
		</div>
	</section>
  <?php endif; ?>
