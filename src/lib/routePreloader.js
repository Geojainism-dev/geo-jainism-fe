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

export const loadVirasat = () => {
  if (!preloadPromises["/virasat"]) {
    preloadPromises["/virasat"] = import("../pages/Virasat");
  }
  return preloadPromises["/virasat"];
};

export const loadShop = () => {
  if (!preloadPromises["/shop"]) {
    preloadPromises["/shop"] = import("../pages/Shop/ShopApp");
  }
  return preloadPromises["/shop"];
};

export const preloadRoute = (path) => {
  if (path === "/") loadLanding();
  else if (path === "/tamil-jain") loadTamilJain();
  else if (path === "/about") loadAbout();
  else if (path === "/virasat") loadVirasat();
  else if (path === "/shop") loadShop();
};
