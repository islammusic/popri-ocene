import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import { normalizeExcelFile } from './utils/normalizeScores';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const App: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleProcessFiles = async () => {
        setIsProcessing(true);

        const range = {
            startRow: 11,
            endRow: 17,
            startColumn: 'C',
            endColumn: 'I',
            skipColumns: ['D', 'F', 'H', 'J'],
        };

        const zip = new JSZip();

        for (const file of files) {
            const processedFile = await normalizeExcelFile(file, range);
            zip.file(file.name, processedFile);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, 'obdelane-datoteke.zip');

        setIsProcessing(false);
    };

    return (
        <div className="App" style={{padding: '20px', textAlign: 'center'}}>

            <div style={{textAlign: 'left', marginBottom: '20px'}}>
                <img src="/popri-ocene/popri-logo.jpg" alt="Logo" style={{width: '150px'}}/>
            </div>
            <h1>Normalizator ocen Popri</h1>
            <FileUpload onFilesSelected={setFiles}/>
            <button onClick={handleProcessFiles} disabled={isProcessing || files.length === 0}
                    style={{marginTop: '20px'}}>
                {isProcessing ? 'Obdelava...' : 'Obdelaj datoteke'}
            </button>
        </div>
    );
};

export default App;