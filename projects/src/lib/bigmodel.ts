const DEFAULT_BIGMODEL_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

export type BigModelMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

function getApiKey() {
  return process.env.BIGMODEL_API_KEY?.trim() || process.env.ZHIPU_API_KEY?.trim() || '';
}

export function getBigModelName() {
  return process.env.BIGMODEL_MODEL?.trim() || process.env.ZHIPU_MODEL?.trim() || 'glm-5.1';
}

function getBigModelBaseUrl() {
  return process.env.BIGMODEL_BASE_URL?.trim() || process.env.ZHIPU_BASE_URL?.trim() || DEFAULT_BIGMODEL_BASE_URL;
}

export function hasBigModelKey() {
  return Boolean(getApiKey());
}

export async function createBigModelChatCompletion(messages: BigModelMessage[]) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return '';
  }

  const response = await fetch(`${getBigModelBaseUrl()}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: getBigModelName(),
      messages,
      temperature: 0.7,
      stream: false,
    }),
  });

  if (!response.ok) {
    return '';
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return payload.choices?.[0]?.message?.content?.trim() || '';
}

export async function parseFileWithBigModel(file: File) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return '';
  }

  const fileType = resolveParserFileType(file.type, file.name);
  if (!fileType) {
    return '';
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('tool_type', 'prime-sync');
  formData.append('file_type', fileType);

  const response = await fetch(`${getBigModelBaseUrl()}/files/parser/sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    return '';
  }

  const payload = (await response.json()) as {
    content?: string;
  };

  return payload.content?.trim() || '';
}

function resolveParserFileType(mimeType: string, fileName: string) {
  const lowerName = fileName.toLowerCase();

  if (mimeType === 'application/pdf' || lowerName.endsWith('.pdf')) {
    return 'PDF';
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword' ||
    lowerName.endsWith('.doc') ||
    lowerName.endsWith('.docx')
  ) {
    return 'WPS';
  }

  return '';
}
