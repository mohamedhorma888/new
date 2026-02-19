from typing import Dict, Optional, List
from datetime import datetime
from library.user import User
from library.book import Book
from library.borrow_transaction import BorrowTransaction
from library.notification_service import NotificationService


class LibrarySystem:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LibrarySystem, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if getattr(self, "_initialized", False):
            return
        self.users: Dict[str, User] = {}
        self.books: Dict[str, Book] = {}
        self.transactions: Dict[str, BorrowTransaction] = {}
        self._next_transaction = 1
        self.notification_service = NotificationService()
        self._initialized = True

    def add_user(self, user: User):
        self.users[user.user_id] = user

    def add_book(self, book: Book):
        self.books[book.book_id] = book

    def borrow_book(self, user_id: str, book_id: str) -> Optional[str]:
        user = self.users.get(user_id)
        book = self.books.get(book_id)
        if user is None or book is None:
            return None
        if not user.can_borrow():
            return None
        if not book.borrow():
            return None

        tx_id = f"T{self._next_transaction}"
        self._next_transaction += 1
        tx = BorrowTransaction(transaction_id=tx_id, user_id=user_id, book_id=book_id, borrowed_at=datetime.now())
        self.transactions[tx_id] = tx
        user.borrowed_transactions.append(tx_id)
        return tx_id

    def return_book(self, transaction_id: str) -> bool:
        tx = self.transactions.get(transaction_id)
        if not tx or tx.returned:
            return False
        tx.mark_returned()
        book = self.books.get(tx.book_id)
        if book:
            book.return_copy()
        user = self.users.get(tx.user_id)
        if user and transaction_id in user.borrowed_transactions:
            user.borrowed_transactions.remove(transaction_id)
        return True

    def view_borrowed_books(self, user_id: str) -> List[BorrowTransaction]:
        user = self.users.get(user_id)
        if not user:
            return []
        return [self.transactions[t] for t in user.borrowed_transactions if t in self.transactions]

    def mark_transaction_overdue(self, transaction_id: str):
        tx = self.transactions.get(transaction_id)
        if tx:
            tx.mark_overdue()

    def notify_overdue_users(self):
        self.notification_service.notify_overdues(self.transactions.values(), self)
