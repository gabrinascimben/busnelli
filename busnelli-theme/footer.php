<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Websolute_Starter_Theme
 */

?>

<?php get_template_part('template-parts/modals'); ?>

<div class="footer">
  	<div class="container">
		<?php
		// Mobile text
		if ( have_rows('mobile_text', 'option') ) : ?>
			<div class="footer--address">
				<?php while ( have_rows('mobile_text', 'option') ) : the_row(); ?>
					<p footer-animate up>
						<strong><?php the_sub_field('title'); ?></strong>
						<br>
						<?php the_sub_field('text'); ?>
					</p>
				<?php endwhile; ?>
			</div>
		<?php endif; ?>

		<?php
		// Social menu
		if ( have_rows('social', 'option') ) : ?>
			<div class="footer--social">
				<?php while ( have_rows('social', 'option') ) : the_row(); ?>
					<a href="<?php the_sub_field('url'); ?>" target="_blank" class="menu--social--item" footer-animate up>
						<div class="icon--social">
							<?php
							websolute_svg(get_sub_field('network'));
							?>
						</div>
					</a>
				<?php endwhile; ?>
			</div>
		<?php endif; ?>


		<?php
		// Footer links boxes
		if ( have_rows('box', 'option') ) :
			$dropdown_counter = 0;
			?>
			<div class="footer--links">
				<?php while ( have_rows('box', 'option') ) : the_row();
					$width = get_sub_field('width');
					switch ( get_sub_field('type') ) :
						case 'link':
							$link = get_sub_field('link');
							if( $link ):
								$link_url = $link['url'];
								$link_title = $link['title'];
								$link_target = $link['target'] ? $link['target'] : '_self';
								?>
								<div class="<?php echo $width ?>" footer-animate-link>
									<a class="footer--links--title" href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ); ?>"><?php echo $link_title; ?></a>
								</div>
							<?php endif;
							break;
						case 'menu':
							$dropdown_counter++;
							?>
							<div class="<?php echo $width ?>" footer-animate-link data-toggle="footer-content-<?php echo $dropdown_counter ?>">
								<div class="footer--links--title">
									<?php the_sub_field('title'); ?>
								</div>
								<?php if ( have_rows('menu') ) : ?>
									<div class="footer--links--content" data-content="footer-content-<?php echo $dropdown_counter ?>">
										<?php while ( have_rows('menu') ) : the_row();
											$link = get_sub_field('link');
											if( $link ):
												$link_url = $link['url'];
												$link_title = $link['title'];
												$link_target = $link['target'] ? $link['target'] : '_self';
												?>
												<div class="<?php echo $width ?>" footer-animate-link>
													<a class="footer--links--item" href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ); ?>"><?php echo $link_title; ?></a>
												</div>
											<?php endif;
										endwhile; ?>
									</div>
								<?php endif; ?>
							</div>
							<?php
							break;
						case 'text':
							$dropdown_counter++;
							?>
							<div class="<?php echo $width ?>" footer-animate-link data-toggle="footer-content-<?php echo $dropdown_counter ?>">
								<div class="footer--links--title">
									<?php the_sub_field('title'); ?>
								</div>
								<div class="footer--links--content" data-content="footer-content-<?php echo $dropdown_counter ?>">
									<p>
										<?php the_sub_field('text'); ?>
									</p>
								</div>
							</div>
							<?php break;
						case 'social':
							if ( have_rows('social', 'option') ) : ?>
								<div class="<?php echo $width ?>" footer-animate-link >
									<?php while ( have_rows('social', 'option') ) : the_row(); ?>
										<a href="<?php the_sub_field('url'); ?>" target="_blank"  class="menu--social--item" footer-animate-link>
											<div class="icon--social">
												<?php
												websolute_svg(get_sub_field('network'));
												?>
											</div>
										</a>
									<?php endwhile; ?>
								</div>
							<?php endif;
							break;
					endswitch;

				endwhile; ?>
			</div>
		<?php
		endif; ?>



	<?php
		// Footer CTA buttons
		if ( have_rows('buttons', 'option') ) :
			$total = count(get_field('buttons', 'option'));
			$count = 0;
			?>
			<div class="footer--ctas">
				<?php while ( have_rows('buttons', 'option') ) : the_row();
					$count++;
					$animation_direction = '';
					if ($total > 1 && $count == 1) {
						$animation_direction = 'left';
					} elseif ($total > 1 && $count == $total) {
						$animation_direction = 'right';
					}
					$link = get_sub_field('button');
					if( $link ):
						$link_url = $link['url'];
						$link_title = $link['title'];
						$link_target = $link['target'] ? $link['target'] : '_self';
						if ($link_title != '') : ?>
							<div footer-animate <?php echo $animation_direction ?>>
								<a class="cta dark" href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ); ?>"
									<?php if ( $link_url == '#popup-catalogo' ): ?>
										modal-toggle="catalogue" data-file="<?php the_field('catalogue_salesforce_file', 'option')?>"
									<?php endif; ?>
									>
									<div class="cta--wrapper">
										<div class="cta--content"><?php echo $link_title; ?></div>
									</div>
								</a>
							</div>
						<?php endif;
					endif;
				endwhile; ?>
			</div>
		<?php endif; ?>
  	</div>



  	<div class="container-fluid">
		<?php
		// Big call to action
		$link = get_field('call_to_action', 'option');
		if( $link ):
			$link_url = $link['url'];
			$link_title = $link['title'];
			$link_target = $link['target'] ? $link['target'] : '_self'; ?>
			<div class="footer--text-large" footer-animate up>
				<a href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ); ?>" footer-animate up>
					<?php echo $link_title; ?>
				</a>
			</div>
		<?php endif ?>
		<div class="footer--bottom" >
			<div class="footer--bottom--links" footer-animate left>
				<a href="<?php the_field('iubenda_privacy', 'option') ?>" class="iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iubenda-noiframe " title="Privacy Policy ">Privacy Policy</a>
				<a href="<?php the_field('iubenda_cookie', 'option') ?>" class="iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iubenda-noiframe " title="Cookie Policy ">Cookie Policy</a>

				<script type="text/javascript">(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);</script>
			</div>

			<?php
			// Copyright notice
			if ( get_field('copyright', 'option') ) : ?>
				<div class="footer--bottom--copy" footer-animate up>
					<?php echo str_replace('%yyyy%', date('Y'), get_field('copyright', 'option')); ?>
				</div>
			<?php endif ?>

			<?php // Designed by notice ?>
			<div class="footer--bottom--credits" footer-animate right>
				<a href="https://www.claim.it" target="_blank">
					Designed by<?php websolute_svg('claim_logo') ?>
				</a>
			</div>
		</div>
  	</div>
</div>
</div>

<?php wp_footer(); ?>

</body>
</html>
