# Named Constants for Scoring Weights
VOICE_WEIGHT = 0.35
TYPING_WEIGHT = 0.35
SLEEP_WEIGHT = 0.30

def calculate_wellness_score(voice_val, typing_val, sleep_val):
    """
    Calculates a wellness score based on user inputs.
    """
    # Using constants instead of hardcoded values
    score = (voice_val * VOICE_WEIGHT) + (typing_val * TYPING_WEIGHT) + (sleep_val * SLEEP_WEIGHT)
    return round(score, 2)
