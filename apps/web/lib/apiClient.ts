export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  // Retrieve the dynamic tenant ID set during login, fallback to '1' for safety
  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') || '1' : '1';
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-tenant-id': tenantId,
  };

  const response = await fetch(`http://localhost:5000${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'An error occurred during the API request');
  }

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) return null;
  
  return response.json();
};