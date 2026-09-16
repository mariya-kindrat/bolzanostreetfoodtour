-- CreateTable
CREATE TABLE "SeasonalAvailability" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeasonalAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DateOverride" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "capacityOverride" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DateOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalBlackout" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GlobalBlackout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DateOverride_tourId_date_key" ON "DateOverride"("tourId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalBlackout_date_key" ON "GlobalBlackout"("date");

-- AddForeignKey
ALTER TABLE "SeasonalAvailability" ADD CONSTRAINT "SeasonalAvailability_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateOverride" ADD CONSTRAINT "DateOverride_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
