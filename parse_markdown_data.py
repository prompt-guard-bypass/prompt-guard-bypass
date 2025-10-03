#!/usr/bin/env python3
"""
Script to parse jailbreak attack data from Markdown files into structured JSON.

This script processes Markdown files containing LLM jailbreak attempts across
three categories (eating-disorder, self-harm, spying) and four providers
(DeepThink, Gemini 2.5 Flash, Grok 3, Magistral).

Each file contains multiple attack runs with alternating prompts and responses.
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Any


def extract_provider_info(filename: str) -> Dict[str, str]:
    """Extract provider name and ID from filename."""
    # Pattern: "Provider Name - ID.md"
    match = re.match(r'^(.+?)\s*-\s*([^-]+)\.md$', filename)
    if match:
        provider = match.group(1).strip()
        provider_id = match.group(2).strip()
        return {"provider": provider, "provider_id": provider_id}
    return {"provider": filename.replace('.md', ''), "provider_id": ""}


def parse_markdown_file(filepath: Path) -> Dict[str, Any]:
    """Parse a single Markdown file and extract attack runs."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract provider info from filename
    provider_info = extract_provider_info(filepath.name)
    
    # Split content into sections by main headers (# Attack Type)
    attack_sections = re.split(r'^# (.+)$', content, flags=re.MULTILINE)
    
    # Remove empty first element if present
    if attack_sections and not attack_sections[0].strip():
        attack_sections = attack_sections[1:]
    
    attacks = []
    
    # Process sections in pairs (header, content)
    for i in range(0, len(attack_sections), 2):
        if i + 1 >= len(attack_sections):
            break
            
        attack_type = attack_sections[i].strip()
        attack_content = attack_sections[i + 1]
        
        # Parse messages within this attack type
        messages = parse_messages(attack_content)
        
        if messages:  # Only add if we found messages
            attacks.append({
                "attack_type": attack_type,
                "messages": messages
            })
    
    return {
        "provider": provider_info["provider"],
        "provider_id": provider_info["provider_id"],
        "attacks": attacks
    }


def parse_messages(content: str) -> List[Dict[str, str]]:
    """Parse prompt-response pairs from attack content."""
    messages = []
    
    # Split by ## headers (Prompt X, Response X)
    sections = re.split(r'^## (.+)$', content, flags=re.MULTILINE)
    
    # Remove empty first element if present
    if sections and not sections[0].strip():
        sections = sections[1:]
    
    # Process sections in pairs (header, content)
    for i in range(0, len(sections), 2):
        if i + 1 >= len(sections):
            break
            
        header = sections[i].strip()
        message_content = sections[i + 1].strip()
        
        # Skip empty content
        if not message_content:
            continue
        
        # Determine message type and number
        if header.startswith('Prompt'):
            message_type = 'prompt'
        elif header.startswith('Response'):
            message_type = 'response'
        else:
            continue  # Skip unknown headers
        
        # Extract number from header (e.g., "Prompt 1" -> 1)
        number_match = re.search(r'\d+', header)
        message_number = int(number_match.group()) if number_match else 1
        
        # For responses, check if there are special sections like "(raw)" or "(decoded)"
        response_variant = None
        if message_type == 'response':
            if '(raw)' in header.lower():
                response_variant = 'raw'
            elif '(decoded)' in header.lower():
                response_variant = 'decoded'
        
        message_obj = {
            "type": message_type,
            "number": message_number,
            "content": message_content
        }
        
        if response_variant:
            message_obj["variant"] = response_variant
        
        messages.append(message_obj)
    
    return messages


def main():
    """Main function to process all Markdown files and generate JSON output."""
    assets_dir = Path("src/assets")
    
    if not assets_dir.exists():
        print(f"Error: Assets directory '{assets_dir}' not found.")
        return
    
    # Categories to process
    categories = ["eating-disorder", "self-harm", "spying"]
    
    all_data = {}
    
    for category in categories:
        category_dir = assets_dir / category
        
        if not category_dir.exists():
            print(f"Warning: Category directory '{category_dir}' not found. Skipping.")
            continue
        
        category_data = []
        
        # Process all .md files in the category directory
        for md_file in category_dir.glob("*.md"):
            print(f"Processing: {md_file}")
            
            try:
                file_data = parse_markdown_file(md_file)
                category_data.append(file_data)
            except Exception as e:
                print(f"Error processing {md_file}: {e}")
                continue
        
        all_data[category] = category_data
    
    # Write output to JSON file
    output_file = "jailbreak_data.json"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nData extraction complete. Output saved to: {output_file}")
    
    # Print summary statistics
    print("\nSummary:")
    total_files = 0
    total_attacks = 0
    
    for category, providers in all_data.items():
        print(f"\n{category}:")
        for provider_data in providers:
            provider = provider_data["provider"]
            attack_count = len(provider_data["attacks"])
            total_files += 1
            total_attacks += attack_count
            print(f"  {provider}: {attack_count} attack runs")
    
    print(f"\nTotal files processed: {total_files}")
    print(f"Total attack runs extracted: {total_attacks}")


if __name__ == "__main__":
    main()