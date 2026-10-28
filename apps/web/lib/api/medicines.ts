const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Pass tenantId via headers to maintain architectural isolation
export const fetchMedicines = async (search?: string, tenantId: string = "1") => {
  const queryParams = new URLSearchParams();
  if (search) queryParams.append('search', search);

  const res = await fetch(`${API_URL}/medicines?${queryParams.toString()}`, {
    headers: { 'x-tenant-id': tenantId }
  });
  
  if (!res.ok) throw new Error('Failed to fetch medicines');
  return res.json();
};