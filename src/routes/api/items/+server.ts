import { Readable } from "stream";
import { error, json } from "@sveltejs/kit";
import { getOAuth2Client, isSignedIn } from "svelte-google-auth";
import { drive_v3, google } from "googleapis";
import type { RequestHandler } from "./$types";
import { INITIAL_ITEM_DATA, ITEM_DATA_FILE_NAME } from "$lib/const";

const createInitBodyStream = () => {
  const stream = new Readable();
  stream.push(JSON.stringify(INITIAL_ITEM_DATA));
  stream.push(null);
  return stream;
};

const createItemDataFile = async (drive: drive_v3.Drive) => {
  const { data } = await drive.files.create({
    requestBody: {
      name: ITEM_DATA_FILE_NAME,
      parents: ["appDataFolder"],
    },
    media: {
      mimeType: "application/json",
      body: createInitBodyStream(),
    },
  });

  return data;
};

export const GET: RequestHandler = async ({ locals }) => {
  if (!isSignedIn(locals)) throw error(401, "Unauthorized");
  const client = getOAuth2Client(locals);

  const drive = google.drive({ version: "v3", auth: client });
  const res = await drive.files.list({
    spaces: "appDataFolder",
    fields: "files(webContentLink)",
  });

  const itemDataInfo = res.data.files?.find(({ name }) => name === ITEM_DATA_FILE_NAME);
  const { id } = itemDataInfo ? itemDataInfo : await createItemDataFile(drive);
  if (!id) throw error(404, `${ITEM_DATA_FILE_NAME} not found`);
  const { data } = await drive.files.get({
    fileId: id,
    alt: "media",
  });
  return json(data);
};
