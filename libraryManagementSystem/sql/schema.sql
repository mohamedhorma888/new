-- Library Management System DDL (simplified)

CREATE TABLE books (
  book_id VARCHAR(50) PRIMARY KEY,
  isbn VARCHAR(20),
  title TEXT NOT NULL,
  authors TEXT,
  publisher TEXT,
  year INT,
  copies_total INT DEFAULT 1,
  copies_available INT DEFAULT 1,
  category VARCHAR(100),
  location VARCHAR(100)
);

CREATE TABLE members (
  member_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200),
  phone VARCHAR(50),
  membership_type VARCHAR(50),
  status VARCHAR(50),
  fines_due NUMERIC(10,2) DEFAULT 0
);

CREATE TABLE borrow_records (
  record_id VARCHAR(50) PRIMARY KEY,
  book_id VARCHAR(50) REFERENCES books(book_id),
  member_id VARCHAR(50) REFERENCES members(member_id),
  issue_date TIMESTAMP NOT NULL,
  due_date TIMESTAMP NOT NULL,
  return_date TIMESTAMP,
  status VARCHAR(50),
  fine NUMERIC(10,2) DEFAULT 0
);

CREATE TABLE reservations (
  reservation_id VARCHAR(50) PRIMARY KEY,
  book_id VARCHAR(50) REFERENCES books(book_id),
  member_id VARCHAR(50) REFERENCES members(member_id),
  reserve_date TIMESTAMP NOT NULL,
  status VARCHAR(50)
);

CREATE TABLE fines (
  fine_id VARCHAR(50) PRIMARY KEY,
  record_id VARCHAR(50) REFERENCES borrow_records(record_id),
  member_id VARCHAR(50) REFERENCES members(member_id),
  amount NUMERIC(10,2),
  paid BOOLEAN DEFAULT FALSE
);
