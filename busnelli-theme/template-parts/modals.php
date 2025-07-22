
<div class="modal" modal="download" style="display:none">
	<div class="modal--close"></div>
	<div class="modal--content">
		<div class="modal--title"><?php the_field('download_title', 'option') ?></div>
		<div class="modal--text"><?php the_field('download_text', 'option') ?></div>
		<div class="modal--form">
			<?php echo str_replace('src=', 'data-src=', get_field('form_download', 'option')) ?>
		</div>

	</div>
</div>


<div class="modal" modal="catalogue" style="display:none">
	<div class="modal--close"></div>
	<div class="modal--content">
		<div class="modal--title"><?php the_field('download_title', 'option') ?></div>
		<div class="modal--text"><?php the_field('download_text', 'option') ?></div>
		<div class="modal--form">
			<?php echo str_replace('src=', 'data-src=', get_field('form_download', 'option')) ?>
		</div>

	</div>
</div>



<div class="modal" modal="press" style="display:none">
	<div class="modal--close"></div>
	<div class="modal--content">
		<div class="modal--title"><?php the_field('download_title', 'option') ?></div>
		<div class="modal--text"><?php the_field('download_text', 'option') ?></div>
		<div class="modal--form">
			<?php echo str_replace('src=', 'data-src=', get_field('form_press', 'option')) ?>
		</div>

	</div>
</div>
