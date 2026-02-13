use hmac::{Hmac, Mac};
use md5::Md5;
use sha1::Sha1;
use sha2::{Digest, Sha256, Sha512};

#[tauri::command]
pub fn hash_sha1(input: String) -> Result<String, String> {
    let mut hasher = Sha1::new();
    hasher.update(input.as_bytes());
    Ok(hex::encode(hasher.finalize()))
}

#[tauri::command]
pub fn hash_sha256(input: String) -> Result<String, String> {
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    Ok(hex::encode(hasher.finalize()))
}

#[tauri::command]
pub fn hash_sha512(input: String) -> Result<String, String> {
    let mut hasher = Sha512::new();
    hasher.update(input.as_bytes());
    Ok(hex::encode(hasher.finalize()))
}

#[tauri::command]
pub fn hash_md5(input: String) -> Result<String, String> {
    let mut hasher = Md5::new();
    hasher.update(input.as_bytes());
    Ok(hex::encode(hasher.finalize()))
}

#[tauri::command]
pub fn hmac_generate(input: String, key: String, algorithm: String) -> Result<String, String> {
    match algorithm.to_lowercase().as_str() {
        "sha256" => {
            let mut mac = Hmac::<Sha256>::new_from_slice(key.as_bytes())
                .map_err(|e| format!("HMAC key error: {}", e))?;
            mac.update(input.as_bytes());
            let result = mac.finalize();
            Ok(hex::encode(result.into_bytes()))
        }
        "sha512" => {
            let mut mac = Hmac::<Sha512>::new_from_slice(key.as_bytes())
                .map_err(|e| format!("HMAC key error: {}", e))?;
            mac.update(input.as_bytes());
            let result = mac.finalize();
            Ok(hex::encode(result.into_bytes()))
        }
        _ => Err(format!(
            "Unsupported algorithm: {}. Use 'sha256' or 'sha512'.",
            algorithm
        )),
    }
}

#[tauri::command]
pub fn bcrypt_hash(input: String, cost: u32) -> Result<String, String> {
    bcrypt::hash(input, cost).map_err(|e| format!("Bcrypt hash error: {}", e))
}

#[tauri::command]
pub fn bcrypt_verify(input: String, hash: String) -> Result<bool, String> {
    bcrypt::verify(input, &hash).map_err(|e| format!("Bcrypt verify error: {}", e))
}
