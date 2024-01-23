import React from "react";

function Upload(props) {
    return (
        <div>
            <div id="title" className="title text">
                    <h1 className="heading">Extract PDF pages</h1>
                </div>
            <div id="content" className="content text">
                <p>Select and extract pages from your PDF file. Download a PDF containing the extracted pages</p>
            </div>
            <div id="upload" className="btn_container">
                <button className= "upload_btn btn" 
                onClick={() => props.inputFile.current.click()} 
                type="button">
                Upload PDF File
                </button>
                <input id="pdfInput" type="file" onChange={props.handleChange} ref={props.inputFile} accept="application/pdf" />
            </div>
        </div>
    );
}

export default Upload;