use csv::{ReaderBuilder, WriterBuilder};
use serde_json::{Map, Value};

#[tauri::command]
pub fn csv_to_json(input: String) -> Result<String, String> {
    let mut reader = ReaderBuilder::new()
        .has_headers(true)
        .from_reader(input.as_bytes());

    let headers: Vec<String> = reader
        .headers()
        .map_err(|e| format!("CSV header error: {}", e))?
        .iter()
        .map(|h| h.to_string())
        .collect();

    let mut records: Vec<Value> = Vec::new();

    for result in reader.records() {
        let record = result.map_err(|e| format!("CSV record error: {}", e))?;
        let mut obj = Map::new();
        for (i, field) in record.iter().enumerate() {
            let key = headers.get(i).cloned().unwrap_or_else(|| format!("col{}", i));
            obj.insert(key, Value::String(field.to_string()));
        }
        records.push(Value::Object(obj));
    }

    serde_json::to_string_pretty(&records).map_err(|e| format!("JSON serialize error: {}", e))
}

#[tauri::command]
pub fn json_to_csv(input: String) -> Result<String, String> {
    let value: Value =
        serde_json::from_str(&input).map_err(|e| format!("JSON parse error: {}", e))?;

    let array = value
        .as_array()
        .ok_or("Expected a JSON array of objects")?;

    if array.is_empty() {
        return Ok(String::new());
    }

    // Collect all unique keys from all objects to build headers
    let mut headers: Vec<String> = Vec::new();
    let mut seen = std::collections::HashSet::new();
    for item in array {
        if let Some(obj) = item.as_object() {
            for key in obj.keys() {
                if seen.insert(key.clone()) {
                    headers.push(key.clone());
                }
            }
        }
    }

    let mut wtr = WriterBuilder::new().from_writer(Vec::new());

    // Write headers
    wtr.write_record(&headers)
        .map_err(|e| format!("CSV write error: {}", e))?;

    // Write records
    for item in array {
        if let Some(obj) = item.as_object() {
            let row: Vec<String> = headers
                .iter()
                .map(|h| {
                    obj.get(h)
                        .map(|v| match v {
                            Value::String(s) => s.clone(),
                            Value::Null => String::new(),
                            other => other.to_string(),
                        })
                        .unwrap_or_default()
                })
                .collect();
            wtr.write_record(&row)
                .map_err(|e| format!("CSV write error: {}", e))?;
        } else {
            return Err("Each element in the JSON array must be an object".to_string());
        }
    }

    let bytes = wtr
        .into_inner()
        .map_err(|e| format!("CSV flush error: {}", e))?;
    String::from_utf8(bytes).map_err(|e| format!("UTF-8 error: {}", e))
}
