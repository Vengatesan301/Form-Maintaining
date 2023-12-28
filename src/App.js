
import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Button from '@mui/material/Button';
import Nav from "./nav";
import { Modal } from "antd";












function App(props) {
    // const {Id } =props;

  const [userList,setuserList]=React.useState([]);
  const [editButton,seteditButton] =useState(false);
  const [temp,settemp]=useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModel,setEditmodel] = useState();

  const [initialData,setInitialdata] =useState();
  // const [admin,setAdmin]=useState();
 
  // console.log(props.role,"role")
 const role=!(props.role==="super-admin"||props.role==="owner")
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








const handleSave=()=>
{
 
  if (!userDetail) return;
  axios
    .post("http://localhost:5000/post-formdata1", { ...userDetail, },{headers:{Authorization:`Bearer${props.tokenKey}`}})
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
      setIsModalOpen(false)
    console.log(res,"uhj8i")
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

useEffect(() => {
  axios
    .get("http://localhost:5000/get-formdata1/",{headers:{Authorization:`Bearer ${props.tokenKey}`}})
    .then((res) => {
      const { data = [] } = res?.data || {};
      if (data && data?.length) {
        setuserList(data);
      }
    })
    .catch((err) => console.log(err));
}, []);

const [columnDefs] = useState([

  // {field:"id"},
  { field: "firstname" },

    { field: "lastname",},
    { field: "email" },
    { field: "age" },
    {field:"gender"},
    {field:"active"},
   
    {field :"role"},
    
    {field:"Delete",hide:role,cellRenderer:({data})=>{
      console.log(role,"huuhh")
      return (
        <div>
          <Button variant="contained" color="error" size="small" onClick={()=>{ handleDelete(data._id)}} className=" box-border  p-2 bg-red-400 rounded ">delete</Button>
        </div>
      )
    }},
    
    {field:"Edit",hide:role,cellRenderer:({data})=>{

      console.log(data,"Editdata")
      return(
        <div>
          <Button variant="contained" size="small" onClick={()=>{handleEdit(data);settemp(data);seteditButton(true);showEditmodal()}} className="box-border p-2 bg-blue-400 rounded ">Edit</Button>
        </div>
      )
    }},
   
  
    
  
  
  ]);

  const handleDelete = (value) => {
    axios
      .delete(`http://localhost:5000/delete-formdata1/${value}`,{headers:{Authorization:`Bearer ${props.tokenKey}`}})
      .then((res) => {
   
      setuserList(res.data.data)
        if (res.data.message) {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        // console.log(err);
        if (err.message) {
          alert(err.message);
        }
      });
  };
      



  const handleEdit =(data)=>{
    console.log(data,"venke")
   
    
      const t = data;
      setuserDetail({
        firstname: t?.firstname,
        lastname: t?.lastname,
        email: t?.email,
        gender: t?.gender,
        age:t?.age,
        active:t?.active,
       
        role:t?.role
    
      });


  }

  const clearEdit =()=>{

    
    setuserDetail({
      firstname:"",
      lastname:"",
      email:"",
      gender: "",
      age:"",
      active:"",
     // password:"",
      role:""
  
    });

    seteditButton(false)

  }


const updateData =()  =>{
  const id=temp._id;
  console.log(id,"iddd")
  axios
  .patch(`http://localhost:5000/patch-formdata1/${id}`,{...userDetail},{headers:{Authorization:`Bearer ${props.tokenKey} `}})
  .then(res=>{

  
    setuserList(res.data.data)
    if (res.data.message) {
      alert(res.data.message);
    }
  


  })
  // console.log(userList,"yjuhty");
  setuserDetail({
    firstname: '',
    lastname:'',
    email:'',
    gender:'',
    age:'',
    password:'',
    active:'',
    role:''
    
   

   
  });

  seteditButton(false)
  setEditmodel(false);
}



const showModal = () => {
  setIsModalOpen(true);
};

const handleOk = () => {
  //updateData();
  
  setIsModalOpen(false);
};

const handleCancel = () => {
  setIsModalOpen(false);
};


const showEditmodal = () => {
  setEditmodel(true);
};

const handleEditok = () => {
  updateData();
  
  setEditmodel(false);
};

const handleEditcancel = () => {
  setEditmodel(false);
};




console.log(props)
const userData=userList?.filter((item)=>item._id !== props.Id);
const adminData=userList?.filter((item)=>item._id===props.Id);


//console.log(props.setAdmindetails(adminData),"pppppppp")
 const Navigate=useNavigate();


return (
    <div>
      <Nav ></Nav>

      <div className="flex px-2  py-2">

      <Button variant="contained" onClick={()=>{showModal();clearEdit()}}>New User</Button>
      </div>

      <div className="px-2 py-2">

<Button variant="contained" className="" onClick={()=>{handleEdit(adminData[0]);seteditButton(true);settemp(adminData?adminData[0]:props.Id);showEditmodal();}}  >Admin</Button>
 
</div>


      <div className="px-2  py-2">

      <Button variant="contained" onClick={()=>{Navigate('/icon')}} className="" >FORM</Button>

      </div>

      


      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={() => {
          handleOk();
         
        }}
        onCancel={handleCancel}
      >





    
      <div className="flex justify-between">
    <div className="text-center border border-black p-5">
      {console.log(userList,"hi")}
            
      FirstName: <input type="text"  name='firstname' value={userDetail.firstname} onChange={change} placeholder='FirstName'  className="border border-black m-2 p-1 ml-5 rounded"/><br></br>
       LastName: <input type="text" name='lastname' value={userDetail.lastname} onChange={change} placeholder='LastName'  className="border border-black m-2 p-1 ml-5 rounded"/><br></br>
          Email: <input type="text" name='email' value={userDetail.email} onChange={change} placeholder='Email'  className="border border-black m-2 p-1 ml-5 rounded"/><br></br>
          Password: <input type="password " name="password" value={userDetail.password} onChange={change} placeholder="Password"  className="border border-black m-4 p-1 ml-5 rounded"/><br></br>
             Age: <input type="number" name='age' value={userDetail.age} onChange={change} placeholder='Age'  className="border border-black m-2 p-1 ml-5 rounded"/> <br></br>

             Active: <input name='active' type='radio' value='true' checked={userDetail.active==='true'} onChange={change} />True
                 <input name='active'  type='radio' value='false' checked={userDetail.active==='false'} onChange={change}  />False<br></br>

             Role: <select name="role"  value={userDetail.role} onChange={change}  className="border border-black m-2 p-1 ml-5 rounded">
                 <option value="owner" >owner</option>
                 <br></br>
                 <option value="super-admin">super-admin</option>
                 <br></br>
                 <option value="admin">admin</option>
                 <br></br>
                 <option value="manager">manager</option>
                 <br></br>
                 </select><br></br>

            
         Gender: <input name='gender' type='radio' value='Male' checked={userDetail.gender==='Male'} onChange={change} />Male
                 <input name='gender'  type='radio' value='Female' checked={userDetail.gender==='Female'} onChange={change}  />Female
                 <input name='gender'  type='radio'  value='others' checked={userDetail.gender ==='others'} onChange={change} />others<br></br>
       
                 
       
                <div className="mt-4">

                       <Button variant="contained" onClick={()=>{editButton? updateData():handleSave()}} className="border border-black rounded bg-slate-100">{editButton?"Edit":"Submit"}</Button>
                       <Button   variant="contained" onClick={()=>{clearEdit()}}>clear</Button>
                 </div>
                       
                </div>
               
       
         <div className="mt-2 p-2">
          {/* <p>{adminData?adminData[0]?.firstname:""}</p>
          <p>{adminData?adminData[0]?.role:""}</p> */}
         
          {/* <Button variant="contained" onClick={()=>{Navigate('/icon')}} className="" >FORM</Button> */}

          {/* <Button  onClick={()=>{Navigate('/nav')}}>Nav</Button> */}
          
       
         {/* <Button variant="contained" onClick={()=>{Navigate("/");localStorage.removeItem("getId");localStorage.removeItem("getUsername");localStorage.removeItem("getRole");localStorage.removeItem("getToken")}} className="">Log out</Button> */}
        
       
         </div>
         </div>
         </Modal>

         <Modal
        title="Basic Modal"
        open={editModel}
        onOk={() => {
          handleEditok();
         
        }}
        onCancel={handleEditcancel}
      >
         <div className="flex justify-between">
    <div className="text-center border border-black p-5">
      {console.log(userList,"hi")}
            
      FirstName: <input type="text"  name='firstname' value={userDetail.firstname} onChange={change} placeholder='FirstName'  className="border border-black m-2 p-1 ml-5 rounded"/><br></br>
       LastName: <input type="text" name='lastname' value={userDetail.lastname} onChange={change} placeholder='LastName'  className="border border-black m-2 p-1 ml-5 rounded"/><br></br>
          Email: <input type="text" name='email' value={userDetail.email} onChange={change} placeholder='Email'  className="border border-black m-2 p-1 ml-5 rounded"/><br></br>
          {/* Password: <input type="password " name="password" value={userDetail.password} onChange={change} placeholder="Password"  className="border border-black m-4 p-1 ml-5 rounded"/><br></br> */}
             Age: <input type="number" name='age' value={userDetail.age} onChange={change} placeholder='Age'  className="border border-black m-2 p-1 ml-5 rounded"/> <br></br>

             Active: <input name='active' type='radio' value='true' checked={userDetail.active==='true'} onChange={change} />True
                 <input name='active'  type='radio' value='false' checked={userDetail.active==='false'} onChange={change}  />False<br></br>

             Role: <select name="role"  value={userDetail.role} onChange={change}  className="border border-black m-2 p-1 ml-5 rounded">
                 <option value="owner" >owner</option>
                 <br></br>
                 <option value="super-admin">super-admin</option>
                 <br></br>
                 <option value="admin">admin</option>
                 <br></br>
                 <option value="manager">manager</option>
                 <br></br>
                 </select><br></br>

            
         Gender: <input name='gender' type='radio' value='Male' checked={userDetail.gender==='Male'} onChange={change} />Male
                 <input name='gender'  type='radio' value='Female' checked={userDetail.gender==='Female'} onChange={change}  />Female
                 <input name='gender'  type='radio'  value='others' checked={userDetail.gender ==='others'} onChange={change} />others<br></br>
       
                 
       
                <div className="mt-4">

                       <Button variant="contained" onClick={()=>{editButton? updateData():handleSave()}} className="border border-black rounded bg-slate-100">{editButton?"Edit":"Submit"}</Button>
                       <Button   variant="contained" onClick={()=>{clearEdit()}}>clear</Button>
                 </div>
                       
                </div>
       
         <div className="mt-2 p-2">
          {/* <p>{adminData?adminData[0]?.firstname:""}</p>
          <p>{adminData?adminData[0]?.role:""}</p> */}
          {/* <Button variant="contained" onClick={()=>{Navigate('/icon')}} className="" >ICons</Button> */}

          {/* <Button  onClick={()=>{Navigate('/nav')}}>Nav</Button> */}
          
       
         {/* <Button variant="contained" onClick={()=>{Navigate("/");localStorage.removeItem("getId");localStorage.removeItem("getUsername");localStorage.removeItem("getRole");localStorage.removeItem("getToken")}} className="">Log out</Button> */}
        
       
         </div>
         </div>
      </Modal>
       
            <div className="ag-theme-alpine" style={{ height: 900, width:'80 %',marginTop:"20px" ,margin:'10px' }}>
                    <AgGridReact rowData={userData} columnDefs={columnDefs}  ></AgGridReact>
                  
      
              </div>
   
    </div>
  );
}

export default App;
