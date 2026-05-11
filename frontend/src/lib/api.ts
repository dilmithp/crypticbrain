export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
  const url = `${baseUrl}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();

  if (!response.ok || (data && typeof data === 'object' && data.success === false)) {
    throw new Error(data?.message || "An error occurred");
  }

  return data;
};
