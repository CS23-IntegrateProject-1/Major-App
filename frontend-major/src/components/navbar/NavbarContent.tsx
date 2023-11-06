import { Box, Flex, IconButton, Stack, Slide } from "@chakra-ui/react";
import { FC } from "react";
import { CloseIcon, BellIcon, SettingsIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";

interface NavbarContentProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const NavbarContent: FC<NavbarContentProps> = ({
  isOpen,
  // onOpen,
  onClose,
}) => {
  const handleLinkClick = () => {
    onClose();
  };
  const links = [
    { title: "Home", to: "/" },
    {
      title: "Reservation",
      to: "/",
    },
    {
      title: "Save Places",
      to: "/",
    },
    {
      title: "Promotion",
      to: "/",
    },
    {
      title: "Membership",
      to: "/",
    },
  ];
  return (
    <Slide direction="top" in={isOpen} unmountOnExit style={{ zIndex: 10 }}>
      <Box
        display={isOpen ? "flex" : "none"}
        flexDir={"column"}
        justifyContent={"space-around"}
        alignItems={"center"}
        width={"100vw"}
        height={"100vh"}
        padding={"32px"}
        background={"black"}
        transition={"height 0.5s ease-in-out"}
      >
        <IconButton
          aria-label="Close Navigation Bar"
          variant={"unstyled"}
          alignSelf={"flex-end"}
          onClick={onClose}
          icon={<CloseIcon boxSize={6} color="white" />}
        />
        <Stack
          width={"100%"}
          spacing={"16px"}
          justify={"center"}
          align={"center"}
          textAlign={"center"}
        >
          {links.map((link, index) => (
            <NavLink to={link.to} onClick={handleLinkClick} key={index}>
              <Flex align={"center"} p={"16px 32px"} color={"white"}>
                {link.title}
              </Flex>
            </NavLink>
          ))}

          <IconButton
            aria-label="Notification Page"
            variant={"unstyled"}
            icon={<BellIcon boxSize={8} color={"white"} />}
          />
        </Stack>
        <IconButton
          aria-label="Setting Page"
          variant={"unstyled"}
          icon={
            <SettingsIcon alignSelf={"flex-end"} boxSize={6} color={"white"} />
          }
        />
      </Box>
    </Slide>
  );
};
