use serde::Serialize;
use similar::{ChangeTag, TextDiff};

#[derive(Serialize)]
pub struct DiffChange {
    pub tag: String,
    pub value: String,
}

#[tauri::command]
pub fn text_diff(old_text: String, new_text: String) -> Result<Vec<DiffChange>, String> {
    let diff = TextDiff::from_lines(&old_text, &new_text);

    let changes: Vec<DiffChange> = diff
        .iter_all_changes()
        .map(|change| {
            let tag = match change.tag() {
                ChangeTag::Equal => "equal",
                ChangeTag::Insert => "insert",
                ChangeTag::Delete => "delete",
            };
            DiffChange {
                tag: tag.to_string(),
                value: change.value().to_string(),
            }
        })
        .collect();

    Ok(changes)
}

#[tauri::command]
pub fn case_convert(input: String, to_case: String) -> Result<String, String> {
    let result = match to_case.to_lowercase().as_str() {
        "upper" => input.to_uppercase(),
        "lower" => input.to_lowercase(),
        "title" => to_title_case(&input),
        "camel" => to_camel_case(&input),
        "snake" => to_snake_case(&input),
        "kebab" => to_kebab_case(&input),
        "pascal" => to_pascal_case(&input),
        _ => {
            return Err(format!(
                "Unsupported case: {}. Use: upper, lower, title, camel, snake, kebab, pascal",
                to_case
            ))
        }
    };
    Ok(result)
}

/// Split input into words by splitting on whitespace, hyphens, underscores,
/// and camelCase boundaries.
fn split_words(input: &str) -> Vec<String> {
    let mut words = Vec::new();
    let mut current = String::new();

    for ch in input.chars() {
        if ch == ' ' || ch == '_' || ch == '-' || ch == '\t' || ch == '\n' {
            if !current.is_empty() {
                words.push(current.clone());
                current.clear();
            }
        } else if ch.is_uppercase() && !current.is_empty() {
            // camelCase boundary
            let last_was_upper = current.chars().last().map(|c| c.is_uppercase()).unwrap_or(false);
            if !last_was_upper {
                words.push(current.clone());
                current.clear();
            }
            current.push(ch);
        } else {
            current.push(ch);
        }
    }
    if !current.is_empty() {
        words.push(current);
    }
    words
}

fn to_title_case(input: &str) -> String {
    input
        .split_whitespace()
        .map(|word| {
            let mut chars = word.chars();
            match chars.next() {
                None => String::new(),
                Some(first) => {
                    let upper: String = first.to_uppercase().collect();
                    format!("{}{}", upper, chars.as_str().to_lowercase())
                }
            }
        })
        .collect::<Vec<_>>()
        .join(" ")
}

fn to_camel_case(input: &str) -> String {
    let words = split_words(input);
    let mut result = String::new();
    for (i, word) in words.iter().enumerate() {
        if i == 0 {
            result.push_str(&word.to_lowercase());
        } else {
            let mut chars = word.chars();
            if let Some(first) = chars.next() {
                let upper: String = first.to_uppercase().collect();
                result.push_str(&upper);
                result.push_str(&chars.as_str().to_lowercase());
            }
        }
    }
    result
}

fn to_snake_case(input: &str) -> String {
    let words = split_words(input);
    words
        .iter()
        .map(|w| w.to_lowercase())
        .collect::<Vec<_>>()
        .join("_")
}

fn to_kebab_case(input: &str) -> String {
    let words = split_words(input);
    words
        .iter()
        .map(|w| w.to_lowercase())
        .collect::<Vec<_>>()
        .join("-")
}

fn to_pascal_case(input: &str) -> String {
    let words = split_words(input);
    let mut result = String::new();
    for word in &words {
        let mut chars = word.chars();
        if let Some(first) = chars.next() {
            let upper: String = first.to_uppercase().collect();
            result.push_str(&upper);
            result.push_str(&chars.as_str().to_lowercase());
        }
    }
    result
}
