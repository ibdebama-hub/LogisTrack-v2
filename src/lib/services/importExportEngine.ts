export class ImportExportEngine {
  /**
   * Generic validator & parser for incoming JSON payload
   */
  public static parseJsonPayload<T>(jsonString: string): { valid: boolean; data?: T[]; errors?: string[] } {
    try {
      const parsed = JSON.parse(jsonString);
      const dataArray = Array.isArray(parsed) ? parsed : [parsed];
      return { valid: true, data: dataArray as T[] };
    } catch (e: any) {
      return { valid: false, errors: [`JSON Syntax Error: ${e.message}`] };
    }
  }

  /**
   * Generates a CSV text string from an array of objects
   */
  public static exportToCsv<T extends Record<string, unknown>>(data: T[]): string {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map((item) =>
      headers
        .map((header) => {
          const val = item[header];
          const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
          return `"${valStr.replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Generates formatted JSON data
   */
  public static exportToJson<T>(data: T[]): string {
    return JSON.stringify(data, null, 2);
  }
}
