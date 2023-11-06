import { Box } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import { TextStyle } from "../../theme/TextStyle";
export const NotFoundPage = () => {
	return (
		<Box
			padding={"2em"}
			fontSize={"50px"}
			textAlign={"center"}
			color={"white"}>
			Path Not Found
			<NavLink to="/">
				<Text style={TextStyle.body1}>
					Click here to return to Home Page: path="/"
				</Text>
			</NavLink>
		</Box>
	);
};
