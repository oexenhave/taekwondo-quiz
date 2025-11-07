#!/usr/bin/env python3
# Run with: python3 validate_unique_ids.py
"""
Validate that all question IDs in questions.json are unique.
"""

import json
import sys
from collections import Counter
from pathlib import Path


def validate_unique_ids(json_path: str) -> bool:
    """
    Check if all question IDs in the JSON file are unique.

    Args:
        json_path: Path to the questions.json file

    Returns:
        True if all IDs are unique, False otherwise
    """
    # Load the JSON file
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Collect all IDs
    all_ids = []

    # Get IDs from vocabulary questions
    vocab_questions = data.get('vocabularyQuestions', [])
    for question in vocab_questions:
        if 'id' in question:
            all_ids.append(('vocabulary', question['id']))

    # Get IDs from theory questions
    theory_questions = data.get('theoryQuestions', [])
    for question in theory_questions:
        if 'id' in question:
            all_ids.append(('theory', question['id']))

    # Extract just the IDs for counting
    ids_only = [id_tuple[1] for id_tuple in all_ids]

    # Check for duplicates
    id_counts = Counter(ids_only)
    duplicates = {id_val: count for id_val, count in id_counts.items() if count > 1}

    # Report results
    print(f"Total questions found: {len(all_ids)}")
    print(f"  - Vocabulary questions: {len(vocab_questions)}")
    print(f"  - Theory questions: {len(theory_questions)}")
    print(f"\nTotal unique IDs: {len(id_counts)}")

    if duplicates:
        print(f"\n❌ DUPLICATE IDs FOUND: {len(duplicates)}\n")
        for duplicate_id, count in duplicates.items():
            print(f"  '{duplicate_id}' appears {count} times")
            # Show which question types contain this duplicate
            for q_type, q_id in all_ids:
                if q_id == duplicate_id:
                    print(f"    - in {q_type} questions")
        return False
    else:
        print("\n✅ All IDs are unique!")
        return True


def main():
    # Determine the path to questions.json
    script_dir = Path(__file__).parent
    json_path = script_dir / 'src' / 'data' / 'questions.json'

    if not json_path.exists():
        print(f"❌ Error: questions.json not found at {json_path}")
        sys.exit(1)

    print(f"Validating IDs in: {json_path}\n")

    is_valid = validate_unique_ids(str(json_path))

    sys.exit(0 if is_valid else 1)


if __name__ == '__main__':
    main()
