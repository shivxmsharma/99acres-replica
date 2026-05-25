"use client";

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("compareList");
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load compare list");
      }
    }
  }, []);

  const addToCompare = (property) => {
    if (compareList.length >= 4) {
      toast.error("You can compare up to 4 properties at a time.");
      return;
    }
    const propertyId = property._id || property.objectID;
    if (compareList.find((p) => (p._id || p.objectID) === propertyId)) {
      toast.error("Property already in comparison list.");
      return;
    }
    const newList = [...compareList, property];
    setCompareList(newList);
    localStorage.setItem("compareList", JSON.stringify(newList));
    toast.success("Added to comparison list");
  };

  const removeFromCompare = (id) => {
    const newList = compareList.filter((p) => (p._id || p.objectID) !== id);
    setCompareList(newList);
    localStorage.setItem("compareList", JSON.stringify(newList));
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem("compareList");
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);
