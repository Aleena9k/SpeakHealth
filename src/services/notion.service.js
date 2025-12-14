import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY, // or NOTION_TOKEN — just be consistent
});

export const insertHealthRecord = async ({
  patientId,
  summary,
  status = "New",
}) => {
  try {
    await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },

      // 🧱 DATABASE COLUMNS
      properties: {
        "Patient ID": {
          title: [
            {
              text: { content: patientId },
            },
          ],
        },

        "Visit Date": {
          date: {
            start: new Date().toISOString(),
          },
        },

        "Status": {
          select: {
            name: status, // e.g. "New", "Reviewed", "Closed"
          },
        },
      },

      // 📝 PAGE CONTENT (INSIDE THE ROW)
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: "Clinical Summary" } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: summary || "No summary available." },
              },
            ],
          },
        },
      ],
    });
  } catch (error) {
    console.error("Notion Insert Error:", error.body || error);
    throw error;
  }
};
