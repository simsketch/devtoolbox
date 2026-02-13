use base64::engine::general_purpose::STANDARD_NO_PAD;
use base64::Engine;
use serde::Serialize;

#[derive(Serialize)]
pub struct JwtParts {
    pub header: serde_json::Value,
    pub payload: serde_json::Value,
    pub signature: String,
}

/// Decode a base64url-encoded string (JWT segments use base64url without padding).
fn decode_b64url(input: &str) -> Result<Vec<u8>, String> {
    // base64url: replace - with + and _ with /
    let standard = input.replace('-', "+").replace('_', "/");
    // Try decoding without padding first, then with padding
    STANDARD_NO_PAD
        .decode(&standard)
        .or_else(|_| {
            let padded = match standard.len() % 4 {
                2 => format!("{}==", standard),
                3 => format!("{}=", standard),
                _ => standard.clone(),
            };
            base64::engine::general_purpose::STANDARD.decode(&padded)
        })
        .map_err(|e| format!("Base64 decode error: {}", e))
}

#[tauri::command]
pub fn jwt_decode(token: String) -> Result<JwtParts, String> {
    let parts: Vec<&str> = token.trim().split('.').collect();
    if parts.len() != 3 {
        return Err("Invalid JWT: expected 3 parts separated by '.'".to_string());
    }

    let header_bytes = decode_b64url(parts[0])?;
    let header_str =
        String::from_utf8(header_bytes).map_err(|e| format!("Header UTF-8 error: {}", e))?;
    let header: serde_json::Value =
        serde_json::from_str(&header_str).map_err(|e| format!("Header JSON parse error: {}", e))?;

    let payload_bytes = decode_b64url(parts[1])?;
    let payload_str =
        String::from_utf8(payload_bytes).map_err(|e| format!("Payload UTF-8 error: {}", e))?;
    let payload: serde_json::Value = serde_json::from_str(&payload_str)
        .map_err(|e| format!("Payload JSON parse error: {}", e))?;

    let signature = parts[2].to_string();

    Ok(JwtParts {
        header,
        payload,
        signature,
    })
}

#[tauri::command]
pub fn jwt_verify(token: String, secret: String, algorithm: String) -> Result<bool, String> {
    let alg = match algorithm.to_uppercase().as_str() {
        "HS256" => jsonwebtoken::Algorithm::HS256,
        "HS384" => jsonwebtoken::Algorithm::HS384,
        "HS512" => jsonwebtoken::Algorithm::HS512,
        "RS256" => jsonwebtoken::Algorithm::RS256,
        "RS384" => jsonwebtoken::Algorithm::RS384,
        "RS512" => jsonwebtoken::Algorithm::RS512,
        _ => return Err(format!("Unsupported algorithm: {}", algorithm)),
    };

    let mut validation = jsonwebtoken::Validation::new(alg);
    validation.validate_exp = false;
    validation.validate_aud = false;
    validation.required_spec_claims.clear();

    let key = jsonwebtoken::DecodingKey::from_secret(secret.as_bytes());

    match jsonwebtoken::decode::<serde_json::Value>(token.trim(), &key, &validation) {
        Ok(_) => Ok(true),
        Err(e) => match e.kind() {
            jsonwebtoken::errors::ErrorKind::InvalidSignature => Ok(false),
            _ => Err(format!("JWT verification error: {}", e)),
        },
    }
}
