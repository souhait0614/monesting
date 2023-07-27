import { Readable } from "stream";
import { error, type Cookies, json } from "@sveltejs/kit";
import { getOAuth2Client, isSignedIn } from "svelte-google-auth";
import { drive_v3, google } from "googleapis";
import type { CookieSerializeOptions } from "cookie";
import { isObject } from "../../../types/typeGuard";
import type { ItemData } from "../../../types/ItemData";
import type { RequestHandler } from "./$types";
import { INITIAL_ITEM_DATA, ITEM_DATA_FILE_NAME } from "$lib/const";

const ITEM_DATA_FILE_ID = "item_data_file_id";

const createBodyStream = (body: object) => {
  const stream = new Readable();
  stream.push(JSON.stringify(body));
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
      body: createBodyStream(INITIAL_ITEM_DATA),
    },
  });

  return data;
};

const getItemDataFile = async (id: string, cookies: Cookies, drive: drive_v3.Drive) => {
  try {
    const setCookieOptions = {
      maxAge: 31536000,
    } as const satisfies CookieSerializeOptions;

    const { data } = await drive.files.get({
      fileId: id,
      alt: "media",
    });
    cookies.set(ITEM_DATA_FILE_ID, id, setCookieOptions);
    return json(data);
  } catch (err) {
    if (isObject(err) && "code" in err && typeof err.code === "number") {
      throw error(err.code);
    }
    throw error(500);
  }
};

export const GET: RequestHandler = async ({ locals, cookies }) => {
  if (!isSignedIn(locals)) throw error(401);

  const itemDataFileId = cookies.get(ITEM_DATA_FILE_ID);
  const client = getOAuth2Client(locals);

  const drive = google.drive({ version: "v3", auth: client });

  if (itemDataFileId) return getItemDataFile(itemDataFileId, cookies, drive);

  const res = await drive.files.list({
    spaces: "appDataFolder",
    fields: "files(id, name, webContentLink)",
  });

  const itemDataInfo = res.data.files?.find(({ name }) => name === ITEM_DATA_FILE_NAME);
  const { id } = itemDataInfo ? itemDataInfo : await createItemDataFile(drive);
  if (!id) throw error(404);
  return getItemDataFile(id, cookies, drive);
};

export const POST: RequestHandler = async ({ locals, cookies, request }) => {
  if (!isSignedIn(locals)) throw error(401);

  const itemDataFileId = cookies.get(ITEM_DATA_FILE_ID);

  const client = getOAuth2Client(locals);

  const drive = google.drive({ version: "v3", auth: client });

  const data: ItemData = await request.json();

  await drive.files.update({
    fileId: itemDataFileId,
    media: {
      mimeType: "application/json",
      body: createBodyStream(data),
    },
  });

  return json(data, {
    status: 201,
  });
};
