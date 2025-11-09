#!/usr/bin/env python3
# Run with: python3 fix_belt_ranks.py
"""
Fix belt ranks in questions.json based on markdown files (which are the master source).
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple


def parse_markdown_table(content: str) -> List[List[str]]:
    """Parse markdown table and return rows."""
    lines = content.strip().split('\n')
    rows = []

    for line in lines:
        # Skip separator lines
        if re.match(r'^\s*\|[\s\-|]+\|\s*$', line):
            continue

        # Parse table row
        if '|' in line:
            cells = [cell.strip() for cell in line.split('|')]
            cells = [cell for cell in cells if cell]
            if cells:
                rows.append(cells)

    return rows


def extract_belt_rank_from_filename(filename: str) -> str:
    """
    Extract belt rank from filename.
    E.g., '10-kup.md' -> '10_kup', '1-dan.md' -> '1_dan'
    """
    # Remove .md extension
    name = filename.replace('.md', '')
    # Replace hyphen with underscore
    return name.replace('-', '_')


def normalize_belt_rank(belt_str: str) -> str:
    """
    Normalize belt rank string from markdown to standard format.
    E.g., '10-kup' -> '10_kup', '1-dan' -> '1_dan'
    """
    return belt_str.replace('-', '_').lower()


def extract_id_info(question_id: str) -> Tuple[str, str, str]:
    """
    Extract belt rank, category, and number from question ID.
    E.g., 'vocab-10_kup-leg_techniques-001' -> ('10_kup', 'leg_techniques', '001')
    Returns (None, None, None) if not a valid vocab ID.
    """
    if not question_id.startswith('vocab-'):
        return None, None, None

    parts = question_id.split('-')
    if len(parts) != 4:
        return None, None, None

    return parts[1], parts[2], parts[3]


def collect_corrections(source_dir: Path) -> Dict[str, str]:
    """
    Scan all markdown files and collect ID -> correct_belt_rank mappings.
    Returns dict mapping question IDs to their correct belt ranks.
    """
    corrections = {}

    md_files = sorted(source_dir.glob('*.md'))

    for md_file in md_files:
        # Get the correct belt rank from filename
        correct_belt_rank = extract_belt_rank_from_filename(md_file.name)

        # Read and parse the markdown file
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()

        rows = parse_markdown_table(content)

        if not rows:
            continue

        # Skip header row, process data rows
        for row in rows[1:]:
            if len(row) < 4:
                continue

            question_id = row[3].strip()

            # Skip if not a valid ID
            if question_id == 'Not found' or not question_id.startswith('vocab-'):
                continue

            # Extract belt rank from ID
            id_belt_rank, id_category, id_number = extract_id_info(question_id)

            if not id_belt_rank:
                continue

            # Check if belt rank needs correction
            if id_belt_rank != correct_belt_rank:
                corrections[question_id] = correct_belt_rank

    return corrections


def apply_corrections(json_path: Path, corrections: Dict[str, str]) -> int:
    """
    Apply belt rank corrections to questions.json.
    Returns number of corrections made.
    """
    # Load questions.json
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    corrections_made = 0

    # Update vocabulary questions
    for question in data['vocabularyQuestions']:
        question_id = question.get('id', '')

        if question_id in corrections:
            old_belt = question['beltRank']
            new_belt = corrections[question_id]

            question['beltRank'] = new_belt
            corrections_made += 1

            # Also update the ID to reflect new belt rank
            id_belt_rank, id_category, id_number = extract_id_info(question_id)
            new_id = f"vocab-{new_belt}-{id_category}-{id_number}"
            question['id'] = new_id

            korean = question.get('translations', {}).get('ko', '')
            print(f"  ✓ {korean}: {old_belt} → {new_belt}")
            print(f"    Old ID: {question_id}")
            print(f"    New ID: {new_id}")

    # Save updated questions.json
    if corrections_made > 0:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    return corrections_made


def main():
    script_dir = Path(__file__).parent
    json_path = script_dir / 'src' / 'data' / 'questions.json'
    source_dir = script_dir / 'roskilde-source'

    # Validate paths
    if not json_path.exists():
        print(f"❌ Error: questions.json not found at {json_path}")
        return

    if not source_dir.exists():
        print(f"❌ Error: roskilde-source directory not found at {source_dir}")
        return

    print("Scanning markdown files for misplaced questions...\n")

    # Collect all corrections needed
    corrections = collect_corrections(source_dir)

    if not corrections:
        print("✅ No misplaced questions found. All belt ranks are correct!")
        return

    print(f"Found {len(corrections)} misplaced questions:\n")

    # Apply corrections
    corrections_made = apply_corrections(json_path, corrections)

    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"{'='*60}")
    print(f"Corrected {corrections_made} questions in questions.json")
    print(f"\n⚠️  Remember to run match_korean_ids.py to update markdown files!")


if __name__ == '__main__':
    main()
