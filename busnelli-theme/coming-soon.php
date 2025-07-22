<?php
/**
 * The Coming Soon template file
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Websolute_Starter_Theme
 */


if( ! is_front_page()) {
	wp_redirect("/it/");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Busnelli - Coming Soon</title>
	<style>
		@font-face {
			font-family: "Niveau Grotesk Regular";
			src: url("<?php echo get_stylesheet_directory_uri() ?>/fonts/NiveauGroteskRegular.otf") format("opentype");
		}
		@font-face {
			font-family: "Niveau Grotesk Bold";
			src: url("<?php echo get_stylesheet_directory_uri() ?>/fonts/NiveauGroteskBold.otf") format("opentype");
		}
		@font-face {
			font-family: "Niveau Grotesk Black";
			src: url("<?php echo get_stylesheet_directory_uri() ?>/fonts/NiveauGroteskBlack.otf") format("opentype");
		}
		html, body {
			margin: 0;
			padding: 0;
		}
		.wrapper {
			height: 100vh;
			width: 100%;
			background-image: url(<?php echo get_stylesheet_directory_uri() ?>/images/coming-soon-mobile.jpg);
			background-size: cover;
			background-position: center;
		}
		@media (min-width: 768px) {
			.wrapper {
				background-image: url(<?php echo get_stylesheet_directory_uri() ?>/images/coming-soon-desktop.jpg);
			}
		}


		.logo {
			position: absolute;
			left: 0;
			top: 50px;
			width: 100%;
			display: flex;
			justify-content: center;
		}
		@media (min-width: 768px) {
			.logo {
				width: auto;
				left: 40%;
				top: 100px;
			}
		}

		.logo svg {
			width: 350px;
			height: 59px;
			padding: 30px;
		}

		.text {
			font-family: 'Niveau Grotesk Black', sans-serif;
			color: white;
			font-size: 45px;
			position: absolute;
			bottom: auto;
			top: 180px;
			right: auto;
			width: 100%;
			text-align: center;
		}
		@media (min-width: 768px) {
			.text {
				width: auto;
				bottom: 45px;
				top: auto;
				right: 140px;
				font-size: 80px;
			}
		}
	</style>
</head>
<body>
<section class="wrapper">
	<div class="logo">
		<?php websolute_svg('logo') ?>
	</div>
	<div class="text">
		COMING SOON
	</div>
</section>
</body>
</html>
<?php
