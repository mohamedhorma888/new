from library.user import Student, Teacher, User


class UserFactory:
    @staticmethod
    def create_user(user_type: str, user_id: str, name: str, email: str) -> User:
        t = user_type.lower()
        if t == "student":
            return Student(user_id, name, email)
        if t == "teacher":
            return Teacher(user_id, name, email)
        raise ValueError(f"Unknown user type: {user_type}")
