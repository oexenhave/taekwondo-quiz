#!/usr/bin/env python3
# Run with: python3 add_question.py --belt 8_kup --category theory_terms --korean "Tasut" --danish "Fem (5)" --english "Five (5)"
"""
Add a new vocabulary question to questions.json with command-line parameters.
"""

import json
import argparse
from pathlib import Path


def get_next_id_number(questions, belt_rank, category):
    """Find the next available ID number for a given belt rank and category."""
    prefix = f"vocab-{belt_rank}-{category}-"
    max_num = 0

    for question in questions:
        question_id = question.get('id', '')
        if question_id.startswith(prefix):
            try:
                num = int(question_id.split('-')[-1])
                max_num = max(max_num, num)
            except ValueError:
                continue

    return max_num + 1


def add_vocabulary_question(data, belt_rank, category, korean, danish, english):
    """Add a new vocabulary question to the data."""
    vocab_questions = data['vocabularyQuestions']

    # Get next ID number
    next_num = get_next_id_number(vocab_questions, belt_rank, category)
    question_id = f"vocab-{belt_rank}-{category}-{next_num:03d}"

    # Create new question
    new_question = {
        "id": question_id,
        "beltRank": belt_rank,
        "category": category,
        "translations": {
            "ko": korean,
            "da": danish,
            "en": english
        },
        "incorrectAnswers": {
            "da": [],
            "ko": [],
            "en": []
        }
    }

    # Add to list
    vocab_questions.append(new_question)

    return question_id, new_question


def main():
    parser = argparse.ArgumentParser(
        description='Add a new vocabulary question to questions.json',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Add a single question
  python3 add_question.py --belt 8_kup --category theory_terms --korean "Tasut" --danish "Fem (5)" --english "Five (5)"

  # Add a technique
  python3 add_question.py --belt 10_kup --category leg_techniques --korean "Ap chagi" --danish "Front spark" --english "Front kick"

Valid belt ranks:
  10_kup, 9_kup, 8_kup, 7_kup, 6_kup, 5_kup, 4_kup, 3_kup, 2_kup, 1_kup, 1_dan, 2_dan, 3_dan

Valid categories:
  stances, hand_techniques, leg_techniques, theory_terms, miscellaneous
        """
    )

    parser.add_argument('--belt', '-b', required=True,
                       help='Belt rank (e.g., 10_kup, 8_kup, 1_dan)')
    parser.add_argument('--category', '-c', required=True,
                       help='Category (e.g., theory_terms, leg_techniques, stances)')
    parser.add_argument('--korean', '-k', required=True,
                       help='Korean term (romanized)')
    parser.add_argument('--danish', '-d', required=True,
                       help='Danish translation')
    parser.add_argument('--english', '-e', required=True,
                       help='English translation')
    parser.add_argument('--dry-run', action='store_true',
                       help='Show what would be added without saving')

    args = parser.parse_args()

    script_dir = Path(__file__).parent
    json_path = script_dir / 'src' / 'data' / 'questions.json'

    if not json_path.exists():
        print(f"❌ Error: questions.json not found at {json_path}")
        return 1

    # Validate belt rank
    valid_belts = ['10_kup', '9_kup', '8_kup', '7_kup', '6_kup', '5_kup',
                   '4_kup', '3_kup', '2_kup', '1_kup', '1_dan', '2_dan', '3_dan']
    if args.belt not in valid_belts:
        print(f"❌ Error: Invalid belt rank '{args.belt}'")
        print(f"Valid options: {', '.join(valid_belts)}")
        return 1

    # Validate category
    valid_categories = ['stances', 'hand_techniques', 'leg_techniques',
                       'theory_terms', 'miscellaneous']
    if args.category not in valid_categories:
        print(f"❌ Error: Invalid category '{args.category}'")
        print(f"Valid options: {', '.join(valid_categories)}")
        return 1

    # Load questions.json
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Add new question
    question_id, new_question = add_vocabulary_question(
        data,
        belt_rank=args.belt,
        category=args.category,
        korean=args.korean,
        danish=args.danish,
        english=args.english
    )

    print(f"{'[DRY RUN] ' if args.dry_run else ''}New question:")
    print(f"  ID: {question_id}")
    print(f"  Belt: {args.belt}")
    print(f"  Category: {args.category}")
    print(f"  Korean: {args.korean}")
    print(f"  Danish: {args.danish}")
    print(f"  English: {args.english}")

    if args.dry_run:
        print(f"\n✓ Dry run complete. No changes saved.")
        return 0

    # Save updated questions.json
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Successfully added question to questions.json")
    print(f"Total vocabulary questions: {len(data['vocabularyQuestions'])}")

    return 0


if __name__ == '__main__':
    exit(main())
