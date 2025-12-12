# Backend Python Pyramid
> Kode utama backend python pyramid tugas besar Pemrograman Aplikasi Web

## Installation
1. postgres
2. python314+

### Setup postgres:
1. Masuk ke shell psql dan buat database
```sh
CREATE DATABASE uas_pengweb;
```
2. Buat user/role
```sh
CREATE USER alembic_user WITH PASSWORD '12345';
CREATE USER app_prod_user WITH PASSWORD '12345';
```
3. Berikan hak akses koneksi database tadi ke semua user diatas
```sh
GRANT CONNECT ON DATABASE uas_pengweb TO alembic_user;
GRANT CONNECT ON DATABASE uas_pengweb TO app_prod_user;
```
4. Masuk ke database
```sh
\c uas_pengweb
```
5. (Setup user alembic) Berikan akses ke alembic_user, line 2 dan 3 opsional jika db kosong
```sh
GRANT USAGE, CREATE ON SCHEMA public TO alembic_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO alembic_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO alembic_user;
```
6. (Setup user prod) Berikan akses ke user prod
```sh
GRANT USAGE ON SCHEMA public TO app_prod_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_prod_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_prod_user;
```
7. Beri akses tabel yang dibuat alembic nanti ke user prod
```sh
ALTER DEFAULT PRIVILEGES FOR ROLE alembic_user IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_prod_user;

ALTER DEFAULT PRIVILEGES FOR ROLE alembic_user IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO app_prod_user;
```

### Setup Python
1. Clone repository
```sh
git clone https://github.com/Tugas-Besar-Pemrograman-Aplikasi-Web/Pyramid-Backend.git
```
2. Masuk ke root repository
```sh
cd Pyramid-Backend/
```
3. Buat virtual env
```sh
python -m venv env
```
4. Source activate
```sh
source env/bin/activate
```
5. Install dependensi
```sh
pip install -r requirements.txt
```

### Setup Alembic:
1. Autogenerate migration
```sh
alembic revision --autogenerate -m "initiate"
```
2. Upgrade head
```sh
alembic upgrade head
```

### Run aplikasi:
1. Run main.py
```sh
python main.py
```

# Dokumentasi API
> Ini adalah dokumentasi utama dari semua api yang tersedia di backend python pyramid tugas besar Pemrograman Aplikasi Web
## Auth
### POST /api/auth/register
**Register/signup user baru (tourist atau agent)**
**Request Body:**
```json
{
  "name": "John Doe", //string
  "email": "john@example.com", //string
  "password": "password123", //string
  "role": "tourist" // or "agent" //string
}
```
**Response (201 Created):**
```json
{
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tourist"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
---
### POST /api/auth/login
**Login user**
**Request Body:**
```json
{
  "email": "john@example.com", //string
  "password": "password123", //string
  "role": "tourist" // validate user has this role //string
}
```
**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tourist"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
---

### GET /api/auth/me
**Get current authenticated user**
**Headers:**
```
Authorization: Bearer {token}
```
**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "tourist"
}
```

## Destination
Note : 
Destination is added from database, so you need to create destination first to database
Open psql shell 
example: 
```
psql -h localhost -U app_prod_user -d uas_pengweb
```

Example sql :
```
INSERT INTO destinations (id, name, description, photo_url, country, created_at, updated_at) VALUES 
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
    'Maldives', 
    'Crystal clear waters and luxurious overwater villas in the heart of the Indian Ocean. Perfect for honeymooners and diving enthusiasts seeking a tropical paradise.', 
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2000&auto=format&fit=crop', 
    'Maldives', 
    NOW(), 
    NOW()
),
(
    'b1ffcd88-0d1c-5ef9-cc7e-7cc0ce491b22', 
    'Bali', 
    'Tropical paradise with stunning beaches, ancient temples, and vibrant culture. Experience the spiritual atmosphere of Ubud and the beach life of Seminyak.', 
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop', 
    'Indonesia', 
    NOW(), 
    NOW()
),
(
    'c200de77-1e2d-6ff0-dd8f-8dd1df502c33', 
    'Santorini', 
    'Iconic white-washed buildings and breathtaking sunsets over the Aegean Sea. A romantic getaway with unique volcanic beaches and world-class wineries.', 
    'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2000&auto=format&fit=crop', 
    'Greece', 
    NOW(), 
    NOW()
),
(
    'd311ef66-2f3e-7001-ee90-9ee2ef613d44', 
    'Swiss Alps', 
    'Majestic mountains, pristine lakes, and charming alpine villages. Ideal for hiking in summer and skiing in winter, offering breathtaking panoramic views.', 
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2000&auto=format&fit=crop', 
    'Switzerland', 
    NOW(), 
    NOW()
),
(
    'e422f055-304f-8112-ff01-0ff3f0724e55', 
    'Kyoto', 
    'The cultural heart of Japan, famous for its classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.', 
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop', 
    'Japan', 
    NOW(), 
    NOW()
);
```

Select ID : (get id destinations)
```
SELECT id, name FROM destinations;
```
or with testing end points 

