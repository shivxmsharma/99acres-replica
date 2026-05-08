"use client";

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const ShortlistContext = createContext();

export function ShortlistProvider({ children }) {
  const [shortlist, setShortlist] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("propertyShortlist");
    if (saved) {
      try {
        setShortlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load shortlist");
      }
    }
  }, []);

  const addToShortlist = (property) => {
    const propertyId = property._id || property.objectID;
    if (shortlist.find((p) => (p._id || p.objectID) === propertyId)) {
      toast.error("Property already in shortlist.");
      return;
    }
    const newList = [...shortlist, property];
    setShortlist(newList);
    localStorage.setItem("propertyShortlist", JSON.stringify(newList));
    toast.success("Added to shortlist");
  };

  const removeFromShortlist = (id) => {
    const newList = shortlist.filter((p) => (p._id || p.objectID) !== id);
    setShortlist(newList);
    localStorage.setItem("propertyShortlist", JSON.stringify(newList));
    toast.success("Removed from shortlist");
  };

  const isShortlisted = (id) => {
    return !!shortlist.find((p) => (p._id || p.objectID) === id);
  };

  const toggleShortlist = (property) => {
    const id = property._id || property.objectID;
    if (isShortlisted(id)) {
      removeFromShortlist(id);
    } else {
      addToShortlist(property);
    }
  };

  return (
    <ShortlistContext.Provider value={{ shortlist, addToShortlist, removeFromShortlist, isShortlisted, toggleShortlist }}>
      {children}
    </ShortlistContext.Provider>
  );
}

export const useShortlist = () => {
  const context = useContext(ShortlistContext);
  if (!context) {
    throw new Error("useShortlist must be used within a ShortlistProvider");
  }
  return context;
};
