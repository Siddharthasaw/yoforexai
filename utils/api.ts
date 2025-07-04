export async function postData(path: string, data: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (!res.ok) {
    // Throw full error object so frontend can handle it
    const error = new Error(result.message || 'API Error');
    (error as any).response = result;
    throw error;
  }

  return result;
}



export async function getData(path: string) {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, { credentials: 'include' });

  const result = await res.json();

  if (!res.ok) {
    const error = new Error(result.message || 'API Error');
    (error as any).response = result;
    throw error;
  }

  return result;
}
