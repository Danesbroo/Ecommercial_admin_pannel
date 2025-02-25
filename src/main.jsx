import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./Home.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./Pages/Dashboard.jsx";
import Login from "./Pages/LoginAuth/Login.jsx";
import Profile from "./Pages/Profile.jsx";
import AddColor from "./Pages/Color/AddColor.jsx";
import ViewColor from "./Pages/Color/ViewColor.jsx";
import SizeDetails from "./Pages/Size/SizeDetails.jsx";
import ViewSize from "./Pages/Size/ViewSize.jsx";
import AddCategory from "./Pages/Parent_Category/AddCategory.jsx";
import ViewCategory from "./Pages/Parent_Category/ViewCategory.jsx";
import AddSubCategory from "./Pages/Sub Category/AddSubCategory.jsx";
import ViewSubCategory from "./Pages/Sub Category/ViewSubCategory.jsx";
import ProductDetails from "./Pages/Product/ProductDetails.jsx";
import ProductItems from "./Pages/Product/ProductItems.jsx";
import StoryDetails from "./Pages/Story/StoryDetails.jsx";
import StoryView from "./Pages/Story/StoryView.jsx";
import Orders from "./Pages/Orders/Orders.jsx";
import SliderDetails from "./Pages/Slider/SliderDetails.jsx";
import SliderView from "./Pages/Slider/SliderView.jsx";
import RootLayout from "./layout/RootLayout.jsx";



const route = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/" element={<RootLayout />}>
        <Route path="home" element={<Home />} />
      </Route>
      <Route element={<RootLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="colors">
          <Route path="add-color" element={<AddColor />}></Route>
          <Route path="view-color" element={<ViewColor />}></Route>
        </Route>
        <Route path="size">
          <Route path="size-details" element={<SizeDetails />}></Route>
          <Route path="view-size" element={<ViewSize />}></Route>
        </Route>


        <Route path="category">
          <Route path="add" element={<AddCategory />}></Route>
          <Route path="update/:id?" element={<AddCategory />}></Route>
          <Route path="view" element={<ViewCategory />}></Route>
        </Route>
        
        
        <Route path="category/sub-category">
          <Route path="add" element={<AddSubCategory />}></Route>
          <Route path="update/:id?" element={<AddSubCategory />}></Route>
          <Route path="view" element={<ViewSubCategory />}></Route>
        </Route>


        <Route path="category">
          <Route path="add" element={<AddSubCategory />}></Route>
          <Route path="update/:id?" element={<AddSubCategory />}></Route>
          <Route path="view" element={<ViewSubCategory />}></Route>
        </Route>
        <Route path="product">
          <Route path="product-details" element={<ProductDetails />}></Route>
          <Route path="product-items" element={<ProductItems />}></Route>
        </Route>
        <Route path="story">
          <Route path="story-details" element={<StoryDetails />}></Route>
          <Route path="story-view" element={<StoryView />}></Route>
        </Route>
        <Route path="orders">
          <Route path="orders" element={<Orders />}></Route>
        </Route>
        <Route path="slider">
          <Route path="slider-details" element={<SliderDetails />}></Route>
          <Route path="slider-view" element={<SliderView />}></Route>
        </Route>
      </Route>
    </>
  )
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={route}></RouterProvider>
  </StrictMode>
);
