import React, { useState } from "react";
import { Route,Routes, BrowserRouter,Navigate} from 'react-router-dom'
import Form from "./form";

import App from "./App";
import NewUser from "./newUser";
import Icon from "./icon";
import Form2 from "./form2"
import Submission from "./Submission";
// import Nav from "./nav";

export default function Route1(){

    const [logged,setLogged] = useState(false);
    const [Id,setId]=useState(localStorage.getItem("getId"));
    const [role,setRole] = useState(localStorage.getItem("getRole"));
    const [tokenKey,setTokentkey]=useState(localStorage.getItem("getToken"));
    const [userName,setUsername]=useState(localStorage.getItem("getUsername"));
    const [submission,setSubmission] = useState([])
    // const [adminDetails,setAdmindetails] = useState();

   // console.log(adminDetails,"ttttttttt")
   
    return(
        <div>
   
        <BrowserRouter>
        

       <Routes>
                    <Route path="/" element={<Form login={logged} setLogin={setLogged} setId={setId} setRole={setRole} setTokentkey={setTokentkey} setUsername={setUsername}/> } />
                    {Id ? (
                        <>
                            <Route path="/App" element={<App Id={Id} role={role} tokenKey={tokenKey}/>}/>
                         
                          
                            <Route path="/icon" element={<Icon userName={userName} tokenKey={tokenKey} />}/>
                            <Route path="/form2" element={<Form2 tokenKey={tokenKey} userName={userName} setSubmission={setSubmission}/>}/>
                            <Route path="/Submission" element={<Submission submission={submission}/>}/>
                        </>
                    ) : (
                        <Route path="/App" element={<Navigate to="/" />} />
                       
                    )}
                    
                    {!tokenKey && <Route path="/*" element={<Navigate to="/" />} />}
                    <Route path="/newUser" element={<NewUser/>} />
                </Routes>

        </BrowserRouter>
        
        {console.log(tokenKey,"key")}
        </div>
        
      
    )
}