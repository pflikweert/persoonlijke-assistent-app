import type { PickerUploadAsset } from "./prepare";

type OpenWebImageFilePickerOptions = {
  capture?: "environment" | "user" | null;
  limit: number;
  multiple: boolean;
};

async function readImageDimensions(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    return await new Promise<{ width: number; height: number }>((resolve) => {
      const image = new Image();
      image.onload = () => {
        resolve({
          width: image.naturalWidth || image.width || 1,
          height: image.naturalHeight || image.height || 1,
        });
      };
      image.onerror = () => resolve({ width: 1, height: 1 });
      image.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function mapWebFileToPickerAsset(file: File): Promise<PickerUploadAsset> {
  const dimensions = await readImageDimensions(file);

  return {
    uri: null,
    width: dimensions.width,
    height: dimensions.height,
    mimeType: file.type || null,
    fileName: file.name || null,
    fileSize: typeof file.size === "number" ? file.size : null,
    file,
  };
}

export async function openWebImageFilePicker(
  options: OpenWebImageFilePickerOptions
): Promise<PickerUploadAsset[]> {
  if (typeof document === "undefined") {
    return [];
  }

  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";
    if (options.multiple) {
      input.multiple = true;
    }
    if (options.capture) {
      input.setAttribute("capture", options.capture);
    }

    const cleanup = () => {
      input.value = "";
      input.remove();
    };

    input.addEventListener("change", async () => {
      try {
        const files = Array.from(input.files ?? []).slice(0, options.limit);
        if (!files.length) {
          resolve([]);
          return;
        }

        const assets = await Promise.all(files.map((file) => mapWebFileToPickerAsset(file)));
        resolve(assets);
      } catch (error) {
        reject(error);
      } finally {
        cleanup();
      }
    });

    input.addEventListener("cancel", () => {
      cleanup();
      resolve([]);
    });

    document.body.appendChild(input);
    input.click();
  });
}
