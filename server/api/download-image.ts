export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const imageUrl = query.url as string;

  if (!imageUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image URL is required',
    });
  }

  try {
    // Fetch the image from the external URL
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to fetch image',
      });
    }

    // Get the image as a buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get content type from response or default to jpeg
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const extension = contentType.split('/')[1]?.split(';')[0] || 'jpg';

    // Set headers for download
    setHeader(event, 'Content-Type', contentType);
    setHeader(event, 'Content-Disposition', `attachment; filename="image.${extension}"`);
    setHeader(event, 'Content-Length', buffer.length.toString());
    setHeader(event, 'Cache-Control', 'no-cache');

    return buffer;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to download image',
    });
  }
});

