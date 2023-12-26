import React,{useState, useRef} from "react";
import Header from "./Header"
import Upload from "./Upload"
// import { PDFDocument } from "pdf-lib";
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,).toString();

function App () {
    const [pdfFile, setPdfFile] = useState();
    const [numPages, setNumPages] = useState(null);
    const inputFile = useRef(null);
    var zI=[true];
    var index = [];

    const handleChange = (event) => {
        const selectedFile = event.target.files[0];
        setPdfFile(selectedFile);
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    function handleText (event) {
        const newText = event.target.value;
        getIndex(newText);
        displayOverlay();
    }

    function getIndex(newText) {
        var temp = newText.split(',');
        const pgNo = temp.reduce((acc, cur) => {
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
        index = pgNo.filter((num, index, arr) => {
            return pgNo.indexOf(num) === index && num < zI.length && num !==0;
        });

    }

    function displayOverlay(){
        index.forEach((element) => {
            if(zI[element-1]){
                document.getElementById(element).style.zIndex=1;
                zI[element-1] = !zI[element-1];
            }
        })
    }

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

    const renderPages = () => {
        const pages = [];
        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
            zI.push(true);
            pages.push(
                <div className="card">
                    <div id={pageNumber} className="overlay" >
                        <span className="tick">&#10003;</span>
                    </div>
                    <button 
                        key={pageNumber} 
                        className="page" 
                        style={{ marginBottom: '20px', zIndex: -1}} 
                        onClick={() => {
                            zI[pageNumber-1] = !zI[pageNumber-1];
                            document.getElementById(pageNumber).style.zIndex=zI[pageNumber-1]?-1:1;
                        }}>
                        <Page pageNumber={pageNumber} renderTextLayer={false}/>
                    </button>
                </div>
            );
            }
        return pages;
    };

    return(
        <div>
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
                            <div className="flexContainer">
                                {numPages && renderPages()}
                            </div>
                        </Document>
                        </div>
                        <div className="input">
                            <div className="btn_box box">
                                <button className= "extract_btn btn" 
                                    type="button">
                                    Extract Pages
                                </button>
                            </div>
                            <div className="heading2">
                                <h2>Enter Page Numbers to extract:</h2>
                            </div>
                            <div className="text_box">
                                <input
                                    type="text"
                                    placeholder="eg: 1, 2-5."
                                    onInput={handleText}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App