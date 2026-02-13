mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .invoke_handler(tauri::generate_handler![
            // Encoding
            commands::encoding::base64_encode,
            commands::encoding::base64_decode,
            commands::encoding::url_encode,
            commands::encoding::url_decode,
            commands::encoding::html_entity_encode,
            commands::encoding::html_entity_decode,
            commands::encoding::gzip_compress,
            commands::encoding::gzip_decompress,
            // Crypto
            commands::crypto::hash_sha1,
            commands::crypto::hash_sha256,
            commands::crypto::hash_sha512,
            commands::crypto::hash_md5,
            commands::crypto::hmac_generate,
            commands::crypto::bcrypt_hash,
            commands::crypto::bcrypt_verify,
            // JWT
            commands::jwt::jwt_decode,
            commands::jwt::jwt_verify,
            // JSON
            commands::json_tools::json_format,
            commands::json_tools::json_minify,
            // Text
            commands::text::text_diff,
            commands::text::case_convert,
            // Generators
            commands::generators::generate_uuid,
            commands::generators::generate_password,
            commands::generators::generate_lorem,
            // DateTime
            commands::datetime::timestamp_to_date,
            commands::datetime::date_to_timestamp,
            commands::datetime::now_timestamp,
            // Color
            commands::color::color_convert,
            // Numbers
            commands::numbers::number_base_convert,
            // YAML
            commands::yaml_tools::yaml_to_json,
            commands::yaml_tools::json_to_yaml,
            // CSV
            commands::csv_tools::csv_to_json,
            commands::csv_tools::json_to_csv,
            // XML
            commands::xml_tools::xml_to_json,
            commands::xml_tools::json_to_xml,
            // TOML
            commands::toml_tools::toml_to_json,
            commands::toml_tools::json_to_toml,
            // Certificates
            commands::certificates::decode_certificate,
            // Pipeline
            commands::pipeline::execute_pipeline,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
