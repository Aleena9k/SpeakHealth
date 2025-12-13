import { Document, Packer, Paragraph, HeadingLevel } from "docx";
import fs from "fs";
import path from "path";

export async function generateDocx(patientId, transcript, analysis) {

  const symptoms = Array.isArray(analysis.symptoms) ? analysis.symptoms : [];
  const conditions = Array.isArray(analysis.probableConditions)
    ? analysis.probableConditions
    : [];
  const research = Array.isArray(analysis.research) ? analysis.research : [];

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "Patient Health Report",
            heading: HeadingLevel.HEADING_1,
          }),

          new Paragraph(`Patient ID: ${patientId}`),
          new Paragraph(`Generated on: ${new Date().toLocaleString()}`),

          new Paragraph({ text: "Transcript", heading: HeadingLevel.HEADING_2 }),
          new Paragraph(transcript || "N/A"),

          new Paragraph({ text: "Extracted Symptoms", heading: HeadingLevel.HEADING_2 }),
          ...(symptoms.length
            ? symptoms.map(s => new Paragraph(`• ${s}`))
            : [new Paragraph("No symptoms extracted.")]),

          new Paragraph({ text: "Clinical Summary", heading: HeadingLevel.HEADING_2 }),
          new Paragraph(analysis.summary || "N/A"),

          new Paragraph({ text: "Probable Conditions", heading: HeadingLevel.HEADING_2 }),
          ...(conditions.length
            ? conditions.map(c => new Paragraph(`• ${c}`))
            : [new Paragraph("No conditions suggested.")]),

          new Paragraph({ text: "Research References", heading: HeadingLevel.HEADING_2 }),
          ...(research.length
            ? research.map(r =>
                new Paragraph(
                  `${r.title || "Untitled"}\n${r.source || ""}\n${r.url || ""}`
                )
              )
            : [new Paragraph("No research references found.")]),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  const dir = path.join("uploads", "reports");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${patientId}.docx`);
  fs.writeFileSync(filePath, buffer);

  return filePath;
}
