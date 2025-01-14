import * as XLSX from 'xlsx';

type Range = {
    startRow: number;
    endRow: number;
    startColumn: string;
    endColumn: string;
    skipColumns: string[];
};

export const normalizeExcelFile = async (file: File, range: Range): Promise<Blob> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // @ts-ignore
    const rangeLetters = XLSX.utils.decode_range(sheet['!ref'] || '');
    const scores: number[] = [];

    for (let row = range.startRow - 1; row < range.endRow; row++) {
        for (let col = XLSX.utils.decode_col(range.startColumn); col <= XLSX.utils.decode_col(range.endColumn); col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddress];
            const columnLetter = XLSX.utils.encode_col(col);

            if (!range.skipColumns.includes(columnLetter) && cell && !isNaN(Number(cell.v))) {
                scores.push(Number(cell.v));
            }
        }
    }

    const min = Math.min(...scores);
    const max = Math.max(...scores);

    for (let row = range.startRow - 1; row < range.endRow; row++) {
        for (let col = XLSX.utils.decode_col(range.startColumn); col <= XLSX.utils.decode_col(range.endColumn); col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddress];
            const columnLetter = XLSX.utils.encode_col(col);

            if (!range.skipColumns.includes(columnLetter) && cell && !isNaN(Number(cell.v))) {
                const normalized = parseFloat((5 + ((Number(cell.v) - min) / (max - min)) * 5).toFixed(2));
                sheet[cellAddress].v = normalized; // Update value directly
            }
        }
    }

    const output = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    return new Blob([output], { type: 'application/octet-stream' });
};