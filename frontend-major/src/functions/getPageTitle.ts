export const getPageTitle = (pathname: string) => {
  // You can implement a logic to map page routes to their titles here
  // For example, you can use a switch statement or an object mapping
  switch (pathname) {
    //feature 9
    case "/":
      return "MOVIES";
    case "/Movie":
      return "MOVIES";
    case "/Cinema":
      return "CINEMAS";
    case "/MovieInfo":
      return "MOVIES";
    // more later...
    default:
      return "Harmoni";
  }
};
