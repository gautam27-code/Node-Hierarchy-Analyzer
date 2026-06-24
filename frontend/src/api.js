const API_URL = import.meta.env.VITE_API_URL;

export async function sendData(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to process hierarchy data");
  }

  return res.json();
}
