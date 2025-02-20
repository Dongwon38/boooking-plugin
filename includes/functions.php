<?php
// functions.php

// 예약용 커스텀 포스트 타입 등록
function ws_register_booking_post_type() {
    register_post_type('booking', [
        'labels' => [
            'name' => 'Bookings',
            'singular_name' => 'Booking',
        ],
        'public' => true,
        'show_in_rest' => true, // REST API에서 사용
        'supports' => ['title', 'editor', 'custom-fields'],
        'capability_type' => 'post',
        'capabilities' => array(
            'create_posts' => 'do_not_allow', 
        ),
        'map_meta_cap' => true,
        'rewrite' => ['slug' => 'booking'], 
    ]);

    flush_rewrite_rules(); 

}
add_action('init', 'ws_register_booking_post_type');

// 비회원도 예약 가능하도록 설정
function allow_guest_booking($caps, $cap, $user_id, $args) {
    if ($cap === 'edit_post' && get_post_type($args[0]) === 'booking') {
        $caps = array('edit_posts'); // 비회원도 예약 가능하도록 설정
    }
    if ($cap === 'publish_post' && get_post_type($args[0]) === 'booking') {
        $caps = array('publish_posts'); // 예약을 게시할 수 있도록 허용
    }
    if ($cap === 'create_posts' && get_post_type($args[0]) === 'booking') {
        $caps = array('edit_posts'); // 비회원도 예약을 생성 가능하도록 설정
    }
    return $caps;
}
add_filter('map_meta_cap', 'allow_guest_booking', 10, 4);

function add_booking_meta_boxes() {
    add_meta_box(
        'booking_details', 
        'Booking Details', 
        'render_booking_meta_box', 
        'booking', 
        'normal', 
        'default'
    );
}
add_action('add_meta_boxes', 'add_booking_meta_boxes');

function render_booking_meta_box($post) {
    // 저장된 예약 정보 가져오기
    $booking_status = get_post_meta($post->ID, 'booking_status', true);
    $program_name = get_post_meta($post->ID, 'program_name', true);
    $technician = get_post_meta($post->ID, 'technician', true);
    $date = get_post_meta($post->ID, 'date', true);
    $time = get_post_meta($post->ID, 'time', true);
    $customer_name = get_post_meta($post->ID, 'customer_name', true);
    $customer_email = get_post_meta($post->ID, 'customer_email', true);
    $customer_phone = get_post_meta($post->ID, 'customer_phone', true);
    ?>

    <div class="booking-form">
        <div class="form-group">
            <label for="booking_status" class="form-label">Status:</label>
            <select name="booking_status" id="booking_status" class="form-input">
                <option value="draft" <?php selected($booking_status, 'draft'); ?>>⚪ Draft</option>
                <option value="booked" <?php selected($booking_status, 'booked'); ?>>🟡 Booked</option>
                <option value="checked" <?php selected($booking_status, 'checked'); ?>>🟢 Checked</option>
                <option value="completed" <?php selected($booking_status, 'completed'); ?>>🔵 Completed</option>
                <option value="survey_sent" <?php selected($booking_status, 'survey_sent'); ?>>💜 Survey Sent</option>
                <option value="canceled" <?php selected($booking_status, 'canceled'); ?>>⚫ Canceled</option>
                <option value="no_show" <?php selected($booking_status, 'no_show'); ?>>🔴 No Show</option>
            </select>
        </div>

        <div class="form-group">
            <label for="program_name" class="form-label">Program:</label>
            <input type="text" id="program_name" name="program_name" value="<?php echo esc_attr($program_name); ?>" class="form-input" />
        </div>

        <div class="form-group">
            <label for="technician" class="form-label">Technician:</label>
            <input type="text" id="technician" name="technician" value="<?php echo esc_attr($technician); ?>" class="form-input" />
        </div>

        <div class="form-group">
            <label for="date" class="form-label">Booking Date:</label>
            <input type="date" id="date" name="date" value="<?php echo esc_attr($date); ?>" class="form-input" />
        </div>

        <div class="form-group">
            <label for="time" class="form-label">Booking Time:</label>
            <input type="time" id="time" name="time" value="<?php echo esc_attr($time); ?>" class="form-input" />
        </div>

        <div class="form-group">
            <label for="customer_name" class="form-label">Customer Name:</label>
            <input type="text" id="customer_name" name="customer_name" value="<?php echo esc_attr($customer_name); ?>" class="form-input" />
        </div>

        <div class="form-group">
            <label for="customer_email" class="form-label">Customer Email:</label>
            <input type="email" id="customer_email" name="customer_email" value="<?php echo esc_attr($customer_email); ?>" class="form-input" />
        </div>

        <div class="form-group">
            <label for="customer_phone" class="form-label">Customer Phone:</label>
            <input type="text" id="customer_phone" name="customer_phone" value="<?php echo esc_attr($customer_phone); ?>" class="form-input" />
        </div>
    </div>
    <?php
}

