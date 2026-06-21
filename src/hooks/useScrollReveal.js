import { useEffect } from "react";

export const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    const observeElements = (root) => {
      if (!root) return;
      
      // If the root element matches any of the reveal classes, observe it
      if (root.classList && (
        root.classList.contains("reveal") || 
        root.classList.contains("reveal-left") || 
        root.classList.contains("reveal-right")
      )) {
        observer.observe(root);
      }

      // Also search and observe children
      if (root.querySelectorAll) {
        root.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => {
          observer.observe(el);
        });
      }
    };

    // Observe initial elements in the DOM
    observeElements(document.body);

    // Watch for dynamically added lazy loaded elements
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            observeElements(node);
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};
