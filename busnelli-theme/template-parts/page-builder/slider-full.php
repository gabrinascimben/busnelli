<?php if (have_rows('slides')) : ?>
	<section class="composizione--slider-full" fade fire>
		<div class="swiper--default">
			<div class="swiper-wrapper">
				<?php while (have_rows('slides')) : the_row(); ?>
					<div class="swiper-slide">
						<div class="swiper-slide--image" style="background-image:url(<?php echo wp_get_attachment_image_src( get_sub_field('image'), 'full')[0] ?>)"></div>
					</div>
				<?php endwhile; ?>
			</div>
		</div>
		<?php if ( count(get_sub_field('slides')) > 1) : ?>
			<div class="swiper--default--nav">
				<div class="swiper--default--prev">
					<div class="icon--arrow-prev">
						<?php websolute_svg('arrow_prev') ?>
					</div>

				</div>
				<div class="swiper--default--next">
					<div class="icon--arrow-next">
						<?php websolute_svg('arrow_next') ?>
					</div>
				</div>
			</div>
			<?php endif; ?>
	</section>
<?php endif; ?>
