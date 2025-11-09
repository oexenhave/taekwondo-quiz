#!/usr/bin/env python3
"""
Generic CLI tool to add questions (vocabulary or theory) to questions.json

Usage:
  # Add vocabulary question
  python3 add_question.py vocab --belt 8_kup --category theory_terms \\
    --korean "Tasut" --danish "Fem (5)" --english "Five (5)"

  # Add theory question
  python3 add_question.py theory --belt 1_dan \\
    --question "Hvad symboliserer GWE'en til \"Taegeuk Il Jang\"?" \\
    --correct "Himmeriget/lyset (Keon)" \\
    --incorrect "Glæde/flod (Tae)" --incorrect "Ild/solen (Ri)" --incorrect "Torden (Jin)"
"""

import json
import argparse
from pathlib import Path
from typing import Dict, List


def load_questions(json_path: Path) -> Dict:
    """Load questions.json"""
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_questions(json_path: Path, data: Dict) -> None:
    """Save questions.json with pretty formatting"""
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def generate_vocab_id(data: Dict, belt_rank: str, category: str) -> str:
    """Generate next available vocabulary question ID"""
    prefix = f"vocab-{belt_rank}-{category}-"
    existing_ids = [
        q['id'] for q in data.get('vocabularyQuestions', [])
        if q['id'].startswith(prefix)
    ]

    if not existing_ids:
        return f"{prefix}001"

    # Extract numbers and find max
    numbers = [int(id.split('-')[-1]) for id in existing_ids]
    next_num = max(numbers) + 1
    return f"{prefix}{next_num:03d}"


def generate_theory_id(data: Dict, belt_rank: str) -> str:
    """Generate next available theory question ID"""
    prefix = f"theory-{belt_rank}-"
    existing_ids = [
        q['id'] for q in data.get('theoryQuestions', [])
        if q['id'].startswith(prefix)
    ]

    if not existing_ids:
        return f"{prefix}001"

    # Extract numbers and find max
    numbers = [int(id.split('-')[-1]) for id in existing_ids]
    next_num = max(numbers) + 1
    return f"{prefix}{next_num:03d}"


def add_vocabulary_question(data: Dict, belt_rank: str, category: str,
                           korean: str, danish: str, english: str = None) -> Dict:
    """Add a vocabulary question"""
    question_id = generate_vocab_id(data, belt_rank, category)

    new_question = {
        "id": question_id,
        "beltRank": belt_rank,
        "category": category,
        "translations": {
            "ko": korean,
            "da": danish,
            "en": english or ""
        },
        "incorrectAnswers": {
            "da": [],
            "ko": [],
            "en": []
        }
    }

    if 'vocabularyQuestions' not in data:
        data['vocabularyQuestions'] = []

    data['vocabularyQuestions'].append(new_question)

    print(f"✓ Added vocabulary question: {question_id}")
    print(f"  Korean: {korean}")
    print(f"  Danish: {danish}")
    if english:
        print(f"  English: {english}")

    return data


def add_theory_question(data: Dict, belt_rank: str, question_da: str,
                       correct_da: str, incorrect_da: List[str]) -> Dict:
    """Add a theory question"""
    question_id = generate_theory_id(data, belt_rank)

    new_question = {
        "id": question_id,
        "beltRank": belt_rank,
        "question": {
            "da": question_da,
            "en": None
        },
        "correctAnswer": {
            "da": correct_da,
            "en": None
        },
        "incorrectAnswers": {
            "da": incorrect_da,
            "en": []
        }
    }

    if 'theoryQuestions' not in data:
        data['theoryQuestions'] = []

    data['theoryQuestions'].append(new_question)

    print(f"✓ Added theory question: {question_id}")
    print(f"  Question: {question_da}")
    print(f"  Correct: {correct_da}")
    print(f"  Incorrect: {', '.join(incorrect_da)}")

    return data


def validate_belt_rank(belt_rank: str) -> bool:
    """Validate belt rank format"""
    valid_ranks = [
        '10_kup', '9_kup', '8_kup', '7_kup', '6_kup',
        '5_kup', '4_kup', '3_kup', '2_kup', '1_kup',
        '1_dan', '2_dan', '3_dan', '4_dan', '5_dan'
    ]
    return belt_rank in valid_ranks


def validate_category(category: str) -> bool:
    """Validate category format"""
    valid_categories = [
        'stances', 'hand_techniques', 'leg_techniques',
        'theory_terms', 'miscellaneous'
    ]
    return category in valid_categories


def main():
    parser = argparse.ArgumentParser(
        description='Add questions (vocabulary or theory) to questions.json',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )

    subparsers = parser.add_subparsers(dest='type', help='Question type')

    # Vocabulary question subcommand
    vocab_parser = subparsers.add_parser('vocab', help='Add vocabulary question')
    vocab_parser.add_argument('--belt', required=True, help='Belt rank (e.g., 8_kup, 1_dan)')
    vocab_parser.add_argument('--category', required=True,
                             help='Category (stances, hand_techniques, leg_techniques, theory_terms, miscellaneous)')
    vocab_parser.add_argument('--korean', required=True, help='Korean term (romanized)')
    vocab_parser.add_argument('--danish', required=True, help='Danish translation')
    vocab_parser.add_argument('--english', help='English translation (optional)')

    # Theory question subcommand
    theory_parser = subparsers.add_parser('theory', help='Add theory question')
    theory_parser.add_argument('--belt', required=True, help='Belt rank (e.g., 1_dan, 2_dan)')
    theory_parser.add_argument('--question', required=True, help='Question text in Danish')
    theory_parser.add_argument('--correct', required=True, help='Correct answer in Danish')
    theory_parser.add_argument('--incorrect', action='append', required=True,
                              help='Incorrect answer in Danish (can be repeated 1-3 times)')

    args = parser.parse_args()

    if not args.type:
        parser.print_help()
        return

    # Validate belt rank
    if not validate_belt_rank(args.belt):
        print(f"❌ Error: Invalid belt rank '{args.belt}'")
        print("Valid ranks: 10_kup, 9_kup, ..., 1_kup, 1_dan, 2_dan, 3_dan, ...")
        return

    # Path to questions.json
    script_dir = Path(__file__).parent
    json_path = script_dir / 'src' / 'data' / 'questions.json'

    if not json_path.exists():
        print(f"❌ Error: questions.json not found at {json_path}")
        return

    # Load data
    data = load_questions(json_path)

    # Add question based on type
    if args.type == 'vocab':
        if not validate_category(args.category):
            print(f"❌ Error: Invalid category '{args.category}'")
            print("Valid categories: stances, hand_techniques, leg_techniques, theory_terms, miscellaneous")
            return

        data = add_vocabulary_question(
            data, args.belt, args.category,
            args.korean, args.danish, args.english
        )

    elif args.type == 'theory':
        if len(args.incorrect) < 1 or len(args.incorrect) > 3:
            print(f"❌ Error: Must provide 1-3 incorrect answers (got {len(args.incorrect)})")
            return

        data = add_theory_question(
            data, args.belt, args.question,
            args.correct, args.incorrect
        )

    # Save updated data
    save_questions(json_path, data)
    print(f"\n✓ questions.json updated successfully")


if __name__ == '__main__':
    main()
