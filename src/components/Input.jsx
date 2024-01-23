import React from "react"

function Input (props) {
    return(
        <div>
            {/* --------Extract-------- */}
            {props.isExtract && (
                <div className="input">
                    <div className="btn_box box">
                        <button className= "extract_btn btn" 
                            type="button"
                            onClick={props.deletePage}>
                            {props.isExtract? "Extract Pages": "Download"}
                        </button>
                    </div>
                    
                        <div>
                            <div className="heading2">
                                <h2>Enter Page Numbers to extract:</h2>
                            </div>
                            <div className="text_box">
                                <input
                                    type="text"
                                    placeholder="eg: 1, 2-5."
                                    value={props.txt}
                                    onInput={props.textHandle}/>
                            </div>
                        </div>
                
                </div>
            )}

             {/* --------Download-------- */}
            {!props.isExtract && (
                <div className="download_btn_container box">
                        <button className= "download_btn btn" 
                            type="button"
                            onClick={props.deletePage}>
                            Download
                        </button>
                    <a id="link" href={props.URL} download={props.fileName}>Extract/Download</a>
                </div>
            )}
        </div>
    );
}

export default Input;