

import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../common/Breadcrumb'
import { Link } from 'react-router-dom';
import { MdFilterAltOff, MdModeEdit, MdModeEditOutline } from 'react-icons/md';

import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ViewFaq() {
  let [activeFilter, setactiveFilter] = useState(true);
  let [faq, setFaq] = useState([])
  let [checkedValue, setCheckedValue] = useState([])
  let [apiStatus, setApiStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState()

  useEffect(() => {
    axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_FAQ_VIEW, {page: currentPage})
      .then((success) => {
        if (success.data._status === true) {
          setFaq(success.data._data)
          setTotalPages(success.data._pagination.total_page)
        } else {
          toast.error(success.data._Error_Message[0]);
        }
      })
      .catch((error) => {
        toast.error(error.data._Error_Message[0]);
      });
  }, [apiStatus, currentPage]);

  // checkAll checkbox
  var checkedAll = () => {
    if (faq.length != checkedValue.length) {
      var data = [];
      faq.forEach((value) => {
        data.push(value._id);
      })
      setCheckedValue([...data]);
    } else {
      setCheckedValue([]);
    }
  }

  // check single checkbox
  var singleCheck = (id) => {
    if (checkedValue.includes(id)) {
      var data = checkedValue.filter((value) => {
        if (value != id) {
          return value;
        }
      })
      data = [...data];
      setCheckedValue(data);

    } else {
      const data = [...checkedValue, id];
      setCheckedValue(data);
    }
  }

  const changeStatus = () => {

    if (checkedValue.length > 0) {
      axios.put(
        import.meta.env.VITE_BASE_URL + import.meta.env.VITE_FAQ_CHANGE_STATUS,
        { id: checkedValue }
      )
        .then((response) => {
          if (response.data._status == true) {
            toast.success(response.data._message);
            setApiStatus(!apiStatus);
            setCheckedValue([]);
          } else {
            toast.error(response.data._message);
          }
        })
        .catch(() => {
          toast.error('Something went wrong !!');
        })
    } else {
      toast.error('Please select atlest 1 record to change status')
    }
  }

  const deleteFile = () => {

    if (checkedValue.length > 0) {
      if (confirm('Are you Sure you Want to delete !!')) {
        axios.put(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_FAQ_DELETE, { id: checkedValue })
          .then((response) => {
            if (response.data._status == true) {
              toast.success(response.data._message);
              setApiStatus(!apiStatus);
              setCheckedValue([]);
            } else {
              toast.error(response.data._message);
            }
          })
          .catch(() => {
            toast.error('Something went wrong !!');
          })
      }

    } else {
      toast.error('Please select atlest 1 record to delete')
    }
  }

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
              <span className="ms-1 text-md font-medium text-gray-500 md:ms-2">View</span>
            </div>
          </li>
        </ol>
      </nav>


      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <div className='flex item-center justify-between bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400'>
            <h3 className="text-[26px] font-semibold" >
              View Country
            </h3>
            <div className='flex justify-between '>


              <button
                onClick={changeStatus}
                type="button"
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> Change Status</button>
              <button
                onClick={deleteFile}
                type="button"
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete </button>
            </div>
          </div>
          <div className="border border-t-0 rounded-b-md border-slate-400">

            {/* border-2 border-[red] */}
            <div className="relative overflow-x-auto">


              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <input
                            onClick={checkedAll}
                            checked={faq.length == checkedValue.length ? 'checked' : ''}
                            id="checkbox-all-search"
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                          <label for="checkbox-all-search" className="sr-only">checkbox</label>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Question
                      </th>

                      <th scope="col" className=" w-[40%] ">
                        Answer
                      </th>
                      <th scope="col" className=" w-[8%] ">
                        Order
                      </th>
                      <th scope="col" className="w-[11%]">
                        Status
                      </th>
                      <th scope="col" className="w-[6%]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      faq.length > 0 ?
                        faq.map((v, i) => {
                          return (
                            <tr key={i} className="bg-white  dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="w-4 p-4">
                                <div className="flex items-center">
                                  <input
                                    onClick={() => singleCheck(v._id)}
                                    checked={checkedValue.includes(v._id) ? 'checked' : ''}
                                    id="checkbox-table-search-1"
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                  <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                                </div>
                              </td>
                              <th scope="row" className="flex items-center px-6 py-4 text-gray-900  dark:text-white">

                                <div className="py-4">
                                  <div className="text-base font-semibold">{v.question}</div>

                                </div>
                              </th>

                              <td className=" py-4 mr-10">
                                {v.answer}
                              </td>
                              <td className=" py-4">
                                {v.order}
                              </td>
                              <td className=" py-4">
                                {
                                  v.status == 1
                                    ?
                                    <button type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2">Active</button>
                                    :
                                    <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2">Deactive</button>
                                }
                              </td>
                              <td className=" py-4">
                                <Link to={`/faq/update/${v._id}`} >
                                  <div className="rounded-[50%] w-[40px] h-[40px] flex items-center justify-center text-white bg-blue-700  border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <MdModeEdit className='text-[18px]' />
                                  </div>
                                </Link>
                              </td>
                            </tr>
                          )
                        })
                        :
                        <td className=" py-4 text-center font-bold" colSpan={6}>
                          No Record Found
                        </td>
                    }
                  </tbody>
                </table>
                <div className='py-1 flex flex-row-reverse'>
                  <ResponsivePagination
                    current={currentPage}
                    total={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>



    </section>
  )
}
