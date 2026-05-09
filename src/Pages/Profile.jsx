import React, { useEffect, useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { IoPhonePortrait } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie"; // ensure js-cookie installed
import { jwtDecode } from "jwt-decode";


export default function Profile() {
  // ✅ refresh flag
  const [refreshProfile, setRefreshProfile] = useState(false);
  let [Profile, setProfile] = useState('');
  let [imagePath, setImagePath] = useState('')

  const [activeTab, setActiveTab] = useState("editProfile");

  useEffect(() => {
    const token = Cookies.get("token");

    axios.post(
      `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_VIEW_PROFILE}`, {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // token send to header 
        },
      }
    )
      .then((success) => {
        if (success.data._status === true) {
          console.log(success.data);
          setImagePath(success.data._image_path);
          setProfile(success.data._data);
        } else {
          toast.error(success.data._message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?._message || "Something went wrong!");
      });
  }, [refreshProfile]);


  // token expiration check and logout
  useEffect(() => {
    // 1️⃣ Get token from cookies
    const token = Cookies.get("token");

    // 2️⃣ If token does not exist → go to login
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      // 3️⃣ Decode token
      const decoded = jwtDecode(token);

      // 4️⃣ Calculate token expiry time
      const tokenExpireTime = decoded.exp * 1000; // convert to ms
      const currentTime = Date.now();

      // 5️⃣ If token already expired
      if (tokenExpireTime < currentTime) {
        Cookies.remove("token");

        toast.error("Session expired. Please login again.");

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);

        return;
      }

      // 6️⃣ Auto logout when token expires
      const remainingTime = tokenExpireTime - currentTime;

      const logoutTimer = setTimeout(() => {
        Cookies.remove("token");

        toast.error("Session expired. Please login again.");

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }, remainingTime);

      // 7️⃣ Cleanup timer
      return () => clearTimeout(logoutTimer);

    } catch (error) {
      // 8️⃣ Invalid token
      Cookies.remove("token");
      window.location.href = "/";
    }
  }, []);


  useEffect(() => {
    $(".dropify").dropify({
      messages: {
        default: "Profile ",
        replace: "Drag and drop ",
        remove: "Remove",
        error: "Oops, something went wrong"
      }
    });
  }, [activeTab]);

  const updateProfile = (event) => {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData();
    formData.append("name", form.name.value);
    formData.append("email", form.email.value);
    formData.append("mobile_number", form.mobile_number.value);
    formData.append("address", form.address.value);

    if (form.image.files[0]) {
      formData.append("image", form.image.files[0]); //  MUST
    }

    const token = Cookies.get("token");

    axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_UPDATE_PROFILE}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type manually नलेख्नु
        },
      }
    )
      .then((success) => {
        if (success.data._status) {
          toast.success("Profile updated successfully");
          setRefreshProfile(prev => !prev);
          form.reset();
        } else {
          toast.error(success.data._message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?._message || error.message);
      });
  };


  // change password
  const change_password = (event) => {
    event.preventDefault(); // ✅ event preventDefault गर्नु पर्छ

    const form = event.target;
    const finaldata = {
      current_password: form.current_password.value,
      new_password: form.new_password.value,
      confirm_password: form.confirm_password.value,
    };

    const token = Cookies.get("token");

    axios.post(
      `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_CHANGE_PASSWORD}`,
      finaldata,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
      .then((success) => {
        if (success.data._status === true) {
          toast.success(success.data._message);
          form.reset(); // form clear
        } else {
          toast.error(success.data._message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?._message || "Something went wrong!");
      });
  };
  return (
    <div className="bg-[#F1F4F5]">
      <Breadcrumb path={"Profile"} />

      <div className="w-full px-6 grid grid-cols-[30%_auto] gap-[10px] py-[20px]">
        <div className="bg-white  self-start  rounded-lg shadow-md">
          <div className="py-[40px] text-center">
            <img
              className="w-[80px] h-[80px] mx-auto rounded-full"
              src={imagePath + Profile.image}
              alt="Profile"
            />
            <h5 className="pt-[6px]">Admin</h5>
          </div>
          <div className="bg-[#F6F9FD] p-[20px]  rounded-lg shadow-md">
            <h4 className="py-[8px] font-bold">Contact Information</h4>
            <p className="flex items-center gap-[8px] py-[6px]">
              <IoPhonePortrait /> {Profile.mobile_number}
            </p>
            <p className="flex items-center gap-[8px] py-[6px]">
              <MdEmail /> {Profile.email}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Tabs */}
          <div className="flex border-b border-gray-300 mb-4">
            <button
              className={`px-6 py-2 text-lg font-medium ${activeTab === "editProfile"
                ? "border-b-4 border-purple-700 text-purple-700"
                : "text-gray-600"
                }`}
              onClick={() => setActiveTab("editProfile")}
            >
              Edit Profile
            </button>
            <button
              onClick={() => { setActiveTab("changePassword") }}
              className={`px-6 py-2 text-lg font-medium ${activeTab === "changePassword"
                ?
                "border-b-4 border-purple-700 text-purple-700"
                :
                "text-gray-600"
                }`}
            >
              Change Password
            </button>
          </div>

          {/* Edit Profile Form onSubmit={handleSubmit(onSubmit)}  */}
          {activeTab === "editProfile" && (
            <form onSubmit={updateProfile} className="p-3">
              <div className="flex gap-5">
                <div className="w-1/3">
                  <label className="block  text-md font-medium text-gray-900">
                    Choose Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="dropify"
                    data-height="236"
                  />
                </div>
                <div className="w-2/3">
                  <div className="mb-5">
                    <label className="block  text-md font-medium text-gray-900">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="border-2 shadow-sm border-gray-300 text-gray-900 rounded-lg w-full py-2.5 px-3"
                      placeholder="Name"
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block  text-md font-medium text-gray-900">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="border-2 shadow-sm border-gray-300 text-gray-900 rounded-lg w-full py-2.5 px-3"
                      placeholder="Email"
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block  text-md font-medium text-gray-900">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile_number"
                      className="border-2 shadow-sm border-gray-300 text-gray-900 rounded-lg w-full py-2.5 px-3"
                      placeholder="Number"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block  text-md font-medium text-gray-900">Address</label>
                    <input
                      type="address"
                      name="address"
                      className="border-2 shadow-sm border-gray-300 text-gray-900 rounded-lg w-full py-2.5 px-3"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="my-5 text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg px-5 py-2.5"
              >
                Update Profile
              </button>
            </form>
          )}

          {/* Change Password Form */}
          {activeTab === "changePassword" && (
            <form onSubmit={change_password} className="p-3">
              <div className="mb-5">
                <label className="block text-md font-medium text-gray-900">
                  Current Password
                </label>
                <input
                  name="current_password"
                  type="password"
                  // {...register("currentPassword", { required: "Current Password is required" })}
                  className="border-2 shadow-sm border-gray-300 text-gray-900 rounded-lg w-full py-2.5 px-3"
                  placeholder="Current Password"
                />
              </div>

              <div className="mb-5">
                <label className="block text-md font-medium text-gray-900">
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  className="border-2 shadow-sm border-gray-300 text-gray-900 rounded-lg w-full py-2.5 px-3"
                  placeholder="New Password"
                />
              </div>
              <div className="mb-5">
                <label className="block text-md font-medium text-gray-900">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  className="border-2 shadow-sm border-gray-300 text-gray-900 rounded-lg w-full py-2.5 px-3"
                  placeholder="Confirm Password"
                />
              </div>
              <button
                type="submit"
                className="my-5 text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg px-5 py-2.5"
              >
                Change Password
              </button>
            </form>
          )}

        </div>
      </div>
    </div >
  );
}
