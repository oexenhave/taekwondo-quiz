#!/usr/bin/env python3
# Run with: python3 match_vocabulary.py
"""
Match Korean vocabulary terms in markdown files with questions.json and add IDs to ID column.
Works only with vocabulary files (Korean terms).
"""

import json
import re
from pathlib import Path
from typing import Dict, List


def load_vocabulary_questions(json_path: Path) -> Dict[str, str]:
    """
    Load vocabulary questions from questions.json.

    Returns:
        Dictionary mapping normalized Korean terms to question IDs
    """
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    korean_to_id = {}

    for question in data.get('vocabularyQuestions', []):
        korean_term = question.get('translations', {}).get('ko', '')
        question_id = question.get('id', '')
        if korean_term and question_id:
            # Normalize: strip whitespace and convert to lowercase for matching
            normalized = korean_term.strip().lower()
            korean_to_id[normalized] = question_id

    return korean_to_id


def parse_markdown_table(content: str) -> List[List[str]]:
    """
    Parse markdown table and return rows.

    Returns:
        List of rows, where each row is a list of cell contents
    """
    lines = content.strip().split('\n')
    rows = []

    for line in lines:
        # Skip separator lines (lines with only |, -, and spaces)
        if re.match(r'^\s*\|[\s\-|]+\|\s*$', line):
            continue

        # Parse table row
        if '|' in line:
            # Split by | and strip whitespace from each cell
            cells = [cell.strip() for cell in line.split('|')]
            # Remove empty cells at start/end (from leading/trailing |)
            cells = [cell for cell in cells if cell]
            if cells:
                rows.append(cells)

    return rows


def process_vocabulary_file(file_path: Path, korean_to_id: Dict[str, str]) -> str:
    """
    Process a vocabulary markdown file, adding ID column with matched question IDs.
    ONLY updates the ID column (last column), leaves all other columns untouched.

    Returns:
        Updated markdown content with ID column
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    rows = parse_markdown_table(content)

    if not rows:
        print(f"  ⚠️  No table found in {file_path.name}")
        return content

    header = rows[0]

    # Ensure ID column exists in header
    if 'ID' not in header:
        header.append('ID')

    id_column_index = header.index('ID')

    # Process data rows (skip header at index 0)
    for i in range(1, len(rows)):
        row = rows[i]

        if len(row) < 2:
            continue

        # Pad row to have enough columns
        while len(row) <= id_column_index:
            row.append('')

        # Match by Korean term in column 1 (index 1, since column 0 is the kup level)
        korean_term = row[1].strip()
        normalized_korean = korean_term.lower()
        question_id = korean_to_id.get(normalized_korean, 'Not found')

        # ONLY update the ID column
        row[id_column_index] = question_id

    # Reconstruct markdown table
    return format_markdown_table(rows)


def format_markdown_table(rows: List[List[str]]) -> str:
    """
    Format rows back into a markdown table with proper alignment.
    """
    if not rows:
        return ""

    # Calculate column widths
    num_cols = max(len(row) for row in rows)
    col_widths = [0] * num_cols

    for row in rows:
        for i, cell in enumerate(row):
            col_widths[i] = max(col_widths[i], len(cell))

    # Build table
    lines = []

    # Header row
    header = rows[0]
    header_line = "| " + " | ".join(cell.ljust(col_widths[i]) for i, cell in enumerate(header)) + " |"
    lines.append(header_line)

    # Separator row
    separator = "| " + " | ".join("-" * col_widths[i] for i in range(len(header))) + " |"
    lines.append(separator)

    # Data rows
    for row in rows[1:]:
        # Ensure row has same number of columns as header
        while len(row) < len(header):
            row.append("")

        row_line = "| " + " | ".join(cell.ljust(col_widths[i]) for i, cell in enumerate(row)) + " |"
        lines.append(row_line)

    return "\n".join(lines) + "\n"


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

    # Load Korean term to ID mapping
    print("Loading vocabulary questions from questions.json...")
    korean_to_id = load_vocabulary_questions(json_path)
    print(f"Loaded {len(korean_to_id)} Korean vocabulary terms\n")

    # Process vocabulary markdown files (exclude additional-questions.md which is theory)
    md_files = sorted([f for f in source_dir.glob('*.md') if f.name != 'additional-questions.md'])

    if not md_files:
        print(f"⚠️  No vocabulary markdown files found in {source_dir}")
        return

    print(f"Processing {len(md_files)} vocabulary markdown files:\n")

    stats = {'found': 0, 'not_found': 0, 'total': 0}

    for md_file in md_files:
        print(f"Processing {md_file.name}...")

        # Process file
        updated_content = process_vocabulary_file(md_file, korean_to_id)

        # Count matches for this file
        file_found = updated_content.count('vocab-')
        file_not_found = updated_content.count('Not found')
        file_total = file_found + file_not_found

        stats['found'] += file_found
        stats['not_found'] += file_not_found
        stats['total'] += file_total

        print(f"  ✓ {file_found} matched, {file_not_found} not found")

        # Write back to file
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(updated_content)

    # Summary
    print(f"\n{'='*50}")
    print(f"SUMMARY")
    print(f"{'='*50}")
    print(f"Total vocabulary terms processed: {stats['total']}")
    print(f"  ✓ Matched: {stats['found']}")
    print(f"  ✗ Not found: {stats['not_found']}")

    if stats['not_found'] > 0:
        print(f"\n⚠️  {stats['not_found']} terms could not be matched.")
        print("This may be due to:")
        print("  - Different spelling/romanization")
        print("  - Spacing differences")
        print("  - Terms not yet in questions.json")


if __name__ == '__main__':
    main()
