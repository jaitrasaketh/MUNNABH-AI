class diagnosis:
    template = """
        Use the following pieces of information give diagnosis and prognosis to the user's question.
        If you don't know the answer, Give me the most probable answer.

        Context: {similar_docs}

        Only return the helpful answer below and nothing else.
        Question: {query}
        Helpful answer:
    """

class treat:
    template = """
        Use the following pieces of information give treatment the user's question.
        If you don't know the answer, Give me the most probable answer.

        Context: {similar_docs}

        Only return the helpful answer below and nothing else.
        Question: {query}
        Helpful answer:
    """

class ask:
    template = """
        Use the following pieces of information to answer the user's medical queries.
        If you don't know the answer, Give me the most probable answer.

        Context: {similar_docs}

        Only return the helpful answer below and nothing else.
        Question: {query}
        Helpful answer:
        """