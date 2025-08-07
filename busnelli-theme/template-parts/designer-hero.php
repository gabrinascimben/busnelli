<style>
	.designer--hero--backdrop img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
</style>
<!-- HERO -->
<section class="designer--hero">
	<div class="designer--hero--top">
		<div class="row">
			<div class="col-12 col-sm-6">
				<?php if (has_post_thumbnail()) : ?>
					<div class="designer--hero--image" fade left>
						<?php the_post_thumbnail('medium') ?>
					</div>
				<?php endif; ?>
			</div>
			<div class="col-12 col-sm-6" fade right>
				<h1 class="designer--hero--name"><?php the_title() ?></h1>
			</div>
		</div>
	</div>
	<?php
	$media_type = get_field('hero_media_type');
	$id_video = get_field('id_video');
	$hero_image = get_field('hero_image');

	if ( $media_type == 'video' && $id_video ) : ?>
		<div class="designer--hero--backdrop" fade up>
			<section class="section--embed  dark" fade up>
				<div class="container-fluid">
					<div class="section--embed--iframe">
						<iframe class="vimeo" src="https://player.vimeo.com/video/<?php echo esc_attr($id_video); ?>?background=1" frameborder="0" allow="autoplay" allowfullscreen playsinline muted></iframe>
					</div>
				</div>
			</section>
		</div>
	<?php elseif ( $media_type == 'image' && $hero_image ) : ?>
		<div class="designer--hero--backdrop" fade up>
			<img src="<?php echo esc_url($hero_image['url']); ?>" alt="<?php echo esc_attr($hero_image['alt']); ?>" />
		</div>
	<?php endif; ?>

	<?php
	if ( get_field('quote') ) : ?>
		<div class="designer--hero--quote" fade>
			<section class="quote">
				<div class="quote--symbol">
					<?php websolute_svg('quote') ?>
				</div>
				<div class="quote--text">
					<?php the_field('quote') ?>
				</div>
				<div class="quote--sign"><?php echo get_the_title() ?></div>
			</section>
		</div>
	<?php endif; ?>
</section>
