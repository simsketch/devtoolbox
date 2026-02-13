use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use flate2::read::{GzDecoder, GzEncoder};
use flate2::Compression;
use std::io::Read;

#[tauri::command]
pub fn base64_encode(input: String) -> Result<String, String> {
    Ok(STANDARD.encode(input.as_bytes()))
}

#[tauri::command]
pub fn base64_decode(input: String) -> Result<String, String> {
    let bytes = STANDARD
        .decode(input.trim())
        .map_err(|e| format!("Base64 decode error: {}", e))?;
    String::from_utf8(bytes).map_err(|e| format!("UTF-8 conversion error: {}", e))
}

#[tauri::command]
pub fn url_encode(input: String) -> Result<String, String> {
    Ok(urlencoding::encode(&input).into_owned())
}

#[tauri::command]
pub fn url_decode(input: String) -> Result<String, String> {
    urlencoding::decode(&input)
        .map(|s| s.into_owned())
        .map_err(|e| format!("URL decode error: {}", e))
}

#[tauri::command]
pub fn html_entity_encode(input: String) -> Result<String, String> {
    Ok(htmlescape::encode_minimal(&input))
}

#[tauri::command]
pub fn html_entity_decode(input: String) -> Result<String, String> {
    htmlescape::decode_html(&input).map_err(|e| format!("HTML decode error: {:?}", e))
}

#[tauri::command]
pub fn gzip_compress(input: String) -> Result<String, String> {
    let mut encoder = GzEncoder::new(input.as_bytes(), Compression::default());
    let mut compressed = Vec::new();
    encoder
        .read_to_end(&mut compressed)
        .map_err(|e| format!("Gzip compression error: {}", e))?;
    Ok(STANDARD.encode(&compressed))
}

#[tauri::command]
pub fn gzip_decompress(input: String) -> Result<String, String> {
    let compressed = STANDARD
        .decode(input.trim())
        .map_err(|e| format!("Base64 decode error: {}", e))?;
    let mut decoder = GzDecoder::new(&compressed[..]);
    let mut decompressed = String::new();
    decoder
        .read_to_string(&mut decompressed)
        .map_err(|e| format!("Gzip decompression error: {}", e))?;
    Ok(decompressed)
}
