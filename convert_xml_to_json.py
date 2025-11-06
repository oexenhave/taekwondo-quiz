#!/usr/bin/env python3
"""
Convert Taekwondo XML theory files to JSON format.

This script parses teori_CV_kup.xml and teori_CV_dan_extra.xml and converts them
to a structured JSON file suitable for the quiz application.
"""

import xml.etree.ElementTree as ET
import json
import re

# Translation mappings for English
ENGLISH_TRANSLATIONS = {
    # Stances
    "Stand med samlede fødder": "Feet together stance",
    "Stand med samlede hæle": "Heels together stance",
    "Kort stand": "Short stance",
    "Lang stand": "Long stance",
    "Parallel stand": "Parallel stance",
    "Hestestand": "Horse stance",
    "Bred hestestand": "Wide horse stance",
    "Standard klar stand": "Standard ready stance",
    "Hvilestand": "Resting stance",
    "Baglæns stand (L-stand)": "Back stance (L-stance)",
    "Højre stand": "Right stance",
    "Venstre stand": "Left stance",
    "Forlæns krydsstand": "Forward cross stance",
    "Baglæns krydsstand": "Back cross stance",
    "Samlede tæer stand": "Ball of foot together stance",
    "Hvilestand (tæerne indad)": "Resting stance (toes inward)",
    "Tigerstand": "Tiger stance",
    "Spidsstand": "Point stance",
    "Dækket næve klarstand": "Covered fist ready stance",
    "Spids hestestand": "Point horse stance",
    "Apseogi, hvor man går ned i knæ": "Short stance with bent knees",
    "T-stand": "T-stance",
    "Hjælpestand": "Assisting stance",
    "Skubbe beholder klar stand": "Push barrel ready stance",
    "Tranestand": "Crane stance",
    "Hestestand med indaddrejede fødder": "Horse stance with feet turned inward",

    # Hand techniques - blocks
    "Høj sektion blokering": "High section block",
    "Midter sektion blokering": "Middle section block",
    "Lav sektion blokering": "Low section block",
    "Midter sektion blokering over forreste ben": "Middle section block over front leg",
    "Midter sektion blokering over bagerste ben": "Middle section block over rear leg",
    "Lav sektion adskille blokering": "Low section wedge block",
    "Udadgående blokering i midter sektion": "Outward block in middle section",
    "Dobbelt knivhåndsblokering i midter sektion": "Double knife hand block middle section",
    "Dobbelt knivhåndsblokering i lav sektion": "Double knife hand block low section",
    "Enkelt udadgående knivhåndsblokering i midter sektion": "Single outward knife hand block middle section",
    "Enkelt knivhåndsblokering i lav sektion": "Single knife hand block low section",
    "Udadgående blokering med inderside af underarm": "Outward block with inner forearm",
    "Støtte blokering i midter sektion": "Supported block middle section",
    "Støtte blokering i lav sektion": "Supported block low section",
    "Nedadgående presse blokering med håndrod": "Downward pressing block with palm heel",
    "Enkelt knivhåndsblokering til siden i midtersektion": "Single knife hand block to the side middle section",
    "Vride blokering med enkelt knivhånd": "Twisting block with single knife hand",
    "Udadgående blokering i høj sektion": "Outward block in high section",
    "Indadgående håndrodsblokering i midtersektion over forreste ben": "Inward palm heel block middle section over front leg",
    "Indadgående håndrodsblokering i midtersektion over bagerste ben": "Inward palm heel block middle section over rear leg",
    "Indadgående håndrodsblokering med støtte": "Inward palm heel block with support",
    "Krydshånds blokering i lav sektion": "Cross hand block low section",
    "Krydshånds blokering i høj sektion": "Cross hand block high section",
    "Sakse blokering": "Scissors block",
    "Dobbelt sakse blokering": "Double scissors block",
    "Adskille blokering i midter sektion": "Wedge block middle section",
    "Adskille blokering i midter sektion med indersiden af underarmen": "Wedge block middle section with inner forearm",
    "Del-af-bjerg blokering": "Mountain part block",
    "Diamant blokering": "Diamond block",
    "Stor hængsel": "Large hinge",
    "Bjerg blokering": "Mountain block",
    "Lav sektion adskille blokering med knivhånd": "Low section wedge block with knife hand",
    "Diamant blokering i midtersektion": "Diamond block middle section",
    "Lille hængsel": "Small hinge",
    "Frigiørelse nedad": "Release downward",
    "Høj støtte blokering til siden": "High supported block to the side",
    "Adskille bjerg blokering": "Wedge mountain block",
    "Enkelt indadgående knivhåndsblokering": "Single inward knife hand block",

    # Hand techniques - strikes/punches
    "Høj sektion slag fra hoften": "High section punch from hip",
    "Midter sektion slag fra hoften": "Middle section punch from hip",
    "Lav sektion slag fra hoften": "Low section punch from hip",
    "Slag over bagerste ben": "Punch over rear leg",
    "Slag over forreste ben": "Punch over front leg",
    "Udadgående slag med knivhånd": "Outward knife hand strike",
    "Dobbelt slag": "Double punch",
    "Tredobbelt slag": "Triple punch",
    "Indadgående slag med knivhånd i høj sektion": "Inward knife hand strike high section",
    "Svaleteknik slag mod hals": "Swallow technique strike to neck",
    "Fremadgående slag med bagside af knytnæve": "Forward strike with back fist",
    "Fingerstik med lodret håndstilling": "Finger thrust with vertical hand position",
    "Cirkelslag med albue": "Circular elbow strike",
    "Cirkelslag med albue med støtte": "Circular elbow strike with support",
    "Pletslag med albue": "Target elbow strike",
    "Nedadgående slag med yderside af knytnæve": "Downward strike with outer edge of fist",
    "Sideløns slag fra hofte": "Sideways punch from hip",
    "Dobbelt knytnæveslag med håndfladerne opad": "Double fist punch palms up",
    "Slag med bagside af knytnæve i høj sektion med støtte": "Back fist strike high section with support",
    "Udadgående slag med bagside af knytnæve i høj sektion": "Outward back fist strike high section",
    "Trække med en hånd, slag mod hagen med den anden": "Pull with one hand, strike to chin with other",
    "Plet slag fra hoften": "Target punch from hip",
    "Nedadgående albueslag": "Downward elbow strike",
    "Opadgående albueslag": "Upward elbow strike",
    "Sideløns albueslag": "Sideways elbow strike",
    "Sideløns albueslag med støtte": "Sideways elbow strike with support",
    "Pletslag i lav sektion med yderside af knytnæve": "Target strike low section with outer edge of fist",
    "Knække knæ": "Break knee",
    "Fingerstik med håndflade opad": "Finger thrust palm up",
    "Slag mod hals med buehånd": "Strike to neck with arc hand",
    "Slag mod hage med håndrod": "Strike to chin with palm heel",
    "En hånd trækker og den anden udfører apchigi (deung joomeok)": "One hand pulls and other performs forward strike (back fist)",
    "Albueslag til begge sider": "Elbow strikes to both sides",
    "Slag mod hals": "Strike to neck",

    # Leg techniques
    "Opadgående strøkspark": "Upward stretching kick",
    "Opadgående strækspark": "Upward stretching kick",
    "Sidelæns slag fra hofte": "Sideways punch from hip",
    "Bøje-stræk spark hvor der rammes med underside af hæl": "Bend-stretch kick striking with bottom of heel",
    "Indadgående håndrods blokering med støtte": "Inward palm heel block with support",
    "Sidelæns albueslag": "Sideways elbow strike",
    "Sidelæns albueslag med støtte": "Sideways elbow strike with support",
    "Frigørelse nedad": "Release downward",
    "Front spark": "Front kick",
    "Nedadgående spark": "Downward kick",
    "Udadgående svingspark": "Outward swing kick",
    "Indadgående svingspark": "Inward swing kick",
    "Cirkelspark med vrist": "Roundhouse kick with instep",
    "Skridtspark": "Groin kick",
    "Cirkelspark med fodballe": "Roundhouse kick with ball of foot",
    "Sidespark": "Side kick",
    "Baglæns spark": "Back kick",
    "Skubspark": "Pushing kick",
    "Halvmånespark": "Crescent kick",
    "Baglæns svingspark med strakt ben": "Back swing kick with straight leg",
    "Vridespark": "Twisting kick",
    "Bøje-strøk spark hvor der rammes med underside af hæl": "Bend-stretch kick hitting with bottom of heel",
    "Flere ens spark efter hinanden med skiftende ben": "Multiple same kicks in succession with alternating legs",
    "Flere forskellige spark med samme ben": "Multiple different kicks with same leg",
    "Krogspark": "Hook kick",
    "Baglæns krogspark, hvor foden sættes ned bagved": "Back hook kick, foot lands behind",
    "Baglæns krogspark, hvor foden sættes ned foran": "Back hook kick, foot lands in front",
    "Flyvende spark": "Flying kick",
    "Trampe spark": "Stamping kick",
    "Flere forskellige spark efter hinanden med skiftende ben": "Multiple different kicks in succession with alternating legs",
    "Spark med kropsdrejning": "Kick with body turn",
    "Et skridt frem først, drej rundt og sparke": "One step forward first, turn and kick",
    "Pletspark": "Target kick",
    "Flere ens spark med samme ben": "Multiple same kicks with same leg",
    "Knæstød": "Knee strike",
    "Cirkel knæstød": "Circular knee strike",
    "To spark efter hinanden i luften, hvor det første er et \"falsk spark\"": "Two kicks in succession in air, first is a \"fake kick\"",
    "Flere ens spark efter hinanden med skiftende ben, flyvende": "Multiple same kicks in succession with alternating legs, flying",
    "Flyvespark med bagerste ben, afsæt på begge fødder": "Flying kick with rear leg, jump off both feet",
    "Drej krop og udfør yeopchagi": "Turn body and perform side kick",

    # Theory terms - body parts
    "Knytnæve": "Fist",
    "Hånd": "Hand",
    "Knivhånd": "Knife hand",
    "Fod": "Foot",
    "Vrist": "Instep",
    "Underside af hæl": "Bottom of heel",
    "Arm": "Arm",
    "Underarm": "Forearm",
    "Inderside af underarm": "Inner forearm",
    "Yderside af underarm": "Outer forearm",
    "Fodkant": "Foot edge",
    "Fodballe": "Ball of foot",
    "Bagside af knytnæve": "Back of fist",
    "Lodret knytnæve": "Vertical fist",
    "Håndrod": "Palm heel",
    "Håndryg": "Back of hand",
    "Fingerspidser": "Fingertips",
    "Fingerspidser i udstrakt hånd": "Fingertips in extended hand",
    "Fodsål": "Sole of foot",
    "Yderside af knytnæve (lillefingersiden)": "Outer edge of fist (pinky side)",
    "Albue": "Elbow",
    "Ben": "Leg",
    "Knæ": "Knee",
    "Tåspidser": "Toe tips",
    "Bagside af hæl": "Back of heel",
    "Krop": "Body",
    "Flad knytnæve": "Flat fist",
    "Dobbelt knytnæve": "Double fist",
    "Dækket knytnæve": "Covered fist",
    "Bjørnehånd": "Bear hand",
    "Kastanjenæve": "Chestnut fist",
    "Inderside af fod": "Inside of foot",
    "Pincetnæve": "Pincer fist",
    "Omvendt knivhånd": "Reverse knife hand",
    "Sakse fingerstik": "Scissors finger thrust",
    "Fingerstik med en finger": "One finger thrust",
    "Fingerstik med to samlede fingre": "Two fingers together thrust",
    "Fingerstik med tre samlede fingre": "Three fingers together thrust",
    "Alle fingerspidser samlede": "All fingertips together",
    "Runding mellem tommel- og pegefinger": "Arc between thumb and index finger",
    "Hals": "Neck",
    "Side": "Side",

    # Techniques/actions
    "Slag fra hoften": "Punch from hip",
    "Spark": "Kick",
    "Slag": "Strike",
    "Dreje": "Turn",
    "Støtte": "Support",
    "Dobbelt": "Double",
    "Tredobbelt": "Triple",
    "Grundteknik": "Basic technique",
    "Sammensatte grundteknikker": "Patterns/forms",
    "Svaleteknik": "Swallow technique",
    "Lodret": "Vertical",
    "Stik": "Thrust",
    "Skubbe": "Push",
    "Plet": "Target",
    "Stampe/pulverisere": "Stamp/crush",
    "Trække": "Pull",
    "Bjerg": "Mountain",
    "Del-af-bjerg": "Part of mountain",
    "Kryds": "Cross",
    "Saks": "Scissors",
    "Knække": "Break",

    # Directions/positions
    "Fremad/front": "Forward/front",
    "Indadgående/inderside": "Inward/inside",
    "Udadgående/yderside": "Outward/outside",
    "Lav sektion": "Low section",
    "Midter sektion": "Middle section",
    "Høj sektion": "High section",

    # Commands
    "Indtag ret stand": "Attention",
    "Bukke/hilse": "Bow",
    "Klar": "Ready",
    "Stop": "Stop",
    "Vend 180 grader": "Turn 180 degrees",
    "Slap af": "Relax",
    "Venstre om": "Turn left",
    "Højre om": "Turn right",
    "Front mod hinanden / træneren": "Face partner/instructor",

    # General terms
    "Taekwondo dragt": "Taekwondo uniform",
    "Træningssal": "Training hall",
    "Svingspark": "Swing kick",
    "Træner under 1. dan": "Trainer below 1st dan",
    "Instruktør 1.-3. dan": "Instructor 1st-3rd dan",
    "Instruktør 4.-7. dan": "Instructor 4th-7th dan",
    "Instruktør 8.-10. dan": "Instructor 8th-10th dan",
    "Skolens leder": "School master",
    "Kampråb - ki = energi, hap = samle": "Battle cry - ki = energy, hap = gather",
    "Stor evighed": "Great eternity"
}

