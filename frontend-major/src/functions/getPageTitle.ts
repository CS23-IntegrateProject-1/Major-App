export const getPageTitle = (pathname: string) => {
  // You can implement a logic to map page routes to their titles here
  // For example, you can use a switch statement or an object mapping
  switch (pathname) {

    //feature 9
    case "/Movie" :
      return "MOVIES";
    case "/Cinema":
        return "CINEMAS";
    // more later...
    default:
      return "Harmoni";
  }
};
