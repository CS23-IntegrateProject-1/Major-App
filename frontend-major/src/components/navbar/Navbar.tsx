import {
  Box,
  Flex,
  // Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon,ArrowBackIcon } from "@chakra-ui/icons";
import { NavbarContent } from "./NavbarContent";
import { useLocation } from "react-router-dom";
import { getPageTitle } from "../../functions/getPageTitle";

export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const handleOpenNav = () => {
    onOpen();
  };
  return (
    <Flex
      justifyContent={"space-between"}
      alignItems={"center"}
      height="70px"
      padding={"1em"}
      bg={"brand.400"}
      shadow={"md"}
    >
      {location.pathname === "/" ? (
        <Box width={"40px"} height={"40px"} visibility={"hidden"}></Box>
      ) : (
        <IconButton
          aria-label="Notification Page"
          variant={"unstyled"}
          icon={
            <ArrowBackIcon
              width={"24px"}
              height={"24px"}
              // onClick={handleOpenNav}
            />
          }
        />
      )}

      <Box color="white">{pageTitle}</Box>
      <IconButton
        aria-label="Notification Page"
        variant={"unstyled"}
        icon={
          <HamburgerIcon
            width={"24px"}
            height={"24px"}
            color={"white"}
            onClick={handleOpenNav}
          />
        }
      />

      <Box position={"absolute"} top={"0"} left={"0"}>
        <NavbarContent isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      </Box>
    </Flex>
  );
};
