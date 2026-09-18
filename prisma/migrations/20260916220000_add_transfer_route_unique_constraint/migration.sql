-- Add unique constraint on (origin, destination)
ALTER TABLE "TransferRoute" ADD CONSTRAINT "TransferRoute_origin_destination_key" UNIQUE ("origin", "destination");
