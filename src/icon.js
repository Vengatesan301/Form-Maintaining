// import React, { lazy } from "react";
import { useState } from "react";
// import axios from "axios";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal } from "antd";
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "./nav";

export default function Icon(props) {
  //console.log(props.userName,"propssssssssss")
  const [forms, setForms] = useState({
    label: "",
    placeHolder: "",
  });
  const [index, setIndex] = useState();
  const [outputArr, setOutputarr] = useState([]);
  const [inputArr, setInputArr] = useState([]);
  const [typeOf, setTypeof] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName,setFormname]=useState();
  const input = [
    {
      name: "text",
    },
    { name: "select" },
    { name: "radio" },
    { name: "checkbox" },
  ];
  
  // const Navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setForms((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  const handleAdd = (name) => {
    console.log(name);
    if (name === "text") {
      const data = [...inputArr, { type: "text", label: "", placeHolder: "",value:"" }];
      setInputArr(data);
    }
    if (name === "select") {
      const data = [
        ...inputArr,
        { type: "select", label: "",value:"", arr: ["option1", "option2"] },
      ];
      setInputArr(data);
    }
    if (name === "radio") {
      const data = [
        ...inputArr,
        { type: "radio", label: "",value:"", arr: ["radio1", "radio2"] },
      ];
      setInputArr(data);
    }
    if (name === "checkbox") {
      const data = [
        ...inputArr,
        { type: "checkbox", label: "",value:"", arr: ["bike"] },
      ];
      setInputArr(data);
    }
  };
  const handleDelete = (i) => {
    setInputArr((prev) => {
      const old = [...prev];
      old.splice(i, 1);
      return old;
    });
  };

  //console.log(inputArr,"input");

  const edit = () => {
    inputArr[index] = {
      type: typeOf,
      label: forms.label,
      placeHolder: forms.placeHolder,
      arr: outputArr.arr,
    };
  };



  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (x,i) => {
    const update=[...inputArr];
    update[i]={...update[i], label:forms.label,placeHolder:forms.placeHolder,arr:x.arr}
    setInputArr(update);
    
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const valueSet = () => {
    inputArr[index] = (
      <div>
        <label>{forms.label} : </label>
        <input
          placeholder={forms.placeHolder}
          className="border border-black p-2"
        ></input>
      </div>
    );
    setForms({
      label: "",
      placeHolder: "",
    });
  };

  const Add = () => {
    const updatedOptions = [...outputArr.arr, "New Option"];
    setOutputarr((prevType) => ({ ...prevType, arr: updatedOptions }));
  };

  const handleSubmit = () =>{
    const currentDate = new Date();
    axios.post("http://localhost:5000/post-formdata2",{formname:formName,date:currentDate,submittedForm:inputArr,username:props.userName},{
      headers: { Authorization: `Bearer ${props.tokenKey}` },
    })
    .then(()=>{
      setInputArr([]);
       setFormname("");
    })
    .catch((err)=>{
      if(err.response.data.message)
      {
        alert(err.response.data.message)
      }
    });
  }

  return (
    
    <div >

      <Nav setName={props.userName}></Nav>
       <div className="flex mt-5">
      <b>FormName:</b> <input  type="text"  value={formName} onChange={(e)=>setFormname(e.target.value)}className="border border-black p-1"></input>
      <Button onClick={()=>handleSubmit()} disabled={formName===""}>Add Form</Button>
      {/* <Button variant="contained" onClick={()=>Navigate("/form2")}>Form</Button> */}
      </div>
      {input.map((item, index) => {
        return (
          <div className="p-2" key={index}>
            <Button
              onClick={() => handleAdd(item.name)}
              variant="contained"
              className=""
            >{`Add ${item.name}`}</Button>
          </div>
        );
      })}

      {inputArr.map((item, i) => {
        // {console.log(item,"ggjggg")}
        return (
          <div className=" flex p-2" key={i}>
            {item.type === "text" ? (
              <div>
                <label>{item.label}</label>
                <input
                  placeholder={item.placeHolder}
                  className="border border-black p-1"
                ></input>
              </div>
            ) : item.type === "select" ? (
              <div>
                <label>{item.label}</label>
                <select className="border border-black p-1">
                  {item.arr.map((data, i) => {
                    return <option key={i}>{data}</option>;
                  })}
                </select>
              </div>
            ) : item.type === "radio" ? (
              <div>
                <label>{item.label}</label>
                {item.arr.map((data, i) => {
                  return (
                    <div key={i}>
                      <input
                        type="radio"
                        id={{ i }}
                        name={{ i }}
                        value={data}
                      ></input>
                      <label>{data}</label>
                    </div>
                  );
                })}
              </div>
            ) : item.type === "checkbox" ? (
              <div>
                
                 <label>{item.label}</label>
                {item.arr.map((data, i) => {
                  return (
                    <div key={i}>
                     
                      <input
                        type="checkbox" className="border border-black"
                        // id={{ i }}
                        // name={{ i }}
                        //value={data}
                      ></input>
                      <label>{data}</label>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <Button
              type="primary"
              onClick={() => {
                showModal();
                setIndex(i);
                setTypeof(item.type);
                setOutputarr(item);
                setForms({label:item.label,placeHolder:item.placeHolder})
                console.log(item.type, "typeee");
              }}
            >
              Edit
            </Button>

            <IconButton aria-label="delete">
              <DeleteIcon onClick={() => handleDelete(i)} />
            </IconButton>
          </div>
        );
      })}
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={() => {
          handleOk(outputArr,index);
          valueSet();
          edit();
        }}
        onCancel={handleCancel}
      >
        <div>
          {/* {console.log(item,"jjjjjjj")} */}
          {typeOf === "text" ? (
            <div>
              Label:{" "}
              <input
                name="label"
                value={forms?.label}
                onChange={change}
                className="border border-black"
              ></input>
              placeHolder:{" "}
              <input
                name="placeHolder"
                value={forms?.placeHolder}
                onChange={change}
                className="border border-black"
              ></input>
            </div>
          ) : (
            <div>
              Label :{" "}
              <input
                name="label"
                value={forms?.label}
                onChange={change}
                className="border border-black"
              ></input>
              {outputArr &&
                outputArr?.arr?.map((data, i) => {
                  return (
                    <div key={i} className="flex p-2">
                      <input
                        className="border border-black mt-2"
                        value={data}
                        onChange={(e)=>{const updateOption=[...outputArr.arr]; updateOption[i]=e.target.value; setOutputarr((prev)=>({...prev,arr:updateOption}));}}
                      ></input>
                      
                      <IconButton aria-label="delete">
              <DeleteIcon onClick={()=>{const updateOption=[...outputArr.arr]; updateOption.splice(i,1); setOutputarr((prev)=>({...prev,arr:updateOption}));}} />
            </IconButton>
                      {/* <Button variant="outlined" className=""onClick={()=>{const updateOption=[...outputArr.arr]; updateOption.splice(i,1); setOutputarr((prev)=>({...prev,arr:updateOption}));}}>delete</Button> */}
                    </div>
                  );
                })}
              <Button variant="contained" onClick={() => Add()}>
                Add
              </Button>
            </div>
          )}
        </div>
      </Modal>
     
    </div>
    
  
   
   
  );
}
