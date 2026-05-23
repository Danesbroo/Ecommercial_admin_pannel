// import React, { useEffect, useState } from "react";
// import $ from "jquery";
// import Cookies from "js-cookie";
// import "dropify/dist/css/dropify.min.css";
// import "dropify/dist/js/dropify.min.js";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
// import { set } from "react-hook-form";

// export default function CompanyProfile() {
//   const [imagePath, setImagePath] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [companyData, setCompanyData] = useState(null);
//   const { id } = useParams(); // Get company ID from URL
//   console.log(companyData);

//   // Initialize Dropify once after component mounts
//   useEffect(() => {
//     const dropifyElement = $("#image");

//     if (dropifyElement.data('dropify')) {
//       dropifyElement.data('dropify').destroy();
//       dropifyElement.removeData('dropify');
//     }
//     // update dropify
//     dropifyElement.replaceWith(
//       `<input type="file" name="image" id="image" class="dropify" data-height="250" data-default-file="${imagePath}" accept="image/*">`
//     );
//     $("#image").dropify()
//   }, [imagePath]);

//   // Fetch company data from API
//   useEffect(() => {
//     const fetchCompanyData = async () => {
//       const token = Cookies.get("token"); // get token if auth required

//       try {
//         const res = await axios.post(
//           `http://localhost:4000/api/admin/company/details/${id}`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${token}`, // send token if backend needs it
//             },
//           }
//         );

//         if (res.data._status) {
//           setCompanyData(res.data._data); // set response data to state
//           setImagePath(res.data._data.image); // set image path for Dropify
//         } else {
//           toast.error(res.data._message);
//         }
//       } catch (error) {
//         toast.error(error.response?.data?._message || "Failed to fetch company data");
//       }
//     };

//     fetchCompanyData();
//   }, [id]); // run when id changes

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const form = e.target;
//     const formData = new FormData();

//     // Append form fields
//     formData.append("name", form.company_name.value);
//     formData.append("email", form.email.value);
//     formData.append("mobile_number", form.mobile_number.value);
//     formData.append("address", form.address.value);
//     formData.append("map", form.map.value);

//     // Append logo file if selected
//     if (form.logo.files[0]) {
//       formData.append("image", form.logo.files[0]);
//     }

//     try {
//       const token = Cookies.get("token");
//       const res = await axios.put(
//         `http://localhost:4000/api/admin/company/update/${id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (res.data._status) {
//         toast.success("Company profile updated successfully");
//         setCompanyData(res.data._data); // refresh form with updated data
//       } else {
//         toast.error(res.data._message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?._message || "Failed to update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="px-6 bg-[#F1F4F5]">
//       <div className="py-5">
//         <h2 className="text-[18px]">Company Profile</h2>
//         <ul className="flex text-[14px] text-[#7693BE]">
//           <li className="text-[blue]">Dashboard / </li>
//           <li> Company Profile</li>
//         </ul>
//       </div>

//       <div className="bg-white p-6 rounded-[6px]">
//         <form onSubmit={handleSubmit} autoComplete="off">
//           <div className="flex gap-5">
//             {/* Logo Upload */}
//             <div className="w-1/3">
//               <label className="block text-md font-medium">Company Logo Image</label>
//               <input
//                 name="image"
//                 type="file"
//                 id="image"
//                 className="dropify"
//                 data-height="250"
//               />

//             </div>

//             {/* Company Info */}
//             <div className="w-2/3">
//               <label className="block text-md font-medium">Company Name</label>
//               <input
//                 type="text"
//                 name="company_name"
//                 className="border-2 rounded-lg w-full p-2"
//                 placeholder="Enter Company Name"
//                 defaultValue={companyData?.name || ""}
//               />

//               <label className="block mt-2 text-md font-medium">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 className="border-2 rounded-lg w-full p-2"
//                 placeholder="Enter Email"
//                 defaultValue={companyData?.email || ""}
//               />

//               <label className="block mt-2 text-md font-medium">Mobile Number</label>
//               <input
//                 type="text"
//                 name="mobile_number"
//                 className="border-2 rounded-lg w-full p-2"
//                 placeholder="Enter Mobile Number"
//                 defaultValue={companyData?.mobile_number || ""}
//               />
//             </div>
//           </div>

//           <div className="my-2">
//             <label className="block font-medium">Address</label>
//             <textarea
//               name="address"
//               rows="3"
//               className="border-2 rounded-lg w-full p-2 resize-none"
//               placeholder="Enter Address"
//               defaultValue={companyData?.address || ""}
//             />
//           </div>

