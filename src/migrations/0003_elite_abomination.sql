CREATE TABLE IF NOT EXISTS "socketRoom" (
	"id" serial PRIMARY KEY NOT NULL,
	"socketId" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
