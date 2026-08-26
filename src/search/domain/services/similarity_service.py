import numpy as np

class SimilarityService:
    def cosine(self, a: list[float], b: list[float]) -> float:
        a = np.array(a)
        b = np.array(b)
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


