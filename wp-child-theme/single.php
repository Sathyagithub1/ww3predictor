<?php
/**
 * WW3 Child Theme — Single Post Template
 * Styles served via wp_head through functions.php.
 */
get_header(); ?>

<main id="main" class="ww3-single-main">

  <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

  <article id="post-<?php the_ID(); ?>" class="ww3-article">

    <header class="ww3-entry-header">
      <h1 class="ww3-entry-title"><?php the_title(); ?></h1>
      <div class="ww3-entry-meta">
        <span><?php echo esc_html( get_the_date() ); ?></span>
        <?php if ( get_the_author() ) : ?>
          <span>&nbsp;&middot;&nbsp;<?php the_author(); ?></span>
        <?php endif; ?>
        <?php
        $cats = get_the_category();
        if ( $cats ) {
          echo '&nbsp;&middot;&nbsp;<span>' . esc_html( $cats[0]->name ) . '</span>';
        }
        ?>
      </div>
    </header>

    <?php if ( has_post_thumbnail() ) : ?>
    <div class="ww3-feat-image">
      <?php the_post_thumbnail( 'large', [ 'class' => 'ww3-thumb', 'loading' => 'eager' ] ); ?>
    </div>
    <?php endif; ?>

    <div class="ww3-entry-content">
      <?php
      the_content();
      wp_link_pages( [
        'before' => '<div class="ww3-page-links">Pages:',
        'after'  => '</div>',
      ] );
      ?>
    </div>

    <footer class="ww3-entry-footer">
      <?php
      $tags = get_the_tags();
      if ( $tags ) {
        echo '<div class="ww3-tags">';
        foreach ( $tags as $tag ) {
          echo '<a href="' . esc_url( get_tag_link( $tag ) ) . '" class="ww3-tag">'
             . esc_html( $tag->name ) . '</a>';
        }
        echo '</div>';
      }
      ?>
    </footer>

  </article>

  <?php
  the_post_navigation( [
    'prev_text' => '<span class="ww3-nav-label">&#8592; Previous</span><span class="ww3-nav-title">%title</span>',
    'next_text' => '<span class="ww3-nav-label">Next &#8594;</span><span class="ww3-nav-title">%title</span>',
  ] );
  ?>

  <?php if ( comments_open() || get_comments_number() ) : ?>
    <div class="ww3-comments">
      <?php comments_template(); ?>
    </div>
  <?php endif; ?>

  <?php endwhile; endif; ?>

</main>

<?php get_footer(); ?>
