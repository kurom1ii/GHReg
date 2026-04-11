use scraper::{Html, Selector};
use std::collections::HashMap;

/// Extract hidden input fields from the first form whose `action` contains `action_match`.
pub fn parse_form_hidden_fields(html: &str, action_match: &str) -> HashMap<String, String> {
    let doc = Html::parse_document(html);
    let form_sel = Selector::parse("form").unwrap();
    let input_sel = Selector::parse("input[type=\"hidden\"]").unwrap();

    for form in doc.select(&form_sel) {
        let action = form.value().attr("action").unwrap_or("");
        if action.contains(action_match) {
            let mut fields = HashMap::new();
            for input in form.select(&input_sel) {
                if let Some(name) = input.value().attr("name") {
                    let val = input.value().attr("value").unwrap_or("");
                    fields.insert(name.to_string(), val.to_string());
                }
            }
            return fields;
        }
    }
    HashMap::new()
}

/// Extract the first `authenticity_token` found on the page.
pub fn parse_auth_token(html: &str) -> Option<String> {
    let doc = Html::parse_document(html);
    let sel =
        Selector::parse("input[name=\"authenticity_token\"]").unwrap();
    doc.select(&sel)
        .next()
        .and_then(|el| el.value().attr("value"))
        .map(|s| s.to_string())
}

/// Represents one parsed HTML form.
#[derive(Debug, Clone)]
pub struct ParsedForm {
    pub action: String,
    pub fields: HashMap<String, String>,
}

/// Extract ALL forms from a page with their fields.
pub fn parse_all_forms(html: &str) -> Vec<ParsedForm> {
    let doc = Html::parse_document(html);
    let form_sel = Selector::parse("form").unwrap();
    let input_sel = Selector::parse("input").unwrap();
    let select_sel = Selector::parse("select").unwrap();
    let textarea_sel = Selector::parse("textarea").unwrap();

    let mut forms = Vec::new();
    for form in doc.select(&form_sel) {
        let action = form.value().attr("action").unwrap_or("").to_string();
        let mut fields = HashMap::new();

        for input in form.select(&input_sel) {
            let name = match input.value().attr("name") {
                Some(n) => n.to_string(),
                None => continue,
            };
            let typ = input.value().attr("type").unwrap_or("text");
            if typ == "radio" || typ == "checkbox" {
                if input.value().attr("checked").is_some() {
                    let val = input.value().attr("value").unwrap_or("on");
                    fields.insert(name, val.to_string());
                }
            } else {
                let val = input.value().attr("value").unwrap_or("");
                fields.insert(name, val.to_string());
            }
        }

        for sel_elem in form.select(&select_sel) {
            if let Some(name) = sel_elem.value().attr("name") {
                let opt_sel = Selector::parse("option[selected]").unwrap();
                if let Some(opt) = sel_elem.select(&opt_sel).next() {
                    let val = opt.value().attr("value").unwrap_or("");
                    fields.insert(name.to_string(), val.to_string());
                }
            }
        }

        for ta in form.select(&textarea_sel) {
            if let Some(name) = ta.value().attr("name") {
                let text: String = ta.text().collect();
                fields.insert(name.to_string(), text);
            }
        }

        forms.push(ParsedForm { action, fields });
    }
    forms
}

/// Simple HTML to plain text converter.
pub fn html_to_text(html: &str) -> String {
    let doc = Html::parse_document(html);
    let body_sel = Selector::parse("body").unwrap();
    let body = match doc.select(&body_sel).next() {
        Some(b) => b,
        None => return String::new(),
    };

    let mut text = String::new();
    collect_text(&body, &mut text);

    // collapse multiple blank lines
    let mut result = String::new();
    let mut blank_count = 0;
    for line in text.lines() {
        if line.trim().is_empty() {
            blank_count += 1;
            if blank_count <= 2 {
                result.push('\n');
            }
        } else {
            blank_count = 0;
            result.push_str(line);
            result.push('\n');
        }
    }
    result.trim().to_string()
}

fn collect_text(node: &scraper::ElementRef, out: &mut String) {
    for child in node.children() {
        match child.value() {
            scraper::node::Node::Text(t) => {
                out.push_str(t.text.trim());
            }
            scraper::node::Node::Element(el) => {
                let tag = el.name();
                // skip script/style/head
                if matches!(tag, "script" | "style" | "head") {
                    continue;
                }
                let is_block = matches!(
                    tag,
                    "div" | "p" | "br" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
                        | "li" | "tr" | "td" | "th" | "blockquote" | "pre" | "hr"
                );
                if is_block {
                    out.push('\n');
                }
                if let Some(el_ref) = scraper::ElementRef::wrap(child) {
                    collect_text(&el_ref, out);
                }
                if is_block {
                    out.push('\n');
                }
            }
            _ => {}
        }
    }
}
