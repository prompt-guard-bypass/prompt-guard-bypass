# Jailbreak Data Parser

This repository contains scripts to parse and analyze jailbreak attack data from Markdown files containing LLM safety evaluations.

## Overview

The dataset consists of:
- **3 categories**: eating-disorder, self-harm, spying
- **4 LLM providers**: DeepThink, Gemini 2.5 Flash, Grok 3, Magistral
- **4 attack types**: Raw Malicious, Raw Jailbreak, Encoding Jailbreak, Timed-Release Jailbreak
- **39 total attack runs** with **117 total messages**

## Scripts

### 1. `parse_markdown_data.py`

Main parsing script that extracts structured data from Markdown files.

**Usage:**
```bash
python parse_markdown_data.py
```

**Input:** Markdown files in `src/assets/{category}/{provider}.md`
**Output:** `jailbreak_data.json` - structured JSON containing all extracted data

**Data Structure:**
```json
{
  "category": [
    {
      "provider": "Provider Name",
      "provider_id": "unique_id",
      "attacks": [
        {
          "attack_type": "Attack Type Name",
          "messages": [
            {
              "type": "prompt|response",
              "number": 1,
              "content": "message content",
              "variant": "raw|decoded" // optional for responses
            }
          ]
        }
      ]
    }
  ]
}
```

### 2. `analyze_data.py`

Analysis and reporting script for the parsed data.

**Usage:**
```bash
python analyze_data.py
```

**Features:**
- Dataset summary statistics
- Attack type distribution analysis
- Message pattern analysis (conversation rounds)
- Provider performance comparison
- Example code for data filtering

## Dataset Statistics

- **Total files:** 12 (4 providers × 3 categories)
- **Attack runs:** 39 total
  - Raw Malicious: 12 runs
  - Raw Jailbreak: 12 runs  
  - Timed-Release Jailbreak: 12 runs
  - Encoding Jailbreak: 3 runs (Gemini only)
- **Conversation patterns:**
  - 1 round: 22 attacks (single prompt-response)
  - 2 rounds: 16 attacks (follow-up conversations)
  - 3 rounds: 1 attack (extended conversation)

## Data Usage Examples

### Load and filter data:
```python
import json
from analyze_data import load_data, export_specific_data

# Load all data
data = load_data("jailbreak_data.json")

# Get all Raw Jailbreak attacks
raw_jailbreaks = export_specific_data(data, attack_type='Raw Jailbreak')

# Get all Gemini attacks in self-harm category  
gemini_selfharm = export_specific_data(data, category='self-harm', provider='Gemini')

# Get all attacks from spying category
spying_attacks = export_specific_data(data, category='spying')
```

### Access specific messages:
```python
# Get first attack from eating-disorder category
first_attack = data['eating-disorder'][0]['attacks'][0]
print(f"Attack type: {first_attack['attack_type']}")

# Get all prompts from this attack
prompts = [msg for msg in first_attack['messages'] if msg['type'] == 'prompt']
print(f"Number of prompts: {len(prompts)}")
```

## File Structure

```
src/assets/
├── eating-disorder/
│   ├── DeepThink - d00246b5-bda0-4ddc-b35a-59cb1b35383c.md
│   ├── Gemini 2.5 Flash - 58b5167174a26014.md
│   ├── Grok 3 - 9b9dbc14-751c-447e-aacb-d40996c37f6f.md
│   └── Magistral - d60311e5-78d0-4d3d-a2ec-9ccaf368e154.md
├── self-harm/
│   ├── DeepThink - eb1f9c7e-29cb-4ebc-be47-f2caca9bf0ed.md
│   ├── Gemini 2.5 Flash - fc3e558bb14e9562.md
│   ├── Grok 3 - 6d0147d1-7a9d-430f-a78a-bc01c38daaa9.md
│   └── Magistral - d7110af6-ad18-4fcc-a514-fe37e96b9e12.md
└── spying/
    ├── DeepThink - 67f03911-fcd7-4a0d-aa14-a9e4e8702143.md
    ├── Gemini 2.5 Flash - 5d1d7f52bceab93d.md
    ├── Grok 3 - dffde2e9-4b57-4f9a-b199-9d7d60ce0dbe.md
    └── Magistral - ad2f0621-e202-43c0-8725-da2a3b045b1a.md
```

## Notes

- The parser handles multi-round conversations automatically
- Special response variants (raw/decoded) are preserved
- Provider IDs are extracted from filenames
- All content is preserved exactly as written in the source files
- The JSON output uses UTF-8 encoding to handle special characters