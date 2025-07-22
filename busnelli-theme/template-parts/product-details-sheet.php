<div class="tabs--scheda">
	<div class="accordion">
		<div class="accordion--items">
			<?php if (have_rows('description')) : ?>
				<div class="accordion--item">
					<div class="accordion--heading" accordion-toggle="1"><?php _e('Description', 'busnelli') ?></div>
					<div class="accordion--content" accordion-content="1">
						<div class="descrizione">
							<?php while (have_rows('description')) : the_row(); ?>
								<div class="row">
									<div class="col-12 col-md-3 col-lg-2">
										<strong><?php the_sub_field('title') ?></strong>
									</div>
									<div class="col-12 col-md-9 col-lg-10">
										<?php the_sub_field('description') ?>
									</div>
								</div>
							<?php endwhile; ?>
						</div>
					</div>
				</div>
			<?php endif; ?>

			<?php if (have_rows('compositions')) : ?>
				<div class="accordion--item">
					<div class="accordion--heading" accordion-toggle="2"><?php _e('Compositions', 'busnelli') ?></div>
					<div class="accordion--content" accordion-content="2">
						<div class="composizioni">
							<?php while (have_rows('compositions')) : the_row(); ?>
								<div class="row">
									<div class="col-12">
										<strong><?php the_sub_field('title') ?></strong>
									</div>
									<div class="col-12">
										<?php echo wp_get_attachment_image( get_sub_field('image'), 'medium')  ?>
									</div>
								</div>
							<?php endwhile; ?>
						</div>
					</div>
				</div>
			<?php endif; ?>


			<?php if (have_rows('components_groups')) : ?>
				<div class="accordion--item">
					<div class="accordion--heading" accordion-toggle="3"><?php _e('Components', 'busnelli') ?></div>
					<div class="accordion--content" accordion-content="3">
						<div class="componenti">
							<?php while (have_rows('components_groups')) : the_row(); ?>
								<div class="row">
									<?php if (have_rows('components')) :
										while (have_rows('components')) : the_row(); ?>
											<div class="col-12 col-md-4">
												<div class="componenti--title"><?php the_sub_field('title') ?></div>
												<div class="componenti--content">
													<?php echo wp_get_attachment_image( get_sub_field('image'), 'medium')  ?>
												</div>
											</div>
										<?php endwhile;
									endif;?>
								</div>
							<?php endwhile; ?>
						</div>
					</div>
				</div>
			<?php endif; ?>


			<?php if (have_rows('cushions') || get_field('cushions_recommended') != '') : ?>
				<div class="accordion--item">
					<div class="accordion--heading" accordion-toggle="4"><?php _e('Cushions', 'busnelli') ?></div>
					<div class="accordion--content" accordion-content="4">
						<div class="descrizione">
							<div class="row">
								<?php if (have_rows('cushions')) : while (have_rows('cushions')) : the_row(); ?>
									<div class="col-12 col-md-3 cuscinatura--title">
										<strong><?php the_sub_field('title') ?></strong>
										<?php echo wp_get_attachment_image( get_sub_field('image'), 'medium')  ?>
									</div>
									<?php endwhile; endif; ?>
							</div>
							<?php if (get_field('cushions_recommended') != '') : ?>
								<div class="row">
									<div class="col-12 cuscinatura--content">
										<p>
											<strong><?php _e('Recommended cushions', 'busnelli') ?></strong>
										</p>
										<div>
											<?php the_field('cushions_recommended') ?>
										</div>
									</div>
								</div>
							<?php endif; ?>
						</div>
					</div>
				</div>
			<?php endif; ?>

			<?php
			$count_cat = 5;
			// Finishes categories
			if (have_rows('finishes') ) :
				while (have_rows('finishes') ) : the_row(); ?>
					<div class="accordion--item">
        				<div class="accordion--heading" accordion-toggle="<?php echo $count_cat ?>"><?php the_sub_field('title') ?></div>
       					<div class="accordion--content" accordion-content="<?php echo $count_cat ?>">
							<?php
							// Finishes subcategories
							$count_subcat = 1;
							if (have_rows('subcategories') ) : ?>
								<div class="finiture">
									<div class="tabs m0 p0">
										<div class="tabs--headings <?php if ($count_subcat == 1) echo 'active'; ?>">
											<?php while (have_rows('subcategories') ) : the_row(); ?>
												<div class="tabs--heading" tabs-toggle="<?php echo $count_subcat ?>"><?php the_sub_field('title') ?></div>
											<?php
											$count_subcat++;
											endwhile; ?>
										</div>

										<?php $count_subcat = 1; ?>
										<div class="tabs--contents <?php if ($count_subcat == 1) echo 'active'; ?>">
											<?php while (have_rows('subcategories') ) : the_row(); ?>
												<div class="tabs--content" tabs-content="<?php echo $count_subcat ?>">
													<?php
													// Finishes subcategories > groups
													$count_groups = 1;
													if ( have_rows('groups') ) :
														while ( have_rows('groups') ) : the_row();
															$group_id = $count_cat . '-' . $count_subcat . '-' . $count_groups; ?>
															<div class="accordion">
																<div class="accordion--item">
    																<div class="accordion--heading" accordion-toggle="<?php echo $group_id ?>"><?php the_sub_field('title') ?></div>
    																<div class="accordion--content" accordion-content="<?php echo $group_id ?>">
																		<?php
																		// Single Finishes
																		$count_finishes = 1;
																		if ( have_rows('finishes') ) : ?>
																			<div class="finiture--variants">
																				<div class="row">
																					<div class="col-12 col-md-8 col-lg-9">
																						<?php while ( have_rows('finishes') ) : the_row(); ?>
																							<div class="finiture--variant" finiture-toggle="<?php echo $count_finishes ?>" style="--background-image:url(<?php echo wp_get_attachment_image_src( get_sub_field('image'), 'thumbnail')[0] ?>)"><div class="mobile"><?php the_sub_field('title') ?></div><div class="desktop">+</div></div>
																						<?php
																						$count_finishes++;
																						endwhile; ?>
																					</div>
																					<?php $count_finishes = 1; ?>
																					<div class="col-12 col-md-4 col-lg-3">
																						<?php while ( have_rows('finishes') ) : the_row(); ?>
																							<div class="finiture--focus" finiture-content="<?php echo $count_finishes ?>"  style="--background-image:url(<?php echo wp_get_attachment_image_src( get_sub_field('image'), 'thumbnail')[0] ?>)"><?php the_sub_field('title') ?></div>
																						<?php
																						$count_finishes++;
																						endwhile; ?>
																					</div>
																				</div>
																			</div>
																		<?php endif; ?>

																		<?php if (get_sub_field('text') != '') : ?>
																			<div class="finiture--text">
																				<?php the_sub_field('text') ?>
																			</div>
																		<?php endif; ?>
																	</div>
																</div>
															</div>
														<?php
														$count_groups++;
													endwhile;
													endif; ?>
												</div>
											<?php
											$count_subcat++;
											endwhile; ?>
										</div>
									</div>
								</div>
							<?php endif; ?>

						</div>
					</div>
				<?php
				$count_cat++;
				endwhile;
			endif; ?>

		</div>
	</div>
</div>
