

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Breadcrumb from "../../common/Breadcrumb";

import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddFaq() {
  const [faqDetails, setFaqDetails] = useState({});
  const [updateIdState,setUpdateIdState]=useState(false)
  const params = useParams();
  const updateId = params.id;
  const navigate = useNavigate();

  // Fetch faq details if updating
  useEffect(() => {
    if (updateId) {
      axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_FAQ_DETAILS,{
        id: updateId
      })
        .then((response) => {
          if (response.data._status == true) {
            setFaqDetails(response.data._data)
          } else {
            setFaqDetails('');
          }
        })
        .catch(() => {
          toast.error('Something went wrong !!');
        })
    }
  }, [updateId]);

  // Handle form submit
  const formHandler = (event) => {
    event.preventDefault();

    const data = {
      question: event.target.question.value,
      answer: event.target.answer.value,
      order: event.target.order.value,
    }

    if (updateId) {
      axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_FAQ_UPDATE}/${updateId}`, data)
        .then((success) => {
          if (success.data._status == true) {
            toast.success(success.data._message);
            navigate('/faq/view');
          } else {
            toast.error(success.data._message);
          }
        })
        .catch((error) => {
          toast.error(error.data._message);
        })
    } else {
      axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_FAQ_CREATE, data)
        .then((success) => {
          if (success.data._status === true) {
            toast.success(success.data._message);
            navigate('/faq/view'); // navigate to file into material page

          } else {
            toast.error(success.data._Error_Message[0]);
          }
        })
        .catch((error) => {
          toast.error(error.data._Error_Message[0]);
        });
    };
  }

  useEffect(() => {
    if (updateId == undefined) {
      setUpdateIdState(false)
    }
    else {
      setUpdateIdState(true)
    }
  }, [updateId])



  return (
    <section className="w-full">
      <nav className="flex border-b-2" aria-label="Breadcrumb">
        <ol className="p-3 px-6 inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center ">
            <Link to={"/home"} className="inline-flex items-center text-md font-medium text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              /
              <Link to={"/faq/view"} className="ms-1 text-md font-medium text-gray-700 hover:text-blue-600 md:ms-2">Faq</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              /
              <span className="ms-1 text-md font-medium text-gray-500 md:ms-2">{updateIdState ? "Update" : "Add"}</span>
            </div>
          </li>
        </ol>
      </nav>
      {/* <Breadcrumb path={"Faq"} path2= {updateIdState ? "Update" : "Add"}  slash={"/"} /> */}
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {updateIdState ? "Update Faq" : "Add Faq"}
          </h3>
          <form onSubmit={formHandler} autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">

            <div className="">
              <div className="mb-5">
                <label
                  htmlFor="Question"
                  className="block mb-2 text-md font-medium text-gray-900"
                >
                  Question
                </label>
                <input
                  name="question"
                  defaultValue={faqDetails.question}
                  type="text"
                  id="Question"
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder="Question"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="Answer"
                  className="block mb-2 text-md font-medium text-gray-900"
                >
                  Answer
                </label>
                <textarea
                  name="answer"
                  defaultValue={faqDetails.answer}
                  id="Answer"
                  className="text-[19px] h-[150px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder="Answer"
                ></textarea>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="order"
                  className="block mb-2 text-md font-medium text-gray-900"
                >
                  Order
                </label>
                <input
                  name="order"
                  defaultValue={faqDetails.order}
                  type="number"
                  id="order"
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder="Order"
                />
              </div>
            </div>

            <button
              type="submit"
              className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {updateIdState ? "Update Faq" : "Add Faq"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
