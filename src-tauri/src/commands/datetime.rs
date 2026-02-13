use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};

#[tauri::command]
pub fn timestamp_to_date(timestamp: i64, format: String) -> Result<String, String> {
    // Try seconds first, then milliseconds
    let dt = if let Some(dt) = DateTime::from_timestamp(timestamp, 0) {
        dt
    } else if let Some(dt) = DateTime::from_timestamp(timestamp / 1000, ((timestamp % 1000) * 1_000_000) as u32) {
        dt
    } else {
        return Err(format!("Invalid timestamp: {}", timestamp));
    };

    let fmt = if format.is_empty() {
        "%Y-%m-%d %H:%M:%S UTC".to_string()
    } else {
        format
    };

    Ok(dt.format(&fmt).to_string())
}

#[tauri::command]
pub fn date_to_timestamp(date_str: String, format: String) -> Result<i64, String> {
    let fmt = if format.is_empty() {
        "%Y-%m-%d %H:%M:%S".to_string()
    } else {
        format
    };

    // Try parsing with timezone info first (using DateTime<Utc>)
    if let Ok(dt) = DateTime::parse_from_str(&date_str, &fmt) {
        return Ok(dt.timestamp());
    }

    // Fall back to NaiveDateTime (no timezone) and assume UTC
    let naive = NaiveDateTime::parse_from_str(&date_str, &fmt)
        .map_err(|e| format!("Date parse error: {}. Expected format: {}", e, fmt))?;

    let dt: DateTime<Utc> = Utc.from_utc_datetime(&naive);
    Ok(dt.timestamp())
}

#[tauri::command]
pub fn now_timestamp() -> Result<i64, String> {
    Ok(Utc::now().timestamp())
}
