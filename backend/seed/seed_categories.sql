-- THIS FILE INSERTS CATEGORIES MANUALLY INTO THE CATEGORIES TABLE
-- WE DEFINE ALL CATEGORIES FOR OUR APP HERE

INSERT INTO categories (name) VALUES
('Plumbing'),
('Ac installation'),
('Barbing'),
('Bricklayer'),
('Construction'),
('Car services'),
('Capentry'),
('Cleaner'),
('Driver'),
('Electrical'),
('Gardening'),
('Graphics Designer'),
('Interior Designs'),
('Make up beauty'),
('Painter'),
('Painting'),
('Renovation & Tools'),
('Solar Installation'),
('Tailoring'),
('Tech support'),
('Teacher'),
('Others')
ON CONFLICT (name) DO NOTHING; -- prevent duplicates