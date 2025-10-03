#!/usr/bin/env python3
"""
Utility script for analyzing the parsed jailbreak data.

This script provides simple analysis functions for the generated JSON data,
including statistics about attack success rates, message counts, and provider performance.
"""

import json
from typing import Dict, List, Any, Optional, Set
from collections import defaultdict


def load_data(filepath: str = "jailbreak_data.json") -> Dict[str, Any]:
    """Load the parsed jailbreak data from JSON file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def print_data_summary(data: Dict[str, Any]) -> None:
    """Print a summary of the dataset structure and contents."""
    print("=== JAILBREAK DATA SUMMARY ===")
    print()
    
    total_files = 0
    total_attacks = 0
    total_messages = 0
    
    for category, providers in data.items():
        print(f"Category: {category}")
        category_attacks = 0
        category_messages = 0
        
        for provider_data in providers:
            provider = provider_data["provider"]
            attack_count = len(provider_data["attacks"])
            
            # Count total messages for this provider
            provider_messages = 0
            for attack in provider_data["attacks"]:
                provider_messages += len(attack["messages"])
            
            print(f"  {provider}:")
            print(f"    - Attack runs: {attack_count}")
            print(f"    - Total messages: {provider_messages}")
            
            total_files += 1
            category_attacks += attack_count
            category_messages += provider_messages
        
        print(f"  Category totals: {category_attacks} attacks, {category_messages} messages")
        print()
        
        total_attacks += category_attacks
        total_messages += category_messages
    
    print(f"OVERALL TOTALS:")
    print(f"  Files: {total_files}")
    print(f"  Attack runs: {total_attacks}")
    print(f"  Total messages: {total_messages}")


def analyze_attack_types(data: Dict[str, Any]) -> None:
    """Analyze the distribution of attack types across all data."""
    print("\n=== ATTACK TYPE ANALYSIS ===")
    
    attack_type_counts = defaultdict(int)
    attack_type_by_category = defaultdict(lambda: defaultdict(int))
    
    for category, providers in data.items():
        for provider_data in providers:
            for attack in provider_data["attacks"]:
                attack_type = attack["attack_type"]
                attack_type_counts[attack_type] += 1
                attack_type_by_category[category][attack_type] += 1
    
    print("\nOverall attack type distribution:")
    for attack_type, count in sorted(attack_type_counts.items()):
        print(f"  {attack_type}: {count} runs")
    
    print("\nAttack types by category:")
    for category in sorted(attack_type_by_category.keys()):
        print(f"\n  {category}:")
        for attack_type, count in sorted(attack_type_by_category[category].items()):
            print(f"    {attack_type}: {count} runs")


def analyze_message_patterns(data: Dict[str, Any]) -> None:
    """Analyze message patterns (prompt/response pairs)."""
    print("\n=== MESSAGE PATTERN ANALYSIS ===")
    
    prompt_counts = defaultdict(int)
    response_counts = defaultdict(int)
    round_counts = defaultdict(int)
    
    for category, providers in data.items():
        for provider_data in providers:
            for attack in provider_data["attacks"]:
                max_prompt = 0
                max_response = 0
                
                for message in attack["messages"]:
                    if message["type"] == "prompt":
                        prompt_counts[message["number"]] += 1
                        max_prompt = max(max_prompt, message["number"])
                    elif message["type"] == "response":
                        response_counts[message["number"]] += 1
                        max_response = max(max_response, message["number"])
                
                # Count conversation rounds (max of prompts and responses)
                rounds = max(max_prompt, max_response)
                round_counts[rounds] += 1
    
    print("\nPrompt distribution:")
    for prompt_num in sorted(prompt_counts.keys()):
        print(f"  Prompt {prompt_num}: {prompt_counts[prompt_num]} occurrences")
    
    print("\nResponse distribution:")
    for response_num in sorted(response_counts.keys()):
        print(f"  Response {response_num}: {response_counts[response_num]} occurrences")
    
    print("\nConversation rounds distribution:")
    for rounds in sorted(round_counts.keys()):
        print(f"  {rounds} round(s): {round_counts[rounds]} attack runs")


def analyze_provider_performance(data: Dict[str, Any]) -> None:
    """Analyze performance by provider across categories."""
    print("\n=== PROVIDER ANALYSIS ===")
    
    # Use a regular dict instead of defaultdict for cleaner type handling
    provider_stats: Dict[str, Dict[str, Any]] = {}
    
    for category, providers in data.items():
        for provider_data in providers:
            provider = provider_data["provider"]
            
            if provider not in provider_stats:
                provider_stats[provider] = {
                    "total_attacks": 0,
                    "total_messages": 0,
                    "categories": set(),
                    "attack_types": defaultdict(int)
                }
            
            provider_stats[provider]["categories"].add(category)
            
            for attack in provider_data["attacks"]:
                provider_stats[provider]["total_attacks"] += 1
                provider_stats[provider]["attack_types"][attack["attack_type"]] += 1
                provider_stats[provider]["total_messages"] += len(attack["messages"])
    
    print("\nProvider statistics:")
    for provider in sorted(provider_stats.keys()):
        stats = provider_stats[provider]
        categories = stats['categories']
        attack_types = stats["attack_types"]
        
        print(f"\n  {provider}:")
        print(f"    Categories: {len(categories)} ({', '.join(sorted(categories))})")
        print(f"    Total attacks: {stats['total_attacks']}")
        print(f"    Total messages: {stats['total_messages']}")
        print(f"    Attack types:")
        for attack_type, count in sorted(attack_types.items()):
            print(f"      {attack_type}: {count}")


def export_specific_data(data: Dict[str, Any], category: Optional[str] = None, 
                        provider: Optional[str] = None, attack_type: Optional[str] = None) -> List[Dict[str, Any]]:
    """Export specific subset of data based on filters."""
    results = []
    
    for cat_name, providers in data.items():
        if category and cat_name != category:
            continue
            
        for provider_data in providers:
            if provider and provider not in provider_data["provider"]:
                continue
                
            for attack in provider_data["attacks"]:
                if attack_type and attack["attack_type"] != attack_type:
                    continue
                
                results.append({
                    "category": cat_name,
                    "provider": provider_data["provider"],
                    "provider_id": provider_data["provider_id"],
                    "attack_type": attack["attack_type"],
                    "messages": attack["messages"]
                })
    
    return results


def main():
    """Main function to run analysis."""
    try:
        data = load_data()
    except FileNotFoundError:
        print("Error: jailbreak_data.json not found. Please run parse_markdown_data.py first.")
        return
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON file: {e}")
        return
    
    print_data_summary(data)
    analyze_attack_types(data)
    analyze_message_patterns(data)
    analyze_provider_performance(data)
    
    print("\n=== EXAMPLE USAGE ===")
    print("To export specific data subsets, you can use the export_specific_data function:")
    print("  # Get all 'Raw Jailbreak' attacks")
    print("  raw_jailbreaks = export_specific_data(data, attack_type='Raw Jailbreak')")
    print("  # Get all Gemini attacks in self-harm category")
    print("  gemini_selfharm = export_specific_data(data, category='self-harm', provider='Gemini')")


if __name__ == "__main__":
    main()