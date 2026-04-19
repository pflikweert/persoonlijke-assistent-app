function isTruthyFlag(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  return value === '1' || value.toLowerCase() === 'true';
}

export function isChatGptMarkdownImportEnabled(): boolean {
  if (__DEV__) {
    return true;
  }

  return isTruthyFlag(process.env.EXPO_PUBLIC_VERCEL_FLAG_CHATGPT_MARKDOWN_IMPORT);
}

export function isObsidianSettingsEnabled(): boolean {
  return isTruthyFlag(process.env.EXPO_PUBLIC_VERCEL_FLAG_OBSIDIAN_SETTINGS);
}

