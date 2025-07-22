<?php
/**
 * Filter search results to only return products and posts
 *
 * @param WP_Query $query The query to filter
 * @return WP_Query
 */
function websolute_search_filter( $query ) {

    if ( $query->is_search ) {
       $query->set( 'post_type', array( 'product', 'post' ) );
       $query->set( 'posts_per_page', -1 );
    }

    return $query;
}
add_filter( 'pre_get_posts', 'websolute_search_filter' );
