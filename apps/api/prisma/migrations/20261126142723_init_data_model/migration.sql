-- CreateEnum
CREATE TYPE "QaKind" AS ENUM ('standard', 'deep_dive');

-- CreateEnum
CREATE TYPE "QaStatus" AS ENUM ('ok', 'needs_confirmation');

-- CreateTable
CREATE TABLE "Applicant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerDocument" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewQa" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "kind" "QaKind" NOT NULL,
    "status" "QaStatus" NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "evidence" TEXT[],
    "followUpQuestion" TEXT,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewQa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CareerDocument" ADD CONSTRAINT "CareerDocument_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQa" ADD CONSTRAINT "InterviewQa_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQa" ADD CONSTRAINT "InterviewQa_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "CareerDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
