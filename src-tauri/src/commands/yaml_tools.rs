#[tauri::command]
pub fn yaml_to_json(input: String) -> Result<String, String> {
    let value: serde_json::Value =
        serde_yaml::from_str(&input).map_err(|e| format!("YAML parse error: {}", e))?;
    serde_json::to_string_pretty(&value).map_err(|e| format!("JSON serialize error: {}", e))
}

#[tauri::command]
pub fn json_to_yaml(input: String) -> Result<String, String> {
    let value: serde_json::Value =
        serde_json::from_str(&input).map_err(|e| format!("JSON parse error: {}", e))?;
    serde_yaml::to_string(&value).map_err(|e| format!("YAML serialize error: {}", e))
}