def get_english_translation(danish_text):
    """Get English translation for Danish text."""
    # Try exact match first
    if danish_text in ENGLISH_TRANSLATIONS:
        return ENGLISH_TRANSLATIONS[danish_text]

    # If not found, return None to indicate manual translation needed
    return None

def normalize_belt_rank(rank_id):
    """Convert belt rank ID to normalized format."""
    # Convert "10. kup" to "10_kup"
    rank = rank_id.lower().replace(". ", "_").replace(" ", "_")
    return rank

def normalize_category(category_name):
    """Convert Danish category name to English identifier."""
    category_map = {
        "stande": "stances",
        "håndteknikker": "hand_techniques",
        "benteknikker": "leg_techniques",
        "teori": "theory_terms",
        "diverse": "miscellaneous"
    }
    return category_map.get(category_name.lower(), category_name)

def parse_vocabulary_questions(root):
    """Parse vocabulary questions from XML."""
    questions = []
    question_counter = {}

    for grad in root.findall('grad'):
        belt_rank_id = grad.get('id')
        belt_rank = normalize_belt_rank(belt_rank_id)

        # Process each category
        for category_elem in grad:
            if category_elem.tag in ['stande', 'håndteknikker', 'benteknikker', 'teori', 'diverse']:
                category = normalize_category(category_elem.tag)

                # Initialize counter for this category
                if category not in question_counter:
                    question_counter[category] = 1

                for ord in category_elem.findall('ord'):
                    ko_elem = ord.find('ko')
                    da_elem = ord.find('da')

                    if ko_elem is not None and da_elem is not None:
                        korean = ko_elem.text.strip() if ko_elem.text else ""
                        danish = da_elem.text.strip() if da_elem.text else ""
                        english = get_english_translation(danish)

                        # Generate unique ID
                        question_id = f"vocab-{belt_rank}-{category}-{question_counter[category]:03d}"
                        question_counter[category] += 1

                        question = {
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

                        questions.append(question)

    return questions

def parse_theory_questions(root):
    """Parse theory questions from XML."""
    questions = []
    question_counter = 1

    for grad in root.findall('grad'):
        belt_rank_id = grad.get('id')
        belt_rank = normalize_belt_rank(belt_rank_id)

        for spoergsmaal in grad.findall('spoergsmaal'):
            sp_elem = spoergsmaal.find('sp')
            sv_elem = spoergsmaal.find('sv')

            if sp_elem is not None and sv_elem is not None:
                question_text_da = sp_elem.text.strip() if sp_elem.text else ""
                correct_answer_da = sv_elem.text.strip() if sv_elem.text else ""

                # Get incorrect answers
                incorrect_answers_da = []
                for sv_alt in spoergsmaal.findall('sv-alt'):
                    if sv_alt.text:
                        incorrect_answers_da.append(sv_alt.text.strip())

                # Generate unique ID
                question_id = f"theory-{belt_rank}-{question_counter:03d}"
                question_counter += 1

                question = {
                    "id": question_id,
                    "beltRank": belt_rank,
                    "question": {
                        "da": question_text_da,
                        "en": None  # Placeholder for future English translation
                    },
                    "correctAnswer": {
                        "da": correct_answer_da,
                        "en": None
                    },
                    "incorrectAnswers": {
                        "da": incorrect_answers_da,
                        "en": []
                    }
                }

                questions.append(question)

    return questions

def main():
    """Main conversion function."""
    print("Converting XML files to JSON...")

    # Parse XML files with proper encoding
    tree_kup = ET.parse('teori_CV_kup.xml')
    root_kup = tree_kup.getroot()

    tree_dan = ET.parse('teori_CV_dan_extra.xml')
    root_dan = tree_dan.getroot()

    # Build metadata
    metadata = {
        "beltRanks": {
            "10_kup": {"da": "10. kup", "en": "10th kup"},
            "9_kup": {"da": "9. kup", "en": "9th kup"},
            "8_kup": {"da": "8. kup", "en": "8th kup"},
            "7_kup": {"da": "7. kup", "en": "7th kup"},
            "6_kup": {"da": "6. kup", "en": "6th kup"},
            "5_kup": {"da": "5. kup", "en": "5th kup"},
            "4_kup": {"da": "4. kup", "en": "4th kup"},
            "3_kup": {"da": "3. kup", "en": "3rd kup"},
            "2_kup": {"da": "2. kup", "en": "2nd kup"},
            "1_kup": {"da": "1. kup", "en": "1st kup"},
            "1_dan": {"da": "1. dan", "en": "1st dan"},
            "2_dan": {"da": "2. dan", "en": "2nd dan"},
            "3_dan": {"da": "3. dan", "en": "3rd dan"}
        },
        "categories": {
            "stances": {"da": "Stande", "en": "Stances"},
            "hand_techniques": {"da": "Håndteknikker", "en": "Hand Techniques"},
            "leg_techniques": {"da": "Benteknikker", "en": "Leg Techniques"},
            "theory_terms": {"da": "Teori", "en": "Theory Terms"},
            "miscellaneous": {"da": "Diverse", "en": "Miscellaneous"}
        }
    }

    # Parse vocabulary and theory questions
    print("Parsing vocabulary questions...")
    vocabulary_questions = parse_vocabulary_questions(root_kup)
    print(f"Found {len(vocabulary_questions)} vocabulary questions")

    print("Parsing theory questions...")
    theory_questions = parse_theory_questions(root_dan)
    print(f"Found {len(theory_questions)} theory questions")

    # Build final JSON structure
    output = {
        "metadata": metadata,
        "vocabularyQuestions": vocabulary_questions,
        "theoryQuestions": theory_questions
    }

    # Write to JSON file
    print("Writing to questions.json...")
    with open('questions.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"✓ Conversion complete!")
    print(f"  - {len(vocabulary_questions)} vocabulary questions")
    print(f"  - {len(theory_questions)} theory questions")
    print(f"  - Total: {len(vocabulary_questions) + len(theory_questions)} questions")

    # Check for missing English translations
    missing_translations = []
    for q in vocabulary_questions:
        if q['translations']['en'] is None:
            missing_translations.append(q['translations']['da'])

    if missing_translations:
        print(f"\n⚠ Warning: {len(missing_translations)} terms missing English translations")
        print("  These will need to be added manually or via additional translation")

if __name__ == '__main__':
    main()
