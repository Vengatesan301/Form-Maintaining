import React from "react";

import axios from "axios";
import Button from "@mui/material/Button";

import {  useNavigate } from "react-router-dom";

export default function NewUser(){
    const [,setuserList]=React.useState([]);
    const [userDetail,setuserDetail]=React.useState({
        firstname: '',
         lastname:'',
         email:'',
         gender:'',
         age:'',
         active:'',
         password:'',
         role:''
        
})

const change=(e)=>{
    const {name,value} =e.target;
    setuserDetail((prev)=>({

      ...prev,

       [name]:value

}))
}
const Navigate=useNavigate();

const handleSave=()=>
{
 
  if (!userDetail) return;
  axios
    .post("http://localhost:5000/post-formdata1", { ...userDetail })
    .then((res) => {
      setuserList((prev) => {
        const arr = [...prev];
        // console.log(arr);
        //let max=findMax();
        arr.push({
          firstname:userDetail?.firstname,
          lastname:userDetail?.lastname,
          gender:userDetail?.gender,
          email:userDetail?.email,
          password:userDetail?.password,
          age:Number(userDetail?.age),
          active:JSON.parse(userDetail?.active),
          role:userDetail?.role

        });
        
        return arr;
      });
      // console.log(typeof(userDetail.active),"gyyy")
      setuserDetail({
        firstname: '',
        lastname:'',
        email:'',
        gender:'',
         age:'',
         active:'',
         password:'',
         role:''
       

       
      });
     
      if (res.data.message) {
        alert(res.data.message);
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
        <Button variant="contained" onClick={() => Navigate("/")}>
                Back
              </Button>
        </div>

     <div className="flex justify-center items-center h-screen">
        <div className="text-center border border-black p-5">
      
            
      FirstName: <input type="text"  name='firstname' value={userDetail.firstname} onChange={change} placeholder='FirstName'  className="border border-black m-2 p-1 ml-5 rounded"/><br></br>
       LastName: <input type="text" name='lastname' value={userDetail.lastname} onChange={change} placeholder='LastName'  className="border border-black m-2 p-1 ml-5 rounded"/><br></br>
          Email: <input type="text" name='email' value={userDetail.email} onChange={change} placeholder='Email'  className="border border-black m-2 p-1 ml-5 rounded"/><br></br>
          Password: <input type="password " name="password" value={userDetail.password} onChange={change} placeholder="Password"  className="border border-black m-4 p-1 ml-5 rounded"/><br></br>
             Age: <input type="number" name='age' value={userDetail.age} onChange={change} placeholder='Age'  className="border border-black m-2 p-1 ml-5 rounded"/> <br></br>
             Gender: <input name='gender' type='radio' value='Male' checked={userDetail.gender==='Male'} onChange={change} />Male
                 <input name='gender'  type='radio' value='Female' checked={userDetail.gender==='Female'} onChange={change}  />Female
                 <input name='gender'  type='radio'  value='others' checked={userDetail.gender ==='others'} onChange={change} />others<br></br>

             Role: <select name="role"  value={userDetail.role} onChange={change}  className="border border-black m-2 p-1 ml-5 rounded"><br></br>
                 <option value="owner" >owner</option>
                 <br></br>
                 <option value="super-admin">super-admin</option>
                 <br></br>
                 <option value="admin">admin</option>
                 <br></br>
                 <option value="manager">manager</option>
                 <br></br>
                 </select><br></br>

            
   
         {/* Active: <select name="active"  value={userDetail.active} onChange={change}  className="border border-black m-2 p-1 ml-5 rounded">
                 <option value="true" >True</option>
                 <br></br>
                 <option value="false">False</option>
                 <br></br>
                 </select><br></br> */}
         Active: <input name='active' type='radio' value='true' checked={userDetail.active==='true'} onChange={change} />True<b></b>
                 <input name='active'  type='radio' value='false' checked={userDetail.active==='false'} onChange={change}  />False<br></br>

                       <button onClick={()=>{handleSave();Navigate("/")}} className="border border-black rounded bg-slate-100">Submit</button>
                       
        </div>
     </div>
            

        </>
    )
}