import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Modal } from "antd";
import Nav from "./nav";


export default function Form2(props) {
  const [submittedData, setSubmitteddata] = useState([]);
  const [viewData, setViewdata] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModel, setEditmodel] = useState(false);
  const [inputArr, setInputArr] = useState([]);
  const [newEditModel, setNeweditModel] = useState();
  const [index, setIndex] = useState();
  const [typeOf, setTypeof] = useState();
  const [temp, setTemp] = useState();
  const [outputArr, setOutputarr] = useState([]);
  const [currentData, setCurrentdata] = useState();
  // const [name, setName] = useState();
  //const [oldModel,setOldmodel] = useState()
  const [forms, setForms] = useState({
    label: "",
    placeHolder: "",
  });

  const input = [
    {
      name: "text",
    },
    { name: "select" },
    { name: "radio" },
    { name: "checkbox" },
  ];

  const change = (e) => {
    const { name, value } = e.target;
    setForms((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  const Navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/get-formdata2/",{headers:{Authorization:`Bearer ${props.tokenKey} `}})
      .then((res) => {
        console.log(res, "sdfghjkl");
        const { data = [] } = res?.data || {};
        if (data && data?.length) {
          setSubmitteddata(data);
          console.log(data, "dfghjuk");
        }
      })
      .catch((err) => console.log(err));
  },[]);

  const [columnDefs] = useState([
    { field: "formname" },

    { field: "username" },
    { field: "date" },
    {
      field: "view",
      cellRenderer: ({ data }) => {
        return (
          <div>
            <Button
              variant="outlined"
              color="success"
              size="small"
              className=" box-border  p-2 bg-red-400 rounded "
              onClick={() => {
                showModal();
                setCurrentdata(data.submittedForm);
              }}
            >
              view
            </Button>
          </div>
        );
      },
    },
    {
      field: "submission view",
      cellRenderer: ({ data }) => {
        return (
          <div>
            <Button
              variant="outlined"
              color="success"
              size="small"
              className=" box-border  p-2 bg-red-400 rounded "
              onClick={() => {
                Navigate("/Submission");
                props.setSubmission(data);
              }}
            >
              submission View
            </Button>
          </div>
        );
      },
    },
    {
      field: "submission",
      cellRenderer: ({ data }) => {
        return (
          <div>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                showModal();
                setCurrentdata(data.submittedForm);
                setTemp(data);
              }}
            >
              submission
            </Button>
          </div>
        );
      },
    },
    {
      field: "Edit",
      cellRenderer: ({ data }) => {
        return (
          <div>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                showEditmodal();
                setViewdata(data.submittedForm);
                console.log(data.submittedForm, "pppppp");
                setTemp(data);
              }}
            >
              edit
            </Button>
          </div>
        );
      },
    },

    {
      field: "Delete",
      cellRenderer: ({ data }) => {
        return (
          <div>
            <IconButton aria-label="delete">
              <DeleteIcon
                onClick={() => {
                  rowDelete(data._id);
                }}
              />
            </IconButton>
          </div>
        );
      },
    },
  ]);

  console.log(props, "props");

  const Add = () => {
    const updatedOptions = [...outputArr.arr, "New Option"];
    setOutputarr((prevType) => ({ ...prevType, arr: updatedOptions }));
  };

  const handleAdd = (name) => {
    console.log(name);
    if (name === "text") {
      const data = [
        ...viewData,
        { type: "text", label: "", placeHolder: "", value: "" },
      ];
      setViewdata(data);
    }
    if (name === "select") {
      const data = [
        ...viewData,
        { type: "select", label: "", value: "", arr: ["option1", "option2"] },
      ];
      setViewdata(data);
    }
    if (name === "radio") {
      const data = [
        ...viewData,
        { type: "radio", label: "", value: "", arr: ["radio1", "radio2"] },
      ];
      setViewdata(data);
    }
    if (name === "checkbox") {
      const data = [
        ...viewData,
        { type: "checkbox", label: "", value: "", arr: ["bike"] },
      ];
      setViewdata(data);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (x, i) => {
    const update = [...inputArr];
    console.log(update[i], "update");
    update[i] = {
      ...update[i],
      label: forms.label,
      placeHolder: forms.placeHolder,
      arr: x.arr,
    };
    setInputArr(update);
    //setViewdata(data)
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showEditmodal = () => {
    setEditmodel(true);
  };

  const handleEditok = (x, i) => {
    // setViewdata(viewData)
    console.log("hiiii");
    setEditmodel(false);
  };

  const handleEditcancel = () => {
    setEditmodel(false);
  };

  const shownewEditmodal = () => {
    console.log("new model");
    setNeweditModel(true);
  };

  const handleNewOk = (x, i) => {
    setNeweditModel(false);
  };

  const handleNewcancel = () => {
    setNeweditModel(false);
  };

  console.log(props.tokenKey, "props");

  const rowDelete = (value) => {
    // console.log(value, "venke");
    axios
      .delete(`http://localhost:5000/delete-formdata2/${value}`, {
        headers: { Authorization: `Bearer ${props.tokenKey}` },
      })
      .then((res) => {
        setSubmitteddata(res.data.data);
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

  const handleDelete = (i) => {
    setViewdata((prev) => {
      const old = [...prev];
      old.splice(i, 1);
      return old;
    });
  };

  const updateData = () => {
    const id = temp._id;
    console.log(props.userName, "iddd");
    const currentDate = new Date();
    axios
      .patch(`http://localhost:5000/patch-formdata2/${id}`, {
        username: props.userName,
        submittedForm: { ...viewData },
        date: currentDate,
      },{
        headers: { Authorization: `Bearer ${props.tokenKey}` },
      })
      .then((res) => {
        console.log(res, "res");

        setSubmitteddata(res.data.data);
        if (res.data.message) {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        // console.log(err);
        if (err.message) {
          alert(err);
          console.log(err, "err");
        }
      });

    // seteditButton(false)
  };

  const submittedFormdata = () => {
    const id = temp._id;
    //console.log(props.userName,"iddd")
    const currentDate = new Date();
    axios.patch(`http://localhost:5000/patch-submittedForm/${id}`, {
      submittedData: { ...currentData },
      username: props.userName,
      date: currentDate,
    },{
      headers: { Authorization: `Bearer ${props.tokenKey}` },
    });
    const dummy = [...submittedData];
    dummy[index] = { ...dummy[index], submittedData: currentData };
    setSubmitteddata(dummy);

    // seteditButton(false)
  };

  const handleSubmission = () => {
    const dataTosend = viewData;
    console.log(dataTosend, "dataTosend");
  };

  const valueSet = () => {
    viewData[index] = (
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

  const edit = () => {
    viewData[index] = {
      type: typeOf,
      label: forms.label,
      placeHolder: forms.placeHolder,
      arr: outputArr.arr,
    };
  };

  console.log(viewData, "data");

  return (
    <>
    <Nav></Nav>
    
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={() => {
        
          setIsModalOpen(false);

          handleSubmission();
          console.log(viewData, "current6");
          // setViewdata(currentData)
          submittedFormdata();
        }}
        onCancel={handleCancel}
      >
        {"ttttttttttt"}
        {/* {console.log(viewData,"ddddddddd")} */}
        {/* {console.log(name, "name")} */}

        {currentData &&
          currentData.map((data1, i) => {
            return (
              <div className=" flex p-2" key={i}>
                {data1.type === "text" ? (
                  <div>
                    <label>{data1.label}</label>
                    <input
                      placeholder={data1.placeHolder}
                      className="border border-black p-1"
                      value={data1.value}
                      onChange={(e) => {
                        setCurrentdata((prevData) => {
                          const updatedData = [...prevData];
                          console.log(prevData, "ooooooo");
                          updatedData[i].value = e.target.value;
                          return updatedData;
                        });
                      }}
                    ></input>
                  </div>
                ) : data1.type === "select" ? (
                  <div>
                    <label>{data1.label}</label>
                    <select
                      className="border border-black p-1"
                      onChange={(e) => {
                        setCurrentdata((prevData) => {
                          const updatedData = [...prevData];
                          updatedData[i].value = e.target.value;
                          return updatedData;
                        });
                      }}
                    >
                      {data1.arr.map((data, i) => {
                        return <option key={i}>{data}</option>;
                      })}
                    </select>
                  </div>
                ) : data1.type === "radio" ? (
                  <div>
                    <label>{data1.label}</label>
                    {data1.arr.map((data, index) => {
                      return (
                        <div key={index}>
                          <input
                            type="radio"
                            id={{ i }}
                            name={{ i }}
                            //value={data}
                            onChange={() => {
                              setCurrentdata((prevData) => {
                                const updatedData = [...prevData];
                                updatedData[i].value = data;
                                return updatedData;
                              });
                            }}
                            checked={data1.value === data}
                          ></input>
                          <label>{data}</label>
                        </div>
                      );
                    })}
                  </div>
                ) : data1.type === "checkbox" ? (
                  <div>
                    {data1.arr.map((data, index) => {
                      return (
                        <div key={index}>
                          <label>{data1.label}</label>
                          <input
                            type="checkbox"
                            className="border border-black"
                            // id={{ i }}
                            // name={{ i }}
                            // value={data}
                            onChange={() => {
                              setCurrentdata((prevData) => {
                                const updatedData = [...prevData];
                                updatedData[i].value = data;
                                return updatedData;
                              });
                            }}
                            checked={data1.value === data}
                          ></input>
                          <label>{data}</label>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
      </Modal>

      <Modal
        title="Basic Modal"
        open={editModel}
        onOk={() => {
          handleEditok();
          updateData();

          // setCurrentdata(viewData)

          console.log(viewData, "vieData");
        }}
        onCancel={handleEditcancel}
      >trfuyhtuyj
  
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
        {console.log(viewData, "fffffffff")}

        {viewData &&
          viewData.map((data1, i) => {
            return (
              <div className=" flex p-2" key={i}>
                {data1.type === "text" ? (
                  <div>
                    <label>{data1.label}</label>
                    <input
                      placeholder={data1.placeHolder}
                      className="border border-black p-1"
                    ></input>
                  </div>
                ) : data1.type === "select" ? (
                  <div>
                    <label>{data1.label}</label>
                    <select className="border border-black p-1">
                      {data1.arr.map((data, i) => {
                        return <option key={i}>{data}</option>;
                      })}
                    </select>
                  </div>
                ) : data1.type === "radio" ? (
                  <div>
                    <label>{data1.label}</label>
                    {data1.arr.map((data, i) => {
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
                ) : data1.type === "checkbox" ? (
                  <div>
                    {data1.arr.map((data, i) => {
                      return (
                        <div key={i}>
                          <label>{data1.label}</label>
                          <input
                            type="checkbox"
                            className="border border-black"
                            // id={{ i }}
                            // name={{ i }}
                            // value={data}
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
                    shownewEditmodal();
                    setIndex(i);
                    setTypeof(data1.type);
                    setOutputarr(data1);
                    setForms({label:data1.label,placeHolder:data1.placeHolder})
                    console.log(data1.type, "typeee");
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
            handleOk(outputArr, index);

            console.log(viewData, index, "ssssssss");
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
                          onChange={(e) => {
                            const updateOption = [...outputArr.arr];
                            updateOption[i] = e.target.value;
                            setOutputarr((prev) => ({
                              ...prev,
                              arr: updateOption,
                            }));
                          }}
                        ></input>

                        <IconButton aria-label="delete">
                          <DeleteIcon
                            onClick={() => {
                              const updateOption = [...outputArr.arr];
                              updateOption.splice(i, 1);
                              setOutputarr((prev) => ({
                                ...prev,
                                arr: updateOption,
                              }));
                            }}
                          />
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
                          type="checkbox"
                          className="border border-black"
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
                  shownewEditmodal();
                  setIndex(i);
                  setTypeof(item.type);
                  setOutputarr(item);
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
      </Modal>

      <Modal
        title="Basic Modal"
        open={newEditModel}
        onOk={() => {
          handleNewOk();
          valueSet();
          edit();
        }}
        onCancel={handleNewcancel}
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
                        onChange={(e) => {
                          const updateOption = [...outputArr.arr];
                          updateOption[i] = e.target.value;
                          setOutputarr((prev) => ({
                            ...prev,
                            arr: updateOption,
                          }));
                        }}
                      ></input>

                      <IconButton aria-label="delete">
                        <DeleteIcon
                          onClick={() => {
                            const updateOption = [...outputArr.arr];
                            updateOption.splice(i, 1);
                            setOutputarr((prev) => ({
                              ...prev,
                              arr: updateOption,
                            }));
                          }}
                        />
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

      <div
        className="ag-theme-alpine"
        style={{
          height: 900,
          width: "80 %",
          marginTop: "20px",
          margin: "10px",
        }}
      >
        <AgGridReact
          rowData={submittedData}
          columnDefs={columnDefs}
        ></AgGridReact>
      </div>
    </>
  );
}
