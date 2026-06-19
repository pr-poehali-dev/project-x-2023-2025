CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  house_id INTEGER NOT NULL,
  house_title TEXT NOT NULL,
  house_location TEXT NOT NULL,
  house_price INTEGER NOT NULL,
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  nights INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  prepayment INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
