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
INSERT INTO destinations (id, name, description, photo_url, country, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Bali',
  'Island of Gods',
  'https://example.com/bali.jpg',
  'Indonesia',
  now(),
  now()
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
    "id": "fffc3da6-d9f5-42f6-94f6-1dd8a32d8886",
    "name": "Bali",
    "description": "Island of Gods",
    "photoUrl": "https://example.com/bali.jpg",
    "country": "Indonesia"
  }
]
```

### Get /api/destinations?search={input}
**Method : GET**
No need login 
get all destinations with {input}
result:
```
[
  {
    "id": "fffc3da6-d9f5-42f6-94f6-1dd8a32d8886",
    "name": "Bali",
    "description": "Island of Gods",
    "photoUrl": "https://example.com/bali.jpg",
    "country": "Indonesia"
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
    "id": "fffc3da6-d9f5-42f6-94f6-1dd8a32d8886",
    "name": "Bali",
    "description": "Island of Gods",
    "photoUrl": "https://example.com/bali.jpg",
    "country": "Indonesia"
  }
]
```



### Get with id /api/destinations/{uuid}
**Method: GET**
Get uuid destinations with all steps above 
test using query 
```
id : fffc3da6-d9f5-42f6-94f6-1dd8a32d888
```

result :
```
[
  {
    "id": "fffc3da6-d9f5-42f6-94f6-1dd8a32d8886",
    "name": "Bali",
    "description": "Island of Gods",
    "photoUrl": "https://example.com/bali.jpg",
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
**Body (json):**
```
{
    "destinationId": "uuid-destination",
    "name": "Holiday Packages to Bali",
    "duration": 3,
    "price": 1500000,
    "itinerary": "Day 1: Kuta. Day 2: Ubud. Day 3: Finish.",
    "maxTravelers": 10,
    "contactPhone": "08123456789",
    "images": ["https://example.com/bali.jpg"]
}
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


