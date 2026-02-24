/**
 * Debug blogs function with different name
 */

export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      message: 'Debug blogs function is working!',
      timestamp: new Date().toISOString(),
      queryParams: event.queryStringParameters,
      method: event.httpMethod
    })
  };
}