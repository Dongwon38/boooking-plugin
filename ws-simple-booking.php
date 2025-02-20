<?php
/**
 * Plugin Name: WS Simple Booking
 * Description: simple booking plugin
 * Version: 1.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit; // 보안 상의 이유로 직접 접근 방지
}

// React 스크립트 및 스타일을 불러오는 함수
function ws_enqueue_react_app() {
    $plugin_url = plugin_dir_url(__FILE__);
    $manifest_path = plugin_dir_path(__FILE__) . 'build/asset-manifest.json';

    if (!file_exists($manifest_path)) {
        return; // 빌드 파일이 없으면 로딩 안 함
    }

    // JSON 파일 읽어서 경로 가져오기
    $manifest = json_decode(file_get_contents($manifest_path), true);
    
    if (isset($manifest['files']['main.css'])) {
        wp_enqueue_style(
            'ws-simple-booking-style',
            $plugin_url . 'build/' . $manifest['files']['main.css'],
            array(),
            null
        );
    }

    // react script
    if (isset($manifest['files']['main.js'])) {
        wp_enqueue_script(
            'ws-simple-booking-script',
            $plugin_url . 'build/' . $manifest['files']['main.js'],
            array(),
            null,
            true
        );
    }

    // REST API URL을 React로 전달
    wp_localize_script('ws-simple-booking-script', 'wsBookingData', array(
        'restUrl' => esc_url(rest_url('wp/v2/'))
    ));
}
add_action('wp_enqueue_scripts', 'ws_enqueue_react_app');

// 숏코드 추가
function ws_simple_booking_shortcode() {
    return '<div id="ws-booking-root"></div>';
}
add_shortcode('ws_booking', 'ws_simple_booking_shortcode');

// functions.php
require_once plugin_dir_path(__FILE__) . 'includes/functions.php';

// Add styles for the admin page
function ws_enqueue_admin_styles() {
    wp_enqueue_style(
        'ws-simple-booking-admin-style', 
        plugin_dir_url(__FILE__) . 'assets/css/admin-style.css', 
        array(), 
        null, 
        'all'
    );
}
add_action('admin_enqueue_scripts', 'ws_enqueue_admin_styles');

// TEST
add_action('admin_footer', function () {
    ?>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('.booking-status-dropdown').forEach(select => {
                select.addEventListener('change', function () {
                    const postId = this.getAttribute('data-post-id');
                    const newStatus = this.value;

                    fetch(`/wp-json/wp/v2/booking-status/${postId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': '<?php echo wp_create_nonce("wp_rest"); ?>'
                        },
                        body: JSON.stringify({ status: newStatus })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                    })
                    .catch(error => console.error('Error:', error));
                });
            });
        });
    </script>
    <?php
});





// ================================================
// 플러그인 기본 구조
// ws-simple-booking/
// │── ws-simple-booking.php  # 플러그인 메인 파일
// │── package.json           # React 환경 설정
// │── src/                   # React 코드
// │   ├── components/
// │   │   ├── Step1ProgramGroup.js
// │   │   ├── Step2ProgramDetail.js
// │   │   ├── Step3StaffSelection.js
// │   │   ├── Step4DatePicker.js
// │   │   ├── Step5CustomerInfo.js
// │   │   └── BookingModal.js
// │   ├── App.js
// │   ├── index.js
// │── includes/
// │   ├── functions.php       # 예약 처리 로직
// │   └── admin-setting.php  # 관리자 설정 페이지
// │── node_modules/


// summary

// [Part 1. Build a React App]
// 1. install react app // cmd: npx create-react-app 'folder-name'
// 2. build react app locally // src/index.js -> src/App.js -> src/components/....js
// 3. test react app locally // cmd: npm start

// [Part 2. Build it as a WordPress plugin]
// 4. build the react app for live site // cmd: npm run build
// 5. create a main plugin PHP file // ws-simple-booking.php
// 6. enqueue build files in plugin // wp_enqueue_script, wp_enqueue_style
// 7. compress ['build' folder(react) and plugin files(php)] and upload to WordPress
// 8. create a shortcode to add the react app to the page

// [optional. adding Tailwind CSS to react app]
// 1. install tailwindcss
// npm install -D tailwindcss postcss autoprefixer
// npx tailwindcss init -p
// 2. create a tailwind.config.js file and add the following code
/** @type {import('tailwindcss').Config} */
// module.exports = {
//     content: ["./src/**/*.{js,jsx,ts,tsx,html}"], // files to scan for classes
//     theme: {
//       extend: {},
//     },
//     plugins: [],
//   }
// 3. add tailwindcss to the project // src/index.css 
// @tailwind base;
// @tailwind components;
// @tailwind utilities;

// [Part 3. Add REST API to the plugin]
// 1. add REST API to the plugin // wp_localize_script
// wp_localize_script('ws-simple-booking-script', 'wsBookingData', array(
//     'restUrl' => esc_url(rest_url('wp/v2/'))
// ));
// 2. create a custom hook to fetch data // src/hooks/useFetch.js
// 3. fetch data from the REST API to where it's needed 
// import useFetch from "../hooks/useFetch";
// const { data: technicians, loading: techniciansLoading } = useFetch("technician"); 
// return (<>
//      {technicians?.map((technician) => (
//          <button key={technician.id} value={technician.id}>
//            {technician.title.rendered}
//          </button>
//       ))}
//      </>)