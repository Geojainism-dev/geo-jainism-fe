let preloadPromises = {};

export const loadLanding = () => {
  if (!preloadPromises["/"]) {
    preloadPromises["/"] = import("../pages/Landing");
  }
  return preloadPromises["/"];
};

export const loadTamilJain = () => {
  if (!preloadPromises["/tamil-jain"]) {
    preloadPromises["/tamil-jain"] = import("../pages/TamilJain");
  }
  return preloadPromises["/tamil-jain"];
};

export const loadAbout = () => {
  if (!preloadPromises["/about"]) {
    preloadPromises["/about"] = import("../pages/About");
  }
  return preloadPromises["/about"];
};

export const preloadRoute = (path) => {
  if (path === "/") loadLanding();
  else if (path === "/tamil-jain") loadTamilJain();
  else if (path === "/about") loadAbout();
};
