from dataclasses import dataclass
from typing import List, Optional

@dataclass
class MessageDTO:
    message: str

    @staticmethod
    def from_message(msg: str):
        return MessageDTO(message=msg)