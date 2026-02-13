use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Deserialize, Serialize, Clone)]
pub struct PipelineStep {
    pub tool_id: String,
    pub config: Value,
    pub input: String,
}

#[tauri::command]
pub fn execute_pipeline(steps: Vec<PipelineStep>) -> Result<String, String> {
    if steps.is_empty() {
        return Err("Pipeline must have at least one step".to_string());
    }

    let mut current_output = steps[0].input.clone();

    for (i, step) in steps.iter().enumerate() {
        current_output = execute_step(&step.tool_id, &current_output, &step.config)
            .map_err(|e| format!("Pipeline step {} ({}) failed: {}", i + 1, step.tool_id, e))?;
    }

    Ok(current_output)
}

fn execute_step(tool_id: &str, input: &str, config: &Value) -> Result<String, String> {
    match tool_id {
        // Encoding
        "base64_encode" => super::encoding::base64_encode(input.to_string()),
        "base64_decode" => super::encoding::base64_decode(input.to_string()),
        "url_encode" => super::encoding::url_encode(input.to_string()),
        "url_decode" => super::encoding::url_decode(input.to_string()),
        "html_entity_encode" => super::encoding::html_entity_encode(input.to_string()),
        "html_entity_decode" => super::encoding::html_entity_decode(input.to_string()),
        "gzip_compress" => super::encoding::gzip_compress(input.to_string()),
        "gzip_decompress" => super::encoding::gzip_decompress(input.to_string()),

        // Crypto
        "hash_sha1" => super::crypto::hash_sha1(input.to_string()),
        "hash_sha256" => super::crypto::hash_sha256(input.to_string()),
        "hash_sha512" => super::crypto::hash_sha512(input.to_string()),
        "hash_md5" => super::crypto::hash_md5(input.to_string()),

        // JSON
        "json_format" => {
            let indent = config
                .get("indent")
                .and_then(|v| v.as_u64())
                .unwrap_or(2) as u32;
            super::json_tools::json_format(input.to_string(), indent)
        }
        "json_minify" => super::json_tools::json_minify(input.to_string()),

        // Text
        "case_convert" => {
            let to_case = config
                .get("to_case")
                .and_then(|v| v.as_str())
                .unwrap_or("lower")
                .to_string();
            super::text::case_convert(input.to_string(), to_case)
        }

        // YAML
        "yaml_to_json" => super::yaml_tools::yaml_to_json(input.to_string()),
        "json_to_yaml" => super::yaml_tools::json_to_yaml(input.to_string()),

        // TOML
        "toml_to_json" => super::toml_tools::toml_to_json(input.to_string()),
        "json_to_toml" => super::toml_tools::json_to_toml(input.to_string()),

        // CSV
        "csv_to_json" => super::csv_tools::csv_to_json(input.to_string()),
        "json_to_csv" => super::csv_tools::json_to_csv(input.to_string()),

        // XML
        "xml_to_json" => super::xml_tools::xml_to_json(input.to_string()),
        "json_to_xml" => super::xml_tools::json_to_xml(input.to_string()),

        // Number base conversion
        "number_base_convert" => {
            let from_base = config
                .get("from_base")
                .and_then(|v| v.as_u64())
                .unwrap_or(10) as u32;
            let to_base = config
                .get("to_base")
                .and_then(|v| v.as_u64())
                .unwrap_or(16) as u32;
            super::numbers::number_base_convert(input.to_string(), from_base, to_base)
        }

        // Color
        "color_convert" => {
            let from_format = config
                .get("from_format")
                .and_then(|v| v.as_str())
                .unwrap_or("hex")
                .to_string();
            let to_format = config
                .get("to_format")
                .and_then(|v| v.as_str())
                .unwrap_or("rgb")
                .to_string();
            super::color::color_convert(input.to_string(), from_format, to_format)
        }

        _ => Err(format!("Unknown tool: {}", tool_id)),
    }
}