//           <div className="my-2">
//             <label className="block font-medium">Google Map URL</label>
//             <textarea
//               name="map"
//               rows="3"
//               className="border-2 rounded-lg w-full p-2 resize-none"
//               placeholder="Google Map URL"
//               defaultValue={companyData?.google_map_location || ""}
//             />
//           </div>

//           <button
//             type="submit"
//             className="my-5 bg-purple-700 text-white px-6 py-2 rounded-lg"
//             disabled={loading}
//           >
//             {loading ? "Updating..." : "Update Company Profile"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

 // updated new code 
import React, { useEffect, useState } from "react";
import $ from "jquery";
import Cookies from "js-cookie";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function CompanyProfile() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  //FETCH COMPANY DETAILS
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = Cookies.get("token");

        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}company/details/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data._status) {
          setCompanyData(res.data._data);

          // build FULL image URL
          if (res.data._data?.image) {
            setImageUrl(
              `https://finalproject-api-5.onrender.com/uploads/company/${res.data._data.image}`
            );
          }
        } else {
          toast.error(res.data._message);
        }
      } catch (error) {
        toast.error("Failed to fetch company data");
      }
    };

    fetchCompanyData();
  }, [id]);

  //   INIT / RE-INIT DROPIFY SAFELY
  useEffect(() => {
    if (!imageUrl) return;

    const $input = $("#company-logo");

    // destroy old instance if exists
    if ($input.data("dropify")) {
      $input.data("dropify").destroy();
    }

    // set default image
    $input.attr("data-default-file", imageUrl);

    // initialize dropify
    $input.dropify();
  }, [imageUrl]);

  // UPDATE COMPANY PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const formData = new FormData();

    formData.append("name", form.company_name.value);
    formData.append("email", form.email.value);
    formData.append("mobile_number", form.mobile_number.value);
    formData.append("address", form.address.value);
    formData.append("map", form.map.value);

    if (form.image.files[0]) {
      formData.append("image", form.image.files[0]);
    }

    try {
      const token = Cookies.get("token");

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}company/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data._status) {
        toast.success("Company profile updated");

        setCompanyData(res.data._data);

        if (res.data._data?.image) {
          setImageUrl(
            `https://finalproject-api-5.onrender.com/uploads/company/${res.data._data.image}`
          );
        }
      } else {
        toast.error(res.data._message);
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

// UI (UNCHANGED)
  return (
    <div className="px-6 bg-[#F1F4F5]">
      <div className="py-5">
        <h2 className="text-[18px]">Company Profile</h2>
        <ul className="flex text-[14px] text-[#7693BE]">
          <li className="text-[blue]">Dashboard / </li>
          <li> Company Profile</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-[6px]">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="flex flex-wrap sm:flex-nowrap gap-5">
            {/* LOGO */}
            <div className=" w-full sm:w-1/3">
              <label className="block text-md font-medium">
                Company Logo Image
              </label>
              <input
                type="file"
                id="company-logo"
                name="image"
                className="dropify"
                data-height="250"
                accept="image/*"
              />
            </div>

            {/* INFO */}
            <div className="w-full sm:w-2/3">
              <label className="block text-md font-medium">Company Name</label>
              <input
                type="text"
                name="company_name"
                className="border-2 rounded-lg w-full p-2"
                defaultValue={companyData?.name || ""}
              />

              <label className="block mt-2 text-md font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="border-2 rounded-lg w-full p-2"
                defaultValue={companyData?.email || ""}
              />

              <label className="block mt-2 text-md font-medium">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile_number"
                className="border-2 rounded-lg w-full p-2"
                defaultValue={companyData?.mobile_number || ""}
              />
            </div>
          </div>

          <div className="my-2">
            <label className="block font-medium">Address</label>
            <textarea
              name="address"
              rows="3"
              className="border-2 rounded-lg w-full p-2"
              defaultValue={companyData?.address || ""}
            />
          </div>

          <div className="my-2">
            <label className="block font-medium">Google Map URL</label>
            <textarea
              name="map"
              rows="3"
              className="border-2 rounded-lg w-full p-2"
              defaultValue={companyData?.google_map_location || ""}
            />
          </div>

          <button
            type="submit"
            className="my-5 bg-purple-700 text-white px-6 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Company Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}








