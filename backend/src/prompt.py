diagnosis_template = """
Use the following pieces of information to give the diagnosis for the symptoms presented.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}

Only return the helpful answer below and nothing else.
Helpful answer:
"""

prognosis_template = """
Use the following pieces of information to give the prognosis for the given disease and symptoms.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}

Only return the helpful answer below and nothing else.
Helpful answer:
"""