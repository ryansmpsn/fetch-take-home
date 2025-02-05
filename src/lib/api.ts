const API_URL = process.env.API_URL ?? '';

export const fetcher = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const contentType = res.headers.get('Content-Type');

  if (contentType?.includes('application/json')) {
    try {
      const data = await res.json();
      return data as T;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to parse response as JSON');
    }
  }

  if (contentType?.includes('text/plain')) {
    try {
      const text = await res.text();
      return text as unknown as T;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to parse response as text');
    }
  }

  throw new Error(`Unsupported content type: ${contentType}`);
};
