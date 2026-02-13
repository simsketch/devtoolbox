#[tauri::command]
pub fn toml_to_json(input: String) -> Result<String, String> {
    let value: toml::Value =
        toml::from_str(&input).map_err(|e| format!("TOML parse error: {}", e))?;
    let json_value = toml_value_to_json(value);
    serde_json::to_string_pretty(&json_value).map_err(|e| format!("JSON serialize error: {}", e))
}

#[tauri::command]
pub fn json_to_toml(input: String) -> Result<String, String> {
    let json_value: serde_json::Value =
        serde_json::from_str(&input).map_err(|e| format!("JSON parse error: {}", e))?;
    let toml_value = json_value_to_toml(json_value)?;
    toml::to_string_pretty(&toml_value).map_err(|e| format!("TOML serialize error: {}", e))
}

fn toml_value_to_json(value: toml::Value) -> serde_json::Value {
    match value {
        toml::Value::String(s) => serde_json::Value::String(s),
        toml::Value::Integer(i) => serde_json::json!(i),
        toml::Value::Float(f) => serde_json::json!(f),
        toml::Value::Boolean(b) => serde_json::Value::Bool(b),
        toml::Value::Datetime(dt) => serde_json::Value::String(dt.to_string()),
        toml::Value::Array(arr) => {
            serde_json::Value::Array(arr.into_iter().map(toml_value_to_json).collect())
        }
        toml::Value::Table(table) => {
            let mut map = serde_json::Map::new();
            for (k, v) in table {
                map.insert(k, toml_value_to_json(v));
            }
            serde_json::Value::Object(map)
        }
    }
}

fn json_value_to_toml(value: serde_json::Value) -> Result<toml::Value, String> {
    match value {
        serde_json::Value::Null => Ok(toml::Value::String("null".to_string())),
        serde_json::Value::Bool(b) => Ok(toml::Value::Boolean(b)),
        serde_json::Value::Number(n) => {
            if let Some(i) = n.as_i64() {
                Ok(toml::Value::Integer(i))
            } else if let Some(f) = n.as_f64() {
                Ok(toml::Value::Float(f))
            } else {
                Err(format!("Unsupported number: {}", n))
            }
        }
        serde_json::Value::String(s) => Ok(toml::Value::String(s)),
        serde_json::Value::Array(arr) => {
            let mut toml_arr = Vec::new();
            for item in arr {
                toml_arr.push(json_value_to_toml(item)?);
            }
            Ok(toml::Value::Array(toml_arr))
        }
        serde_json::Value::Object(obj) => {
            let mut table = toml::map::Map::new();
            for (k, v) in obj {
                table.insert(k, json_value_to_toml(v)?);
            }
            Ok(toml::Value::Table(table))
        }
    }
}
