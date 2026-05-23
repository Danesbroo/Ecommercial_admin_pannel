import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../common/Breadcrumb'
import { Link } from 'react-router-dom';
import { MdFilterAltOff, MdModeEdit, MdModeEditOutline } from 'react-icons/md';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ViewCategory() {

  let [activeFilter, setactiveFilter] = useState(true);
  let [color, setColor] = useState([])
  let [nameFilter, setNameFilter] = useState('');
  let [checkedValue, setCheckedValue] = useState([])
  let [apiStatus, setApiStatus] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState()

  useEffect(() => {
    axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_COLOR_VIEW, { name: nameFilter, page: currentPage })
      .then((success) => {
        if (success.data._status === true) {
          setColor(success.data._data)
          setTotalPages(success.data._pagination.total_page)
        } else {
          toast.error(success.data._Error_Message[0]);
        }
      })
      .catch((error) => {
        toast.error(error.data._Error_Message[0]);
      });
  }, [apiStatus, nameFilter, currentPage]);
  // checkAll checkbox
  var checkedAll = () => {
    if (color.length != checkedValue.length) {
      var data = [];
      color.forEach((value) => {
        data.push(value._id);
      })
      setCheckedValue([...data]);
    } else {
      setCheckedValue([]);
    }
  }
  // search value from filter
  const searchRecord = (event) => {
    event.preventDefault();
    setNameFilter(event.target.search.value)

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
      console.log(data);

    } else {
      const data = [...checkedValue, id];
      setCheckedValue(data);
      console.log(data);
    }
  }
  const changeStatus = () => {

    if (checkedValue.length > 0) {
      axios.put(
        import.meta.env.VITE_BASE_URL + import.meta.env.VITE_COLOR_CHANGE_STATUS,
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
        axios.put(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_COLOR_DELETE, { id: checkedValue })
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

      <Breadcrumb path={"Color"} link={"/colors/view-color"} path2={"View"} slash={"/"} />

      <div className={`bg-gray-50 px-2 py-5 max-w-[1220px] duration-[1s] mx-auto mt-10 ${activeFilter ? "hidden" : "block"}`}>

        <form className="flex max-w-sm" onSubmit={searchRecord}>
          <div className="relative w-full">
            <input
              type="text"
              name='search'
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search  name..."
              required
            />
          </div>
          <button
            type="submit"
            className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </form>


      </div>
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <div className='flex item-center justify-between bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400'>
            <h3 className="text-[16px] sm:text-[20px] md:text-[26px] font-semibold" >
              View Color
            </h3>
            <div className='flex justify-between '>
              <div onClick={() => setactiveFilter(!activeFilter)} className="cursor-pointer text-white mx-3 rounded-[50%] w-[40px] h-[40px] flex items-center justify-center bg-blue-700  border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {activeFilter ? <FaFilter className='text-[18px]' /> : <MdFilterAltOff className='text-[18px]' />}
              </div>
              <button onClick={changeStatus} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 sm:px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> Change Status</button>
              <button onClick={deleteFile} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 sm:px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete </button>
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
                            id="checkbox-all-search"
                            type="checkbox"
                            onClick={checkedAll}  // we trigger click to store it's id in state
                            checked={color.length == checkedValue.length ? 'checked' : ''}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                          <label for="checkbox-all-search" className="sr-only">checkbox</label>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Color Name
                      </th>
                      <th scope="col" className=" w-[10%] ">
                        Code
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
                      color.length > 0
                        ?
                        color.map((v, i) => {
                          return (
                            <tr key={i} className="bg-white  dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="w-4 p-4">
                                <div className="flex items-center">
                                  <input
                                    id="checkbox-table-search-1"
                                    onClick={() => singleCheck(v._id)}
                                    checked={checkedValue.includes(v._id) ? 'checked' : ''}
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                  <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                                </div>
                              </td>
                              <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                <div className="py-4">
                                  <div className="text-base font-semibold">{v.name}</div>
                                </div>
                              </th>
                              <td className=" py-4">
                                {v.code}
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

                                <Link to={`/color/update/${v._id}`} >
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