function save_booking_details($post_id) {
    if (isset($_POST['booking_status'])) {
        update_post_meta($post_id, 'booking_status', sanitize_text_field($_POST['booking_status']));
    }
    if (isset($_POST['program_name'])) {
        update_post_meta($post_id, 'program_name', sanitize_text_field($_POST['program_name']));
    }
    if (isset($_POST['technician'])) {
        update_post_meta($post_id, 'technician', sanitize_text_field($_POST['technician']));
    }
    if (isset($_POST['date'])) {
        update_post_meta($post_id, 'date', sanitize_text_field($_POST['date']));
    }
    if (isset($_POST['time'])) {
        update_post_meta($post_id, 'time', sanitize_text_field($_POST['time']));
    }
    if (isset($_POST['customer_name'])) {
        update_post_meta($post_id, 'customer_name', sanitize_text_field($_POST['customer_name']));
    }
    if (isset($_POST['customer_email'])) {
        update_post_meta($post_id, 'customer_email', sanitize_email($_POST['customer_email']));
    }
    if (isset($_POST['customer_phone'])) {
        update_post_meta($post_id, 'customer_phone', sanitize_text_field($_POST['customer_phone']));
    }
}
add_action('save_post', 'save_booking_details');

function ws_register_booking_routes() {
    register_rest_route('wp/v2', '/booking', [
        'methods' => 'POST',
        'callback' => 'ws_create_booking',
        'permission_callback' => '__return_true', // 인증 없이 API 호출 가능
    ]);
}
add_action('rest_api_init', 'ws_register_booking_routes');

// 예약 정보 저장
function ws_create_booking(WP_REST_Request $request) {
    $params = $request->get_params();

    $post_id = wp_insert_post([
        'post_title'   => sanitize_text_field($params['title']),
        'post_status'  => 'publish', // 자동 게시
        'post_type'    => 'booking',
    ]);

    if (is_wp_error($post_id)) {
        return new WP_Error('create_booking_failed', 'Failed to create booking', ['status' => 500]);
    }

    // 예약 상세 정보 저장
    if (!empty($params['fields'])) {
        foreach ($params['fields'] as $key => $value) {
            update_post_meta($post_id, $key, sanitize_text_field($value));
        }
    }

    return new WP_REST_Response(['message' => 'Booking created successfully', 'id' => $post_id], 200);
}


// 1. 예약 리스트에 추가할 컬럼 정의
function ws_add_booking_columns($columns) {
    $columns['booking_status'] = 'Status';
    $columns['booking_date'] = 'Booking Date';
    $columns['booking_time'] = 'Time';
    $columns['program_name'] = 'Program';
    $columns['program_price'] = 'Price';
    $columns['technician'] = 'Technician';
    $columns['customer_phone'] = 'Phone';
    $columns['customer_email'] = 'Email';
    return $columns;
}
add_filter('manage_edit-booking_columns', 'ws_add_booking_columns');

// 2. 각 컬럼에 데이터 출력
function ws_fill_booking_columns($column, $post_id) {
    switch ($column) {
        case 'booking_date':
            echo get_post_meta($post_id, 'date', true);
            break;
        case 'booking_time':
            echo get_post_meta($post_id, 'time', true);
            break;
        case 'program_name':
            echo get_post_meta($post_id, 'program_name', true);
            break;
        case 'program_price':
            echo get_post_meta($post_id, 'program_price', true);
            break;
        case 'technician':
            echo get_post_meta($post_id, 'technician', true);
            break;
        case 'customer_phone':
            echo get_post_meta($post_id, 'customer_phone', true);
            break;
        case 'customer_email':
            echo get_post_meta($post_id, 'customer_email', true);
            break;
        case 'booking_status': 
            $current_status = get_post_meta($post_id, 'booking_status', true);

            $status_options = [
                'draft' => '⚪ Draft',
                'booked' => '🟡 Booked',
                'checked' => '🟢 Checked',
                'completed' => '🔵 Completed',
                'survey_sent' => '💜 Survey Sent',
                'canceled' => '⚫ Canceled',
                'no_show' => '🔴 No Show'
            ];

            echo '<select class="booking-status-dropdown" data-post-id="' . $post_id . '">';
            foreach ($status_options as $value => $label) {
                echo '<option value="' . esc_attr($value) . '" ' . selected($current_status, $value, false) . '>' . esc_html($label) . '</option>';
            }
            echo '</select>';
            break;

            // $booking_status = get_post_meta($post_id, 'booking_status', true);           
            // $status_class = '';
            // switch ($booking_status) {
            //     case 'draft':
            //         $status_class = 'status-draft';
            //         break;
            //     case 'booked':
            //         $status_class = 'status-booked';
            //         break;
            //     case 'completed':
            //         $status_class = 'status-completed';
            //         break;
            //     case 'checked':
            //         $status_class = 'status-checked';
            //         break;
            //     case 'survey_sent':
            //         $status_class = 'status-survey-sent';
            //         break;
            //     case 'canceled':
            //         $status_class = 'status-canceled';
            //         break;
            //     case 'no_show':
            //         $status_class = 'status-no-show';
            //         break;
            // }
            // echo '<span class="status-label ' . $status_class . '">' . ucfirst($booking_status) . '</span>';
            // break;
    }
}
add_action('manage_booking_posts_custom_column', 'ws_fill_booking_columns', 10, 2);

