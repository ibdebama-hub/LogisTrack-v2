export class SdkGeneratorService {
  public static generateCurlSnippet(endpoint: string, method: string = 'GET', payload?: unknown): string {
    let curl = `curl -X ${method} "https://logistrack.app${endpoint}" \\\n`;
    curl += `  -H "Authorization: Bearer YOUR_API_KEY" \\\n`;
    curl += `  -H "Content-Type: application/json"`;

    if (payload && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      curl += ` \\\n  -d '${JSON.stringify(payload, null, 2)}'`;
    }

    return curl;
  }

  public static generateTsSnippet(endpoint: string, method: string = 'GET'): string {
    return `import { LogisTrackClient } from '@logistrack/sdk';

const client = new LogisTrackClient({ apiKey: 'YOUR_API_KEY' });

async function run() {
  const response = await client.${method.toLowerCase()}('${endpoint}');
  console.log(response.data);
}`;
  }

  public static generatePythonSnippet(endpoint: string, method: string = 'GET'): string {
    return `import requests

url = "https://logistrack.app${endpoint}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.request("${method}", url, headers=headers)
print(response.json())`;
  }

  public static generatePhpSnippet(endpoint: string, method: string = 'GET'): string {
    return `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://logistrack.app${endpoint}",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "${method}",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;`;
  }
}
