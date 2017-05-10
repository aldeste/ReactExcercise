// @flow
import React from "react";
import Loadable from "react-loadable";
import { Map, type Map as ImmutableMap } from "immutable";
import { Wrapper, Text } from "./Tags";
import DocumentTitle from "./Document/Title";

type MessageEventWithOptions = {
  ...MessageEvent,
  data: { type: string, data: string }
};

type State = {
  signedIn: ImmutableMap<string, ImmutableMap<string, string>>
};

const LoadingComponent = ({ isLoading, error, pastDelay }) => {
  if (isLoading) {
    return pastDelay ? <div>Loading...</div> : null; // Don't flash "Loading..." when we don't need to.
  }
  if (error) {
    return <div>Error! Component failed to load</div>;
  }
  return null;
};

const AsyncWelcome = Loadable({
  loader: () => import("./Welcome/Welcome"),
  LoadingComponent,
  // optional config...
  delay: 200
});

const AsyncLogin = Loadable({
  loader: () => import("./Login/Login"),
  LoadingComponent,
  // optional config...
  delay: 200
});

const AsyncPing = Loadable({
  loader: () => import("./PingTest/Ping"),
  LoadingComponent,
  // optional config...
  delay: 200
});

class App extends React.Component<*, State, *> {
  state = {
    signedIn: Map()
  };

  connectUser = async (token: string) => {
    const response: Object = await fetch("/api/graphql", {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept-Encoding": "gzip",
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/graphql"
      },
      mode: "cors",
      cache: "default",
      body: `{
        person(id: "${token}") {
          name
          token
          personId
          id
        }
      }`
    }).then(response => response.json());
    const UserBases: Array<string> = ["StarWars", "StarWarsCharacters"];

    if (!response.error && response.data && response.data.person) {
      UserBases.forEach(userBase => {
        this.setState(() => ({
          signedIn: this.state.signedIn.set(userBase, Map(response.data.person))
        }));
      });
    }

    return response;
  };

  receiveMessage = (event: MessageEventWithOptions): boolean => {
    const { origin, data: { type, data } } = event;
    if (
      origin === "http://localhost:4000" &&
      type === "AuthVerificationConnection"
    ) {
      typeof data.token === "string" && this.connectUser(data.token);
      return true;
    }

    return false;
  };

  handleLogin = (formName: string): Function => (props: Object): void => {
    this.setState(() => ({
      signedIn: this.state.signedIn.set(formName, Map(props))
    }));
  };

  handleLogOut = (logoutName: string): Function => (
    event: SyntheticEvent
  ): void => {
    this.setState(() => ({
      signedIn: this.state.signedIn.remove(logoutName)
    }));
  };

  componentDidMount() {
    window && window.addEventListener("message", this.receiveMessage, false);
  }

  shouldComponentUpdate(nextState: State) {
    return this.state.signedIn !== nextState.signedIn;
  }

  render() {
    const UserBases: Array<string> = ["StarWars", "StarWarsCharacters"];
    const { signedIn } = this.state;
    const token: number = Math.ceil(Math.random() * 50);

    return (
      <Wrapper>
        <DocumentTitle>This is a demo page</DocumentTitle>
        {UserBases.some(userBase => signedIn.has(userBase)) &&
          <Text>{JSON.stringify(signedIn, null, 2)}</Text>}
        <AsyncPing token={token} />
        {UserBases.map(
          part =>
            signedIn.has(part)
              ? <AsyncWelcome
                  key={part}
                  title={`${part.replace(/([a-z])([A-Z])/g, "$1 $2")} user logged in!`}
                  username={signedIn.getIn([part, "name"])}
                  onLogoutSubmit={this.handleLogOut(part)}
                />
              : <AsyncLogin
                  key={part}
                  title={`${part.replace(/([a-z])([A-Z])/g, "$1 $2")} login`}
                  onLoginSubmit={this.handleLogin(part)}
                />
        )}
      </Wrapper>
    );
  }
}

export default App;
