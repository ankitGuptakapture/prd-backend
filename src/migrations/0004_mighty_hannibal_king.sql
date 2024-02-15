DO $$ BEGIN
 ALTER TABLE "chats" ADD CONSTRAINT "chats_socketRoom_socketRoom_id_fk" FOREIGN KEY ("socketRoom") REFERENCES "socketRoom"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
