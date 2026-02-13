use quick_xml::events::Event;
use quick_xml::Reader;
use serde_json::{json, Map, Value};

#[tauri::command]
pub fn xml_to_json(input: String) -> Result<String, String> {
    let mut reader = Reader::from_str(&input);
    reader.config_mut().trim_text(true);

    let value = parse_xml_element(&mut reader, None)?;
    serde_json::to_string_pretty(&value).map_err(|e| format!("JSON serialize error: {}", e))
}

/// Recursively parse XML events into a serde_json::Value.
/// If `current_tag` is Some, we are inside an element and should collect children until the
/// matching End event.
fn parse_xml_element(reader: &mut Reader<&[u8]>, current_tag: Option<&str>) -> Result<Value, String> {
    let mut children: Map<String, Value> = Map::new();
    let mut text_content = String::new();
    let mut buf = Vec::new();

    loop {
        match reader.read_event_into(&mut buf).map_err(|e| format!("XML parse error: {}", e))? {
            Event::Start(e) => {
                let tag_name = String::from_utf8_lossy(e.name().as_ref()).to_string();
                let child_value = parse_xml_element(reader, Some(&tag_name))?;

                // Handle multiple children with same tag name by converting to array
                if let Some(existing) = children.remove(&tag_name) {
                    match existing {
                        Value::Array(mut arr) => {
                            arr.push(child_value);
                            children.insert(tag_name, Value::Array(arr));
                        }
                        other => {
                            children.insert(tag_name, Value::Array(vec![other, child_value]));
                        }
                    }
                } else {
                    children.insert(tag_name, child_value);
                }
            }
            Event::Text(e) => {
                let t = e.unescape().map_err(|err| format!("XML text error: {}", err))?;
                text_content.push_str(&t);
            }
            Event::CData(e) => {
                let t = String::from_utf8_lossy(&e.into_inner()).to_string();
                text_content.push_str(&t);
            }
            Event::End(_) => {
                // We hit the end tag for current_tag
                break;
            }
            Event::Empty(e) => {
                let tag_name = String::from_utf8_lossy(e.name().as_ref()).to_string();
                // Self-closing tag: treat as empty string or null
                if let Some(existing) = children.remove(&tag_name) {
                    match existing {
                        Value::Array(mut arr) => {
                            arr.push(Value::Null);
                            children.insert(tag_name, Value::Array(arr));
                        }
                        other => {
                            children.insert(tag_name, Value::Array(vec![other, Value::Null]));
                        }
                    }
                } else {
                    children.insert(tag_name, Value::Null);
                }
            }
            Event::Eof => {
                if current_tag.is_some() {
                    return Err("Unexpected end of XML".to_string());
                }
                break;
            }
            Event::Decl(_) | Event::PI(_) | Event::Comment(_) | Event::DocType(_) => {
                // Skip processing instructions, comments, declarations
            }
        }
        buf.clear();
    }

    // If we have no children, return the text content as a string value
    if children.is_empty() {
        if text_content.is_empty() {
            if current_tag.is_some() {
                return Ok(Value::Null);
            }
            return Ok(json!({}));
        }
        return Ok(Value::String(text_content));
    }

    // If we have both text and children, add text as "#text"
    if !text_content.is_empty() {
        children.insert("#text".to_string(), Value::String(text_content));
    }

    Ok(Value::Object(children))
}

#[tauri::command]
pub fn json_to_xml(input: String) -> Result<String, String> {
    let value: Value =
        serde_json::from_str(&input).map_err(|e| format!("JSON parse error: {}", e))?;
    let mut xml = String::from("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
    value_to_xml(&value, None, &mut xml, 0);
    Ok(xml)
}

fn value_to_xml(value: &Value, tag: Option<&str>, xml: &mut String, depth: usize) {
    let indent = "  ".repeat(depth);

    match value {
        Value::Object(obj) => {
            if let Some(tag) = tag {
                xml.push_str(&format!("{}<{}>\n", indent, tag));
            }
            for (key, val) in obj {
                if key == "#text" {
                    if let Value::String(s) = val {
                        xml.push_str(&format!("{}{}\n", "  ".repeat(depth + if tag.is_some() { 1 } else { 0 }), escape_xml(s)));
                    }
                } else {
                    match val {
                        Value::Array(arr) => {
                            for item in arr {
                                value_to_xml(item, Some(key), xml, depth + if tag.is_some() { 1 } else { 0 });
                            }
                        }
                        _ => {
                            value_to_xml(val, Some(key), xml, depth + if tag.is_some() { 1 } else { 0 });
                        }
                    }
                }
            }
            if let Some(tag) = tag {
                xml.push_str(&format!("{}</{}>\n", indent, tag));
            }
        }
        Value::Array(arr) => {
            let tag_name = tag.unwrap_or("item");
            for item in arr {
                value_to_xml(item, Some(tag_name), xml, depth);
            }
        }
        Value::String(s) => {
            if let Some(tag) = tag {
                xml.push_str(&format!("{}<{}>{}</{}>\n", indent, tag, escape_xml(s), tag));
            } else {
                xml.push_str(&format!("{}{}\n", indent, escape_xml(s)));
            }
        }
        Value::Number(n) => {
            let s = n.to_string();
            if let Some(tag) = tag {
                xml.push_str(&format!("{}<{}>{}</{}>\n", indent, tag, s, tag));
            } else {
                xml.push_str(&format!("{}{}\n", indent, s));
            }
        }
        Value::Bool(b) => {
            let s = b.to_string();
            if let Some(tag) = tag {
                xml.push_str(&format!("{}<{}>{}</{}>\n", indent, tag, s, tag));
            } else {
                xml.push_str(&format!("{}{}\n", indent, s));
            }
        }
        Value::Null => {
            if let Some(tag) = tag {
                xml.push_str(&format!("{}<{}/>\n", indent, tag));
            }
        }
    }
}

fn escape_xml(input: &str) -> String {
    input
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&apos;")
}
