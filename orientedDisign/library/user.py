from abc import ABC, abstractmethod
from typing import List


class User(ABC):
    def __init__(self, user_id: str, name: str, email: str):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.borrowed_transactions: List[str] = []

    @abstractmethod
    def max_borrow_limit(self) -> int:
        pass

    def can_borrow(self) -> bool:
        return len(self.borrowed_transactions) < self.max_borrow_limit()

    def notify(self, message: str):
        # Simple observer callback implementation
        print(f"Notification for {self.name} ({self.user_id}): {message}")


class Student(User):
    def max_borrow_limit(self) -> int:
        return 3


class Teacher(User):
    def max_borrow_limit(self) -> int:
        return 10
