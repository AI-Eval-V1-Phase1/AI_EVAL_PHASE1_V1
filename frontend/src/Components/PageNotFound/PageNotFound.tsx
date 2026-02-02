// import React from "react";
import { NavLink } from "react-router-dom";
import "./pagenotfound.css";
import PageNotFoundImg from "../../assets/pageNotFound.svg";

const PageNotFound = () => {
  return (
    <div className="page-not">
      <div>
        <div className="image_sections">
          <img src={PageNotFoundImg} alt="" />
        </div>
        <div className="page_not_found">
          <h2>404 Error - Page Not Found</h2>
        </div>
        <p className="goBack">
          Go Back to<NavLink to="/login"> Home</NavLink>
        </p>
      </div>
    </div>
  );
};

export default PageNotFound;
