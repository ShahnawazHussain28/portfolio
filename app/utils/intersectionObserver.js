"use client";

// return null if intersectionobserver is not defined

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    } else {
      entry.target.classList.remove("show");
    }
  });
});

export default observer;
