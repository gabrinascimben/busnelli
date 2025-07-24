<?php
/**
 * Handle all scripts and styles
 *
 * @package Websolute_Starter_Theme
 */

/**
 * Enqueue scripts and styles.
 */
function websolute_starter_theme_scripts() {

	wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css?family=Poppins:400,600&display=swap', [], WS_THEME_VERSION );
	wp_enqueue_style( 'vendor', WS_THEME_URI . '/css/vendors.min.css', [], WS_THEME_VERSION );
	wp_enqueue_style( 'main', WS_THEME_URI . '/css/_main.css', ['vendor'], WS_THEME_VERSION );
	wp_enqueue_style( 'theme', WS_THEME_URI . '/css/styles.css', ['main'], WS_THEME_VERSION );

	wp_enqueue_script( 'polyfill', 'https://polyfill.io/v3/polyfill.min.js?features=es5%2CArray.prototype.find%2CObject.assign', [], WS_THEME_VERSION, true );
	wp_enqueue_script( 'vendor', WS_THEME_URI . '/js/vendors.min.js', ['polyfill'], WS_THEME_VERSION, true );
	wp_enqueue_script( 'main', WS_THEME_URI . '/js/vanilla/main_es5_iife.min.js', ['vendor'], WS_THEME_VERSION, true );
	wp_enqueue_script( 'theme', WS_THEME_URI . '/js/scripts.js', ['main'], WS_THEME_VERSION, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'websolute_starter_theme_scripts' );
