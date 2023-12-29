import React,{useState,  useRef} from "react";
import Header from "./Header"
import Upload from "./Upload"
import Input from "./Input";
import Footer from "./Footer"
import { PDFDocument } from "pdf-lib";
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,).toString();

function App () {
    const [pdfFile, setPdfFile] = useState();
    const [numPages, setNumPages] = useState();
    const [text, setText] = useState('');
    const [zI, setZI] = useState([]);
    const [isExtracting, setIsExtracting] = useState(true);
    const inputFile = useRef();

    // --------To display the checkmark over pages--------
    function modifyOverlay() {
        const indexTrue=[];
        const indexFalse=[]
        for (let i = 0; i < zI.length; i++) {
            if (zI[i] === true) {
            indexTrue.push(i+1);
            } else {
                indexFalse.push(i+1);
            }
        }

        indexTrue.forEach((element) => {
            document.getElementById(element).style.zIndex=1;
        })
        indexFalse.forEach((element) => {
            document.getElementById(element).style.zIndex=-1;
        })
    }

    // --------To handle the file upload--------
    const handleChange = (event) => {
        const selectedFile = event.target.files[0];
        setPdfFile(selectedFile);
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    function onLoadError(error) {
        alert("Only .pdf files are supported! :P")
        setPdfFile(null);
        console.log(error);
    }

    function onSourceError(error) {
        alert("Error! Try Again ^-^")
        setPdfFile(null);
        console.log(error);
    }
    
    // --------To handle page number insertion in the text box--------
    function handleText (event) {
        const newText = event.target.value;
        setText(newText);
        updateZI(newText);
        modifyOverlay();       
    }

    function updateZI(newText) {
        var parts = newText.split(',');
        const pgNo = parts.reduce((acc, cur) => {
        if (cur.includes('-')) {
            const [start, end] = cur.split('-').map(Number);
            for (let i = start; i <= end; i++) {
                acc.push(i);
            }
        } else {
            acc.push(Number(cur));
        }
        return acc; 
        }, []);

        var pos = pgNo;
        pos = pos.filter((num, i, arr) => {
            return pos.indexOf(num) === i && num <= zI.length && num !==0;
        });
        pos.sort((a, b) => a-b);

        var temp = zI;
        pos.forEach((element) => {
            temp[element-1] = true;
        })
        setZI(temp);
    }

    // --------To display checkmark on the pages that the user clicks on--------
    function handleClick (pageNumber) {
        const temp = zI;
        temp[pageNumber-1] = !temp[pageNumber-1];
        setZI(temp);
        modifyOverlay();
    }

    // --------To get the index of the pages that the user has selected--------
    function getIndex() {
        const index = [];
        for (let i = 0; i < zI.length; i++) {
            if (zI[i] === true) {
              index.push(i+1);
            }
        }
        return index;
    }
    // --------To remove the pages using pdf-lib library--------
    const removePages = async () => {
        if (isExtracting) {
            if (pdfFile) {
                try {
                    const pagesToRemove = getIndex();
                    var pagesToKeep = [];
                    for(let i = 1; i <= numPages; i++){
                        if(!pagesToRemove.includes(i)){
                            pagesToKeep.push(i);
                        }
                    }
                    pagesToKeep.sort((a, b) => b-a);

                    const reader = new FileReader();
                    reader.onload = async () => {
                    const pdfBytes = new Uint8Array(reader.result);
            
                    try {
                        const pdfDoc = await PDFDocument.load(pdfBytes);
                        pagesToKeep.forEach((pgNo) => {
                            pdfDoc.removePage(pgNo-1);
                        });

                        const pageCount = pdfDoc.getPageCount();                    
                        
                        const modifiedPdfBytes = await pdfDoc.save();

                        const uint8ArrayToFile = (uint8Array, fileName, fileType) => {
                            const blob = new Blob([uint8Array], { type: fileType });
                            const file = new File([blob], fileName, { lastModified: new Date().getTime() });
                            return file;
                        };

                        pagesToKeep = [];
                        setZI(pagesToKeep);

                        const pdf = uint8ArrayToFile(modifiedPdfBytes, 
                                                    pdfFile.name.split('.')[0]+'_modified.pdf', 
                                                    'application/pdf');
                        setPdfFile(pdf);
                        setNumPages(pageCount);
                    } catch (error) {
                        console.error('Error removing pages:', error);
                    }
                    };
                    reader.readAsArrayBuffer(pdfFile); // Start reading the file
                } catch (error) {
                    console.error('FileReader error:', error);
                }
                setIsExtracting(false); 
            }
        } else {
            const link = document.getElementById('link');
            link.click();
            setPdfFile();
            setNumPages();
            setZI([]);
            setIsExtracting(true);
        }
        setText('');
    }
    
    // --------To display the pages of the PDF file using react-pdf library--------
    const renderPages = () => {
        const pages = [];
        const temp = [];
        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
            temp.push(false);
            pages.push(
                <div key={pageNumber+"@"} className="card">
                    <div key={pageNumber+"#"} id={pageNumber} className="overlay" >
                        <span key={pageNumber+"_"} className="tick">&#10003;</span>
                    </div>
                    <button 
                        key={pageNumber} 
                        className="page" 
                        style={{ marginBottom: '20px', zIndex: -1}} 
                        onClick={() => handleClick(pageNumber)}>
                        <Page pageNumber={pageNumber} renderTextLayer={false}/>
                    </button>
                </div>
            );
        }
        if(zI.length<numPages){
            setZI(temp);
        }
        return pages;
    };

    // --------HTML elements--------
    return(
        <div className="main">
            <Header />
            {!pdfFile && <Upload handleChange={handleChange} inputFile={inputFile}/> }
            <div id="previewPdf">
                {pdfFile && (
                    <div>
                        <h1 className="title text">Select the pages to extract</h1>
                        <div id="pdfContainer">
                        <Document
                            file={pdfFile}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onLoadError}
                            onSourceError={onSourceError}>
                            <div key="flexContainer" className="flexContainer">
                                {numPages && renderPages()}
                            </div>
                        </Document>
                        </div>
                        <Input txt={text} 
                            textHandle={handleText} 
                            deletePage={removePages} 
                            isExtract={isExtracting} 
                            fileName={pdfFile.name}
                            URL={URL.createObjectURL(pdfFile)}
                            />
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default App;