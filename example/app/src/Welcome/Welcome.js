// @flow
import React from "react";
import { View, Title, Button, Text } from "../Tags";
import LoadAsync from "../LoadAsync/LoadAsync";

const About = LoadAsync({ loader: () => import("../About/About") });

type Props = {
  title: string,
  username: string,
  onLogoutSubmit: Function
};

export default function Welcome(props: Props): React$Element<*> {
  return (
    <View>
      <Title>{props.title}</Title>
      <Text>Here's some private information about you</Text>
      <About />
      <Text>
        You can log out and try another user by clicking the log out button
      </Text>
      <Button alternative onClick={props.onLogoutSubmit}>Log out</Button>
    </View>
  );
}
