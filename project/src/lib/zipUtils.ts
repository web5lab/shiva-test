import JSZip from 'jszip';

export interface FileEntry {
  path: string;
  content: string;
}

export async function unzipFile(file: File): Promise<FileEntry[]> {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);
  const files: FileEntry[] = [];

  const processEntries = async () => {
    for (const [path, entry] of Object.entries(contents.files)) {
      if (!entry.dir) {
        const content = await entry.async('string');
        files.push({ path, content });
      }
    }
  };

  await processEntries();
  return files;
}