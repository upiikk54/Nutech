CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "email" string,
  "first_name" string,
  "last_name" string,
  "password" string,
  "profile_image" text
);

CREATE TABLE "transactions" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "invoice_number" string,
  "service_code" string,
  "service_name" string,
  "transaction_type" string,
  "total_amount" integer,
  "created_on" string
);

CREATE TABLE "services" (
  "id" integer PRIMARY KEY,
  "service_code" string,
  "service_name" string,
  "service_icon" string,
  "service_tariff" integer
);

CREATE TABLE "banners" (
  "id" integer PRIMARY KEY,
  "banner_name" STRING,
  "banner_image" STRING,
  "description" text
);

CREATE TABLE "balance" (
  "user_id" integer,
  "balance" integer
);

ALTER TABLE "transactions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "balance" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
