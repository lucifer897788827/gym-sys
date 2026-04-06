export function parseCsvRows(content: string) {
  const [headerLine, ...lines] = content
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);

  const headers = headerLine.split(",").map((header) => header.trim());

  return lines.map((line) => {
    const values = line.split(",");

    return headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = (values[index] ?? "").trim();
      return row;
    }, {});
  });
}
