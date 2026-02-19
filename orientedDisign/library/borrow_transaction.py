from dataclasses import dataclass
from datetime import datetime


@dataclass
class BorrowTransaction:
    transaction_id: str
    user_id: str
    book_id: str
    borrowed_at: datetime
    returned: bool = False
    overdue: bool = False

    def mark_returned(self):
        self.returned = True

    def mark_overdue(self):
        self.overdue = True
