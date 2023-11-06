export const getPageTitle = (pathname: string) => {
  // You can implement a logic to map page routes to their titles here
  // For example, you can use a switch statement or an object mapping
  switch (pathname) {

    //feature 9
    case "/membership":
      return "Membership";
    case "/membership/my-privileges":
        return "Privileges";
    // more later...
    default:
      return "Harmoni";
  }
};
