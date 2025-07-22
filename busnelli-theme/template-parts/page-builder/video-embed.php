<?php if (get_sub_field('id_video')) : ?>
	<section class="section--embed dark <?php the_sub_field('style') ?>" fade up>
		<div class="container-fluid">
			<div class="section--embed--iframe">
				<iframe class="vimeo" src="https://player.vimeo.com/video/<?php the_sub_field('id_video') ?>?controls=0" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
				<div class="controls">
					<div class="pause">
						<?php websolute_svg('stop') ?>
					</div>
					<div class="play">
						<?php websolute_svg('play') ?>
					</div>
				</div>
			</div>
		</div>
	</section>
<?php endif; ?>
