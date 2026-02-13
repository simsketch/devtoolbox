#[tauri::command]
pub fn number_base_convert(input: String, from_base: u32, to_base: u32) -> Result<String, String> {
    let valid_bases = [2, 8, 10, 16];

    if !valid_bases.contains(&from_base) {
        return Err(format!(
            "Unsupported source base: {}. Supported bases: 2, 8, 10, 16",
            from_base
        ));
    }
    if !valid_bases.contains(&to_base) {
        return Err(format!(
            "Unsupported target base: {}. Supported bases: 2, 8, 10, 16",
            to_base
        ));
    }

    let trimmed = input.trim();

    // Strip common prefixes
    let cleaned = if from_base == 16 {
        trimmed
            .strip_prefix("0x")
            .or_else(|| trimmed.strip_prefix("0X"))
            .unwrap_or(trimmed)
    } else if from_base == 2 {
        trimmed
            .strip_prefix("0b")
            .or_else(|| trimmed.strip_prefix("0B"))
            .unwrap_or(trimmed)
    } else if from_base == 8 {
        trimmed
            .strip_prefix("0o")
            .or_else(|| trimmed.strip_prefix("0O"))
            .unwrap_or(trimmed)
    } else {
        trimmed
    };

    // Parse to intermediate u128
    let value = u128::from_str_radix(cleaned, from_base)
        .map_err(|e| format!("Failed to parse '{}' as base {}: {}", input, from_base, e))?;

    // Convert to target base
    let result = match to_base {
        2 => format!("{:b}", value),
        8 => format!("{:o}", value),
        10 => format!("{}", value),
        16 => format!("{:x}", value),
        _ => unreachable!(),
    };

    Ok(result)
}
