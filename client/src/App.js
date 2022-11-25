import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
    const [data, setData] = React.useState(null);

    onChangeHandler=event=>{
        console.log(event.target.files[0])
    }

    return (
        <div className="App">
            <h1 class="title">Upload FBL Scoring File</h1>
            <div class="row">
                <div class="col-md-6">
                    <form method="post" action="#" id="#">
                        <div class="form-group files">
                            <input type="file" class="form-control" onChange={this.onChangeHandler}></input>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;