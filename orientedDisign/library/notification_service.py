from typing import Dict


class NotificationService:
    def __init__(self):
        self._subscribers: Dict[str, object] = {}

    def register(self, user):
        self._subscribers[user.user_id] = user

    def unregister(self, user):
        self._subscribers.pop(user.user_id, None)

    def notify_user(self, user_id: str, message: str):
        user = self._subscribers.get(user_id)
        if user:
            user.notify(message)

    def notify_overdues(self, transactions, library_system):
        # transactions: iterable of BorrowTransaction
        for t in transactions:
            if t.overdue and not t.returned:
                user = self._subscribers.get(t.user_id)
                book = library_system.books.get(t.book_id)
                if user and book:
                    user.notify(f"Book '{book.title}' is overdue. Transaction: {t.transaction_id}")
