use serde_json::Value;

#[tauri::command]
pub fn json_format(input: String, indent: u32) -> Result<String, String> {
    let parsed: Value =
        serde_json::from_str(&input).map_err(|e| format!("JSON parse error: {}", e))?;

    if indent == 0 {
        // No indentation means compact
        serde_json::to_string(&parsed).map_err(|e| format!("JSON format error: {}", e))
    } else {
        // Build custom indentation string
        let indent_str = " ".repeat(indent as usize);
        let formatter = serde_json::ser::PrettyFormatter::with_indent(indent_str.as_bytes());
        let mut buf = Vec::new();
        let mut ser = serde_json::Serializer::with_formatter(&mut buf, formatter);
        serde::Serialize::serialize(&parsed, &mut ser)
            .map_err(|e| format!("JSON format error: {}", e))?;
        String::from_utf8(buf).map_err(|e| format!("UTF-8 error: {}", e))
    }
}

#[tauri::command]
pub fn json_minify(input: String) -> Result<String, String> {
    let parsed: Value =
        serde_json::from_str(&input).map_err(|e| format!("JSON parse error: {}", e))?;
    serde_json::to_string(&parsed).map_err(|e| format!("JSON minify error: {}", e))
}