// 예약 리스트에서 정렬 가능하도록 설정
function ws_make_booking_columns_sortable($sortable_columns) {
    $sortable_columns['booking_date'] = 'booking_date';
    return $sortable_columns;
}
add_filter('manage_edit-booking_sortable_columns', 'ws_make_booking_columns_sortable');

// 예약 날짜 기준으로 정렬하기
function ws_sort_booking_columns($query) {
    if (!is_admin() || !$query->is_main_query()) return;

    if ($orderby = $query->get('orderby')) {
        if ($orderby == 'booking_date') {
            $query->set('meta_key', 'date');
            $query->set('orderby', 'meta_value');
        }
    }
}
add_action('pre_get_posts', 'ws_sort_booking_columns');


// 다음과 같은 REST API 엔드포인트를 추가하여 특정 테크니션의 기존 예약을 가져올 수 있습니다.
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/bookings', [
        'methods'  => 'GET',
        'callback' => 'get_existing_bookings',
        'permission_callback' => '__return_true'
    ]);
});

function get_existing_bookings($request) {
    $params = $request->get_params();
    $technician = isset($params['technician']) ? sanitize_text_field($params['technician']) : '';

    if (!$technician) {
        return new WP_Error('no_technician', 'Technician is required', array('status' => 400));
    }

    $args = array(
        'post_type'      => 'booking',
        'post_status'    => 'publish',
        'meta_query'     => array(
            array(
                'key'   => 'technician',
                'value' => $technician,
                'compare' => '='
            )
        )
    );

    $query = new WP_Query($args);
    $bookings = [];

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $bookings[] = array(
                'id'        => get_the_ID(),
                'date'      => get_post_meta(get_the_ID(), 'date', true),
                'time'      => get_post_meta(get_the_ID(), 'time', true),
                'duration'  => get_post_meta(get_the_ID(), 'program_duration', true)
            );
        }
        wp_reset_postdata();
    }

    return rest_ensure_response($bookings);
}


// 특정 조건을 만족하는 사용자만 접근하도록 설정
function restrict_booking_page() {
    // 'booking' 커스텀 포스트 타입에 접근할 때
    if (is_singular('booking')) { // 수정: is_page()에서 is_singular()로 변경
        // 로그인하지 않은 경우나 에디터 이하 권한인 경우
        if (!is_user_logged_in() || !current_user_can('edit_others_posts')) {
            wp_redirect(home_url()); // 홈으로 리다이렉트
            exit();
        }
    }
}
add_action('template_redirect', 'restrict_booking_page');



// 프로그램(Program) CPT 등록
function register_custom_post_types() {
    register_post_type('program', array(
        'labels'      => array(
            'name'          => __('Programs'),
            'singular_name' => __('Program'),
        ),
        'public'      => true,
        'has_archive' => true,
		'show_in_rest'    => true, // REST API에서 사용 가능하게 설정
        'supports'    => array('title', 'editor', 'thumbnail'),
    ));

    // 테크니션(Technician) CPT 등록
    register_post_type('technician', array(
        'labels'      => array(
            'name'          => __('Technicians'),
            'singular_name' => __('Technician'),
        ),
        'public'      => true,
        'has_archive' => true,
		'show_in_rest'    => true, // REST API에서 사용 가능하게 설정
        'supports'    => array('title', 'editor', 'thumbnail'),
    ));
}
add_action('init', 'register_custom_post_types');


// TEST
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/booking-status/(?P<id>\d+)', [
        'methods' => 'POST',
        'callback' => 'update_booking_status',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        },
    ]);
});

function update_booking_status(WP_REST_Request $request) {
    $post_id = $request['id'];
    $status = sanitize_text_field($request->get_param('status'));

    if (!$post_id || !$status) {
        return new WP_Error('missing_data', 'Missing post ID or status', ['status' => 400]);
    }

    update_post_meta($post_id, 'booking_status', $status);

    return rest_ensure_response([
        'message' => 'Booking status updated',
        'status' => $status
    ]);
}




// WP Theme - functions.php에 추가
// REST API에서 Program CPT에 ACF 데이터 포함
// function ws_add_acf_to_program_api() {
//     register_rest_field('program', 'acf', [
//         'get_callback' => function ($post) {
//             return get_fields($post['id']);
//         },
//         'schema' => null,
//     ]);
// 	register_rest_field('technician', 'acf', [
//         'get_callback' => function ($post) {
//             return get_fields($post['id']);
//         },
//         'schema' => null,
//     ]);
// }
// add_action('rest_api_init', 'ws_add_acf_to_program_api');
