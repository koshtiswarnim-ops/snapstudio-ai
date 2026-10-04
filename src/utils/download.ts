/**
 * Triggers direct 1-click file download to user's computer without navigating away from the page.
 */
export const downloadImageFile = async (imageUrl: string, filename?: string): Promise<void> => {
  if (!imageUrl) return;

  const name = filename || `snapstudio_ecommerce_${Date.now()}.jpg`;

  try {
    // 1. Data URLs (Base64)
    if (imageUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // 2. Remote / Supabase / Unsplash CDN URLs: Fetch image blob to force direct local disk download!
    const response = await fetch(imageUrl, { mode: 'cors' });
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 2000);
  } catch (err) {
    console.warn('Direct blob download notice, opening isolated new tab fallback:', err);
    // Fallback: Open in an isolated target="_blank" new tab so the current user page and session are NEVER lost!
    const link = document.createElement('a');
    link.href = imageUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
