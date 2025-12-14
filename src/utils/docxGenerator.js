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
          // ===== Title =====
          new Paragraph({
            text: "Patient Health Report",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),

          new Paragraph(`Patient ID: ${patientId}`),
          new Paragraph({
            text: `Generated on: ${new Date().toLocaleString()}`,
            spacing: { after: 300 },
          }),

          // ===== Transcript =====
          new Paragraph({
            text: "Transcript",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph(transcript || "N/A"),

          // ===== Symptoms =====
          new Paragraph({
            text: "Extracted Symptoms",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),
          ...(symptoms.length
            ? symptoms.map(s =>
                new Paragraph({
                  text: s,
                  bullet: { level: 0 },
                })
              )
            : [new Paragraph("No symptoms extracted.")]),

          // ===== Clinical Summary =====
          new Paragraph({
            text: "Clinical Summary",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph(analysis.summary || "N/A"),

          // ===== Conditions =====
          new Paragraph({
            text: "Probable Conditions",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),
          ...(conditions.length
            ? conditions.map(c =>
                new Paragraph({
                  text: c,
                  bullet: { level: 0 },
                })
              )
            : [new Paragraph("No conditions suggested.")]),

          // ===== Research =====
          new Paragraph({
            text: "Research References",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),
          ...(research.length
            ? research.flatMap(r => [
                new Paragraph({ text: r.title || "Untitled", bold: true }),
                ...(r.source ? [new Paragraph(r.source)] : []),
                ...(r.url ? [new Paragraph(r.url)] : []),
              ])
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
