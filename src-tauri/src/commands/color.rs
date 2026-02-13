/// Manual RGB/HSL/Hex color conversion without the palette crate.

#[tauri::command]
pub fn color_convert(
    input: String,
    from_format: String,
    to_format: String,
) -> Result<String, String> {
    let (r, g, b) = parse_color(&input.trim().to_string(), &from_format)?;

    match to_format.to_lowercase().as_str() {
        "hex" => Ok(rgb_to_hex(r, g, b)),
        "rgb" => Ok(format!("rgb({}, {}, {})", r, g, b)),
        "hsl" => {
            let (h, s, l) = rgb_to_hsl(r, g, b);
            Ok(format!("hsl({}, {}%, {}%)", h.round() as i32, (s * 100.0).round() as i32, (l * 100.0).round() as i32))
        }
        _ => Err(format!(
            "Unsupported target format: {}. Use 'hex', 'rgb', or 'hsl'.",
            to_format
        )),
    }
}

/// Parse a color string based on the given format into (r, g, b) components.
fn parse_color(input: &str, format: &str) -> Result<(u8, u8, u8), String> {
    match format.to_lowercase().as_str() {
        "hex" => parse_hex(input),
        "rgb" => parse_rgb(input),
        "hsl" => parse_hsl(input),
        _ => Err(format!(
            "Unsupported source format: {}. Use 'hex', 'rgb', or 'hsl'.",
            format
        )),
    }
}

/// Parse hex color: "#ff5500", "ff5500", "#f50", "f50"
fn parse_hex(input: &str) -> Result<(u8, u8, u8), String> {
    let hex = input.trim_start_matches('#');

    let hex = if hex.len() == 3 {
        // Expand shorthand: "f50" -> "ff5500"
        let chars: Vec<char> = hex.chars().collect();
        format!(
            "{}{}{}{}{}{}",
            chars[0], chars[0], chars[1], chars[1], chars[2], chars[2]
        )
    } else {
        hex.to_string()
    };

    if hex.len() != 6 {
        return Err(format!(
            "Invalid hex color: {}. Expected 3 or 6 hex characters.",
            input
        ));
    }

    let r = u8::from_str_radix(&hex[0..2], 16)
        .map_err(|e| format!("Invalid hex red component: {}", e))?;
    let g = u8::from_str_radix(&hex[2..4], 16)
        .map_err(|e| format!("Invalid hex green component: {}", e))?;
    let b = u8::from_str_radix(&hex[4..6], 16)
        .map_err(|e| format!("Invalid hex blue component: {}", e))?;

    Ok((r, g, b))
}

/// Parse rgb: "rgb(255,85,0)", "rgb(255, 85, 0)", "255,85,0"
fn parse_rgb(input: &str) -> Result<(u8, u8, u8), String> {
    let cleaned = input
        .trim()
        .trim_start_matches("rgb(")
        .trim_start_matches("RGB(")
        .trim_end_matches(')')
        .trim();

    let parts: Vec<&str> = cleaned.split(',').map(|s| s.trim()).collect();
    if parts.len() != 3 {
        return Err(format!(
            "Invalid RGB color: {}. Expected 3 comma-separated values.",
            input
        ));
    }

    let r: u8 = parts[0]
        .parse()
        .map_err(|_| format!("Invalid red value: {}", parts[0]))?;
    let g: u8 = parts[1]
        .parse()
        .map_err(|_| format!("Invalid green value: {}", parts[1]))?;
    let b: u8 = parts[2]
        .parse()
        .map_err(|_| format!("Invalid blue value: {}", parts[2]))?;

    Ok((r, g, b))
}

/// Parse hsl: "hsl(20,100%,50%)", "hsl(20, 100%, 50%)", "20,100,50"
fn parse_hsl(input: &str) -> Result<(u8, u8, u8), String> {
    let cleaned = input
        .trim()
        .trim_start_matches("hsl(")
        .trim_start_matches("HSL(")
        .trim_end_matches(')')
        .trim();

    let parts: Vec<&str> = cleaned.split(',').map(|s| s.trim().trim_end_matches('%')).collect();
    if parts.len() != 3 {
        return Err(format!(
            "Invalid HSL color: {}. Expected 3 comma-separated values.",
            input
        ));
    }

    let h: f64 = parts[0]
        .parse()
        .map_err(|_| format!("Invalid hue value: {}", parts[0]))?;
    let s: f64 = parts[1]
        .parse::<f64>()
        .map_err(|_| format!("Invalid saturation value: {}", parts[1]))?
        / 100.0;
    let l: f64 = parts[2]
        .parse::<f64>()
        .map_err(|_| format!("Invalid lightness value: {}", parts[2]))?
        / 100.0;

    let (r, g, b) = hsl_to_rgb(h, s, l);
    Ok((r, g, b))
}

/// Convert RGB to hex string.
fn rgb_to_hex(r: u8, g: u8, b: u8) -> String {
    format!("#{:02x}{:02x}{:02x}", r, g, b)
}

/// Convert RGB (0-255) to HSL. Returns (h in degrees 0-360, s 0.0-1.0, l 0.0-1.0).
fn rgb_to_hsl(r: u8, g: u8, b: u8) -> (f64, f64, f64) {
    let r = r as f64 / 255.0;
    let g = g as f64 / 255.0;
    let b = b as f64 / 255.0;

    let max = r.max(g).max(b);
    let min = r.min(g).min(b);
    let delta = max - min;

    let l = (max + min) / 2.0;

    if delta < f64::EPSILON {
        return (0.0, 0.0, l);
    }

    let s = if l < 0.5 {
        delta / (max + min)
    } else {
        delta / (2.0 - max - min)
    };

    let h = if (max - r).abs() < f64::EPSILON {
        let mut h = ((g - b) / delta) % 6.0;
        if h < 0.0 {
            h += 6.0;
        }
        h * 60.0
    } else if (max - g).abs() < f64::EPSILON {
        ((b - r) / delta + 2.0) * 60.0
    } else {
        ((r - g) / delta + 4.0) * 60.0
    };

    let h = if h < 0.0 { h + 360.0 } else { h };

    (h, s, l)
}

/// Convert HSL (h 0-360, s 0.0-1.0, l 0.0-1.0) to RGB (0-255).
fn hsl_to_rgb(h: f64, s: f64, l: f64) -> (u8, u8, u8) {
    if s.abs() < f64::EPSILON {
        let v = (l * 255.0).round() as u8;
        return (v, v, v);
    }

    let c = (1.0 - (2.0 * l - 1.0).abs()) * s;
    let h_prime = h / 60.0;
    let x = c * (1.0 - (h_prime % 2.0 - 1.0).abs());

    let (r1, g1, b1) = if h_prime < 1.0 {
        (c, x, 0.0)
    } else if h_prime < 2.0 {
        (x, c, 0.0)
    } else if h_prime < 3.0 {
        (0.0, c, x)
    } else if h_prime < 4.0 {
        (0.0, x, c)
    } else if h_prime < 5.0 {
        (x, 0.0, c)
    } else {
        (c, 0.0, x)
    };

    let m = l - c / 2.0;

    let r = ((r1 + m) * 255.0).round() as u8;
    let g = ((g1 + m) * 255.0).round() as u8;
    let b = ((b1 + m) * 255.0).round() as u8;

    (r, g, b)
}
