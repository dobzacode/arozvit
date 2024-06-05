

ALTER TABLE "plant"
  ALTER COLUMN "last_watering" SET DATA TYPE date;

ALTER TABLE "plant"
  ALTER COLUMN "next_watering" DROP DEFAULT;

ALTER TABLE "plant"
  ALTER COLUMN "next_watering" SET NOT NULL;