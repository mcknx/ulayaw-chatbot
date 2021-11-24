import React, { useState, useEffect, useContext } from "react";
import { GetLocationContext } from "../Context/GetLocationContext";
import Cookies from "universal-cookie";

const useGeoLocation = () => {
  const cookies = new Cookies();
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
  });
  const { getLocation, setGetLocation } = useContext(GetLocationContext);

  const onSuccess = (position) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
    });
    setGetLocation(true);
    // cookies.set("locationCookie", true, { path: "/" });

    // setGetLocation({
    //   loaded: true,
    //   coordinates: {
    //     lat: location.coords.latitude,
    //     lng: location.coords.longitude,
    //   },
    // });
  };

  const onError = (error) => {
    setLocation({
      loaded: true,
      error: {
        code: error.code,
        message: error.message,
      },
    });
    if (error.code === 1) {
      setGetLocation(false);
      //   cookies.set("locationCookie", false, { path: "/" });
    }
    // setGetLocation({
    //   loaded: true,
    //   error: {
    //     code: error.code,
    //     message: error.message,
    //   },
    // });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
    }
    // if (navigator.geolocation) {
    //   navigator.geolocation.watchPosition(onSuccess, onError);
    // } else {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    // }
  }, []);
  //   console.log(location);
  return location;
};

export default useGeoLocation;
