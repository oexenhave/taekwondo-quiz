#!/usr/bin/env python3
# Run with: python3 match_theory.py
"""
Match theory questions in markdown files with questions.json and add IDs to ID column.
Works only with theory files (question-based, not vocabulary).
"""

import json
import re
from pathlib import Path
from typing import Dict, List


def load_theory_questions(json_path: Path) -> Dict[str, str]:
    """
    Load theory questions from questions.json.

    Returns:
        Dictionary mapping normalized Danish question text to question IDs
    """
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    question_to_id = {}

    for question in data.get('theoryQuestions', []):
        question_text = question.get('question', {}).get('da', '')
        question_id = question.get('id', '')
        if question_text and question_id:
            # Normalize: strip whitespace and convert to lowercase for matching
            normalized = question_text.strip().lower()
            question_to_id[normalized] = question_id

    return question_to_id


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


def process_theory_file(file_path: Path, question_to_id: Dict[str, str]) -> str:
    """
    Process a theory markdown file, adding ID column with matched question IDs.
    ONLY updates the ID column (last column), leaves all other columns untouched.

    Expected columns: Belt Rank | Question | Correct Answer | Incorrect 1 | Incorrect 2 | Incorrect 3 | ID

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

    # Verify expected structure (Belt Rank at index 0, Question at index 1)
    if len(header) < 7:
        print(f"  ⚠️  Warning: Expected 7 columns (Belt Rank, Question, Correct Answer, Incorrect 1-3, ID), found {len(header)}")

    # Process data rows (skip header at index 0)
    for i in range(1, len(rows)):
        row = rows[i]

        if len(row) < 2:
            continue

        # Pad row to have enough columns
        while len(row) <= id_column_index:
            row.append('')

        # Match by question text in column 1 (index 1, column 0 is belt rank)
        question_text = row[1].strip()
        normalized_question = question_text.lower()
        question_id = question_to_id.get(normalized_question, 'Not found')

        # ONLY update the ID column (last column, index 6)
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

    # Load theory question to ID mapping
    print("Loading theory questions from questions.json...")
    question_to_id = load_theory_questions(json_path)
    print(f"Loaded {len(question_to_id)} theory questions\n")

    # Process theory markdown files (only additional-questions.md for now)
    theory_files = [source_dir / 'additional-questions.md']
    md_files = [f for f in theory_files if f.exists()]

    if not md_files:
        print(f"⚠️  No theory markdown files found in {source_dir}")
        return

    print(f"Processing {len(md_files)} theory markdown file(s):\n")

    stats = {'found': 0, 'not_found': 0, 'total': 0}

    for md_file in md_files:
        print(f"Processing {md_file.name}...")

        # Process file
        updated_content = process_theory_file(md_file, question_to_id)

        # Count matches for this file (only count in ID column)
        file_found = updated_content.count('theory-')
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
    print(f"Total theory questions processed: {stats['total']}")
    print(f"  ✓ Matched: {stats['found']}")
    print(f"  ✗ Not found: {stats['not_found']}")

    if stats['not_found'] > 0:
        print(f"\n⚠️  {stats['not_found']} questions could not be matched.")
        print("This may be due to:")
        print("  - Different wording")
        print("  - Quote character differences")
        print("  - Questions not yet in questions.json")


if __name__ == '__main__':
    main()
