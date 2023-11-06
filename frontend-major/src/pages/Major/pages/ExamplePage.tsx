import { Heading } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import ExampleModel from "../model/Example.model";

const DashboardPage = () => {
	const isMoblie = window.innerWidth < 768;
	const property: ExampleModel = { id: 1, name: "TEE YOD" };

	const renderMoblie = () => {
		return (
			<>
				This is mobile
				<Heading style={TextStyle.h1} color={"white"} paddingLeft={4}>
					{property.name}{" "}
				</Heading>
			</>
		);
	};

	const renderDesktop = () => {
		return <>this is desktop</>;
	};

	return isMoblie ? renderMoblie() : renderDesktop();
};

export default DashboardPage;
