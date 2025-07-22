<?php
/**
 * The 404 template file
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Websolute_Starter_Theme
 */

get_header();
?>

<main class="page">
	<section class="section--hero">
		<div class="container-fluid">
			<div class="section--hero--top">
				<h1 class="section--hero--title">
					<span split>404</span>
				</h1>
			</div>
		</div>
	</section>
	<section class="section--404" fade>
		<div class="container">
			<form class="form">
				<div class="row">
					<div class="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
						<?php the_field('404_text', 'option') ?>
					</div>
				</div>
			</form>
		</div>
	</section>
</main>
<?php
get_footer();
