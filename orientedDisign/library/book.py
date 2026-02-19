from dataclasses import dataclass


@dataclass
class Book:
    book_id: str
    title: str
    author: str
    total_copies: int = 1
    available_copies: int = 1

    def __post_init__(self):
        if self.available_copies is None:
            self.available_copies = self.total_copies

    def borrow(self) -> bool:
        if self.available_copies > 0:
            self.available_copies -= 1
            return True
        return False

    def return_copy(self):
        if self.available_copies < self.total_copies:
            self.available_copies += 1
