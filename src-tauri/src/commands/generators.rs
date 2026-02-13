use rand::Rng;

#[tauri::command]
pub fn generate_uuid(version: String) -> Result<String, String> {
    match version.to_lowercase().as_str() {
        "v4" => Ok(uuid::Uuid::new_v4().to_string()),
        "v7" => Ok(uuid::Uuid::now_v7().to_string()),
        _ => Err(format!(
            "Unsupported UUID version: {}. Use 'v4' or 'v7'.",
            version
        )),
    }
}

#[tauri::command]
pub fn generate_password(
    length: u32,
    uppercase: bool,
    lowercase: bool,
    numbers: bool,
    symbols: bool,
) -> Result<String, String> {
    if length == 0 {
        return Err("Password length must be greater than 0".to_string());
    }

    let mut charset = String::new();
    if uppercase {
        charset.push_str("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }
    if lowercase {
        charset.push_str("abcdefghijklmnopqrstuvwxyz");
    }
    if numbers {
        charset.push_str("0123456789");
    }
    if symbols {
        charset.push_str("!@#$%^&*()-_=+[]{}|;:',.<>?/~`");
    }

    if charset.is_empty() {
        return Err(
            "At least one character type must be selected (uppercase, lowercase, numbers, symbols)"
                .to_string(),
        );
    }

    let charset_bytes: Vec<char> = charset.chars().collect();
    let mut rng = rand::thread_rng();
    let password: String = (0..length)
        .map(|_| {
            let idx = rng.gen_range(0..charset_bytes.len());
            charset_bytes[idx]
        })
        .collect();

    Ok(password)
}

#[tauri::command]
pub fn generate_lorem(paragraphs: u32) -> Result<String, String> {
    if paragraphs == 0 {
        return Err("Number of paragraphs must be greater than 0".to_string());
    }

    let sentences = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Curabitur pretium tincidunt lacus, nec gravida nisi.",
        "Nulla facilisi etiam dignissim diam quis enim lobortis.",
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
        "Maecenas accumsan lacus vel facilisis volutpat est velit egestas dui.",
        "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.",
        "Donec id elit non mi porta gravida at eget metus.",
        "Praesent commodo cursus magna, vel scelerisque nisl consectetur et.",
        "Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
        "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.",
        "Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
        "Aenean lacinia bibendum nulla sed consectetur.",
        "Cras mattis consectetur purus sit amet fermentum.",
        "Nullam quis risus eget urna mollis ornare vel eu leo.",
        "Etiam porta sem malesuada magna mollis euismod.",
    ];

    let mut rng = rand::thread_rng();
    let mut result = Vec::new();

    for i in 0..paragraphs {
        let sentence_count = rng.gen_range(4..=8);
        let mut paragraph = Vec::new();
        for j in 0..sentence_count {
            if i == 0 && j == 0 {
                // First sentence of first paragraph is always the classic opener
                paragraph.push(sentences[0].to_string());
            } else {
                let idx = rng.gen_range(0..sentences.len());
                paragraph.push(sentences[idx].to_string());
            }
        }
        result.push(paragraph.join(" "));
    }

    Ok(result.join("\n\n"))
}
