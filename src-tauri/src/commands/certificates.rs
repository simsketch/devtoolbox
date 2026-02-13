use serde::Serialize;
use x509_parser::prelude::*;

#[derive(Serialize)]
pub struct CertInfo {
    pub subject: String,
    pub issuer: String,
    pub not_before: String,
    pub not_after: String,
    pub serial: String,
    pub algorithm: String,
}

#[tauri::command]
pub fn decode_certificate(input: String) -> Result<CertInfo, String> {
    let trimmed = input.trim();

    // Try PEM first
    let der_bytes = if trimmed.starts_with("-----BEGIN") {
        let pem_data =
            ::pem::parse(trimmed.as_bytes()).map_err(|e| format!("PEM parse error: {}", e))?;
        pem_data.into_contents()
    } else {
        // Try raw base64 (DER encoded as base64)
        use base64::engine::general_purpose::STANDARD;
        use base64::Engine;

        let cleaned: String = trimmed.chars().filter(|c| !c.is_whitespace()).collect();
        STANDARD
            .decode(&cleaned)
            .map_err(|e| format!("Base64 decode error: {}. Input should be PEM or base64-encoded DER.", e))?
    };

    let (_, cert) = X509Certificate::from_der(&der_bytes)
        .map_err(|e| format!("X.509 parse error: {}", e))?;

    let subject = cert.subject().to_string();
    let issuer = cert.issuer().to_string();
    let not_before = cert.validity().not_before.to_string();
    let not_after = cert.validity().not_after.to_string();

    // Format serial number as colon-separated hex
    let serial = cert
        .tbs_certificate
        .raw_serial()
        .iter()
        .map(|b| format!("{:02x}", b))
        .collect::<Vec<_>>()
        .join(":");

    let algorithm = cert.signature_algorithm.algorithm.to_string();

    Ok(CertInfo {
        subject,
        issuer,
        not_before,
        not_after,
        serial,
        algorithm,
    })
}
