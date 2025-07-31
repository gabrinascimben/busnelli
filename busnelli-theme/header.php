<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Websolute_Starter_Theme
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<!-- Google Tag Manager -->
	<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-WXLRLZV');</script>
	<!-- End Google Tag Manager -->

	<?php wp_head(); ?>

	<link rel="canonical" href="<?php the_permalink(); ?>" />


	<?php
	// Product structured data
	// https://developers.google.com/search/docs/appearance/structured-data/product?hl=it
	if ( is_singular('product') ) : ?>
		<script type="application/ld+json">
			{
				"@context": "https://schema.org/",
				"@type": "Product",
				"name": "<?php the_title() ?>",
				"image": [
					"<?php echo get_the_post_thumbnail_url( get_the_ID(), 'medium' ) ?>"
				],
				"description": "<?php the_field('excerpt') ?>",
				"brand": {
					"@type": "Brand",
					"name": "Busnelli"
				},
			}
		</script>
	<?php endif; ?>

	<?php
	// News structured data
	// https://developers.google.com/search/docs/appearance/structured-data/article?hl=it
	if ( is_singular('post') ) : ?>
		<script type="application/ld+json">
			{
				"@context": "https://schema.org",
				"@type": "NewsArticle",
				"headline": "<?php the_title() ?>",
				"image": [
					"<?php echo get_the_post_thumbnail_url( null, 'medium' ) ?>"
				],
				"datePublished": "<?php the_time('c') ?>",
				"dateModified": "<?php the_modified_time('c') ?>",
				"author": [{
					"@type": "Organization",
					"name": "Busnelli",
					"url": "https://www.busnelli.com/"
					}
				}]
			}
		</script>
	<?php endif; ?>
</head>

<body <?php body_class(); ?>>

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WXLRLZV"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<div class="preloader">
	<img src="<?php echo get_stylesheet_directory_uri() ?>/images/preloader_brown.gif" />
</div>


<div class="<?php websolute_page_class(); ?>">

<div class="header">
	<div class="header--container">
		<div class="header--wrapper">
			<div class="header--left">
				<a class="header--left--logo" href="/<?php echo apply_filters( 'wpml_current_language', NULL ); ?>/">
					<?php websolute_svg('logo') ?>
				</a>
				<?php websolute_breadcrumb() ?>
			</div>
			<div class="header--language">
				<?php
				// Language switcher
				if ( get_field('enable_language', 'option') || is_user_logged_in() ) {
					websolute_custom_language_switcher();
				}
				?>
			</div>
			<div class="header--search">
				<div class="icon--search">
					<?php websolute_svg('search') ?>
				</div>
			</div>
			<div class="header--toggle">
				<div class="menu--icon "></div>
			</div>
		</div>
	</div>
</div>

<!--<div class="menu--icon floating-icon"></div>-->

<div class="menu">
	<div class="menu--wrapper">
		<div class="menu--backdrop"></div>
		<div class="menu--content">


			<?php
			// Menus
			get_template_part('template-parts/menu', 'primary');
			get_template_part('template-parts/menu', 'secondary');


			// Language switcher
			if ( get_field('enable_language', 'option') || is_user_logged_in() ) {
				websolute_custom_language_switcher_alt();
			}

			// Social menu
			if ( have_rows('social', 'option') ) : ?>
				<div class="menu--social">
					<?php while ( have_rows('social', 'option') ) : the_row(); ?>
						<a href="<?php the_sub_field('url'); ?>" target="_blank" class="menu--social--item">
							<div class="icon--social">
								<?php
								websolute_svg(get_sub_field('network'));
								?>
							</div>
						</a>
					<?php endwhile; ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</div>

<div class="search">
	<div class="container">
		<div class="search--form">
			<form id="searchform" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
				<input type="text" class="search-field" name="s" placeholder="<?php _e('You are searching for...', 'busnelli') ?>">
			</form>
		</div>
	</div>
	<div class="search--toggle">
		<div class="menu--icon "></div>
	</div>
</div>
