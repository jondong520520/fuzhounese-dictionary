import "dotenv/config";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

type CsvRow = {
  English: string;
  Mandarin: string;
  Fuzhounese: string;
  Category: string;
};

async function main() {
  const csvPath = path.join(process.cwd(), "data", "dictionary.csv");

  const file = fs.readFileSync(csvPath, "utf-8");

  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  await prisma.dictionaryEntry.deleteMany();

  for (const row of records) {
    await prisma.dictionaryEntry.create({
      data: {
        english: row.English,
        mandarin: row.Mandarin,
        fuzhounese: row.Fuzhounese,
        category: row.Category,
      },
    });
  }

  console.log(`Imported ${records.length} dictionary entries.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });