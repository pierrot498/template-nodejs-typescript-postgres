-- creates user table to store user data
CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "name" varchar,
  "email" varchar NOT NULL,
  "created_at" timestamp,
  "updated_at" timestamp default null,
  "client_id" integer NOT NULL,
  "status" varchar default 'Active' check (status in ('Active', 'Archived'))
);

-- creates user table to store clients data
CREATE TABLE "clients" (
  "id" serial PRIMARY KEY,
  "name" varchar,
  "email" varchar unique NOT NULL,
  "password" varchar,
  "created_at" timestamp
);


-- creates revoked_tokens table to store revoked jwt
CREATE TABLE "revoked_tokens" (
  "id" serial PRIMARY KEY,
  "token" varchar
);

ALTER TABLE "users" ADD FOREIGN KEY ("client_id") REFERENCES "clients" ("id");
