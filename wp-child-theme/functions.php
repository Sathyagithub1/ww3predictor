<?php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('astra-parent', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('astra-child', get_stylesheet_uri(), ['astra-parent'], '2.5');

    $css = '
        body.ast-plain-container,
        body.ast-plain-container #page,
        body.ast-plain-container #content,
        body.ast-plain-container #primary,
        body.ast-plain-container #main,
        body.ast-plain-container article,
        body.ast-plain-container .hentry,
        body.ast-plain-container .entry {
            background-color: #030712 !important;
        }
        body.ast-plain-container .entry-title,
        body.ast-plain-container .entry-title a { color: #ffffff !important; }
        body.ast-plain-container .entry-meta,
        body.ast-plain-container .entry-meta a { color: #6b7280 !important; }
        body.ast-plain-container .entry-content,
        body.ast-plain-container .entry-content p,
        body.ast-plain-container .entry-content li { color: #d1d5db !important; }
        body.ast-plain-container .entry-content h1,
        body.ast-plain-container .entry-content h2,
        body.ast-plain-container .entry-content h3,
        body.ast-plain-container .entry-content h4 { color: #ffffff !important; }
        body.ast-plain-container .entry-content a { color: #f87171 !important; }
        body.admin-bar .ww3-navbar { top: var(--wp-admin--admin-bar--height, 32px); }
    ';
    wp_add_inline_style('astra-child', $css);
});

add_filter('body_class', function($classes) {
    $classes = array_diff($classes, [
        'ast-separate-container ast-two-container',
        'ast-separate-container',
        'ast-two-container',
    ]);
    $classes[] = 'ast-plain-container';
    return array_values($classes);
}, 999);

// -- CSS variable overrides after all wp_head() styles
add_action('wp_head', function() {
    echo '<style id="ww3-dark-vars">
:root {
  --ast-global-color-4: #030712;
  --ast-global-color-5: #0f172a;
  --ast-global-dark-bg-style: #030712;
  --ast-global-dark-lfs: #111827;
  --ast-widget-bg-color: #030712;
  --ast-comment-inputs-background: #1f2937;
  --ast-code-block-background: #1f2937;
  --ast-title-layout-bg: #030712;
}
body.ast-plain-container,
body.ast-plain-container #page,
body.ast-plain-container #content,
body.ast-plain-container .site-content,
body.ast-plain-container #primary,
body.ast-plain-container .content-area,
body.ast-plain-container #main,
body.ast-plain-container .site-main,
body.ast-plain-container article,
body.ast-plain-container .hentry,
body.ast-plain-container .entry,
body.ast-plain-container .ast-article-inner,
body.ast-plain-container .ast-article-post { background-color: #030712 !important; color: #d1d5db !important; }
body.ast-plain-container h1,
body.ast-plain-container h2,
body.ast-plain-container h3,
body.ast-plain-container h4,
body.ast-plain-container .entry-title,
body.ast-plain-container .entry-title a { color: #fff !important; }
body.ast-plain-container .entry-content,
body.ast-plain-container .entry-content p,
body.ast-plain-container .entry-content li,
body.ast-plain-container .entry-content td { color: #d1d5db !important; }
body.ast-plain-container .entry-content h1,
body.ast-plain-container .entry-content h2,
body.ast-plain-container .entry-content h3,
body.ast-plain-container .entry-content h4 { color: #fff !important; }
body.ast-plain-container .entry-content a { color: #f87171 !important; }
</style>';
}, 999);

// -- In Customizer preview: un-hide Astra header/footer so controls work
add_action('wp_head', function() {
    if (!function_exists('is_customize_preview') || !is_customize_preview()) return;
    echo '<style id="ww3-customizer-compat">
/* In Customizer preview, show Astra native header/footer so controls work */
#masthead, .site-header, header.ast-hfb-header,
#colophon, .site-footer, footer.ast-hfb-footer,
.ast-above-header-bar, .ast-below-header-bar { display: block !important; }
/* Hide our custom navbar/footer in Customizer (Astra controls will manage it) */
.ww3-navbar, .ww3-footer { display: none !important; }
/* Keep dark background */
body { background-color: #030712 !important; color: #d1d5db !important; }
</style>';
}, 1001);

// -- Navbar injected right after <body> opens
add_action('wp_body_open', function() {
    echo '<nav class="ww3-navbar">';
    echo '<div class="ww3-navbar-inner">';
    echo '<a href="https://ww3predictor.com/" class="ww3-logo">';
    echo '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
    echo 'WW3<span class="red">PREDICTOR</span>';
    echo '</a>';
    echo '<div class="ww3-nav-links">';
    echo '<a href="https://ww3predictor.com/">Home</a>';
    echo '<a href="https://ww3predictor.com/news">News</a>';
    echo '<a href="https://ww3predictor.com/blogs" class="active">Blog</a>';
    echo '</div>';
    echo '</div>';
    echo '</nav>';
}, 5);

// -- Footer injected before </body>
add_action('wp_footer', function() {
    $year = date('Y');
    echo '<footer class="ww3-footer">';
    echo '<div class="ww3-footer-inner">';
    echo '<div class="ww3-footer-grid">';
    echo '<div class="ww3-footer-brand">';
    echo '<div class="ww3-logo"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>WW3<span class="red">PREDICTOR</span></div>';
    echo '<p>AI-powered geopolitical risk analysis. Updated every 6 hours.</p>';
    echo '</div>';
    echo '<div class="ww3-footer-col"><h3>Navigation</h3><ul>';
    echo '<li><a href="https://ww3predictor.com/">Home</a></li>';
    echo '<li><a href="https://ww3predictor.com/news">Conflict News</a></li>';
    echo '<li><a href="https://ww3predictor.com/blogs">Blog</a></li>';
    echo '</ul></div>';
    echo '<div class="ww3-footer-col"><h3>Legal</h3><ul>';
    echo '<li><a href="https://ww3predictor.com/privacy">Privacy Policy</a></li>';
    echo '<li><a href="https://ww3predictor.com/contact">Contact</a></li>';
    echo '</ul></div>';
    echo '</div>';
    echo '<div class="ww3-footer-bottom">';
    echo "<p>&copy; {$year} WW3Predictor.com &mdash; For informational purposes only.</p>";
    echo '<p>Powered by Claude AI &middot; NewsAPI</p>';
    echo '</div></div></footer>';
}, 5);

// -- WP-CRON: monitor Next.js on port 3000
add_filter('cron_schedules', function($schedules) {
    $schedules['every5min'] = ['interval' => 300, 'display' => 'Every 5 minutes'];
    return $schedules;
});
if (!wp_next_scheduled('ww3_check_nodejs')) {
    wp_schedule_event(time(), 'every5min', 'ww3_check_nodejs');
}
add_action('ww3_check_nodejs', function() {
    $ch = curl_init('http://127.0.0.1:3000/');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>5,CURLOPT_CONNECTTIMEOUT=>3]);
    $result = curl_exec($ch);
    $code   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($result === false || $code === 0) {
        $lock = '/tmp/ww3_pm2_restart.lock';
        if (!file_exists($lock) || (time() - filemtime($lock)) > 60) {
            @touch($lock);
            $cmd = '/home/u767522705/.nvm/versions/node/v20.20.0/bin/pm2 resurrect >> /home/u767522705/pm2-reboot.log 2>&1 || cd /home/u767522705/domains/ww3predictor.com/app && /home/u767522705/.nvm/versions/node/v20.20.0/bin/pm2 start ecosystem.config.js >> /home/u767522705/pm2-reboot.log 2>&1';
            shell_exec('nohup bash -c ' . escapeshellarg($cmd) . ' > /dev/null 2>&1 &');
        }
    }
});

// -- Astra dynamic CSS override
add_filter('astra_dynamic_theme_css', function($css) {
    $css = str_replace('--ast-global-color-4:#FFFFFF', '--ast-global-color-4:#030712', $css);
    $css = str_replace('--ast-global-color-4: #FFFFFF', '--ast-global-color-4: #030712', $css);
    $css = str_replace('--ast-global-color-5:#F0F5FA', '--ast-global-color-5:#0f172a', $css);
    $css = str_replace('--ast-global-color-5: #F0F5FA', '--ast-global-color-5: #0f172a', $css);
    $css = str_replace('--ast-global-dark-bg-style:#fff', '--ast-global-dark-bg-style:#030712', $css);
    $css = str_replace('--ast-global-dark-lfs:#fbfbfb', '--ast-global-dark-lfs:#111827', $css);
    $css = str_replace('--ast-widget-bg-color:#fafafa', '--ast-widget-bg-color:#030712', $css);
    $css = str_replace('--ast-title-layout-bg:#eeeeee', '--ast-title-layout-bg:#030712', $css);
    $css = str_replace('--ast-comment-inputs-background:#F9FAFB', '--ast-comment-inputs-background:#1f2937', $css);
    $css = str_replace('--ast-comment-inputs-background:#FFF', '--ast-comment-inputs-background:#1f2937', $css);
    $css = str_replace('--ast-code-block-background:#ECEFF3', '--ast-code-block-background:#111827', $css);
    return $css;
}, 1000);

// -- Cache-Control
add_action('send_headers', function() {
    if (!is_admin() && !is_feed()) {
        header('Cache-Control: public, max-age=0, must-revalidate');
    }
});

// -- Single post CSS
add_action('wp_enqueue_scripts', function() {
    if (!is_single()) return;
    $css = '
.ww3-single-main{max-width:800px;margin:0 auto;padding:2rem 1.25rem 4rem;}
.ww3-article{background:#030712!important;color:#d1d5db!important;}
.ww3-entry-header{margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid #1f2937;}
.ww3-entry-title{font-size:clamp(1.6rem,4vw,2.25rem);font-weight:700;color:#fff!important;line-height:1.3;margin:0 0 0.75rem;}
.ww3-entry-meta{color:#6b7280!important;font-size:0.85rem;}
.ww3-entry-content{color:#d1d5db!important;font-size:1.05rem;line-height:1.8;}
.ww3-entry-content h2{font-size:1.5rem;color:#fff!important;margin:2rem 0 1rem;}
.ww3-entry-content h3{font-size:1.25rem;color:#fff!important;margin:2rem 0 1rem;}
.ww3-entry-content h4,.ww3-entry-content h5,.ww3-entry-content h6{color:#fff!important;margin:2rem 0 1rem;}
.ww3-entry-content p{margin:0 0 1.25rem;color:#d1d5db!important;}
.ww3-entry-content a{color:#f87171!important;text-decoration:underline;}
.ww3-entry-content ul,.ww3-entry-content ol{margin:0 0 1.25rem 1.5rem;}
.ww3-entry-content li{color:#d1d5db!important;margin-bottom:0.4rem;}
.ww3-entry-content blockquote{border-left:4px solid #ef4444;margin:1.5rem 0;padding:0.75rem 1.25rem;background:#111827;color:#9ca3af!important;}
.ww3-entry-content img{max-width:100%;height:auto;border-radius:0.5rem;}
.ww3-entry-footer{margin-top:2rem;padding-top:1.5rem;border-top:1px solid #1f2937;}
.ww3-tags{display:flex;flex-wrap:wrap;gap:0.5rem;}
.ww3-tag{background:#1f2937;color:#9ca3af!important;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.8rem;text-decoration:none!important;}
.ww3-tag:hover{background:#374151;color:#f87171!important;}
.post-navigation{display:flex;justify-content:space-between;gap:1rem;margin:2.5rem 0;padding:1.5rem 0;border-top:1px solid #1f2937;}
.post-navigation a{color:#f87171!important;text-decoration:none;font-size:0.9rem;}
.ww3-nav-label{display:block;color:#6b7280!important;font-size:0.75rem;margin-bottom:0.25rem;}
.ww3-nav-title{display:block;color:#d1d5db!important;}
';
    wp_add_inline_style('astra-child', $css);
}, 20);

// -- Google Fonts non-blocking
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('ww3-inter-font','https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',[],null);
}, 1);
add_action('wp_head', function() {
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
}, 1);

// -- Defer Astra JS (correct handle name: astra-flexibility-js)
add_filter('script_loader_tag', function($tag, $handle, $src) {
    // Don't defer in Customizer — Astra needs sync scripts for postMessage
    if (function_exists('is_customize_preview') && is_customize_preview()) return $tag;
    if (in_array($handle, ['astra-theme-js', 'astra-flexibility-js'])) {
        return str_replace('<script ', '<script defer ', $tag);
    }
    return $tag;
}, 10, 3);

// -- SEO meta + OG tags for single posts
add_action('wp_head', function() {
    if (!is_single()) return;
    global $post;
    $desc = has_excerpt() ? wp_strip_all_tags(get_the_excerpt()) : mb_substr(wp_strip_all_tags($post->post_content ?? ''), 0, 160);
    $title = esc_attr(get_the_title());
    $url   = esc_url(get_permalink());
    $desc  = esc_attr($desc);
    $thumb = get_the_post_thumbnail_url($post, 'large') ?: 'https://ww3predictor.com/og-image.jpg';
    echo "<meta name=\"description\" content=\"{$desc}\">\n";
    echo "<meta property=\"og:title\" content=\"{$title}\">\n";
    echo "<meta property=\"og:description\" content=\"{$desc}\">\n";
    echo "<meta property=\"og:url\" content=\"{$url}\">\n";
    echo "<meta property=\"og:image\" content=\"" . esc_url($thumb) . "\">\n";
    echo "<meta property=\"og:type\" content=\"article\">\n";
    echo "<link rel=\"canonical\" href=\"{$url}\">\n";
}, 5);
