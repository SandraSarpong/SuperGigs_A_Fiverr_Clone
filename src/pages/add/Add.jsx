import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form'
import axios from 'axios'

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const {register, reset, handleSubmit} = useForm()
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const [selectedValue, setSelectedValue] = useState("");
  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };
  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();


  //  const postGig = (data) => {
  //   return axios.post("https://clever-clam-visor.cyclic.app/api/gigs", data)
  // }
  const {isLoading, mutate} = useMutation({
    mutationFn: (gig) => {
          return newRequest.post("/gigs", gig);
        },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });
  // const {isLoading, mutate} = useMutation({
  //   mutationFn: (gig) => {
  //     return newRequest.post("/gigs", gig);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries("myGigs");
  //   },
  // });

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(state)
  //   mutate(state);
  //   // navigate("/mygigs")
  // };

  // const url = "https://clever-clam-visor.cyclic.app/api/gigs"
  const OnSUbmit = handleSubmit( async (values)=> {
    const data = {
          userId: JSON.parse(localStorage.getItem("currentUser"))?._id,
          title: values.title,
          desc: values.desc,
          shortTitle: values.shortTitle,
          shortDesc: values.shortDesc,
          deliveryTime: parseInt(values.deliveryTime),
          price: parseInt(values.price),
          cat: selectedValue
        }
        console.log(data)
        try {
      console.log(data)
      const response = await newRequest.post("gigs", data)
      reset()
      return response.statusText
    } catch (error) {
      window.alert("Fail to post gig")
      return error.statusText
    }
  })

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <form onSubmit={OnSUbmit}>
        <div className="sections">
          
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              
              placeholder="e.g. I will do something I'm really good at"
              {...register("title")}
            />
            <label htmlFor="">Category</label>
            <select  id="cat" value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} >
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "uploading" : "Upload"}
              </button>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              {...register("desc")}
            ></textarea>
            <button onClick={OnSUbmit}>Create</button>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
             
              placeholder="e.g. One-page web design"
              {...register("shortTitle")}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              
              {...register("shortDesc")}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
            ></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input type="number"  {...register("deliveryTime")} />
            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              
              {...register("revisionNumber")}
            />
            <label htmlFor="">Add Features</label>
            {/* <form action="" className="add" onSubmit={handleFeature}> */}
              <input type="text" placeholder="e.g. page design" />
              {/* <button type="submit">add</button> */}
            {/* </form> */}
            <div className="addedFeatures">
              {/* {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))} */}
            </div>
            <label htmlFor="">Price</label>
            <input type="number" {...register("price")}  />
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
