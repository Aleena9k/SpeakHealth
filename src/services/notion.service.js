import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const insertHealthRecord = async ({
  patientId,
  // primarySymptom,
  // symptoms,
  // probableConditions,
  // summary,
  // severity,
 
}) => {
  try {
    await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },
      properties: {
        "Patient ID": {
          title: [
            {
              text: { content: patientId },
            },
          ],
        },

        "Date": {
          date: {
            start: new Date().toISOString(),
          },
        },

        // "Primary Symptom": {
        //   select: primarySymptom
        //     ? { name: primarySymptom }
        //     : null,
        // },

        // "Symptoms": {
        //   multi_select: symptoms.map((s) => ({ name: s })),
        // },

        // "Probable Conditions": {
        //   multi_select: probableConditions.map((c) => ({ name: c })),
        // },

        // "Clinical Summary": {
        //   rich_text: [
        //     {
        //       text: { content: summary },
        //     },
        //   ],
        // },

        // "Severity": {
        //   select: severity ? { name: severity } : null,
        // },

       
      },
    });
  } catch (error) {
    console.error("Notion Insert Error:", error.body || error);
    throw error;
  }
};
