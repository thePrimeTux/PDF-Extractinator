import React from "react"

function Input (props) {
    return(
        <div className="input">
            <div className="btn_box box">
                <button className= "extract_btn btn" 
                    type="button"
                    onClick={props.deletePage}>
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
                    value={props.txt}
                    onInput={props.textHandle}/>
            </div>
        </div>
    );
}

export default Input;