### Get /api/destinations
**Method : GET**
No need login
You get all destinations list
result: 
```
[
  {
    "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "name": "Maldives",
    "description": "Crystal clear waters and luxurious overwater villas in the heart of the Indian Ocean. Perfect for honeymooners and diving enthusiasts seeking a tropical paradise.",
    "photoUrl": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2000&auto=format&fit=crop",
    "country": "Maldives"
  },
  {
    "id": "b1ffcd88-0d1c-5ef9-cc7e-7cc0ce491b22",
    "name": "Bali",
    "description": "Tropical paradise with stunning beaches, ancient temples, and vibrant culture. Experience the spiritual atmosphere of Ubud and the beach life of Seminyak.",
    "photoUrl": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop",
    "country": "Indonesia"
  },
  {
    "id": "c200de77-1e2d-6ff0-dd8f-8dd1df502c33",
    "name": "Santorini",
    "description": "Iconic white-washed buildings and breathtaking sunsets over the Aegean Sea. A romantic getaway with unique volcanic beaches and world-class wineries.",
    "photoUrl": "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2000&auto=format&fit=crop",
    "country": "Greece"
  },
  {
    "id": "d311ef66-2f3e-7001-ee90-9ee2ef613d44",
    "name": "Swiss Alps",
    "description": "Majestic mountains, pristine lakes, and charming alpine villages. Ideal for hiking in summer and skiing in winter, offering breathtaking panoramic views.",
    "photoUrl": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2000&auto=format&fit=crop",
    "country": "Switzerland"
  },
  {
    "id": "e422f055-304f-8112-ff01-0ff3f0724e55",
    "name": "Kyoto",
    "description": "The cultural heart of Japan, famous for its classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.",
    "photoUrl": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop",
    "country": "Japan"
  }
]
```


### Get with query /api/destinations
**Method : GET**
No need login 
use query key and value (case sensitive) 
example :
```
key : country
value : Indonesia
```
get all destinations with {value} from {key}
result :
```
[
  {
    "id": "b1ffcd88-0d1c-5ef9-cc7e-7cc0ce491b22",
    "name": "Bali",
    "description": "Tropical paradise with stunning beaches, ancient temples, and vibrant culture. Experience the spiritual atmosphere of Ubud and the beach life of Seminyak.",
    "photoUrl": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop",
    "country": "Indonesia"
  }
]
```



### Get with id /api/destinations/{uuid}
**Method: GET**
Get uuid destinations with all steps above 
test using query 
```
id : b1ffcd88-0d1c-5ef9-cc7e-7cc0ce491b22
```

result :
```
[
  {
    "id": "b1ffcd88-0d1c-5ef9-cc7e-7cc0ce491b22",
    "name": "Bali",
    "description": "Tropical paradise with stunning beaches, ancient temples, and vibrant culture. Experience the spiritual atmosphere of Ubud and the beach life of Seminyak.",
    "photoUrl": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop",
    "country": "Indonesia"
  }
]
```


## Packages 

### Get /api/packages
No need to login 
**Method : GET**

**Params :**
```
search : bali
sortBy : price
order : asc
```

### Get detail /api/packages/{id_pkg}
No need to login 
**Method : GET**

```
URL : /api/packages/{id}
```

### Get package by agent /api/packages/agent/{id_agent}
No need to login 
**Method : GET**

```
URL : /api/packages/agent/{id_agent}
```


### Create /api/packages
**Get current authenticated user**
**Headers**:
```
Authorization: Bearer {token}
```

**Response (200 OK)**:

**Method : POST**
```
curl -X POST http://localhost:6543/api/packages \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTI1MmI0Yi0wYzYyLTQzMjYtOWU4NC03MTE4MGYxNzFhZmEiLCJlbWFpbCI6ImFnZW5AdGVzdC5jb20iLCJyb2xlIjoiYWdlbnQiLCJleHAiOjE3NjU1MDkwOTQsImlhdCI6MTc2NTUwNzI5NH0.yTgg8GRekpsigy35lsTkmxM5W5Eu2NicnyyByqIoInA" \
  -H "Content-Type: application/json" \
  -d '{
    "destinationId": "b1ffcd88-0d1c-5ef9-cc7e-7cc0ce491b22",
    "name": "Paket Liburan Bali 3 Hari",
    "duration": 3,
    "price": 1500000,
    "itinerary": "Hari 1: Pantai Kuta. Hari 2: Ubud. Hari 3: Pulang.",
    "maxTravelers": 10,
    "contactPhone": "08123456789",
    "images": ["https://images.unsplash.com/photo-1537996194471-e657df975ab4"]
  }'
```
result : 
```
{"id": "c61da954-5ce0-4605-ba3a-bb84ce070574", "agentId": "61252b4b-0c62-4326-9e84-71180f171afa", "destinationId": "b1ffcd88-0d1c-5ef9-cc7e-7cc0ce491b22", "name": "Paket Liburan Bali 3 Hari", "duration": 3, "price": 1500000.0, "itinerary": "Hari 1: Pantai Kuta. Hari 2: Ubud. Hari 3: Pulang.", "maxTravelers": 10, "contactPhone": "08123456789", "images": ["https://images.unsplash.com/photo-1537996194471-e657df975ab4"], "rating": 0, "reviewsCount": 0, "destinationName": "Bali", "country": "Indonesia"}%
```
**Response (200 OK)**

### Put /api/packages/{id_package}
**Get current authenticated user**
**Headers**:
```
Authorization: Bearer {token}
```

**Response (200 OK)**:

**Method : PUT**
**Body (json):**
```
{
    "price": 1750000,
    "name": "Premiums Bali Holiday"
}
```

**Response (200 OK)**


### DELETE /api/packages/{id_package}
**Get current authenticated user**
**Headers**:
```
Authorization: Bearer {token}
```

**Response (200 OK)**:

**Method : DELETE**

**Response (200 OK)**


