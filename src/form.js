import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
// import App from "./App";

export default function Form(props) {

    
    // const [userList,setuserList] =useState([])
    const [userValue,setuserValue] = useState(
        {
          email:'',
          password:''
        }
    )
    const change=(e)=>{
        const {name,value}=e.target;
      setuserValue((prev)=>({
        ...prev,
        [name]:value

      }))
    }
    const Navigate = useNavigate();
    const handleSave = () =>{
      axios
      .post(`http://localhost:5000/login`,{...userValue})
      .then((res) => {
        if(res.status===200){
          console.log(res,"werrtyui")
         props.setLogin (true);
        props.setId(res.data.data._id);
        props.setRole(res.data.data.role);
        props.setUsername(res.data.data.firstname)
        // console.log(res.data.token,"jjjjjjjjjjjjj")
        localStorage.setItem("getId",res.data.data._id)
        localStorage.setItem("getRole",res.data.data.role)
        localStorage.setItem("getUsername",res.data.data.firstname)
        localStorage.setItem("getToken",res.data.token)
        localStorage.setItem("getAdmin",JSON.stringify(res.data.data))
        console.log(res.data.data,"hhhhhhhhhhh")
        props.setTokentkey(res.data.token)

        Navigate("/App")
        }else{
          return alert("invalid email ....")
        }
      })
       
        .catch((err) => {
          console.log(err)
          if (err.message) {
            alert(err.response.data.message);
          }
        });
      }

     

 
   
    return(
        <>
        <div className="flex justify-end mt-5 p-4">
          <Button variant="contained" onClick={()=>{Navigate('/newUser')}} className="">New User</Button>
          </div>
          
        <div className="flex justify-center items-center h-screen ">
        
          <div className="text-center border border-black p-5"> 
            
          <b>Email:</b><input type="text" name="email" value={userValue.email} placeholder="Email" onChange={change} className="border border-black m-4 p-2 ml-10 rounded "></input><br></br>
          <b>Password:</b><input type="password" name="password" value={userValue.password} placeholder="Password" onChange={change} className="border border-black m-4 p-2 rounded"></input><br></br>
         
          <button onClick={()=>{handleSave()}} className="border border-black rounded m-4 p-2">LOGIN</button>
          </div>
         
          </div>


        </>
    )
}