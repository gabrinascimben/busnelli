<?php

/**
 * Define constants
 */
define( 'WS_THEME_VERSION', '1.0.1' );
define( 'WS_THEME_PATH', plugin_dir_path( __FILE__ ) );
define( 'WS_THEME_URI', get_template_directory_uri() );

/**
 * Include theme files
 */
$ws_theme_inclusions = [
	'acf',
	'cpt',
	'debloat',
	'rewrites',
	'search',
	'security',
	'setup',
	'scripts',
	'template-functions',
	'template-tags',
];

foreach( $ws_theme_inclusions as $file ) {

	require WS_THEME_PATH . 'inc/' . $file . '.php';

}
