import random
import re

def instant_reply(message: str):
    msg = message.lower().strip()

    # Misunderstanding chance
    if random.random() < 0.12:
        return random.choice([
            "huh?",
            "wait what",
            "didn’t get you"
        ])

    # ACK
    if msg in ["ok", "okay", "k", "kk", "alr", "alright", "yeah", "yup"]:
        return random.choice(["cool", "alr", "👍", "got it"])

    # LAZY
    if msg in ["idk", "maybe", "hmm", "not sure"]:
        return random.choice(["yeah same", "idk either", "fr"])

    # REACTION
    if re.fullmatch(r"(lol|lmao|haha|😂|😭)+", msg):
        return random.choice(["😭", "lol", "lmao", "💀"])

    # CONFUSION
    if msg in ["?", "??", "???", "what", "huh"]:
        return random.choice(["what?", "wdym", "huh?"])

    # GIBBERISH
    if re.fullmatch(r"[a-z]{5,}", msg):
        return random.choice(["huh?", "didn’t get you"])

    # SHORT STATEMENTS
    if len(msg.split()) <= 2:
        return random.choice(["yeah", "right", "true"])

    return None  # needs thinking
